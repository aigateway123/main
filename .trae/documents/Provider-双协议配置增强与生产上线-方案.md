# Provider 双协议配置增强与生产上线 方案

Version: v1.0
Status: Draft（待确认）
Owner: AI Project Manager（Architect / Backend / Frontend / Release 协同）
Last Updated: 2026-09-10

---

## 1. Summary

用户诉求两条：

1. Provider 管理需要**同时**配置 OpenAI 与 Anthropic 两套端点；外部系统按请求地址选协议（`/v1/chat/completions` 走 OpenAI 端点、`/v1/messages` 走 Anthropic 端点）。
2. 当前页面上只有「协议类型」下拉单选，要求**同屏出现两套配置字段**。

探查结论：**两条诉求的代码都已实现（v1.6.0），缺的是部署**。

- 后端按入站协议选端点：[router_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/service/router_service.go#L95-L122) `endpointForProtocol` 依据入站 `ChatProtocol` 选择端点列组，不读 `protocol_type`。
- 前端双端点表单：[providers-page.vue](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/admin/src/pages/providers/providers-page.vue#L164-L222) 已移除协议下拉，改为「OpenAI 端点 / Anthropic 端点」两个字段区同屏。
- **线上仍是旧构建**：实测 `http://101.200.198.113:8088/assets/providers-page-BFbtXKXP.js` 中 `协议类型`=1、`protocolType`=1、`anthropicBaseUrl`=**0**、双端点文案=**0**；`协议类型` 在 `admin/src` 全目录已无任何命中 → 线上是 Iteration #006 的产物。[RN-008](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/docs/08-Release/RN-20260910-P1-Iteration-008.md) 状态亦为「Ready for Release，尚未部署」。

用户已确认本次范围：**部署 v1.6.0 到生产** + **三项表单增强**（OpenAI 区认证方式下拉、去掉 alert 改内联校验、表单内端点连通性测试）。

---

## 2. Current State Analysis

### 2.1 已实现部分（不需重做，只需部署）

| 能力 | 位置 | 说明 |
|------|------|------|
| 入站路径 → 协议 | [main.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/cmd/gateway/main.go#L151-L159) | `/v1/chat/completions`→OpenAI，`/v1/messages`→Anthropic（含 `/api/v1/...` 别名） |
| 协议 → 端点列组 | [router_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/service/router_service.go#L95-L122) | Anthropic→`anthropic_*`；OpenAI→`base_url/api_path/api_key_ref`；`protocol_type` 不参与路由 |
| 双端点存储 | [up.sql](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/migrations/20260910_014_add_provider_anthropic_endpoint.up.sql) | `providers` 新增 4 个 `anthropic_*` 列 + 存量搬运 |
| 双端点表单 | [providers-page.vue](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/admin/src/pages/providers/providers-page.vue#L164-L222) | 两个字段区、列表协议徽标、至少一种端点守卫 |
| 仓储层 | [provider_repo_pg.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/repository/provider_repo_pg.go#L21-L23) | `providerColumns` 已含 4 个 anthropic 列 |

### 2.2 本次要新增/修改的缺口

**缺口 A — OpenAI 端点认证方式被硬编码。**
[router_service.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/service/router_service.go#L112-L121) OpenAI 分支固定返回 `"bearer"`；[CallProvider](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/service/router_service.go#L215-L227) 的 `default` 分支固定写 `Authorization: Bearer`。前端也没有 OpenAI 认证方式字段（`ProviderForm` [L11-L23](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/admin/src/pages/providers/providers-page.vue#L11-L23) 无 `authType`）。

**缺口 A 的关键陷阱（必须先处理，否则会打断线上调用）**：`auth_type` 列由迁移 013 加，`DEFAULT 'api_key'`；Iteration #006 的前端在非 anthropic 时强制写入 `authType='api_key'`。因此**生产存量 OpenAI Provider 的 `auth_type` 极可能全是 `'api_key'`**。若直接把 OpenAI 分支改为「读 `auth_type` 决定认证头」，存量 Provider 会从 Bearer 变成 `x-api-key` → **线上 OpenAI 调用全线 401**。

→ 必须同时做数据修正：新增迁移 015 把存量 OpenAI 端点的 `auth_type` 修正为 `'bearer'`，并把列默认值改为 `'bearer'`；同时 [normalizeProviderEndpoints](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/service/provider_service.go#L152-L154) 的默认值改为按端点推导（否则新建的 OpenAI Provider 也会落成 `api_key`）。

**缺口 B — 表单校验用 `alert`。**
[handleSave](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/admin/src/pages/providers/providers-page.vue#L80-L108) L81-L84 用 `alert` 拦截，L105-L107 保存失败也用 `alert`；无 URL 格式校验。

**缺口 C — 无端点连通性测试。**
Provider 只能"保存后靠真实调用试错"。后端无此接口（全仓无 `TestEndpoint`），管理端亦无入口。

**缺口 D — 部署脚本尚未覆盖迁移 015。**
[lib.sh](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/infra/scripts/lib.sh#L68-L79) 的 `migration_file()` 以 `*_add_provider_anthropic_endpoint.*.sql` 通配，`verify_migration` 只核对 014（四列 + `schema_migrations` 的 `20260910`）。

---

## 3. Proposed Changes

> 实施顺序即章节顺序（先低风险后高风险），全部改完后再一次性部署，避免两次触发不可逆的迁移 014。

### 3.1 迁移 015：修正 OpenAI 端点认证方式（新增）

**新增** `backend/migrations/20260911_015_fix_provider_openai_auth_type.up.sql`

```sql
-- 014 起 auth_type 语义 = OpenAI 端点认证方式（013 时该列是 Anthropic 端点语义，默认 'api_key'）
ALTER TABLE providers ALTER COLUMN auth_type SET DEFAULT 'bearer';

-- 存量 OpenAI 端点修正为 Bearer（旧前端写入了 'api_key'，旧代码硬编码 Bearer 故此前未暴露）
UPDATE providers
SET auth_type = 'bearer'
WHERE protocol_type = 'openai' AND base_url <> '' AND auth_type = 'api_key';
```

**新增** `backend/migrations/20260911_015_fix_provider_openai_auth_type.down.sql`

```sql
ALTER TABLE providers ALTER COLUMN auth_type SET DEFAULT 'api_key';

UPDATE providers
SET auth_type = 'api_key'
WHERE protocol_type = 'openai' AND base_url <> '' AND auth_type = 'bearer';

-- 移除迁移记录，使重新升级时 up.sql 能再次执行（同 014 的坑，version = 文件名首个 '_' 之前的部分）
DELETE FROM schema_migrations WHERE version = '20260911';
```

**文件名硬性约束**：`version = 文件名首个 '_' 之前的字符串`，迁移器同日同名会静默跳过。014 占用 `20260910`，015 必须用不同前缀（`20260911`），不得命名成 `20260910_015_*`。

### 3.2 后端：OpenAI 认证方式可配置（改 3 处）

**`backend/internal/service/provider_service.go`**

1. `normalizeProviderEndpoints`（L128-L162）：
   - 新增 `p.AuthType = strings.TrimSpace(p.AuthType)`；
   - 把 L152-L154 的 `if p.AuthType == "" { p.AuthType = "api_key" }` 改为按端点推导：
     ```go
     if p.AuthType == "" {
         if p.BaseURL != "" {
             p.AuthType = "bearer" // OpenAI 兼容端点默认 Bearer
         } else {
             p.AuthType = "api_key"
         }
     }
     ```

**`backend/internal/service/router_service.go`**

2. `endpointForProtocol` OpenAI 分支（L112-L121）：把 `"bearer"` 换成
   ```go
   authType = p.AuthType
   if authType == "" {
       authType = "bearer"
   }
   ```
   并把返回值第 4 项由 `"bearer"` 改为 `authType`。
3. `CallProvider` 的 `default` 分支（L225-L227）：按 `target.AuthType` 选择认证头
   ```go
   default:
       if target.AuthType == "api_key" {
           req.Header.Set("x-api-key", target.ProviderAPIKey)
       } else {
           req.Header.Set("Authorization", "Bearer "+target.ProviderAPIKey)
       }
   ```

`ProviderTarget` 结构已有 `AuthType` 字段（L20），无需改结构体。

### 3.3 后端：端点连通性测试接口（新增）

**`backend/internal/dto/provider_request.go`** 追加：

```go
// TestEndpointRequest 端点连通性探测请求（不落库，供 Admin 表单即时测试）
type TestEndpointRequest struct {
    Protocol  string `json:"protocol"`  // openai | anthropic，空视为 openai
    BaseURL   string `json:"baseUrl"`
    APIPath   string `json:"apiPath"`
    AuthType  string `json:"authType"`
    APIKeyRef string `json:"apiKeyRef"`
}

type TestEndpointResponse struct {
    Reachable  bool   `json:"reachable"`
    AuthOK     bool   `json:"authOk"`
    StatusCode int    `json:"statusCode"`
    LatencyMs  int64  `json:"latencyMs"`
    Message    string `json:"message"`
}
```

**`backend/internal/service/provider_service.go`** 新增：

- 结构体加 `httpClient *http.Client`，在 `NewProviderService` 内初始化为 `&http.Client{Timeout: 6 * time.Second}`（**保持函数签名不变**，避免破坏 [chat_anthropic_integration_test.go](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/controller/chat_anthropic_integration_test.go) 的 `setupQAEnv`）。
- `func (s *ProviderService) TestEndpoint(ctx context.Context, req *dto.TestEndpointRequest) (*dto.TestEndpointResponse, error)`：
  1. 校验：`BaseURL` 去空格后非空且以 `http://` / `https://` 开头，否则返回 `&ValidationError{...}`（映射 400 `VALID001`）；协议非 `anthropic` 时按 openai 处理。
  2. 路径默认值：openai `""` → `/v1/chat/completions`；anthropic `""` → `/v1/messages`。
  3. 发 **GET** 请求（无 body，**零 token 消耗**），`strings.TrimRight(baseURL, "/") + apiPath`；认证头与出站一致：`api_key` → `x-api-key`，否则 `Authorization: Bearer`；anthropic 额外加 `provider.AnthropicHeaders()`。
  4. 判定规则：

     | 情况 | reachable | authOK | message 示例 |
     |------|:---------:|:------:|--------------|
     | 网络错误 / 超时 | false | false | `dial tcp ...: connection refused` / `context deadline exceeded` |
     | HTTP 401 / 403 | true | false | `认证失败（401），请检查 API Key 与认证方式` |
     | 其他任意 HTTP 状态（含 400/404/405/429/5xx） | true | true | `端点可达（HTTP 404）` |

  5. 返回 `LatencyMs` 为本次请求耗时（毫秒）。

**`backend/internal/controller/provider_controller.go`** 新增 `HandleTestEndpoint`，仿 `HandleCreate` 写法：解码失败 → 400 `VALID001`；`errors.Is(err, service.ErrInvalidArgument)` → 400 `VALID001` 并透出 `err.Error()`；默认 → 500 `GATEWAY001`；成功 → 200 `types.APIResponse[*dto.TestEndpointResponse]`。

**`backend/cmd/gateway/main.go`** 在 L179（`DELETE /api/v1/providers/{id}`）后追加：

```go
protectedMux.HandleFunc("POST /api/v1/providers/test-endpoint", providerCtrl.HandleTestEndpoint)
```

路由无冲突：`POST /api/v1/providers` 是精确路径，`/api/v1/providers/{id}` 未注册 POST。外层 `mux.Handle("/api/v1/providers/", protected)`（L255）已覆盖该路径。RBAC 走 [rbac_middleware.go L61-L67](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/middleware/rbac_middleware.go#L60-L68)：providers 前缀 + 非 GET → 需要 `admin:provider:manage`，与增删改一致，**无需改 RBAC**。

### 3.4 前端：Provider 表单三项增强

**`admin/src/api/providers.ts`** 追加：

```ts
export interface TestEndpointRequest {
  protocol: string
  baseUrl: string
  apiPath?: string
  authType?: string
  apiKeyRef?: string
}
export interface TestEndpointResponse {
  reachable: boolean
  authOk: boolean
  statusCode: number
  latencyMs: number
  message: string
}
export async function testProviderEndpointApi(data: TestEndpointRequest): Promise<TestEndpointResponse> {
  const res = await httpClient.post('/api/v1/providers/test-endpoint', data)
  return res.data.data
}
```

**`admin/src/pages/providers/providers-page.vue`**

1. **OpenAI 认证方式字段**
   - `ProviderForm` 增加 `authType: string`；`emptyForm()` 增加 `authType: 'bearer'`。
   - `openEdit` 回填：`authType: p.authType === 'api_key' ? 'api_key' : 'bearer'`。
   - 模板 OpenAI 区内（L182-L186 的「API Key 引用」改为 `grid grid-cols-2 gap-4`，右列放同名下拉，选项与 Anthropic 区一致：`bearer`→`Bearer`、`api_key`→`x-api-key`）。
   - `handleSave` 中 OpenAI 端点为空时一并把 `payload.authType = ''`（与 L87-L91 的清空逻辑同处）。
2. **内联校验替代 alert**
   - 新增 `const formErrors = ref<{ general?: string; baseUrl?: string; anthropicBaseUrl?: string }>({})`，在 `openCreate`/`openEdit` 中重置。
   - 新增 `validateForm(): boolean`：至少配置一种端点 → `general`；已填写的 Base URL 必须匹配 `/^https?:\/\/.+/i` → 对应 `baseUrl` / `anthropicBaseUrl`。
   - `handleSave` 首行改调 `validateForm()`，不通过直接 `return`（不再 `alert`）；`catch` 分支写 `formErrors.general = error?.response?.data?.message || '保存失败'`。
   - 模板：表单顶部渲染 `general` 红色条；OpenAI 区、Anthropic 区底部各渲染各自字段错误红字。输入框 `@input` 时清除对应错误。
3. **端点连通性测试**
   - 新增 `const testState = ref<{ openai: TestState; anthropic: TestState }>({...})`，`TestState = { loading: boolean; result: TestEndpointResponse | null; error: string }`。
   - `testEndpoint(which: 'openai' | 'anthropic')`：取对应区的 baseUrl/apiPath/authType/apiKeyRef 调 `testProviderEndpointApi`，结果写入 `testState`；`openCreate`/`openEdit` 时重置。
   - 模板：每个端点区标题行右侧放「测试连通」按钮（`loading` 时禁用并显示"测试中…"），下方结果行：可达且 authOk → 绿色 `端点可达 · HTTP {statusCode} · {latencyMs}ms`；可达但 authOk=false → 红色 `认证失败（{statusCode}）`；不可达 → 红色 `不可达：{message}`。
   - 表单尚未填 baseUrl 时按钮禁用。
4. **列表展示**：L291-L300「端点」列的 OpenAI 行 `code` 后追加一个小徽标显示 `Bearer` / `x-api-key`（与 Anthropic 行展示方向对齐），便于区分配置。

### 3.5 部署脚本适配迁移 015

**`infra/scripts/lib.sh`**

- 新增常量数组与参数化函数：
  ```bash
  # 本次发布涉及的迁移（基名，不含 .up/.down 后缀）；按文件名升序执行
  MIGRATIONS=(
    "20260910_014_add_provider_anthropic_endpoint"
    "20260911_015_fix_provider_openai_auth_type"
  )
  MIGRATION_014="${MIGRATIONS[0]}"

  migration_file() { # $1=迁移基名 $2=up|down
    local f="$REPO_ROOT/backend/migrations/$1.$2.sql"
    [[ -f "$f" ]] || die "未找到迁移文件：$1.$2.sql"
    printf '%s' "$f"
  }
  migration_version() { printf '%s' "${1%%_*}"; } # $1=迁移基名
  ```
- `verify_migration` 改为遍历 `MIGRATIONS`：
  - 每个迁移：`schema_migrations` 中存在 `migration_version <基名>`；不存在则告警并 `fail=1`；
  - 014 专属：4 个 `anthropic_*` 列存在 + 存量搬运对比（沿用现有 `is_pre_migration_backup` 分支）；
  - 015 专属：`auth_type` 列默认值为 `bearer`（查 `information_schema.columns.column_default`）；存量 openai 端点仍为 `api_key` 的行数为 0。
  - 汇总输出 `version=` 列表。

**`infra/scripts/deploy.sh`**：调用点适配 `verify_migration`（内部已遍历，无需改参数）；`migration_done` 判定保持依据 `anthropic_base_url` 列存在与否。

**`infra/scripts/rollback.sh`**：`down_file="$(migration_file "$MIGRATION_014" down)"`；**只回滚 014**，015 不回滚——理由：015 无结构变更与数据丢失，旧代码硬编码 Bearer 完全忽略 `auth_type`，新代码需要它，两种回滚场景下保留 015 均无害（见 §4 决策）。

### 3.6 文档同步

- `docs/08-Release/RN-20260910-P1-Iteration-008.md`：追加「§9 迭代内增强（v1.6.1）」——三项表单增强、迁移 015、OpenAI 认证方式语义与存量修正、回滚说明；§3/§4 数据库变更补迁移 015；Status 在部署完成后改为 `Released`。
- `docs/03-test/TEST-20260910-DualProtocol-Native.md`：追加本次增强的验证结论（单测、连通性测试判定表、生产部署后核对结果）。
- 设计基线 `.trae/documents/Provider-双协议原生直连-方案.md` **不改**（避免范围蔓延），差异记录在 RN-008 §9。

---

## 4. Assumptions & Decisions

| # | 决策 | 依据 |
|:-:|------|------|
| 1 | 一致性：先改完代码再一次性部署，不做两次发布 | 迁移 014 不可逆且需人工备份恢复，避免重复触发 |
| 2 | 迁移 015 用 `20260911_` 前缀 | 迁移器 `version = 文件名首个 '_' 之前`，同日相同前缀会被静默跳过（014 文档已记录该隐患） |
| 3 | `api_key_ref` 中存的是**明文 Key**，可直接用于连通性测试 | [endpointForProtocol](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/internal/service/router_service.go#L111) 把它作为 `apiKey` 直接放进认证头；[setup.sh](file:///Users/fuxiansheng/Desktop/文档/个人/星诺创新/项目/AI%20Gateway/aigateway/backend/setup.sh#L35) 亦写入明文 `sk-...` |
| 4 | 连通性测试用 GET 探测（无 body），**不消耗 token** | 目标是验证"网络可达 + 认证被接受"，而非验证模型可用性（后者需 model 参数，Provider 未必绑定模型） |
| 5 | 连通性测试不做内网地址黑名单，仅校验 `http(s)://` | Provider 的 `base_url` 本就允许私有部署中转；该接口与增删改同为 `admin:provider:manage` 权限。SSRF 风险作为已知限制记录在 RN-008 |
| 6 | 015 不纳入 `rollback.sh` | 旧代码硬编码 Bearer，忽略 `auth_type`；新代码需要它。两种回滚场景保留均无害 |
| 7 | OpenAI 认证方式下拉取值用 `bearer` / `api_key`（与 Anthropic 区一致）；`api_key` 出站发 `x-api-key` | 沿用既有 `auth_type` 值域，避免新增语义 |
| 8 | 表单不新增"名称必填"等既有行为之外的限制 | 与现状保持一致，只补用户要求的三项 |

---

## 5. Verification

### 5.1 后端

1. `cd backend && go vet ./... && go build ./... && go test ./...` 全量通过（既有 OpenAI/Anthropic 链路零回归）。
2. 新增 `backend/internal/service/provider_service_test.go`：
   - `normalizeProviderEndpoints`：OpenAI 端点 + 空 `authType` → `bearer`；仅 Anthropic 端点 → `api_key`；两种端点都空 → `ValidationError`。
   - `TestEndpoint`：用 `httptest` 覆盖三种判定（200→reachable/authOK 真；401→reachable 真 / authOK 假；无效域名或超时→reachable 假）。
3. 新增/扩展路由测试（`backend/internal/service/router_service_test.go` 或在既有集成测试中加场景）：
   - `endpointForProtocol`：OpenAI Provider `authType=bearer` → `bearer`；`authType=api_key` → `api_key`；空 → `bearer`。
   - `CallProvider` 头断言：`authType=api_key` 的 OpenAI 出站请求头含 `x-api-key` 且不含 `Authorization`；`bearer` 反之。

### 5.2 前端

`cd admin && pnpm build`（`vue-tsc --noEmit && vite build`）类型检查与构建通过。
本地 `pnpm dev` 人工确认：两个端点区同屏、OpenAI 认证方式可选、空端点提交时不弹 alert 而显示红字、URL 非法时红字提示、点「测试连通」能出结果（构造一个必然失败的 URL 验证红色分支）。

### 5.3 迁移（真实 PostgreSQL，沿用既有演练方式）

库 `nova_migration_test`（127.0.0.1:5432）：
1. 造存量数据：1 条 `protocol_type='openai'` 且 `auth_type='api_key'` 的行；
2. 由真实迁移器应用 015 → 断言该行 `auth_type='bearer'`、`auth_type` 列默认值 `bearer`、`schema_migrations` 新增 `20260911`；
3. 执行 015 down.sql → 断言列默认值回到 `api_key`、数据回到 `api_key`、`20260911` 记录被清除；
4. 重新升级 → 断言 up.sql 可再次执行。

### 5.4 部署与生产验收

1. `bash infra/scripts/deploy.sh`（自动 `providers` 备份 → `git pull --ff-only` → `up -d --build` → 迁移核对 → 健康检查）。
2. 迁移核对须同时通过 014 与 015 两项（脚本输出逐条 OK）。
3. 前端上线校验（无需登录凭据）：`curl -s http://101.200.198.113:8088/ | grep -o 'assets/providers-page-[^"]*\.js'` 取新 chunk，`grep -c anthropicBaseUrl` ≥ 1 且 `grep -c 协议类型` = 0。
4. 生产回归（需上游 Key）：
   - Admin 配置一个双端点 Provider → 点「测试连通」两区均绿色；
   - `/v1/chat/completions` 调用命中 OpenAI 端点、`/v1/messages` 调用命中 Anthropic 端点（含流式）；
   - 既有仅 OpenAI 的 Provider 调用**不回归**（验证迁移 015 生效）。
5. `bash infra/scripts/deploy.sh verify` 复跑只读核对。

### 5.5 回滚

| 场景 | 动作 |
|------|------|
| 前端/后端逻辑异常（迁移已成功） | `git revert` 相关提交 → 重跑 `deploy.sh`（015 无需回滚，保留无害） |
| 迁移 014 引发问题 | `bash infra/scripts/rollback.sh reupgrade`（回滚 → 重启重应用 → 从备份恢复端点） |
| 需退回旧版代码 | `bash infra/scripts/rollback.sh legacy`（还原 `base_url / api_path / api_key_ref`）后 `git revert` |
| 仅某个 Provider 认证方式配错 | 直接在表单改回 `Bearer` 保存，无需回滚 |

---

## 6. 实施顺序（Todo 拆分）

1. 迁移 015（up/down）+ 真实 PostgreSQL 演练（§5.3）
2. 后端 OpenAI 认证方式三处改动 + 单测（§3.2 / §5.1-2）
3. 后端连通性测试接口 DTO/service/controller/route + 单测（§3.3 / §5.1-3）
4. `go vet` / `go build` / `go test ./...` 全量通过
5. 前端 API 类型 + 表单三项增强 + 列表徽标（§3.4）
6. `pnpm build` 通过 + 本地 `pnpm dev` 人工确认（§5.2）
7. 部署脚本适配 015 + `bash -n` 三文件（§3.5）
8. 文档同步 RN-008 / TEST 报告（§3.6）
9. 提交推送（`feat(admin)` / `feat(gateway)` / `chore(infra)` / `docs` 原子提交）
10. 执行 `deploy.sh` 上线 + 生产验收（§5.4）
