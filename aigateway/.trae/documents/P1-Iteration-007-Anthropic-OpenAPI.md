# P1 Iteration #007 — Anthropic 对外接口 SDK 开箱即用

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.1 |
| 状态 | **Approved（CEO 已决策）** |
| Owner | AI Project Manager |
| 日期 | 2026-08-11 |
| 轨道 | **完整轨**（跨模块改动：错误码契约 / 模型列表 / 新端点 / 文档 / SDK 验证） |
| 优先级 | P1 |
| 前置 | P1 Iteration #006（已上线 `POST /v1/messages`，双向协议转换/流式/tools 就绪） |

## 0. CEO 决策记录（2026-08-11）

| # | 决策点 | 结论 |
|:-:|--------|------|
| 1 | count_tokens 端点 | 网关内置**估算实现**（字符估算，计费仍以实际 usage 为准） |
| 2 | 错误码标准化 | **接受** Anthropic 入站错误 type 改为标准码（发布说明注明） |
| 3 | SDK 端到端验证 | **本地先验再部署**（本地 gateway + 智谱真实 key 实测，通过后部署生产） |

---

## 1. 需求概述

平台已通过 #006 开放 Anthropic 兼容端点 `POST /v1/messages`。本次迭代目标：**让 Anthropic 官方 SDK（Python / JS）仅改 `base_url` + `api_key` 即可开箱即用**，补齐以下差距：

1. **错误码标准化**：`/v1/messages` 错误响应使用 Anthropic 标准错误类型与 HTTP 状态码映射
2. **模型发现兼容**：`GET /v1/models` 支持 Anthropic 格式（Claude Code / Claude Desktop 自动发现）
3. **count_tokens 端点**：新增 `POST /v1/messages/count_tokens`
4. **对外文档更新**：门户文档中心 / FAQ 增加 Anthropic 接入说明与示例

**验收方式**：真实 Anthropic SDK（Python `anthropic` / Node `@anthropic-ai/sdk`）实测。

---

## 2. 现状与差距分析

| 能力 | Anthropic 官方规范 | 现状 | 差距 |
|------|-------------------|------|------|
| `POST /v1/messages`（流式/tools） | ✅ | ✅ 已上线 | 无 |
| 认证 `x-api-key` / `anthropic-version` | ✅ | ✅ | 无 |
| 错误响应 | `{"type":"error","error":{"type":"<std_type>","message":"..."}}` | ⚠️ 有格式但 type 用内部码（AUTH002/QUOTA_EXCEEDED 等） | **需标准化** |
| HTTP 状态码 | 401/402/403/404/429/500 语义化 | ⚠️ 部分对齐（402 已用于额度） | 需复核 |
| `GET /v1/models` | `{"data":[{"type":"model","id":...,"display_name":...}]}` | ⚠️ OpenAI 格式 `{object,data:[{id,object,created,owned_by}]}` | **需兼容** |
| `POST /v1/messages/count_tokens` | `{"input_tokens":N}` | ❌ 未实现 | **需新增** |
| 对外文档 | — | ❌ 门户仅宣传 OpenAI 兼容 | **需更新** |

---

## 3. 方案设计

### 3.1 错误码标准化（Anthropic 标准错误类型映射）

Anthropic 标准错误类型：`invalid_request_error` / `authentication_error` / `permission_error` / `not_found_error` / `rate_limit_error` / `overloaded_error` / `api_error` / `insufficient_quota`（402）。

映射规则（仅 Anthropic 入站 `/v1/messages` 生效，OpenAI 入站保持现有错误码不变）：

| 现有内部码 | HTTP | Anthropic 错误类型 | 场景 |
|-----------|:----:|--------------------|------|
| AUTH001 / AUTH002 | 401 | `authentication_error` | 缺失/无效 API Key |
| AUTH004（key disabled）| 403 | `permission_error` | Key 被禁用 |
| MODEL_FORBIDDEN | 403 | `permission_error` | 模型未授权 |
| QUOTA_EXCEEDED | 402 | `insufficient_quota` | 额度不足 |
| VALID001（model 缺失等）| 400 | `invalid_request_error` | 参数错误 |
| model not found | 404 | `not_found_error` | 模型不存在 |
| ROUTER001（无可用 Provider）| 503 | `overloaded_error` | 服务暂不可用 |
| GATEWAY001 | 502 | `api_error` | 上游失败 |
| Provider 4xx 透传 | 保留 | 转换 type 为 Anthropic 标准 | 见 #006 ConvertErrorBody 扩展 |

**实现**：`writeChatError` 在 Anthropic 入站时增加内部码 → Anthropic 标准类型映射；`ConvertErrorBody` 的错误 type 也做标准化映射。

### 3.2 模型发现兼容（GET /v1/models）

`Anthropic SDK`（models.list）与 `Claude Code` 自动发现均调用 `GET /v1/models`，与 OpenAI SDK 同路径。无法按路径区分 → 采用**字段超集**方案，两套 SDK 均可解析：

```json
{
  "data": [
    {
      "id": "deepseek-v4-pro",
      "type": "model",
      "display_name": "DeepSeek V4 Pro",
      "created_at": "2026-08-11T00:00:00Z",
      "object": "model",
      "created": 1700000000,
      "owned_by": "system"
    }
  ],
  "has_more": false,
  "first_id": null,
  "last_id": null
}
```

- Anthropic SDK 读 `data[].type` + `data[].id` + `display_name`；OpenAI SDK 读 `data[].object` + `id`——两套字段并存，互不干扰
- 该端点沿用 API Key 认证（兼容两种 header）

### 3.3 count_tokens 端点

`POST /v1/messages/count_tokens`（Anthropic SDK 的 `client.messages.count_tokens`）：

**请求**（与 /v1/messages 同构）：`{model, system?, messages, tools?, ...}`
**响应**：`{"input_tokens": N}`

**实现**：网关内置估算器（网关侧不持厂商 tokenizer）：
- 按文本 rune 数估算：英文 ≈ 4 字符/token、中文 ≈ 1 字符/token，JSON 结构开销另计
- 响应标记为估算口径（SDK 仅用于预估计费，误差可接受）
- 复用 /v1/messages 的参数校验（model/messages 必填）与 API Key 认证

> 备选：若接入的 Provider 提供 tokenizer 端点（如 Kimi `/v1/tokenizers/estimate-token-count`），后续可升级为透传精确计算。本次 MVP 用估算。

### 3.4 对外文档更新（Portal）

- [docs/index.ts](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/portal/src/data/docs/index.ts)：新增「Anthropic 接入指南」文档页
  - Anthropic Python / Node SDK 示例（`ANTHROPIC_BASE_URL` 指向 `https://api.starnov.cn`，`api_key` 用网关 Key）
  - 支持端点说明（`/v1/messages` 非流式 + 流式 + tools）
- [faq.ts](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/portal/src/data/faq.ts)：FAQ 补充「是否支持 Anthropic 协议？」
- 兼容性说明：base_url 需去除 SDK 自动追加的 `/v1`（如 `https://api.starnov.cn`）

### 3.5 SDK 端到端验证（验收）

| 场景 | 验证方式 | 期望 |
|------|----------|------|
| 非流式 | Python `anthropic` SDK `messages.create` | 返回正确 `content[0].text` 与 usage |
| 流式 | `stream=True` | 逐 delta 输出 + `message_stop` |
| 模型发现 | `client.models.list()` | 返回网关模型列表（Anthropic 格式） |
| count_tokens | `client.messages.count_tokens()` | 返回 `input_tokens` |
| 错误场景 | 无效 Key / 额度不足 | 抛出 `authentication_error` / `insufficient_quota`（SDK 可识别） |
| 工具调用 | `tools=[...]` + `tool_choice` | 触发 `tool_use` 并正确回传 |

---

## 4. 不包含的范围

1. ❌ 真实 tokenizer 精确计算（MVP 用估算，Kimi tokenizer 透传后置）
2. ❌ Anthropic `GET /v1/models/{id}` 单模型详情（SDK 的 retrieve 非核心路径，后置）
3. ❌ `beta` 头功能（如 context caching、computer use）
4. ❌ 多模态 image 内容块

---

## 5. 验收标准

1. Python `anthropic` SDK 与 Node `@anthropic-ai/sdk` 换 `base_url` + `api_key` 后非流式/流式/tools 全部可用
2. `client.models.list()` 返回 Anthropic 格式模型列表；Claude Code 自动发现不报错
3. `client.messages.count_tokens()` 返回 `input_tokens`
4. 无效 Key 抛 `authentication_error`、额度不足抛 `insufficient_quota`（402）
5. OpenAI 入站 `/v1/chat/completions` 错误码/行为零变化
6. 门户文档中心新增 Anthropic 接入指南，FAQ 可查

---

## 6. 任务拆解

| # | 任务 | 角色 | 产出物 |
|:-:|------|------|--------|
| 1 | 错误码标准化（writeChatError 映射 + ConvertErrorBody 扩展） | Backend Engineer | chat_controller.go / chat_adapter.go |
| 2 | GET /v1/models 超集格式 | Backend Engineer | chat_controller.go |
| 3 | count_tokens 端点 + 估算器 + 路由注册 | Backend Engineer | chat_controller.go / provider |
| 4 | Anthropic SDK 端到端验证（Python + Node，走真实网关） | QA Engineer | 测试报告 |
| 5 | Portal 文档 + FAQ 更新 | Frontend Engineer | docs/index.ts / faq.ts |
| 6 | Code Review / 回归 | Reviewer | 审查报告 |
| 7 | 发布（RN + 部署） | Release Manager | RN-xxx |

**Workflow**：S2 完整轨 → Backend → QA（SDK 实测）→ Reviewer → Release

---

## 7. 风险与注意事项

1. **/v1/models 超集方案**：两套 SDK 均忽略未知字段，风险低；需实测 Claude Code 自动发现
2. **count_tokens 估算精度**：估算值与厂商真实 token 数有偏差（计费仍以实际 usage 为准，仅影响 SDK 预估）
3. **错误码变更影响**：Anthropic 入站错误 type 变更可能影响 #006 已接入客户端的错误处理（type 字段从内部码改为标准码，属预期改进，需在发布说明中注明）
4. **SDK 实测依赖生产 Provider 配置**：智谱/千问 Anthropic Provider 需先在生产 Admin 配置（#006 遗留运营项）

---

## 8. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-08-11 | v1.0 | 初始设计（待 CEO 决策） |

---

# End
