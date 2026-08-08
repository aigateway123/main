# QA Test Report: 计价单位 per_million_tokens（按百万 Token）生产环境黑盒验证

## Metadata

| 字段 | 值 |
|------|-----|
| Test ID | TEST-20260808-PerMillionTokens |
| Tester | QA Engineer |
| Date | 2026-08-08 |
| 被测内容 | 新增计价单位 `per_million_tokens`：定价保存（flat / time_based）+ 计费公式 cost=(in×输入百万单价+out×输出百万单价)/1,000,000 |
| 环境 | 生产服务器 101.200.198.113（commit ad38793，Gateway:8080 healthy / Admin:8088 / PostgreSQL / Redis） |
| 测试账号 | admin@test.com / admin123（Admin）；qa-permillion@test.com（Student，测试后已删除） |
| 测试方法 | curl + Python 黑盒 API 测试；本地回环 mock Provider（OpenAI 兼容端点，固定 usage 100/200），避免真实厂商调用产生费用 |
| 测试数据 | 全部清理：qa 模型 ×3 / mock Provider ×1 / 测试学生 ×1 / API Key ×2 / 请求日志 ×4 / 定价记录 ×5 / 会话 ×1 均已删除；被改动生产模型定价已恢复原值；mock 进程已停止 |

## 被测语义（依据 billing_service.go ComputeCost）

- `pricingUnit=per_million_tokens` 时：`cost = (inputTokens×输入单价 + outputTokens×输出单价) / 1,000,000`
- time_based 峰谷取价（isWithinTimeRange，按 `15:04:05` 解析）后同样除以 1,000,000
- `pricingUnit=token`（默认）时：`cost = inputTokens×单价 + outputTokens×单价`，无缩放（回归项）

## 测试结果

### A. Admin API 定价保存验证

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 1 | 管理员登录（POST /api/v1/auth/login） | code=0 + accessToken | `code=0`，accessToken 获取成功 | ✅ |
| 2 | GET /api/v1/admin/pricing 现有定价列表 | 返回模型定价列表 | 14 个模型，含 modelId/modelCode；记录模型 24/25 原状态（无定价记录，pending） | ✅ |
| 3 | 模型 A（modelId=24 deepseek-v4-flash）保存 flat per_million_tokens | pricingUnit=per_million_tokens、价格 2/6、pricingStatus=active | HTTP 200，`pricingUnit=per_million_tokens`，`pricePerInputToken=2`，`pricePerOutputToken=6`，`pricingStatus=active` | ✅ |
| 4 | 模型 B（modelId=25 deepseek-v4-pro）保存 time_based per_million_tokens | pricingUnit=per_million_tokens、peak 3/9 offpeak 1/3、pricingStatus=active | HTTP 200，`pricingType=time_based`，`pricingUnit=per_million_tokens`，peak/offpeak 价格正确，`pricingStatus=active`（自动判定生效） | ✅ |
| 5 | 再 GET 确认持久化 | 保存值与查询一致 | 模型 24/25 返回值与保存一致；峰值存储为 `08:00:00`（time 类型），计费端按 `15:04:05` 解析兼容 | ✅ |

### B. 计费链路验证（核心）

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 6 | ECS 部署本地回环 mock Provider（0.0.0.0:8899，OpenAI 兼容） | 非流式返回固定 usage 100/200；流式 SSE 末 chunk 含 usage；[DONE] 结束 | 均符合预期；Gateway 容器经 `172.19.0.1:8899` 可达 | ✅ |
| 7 | 创建 mock Provider（POST /api/v1/providers）+ 测试模型 qa-perm-model + 绑定 | 201/201/204 | HTTP 201 / 201 / 204 | ✅ |
| 8 | qa-perm-model 定价设为 flat per_million_tokens 2/6 | 保存成功、active | HTTP 200，`per_million_tokens`/2/6/active | ✅ |
| 9 | 创建学生账号 qa-permillion@test.com + 额度 10 + API Key | 201 / 200 / 201 | HTTP 201（userId=4，Student）/ `quotaBalance=10` / 201（fullKey） | ✅ |
| 10 | **非流式调用**（POST /api/v1/chat/completions，mock usage=100/200） | costAmount = (100×2+200×6)/1,000,000 = **0.0014** | HTTP 200；日志 id=560：input=100，output=200，`costAmount=0.0014`（误差 0 < 1e-6） | ✅ |
| 11 | **流式调用**（stream:true） | costAmount 同上 = **0.0014** | HTTP 200（SSE 完整转发）；日志 id=561：`costAmount=0.0014` | ✅ |
| 12 | **time_based per_million_tokens**（qa-perm-tb，peak 3/9 @08:00–23:00，当前 21:48 处于峰值） | costAmount = (100×3+200×9)/1,000,000 = **0.0021** | HTTP 200；日志 id=562：`costAmount=0.0021`（峰值价格生效且除以 1,000,000） | ✅ |
| 13 | 学生额度扣减 | totalSpent = 0.0014×2 + 0.0021 = **0.0049** | `quotaBalance=9.9951`，`totalSpent=0.0049`，与逐条日志合计完全一致 | ✅ |

### C. 回归验证（token 单位计费不受影响）

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 14 | 原定价为 token 的模型（modelId=20 kimi-k2.7-code，原 token/0/0/pending）临时改为 token flat 0.000002/0.000006 | 保存成功、pricingUnit=token、status=active | HTTP 200，`pricingUnit=token`，价格 2e-06/6e-06，`pricingStatus=active` | ✅ |
| 15 | 模型 20 恢复原值 | 恢复为 token/0/0/pending | HTTP 200，`token`/0/0/`pending`，与原值一致 | ✅ |
| 16 | 独立测试模型 qa-token-model（token 定价 0.000002/0.000006）调用 mock | costAmount = 100×0.000002 + 200×0.000006 = **0.0014**（无 /1M 缩放） | HTTP 200；日志 id=563：`costAmount=0.0014`，符合 per-token 直乘公式，**证明 token 计费逻辑未受新单位影响** | ✅ |
| 17 | 恢复模型 24/25 原定价 | 回到"无定价记录"（原状态） | model_pricing 表 model_id 24/25 记录已删除，GET 列表恢复 pending/0/0/NONE | ✅ |

### D. 前端可访问性（可选）

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 18 | Admin 控制台页面（http://101.200.198.113:8088） | HTTP 200 | HTTP 200，返回 HTML（Nova AI Gateway Admin）；UI 下拉选项由前端专项另行验证 | ✅ |

## 问题清单

| # | 严重度 | 问题 | 证据 | 处置 |
|:-:|:------:|------|------|------|
| 1 | P3（观察项） | time_based 定价的 `peakStart/peakEnd` 入参 `"08:00"` 落库为 time 类型 `"08:00:00"`，接口回显格式变化 | PUT 入参 `"peakStart":"08:00"`，GET 回显 `"peakStart":"08:00:00"` | 非缺陷：计费端 `isWithinTimeRange` 按 `15:04:05` 解析，兼容该格式（实测峰值计费正确 0.0021）；前端展示层需确认渲染兼容 |
| 2 | 测试操作提示 | psql `-c` 多语句同事务：任一语句失败（首次清理时 users 被 user_sessions 外键阻止）则整批回滚 | 首次清理批处理回滚，各表数据未变 | 非应用缺陷；补充删除 user_sessions 后二次清理全部成功 |

## 测试数据清理说明

- 定价：模型 24/25（A 步骤测试对象）→ model_pricing 记录删除，恢复"无定价记录"原状态；模型 20 → 恢复 token/0/0/USD/pending 原值（已 GET 复核）
- 模型：qa-perm-model(31)、qa-perm-tb(32)、qa-token-model(33) 及绑定 → 已删除（0 残留）
- Provider：qa-mock-permillion(9) → 已删除
- 账号：qa-permillion@test.com(userId=4)、API Key ×2、会话、quota 流水 → 已删除
- 请求日志：qa-* 模型日志 ×4（id 560–563）→ 已删除（不污染生产日志/报表）
- mock 进程：`/root/mock_provider.py`（0.0.0.0:8899）→ 已 kill，端口无监听；脚本文件保留在 ECS（如无需可删除）
- 复核：`users4=0 / providers9=0 / models31_33=0 / pricing24_25=0 / qa_logs=0`，全部通过

## 总体结论

**PASS（18/18 用例全部通过）**

- 计价单位 `per_million_tokens` 保存接口工作正常：flat 与 time_based 均正确保存，pricingStatus 自动判定为 active。
- 计费公式验证通过（误差 < 1e-6，实测误差 0）：
  - flat 非流式：costAmount = 0.0014 = (100×2 + 200×6)/1,000,000 ✅
  - flat 流式：costAmount = 0.0014 ✅
  - time_based 峰值：costAmount = 0.0021 = (100×3 + 200×9)/1,000,000 ✅
  - token 单位回归：costAmount = 0.0014 = 100×0.000002 + 200×0.000006（无缩放，未受影响）✅
- 额度扣减与日志落库一致（0.0049 = 三笔调用合计）。
- 无阻断性问题；仅 1 个 P3 观察项（peakStart 回显 `08:00:00` 格式），计费逻辑已实测正确，建议前端展示层兼容确认。
