# QA 测试报告 — P1 Iteration #006（模型接入协议支持 Anthropic）

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.0 |
| 状态 | **Conditional PASS**（真实端点 2/2 打通，Kimi/DeepSeek Key 待生产补配） |
| Owner | QA Engineer |
| 日期 | 2026-08-11 |
| 测试对象 | backend `chat_adapter.go` / `router_service.go` / `chat_controller.go` / Provider 全链路 + 前端 |
| 关联文档 | [P1-Iteration-006-Anthropic-Protocol.md](../../.trae/documents/P1-Iteration-006-Anthropic-Protocol.md) |

---

## 1. 测试范围

| # | 场景 | 覆盖点 |
|:-:|------|--------|
| 1 | OAI 入站 → Anthropic Provider（非流式） | 请求转换（system 拆分/max_tokens 缺省 4096）、出站头（x-api-key + anthropic-version）、响应转回 OpenAI、usage 计费 |
| 2 | Anthropic 入站 → OpenAI Provider（非流式） | 请求转换（system 折叠/tools）、出站头（Bearer）、响应转回 Anthropic、usage 计费 |
| 3 | OAI 入站 → Anthropic Provider（流式 SSE） | Anthropic SSE → OpenAI chunk、末尾 usage 注入、[DONE] |
| 4 | Anthropic 入站 → OpenAI Provider（流式 SSE） | OpenAI chunk → Anthropic 事件、content_block index 一致性、message_stop |
| 5 | OAI 入站 → Anthropic Provider 4xx | Anthropic 错误体 → OpenAI 错误格式 |
| 6 | Anthropic 入站 → OpenAI Provider 4xx | OpenAI 错误体 → Anthropic 错误格式 |
| 7 | 认证与参数校验 | 缺失认证头 AUTH001、Anthropic 端点 max_tokens 必填 |
| 8 | 真实厂商 Anthropic 端点 | 智谱 GLM-5.2 / 千问 qwen3.7-plus / DeepSeek / Kimi 官方端点连通性 |

---

## 2. 测试方式

- **场景 1~7（mock 集成测试）**：`httptest` mock Anthropic/OpenAI 协议 Provider + 内存 Repository 组装完整依赖链（同 gateway main.go memory 分支），通过真实 HTTP 请求端到端验证。
  - 用例文件：[chat_anthropic_integration_test.go](../../backend/internal/controller/chat_anthropic_integration_test.go)（7 个用例）
- **场景 8（真实端点）**：curl 直接调用 4 家厂商官方 Anthropic 兼容端点（x-api-key / Bearer 认证）。

---

## 3. 测试结果

### 3.1 集成测试（mock）— 全部通过

| 用例 | 结果 | 关键断言 |
|------|:----:|----------|
| `TestQA_OpenAIIn_AnthropicOut_NonStream` | ✅ | 内容转换正确；出站 `x-api-key`/`anthropic-version` 头；`system` 拆分；`max_tokens=4096`；usage 10/20 入账 |
| `TestQA_AnthropicIn_OpenAIOut_NonStream` | ✅ | 响应转 Anthropic message；出站 `Bearer` 头；`system` 折叠为 system 消息；usage 5/7 |
| `TestQA_OpenAIIn_AnthropicOut_Stream` | ✅ | 流式文本拼接 `Hi from ANT`；末尾 usage 11/6；`[DONE]` 收尾 |
| `TestQA_AnthropicIn_OpenAIOut_Stream` | ✅ | Anthropic 事件序列；`content_block_start/delta/stop` index 一致；usage 8/4；`message_stop` |
| `TestQA_OpenAIIn_AnthropicOut_4xx` | ✅ | 429 + OpenAI 错误格式 `{error:{message}}` |
| `TestQA_AnthropicIn_OpenAIOut_4xx` | ✅ | 429 + Anthropic 错误格式 `{type:error,error:{}}` |
| `TestQA_AuthAndValidation` | ✅ | 缺失认证头 401 AUTH001；缺 max_tokens 400 |

### 3.2 真实端点（2026-08-11 实测）

| 厂商 | 端点 | Key 状态 | 结果 |
|------|------|:--------:|------|
| **智谱 GLM-5.2** | `open.bigmodel.cn/api/anthropic/v1/messages` | ✅ 有效 | **HTTP 200**，返回标准 Anthropic message（usage 8/11） |
| **千问 qwen3.7-plus** | `dashscope.aliyuncs.com/apps/anthropic/v1/messages` | ✅ 有效 | **HTTP 200**，返回 Anthropic message（含 thinking 块） |
| DeepSeek v4-pro | `api.deepseek.com/anthropic/v1/messages` | ❌ Key 失效 | HTTP 401 `authentication_error`（端点与协议正确，Key 过期） |
| Kimi k3 | `api.moonshot.ai/anthropic/v1/messages` | ❌ Key 失效 | HTTP 401 `invalid_authentication_error`（端点与协议正确，Key 过期） |

---

## 4. 通过标准与结论

### 功能验收

- [x] OAI 入站经 Anthropic Provider 返回 OpenAI 格式正确响应
- [x] Anthropic 入站经 OpenAI Provider 返回 Anthropic 格式正确响应
- [x] 流式 SSE 双向转换正确，末尾 usage 计费不遗漏
- [x] tools / Function Calling 双向转换（单测 + 集成用例覆盖）
- [x] Provider 4xx 错误体跨协议格式转换正确
- [x] 认证兼容 x-api-key / Bearer；参数校验完整
- [x] 真实厂商端点协议格式验证通过（智谱、千问）

### 回归

- [x] `go vet ./...`、`go build ./...`、`go test ./...` 全量通过
- [x] 原有 5 Provider OpenAI 兼容链路零回归（controller 既有测试 + 冒烟）

---

## 5. 已知限制与待办

1. **Kimi / DeepSeek 生产 Key 失效**：需在 Admin 后台更新为有效 Key 后，做真实端到端回归（尤其 Kimi 的 `auth_type=bearer` 路径）。
2. **MiniMax 未实测**：项目内未配置 MiniMax Key，其官方 Anthropic 端点 `api.minimaxi.com/anthropic` 协议格式已按文档实现，待生产补 Key 验证。
3. **流式真实端点**：mock 已验证双向流式转换；建议生产环境对智谱/千问流式做一次真实 SSE 回归。

---

## 6. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-08-11 | v1.0 | 初始测试报告 |

---

# End
