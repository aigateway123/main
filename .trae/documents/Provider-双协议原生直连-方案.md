# Provider 管理双协议（OpenAI + Anthropic）原生直连方案

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.0 |
| 状态 | Draft（待 CEO 确认） |
| Owner | AI Project Manager |
| 日期 | 2026-09-10 |
| 轨道 | 完整轨（数据结构变更 + 跨模块改动 + 行为变更） |
| 优先级 | P1 |

---

## 1. 摘要（Summary）

让 **单个 Provider 同时配置 OpenAI 与 Anthropic 两套端点**；外部请求走哪个入站路径，网关就用对应协议**原生直连**上游，不再做跨协议转换：

- 外部请求 `POST /v1/chat/completions`（OpenAI 地址）→ 用 Provider 的 **OpenAI 端点** 原生调用
- 外部请求 `POST /v1/messages`（Anthropic 地址）→ 用 Provider 的 **Anthropic 端点** 原生调用
- 若模型绑定的 Provider 均未配置入站协议对应的端点 → **严格报错**（不降级为协议转换）

已确认的决策：
1. 目标行为 = **双协议原生直连**（非转换兜底）
2. 数据模型 = **providers 表新增 Anthropic 列（可空/非必填）**
3. 缺失协议端点时 = **严格模式报错**，不做协议转换
4. `protocol_type` 字段**保留** + 存量 anthropic Provider 数据**迁移**

---

## 2. 现状分析（Current State Analysis）

> 说明：P1 Iteration #006 / #007 已实现「双入站端点 + 跨协议转换」。本次是**行为变更**：把「跨协议转换」改为「按入站路径原生直连」。

| 模块 | 现状 | 文件 |
|------|------|------|
| Provider 表结构 | `protocol_type` / `auth_type` 单选；一套 `base_url` / `api_path` / `api_key_ref`，只能表达一种协议 | [20260811_013_add_provider_protocol.up.sql](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/migrations/20260811_013_add_provider_protocol.up.sql) |
| Provider 实体 | 无 Anthropic 独立端点字段 | [provider.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/entity/provider.go) |
| Provider DTO | Create/Update/Response 无 Anthropic 端点字段 | [provider_request.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/dto/provider_request.go) |
| Provider 仓储 | SQL 列清单/INSERT/UPDATE/Scan 固定 13 列 | [provider_repo_pg.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/repository/provider_repo_pg.go) |
| 路由选 Provider | 按绑定的 `provider.ProtocolType` 决定出站协议；入站≠出站时调用 `BuildOutboundRequest` **做转换** | [router_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/service/router_service.go#L276-L333) |
| 出站调用 | 按 `ProviderTarget.ProtocolType` 设置请求头（openai=Bearer；anthropic=x-api-key/bearer + anthropic-version） | [router_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/service/router_service.go#L192-L216) |
| 入站端点 | `/v1/chat/completions` + `/v1/messages` 均已注册，入站协议由 handler 决定 | [main.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/cmd/gateway/main.go#L151-L159) |
| 控制器响应链路 | 按 `inbound` 与 `target.ProtocolType` 做双向转换 / SSE 转换 / 错误体转换 / token 解析 | [chat_controller.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/controller/chat_controller.go#L217-L350) |
| 协议适配层 | `chat_adapter.go` 完整实现 OpenAI↔Anthropic 请求/响应/SSE/usage 转换 + 单测 | [chat_adapter.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/provider/chat_adapter.go)、[chat_adapter_test.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/provider/chat_adapter_test.go) |
| Admin Provider 页 | 单端点表单 + 协议下拉；表格展示单一「协议」徽标 | [providers-page.vue](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/admin/src/pages/providers/providers-page.vue) |
| Admin API 类型 | `ProviderResponse` / `CreateProviderRequest` 无 Anthropic 端点字段 | [providers.ts](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/admin/src/api/providers.ts) |
| 集成测试 | 6 个场景断言「跨协议转换」（OAI入→ANT出 / ANT入→OAI出），将不再成立 | [chat_anthropic_integration_test.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/controller/chat_anthropic_integration_test.go) |
| 图片服务 | 独立构造 `ProviderTarget`，走 OpenAI 兼容 images 端点 | [image_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/service/image_service.go#L160-L176) |

---

## 3. 方案设计（Proposed Changes）

### 3.0 字段语义定义（关键约定）

`providers` 表字段含义**重新明确**：

| 列 | 含义 | 为空表示 |
|----|------|---------|
| `base_url` / `api_path` / `api_key_ref` / `auth_type` | **OpenAI 协议端点** | 未配置 OpenAI 端点 |
| **新增** `anthropic_base_url` | **Anthropic 协议端点** Base URL | 未配置 Anthropic 端点 |
| **新增** `anthropic_api_path` | Anthropic 协议端点路径（默认 `/v1/messages`） | 用默认值 |
| **新增** `anthropic_api_key_ref` | Anthropic 端点 API Key | 空 |
| **新增** `anthropic_auth_type` | Anthropic 端点认证方式（`api_key`=x-api-key / `bearer`） | 默认 `api_key` |
| `protocol_type`（保留） | **仅作默认/主协议标识**，供 Admin 展示与向后兼容；**不再参与出站协议选择**。保存时由后端按端点自动推导 | — |

出站协议**只由入站请求路径决定**：`/v1/chat/completions` → OpenAI 端点；`/v1/messages` → Anthropic 端点。

### 3.1 数据库迁移

**新增** `backend/migrations/20260910_014_add_provider_anthropic_endpoint.up.sql`：

```sql
ALTER TABLE providers ADD COLUMN anthropic_base_url VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE providers ADD COLUMN anthropic_api_path VARCHAR(255) NOT NULL DEFAULT '/v1/messages';
ALTER TABLE providers ADD COLUMN anthropic_api_key_ref VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE providers ADD COLUMN anthropic_auth_type VARCHAR(20) NOT NULL DEFAULT 'api_key';

-- 迁移存量 anthropic 协议 Provider：主端点搬运到 anthropic_*，OpenAI 列清空
UPDATE providers
SET anthropic_base_url    = base_url,
    anthropic_api_path    = COALESCE(NULLIF(api_path, ''), '/v1/messages'),
    anthropic_api_key_ref = COALESCE(api_key_ref, ''),
    anthropic_auth_type   = COALESCE(NULLIF(auth_type, ''), 'api_key'),
    base_url              = '',
    api_path              = '',
    api_key_ref           = ''
WHERE protocol_type = 'anthropic';
```

**新增** `..._014_add_provider_anthropic_endpoint.down.sql`：删除 4 个新列（不恢复已搬运数据，注释说明）。

> 迁移文件前缀 `20260910` 与现有最小前缀 `202607200001` / `202607230004` / `202607280001` / `20260811` 均不冲突（迁移器按文件名首段 `_` 前作为 version，见 [migrator.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/database/migrator.go#L45-L51)）。

### 3.2 后端 Entity

**修改** [provider.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/entity/provider.go)：在 `AuthType` 后新增

```go
AnthropicBaseURL   string `json:"anthropicBaseUrl"`
AnthropicAPIPath   string `json:"anthropicApiPath"`
AnthropicAPIKeyRef string `json:"anthropicApiKeyRef,omitempty"`
AnthropicAuthType  string `json:"anthropicAuthType"`
```

### 3.3 后端 DTO

**修改** [provider_request.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/dto/provider_request.go)：`CreateProviderRequest` / `UpdateProviderRequest` / `ProviderResponse` 增加：

```go
AnthropicBaseURL   string `json:"anthropicBaseUrl,omitempty"`
AnthropicAPIPath   string `json:"anthropicApiPath,omitempty"`
AnthropicAPIKeyRef string `json:"anthropicApiKeyRef,omitempty"`
AnthropicAuthType  string `json:"anthropicAuthType,omitempty"`
```

`protocolType` / `authType` **保留**（向后兼容），但 `protocolType` 由后端推导覆盖。

### 3.4 后端 Repository

**修改** [provider_repo_pg.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/repository/provider_repo_pg.go)：

- `providerColumns` 在 `auth_type` 后追加 `anthropic_base_url, anthropic_api_path, anthropic_api_key_ref, anthropic_auth_type`（**注意 Scan 顺序必须同步**）
- `scanProvider` / `List` 的 Scan 参数同步追加 4 个字段
- `Create` INSERT 列表 + VALUES（`$1..$15`）追加 4 列
- `Update` SET 子句 + 参数追加 4 列

> 内存实现 [provider_repository.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/repository/provider_repository.go) 结构体直接持有 `*entity.Provider`，无需改字段逻辑。

### 3.5 后端 Service

**修改** [provider_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/service/provider_service.go)：

- `Create` 与 `Update` 映射 4 个新字段
- 新增归一化/校验（Create/Update 共用私有函数）：
  - `strings.TrimSpace` 各 URL/Path/Key
  - `AnthropicAPIPath` 为空 → `/v1/messages`
  - `AnthropicBaseURL` 非空且 `AnthropicAuthType` 为空 → `api_key`
  - `BaseURL == "" && AnthropicBaseURL == ""` → 返回 `&ValidationError{"at least one protocol endpoint is required"}`（映射 HTTP 400）
  - `ProtocolType` **推导**：`BaseURL != ""` → `"openai"`；否则 → `"anthropic"`（忽略客户端传值）
- `Update` 沿用现有「整字段替换」语义（端点字段以请求为准），`toProviderResponse` 透传新字段

### 3.6 后端 Router（核心行为变更）

**修改** [router_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/service/router_service.go)：

1. 新增按协议取端点函数：

```go
// endpointForProtocol 返回 Provider 针对指定协议的原生端点；未配置返回 ok=false。
func endpointForProtocol(p *entity.Provider, protocol provider.ChatProtocol) (baseURL, apiPath, apiKey, authType string, ok bool)
```
- `anthropic`：`AnthropicBaseURL == ""` → `ok=false`；否则取其 4 字段，`authType` 空则 `api_key`
- `openai`（default）：`BaseURL == ""` → `ok=false`；否则取 `BaseURL/APIPath/APIKeyRef`，`authType = "bearer"`

2. `CallWithFallback(ctx, modelCode, requestBody, inbound)`：
   - 候选 = 启用的绑定 Provider 中 **`endpointForProtocol(p, inbound)` 为 true** 者
   - 排序不变（priority 升序 → binding.weight 降序）
   - 构造 `ProviderTarget`：`ProtocolType = inbound`；`BaseURL/APIPath/ProviderAPIKey/AuthType` 取自 `endpointForProtocol`；`APIPath` 为空时按协议默认（openai `/v1/chat/completions`、anthropic `/v1/messages`）；binding `APIPathOverride` 仍优先覆盖
   - **删除** `BuildOutboundRequest` 转换分支，请求体**原样透传**
   - 逐个尝试，失败切下一个；全部失败返回 `lastErr`
   - 若**没有任何候选**（即无 Provider 配置该协议端点）→ 返回新错误 `ErrNoProviderForProtocol`

3. `SelectProvider`（当前无调用方）签名改为 `SelectProvider(ctx, modelCode string, protocol provider.ChatProtocol) (*ProviderTarget, error)`，内部用 `endpointForProtocol` 过滤，保持与 `CallWithFallback` 一致，避免留下语义错误的死代码。

4. `CallProvider` 请求头逻辑**不变**（已按 `target.ProtocolType` 分支）；因此时 `ProtocolType == inbound`，anthropic 走 `x-api-key`/`bearer` + `anthropic-version`，openai 走 `Bearer`。

### 3.7 后端错误码

**修改** [errors.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/service/errors.go)：新增

```go
ErrNoProviderForProtocol = errors.New("no provider configured for requested protocol")
```

**修改** [chat_controller.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/controller/chat_controller.go#L221-L236) 的 `handleInbound` 错误映射 switch，新增：

```go
case errors.Is(err, service.ErrNoProviderForProtocol):
    status, code, msg = http.StatusServiceUnavailable, "ROUTER001",
        "no provider configured for "+string(inbound)+" protocol"
```

`writeChatError` 对 Anthropic 入站自动把 503 映射为 `overloaded_error`（已有逻辑，无需改）。

> 响应链路 `proxyNonStream` / `proxyStream` / `finishBilling` **无需改动**：native 直连下 `inbound == target.ProtocolType`，`ParseUsage` / `BuildInboundResponse` / `NewStreamTransformer` / `ConvertErrorBody` 自动退化为原样透传。

### 3.8 后端错误映射（Provider 4xx）

保持不变：`ConvertErrorBody(inbound, target.ProtocolType, ...)` 在协议一致时返回 `nil` → 原样透传上游错误体。

### 3.9 Admin 前端

**修改** [providers.ts](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/admin/src/api/providers.ts)：`ProviderResponse` / `CreateProviderRequest` 增加 4 个 `anthropic*` 字段。

**修改** [providers-page.vue](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/admin/src/pages/providers/providers-page.vue)：

- 表单拆为两区：
  - **OpenAI 端点**（原有）：Base URL / API 路径 / API Key 引用（认证固定 Bearer，移除认证下拉）
  - **Anthropic 端点（可选）**：Anthropic Base URL / API 路径（默认 `/v1/messages`）/ Anthropic API Key 引用 / 认证方式（`x-api-key` / `Bearer`）
- 移除「协议类型」下拉与 `handleProtocolChange`；提交不再发送 `protocolType`（后端推导）
- `form` 默认值新增 `anthropicBaseUrl: ''`、`anthropicApiPath: '/v1/messages'`、`anthropicApiKeyRef: ''`、`anthropicAuthType: 'api_key'`；`openCreate` / `openEdit` 同步初始化与回显
- 表格「协议」列改为**支持的协议徽标**：`baseUrl` 非空显示 `OpenAI`；`anthropicBaseUrl` 非空显示 `Anthropic`；均空显示「未配置」
- 保存前基础校验：两个 Base URL 不能同时为空（与后端一致，前端给出提示）

### 3.10 测试调整（必须）

**重写** [chat_anthropic_integration_test.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/controller/chat_anthropic_integration_test.go) 的场景 1–6（跨协议转换已不成立）：

- Fixture：`QA-Ant` 改为写 `AnthropicBaseURL/AnthropicAPIPath/AnthropicAPIKeyRef/AnthropicAuthType`（`BaseURL` 留空）；`QA-Oai` 沿用 OpenAI 列
- 场景 1：`POST /v1/messages` → `QA-Ant`，断言**原生** anthropic 请求头（`x-api-key` + `anthropic-version`）与响应**原样透传**
- 场景 2：`POST /v1/chat/completions` → `QA-Oai`，断言 `Authorization: Bearer` 与响应原样透传
- 场景 3/4：流式同协议原生透传
- 场景 5/6：Provider 4xx 原样透传
- **新增**场景：双协议 Provider（同时配置两套端点）下，两条入站路径分别命中对应 mock 服务
- **新增**场景：模型仅绑定 OpenAI 端点的 Provider，`POST /v1/messages` → `503`（严格报错，含 `overloaded_error`）
- 场景 7–10（认证/校验/错误码/模型列表/count_tokens）保持

[chat_adapter_test.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI Gateway/aigateway/backend/internal/provider/chat_adapter_test.go) 为转换器单测，保留并通过（转换器代码不删除）。

---

## 4. 假设与决策（Assumptions & Decisions）

| # | 决策 | 说明 |
|:-:|------|------|
| 1 | 出站协议**只由入站路径决定**，`protocol_type` 不参与路由 | 满足「外部用 openai 地址走 openai、用 anthropic 地址走 anthropic」 |
| 2 | `base_url` 系列列 = OpenAI 端点；新增 `anthropic_*` = Anthropic 端点 | 单条记录承载两套端点，改动最小 |
| 3 | 缺失匹配协议端点 → **严格报错 503**，不转换 | CEO 已确认 |
| 4 | `protocol_type` 保留，由后端按端点自动推导（有 OpenAI 端点→`openai`，否则 `anthropic`） | 向后兼容 + Admin 展示，不再驱动路由 |
| 5 | `chat_adapter.go` 转换器代码**保留不删** | #006 已交付且有单测；当前调用链不再使用，作为后续「兼容模式」回退储备。若确认不需要，可另起迭代删除 |
| 6 | `Update` 对端点字段为**整字段替换**语义 | 与现有 `Update` 行为一致，避免引入歧义 |
| 7 | 绑定覆盖 `APIPathOverride` 作用于「被选中的协议端点路径」 | 不新增 per-protocol override 列，控制范围 |
| 8 | 图片生成（`image_service`）不变 | 其走 OpenAI 兼容 images 端点，`BaseURL` 语义仍成立 |
| 9 | Admin 模型绑定页不在本次范围 | 管理员可在 Provider 管理页查看各 Provider 支持的协议 |

---

## 5. 验证步骤（Verification）

1. **编译/单测**：`cd aigateway/backend && go build ./... && go test ./internal/...`
2. **迁移**：启动 gateway（`RunMigrations` 自动执行 014），确认 `providers` 表新增 4 列；确认存量 `protocol_type='anthropic'` 的行 `base_url=''` 且 `anthropic_base_url` 已填充
3. **双协议 Provider 原生直连**（Admin 建一个同时配置两套端点、且绑定到某模型的 Provider）：
   - `curl -X POST /v1/chat/completions`（`Authorization: Bearer sk-...`）→ 命中 OpenAI mock/上游，返回 OpenAI 格式
   - `curl -X POST /v1/messages`（`x-api-key: sk-...`）→ 命中 Anthropic mock/上游，返回 Anthropic 格式
   - 分别抓取上游收到的请求头/路径，确认 OpenAI 走 `Bearer`，Anthropic 走 `x-api-key` + `anthropic-version`
4. **严格报错**：仅配置 OpenAI 端点的 Provider 绑定的模型，调用 `/v1/messages` → `503`（Anthropic 入站 `overloaded_error`；OpenAI 入站 `ROUTER001`）
5. **回归**：`/v1/chat/completions` 原有 OpenAI Provider 调用行为与响应零变化；`GET /v1/models`、`count_tokens`、配额、计费、日志、Dashboard 正常
6. **前端**：Admin 创建/编辑双协议 Provider，列表徽标正确显示 OpenAI / Anthropic / 双协议
7. **流式**：两条路径的 SSE 均原样透传（无 `[DONE]`/`message_stop` 丢失），usage 计费解析正确

---

## 6. 范围外（Out of Scope）

1. ❌ 移除/重写 `chat_adapter.go` 转换器代码（本次保留）
2. ❌ Admin 模型绑定页展示 Provider 支持协议
3. ❌ per-protocol 的 `apiPathOverride`（绑定级分别覆盖）
4. ❌ Google Gemini / 其他协议
5. ❌ 多模态 image 内容块路径

---

## 7. 风险（Risks）

1. **行为变更（最高）**：#006 交付的「跨协议转换」在路由链路失效，Anthropic 入站不再能自动服务仅配 OpenAI 端点的 Provider。需在 Release Note 明确说明，并同步运营配置（为需要双协议的 Provider 补 Anthropic 端点）。
2. **存量数据迁移**：014 会清空 anthropic 协议行的 `base_url/api_path/api_key_ref`。若生产存在依赖这些列的校验/展示，需先核对（当前 Provider 查询直连 DB，无缓存，风险可控）。
3. **测试资产**：集成测试场景 1–6 必须同步重写，否则 CI 失败。
4. **约束缺失**：若无模型同时绑定「OpenAI 端点 Provider + Anthropic 端点 Provider」，Anthropic 路径将直接报错——需运营侧确认绑定覆盖度。
5. **SQL 列顺序**：`providerColumns` 与 Scan/Insert/Update 参数顺序必须同步，否则运行时报错（属机械性改动，Reviewer 需重点核对）。

---

## 8. 任务拆解（角色调度）

| # | 任务 | 角色 | 产出物 |
|:-:|------|------|--------|
| 1 | 架构评审（字段语义 / 路由策略 / ADR） | Architect | ADR + 本方案定稿 |
| 2 | 迁移 014 + Entity/DTO/Repository/Service 全链路 | Backend Engineer | 迁移文件 + 4 个 Go 文件 |
| 3 | Router 原生直连改造 + 严格报错 + 错误码 | Backend Engineer | router_service.go / errors.go / chat_controller.go |
| 4 | 集成测试重写 + 新增双协议/严格报错场景 | Backend Engineer | chat_anthropic_integration_test.go |
| 5 | Admin Provider 双端点表单 + 列表徽标 | Frontend Engineer | providers-page.vue / providers.ts |
| 6 | Code Review | Reviewer | 审查报告 |
| 7 | 集成 + 回归测试（含真实双协议 Provider 实测） | QA Engineer | 测试报告 |
| 8 | 发布 + Release Note（行为变更说明） | Release Manager | RN |

**Workflow：** S2 完整轨 → Architect → Backend → Frontend → Reviewer → QA → Release

---

## 9. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-09-10 | v1.0 | 初始方案（双协议原生直连，CEO 已确认 4 项决策） |

---

# End
