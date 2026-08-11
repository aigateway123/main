# P1 Iteration #006 — 模型接入协议支持 Anthropic

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.1 |
| 状态 | **Approved（CEO 已确认）** |
| Owner | AI Project Manager |
| 日期 | 2026-08-11 |
| 轨道 | **完整轨**（新功能 / 跨模块改动 / 数据结构变更 / 涉及多个文件） |
| 优先级 | P1 |
| 关联 Release | P1 Iteration #006 |

## 0. CEO 决策记录（2026-08-11）

| # | 决策点 | 结论 |
|:-:|--------|------|
| 1 | OpenAI 入站缺省 `max_tokens` | 缺省 **4096** |
| 2 | 接入模型范围 | 按当前系统已支持的 8 个模型，采用其厂商**官方 Anthropic 兼容端点**接入 |
| 3 | tools / Function Calling 转换 | **纳入本次迭代**，完整双向转换（不可后置） |

---

## 1. 需求概述

平台当前仅支持 **OpenAI 兼容协议**：
- 入站：对外只提供 `POST /v1/chat/completions`（OpenAI 格式）
- 出站：所有 Provider 均按 OpenAI 协议调用（`Authorization: Bearer` + 请求体透传）

本次迭代目标：**模型接入协议支持 Anthropic（Messages API）**，使网关既能：
1. **入站**：对外提供 Anthropic 兼容端点 `POST /v1/messages`，客户端可直接用 Anthropic SDK（Python / JS / cURL）接入；
2. **出站**：支持将 Anthropic 官方 API（`api.anthropic.com`）及兼容 Anthropic 协议的中转商作为 Provider 接入，请求/响应在网关内做协议转换。

**双向支持 + 流式 SSE + 官方与第三方中转全部纳入本次迭代。**

---

## 2. 现状分析（依据代码）

| 模块 | 现状 | 文件 |
|------|------|------|
| 入站控制器 | 仅 `HandleChatCompletions`，解析 OpenAI 格式，无协议抽象 | [chat_controller.go](../../backend/internal/controller/chat_controller.go) |
| 出站调用 | `CallProvider` 统一 `Bearer` 头 + body 透传 | [router_service.go](../../backend/internal/service/router_service.go) |
| Provider 模型 | 无 `protocol_type` 字段，全部按 OpenAI 兼容处理 | [provider.go](../../backend/internal/entity/provider.go) |
| Provider 管理 | Create/Update DTO 无协议字段 | [provider_request.go](../../backend/internal/dto/provider_request.go) |
| 计费解析 | `parseTokenUsage`/`parseStreamUsage` 硬编码 `prompt_tokens`/`completion_tokens` | [chat_controller.go](../../backend/internal/controller/chat_controller.go#L349-L390) |
| 路由注册 | `/v1/chat/completions` + `/api/v1/chat/completions` 双注册 | [main.go](../../backend/cmd/gateway/main.go#L151-L152) |
| 可借鉴模式 | 图片生成已用 Adapter 模式（requestBuilder + responseParser） | [image_adapter.go](../../backend/internal/provider/image_adapter.go) |
| Admin 前端 | Provider 表单无协议选择 | [providers-page.vue](../../admin/src/pages/providers/providers-page.vue) |

---

## 2.1 Provider 官方 Anthropic 兼容端点调研（2026-08-11，官方文档）

当前 5 个 Provider / 8 个模型**全部**获得官方 Anthropic 兼容协议支持：

| Provider | 现有 OpenAI 端点 | 官方 Anthropic 兼容端点 | 认证方式 | 对应模型 |
|----------|------------------|------------------------|----------|----------|
| DeepSeek | `api.deepseek.com` | `https://api.deepseek.com/anthropic` | `x-api-key`（亦兼容 Bearer） | deepseek-v4-pro / deepseek-v4-flash |
| 智谱 | `open.bigmodel.cn` | `https://open.bigmodel.cn/api/anthropic` | `x-api-key` | GLM-5.2 |
| MiniMax | `api.minimax.chat`（旧） | `https://api.minimaxi.com/anthropic` | `x-api-key` | MiniMax-M3 |
| 千问(百炼) | `dashscope.aliyuncs.com` | `https://dashscope.aliyuncs.com/apps/anthropic` | `x-api-key` / `Authorization: Bearer` | qwen3.7-flash / qwen3.7-plus / qwen3.8-max |
| Kimi | `api.moonshot.cn` | `https://api.moonshot.ai/anthropic` | **`Authorization: Bearer`**（文档走 ANTHROPIC_AUTH_TOKEN） | kimi-k3 |

**官方文档要点与风险：**
1. **认证差异**：Kimi/Moonshot 官方 Anthropic 端点文档采用 Bearer 认证（`ANTHROPIC_AUTH_TOKEN`），其余厂商用 `x-api-key`（多数同时兼容 Bearer）。→ 需在 Provider 配置增加 `auth_type`（`api_key` / `bearer`），anthropic 协议下默认 `api_key`，Kimi 配置为 `bearer`。
2. **域名差异**：MiniMax、Kimi 官方 anthropic 端点域名 ≠ 现有配置域名 → 需在 Admin 后台新增 anthropic 协议 Provider（复用现有 API Key，新 base_url）。
3. **DeepSeek 流式回退**：`/anthropic/v1/messages` 端点即使 `stream: true` 也可能返回非流式 JSON → 适配层需按响应 `Content-Type` 判断走 SSE 解析或非流式解析。
4. **百炼无模型列表**：Anthropic 兼容端点不提供 `/v1/models`；网关自身提供，不受影响。
5. **智谱额度特殊性**：官方说明 Anthropic 端点对购买过 Coding Plan 的账号不消耗余额、需加白；实际以账号权限为准，作为接入注意事项记录。
6. **工具调用**：DeepSeek / 百炼 / MiniMax 均完整支持 `tools` + `tool_choice`（name/input_schema/description、none/auto/any/tool）。

---

## 3. 方案设计：引入 Chat 协议适配层

### 3.1 协议矩阵（4 种组合）

| # | 入站协议 | 出站 Provider 协议 | 处理方式 |
|:-:|:--------:|:------------------:|----------|
| 1 | OpenAI | OpenAI | 透传（现状，保持不变） |
| 2 | OpenAI | **Anthropic** | OAI→ANT 请求转换 + ANT→OAI 响应转换 |
| 3 | Anthropic | **Anthropic** | 透传 |
| 4 | Anthropic | OpenAI | ANT→OAI 请求转换 + OAI→ANT 响应转换 |

### 3.2 新增协议常量与 Provider 字段

- 新增常量：`ProtocolOpenAI = "openai"`、`ProtocolAnthropic = "anthropic"`
- `providers` 表新增字段（迁移 013）：
  - `protocol_type VARCHAR(20) NOT NULL DEFAULT 'openai'` — 出站协议
  - `auth_type VARCHAR(20) NOT NULL DEFAULT 'api_key'` — 认证方式：`api_key`（`x-api-key` 头）/ `bearer`（`Authorization: Bearer` 头）；Kimi 需配置 `bearer`
- Provider entity / DTO / Repository / Service / Controller 全链路透传 `protocol_type` + `auth_type`
- 存量 Provider 默认 `openai` / `api_key`，向后兼容零影响

### 3.3 Chat 协议适配器（借鉴 image_adapter 模式）

新增 `backend/internal/provider/chat_adapter.go`（或独立包 `provider/protocol/`）：

```go
// 入站/出站协议枚举
type ChatProtocol string

const (
    ProtocolOpenAI    ChatProtocol = "openai"
    ProtocolAnthropic ChatProtocol = "anthropic"
)

// ChatProtocolAdapter：一次调用所需的协议适配能力
type ChatProtocolAdapter interface {
    // BuildRequest：把入站请求体转换为目标 Provider 协议请求体
    BuildRequest(inbound ChatProtocol, target ChatProtocol, body []byte) ([]byte, error)
    // BuildResponse：把 Provider 响应体转换为入站协议响应体
    BuildResponse(inbound ChatProtocol, target ChatProtocol, body []byte) ([]byte, error)
    // BuildStreamEvent：转换单条 SSE 事件（返回 nil 表示丢弃该事件）
    BuildStreamEvent(inbound ChatProtocol, target ChatProtocol, event []byte) ([][]byte, error)
    // ParseUsage：按目标协议解析非流式响应的 token 数
    ParseUsage(target ChatProtocol, body []byte) (input, output int)
    // ParseStreamUsage：按目标协议解析流式末尾 usage（Anthropic 取 message_start + message_delta）
    ParseStreamUsage(target ChatProtocol, data []byte) (input, output int)
}
```

### 3.4 OpenAI ↔ Anthropic 转换规则

**请求转换（OAI → ANT）：**

| OpenAI 字段 | Anthropic 字段 | 处理 |
|------------|----------------|------|
| `messages[role=system].content` | `system` | 拆出为顶层 system 字段 |
| `messages`（user/assistant） | `messages` | role 映射，content 为字符串或块数组 |
| `messages[role=tool]` | `messages` 内 `tool_result` 内容块 | 并入最近一条 user 消息 |
| `max_tokens`（可选） | `max_tokens`（**必填**） | 缺省给默认值 4096 |
| `temperature` / `top_p` | `temperature` / `top_p` | 透传 |
| `stream` | `stream` | 透传 |
| `tools[type=function]` | `tools`（name/description/input_schema） | 转换 |
| `tool_choice` | `tool_choice` | 转换（`auto`/`none`/`{"type":"tool","name":...}`） |
| `n` / `logprobs` / `seed` / `response_format` 等 | — | **丢弃**（Anthropic 不支持） |

**请求转换（ANT → OAI）：** 上述的逆向。`system` 字段折叠为 system 消息；`messages` 逐条转回；`content` 块数组拼接为字符串（text 块）；`tool_use`/`tool_result` 块转回 tool_calls 语义。

**响应转换（ANT → OAI 非流式）：**

```
Anthropic: { content: [{type:"text",text:"..."}, {type:"tool_use",id,name,input}],
             usage:{input_tokens,output_tokens}, stop_reason }
      ↓
OpenAI:    { id, object:"chat.completion", choices:[{message:{role:"assistant",
             content:"...", tool_calls:[{id,name,arguments:JSON.stringify(input)}]}}],
             usage:{prompt_tokens:input_tokens, completion_tokens:output_tokens} }
```

**工具调用（Function Calling）双向转换【本次迭代纳入】：**

| 方向 | 转换 |
|------|------|
| OAI `tools[type=function]` → ANT `tools` | `{type:"function",function:{name,description,parameters}}` → `{name,description,input_schema:parameters}` |
| OAI `tool_choice` → ANT `tool_choice` | `"auto"/"none"` → 同名字符串；`{type:"function",function:{name}}` → `{type:"tool",name}` |
| ANT `tool_use` 响应 → OAI `tool_calls` | `{id,name,input}` → `{id,type:"function",function:{name,arguments:JSON.stringify(input)}}` |
| OAI `tool` 消息 → ANT `tool_result` 块 | 每轮工具结果并入消息内容块 `{type:"tool_result",tool_use_id,content}` |
| ANT `tool_result` 消息 → OAI `tool` 消息 | `{tool_use_id,content}` → `{role:"tool",tool_call_id,content}` |

流式工具调用：ANT `content_block_delta`（`input_json_delta`）累积拼接为 `arguments`，在 `content_block_stop` 后输出完整 `tool_calls` chunk（OpenAI 流式需完整 arguments 一次性下发）。

**响应转换（ANT → OAI 流式）：**

| Anthropic SSE 事件 | OpenAI SSE 事件 |
|--------------------|-----------------|
| `message_start`（含 input_tokens） | 可选：空内容首 chunk |
| `content_block_delta`（text_delta） | `choices[0].delta.content` |
| `message_delta`（含 output_tokens + stop_reason） | 末尾 usage chunk |
| `message_stop` / `ping` | `data: [DONE]` / 丢弃 |

**计费：** 流式计费解析 `message_start.usage.input_tokens` + `message_delta.usage.output_tokens`；非流式解析 `usage.input_tokens/output_tokens`。计费、配额、额度扣减、日志链路全部复用现有逻辑，仅替换 token 解析来源。

### 3.5 RouterService 改造

- `ProviderTarget` 增加 `ProtocolType ChatProtocol` + `AuthType string`（来自 Provider）
- `CallProvider`：按协议设置请求头
  - `openai`：`Authorization: Bearer <key>`
  - `anthropic` + `auth_type=api_key`：`x-api-key: <key>` + `anthropic-version: 2023-06-01`
  - `anthropic` + `auth_type=bearer`（Kimi）：`Authorization: Bearer <key>`
- `CallWithFallback`：调用前按入站协议与目标 Provider 协议调用 `chatAdapter.BuildRequest`，响应后由 Controller 调 `BuildResponse`
- 注意：现有 `CallWithFallback` 以"裸响应"返回，改造点需保证失败切换时按各 Provider 协议分别转换后判断成功

### 3.6 入站端点

- 新增 `ChatController.HandleMessages`，注册：
  - `POST /v1/messages`
  - `POST /api/v1/messages`
- 认证兼容：`x-api-key: sk-xxx`（Anthropic SDK 默认）与 `Authorization: Bearer sk-xxx` 均支持
- 请求校验：`model` 必填、`max_tokens` 必填（Anthropic 规范）、`messages` 必填
- 复用现有链路：API Key 校验 → 配额 → 模型授权 → Policy → 路由 → 计费 → 日志
- 模型列表：`GET /v1/models` 已存在，Anthropic SDK 兼容

### 3.7 前端 Admin

- [providers-page.vue](../../admin/src/pages/providers/providers-page.vue)：表单新增「协议类型」下拉（OpenAI 兼容 / Anthropic）+「认证方式」下拉（x-api-key / Bearer，协议为 Anthropic 时显示），创建/编辑回显
- [providers.ts](../../admin/src/api/providers.ts)：类型增加 `protocolType` / `authType`

### 3.8 数据库迁移（013）

- `20260811_013_add_provider_protocol.up.sql`：
  - `ALTER TABLE providers ADD COLUMN protocol_type VARCHAR(20) NOT NULL DEFAULT 'openai';`
  - `ALTER TABLE providers ADD COLUMN auth_type VARCHAR(20) NOT NULL DEFAULT 'api_key';`
  - 存量数据自动归为 `openai` / `api_key`，向后兼容
- `.down.sql`：删除两列

---

## 4. 不包含的范围（防止蔓延）

1. ❌ 多模态（image 内容块）完整双向转换（若 Claude 图片模型需要，单列迭代；文本 + tools 本次完整支持）
2. ❌ Gemini / 其他非 OpenAI 协议（仅做 Anthropic）
3. ❌ 响应 `thinking` 内容块保留给入站 Anthropic 客户端的透传优化（首期：ANT 入 → ANT 出 透传时保留；ANT 入 → OAI 出 时丢弃 thinking 块，仅保留 text）

---

## 5. 验收标准

1. `POST /v1/messages`（Anthropic 格式，x-api-key 认证）→ 绑定的 OpenAI 兼容 Provider，返回 Anthropic 格式正确响应
2. `POST /v1/chat/completions`（OpenAI 格式）→ 绑定的 Anthropic 官方 Provider（`x-api-key` 与 `Bearer` 两种 auth_type），返回 OpenAI 格式正确响应
3. 流式（SSE）双向转换正确：Anthropic 入站流式经 OpenAI Provider 返回 Anthropic 事件；OpenAI 入站流式经 Anthropic Provider 返回 OpenAI chunk，末尾含 usage
4. **tools / Function Calling 双向转换**：OpenAI 入站 tools 经 Anthropic Provider 触发 tool_use 并正确回传 tool_result；Anthropic 入站 tools 经 OpenAI Provider 触发 tool_calls（含流式）
5. 计费正确：Anthropic 响应 token（input/output）正确解析并计入日志、配额、账单；流式末尾 usage 不遗漏
6. Admin 后台可创建/编辑 Anthropic 协议 Provider（协议类型 + 认证方式）并成功调用
7. 原有 5 个 OpenAI 兼容 Provider 调用行为零变化（回归）
8. `GET /v1/models`、配额、模型授权、Policy、Dashboard、报表对 Anthropic 链路全部生效
9. 5 个厂商官方 Anthropic 端点全部实测打通（DeepSeek / 智谱 / MiniMax / 千问 / Kimi）

---

## 6. 任务拆解（角色调度）

| # | 任务 | 角色 | 产出物 |
|:-:|------|------|--------|
| 1 | 需求确认与 PRD | Product Manager | 本规划文档（v1.1 Approved） |
| 2 | 架构设计 + ADR + API 契约 | Architect | `docs/02-architecture/ARCH-xxx` + `docs/ADR/ADR-xxx` + `docs/03-API/API-xxx` |
| 3 | 数据库迁移 + Provider protocol_type/auth_type 全链路 | Backend Engineer | 迁移 013 + entity/dto/repo/service/controller |
| 4 | Chat 协议适配层（转换器 + 流式 + tools） | Backend Engineer | `provider/chat_adapter.go` 等 |
| 5 | RouterService + ChatController 改造 | Backend Engineer | 路由、认证兼容、计费解析 |
| 6 | Admin 前端协议选择 | Frontend Engineer | providers-page.vue |
| 7 | Code Review | Reviewer | 审查报告 |
| 8 | 集成测试 + 回归 | QA Engineer | 测试报告 + Release Note |

**Workflow：** S2 完整轨 → PM → Architect → Backend → Frontend → Reviewer → QA

---

## 7. 风险与注意事项

1. **Anthropic `max_tokens` 必填**：OpenAI 入站缺省时默认值需谨慎（Claude 对 `max_tokens` 有上限，默认值需小于模型最大上下文）
2. **系统消息拆分**：多条 system 消息需合并为单个 `system` 字段
3. **流式转换状态机**：Anthropic SSE 事件多、无 `[DONE]`，转换需维护内容块状态（`content_block_start/stop` 间文本拼接）
4. **失败切换**：同一模型绑定不同协议 Provider 时，需按各 Provider 协议分别构造请求再判断（改造点集中在 `CallWithFallback`）
5. **第三方中转差异**：中转商的 Anthropic 兼容端点可能在认证方式（Bearer）、`anthropic-version` 要求上有差异，文档需说明
6. **缓存一致性**：Provider 协议类型变更后需确认是否有缓存（首期 Provider 查询直连 DB，低风险）

---

## 8. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-08-11 | v1.0 | 初始规划（待 CEO 确认） |
| 2026-08-11 | v1.1 | CEO 确认 3 决策点；补充 5 厂商官方 Anthropic 兼容端点调研；tools 双向转换与 auth_type 纳入本次迭代 |

---

# End
