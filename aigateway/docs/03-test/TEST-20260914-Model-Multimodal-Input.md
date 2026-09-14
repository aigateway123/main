# QA 测试用例 — 模型管理「多模态输入」字段

## 元信息

| 字段 | 值 |
|------|-----|
| 版本 | v1.2 |
| 状态 | **✅ 已执行**（43/52 PASS，8 项阻塞，1 项 N/A；无 FAIL） |
| Owner | QA Engineer |
| 日期 | 2026-09-14 |
| 测试对象 | 后端 `entity/model.go` / `dto/model_request.go` / `repository/model_repo_pg.go` / `repository/model_repository.go` / `service/model_service.go` / `controller/model_controller.go` / 迁移 `202609140001` + admin 模型管理页（含筛选） |
| 关联文档 | [ARCH-20260914-Model-Multimodal-Input.md](../02-architecture/ARCH-20260914-Model-Multimodal-Input.md)、[REV-20260914-ARCH-Model-Multimodal-Input.md](../review/REV-20260914-ARCH-Model-Multimodal-Input.md) |
| 前置 | 迁移 `202609140001_add_model_multimodal` |
| 执行人 | QA Engineer（AI）+ 本地环境 |

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
| 10 | **多模态输入筛选（新增）** | 列表按 `supportsMultimodal` 过滤、与 `modelType` 组合、非法值、Admin 下拉端到端 |

---

## 2. 测试环境与方式（实际执行）

| 场景组 | 环境 | 结果 |
|--------|------|:----:|
| 3 / 4 / 5 / 6 | 真实 gateway 进程，`STORAGE_DRIVER=memory`，`127.0.0.1:18080`；`curl` 打 Admin API（JWT：`admin@test.com`） | ✅ 已执行 |
| 7 | 同上进程，`curl` 打 `/v1/models`（API Key 鉴权） | ✅ 已执行 |
| 8 | Admin 前端 `vite dev`（`127.0.0.1:3000`，`/api` 代理至 gateway `:8080`）+ 浏览器实机走查 | ✅ 已执行 |
| 9 | `memory` 模式启动，`curl` 查列表 | ✅ 已执行 |
| 1 / 2 | **需真实 PostgreSQL** | ⛔ 阻塞（环境不可用） |

> 说明：本次未使用 Docker、未执行数据库迁移、未触碰生产环境与生产凭据。

---

## 3. 测试用例（结果已回填）

### 3.1 迁移与数据层

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-01 | P0 | 存量库启动 gateway，触发 `RunMigrations` | 出现 `migration applied version=202609140001` | 未执行 | ⛔ 阻塞 |
| TC-02 | P0 | 查 `information_schema.columns` | `boolean` / `NOT NULL` / 默认 `false` | 未执行 | ⛔ 阻塞 |
| TC-03 | P0 | `SELECT count(*) ... WHERE supports_multimodal IS NULL` | `0` | 未执行 | ⛔ 阻塞 |
| TC-04 | P1 | 执行 down 后重启，再 up | 列删除；可重复应用 | 未执行 | ⛔ 阻塞 |
| TC-05 | P1 | 检查 `model_provider_bindings` | 关联行不丢失 | 未执行 | ⛔ 阻塞 |

**说明**：TC-01~05 为 PostgreSQL 专属路径，本地无可用 PG 且 Harness 不执行迁移，故如实标记为阻塞，**未做任何推断性结论**。注：`ADD COLUMN ... NOT NULL DEFAULT false` 在 PG 11+ 为 O(1) 元数据操作，风险低，但仍需上线前补测。

### 3.2 后端 API — 正常流

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-06 | P0 | `POST /api/v1/models` 不含 `supportsMultimodal` | 创建成功，`false` | **HTTP 201**，`supportsMultimodal=false` | ✅ PASS |
| TC-07 | P0 | `POST` 传 `supportsMultimodal:true` | `true` 并持久化 | **HTTP 201**，`true`；GET 复核 `true` | ✅ PASS |
| TC-08 | P1 | `POST` 显式传 `false` | `false` | **HTTP 201**，`false` | ✅ PASS |
| TC-09 | P0 | `GET /api/v1/models` | 每条均含该字段 | **HTTP 200**，返回 7 条 seed，每条均含 `supportsMultimodal` 布尔值 | ✅ PASS |
| TC-10 | P0 | `PUT` 显式 `true→false` | 变更为 `false` | **HTTP 200**，返回 `false` | ✅ PASS |
| TC-11 | P0 | `PUT` 显式 `false→true` | 变更为 `true` | **HTTP 200**，返回 `true` | ✅ PASS |

### 3.3 后端 API — 部分更新保留（关键回归）

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-12 | **P0** | `PUT /api/v1/models/9` 仅改 `modelName`，**不传** `supportsMultimodal`（原值 `true`） | 保持 `true` | **HTTP 200**，响应 `supportsMultimodal=true`；`GET /api/v1/models/9` 复核仍为 `true` | ✅ **PASS** |
| TC-13 | **P0** | `PUT /api/v1/models/11`（`modelType=image`）**不传** `modelType` | 保持 `image` | **HTTP 200**，`modelType="image"`（既有缺陷未复现） | ✅ **PASS** |
| TC-14 | P0 | `PUT` chat 模型不传 `modelType` | 保持 `chat` | **HTTP 200**，`modelType="chat"` | ✅ PASS |
| TC-15 | P1 | `PUT` 不传 `isPublic`（原 `true`） | 保持 `true` | **HTTP 200**，`isPublic=true` | ✅ PASS |
| TC-16 | P1 | `PUT` 传 `modelCode:""` | 保留原 `model_code` | **HTTP 200**，`modelCode="qa-mm-true"` 未变 | ✅ PASS |

### 3.4 后端 API — 边界与异常

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-17 | P1 | `POST` 传 `supportsMultimodal:"yes"` | 400 `VALID001`，不写入 | **HTTP 400** `VALID001` `invalid request body` | ✅ PASS |
| TC-18 | P1 | `PUT /api/v1/models/999999` | 404 | **HTTP 404** `AUTH002` `model not found` | ✅ PASS |
| TC-19 | P2 | `POST` 复用已存在 `modelCode` | 409 | **HTTP 409** `VALID001` `model code already exists` | ✅ PASS |
| TC-20 | P2 | `PUT /api/v1/models/abc` | 400 | **HTTP 400** `VALID001` `invalid model id` | ✅ PASS |

### 3.5 对外契约与推理链路回归

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-21 | P0 | `GET /v1/models`（OpenAI 兼容，API Key） | 不含 `supportsMultimodal` | **HTTP 200**，`grep -c supportsMultimodal` = **0**（12 条模型，字段结构为 `id/object/created/owned_by/type/display_name/created_at`） | ✅ PASS |
| TC-22 | P1 | Anthropic 兼容模型端点 | 不含该字段 | 反查路由表：模型发现**仅有一个端点** `GET /v1/models`，Anthropic 侧无独立 models 端点 | — N/A |
| TC-23 | P0 | `POST /v1/chat/completions` | 与改动前一致 | 未执行（需有效上游 Provider Key） | ⛔ 阻塞 |
| TC-24 | P1 | 带 image 内容块的 chat 请求 | 无意外拦截 | 未执行（需有效上游 Provider Key） | ⛔ 阻塞 |

### 3.6 Admin 前端

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-25 | P0 | 打开「添加 Model」观察开关 | 默认关闭；chat 下可交互 | 默认关闭（`checked=false`），文案「不允许：仅接受文本输入」；类型为 chat 时 `disabled=false` 可点击，点击后文案变「允许：可输入图片等非文本内容」 | ✅ PASS |
| TC-26 | P0 | 模型类型切为 `image` | 开关禁用 + 提示 | `disabled=true`、`cursor:not-allowed`，提示「仅对话模型支持多模态输入标记」 | ✅ PASS |
| TC-27 | P1 | 切回 `chat` | 恢复可交互 | `disabled=false`，文案恢复「不允许：仅接受文本输入」 | ✅ PASS |
| TC-28 | P0 | 编辑 `GPT-4o Mini` | 开关为打开 | 弹窗中 `checked=true`，文案「允许：可输入图片等非文本内容」 | ✅ PASS |
| TC-29 | P0 | 观察列表「多模态输入」列 | true → 标签；false → 「—」 | GPT-4o Mini 显示「🖼️ 多模态」；DeepSeek Chat / GLM-4 / Qwen Max / GLM-Image / Wan2.7-Image-Pro / Qwen-Image-2.0 均显示「—」（与 seed 完全吻合） | ✅ PASS |
| TC-30 | P0 | 编辑 GLM-4 打开开关并保存 | 列表出现标签 | 保存后列表该行变为「🖼️ 多模态」；`PUT /api/v1/models/3` | ✅ PASS |
| TC-31 | P1 | 仅改名称（GLM-4 → GLM-4-QA），不动开关，保存后重开 | 开关保持打开 | 重开弹窗 `checked=true`（**未重置**）；列表名称已更新 | ✅ PASS |
| TC-32 | P2 | 检查构建产物 | 含相关文案 | `dist/assets/models-page-DIMCrE9k.js` 命中「多模态输入」×3，含「仅对话模型支持多模态输入标记」×1 | ✅ PASS |

### 3.7 memory 模式 seed

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-33 | P1 | `memory` 模式 `GET /api/v1/models` | `gpt-4o-mini` = true，其余 false | `gpt-4o-mini` → `supportMultimodal=true`；`deepseek-chat`/`glm-4`/`qwen-max`/`glm-image`/`wan2.7-image-pro`/`qwen-image-2.0` → `false` | ✅ PASS |

### 3.8 多模态输入筛选 — 后端 API（新增，2026-09-14 执行）

环境：真实 gateway 进程（`STORAGE_DRIVER=memory`，`127.0.0.1:8080`），`curl` + JWT（`admin@test.com`）。脚本 `/tmp/qa_mm_filter.sh`，原始输出 `/tmp/qa_mm_filter_result.txt`。
数据基线：7 条 seed + 1 条 QA 造数 = 8 条，其中仅 `gpt-4o-mini` 为 `true`。

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-34 | P0 | `GET /api/v1/models`（无过滤参数） | 返回全部 | **HTTP 200**，7 条（该步在造数前执行） | ✅ PASS |
| TC-35 | P0 | `?supportsMultimodal=true` | 只返回多模态模型 | **HTTP 200**，1 条 = `gpt-4o-mini` | ✅ PASS |
| TC-36 | P0 | `?supportsMultimodal=false` | 只返回非多模态模型 | **HTTP 200**，6 条，不含 `gpt-4o-mini` | ✅ PASS |
| TC-37 | P1 | `?modelType=chat&supportsMultimodal=true` | 交集正确 | **HTTP 200**，1 条 = `gpt-4o-mini` | ✅ PASS |
| TC-38 | P1 | `?modelType=image&supportsMultimodal=true` | 交集为空 | **HTTP 200**，0 条 | ✅ PASS |
| TC-39 | P1 | `?modelType=chat&supportsMultimodal=false` | 交集正确 | **HTTP 200**，3 条（`deepseek-chat` / `glm-4` / `qwen-max`） | ✅ PASS |
| TC-40 | P1 | `?modelType=image&supportsMultimodal=false` | 交集正确 | **HTTP 200**，3 条（`glm-image` / `wan2.7-image-pro` / `qwen-image-2.0`） | ✅ PASS |
| TC-41 | P1 | `?supportsMultimodal=bogus`（非法值） | 400 `VALID001` | **HTTP 400** `VALID001` `invalid supportsMultimodal` | ✅ PASS |
| TC-42 | P2 | `?supportsMultimodal=1` | 按 true 处理（`ParseBool` 兼容） | **HTTP 200**，1 条 | ✅ PASS |
| TC-43 | P0 | 新建 `supportsMultimodal=true` 的模型后过滤；再改为 `false` 后过滤 | 过滤结果随数据同步变化 | true 过滤 1 → **2** 条（含新建 `qa-filter-mm`）；改为 false 后回到 **1** 条 | ✅ PASS |
| TC-44 | P0 | `GET /v1/models`（API Key 鉴权） | 不暴露该字段 | **HTTP 200**，`grep -c supportsMultimodal` = **0** | ✅ PASS |
| TC-52 | P1 | 真实 PostgreSQL（`STORAGE_DRIVER=postgres`）下执行 TC-35 ~ TC-40 | PG SQL 分支（`AND supports_multimodal = $n`）生效 | 未执行（本地无可用 PG） | ⛔ 阻塞 |

### 3.9 多模态输入筛选 — Admin 端到端（浏览器实机）

环境：`vite dev`（`127.0.0.1:3000`，`/api` 代理至 gateway `:8080`）+ 浏览器实机走查；数据基线同 §3.8（8 条模型）。

| ID | 优先级 | 步骤 | 预期结果 | 实际结果 | 结果 |
|----|:------:|------|----------|----------|:----:|
| TC-45 | P0 | 打开模型管理页观察筛选栏 | 「模型类型」右侧新增「多模态输入」下拉，选项为 全部 / 🖼️ 支持多模态 / 仅文本输入 | 位置与三项文案均符合；value 分别为 `''` / `'true'` / `'false'` | ✅ PASS |
| TC-46 | P0 | 类型=全部 + 多模态=🖼️ 支持多模态 | 1 行 | 1 行（GPT-4o Mini，标签「🖼️ 多模态」） | ✅ PASS |
| TC-47 | P0 | 多模态=仅文本输入 | 7 行 | 7 行 | ✅ PASS |
| TC-48 | P1 | 类型=🖼️ 图片 + 多模态=仅文本输入 | 3 行 | 3 行（GLM-Image / Wan2.7-Image-Pro / Qwen-Image-2.0） | ✅ PASS |
| TC-49 | P1 | 类型=🖼️ 图片 + 多模态=🖼️ 支持多模态 | 0 行 | 0 行，表格显示「暂无 Model」 | ✅ PASS |
| TC-50 | P1 | 两个筛选均复位为「全部」 | 8 行 | 8 行 | ✅ PASS |
| TC-51 | P0 | 观察列表请求 URL 与状态码 | 带 `supportsMultimodal`；组合时形如 `?modelType=image&supportsMultimodal=false`；全部 200 | 5 种组合请求 URL 与预期一致且均为 **200**；两个筛选均为「全部」时不带查询参数 | ✅ PASS |

> 走查中控制台出现过一次瞬时 `SyntaxError: Unexpected token '<'`（仅首个标签页冷加载），新建标签页与多次刷新均未复现，判定为 Vite 开发期噪声，与本次改动无关。

---

## 4. 本地门禁

| 检查项 | 结果 |
|--------|:----:|
| `go build ./...` | ✅ |
| `go vet ./...` | ✅ |
| `vue-tsc --noEmit` | ✅ |
| `npm run build` | ✅ built in 1.00s |

---

## 5. 通过标准

- [x] **TC-12 / TC-13：部分更新保留 2 项 P0 通过**（对应 Reviewer 风险 1 与既有 `model_type` 缺陷）
- [x] TC-06 ~ TC-11：字段读写正常
- [x] TC-17 ~ TC-20：异常路径返回正确状态码
- [x] TC-21：对外契约无泄漏（TC-23/24 需上游 Key，未覆盖）
- [x] TC-25 ~ TC-32：前端交互与端到端贯通
- [x] **TC-34 ~ TC-44：筛选后端过滤（含与 `modelType` 组合、非法值 400、数据变更同步）**
- [x] **TC-45 ~ TC-51：Admin「多模态输入」下拉端到端贯通，请求参数正确、无泄漏**
- [ ] TC-01 ~ TC-05：迁移与存量兼容 — **待测试环境补测**
- [ ] TC-52：PostgreSQL 驱动下的筛选 SQL 分支 — **待测试环境补测**
- [x] 已执行部分：不通过项 = 0（43 PASS / 0 FAIL）

---

## 6. 执行证据

| 证据 | 位置 |
|------|------|
| 后端 API 验收脚本 | `/tmp/qa_mm.sh` |
| 后端 API 原始输出（含全部 HTTP 码与响应体） | `/tmp/qa_mm_result.txt` |
| 筛选验收脚本 | `/tmp/qa_mm_filter.sh` |
| 筛选验收原始输出 | `/tmp/qa_mm_filter_result.txt` |
| 筛选验收 gateway 日志 | `/tmp/nova-gw-mm2.log` |
| gateway 运行日志 | `/tmp/nova-gw.log` |
| 前端构建产物 | `aigateway/admin/dist/assets/models-page-mXV0XO1z.js` |
| UI 走查截图（11 张，00~11） | `/var/folders/s8/yw_tg1j11mx59fsw1b15zdw80000gn/T/trae/screenshots/` |
| 筛选 UI 走查截图（6 张，`step3`~`step8`） | 同上目录 |

执行命令（后端）：

```bash
STORAGE_DRIVER=memory GATEWAY_PORT=18080 /tmp/nova-gw
bash /tmp/qa_mm.sh

# 筛选功能（v1.2 追加）
STORAGE_DRIVER=memory GATEWAY_PORT=8080 /tmp/nova-gw > /tmp/nova-gw-mm2.log 2>&1 &
bash /tmp/qa_mm_filter.sh
```

---

## 7. 发现的问题（均为非阻断，未影响本次验收结论）

| # | 级别 | 问题 | 证据 / 说明 | 建议 |
|:-:|:----:|------|-------------|------|
| 1 | 🟡 中 | **列表排序不稳定** | memory 存储用 map 迭代，每次写入后 `GET /api/v1/models` 顺序都会变（实测顺序变化 3 次）。导致按下标定位的用例/操作不可复现 | 后端 `List` 增加稳定排序（如 `ORDER BY id`）。**既有问题，非本次引入** |
| 2 | 🟡 中 | **前端 N+1 请求** | 进入模型列表先 `GET /api/v1/models`，再对每个模型逐个 `GET /api/v1/models/{id}`（实测 7 条） | 列表接口直接返回所需字段，或前端复用列表响应。**既有问题** |
| 3 | ⚪ 低 | 表单 placeholder 未按上下文替换 | 编辑 GLM-4 / Qwen Max 时，名称与编码输入框仍显示占位符「GPT-4o Mini」/ `gpt-4o-mini` | 编辑态去掉 placeholder 或改为「请输入模型名称」。**既有问题** |
| 4 | ⚪ 低 | 开关禁用态视觉区分不明显 | `disabled=true` 与 `cursor:not-allowed` 生效、点击无效，但外观未明显灰化 | 建议加强禁用态样式（降低不透明度）。**本次新增控件，待设计确认** |
| 5 | ⚪ 低 | 2 条 `net::ERR_ABORTED` | 出现在初始加载/路由重定向阶段（`dashboard-page.vue`、`login-page.vue`），属 Vite 懒加载开发期噪声，无与「多模态」相关的 JS 报错 | 无需处理 |

> 问题 1~3 与本变更无关，属既有技术债；建议单独开迭代处理，不阻塞本次发布。

---

## 8. 未覆盖项与阻塞

| # | 事项 | 原因 | 补测方式 |
|:-:|------|------|----------|
| 1 | TC-01 ~ TC-05 | 无可用 PostgreSQL；Harness 不执行迁移 | 在测试/预发环境应用迁移后按用例执行 |
| 2 | TC-23 / TC-24 | 需有效上游 Provider Key | 配置真实 Provider 后验证图片输入转发 |
| 3 | 真实厂商多模态调用 | 本期字段为「仅标记」，不涉及网关校验与转发改动 | 随发布后回归一并确认 |
| 4 | 重启持久化 | 验收使用 memory 存储 | 随 TC-01~05 在 PG 环境一并验证 |
| 5 | TC-52（筛选的 PostgreSQL 分支） | 本地无可用 PostgreSQL | 在 PG 环境分别请求 `?supportsMultimodal=true` / `=false`（含与 `modelType` 组合），核对结果集与 SQL 占位参数 |

---

## 9. Change Log

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-09-14 | v1.0 | 初始用例文档（33 条，待执行） |
| 2026-09-14 | v1.1 | 回填执行结果：30 PASS / 0 FAIL / 2 阻塞 / 1 N/A；补充证据清单与 5 项非阻断问题 |
| 2026-09-14 | v1.2 | 新增迭代内功能「多模态输入筛选」用例 TC-34 ~ TC-52（后端 12 条 + Admin 端到端 7 条）并回填实测结果；修正 v1.1 通过数统计（按用例逐条计为 25 PASS / 7 阻塞 / 1 N/A）；合计 43 PASS / 8 阻塞 / 1 N/A |

---

# End
