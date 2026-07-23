# Plan: 优化聚合接口响应质量与流式支持

## 1. 摘要 (Summary)
针对用户反馈的 Trae 对话“智障”及回复不完整问题，本方案旨在将当前的“伪流式”转发升级为“真流式”代理，并修复数据转发过程中的潜在损耗，确保模型回复的完整性和思考过程（Reasoning）的可见性。

## 2. 当前状态分析 (Current State Analysis)
- **伪流式瓶颈**：网关目前先获取完整 JSON 再包装成单条 SSE 发送，导致首字延迟（TTFT）极高，Trae 界面可能因长时间无响应而显示异常。
- **数据丢失**：转发逻辑仅提取 `content`，丢弃了 DeepSeek 关键的 `reasoning_content`，导致回复内容显得单薄或逻辑不连贯。
- **消息篡改风险**：`stripStreamField` 使用 `map[string]interface{}` 进行重序列化，可能破坏消息顺序或导致大整数精度丢失。
- **网络连接不稳定**：日志中出现 `tls: bad record MAC`，说明与上游供应商的连接存在异常，需要增强错误重试逻辑。

## 3. 拟议变更 (Proposed Changes)

### 后端：Router Service (流式接口改造)
- **文件**: [router_service.go](file:///Users/fuxiansheng/Desktop/AI%20Gateway/aigateway/backend/internal/service/router_service.go)
- **变更**: 
    - 修改 `CallProvider` 返回 `*http.Response`，允许调用方直接处理 `Body` 流。
    - 在 `CallWithFallback` 中实现对流式请求的重试逻辑：如果首个供应商连接失败，立即切换下一个，直到成功建立流。

### 后端：Chat Controller (真流式代理实现)
- **文件**: [chat_controller.go](file:///Users/fuxiansheng/Desktop/AI%20Gateway/aigateway/backend/internal/controller/chat_controller.go)
- **变更**: 
    - **真流式透传**: 如果客户端请求 `stream: true`，网关将直接透传上游供应商返回的 `text/event-stream` 内容，不再进行二次包装。
    - **Token 统计优化**: 在流式转发过程中，通过简单的字符串匹配或轻量解析累计 `usage` 信息，确保异步日志记录准确。
    - **请求体透传**: 移除 `stripStreamField` 中的 JSON 反序列化操作，直接使用原始 Bytes 转发，仅在必要时通过字节替换修改 `stream` 字段。

### 稳定性增强
- **文件**: [router_service.go](file:///Users/fuxiansheng/Desktop/AI%20Gateway/aigateway/backend/internal/service/router_service.go)
- **变更**: 增加对 `tls: bad record MAC` 等网络错误的识别，触发更积极的 Fallback 机制。

## 4. 验证计划 (Verification Plan)
- **实时性验证**: 使用 `curl -i -N` 调用接口，确认是否能看到实时滚动的 `data: ` 数据块（打字机效果）。
- **内容完整性验证**: 在 Trae 中询问需要深度思考的问题，确认是否能看到 DeepSeek 的思考过程或逻辑严密的回复。
- **压力与重试测试**: 人为制造供应商故障，验证网关是否能平滑切换到备用供应商而不中断客户端连接。
