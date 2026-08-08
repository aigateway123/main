# QA Test Report: 峰谷计价支持多个高峰时段（peakRanges 多时段）生产环境黑盒验证

## Metadata

| 字段 | 值 |
|------|-----|
| Test ID | TEST-20260808-MultiPeakRanges |
| Tester | QA Engineer |
| Date | 2026-08-08 |
| 被测内容 | `peakRanges` 多高峰时段：定价保存（增删/排序/上限 8 组）+ 校验（start>=end / 重叠 / 组数 / 格式）+ 计费（命中任意时段→高峰价；0 组→全天低谷价）+ 旧字段兼容 + per_million_tokens 共存 |
| 环境 | 生产服务器 101.200.198.113（commit 20d811e，Gateway:8080 healthy / Admin:8088 / PostgreSQL / Redis；迁移 011 已应用，model_pricing_time_ranges 初始为空） |
| 测试账号 | admin@test.com / admin123（Admin）；qa-multipeak@test.com（Student，userId=5，测试后已删除） |
| 测试方法 | curl 黑盒 API 测试 + psql 落库核对；本地回环 mock Provider（OpenAI 兼容端点 8899，固定 usage 100/200，非流式+SSE 流式兼容），避免真实厂商调用产生费用 |
| 计费时钟 | 服务器/容器均为 CST（北京时间）：测试执行窗口 22:39~22:46，命中时段设计为 21:00-23:00，未命中时段设计为 09:00-12:00 |
| 测试数据 | 全部清理：qa 模型 ×2 / mock Provider ×1 / 测试学生 ×1 / API Key ×1 / 请求日志 ×6 / 定价记录 ×3 / 会话 / 配额流水 / 模型授权记录均已删除；现有模型 24 定价已恢复原状（pending 无定价）、模型 25 未改动；mock 进程已停止 |

## 被测语义（依据部署代码 commit 20d811e）

- **保存**（pricing_service.go `UpdateByModelID` / `buildPeakRanges` / `validatePeakRanges`）：
  - 请求显式传 `peakRanges`（含空数组=0 组）→ 以请求为准；未传且旧字段 `peakStart/peakEnd` trim 后非空 → 兼容转单组；否则 0 组
  - 校验：组数 >8 → 400"高峰时段最多 8 组"；非 `HH:MM`/`HH:MM:SS` → 400"高峰时段格式无效"；start>=end → 400"高峰时段的开始时间必须早于结束时间"；重叠 → 400"高峰时段存在重叠"
  - 落库：`model_pricing.peak_start/peak_end` 写 NULL，权威数据源为子表 `model_pricing_time_ranges`（TIME 列 + sort_order）
  - 回显：`peakRanges` 按 sort_order 返回；`peakStart/peakEnd` 由 `PeakRanges[0]` 派生
- **计费**（billing_service.go `ComputeCost`）：time_based 且峰谷四价齐备时，`len(PeakRanges)>0` → `isWithinAnyTimeRange` 命中任一组即高峰价，否则低谷价；`PeakRanges` 为空 → 全天低谷价（M1 决策）；`per_million_tokens` → `cost/1,000,000`
- **必填项**：Admin 保存接口除 `pricingType` 外 **`currency` 也为必填**（控制器校验，缺失返回 400）

## 测试结果

### A. 环境准备

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 1 | Admin 登录（POST /api/v1/auth/login） | code=0 + accessToken | `code=0`，accessToken 获取成功 | ✅ |
| 2 | GET /api/v1/admin/pricing 现有定价基线 | 返回模型定价列表 | 14 个模型；记录模型 24（deepseek-v4-flash）原状态=无定价记录（pending/0/0）；模型 25 未改动 | ✅ |
| 3 | 创建学生 qa-multipeak@test.com + 分配额度 | 201 / quotaBalance≥10 | HTTP 201（userId=5，Student）；PUT quota 后 `quotaBalance=10` | ✅ |
| 4 | mock Provider：ECS 本机 /root/mock_provider.py（0.0.0.0:8899，OpenAI 兼容，固定 usage 100/200，非流式+SSE 流式）重启后台运行 | 端口 8899 监听；非流式返回 usage 100/200 | 重启成功（nohup）；本机 curl 验证非流式返回 `prompt_tokens=100/completion_tokens=200`；Gateway 容器经 `http://172.19.0.1:8899/v1` 完整 chat 链路可达（C 节实测） | ✅ |
| 5 | 创建 mock Provider（id=10 qa-mock-multipeak）+ 测试模型 qa-multipeak-a(34)/qa-multipeak-b(35) + 绑定 + 授权给学生 | 201/201/204/200 | HTTP 201 / 201 / 201 / 200（authorizedModelCount=2） | ✅ |
| 6 | 学生创建 API Key（POST /api/v1/api-keys） | 201 + fullKey | HTTP 201（id=21，`sk-campus-ff...` fullKey） | ✅ |

### B. 定价保存与校验（API 层，测试对象=现有模型 24）

| # | 测试项 | 预期 | 实际 | 状态 |
|:-:|--------|------|------|:----:|
| 7 | 保存**双高峰时段**（09:00-12:00 + 14:00-18:00，token 单位，peak 2e-6/8e-6，offpeak 1e-6/4e-6） | HTTP 200；peakRanges 两组且顺序一致；peakStart/End 派生自第一组；pricingStatus=active | HTTP 200；`peakRanges`=[{09:00:00,12:00:00},{14:00:00,18:00:00}] 顺序一致；`peakStart/peakEnd`=09:00:00/12:00:00（第一组派生）；`pricingStatus=active` | ✅ |
| 8 | GET /api/v1/admin/pricing/model/24 复查持久化 + DB 子表核对 | 保存值与查询一致；子表 2 行 | GET 返回值与保存完全一致；`model_pricing_time_ranges` 2 行（pricing_id=37，sort_order 0/1） | ✅ |
| 9 | 校验拒绝：start>=end（12:00-09:00） | HTTP 400 | HTTP 400 `VALID001`："高峰时段的开始时间必须早于结束时间" | ✅ |
| 10 | 校验拒绝：时段重叠（09:00-12:00 + 11:00-14:00） | HTTP 400 | HTTP 400 `VALID001`："高峰时段存在重叠" | ✅ |
| 11 | 校验拒绝：9 组超限 | HTTP 400 | HTTP 400 `VALID001`："高峰时段最多 8 组" | ✅ |
| 12 | 校验拒绝：格式非法（start="9a"） | HTTP 400 | HTTP 400 `VALID001`："高峰时段格式无效，应为 HH:MM 或 HH:MM:SS" | ✅ |
| 13 | 兼容：仅传旧字段 peakStart/peakEnd="08:00"/"10:00" | HTTP 200；peakRanges 单组 [{08:00,10:00}] | HTTP 200；`peakRanges`=[{08:00:00,10:00:00}] 单组 | ✅ |
| 14 | 兼容：peakStart/peakEnd 为空串 | HTTP 200；peakRanges 为空（0 组） | HTTP 200；`peakRanges`=[]，`peakStart/peakEnd`=null | ✅ |

### C. 计费链路验证（核心，模型 34 qa-multipeak-a，学生 API Key，当前服务器时间 22:4x CST）

| # | 测试项 | 预期 costAmount（usage 100/200） | 实际（request_logs） | 状态 |
|:-:|--------|------|------|:----:|
| 15 | **命中高峰**（单组 21:00-23:00 覆盖当前，非流式） | 100×2e-6 + 200×8e-6 = **0.0018** | 日志 id=564：input=100，output=200，`costAmount=0.001800`（误差 0） | ✅ |
| 16 | **未命中高峰**（单组 09:00-12:00 不覆盖当前，流式 SSE） | 100×1e-6 + 200×4e-6 = **0.0009** | 日志 id=565：`costAmount=0.000900`（误差 0）；流式 SSE 完整转发（usage chunk + [DONE]） | ✅ |
| 17 | **双高峰 + 命中**（09:00-12:00 + 21:00-23:00，第二组覆盖当前） | 高峰价 = **0.0018** | 日志 id=566：`costAmount=0.001800`（误差 0） | ✅ |
| 18 | **0 组时段**（peakRanges=[]，保留峰谷价格） | 全天低谷价 = **0.0009** | 日志 id=567：`costAmount=0.000900`（误差 0） | ✅ |

### D. 回归验证

| # | 测试项 | 预期 costAmount | 实际（request_logs） | 状态 |
|:-:|--------|------|------|:----:|
| 19 | **token flat 定价不受影响**（模型 34 改 flat token 2e-6/6e-6 后调用） | 100×2e-6 + 200×6e-6 = **0.0014**（无 /1M 缩放） | 日志 id=568：`costAmount=0.001400` | ✅ |
| 20 | **per_million_tokens + 多时段共存**（模型 35 qa-multipeak-b：per_million_tokens + 单组 21:00-23:00 覆盖当前，peak 2/6） | (100×2 + 200×6)/1e6 = **0.0014** | 日志 id=569：`costAmount=0.001400` | ✅ |

### 设计文档 §11.3 验收要点覆盖映射

| 验收要点 | 对应用例 | 结果 |
|----------|----------|:----:|
| 双高峰边界（多组保存/回显/命中任一组） | #7/#8/#17 | ✅ |
| start>=end 拒绝 | #9 | ✅ |
| 时段重叠拒绝 | #10 | ✅ |
| 组数上限（8 组，9 组拒绝） | #11 | ✅ |
| 0 组 = 全天低谷价 | #14/#18 | ✅ |
| 旧字段 peakStart/peakEnd 兼容（非空→单组；空串→0 组） | #13/#14 | ✅ |
| per_million_tokens 与多时段共存（/1M 叠加） | #20 | ✅ |

## 问题清单

| # | 严重度 | 问题 | 证据 | 处置 |
|:-:|:------:|------|------|------|
| 1 | P3（观察项） | `peakRanges` 入参 `"09:00"` 经 TIME 列落库后回显为 `"09:00:00"`，接口回显格式变化（与 TEST-20260808-PerMillionTokens 的 peakStart 观察一致） | PUT 入参 `"start":"09:00"`，GET 回显 `"start":"09:00:00"` | 非缺陷：计费端 `isWithinTimeRange` 按 `15:04:05` 解析兼容（实测计费全部正确）；前端展示层需确认渲染兼容 |
| 2 | P3（文档偏差） | Admin 定价保存接口实际要求 **`currency` 必填**，任务/示例请求体未包含该字段，缺失返回 400 "invalid request body" | PUT 省略 currency → HTTP 400 `VALID001`；补充 `"currency":"USD"` 后 200 | 非功能缺陷；建议同步更新 API 契约文档/示例（前端保存时始终携带 currency，故线上无影响） |
| 3 | P4（提示） | 校验拒绝统一返回 HTTP 400 + code VALID001，具体原因在 message 中区分 | 4 类拒绝的 message 各不相同（见 #9~#12） | 可接受；如前端需机器可读的错误码可后续拆分 |
| 4 | 测试操作提示 | `pkill -f mock_provider.py` 会匹配 SSH 会话自身命令行导致连接中断（exit 255） | pkill 后 ssh 输出截断、退出码 255 | 非应用缺陷；改用 `ss -tlnp` 取 pid 后 kill，进程正常停止 |

## 测试数据清理说明

- 定价：模型 24（B 节测试对象）→ `model_pricing` 记录删除（GET 复核恢复 pending/0/0 无定价原状态）；模型 25 未改动；qa 模型 34/35 定价记录（含子表时段）随模型删除一并清理
- 模型：qa-multipeak-a(34)、qa-multipeak-b(35) 及绑定 → 已删除（0 残留）
- Provider：qa-mock-multipeak(10) → 已删除
- 账号：qa-multipeak@test.com(userId=5)、API Key（id=21）、user_sessions、quota_transactions、user_model_permissions → 已删除
- 请求日志：qa-* 模型日志 ×6（id 564–569）→ 已删除（不污染生产日志/报表）；6 笔 costAmount 合计 0.0082（0.0018+0.0009+0.0018+0.0009+0.0014+0.0014）
- mock 进程：`/root/mock_provider.py`（0.0.0.0:8899）→ 已停止，端口无监听；脚本文件保留在 ECS（如无需可删除）
- DB 复核：`ranges=0 / pricing(24,34,35)=0 / models(34,35)=0 / providers(10)=0 / users(5)=0 / api_keys(5)=0 / qa_logs=0 / user_model_permissions(5)=0`，全部通过；`model_pricing_time_ranges` 回到迁移后空表状态

## 总体结论

**PASS（20/20 用例全部通过）**

- **多高峰时段保存与校验**：双高峰保存返回两组且顺序一致、peakStart/End 由第一组派生、pricingStatus 自动 active；子表持久化（sort_order 0/1）正确；start>=end / 重叠 / 9 组超限 / 格式非法 4 类校验全部 400 且错误信息准确。
- **计费核心语义**（误差 0 < 1e-6）：
  - 命中高峰（21:00-23:00 覆盖当前）：costAmount=0.0018 = 100×2e-6 + 200×8e-6 ✅
  - 未命中高峰（09:00-12:00，流式）：costAmount=0.0009 = 100×1e-6 + 200×4e-6 ✅
  - 双高峰命中任一组：costAmount=0.0018（高峰价）✅
  - 0 组时段 = 全天低谷价：costAmount=0.0009 ✅
- **兼容与回归**：仅传旧字段 peakStart/peakEnd → 单组；空串 → 0 组；token flat 计费无缩放不受影响（0.0014）；per_million_tokens 与多时段叠加正确（0.0014 = (100×2+200×6)/1e6）。
- 无阻断性问题；2 个 P3 观察项（时段回显 HH:MM:SS 格式、保存接口 currency 必填），均不影响计费正确性，建议分别由前端展示层与 API 文档跟进确认。
