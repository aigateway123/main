# QA 测试报告 — P1 Iteration #008（Provider 双协议原生直连）

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.1 |
| 状态 | **PASS**（本地全链路 + 真实 PostgreSQL 迁移 up/down 验证通过；真实厂商端点待生产回归） |
| Owner | QA Engineer |
| 日期 | 2026-09-10 |
| 测试对象 | backend `router_service.go` / `provider_service.go` / `provider_repo_pg.go` / `entity/provider.go` / `dto/provider_request.go` / 迁移 014 + admin 前端 |
| 关联文档 | [Provider-双协议原生直连-方案.md](../../.trae/documents/Provider-双协议原生直连-方案.md) |
| 前置 | P1 Iteration #006 / #007（Anthropic 端点 + 跨协议转换） |

---

## 1. 测试范围

| # | 场景 | 覆盖点 |
|:-:|------|--------|
| 1 | OpenAI 入站 → OpenAI 端点（非流式） | 出站路径、`Authorization: Bearer`、请求体原样透传、响应与 usage 透传 |
| 2 | Anthropic 入站 → Anthropic 端点（非流式） | 出站路径、`x-api-key` + `anthropic-version`、`system` 顶层字符串保留、响应与 usage 透传 |
| 3 | 单 Provider 双端点 · 两条入站路径 | 各自命中对应协议端点（命中次数断言） |
| 4 | 严格模式：Anthropic 入站 + 仅 OpenAI 端点 | 503 `overloaded_error` |
| 5 | 严格模式：OpenAI 入站 + 仅 Anthropic 端点 | 503 `ROUTER001` |
| 6 | OpenAI 入站流式 SSE | chunk 原样透传、usage 解析、`[DONE]` |
| 7 | Anthropic 入站流式 SSE | 事件序列原样透传、`message_stop`、usage 解析 |
| 8 | 双向 4xx | 错误体原样透传（不再跨协议转换） |
| 9 | 认证与参数校验 | 缺失认证头 401 `AUTH001`、Anthropic `max_tokens` 必填 |
| 10 | Anthropic 错误码标准化 | 401 `authentication_error`、404 `not_found_error` |
| 11 | `GET /v1/models` 超集格式 | Anthropic `type`/`display_name` + OpenAI `object` 并存 |
| 12 | `POST /v1/messages/count_tokens` | 估算 + 参数校验 |
| 13 | 真实进程端到端（curl） | 配置校验、双协议路由、出站头与请求体、严格模式、回归 |
| 14 | 真实 PostgreSQL 迁移（up + down） | 存量 anthropic Provider 数据搬运、列默认值、外键完整性、down 回滚与重新升级 |
| 15 | v1.6.1 认证方式可配置 | OpenAI 端点 `auth_type` = `bearer` / `api_key` 时出站头分别为 `Authorization` / `x-api-key`；空值回退 `bearer`；新建 Provider 默认值按端点推导 |
| 16 | v1.6.1 端点连通性测试 | `POST /api/v1/providers/test-endpoint` 四档判定（200 / 401 / 404 / 连接拒绝）、认证头传递、非法 Base URL 400 |
| 17 | v1.6.1 真实 PostgreSQL 迁移 015 | 列默认值 `api_key` → `bearer`、存量 OpenAI 端点修正、down 回退、重新升级 |

---

## 2. 测试方式

- **场景 1~12（集成测试）**：`httptest` mock Anthropic / OpenAI 端点 + 内存 Repository 组装完整依赖链（同 gateway main.go memory 分支），通过真实 HTTP 请求端到端验证。
  - 用例文件：[chat_anthropic_integration_test.go](../../backend/internal/controller/chat_anthropic_integration_test.go)（13 个用例）
- **场景 13（真实进程）**：`memory` 存储模式启动真实 gateway 进程（:8080）+ 本地 mock 上游（:19080，按路径区分 OpenAI / Anthropic 响应并记录入站请求），经 Admin API 配置 Provider / 模型 / 绑定 / API Key 后，用 `curl` 调用两条入站路径。
- **场景 14（真实 PostgreSQL 迁移）**：本机 PostgreSQL 14.20（Homebrew，`127.0.0.1:5432`）独立测试库 `nova_migration_test`；先用 `STORAGE_DRIVER=postgres` 的真实 gateway 二进制应用 001~013，灌入存量数据，再复制迁移 014 后重启 gateway 由**真实迁移器** `database.RunMigrations` 执行；`down.sql` 以 `psql -f` 手工执行（迁移器不支持自动 down）。

---

## 3. 测试结果

### 3.1 集成测试（mock）— 13/13 通过

| 用例 | 结果 | 关键断言 |
|------|:----:|----------|
| `TestQA_OpenAIIn_OpenAIOut_NonStream` | ✅ | 出站 `/v1/chat/completions`；`Bearer oai-key`；无 `x-api-key`；请求体原样（system 消息保留） |
| `TestQA_AnthropicIn_AnthropicOut_NonStream` | ✅ | 出站 `/v1/messages`；`x-api-key: ant-key` + `anthropic-version`；无 `Authorization`；`system` 顶层字符串与 `max_tokens` 原样 |
| `TestQA_DualProtocolProvider_BothPaths` | ✅ | 同一 Provider 双端点，OpenAI mock 命中 1 次、Anthropic mock 命中 1 次 |
| `TestQA_StrictMode_AnthropicIn_OpenAIOnlyProvider` | ✅ | 503 + `{"type":"error","error":{"type":"overloaded_error"}}` |
| `TestQA_StrictMode_OpenAIIn_AnthropicOnlyProvider` | ✅ | 503 + `ROUTER001` |
| `TestQA_OpenAIIn_OpenAIOut_Stream` | ✅ | 文本拼接 `Hi from OAI`；usage 8/4；`[DONE]` |
| `TestQA_AnthropicIn_AnthropicOut_Stream` | ✅ | 文本拼接 `Hi from ANT`；usage 11/6；`message_stop` |
| `TestQA_OpenAIIn_OpenAIOut_4xx` | ✅ | 429 原样透传 `rate_limit_error` |
| `TestQA_AnthropicIn_AnthropicOut_4xx` | ✅ | 429 原样透传 `{type:error,error:{...}}` |
| `TestQA_AuthAndValidation` | ✅ | 401 `AUTH001`；缺 `max_tokens` 400 |
| `TestQA_AnthropicStandardErrorCodes` | ✅ | 401 `authentication_error`；404 `not_found_error` |
| `TestQA_ModelsListCompatible` | ✅ | 双协议字段超集 |
| `TestQA_CountTokens` | ✅ | `input_tokens > 0`；缺 `messages` 400 |

### 3.2 真实进程端到端（curl，2026-09-10 实测）

| # | 步骤 | 结果 |
|:-:|------|------|
| 1 | 创建双协议 Provider（OpenAI + Anthropic 端点） | ✅ `id=5`，`protocolType` 由后端推导为 `openai`，`anthropic*` 字段完整返回 |
| 2 | 创建仅 OpenAI 端点 Provider | ✅ `id=6` |
| 3 | 两种端点都不配 → 保存 | ✅ HTTP 400 `VALID001`「at least one protocol endpoint (OpenAI or Anthropic) is required」 |
| 4 | Provider 列表 | ✅ 新字段返回；4 个存量种子 Provider 不受影响 |
| 5 | 绑定模型 `e2e-dual-model` → 双协议 Provider；`e2e-oai-model` → 仅 OpenAI Provider | ✅ |
| 6 | `POST /v1/chat/completions` + `e2e-dual-model` | ✅ 200；上游实际收到 `/v1/chat/completions` + `Authorization: Bearer oai-key`；请求体逐字一致（`{"model":"e2e-dual-model","messages":[{"role":"system","content":"be nice"},{"role":"user","content":"hi"}]}`） |
| 7 | `POST /v1/messages` + `e2e-dual-model` | ✅ 200；上游实际收到 `/v1/messages` + `x-api-key: ant-key` + `anthropic-version: 2023-06-01`；请求体逐字一致（`system` 保持顶层字符串、`max_tokens:128` 保留） |
| 8 | `POST /v1/messages` + `e2e-oai-model`（仅 OpenAI 端点） | ✅ 503 `{"error":{"message":"no provider configured for anthropic protocol","type":"overloaded_error"}}` |
| 9 | 回归：`POST /v1/chat/completions` + `e2e-oai-model` | ✅ 200 |

上游 mock 共收到 3 次请求（2 次 OpenAI 路径 + 1 次 Anthropic 路径），**未出现任何跨协议转换流量**。

### 3.3 回归

- [x] `go build ./...` ✅
- [x] `go vet ./...` ✅
- [x] `go test ./...` 全量通过（含迭代 #006/#007 遗留的 `chat_adapter` 跨协议转换单测，转换器代码保留未删）
- [x] `vue-tsc --noEmit -p tsconfig.json` ✅（admin 前端类型检查）

### 3.4 真实 PostgreSQL 迁移验证（2026-09-10 实测）

环境：PostgreSQL 14.20（Homebrew，`127.0.0.1:5432`）· 独立测试库 `nova_migration_test` · 真实 gateway 二进制（`STORAGE_DRIVER=postgres`）触发 `database.RunMigrations`。

**存量数据（迁移前姿态，模拟生产库）**

| Provider | protocol_type | base_url | api_path | api_key_ref | auth_type |
|----------|:-------------:|----------|----------|-------------|-----------|
| Legacy-Anthropic | anthropic | `https://open.bigmodel.cn/api/anthropic/` | `/v1/messages` | `GLM_ANT_KEY` | `bearer` |
| Legacy-Anthropic-EmptyPath | anthropic | `https://ant.example.com` | （空） | NULL | （空） |
| Plain-OpenAI | openai | `https://api.openai.com` | `/v1/chat/completions` | `OPENAI_API_KEY` | `api_key` |
| Plain-OpenAI-NullKey | openai | `https://dashscope.aliyuncs.com` | `/v1/chat/completions` | NULL | `bearer` |

另插入 `models`（`legacy-chat`）+ 2 条 `model_provider_bindings`，用于验证**存在外键引用**时迁移仍可正常执行。

**up 执行结果**（迁移器日志：`migration applied version=20260910 file=20260910_014_add_provider_anthropic_endpoint.up.sql` → `all migrations up to date`）

| 校验项 | 期望 | 实测 |
|--------|------|:----:|
| 4 个 `anthropic_*` 列新增 | NOT NULL + 默认值 `''` / `'/v1/messages'` / `''` / `'api_key'` | ✅ 与 `information_schema` 定义一致 |
| Legacy-Anthropic 搬运 | 4 项搬到 `anthropic_*`（`base_url` 尾斜杠原样保留） | ✅ `anthropic_base_url='https://open.bigmodel.cn/api/anthropic/'`、`/v1/messages`、`GLM_ANT_KEY`、`bearer` |
| Legacy-Anthropic 原列清空 | `base_url` / `api_path` / `api_key_ref` = `''` | ✅ 三项均为空（`auth_type` 按脚本设计保留） |
| 空值回退（EmptyPath 行） | `api_path` 空 → `/v1/messages`；`api_key_ref` NULL → `''`；`auth_type` 空 → `api_key` | ✅ 全部按 `COALESCE/NULLIF` 预期回退 |
| openai 行不受影响 | OpenAI 端点列不变；`anthropic_base_url` = `''`（未配置） | ✅ 两行均完好 |
| `protocol_type` 保留 | 不被改写 | ✅ 4 行原值不变 |
| 外键完整性 | 关联行不丢失 | ✅ 2 条 binding 完好 |
| `schema_migrations` | 新增 1 条记录 | ✅ `version=20260910` |

**down 回滚结果**

| 校验项 | 期望 | 实测 |
|--------|------|:----:|
| 4 列删除 | 表回到 13 列 | ✅ `anthropic%` 列数 = 0 |
| openai 行数据 | 完好 | ✅ |
| anthropic 行端点 | **全部丢失**（`down.sql` 注释已声明不恢复） | ✅ `base_url=''` 且无 `anthropic_*` 列 → 该 Provider 不可路由 |
| 回滚后再升级 | 端点数据**不会**自动恢复 | ✅ 重启迁移器后 `anthropic_base_url` 仍为空 |
| 备份人工恢复 | 可从备份恢复端点 | ✅ `UPDATE ... FROM providers_backup` 后 4 列值完整还原 |
| 版本记录清理 | 回滚后 `schema_migrations` 同步移除 | ✅ `DELETE 1`，随后重启 gateway 可重新应用 014 |

**本节发现的缺陷（已修复）**

| # | 级别 | 问题 | 处置 |
|:-:|:----:|------|------|
| 1 | **Major** | `down.sql` 未清理 `schema_migrations` 记录：手工回滚后重启，迁移器因「版本已存在」跳过 014，`anthropic_*` 列**永久缺失**，应用运行期查询 `providers` 将因缺列持续报错 | ✅ 已在 `down.sql` 末尾追加 `DELETE FROM schema_migrations WHERE version='20260910';`，并实测「回滚 → 重启 → 重新应用成功」闭环 |
| 2 | Minor | `up.sql` 非幂等（`ADD COLUMN` 无 `IF NOT EXISTS`）；若处于「列存在但无版本记录」的中间态，迁移器重启将报 `column "anthropic_base_url" ... already exists` 并 `os.Exit(1)` | ⚠️ 已实测复现，未改动 up 脚本；运维须避免手工删记录，回滚一律走 `down.sql` |
| 3 | Minor | 迁移文件名 `20260910_014_*` 的 version 前缀解析为 `20260910`（同 013 的 `20260811` 风格），**同日第二个迁移会被静默跳过**：实测放入 `20260910_015_noop.up.sql` 后重启，日志仅 `all migrations up to date`，探针表未创建 | ⚠️ 未改动文件名（避免影响已达成的 013 命名）；建议后续迁移改用 `YYYYMMDDNNNN_` 形式（如 `202609100014_`） |

### 3.5 v1.6.1 增强验证（2026-09-10 实测）

**（1）认证方式可配置 — 单测**

新增 [provider_service_test.go](../../backend/internal/service/provider_service_test.go) 与 [router_service_test.go](../../backend/internal/service/router_service_test.go)：

| 用例 | 断言 | 结果 |
|------|------|:----:|
| `TestNormalizeProviderEndpointsAuthTypeDefault` | 仅 OpenAI 端点 + 空 `authType` → `bearer`；仅 Anthropic 端点 → `api_key`；双端点 → `bearer`；显式 `api_key` 不被覆盖 | ✅ |
| `TestNormalizeProviderEndpointsRequiresOneEndpoint` | 两种端点都空 → `ErrInvalidArgument`（HTTP 400 `VALID001`） | ✅ |
| `TestEndpointForProtocolOpenAIAuthType` | OpenAI 分支 `authType` = `bearer` / `api_key` / 空→`bearer` | ✅ |
| `TestEndpointForProtocolOpenAIMissingEndpoint` | 未配置 OpenAI 端点 → `ok=false` | ✅ |
| `TestCallProviderOpenAIAuthHeaders` | `authType=api_key` → 头含 `x-api-key` 且**不含** `Authorization`；`bearer` → 反之 | ✅ |

**（2）端点连通性测试 — 判定表与单测**

| 情况 | reachable | authOk | message | 实测 |
|------|:---------:|:------:|---------|:----:|
| 网络错误 / 超时 | false | false | 原始错误（如 `dial tcp ...: connect: connection refused`） | ✅ `TestTestEndpointReachability/连接被拒绝` |
| HTTP 401 / 403 | true | false | `认证失败（HTTP 401），请检查 API Key 与认证方式` | ✅ `TestTestEndpointReachability/HTTP 401` |
| 其他任意状态码 | true | true | `端点可达（HTTP 404）` | ✅ `TestTestEndpointReachability/HTTP 200` 与 `/HTTP 404` |
| 非法 Base URL（空 / 非 `http(s)://`） | — | — | HTTP 400 `VALID001` | ✅ `TestTestEndpointRejectsInvalidBaseURL` |

认证头传递：`TestTestEndpointAuthHeaders` 断言 OpenAI `bearer` → `Authorization: Bearer ...` 且无 `x-api-key`；OpenAI `api_key` → `x-api-key` 且无 `Authorization`；Anthropic → `x-api-key` + `anthropic-version` 存在。全部 ✅。

**（3）迁移 015 — 真实 PostgreSQL**

环境同 §3.4（`nova_migration_test`，真实迁移器）。

存量数据（迁移前）：`Plain-OpenAI`（`protocol_type='openai'`、`base_url='https://api.openai.com'`、`auth_type='api_key'`）、`Plain-OpenAI-NullKey`（同 `openai`、`auth_type='bearer'`）、`Legacy-Anthropic`（`anthropic`、`auth_type='bearer'`）。

| 校验项 | 期望 | 实测 |
|--------|------|:----:|
| up 执行 | 迁移器日志 `migration applied version=20260911` | ✅ + `all migrations up to date` |
| `schema_migrations` | 新增 `20260911` | ✅ |
| `auth_type` 列默认值 | `bearer` | ✅ `'bearer'::character varying` |
| 存量 OpenAI 端点修正 | `Plain-OpenAI` 由 `api_key` → `bearer` | ✅ |
| 其他行不受影响 | `Legacy-Anthropic`（`protocol_type='anthropic'`）与已为 `bearer` 的行保持原值 | ✅ |
| 残留统计 | `openai AND base_url<>'' AND auth_type='api_key'` 行数 = 0 | ✅ |
| down 回滚 | 列默认值回 `api_key`、数据回 `api_key`、`20260911` 记录清除 | ✅ |
| 重新升级 | up.sql 可再次执行 | ✅ 再次 `migration applied version=20260911` |

**（4）前端构建**

`vue-tsc --noEmit` ✅；`vite build` ✅（产物 `providers-page-*.js` 17.53 kB）。产物静态校验：含 `anthropicBaseUrl`（双端点表单）、`认证方式`、`测试连通`，且**不含** `协议类型`（确认已移除旧单选下拉）。

---

## 4. Reviewer 审查结论

| # | 级别 | 问题 | 处置 |
|:-:|:----:|------|------|
| 1 | **Major** | `binding.api_path_override` 对两种协议同时生效：双协议 Provider 绑定上的 OpenAI 语义路径覆盖会污染 Anthropic 出站路径（`/v1/messages` 被改写成 `/v1/chat/completions`） | ✅ 已修复：仅 `inbound != anthropic` 时应用覆盖；新增回归断言（去掉修复后该用例实测 FAIL，恢复后 PASS，确认守住了缺陷） |
| 2 | Minor | 存量 `protocol_type='anthropic'` Provider 的端点已由迁移 014 搬运，`base_url` 等列被清空，前端表单 OpenAI 区将显示为空 | 符合设计预期（方案决策 4），已在 Release Note 注明 |
| 3 | Minor | `protocol_type` 保留但不再参与路由，仅由后端按端点推导 | 符合设计预期（方案决策 4） |
| 4 | Info | `provider.BuildOutboundRequest` 在生产链路已无调用方，`chat_adapter.go` 整体保留 | 有意保留：备未来「协议转换」开关复用；不影响二进制行为 |
| 5 | **Major** | 迁移 `down.sql` 未清理 `schema_migrations` 记录，回滚后重启会跳过 014 导致 `anthropic_*` 列永久缺失（详见 §3.4） | ✅ 已修复：`down.sql` 追加版本记录清理，并完成回滚/重新升级闭环实测 |

---

## 5. 通过标准与结论

### 功能验收

- [x] 单 Provider 可同时配置 OpenAI 与 Anthropic 两套端点（分别可空）
- [x] 外部以 OpenAI 地址调用 → 走 OpenAI 端点；以 Anthropic 地址调用 → 走 Anthropic 端点
- [x] 请求体 / 响应体 / SSE / 4xx 错误体均按入站协议原样透传，无隐式跨协议转换
- [x] 缺少匹配协议端点时严格报错（503），不回退转换
- [x] 出站鉴权头按协议正确设置（Bearer vs `x-api-key` + `anthropic-version`）
- [x] 至少需配置一种端点，否则 400 拦截
- [x] Admin 表单支持双端点录入，列表展示协议徽标与双端点

### v1.6.1 增强验收（追加）

- [x] OpenAI 端点认证方式可选 `Bearer` / `x-api-key`，出站头按选择生效（单测断言）
- [x] 存量 OpenAI Provider 认证方式未被改坏（迁移 015 修正为 `bearer`，真实 PostgreSQL 实测）
- [x] 表单校验不再使用 `alert`，改为内联红字（至少一种端点 + URL 格式）
- [x] 表单内可直接测试端点连通性，展示可达 / 认证 / 耗时
- [x] 部署脚本核对迁移 015（列默认值 + 存量残留计数）

### 未覆盖 / 待办

1. ~~**迁移 014 未在真实 PostgreSQL 执行**（本机 Docker 未运行）~~ → ✅ **已完成**：2026-09-10 在本机 PostgreSQL 14.20 独立库实测 up（存量搬运、默认值、外键完整性）与 down（回滚、重新升级、备份恢复），详见 §3.4。
2. **真实厂商端点未实测**：本次为 mock 上游验证，建议生产环境对智谱 / 千问的 OpenAI 与 Anthropic 端点各做一次真实回归（含流式）。
3. **`anthropic_api_path` 默认值**：非 Anthropic Provider 该列保持列默认 `'/v1/messages'`（`anthropic_base_url` 为空，不参与路由），Admin 编辑时 Anthropic 区会显示该默认路径。
4. **生产升级前置动作（新增）**：迁移 014 会**清空**存量 anthropic Provider 的 `base_url` / `api_path` / `api_key_ref`（不可逆），部署前必须备份 `providers` 表；回滚预案须按 §3.4 顺序执行（备份 → 回滚 → 重新升级 → 从备份人工恢复端点）。

---

## 6. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-09-10 | v1.0 | 初始测试报告 |
| 2026-09-10 | v1.1 | 补充 §3.4 真实 PostgreSQL 迁移验证；修复 `down.sql` 版本记录清理缺陷（Major）；状态更新为 PASS |
| 2026-09-10 | v1.2 | 补充 §3.5 v1.6.1 增强验证（认证方式可配置单测、连通性测试判定表、迁移 015 真实 PostgreSQL、前端产物核对） |

---

# End
