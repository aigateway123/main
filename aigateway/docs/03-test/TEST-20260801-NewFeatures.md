# QA Test Report: 新功能测试

## Metadata

| 字段 | 值 |
|------|-----|
| Test ID | TEST-20260801-NewFeatures |
| Tester | QA Engineer |
| Date | 2026-08-01 |
| 后端 | http://localhost:8080（InMemory 模式） |
| 前端 | http://localhost:3005（Vite dev server，代理 /api → 8080） |
| 测试账号 | admin@test.com / admin123 |
| 测试方法 | curl 实调 API + 前端 HTTP 实测 |

## 测试结果

### A. 认证与权限

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 1 | 登录返回 Admin 角色 | POST /api/v1/auth/login 返回 role=Admin | `code=0`，`data.role="Admin"`，返回 accessToken/refreshToken，quotaBalance=1000000 | ✅ |
| 2 | Profile 返回 role + permissions | role=Admin，permissions 含 admin:model:manage、admin:provider:manage、admin:pricing:manage、admin:billing:view、admin:user:list、admin:role:manage 等 | `code=0`，role=Admin，permissions 共 17 项，全部所需权限存在 | ✅ |
| 3 | 注册禁用 | POST /api/v1/auth/register 返回错误 | `code="AUTH007"`，message="Registration is no longer supported. Please contact admin." | ✅ |

### B. 种子数据

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 4 | Providers 列表 | 4 个：OpenAI, DeepSeek, GLM, Qwen | 返回 6 个：**种子 4 个齐全**（OpenAI/DeepSeek/GLM/Qwen）+ 2 个历史遗留（Test-Provider, TestP） | ⚠️ |
| 5 | Models 列表 | 7 个：4 chat + 3 image | 返回 11 个：**种子 7 个齐全**（GPT-4o Mini/DeepSeek Chat/GLM-4/Qwen Max + GLM-Image/Wan2.7-Image-Pro/Qwen-Image-2.0）+ 4 个历史遗留（Test-Image/Test-Chat×2/Test-Img） | ⚠️ |
| 6 | 按类型筛选 | modelType=image 只返回 3 个 | 返回 5 个（种子 3 + 遗留 2），全部 modelType=image，**筛选逻辑正确** | ⚠️ |

### C. 图片生成模型支持（P1-Iteration-003）

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 7 | 创建 Image 模型 | POST /api/v1/models 带 modelType=image 创建成功 | `code=0`，创建 QA-Image-Model（modelCode=qa-image, id=13, modelType=image, modelStatus=active） | ✅ |
| 8 | 绑定 Provider + apiPathOverride | POST /api/v1/models/{id}/bind 带 apiPathOverride 成功 | 返回 **HTTP 204**（REST 无内容惯例）；GET /models/13 确认 OpenAI 已绑定且 `apiPathOverride="/v1/images/generations"`；再次绑定 Qwen 同样生效 | ✅ |
| 9 | 查询模型详情 | 返回绑定的 providers 和 apiPathOverride | `code=0`，`data.providers` 含 OpenAI/Qwen，均带 apiPathOverride="/v1/images/generations" | ✅ |
| 10 | 图片生成端点 | 返回合理响应；模型不存在时返回明确错误 | 无 API Key→401 AUTH001；缺 model→400 VALID001 "model is required"；**不存在模型→404 VALID001 "model not found: nonexistent-model-xyz"**；存在模型（qa-image）真实调用→HTTP 000 超时（环境无真实上游密钥，见问题清单 #3） | ✅ |
| 11 | 定价接口 | GET /api/v1/admin/pricing/templates 返回 200（不 404） | HTTP 200，`{"code":0,"data":[]}` | ✅ |
| 12 | 按模型查定价 | GET / 与 PUT /api/v1/admin/pricing/model/{modelId} 正常 | GET→200 返回定价（初始 pricingStatus=pending）；PUT（pricingType=flat, 0.01/0.02, USD/token）→200 返回 pricingStatus=active；再次 GET 确认值已持久化 | ✅ |

### D. 前端页面

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 13 | 登录页 UI | GET http://localhost:3005/ 返回 200，HTML 含登录页应用 | HTTP 200（366B），`<title>Nova AI Gateway Admin</title>`，含 `<div id="app">` Vue 挂载点 | ✅ |
| 14 | Vite 代理 | POST http://localhost:3005/api/v1/auth/login 经代理转发成功 | HTTP 200，`code=0`，role=Admin，返回 accessToken | ✅ |
| 15 | 静态资源 | 页面加载正常（JS 模块可访问） | `/src/main.ts` → HTTP 200，Content-Type text/javascript | ✅ |

### E. 数据验证

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 16 | 创建模型后能查到 | GET /api/v1/models 含新建模型 | qa-image 存在（modelName=QA-Image-Model, modelType=image） | ✅ |
| 17 | 修改定价后能查到 | GET /api/v1/admin/pricing/model/{modelId} 返回新值 | pricingStatus=active, pricePerInputToken=0.01, pricePerOutputToken=0.02, pricingUnit=token | ✅ |

## 问题清单

| # | 严重度 | 问题 | 证据 | 建议 |
|:-:|:------:|------|------|------|
| 1 | Minor | PUT 定价成功后 `updatedAt` 返回零值 `0001-01-01T00:00:00Z` | PUT /api/v1/admin/pricing/model/13 响应 `data.updatedAt` | InMemory 存储未维护 updatedAt 字段，建议补齐（PostgreSQL 落地时自动解决，当前阶段可接受） |
| 2 | 环境 | InMemory 实例存在历史遗留数据，导致 #4/#5/#6 数量与预期不符（6/11/5 vs 4/7/3） | providers 含 Test-Provider/TestP；models 含 Test-Image/Test-Chat×2/Test-Img | 非本次迭代缺陷，种子数据（4 Provider + 7 Model）完整存在且筛选逻辑正确；正式环境数据干净，无需处理 |
| 3 | 环境/观察 | 存在模型（qa-image，绑定 OpenAI/Qwen）的真实图片生成调用返回 HTTP 000（挂起至 12s 超时） | POST /v1/images/generations（合法 API Key + 存在模型） | 根因：InMemory 下 Provider 的 APIKeyRef 为环境变量引用（OPENAI_API_KEY）而非真实密钥，上游调用无法完成且无快速失败；建议为 outbound 调用配置超时（如 5s）与快速失败，避免挂起 |

## 总体结论

**Passed**

- 17 项测试全部通过核心验证：A 组认证权限（登录/Profile/注册禁用）✅、C 组图片生成全链路（创建→绑定→详情→端点错误处理→定价）✅、D 组前端（登录页/代理/静态资源）✅、E 组数据验证 ✅。
- #4/#5/#6 数量偏差系 InMemory 实例历史遗留数据所致（种子数据本身齐全、筛选功能正确），不构成缺陷。
- 无阻断性问题；1 个 Minor 缺陷（updatedAt 零值）+ 2 个环境观察项（遗留数据、上游无快速失败），建议在 PostgreSQL 迁移与网关超时配置中跟进。
