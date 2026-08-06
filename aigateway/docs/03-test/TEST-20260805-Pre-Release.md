# QA Test Report: 发布前回归测试（P1 Iteration 新增功能）

## Metadata

| 字段 | 值 |
|------|-----|
| Test ID | TEST-20260805-Pre-Release |
| Tester | QA Engineer |
| Date | 2026-08-05 |
| 被测内容 | 未提交变更（30 个文件改动 + 7 个新文件）：billing 服务接线、模型 is_public、RBAC 权限中间件、账单报表、Admin 前端多页面 |
| 环境 | 本地 PostgreSQL（nova_ai_gateway）+ Gateway Postgres 模式（贴近生产） |
| 测试账号 | admin@test.com / admin123（Admin）；测试学生 qa2@test.com（Student，测试后已清理） |
| 测试方法 | Python 脚本全自动 API 回归（48 项）+ go build/vet/test + Admin 前端 vue-tsc/vite build |
| 测试数据 | 全部清理，库已恢复原状（8 模型 / 5 Provider / 2 用户 / 1 条历史日志） |

## 测试结果

### A. 登录 / 认证 / API Key 链路

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 1 | 管理员登录 | role=Admin | `code=0`，role=Admin | ✅ |
| 2 | 管理员创建学生账号 | 201，role=Student | `code=0`，userId 返回，role=Student | ✅ |
| 3 | 学生登录 | role=Student | `code=0`，role=Student | ✅ |
| 4 | 错误密码被拒 | 401 | HTTP 401 | ✅ |
| 5 | profile（管理员） | 200 code=0 | HTTP 200 | ✅ |
| 6 | 无 token 返回 401 | 401 | HTTP 401 | ✅ |
| 7 | 学生创建 API Key | 201 + fullKey | HTTP 201，fullKey 返回 | ✅ |
| 8 | API Key 列表 | ≥1 条 | 正常返回 | ✅ |
| 9 | 撤销 API Key | 204 | HTTP 204，状态变 revoked | ✅ |
| 10 | 无 API Key 聊天被拒 | 401 | HTTP 401 AUTH001 | ✅ |
| 11 | 学生创建新 Key（供聊天测试） | 201 + fullKey | HTTP 201 | ✅ |

### B. 模型管理 & is_public

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 12 | 模型列表含 isPublic 字段 | 全部模型带 isPublic | 8 个模型均含 `isPublic` | ✅ |
| 13 | 创建公开模型（isPublic=true） | 200，isPublic=true | `code=0`，isPublic=true | ✅ |
| 14 | 创建私有模型（isPublic=false） | 200，isPublic=false | `code=0`，isPublic=false | ✅ |
| 15 | 更新 isPublic true/false | 更新生效 | 两次翻转均生效 | ✅ |
| 16 | 模型绑定 Provider | 204 | HTTP 204 | ✅ |
| 17 | 删除模型 | 204 | HTTP 204 | ✅ |

### C. RBAC 权限点

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 18 | 学生创建模型 | 403 | HTTP 403 | ✅ |
| 19 | 学生创建 Provider | 403 | HTTP 403 | ✅ |
| 20 | 学生查看角色 | 403 | HTTP 403 | ✅ |
| 21 | 学生查看账单汇总 | 403 | HTTP 403 | ✅ |
| 22 | 学生查看账单报表 | 403 | HTTP 403（修复前 200，见问题 #1） | ✅ |
| 23 | 学生修改模型绑定 | 403 | HTTP 403 | ✅ |
| 24 | 学生可查看模型列表（只读开放） | 200 | HTTP 200 | ✅ |
| 25 | 管理员查看角色 | 200 | HTTP 200 | ✅ |
| 26 | 权限列表 16 项 | ≥16 | 16 项 | ✅ |

### D. 账单明细 / 报表

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 27-30 | 上报日志（仅传 modelCode） | 201 | 4 条均 201（修复前 500，见问题 #2） | ✅ |
| 31 | 账单汇总 | 200 code=0 | HTTP 200 | ✅ |
| 32 | 账单明细含 email 富化 | 明细含 email 字段 | count=10，email=qa2@test.com | ✅ |
| 33 | 报表汇总 range=today | 200，含 today/currentMonth | HTTP 200 | ✅ |
| 34 | 收入趋势 7d | 200 | HTTP 200 | ✅ |
| 35 | 模型维度报表 | 200 | HTTP 200 | ✅ |
| 36 | 用户维度报表 | 200 | HTTP 200 | ✅ |
| 37 | 报表导出 CSV | 200 CSV | HTTP 200 | ✅ |
| 38 | 学生个人用量汇总 | 200 | HTTP 200 | ✅ |
| 39 | 学生个人用量明细 | 200 | HTTP 200 | ✅ |

### E. 聊天链路（访问控制 / 流式 / 计费）

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 40 | 创建 QA 测试 Provider（本地回环，避免真实调用） | 201 | HTTP 201 | ✅ |
| 41-42 | 公开/私有聊天模型创建并绑定 | 204 | 均 HTTP 204 | ✅ |
| 43 | 管理员设置学生额度 | 200 | HTTP 200 | ✅ |
| 44 | 私有模型无权限 → 拒绝 | 403 MODEL_FORBIDDEN | HTTP 403，message="model is not authorized for this user" | ✅ |
| 45 | 公开模型放行（上游连接失败 → 502） | 502 | HTTP 502（证明放行至 Provider 层） | ✅ |
| 46 | 流式请求管线 | 200/502/503 | HTTP 502 | ✅ |
| 47 | 日志列表可用且含学生数据 | ≥2 条 | count=6 | ✅ |
| 48 | 报表接口权限修复回归 | 学生 403 | HTTP 403 | ✅ |

### F. 构建与静态检查

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 49 | 后端 go build / go vet / go test | 全部通过 | 全部 exit 0 | ✅ |
| 50 | Admin 前端 vue-tsc + vite build | 构建成功 | 129 modules，1.00s | ✅ |

## 问题清单

| # | 严重度 | 问题 | 证据 | 修复 |
|:-:|:------:|------|------|------|
| 1 | **P1** | **账单报表接口未受 RBAC 保护**：`/api/v1/billing/report/*` 的权限检查位于 `/api/v1/admin/` 守卫之后，为死代码，任何已登录用户可查看/导出全平台账单 | 学生访问 `/api/v1/billing/report/summary` 返回 200（应 403） | ✅ 已修复：rbac_middleware.go 将 billing/report 检查移至 admin 守卫之前；回归确认学生现返回 403 |
| 2 | P2 | **日志上报接口易 500**：`POST /api/v1/usage/logs` 未传 modelId/apiKeyId/providerId 时触发 NOT NULL/FK 约束 500 | 仅传 modelCode 时 HTTP 500（`request_logs.model_id/provider_id` NOT NULL） | ✅ 已修复：写入层 0 值 FK 落库 NULL + SELECT 层 COALESCE 兜底；service 层自动用 modelCode 解析 modelId、用模型绑定解析 providerId；错误映射为 404/400 明确提示。回归确认仅传 modelCode 即 201，不存在模型返回 404 |
| 3 | 测试脚本 | 绑定/删除接口成功返回 204 而非 200；额度接口字段为 `amount`；日志列表 Data 为 `{items,pagination}` 对象 | 首轮断言误报 | 非应用缺陷，已修正断言 |
| 4 | **P1** | **Provider/配额接口硬编码 `Z` 后缀**：`Format("...Z")` 固定输出 `Z`，实际值为北京墙钟时间，误导为 UTC | 生产实测 Provider 返回 `2026-07-25T20:13:36Z`，正确应为 `+08:00` | ✅ 已修复：provider_service.go / policy_service.go 改用 `Z07:00`；生产回归确认输出 `2026-07-25T20:13:36+08:00` |
| 5 | P2 | **报表按天统计/今日统计 8 小时边界错位**：`created_at::date` 按 DB 会话时区（Etc/UTC）取日期，`time.Now()` 按容器北京时间，00:00–08:00 产生的请求被记到前一天；用量日志日期过滤同样受影响 | DB 实测存在 `utc_date ≠ bj_date` 的记录（如 `2026-07-25` vs `2026-07-26`） | ✅ 已修复：report_repo_pg.go 用显式 `Asia/Shanghai` 日边界（beijingDayRange/beijingDateStr），log_repo_pg.go 日期过滤用 `AT TIME ZONE 'Asia/Shanghai'`；本地+生产回归通过 |

## 上线前注意事项（Provider 配置）

1. **qwen3.8-max-preview**：阿里云百炼仅 Token Plan 订阅可用。生产如需上线该模型，须新增 Token Plan Provider（`https://token-plan.cn-beijing.maas.aliyuncs.com` + 专属 Key）并将模型改绑；否则保持 403 access_denied。替代方案：使用 `qwen3.7-max`。
2. **MiniMax-M3**：思考模式默认开启（adaptive）。生产建议改用官方 OpenAI 兼容端点 `https://api.minimaxi.com/v1/chat/completions`；客户端需传 `max_tokens`（≥1024）或显式 `thinking: {"type": "disabled"}`，否则会「调通但返回空内容」。

## 补充回归：时区问题专项验证（2026-08-06）

**背景**：生产请求日志显示 `2026-08-05T22:57:17+08:00`，经核验该值即北京时间（DB 存储瞬间 14:57 UTC = 22:57 北京，`+08:00` 为北京时区），数值正确；但排查发现两处其他时区缺陷（问题清单 #4/#5），已修复并完成本地 + 生产回归。

| # | 验证项 | 修复前 | 修复后（生产实测） | 状态 |
|:-:|--------|--------|-------------------|:----:|
| T1 | Provider createdAt | `2026-07-25T20:13:36Z`（硬编码 Z） | `2026-07-25T20:13:36+08:00` | ✅ |
| T2 | 报表汇总（range=today） | — | HTTP 200，today/currentMonth 正常 | ✅ |
| T3 | 用量日志日期过滤（startDate=2026-08-01） | 边界差 8 小时 | 按北京日期边界过滤，HTTP 200 | ✅ |
| T4 | 请求日志时间 | 值本身正确（+08:00） | 无需调整，确认即北京时间 | ✅ |

## 总体结论

**Passed（发布前修复完成）**

- 48 项 API 功能回归 + 2 项构建检查全部通过（50/50）。
- 发布前发现并修复 4 个真实缺陷：P1 报表 RBAC 权限绕过、P2 日志上报 500、P1 硬编码 Z 时区标注、P2 报表按天统计 8 小时边界错位；均已完成本地 + 生产回归验证。
- 改动集中在后端 8 个文件（rbac_middleware / log_repo_pg / usage_service / usage_controller / report_repo_pg / provider_service / policy_service / main.go），已随迭代提交部署。
- 无遗留阻断性问题；Provider 侧 2 项配置注意事项（qwen3.8 Token Plan、MiniMax-M3 思考模式）需在上线时确认。
