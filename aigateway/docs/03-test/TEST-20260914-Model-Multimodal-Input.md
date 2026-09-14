# QA 测试用例 — 模型管理「多模态输入」字段

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.0 |
| 状态 | **⏳ 待执行**（阻塞：迁移与端到端验收需在测试环境执行 Docker / DB，Harness 按 AGENTS.md 不执行） |
| Owner | QA Engineer |
| 日期 | 2026-09-14 |
| 测试对象 | backend `entity/model.go` / `dto/model_request.go` / `repository/model_repo_pg.go` / `repository/model_repository.go` / `service/model_service.go` / 迁移 `202609140001` + admin 模型管理页 |
| 关联文档 | [ARCH-20260914-Model-Multimodal-Input.md](../02-architecture/ARCH-20260914-Model-Multimodal-Input.md)、[REV-20260914-ARCH-Model-Multimodal-Input.md](../review/REV-20260914-ARCH-Model-Multimodal-Input.md) |
| 前置 | 迁移 `202609140001_add_model_multimodal` |

---

## 1. 测试范围

| # | 场景 | 覆盖点 |
|:-:|------|--------|
| 1 | 迁移 up / down | 列新增、默认值、回滚闭环 |
| 2 | 存量数据兼容 | 升级后存量模型默认 `false`，无行为变更 |
| 3 | 后端 API 正常流 | 创建 / 列表 / 详情 / 编辑读写新字段 |
| 4 | **部分更新保留（关键回归）** | 编辑不传 `supportsMultimodal` 时保留原值 |
| 5 | 既有缺陷回归 | 编辑 image 模型不传 `modelType` 时 `model_type` 不再被重置为 `chat` |
| 6 | 边界与异常 | 非法类型 400、不存在模型 404、重复编码 409 |
| 7 | 对外契约回归 | `/v1/models`（OpenAI / Anthropic 兼容）不暴露该字段；推理链路不受影响 |
| 8 | Admin 前端 | 表单开关、非 chat 禁用、列表标签、保存刷新 |
| 9 | memory 模式 | seed 数据标记一致 |

---

## 2. 测试环境与方式

| 场景组 | 方式 |
|--------|------|
| 3 / 4 / 5 / 6 | 后端 API 端到端（`memory` 存储模式启动真实 gateway，`curl` 调用 Admin API） |
| 1 / 2 | 真实 PostgreSQL：测试库应用迁移器，对比 `information_schema` 与存量数据 |
| 7 | 真实进程 + `curl` 打双协议兼容端点 |
| 8 | Admin 前端构建 + 浏览器走查（`npm run build` 产物 + 页面操作） |
| 9 | `memory` 模式启动，`curl` 查列表 |

> 所有 `curl` 需先经登录获取 JWT，并按 RBAC 具备 `admin:model:manage`。

---

## 3. 测试用例

### 3.1 迁移与数据层

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-01 | P0 | 存量库（001~前一版本已应用） | 启动 gateway，触发 `RunMigrations` | 日志出现 `migration applied version=202609140001`，随后 `all migrations up to date`；`schema_migrations` 新增 1 条 | 待执行 | ⏳ |
| TC-02 | P0 | TC-01 | 查 `information_schema.columns` 中 `models.supports_multimodal` | 存在，`data_type=boolean`，`is_nullable=NO`，`column_default=false` | 待执行 | ⏳ |
| TC-03 | P0 | TC-01 | `SELECT count(*) FROM models WHERE supports_multimodal IS NULL` | `0` | 待执行 | ⏳ |
| TC-04 | P1 | TC-01 | `psql -f 202609140001_add_model_multimodal.down.sql` 后重启 gateway | 列被删除；删除 `schema_migrations` 记录后重启可**再次应用** up（回滚闭环） | 待执行 | ⏳ |
| TC-05 | P1 | 存量含被 `model_provider_bindings` 引用的模型 | 同 TC-01 | 关联 binding 行不丢失（外键完整） | 待执行 | ⏳ |

### 3.2 后端 API — 正常流

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-06 | P0 | memory 模式已启动 | `POST /api/v1/models`，body 不含 `supportsMultimodal` | 201/200；响应 `supportsMultimodal=false` | 待执行 | ⏳ |
| TC-07 | P0 | 同上 | `POST /api/v1/models`，body `{"supportsMultimodal":true}` | 响应 `supportsMultimodal=true`；`GET /api/v1/models/{id}` 复核为 `true` | 待执行 | ⏳ |
| TC-08 | P1 | 同上 | `POST /api/v1/models`，body `{"supportsMultimodal":false}`（显式） | 响应 `false` | 待执行 | ⏳ |
| TC-09 | P0 | 存在多模型 | `GET /api/v1/models` | 返回数组；**每条**均含 `supportsMultimodal` 布尔字段 | 待执行 | ⏳ |
| TC-10 | P0 | 某模型 `supportsMultimodal=true` | `PUT /api/v1/models/{id}` 显式传 `false` | 响应 `false`；复核持久化为 `false` | 待执行 | ⏳ |
| TC-11 | P0 | 某模型 `supportsMultimodal=false` | `PUT` 显式传 `true` | 响应 `true`；复核持久化为 `true` | 待执行 | ⏳ |

### 3.3 后端 API — 部分更新保留（关键回归）

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-12 | **P0** | 某 chat 模型 `supportsMultimodal=true` | `PUT /api/v1/models/{id}`，body **不含** `supportsMultimodal`（仅改名称） | 响应与持久化仍为 `true`（**不得被重置为 false**） | 待执行 | ⏳ |
| TC-13 | **P0** | 某 **image** 模型（`model_type=image`） | `PUT`，body 不含 `modelType`（模拟前端编辑分支） | `model_type` 保持 `image`（不得回落 `chat`）—— 既有缺陷修复验证 | 待执行 | ⏳ |
| TC-14 | P0 | 某 chat 模型 | `PUT`，body 不含 `modelType` | `model_type` 保持 `chat` | 待执行 | ⏳ |
| TC-15 | P1 | 某模型 `is_public=true` | `PUT`，body 不含 `isPublic` | `is_public` 保持 `true` | 待执行 | ⏳ |
| TC-16 | P1 | 某模型，`modelCode` 保持不变 | `PUT`，body 不含 `modelCode` | `model_code` 保持原值（空串回退既有值） | 待执行 | ⏳ |

### 3.4 后端 API — 边界与异常

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-17 | P1 | — | `POST /api/v1/models`，`{"supportsMultimodal":"yes"}`（非法类型） | HTTP 400 `VALID001`（JSON 解码失败，不写入） | 待执行 | ⏳ |
| TC-18 | P1 | — | `PUT /api/v1/models/999999`，body 合法 | HTTP 404 `AUTH002` `model not found` | 待执行 | ⏳ |
| TC-19 | P2 | 已存在 `modelCode=X` | `POST /api/v1/models` 复用 `X` | HTTP 409 `VALID001` `model code already exists` | 待执行 | ⏳ |
| TC-20 | P2 | — | `PUT /api/v1/models/abc`（非数字 id） | HTTP 400 `VALID001` `invalid model id` | 待执行 | ⏳ |

### 3.5 对外契约与推理链路回归

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-21 | P0 | 存在 `supportsMultimodal=true` 的模型 | `GET /v1/models`（OpenAI 兼容） | 响应体内**不含** `supportsMultimodal`（SDK 兼容不受影响） | 待执行 | ⏳ |
| TC-22 | P1 | 同上 | `GET /v1/models`（Anthropic 兼容超集，如存在） | 不含 `supportsMultimodal` | 待执行 | ⏳ |
| TC-23 | P0 | 已绑定 Provider 的 chat 模型 | `POST /v1/chat/completions` | 正常 200，行为与改动前一致（该字段不参与主链路） | 待执行 | ⏳ |
| TC-24 | P1 | 含图片输入的多模态模型 | `POST /v1/chat/completions`（带 image 内容块） | 本期**不做**校验拦截，请求按原逻辑转发（确认无意外拦截） | 待执行 | ⏳ |

### 3.6 Admin 前端

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-25 | P0 | 打开「添加 Model」 | 观察「多模态输入」开关 | 默认**关闭**；模型类型为 `chat` 时可交互，文案「不允许：仅接受文本输入」 | 待执行 | ⏳ |
| TC-26 | P0 | 同上 | 模型类型切换为 `image` | 开关**禁用**（灰化）并显示「仅对话模型支持多模态输入标记」 | 待执行 | ⏳ |
| TC-27 | P1 | TC-26 | 切回 `chat` | 开关恢复可交互 | 待执行 | ⏳ |
| TC-28 | P0 | 编辑一个 `supportsMultimodal=true` 的模型 | 打开编辑弹窗 | 开关为**打开**状态 | 待执行 | ⏳ |
| TC-29 | P0 | 列表中存在 true / false 两种模型 | 观察「多模态输入」列 | true → 显示「🖼️ 多模态」标签；false → 显示「—」 | 待执行 | ⏳ |
| TC-30 | P0 | 编辑弹窗开启开关并保存 | 保存后观察列表 | 提示成功，列表刷新，该行显示「🖼️ 多模态」 | 待执行 | ⏳ |
| TC-31 | P1 | 编辑弹窗仅改名称（不动开关） | 保存后刷新页面再进入编辑 | 开关保持原状态（端到端贯通 TC-12） | 待执行 | ⏳ |
| TC-32 | P2 | 构建产物 | `npm run build` 后检查 `models-page-*.js` | 含「多模态输入」「仅对话模型支持多模态输入标记」文案 | 待执行 | ⏳ |

### 3.7 memory 模式 seed

| ID | 优先级 | 前置 | 步骤 | 预期结果 | 实际 | 结果 |
|----|:------:|------|------|----------|------|:----:|
| TC-33 | P1 | `memory` 模式首次启动 | `GET /api/v1/models` | `gpt-4o-mini` → `supportsMultimodal=true`；其余 seed 模型 → `false` | 待执行 | ⏳ |

---

## 4. 本地门禁（已在编码阶段执行）

| 检查项 | 结果 |
|--------|:----:|
| `go build ./...` | ✅ |
| `go vet ./...` | ✅ |
| `vue-tsc --noEmit` | ✅ |
| `npm run build` | ✅ |

> 以上为编译/类型门禁，**不替代** TC-01~TC-33 的运行时验收。

---

## 5. 通过标准

- [ ] TC-01 ~ TC-05：迁移 up/down 与存量兼容全部通过
- [ ] TC-06 ~ TC-11：字段读写正常
- [ ] **TC-12 / TC-13：部分更新保留 2 项 P0 必过**（对应 Reviewer 风险 1 与既有 `model_type` 缺陷）
- [ ] TC-17 ~ TC-20：异常路径返回正确状态码
- [ ] TC-21 ~ TC-23：对外契约与推理链路无回归
- [ ] TC-25 ~ TC-31：前端交互与端到端贯通
- [ ] 不通过项 = 0

---

## 6. 阻塞与待办

| # | 事项 | 说明 |
|:-:|------|------|
| 1 | **运行时验收未执行** | 需在具备 PostgreSQL 的测试环境应用迁移并启动服务；Harness 按 AGENTS.md 不执行 Docker / 迁移，须人工或 CI 执行 |
| 2 | 真实厂商多模态调用回归 | 本期字段为「仅标记」，不涉及网关校验；如需验证图片输入转发，需有效上游 Key |

---

## 7. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-09-14 | v1.0 | 初始用例文档（33 条用例，状态：待执行） |

---

# End
