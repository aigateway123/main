# 门户文案修正工单

Version: v1.0

Status: Draft

Owner: Product Manager

Last Updated: 2026-07-28

---

## 1. 修改目标

将门户网站上所有虚假/夸大的内容修正为真实能力描述，消除法律和信任风险，同时保留产品真正的竞争力。

---

## 2. 修改清单

### 2.1 Hero 主视觉区 — `portal/src/components/HeroSection.vue`

#### 2.1.1 顶部 Badge（第 70 行）

| 当前 | 改为 |
|------|------|
| 完全支持 DeepSeek R1 & GPT-4o 智能双路降级 | 已支持 DeepSeek、智谱 GLM 等多模型接入 |

**理由**：「智能双路降级」措辞过度，改为真实表述。

#### 2.1.2 主描述（第 88-90 行）

| 当前 | 改为 |
|------|------|
| 企业级 AI 统一网关，兼容 OpenAI SDK 接口规范。免改造集成 DeepSeek、GPT-4o、Claude 3.5、Qwen 等 50+ 顶级大模型，内置语义缓存与毫秒级故障自动切流。 | 企业级 AI 统一网关，兼容 OpenAI SDK 接口规范。免改造集成 DeepSeek、智谱 GLM 等主流大模型，支持多 Provider 自动故障切换，让您专注于业务而非基础设施。 |

**删除**：50+ 模型、语义缓存、毫秒级
**保留**：兼容 OpenAI SDK、免改造接入
**修改**：故障自动切换（去掉"毫秒级"）

#### 2.1.3 统计数字（第 193-205 行）

| 当前 | 改为 |
|------|------|
| 5,000,000,000+ 日均 API 安全转发请求数 | 删除 |
| < 5 ms 网关额外中间代理延时 | 保留 |
| 99.99% 企业级服务可用性 SLA | ❌ 删除 |
| 50+ 全球主流模型开箱即用 | 改为「已接入主流模型，持续扩展中」 |

**理由**：3 个虚假统计数字，建议整块统计区在 MVP 阶段暂时移除或简化为 1-2 个真实指标。

### 2.2 Header 导航栏 — `portal/src/components/AppHeader.vue`

#### 2.2.1 SLA 状态徽章

| 当前 | 改为 |
|------|------|
| 绿色脉冲动画 + "SLA 99.99%" | ❌ 删除整块徽章 |

**理由**：单机部署无 SLA 保障。

### 2.3 特性卡片 — `portal/src/data/features.ts`

6 个特性卡片全部重写，替换为真实能力。

#### 卡片 1：统一 API，无限模型（保留，微调措辞）

| 字段 | 当前 | 改为 |
|------|------|------|
| title | 统一 API，无限模型 | 统一 API，自由切换 |
| description | 告别不同大模型 SDK 的繁琐封装... | 不变 |
| details[0] | 支持 Function Calling 与 JSON Mode | 兼容 OpenAI 标准接口格式 |
| details[1] | 50+ 模型统一接入，零改造迁移 | 多模型统一接入，零改造迁移 |
| metrics | 50+ Models | 多模型接入 |

#### 卡片 2：智能企业级模型路由（重写）

| 字段 | 当前 | 改为 |
|------|------|------|
| title | 智能企业级模型路由 | 多 Provider 自动故障切换 |
| highlight | 动态调度，高可用保障 | 服务连续不中断 |
| description | 根据实时节点延迟、成功率动态调整... | 当主用 Provider 返回错误时，系统自动按优先级顺序切换至备用 Provider，整个过程对用户透明，业务无感。 |
| details[0] | 毫秒级故障自动切流 | 多 Provider 自动容灾 |
| details[1] | 基于延迟/成本的智能调度 | 按优先级/权重自动路由 |
| details[2] | 支持 A/B 测试与灰度发布 | 可配置多组 Provider 绑定 |
| metrics | < 5ms | 自动切换 |

#### 卡片 3：金融级网关稳定性（重写）

| 字段 | 当前 | 改为 |
|------|------|------|
| title | 金融级网关稳定性 | 按量计费，透明可控 |
| highlight | 99.99% SLA 保障 | Token 级精度计费 |
| description | 自建全球多地域分发网络... | 按实际 Token 消耗计费，区分输入和输出。支持峰值/低谷差异化定价，所有费用在控制台实时可查。 |
| details[0] | 自建全球 Anycast 分发网络 | 精确区分输入/输出 Token 计费 |
| details[1] | 请求断路器与指数退避重试 | 支持峰谷定价，后台可动态配置 |
| details[2] | 多级限流与熔断保护 | 实时用量监控与成本报表 |
| metrics | 99.99% | 按量付费 |

#### 卡片 4：显著降低推理成本（重写）

| 字段 | 当前 | 改为 |
|------|------|------|
| title | 显著降低推理成本 | SSE 流式响应支持 |
| highlight | 语义缓存，直降 40-70% | 完整流式转发 |
| description | 融合语义精准缓存架构... | 完整支持 SSE（Server-Sent Events）流式响应，实时转发 Provider 流式输出。流式计费精度与普通请求一致，从最后一块数据中精确解析 Token 用量。 |
| details[0] | 语义级精准缓存命中 | 完整 SSE 流式代理转发 |
| details[1] | 后置成本的自动路由策略 | 流式场景 Token 级精确计费 |
| details[2] | 详细的可视化成本分析报表 | 实时监控流式响应状态 |
| metrics | -70% | SSE |

#### 卡片 5：丝滑极致的开发者体验（微调）

| 字段 | 当前 | 改为 |
|------|------|------|
| description | 极简配置。提供 SDK 及原生 HTTP 直连支持。开箱即用的 Playground 支持即时的调试、参数监控与流式结果展示。 | 极简配置。提供原生 HTTP 直连支持，兼容 OpenAI 原生 SDK。只需修改 base_url 和 api_key 即可在 5 分钟内完成接入。 |
| details[1] | 在线 API 沙盒即时调试 | ❌ 删除 |
| details[2] | 实时日志与调用链路追踪 | 每次 API 调用的请求日志记录 |

#### 卡片 6：企业合规与安全边界（重写）

| 字段 | 当前 | 改为 |
|------|------|------|
| title | 企业合规与安全边界 | API Key 管理与权限控制 |
| highlight | 数据完全由您掌控 | 多 Key + 额度限制 |
| description | 拥有您数据的完全控制。含高级审计日志、子账户角色访问鉴权（RBAC）... | 支持创建多个 API Key，每个 Key 可独立设置额度上限和模型访问白名单。内置角色权限体系，支持管理员、操作员等角色。 |
| details[0] | 完整的审计日志记录 | 多 API Key 独立管理 |
| details[1] | RBAC 角色权限体系 | 额度上限与模型白名单控制 |
| details[2] | 数据路由区域锁定 | 请求日志审计记录 |
| metrics | SOC 2 | 安全可控 |

### 2.4 基础设施区 — 整块替换

`portal/src/components/InfrastructureSection.vue` + `portal/src/data/infrastructure.ts`

**问题**：4 个卡片全部虚假（全球分发无、缓存无、Rust 内核无、K8s 扩容无）。

**建议方案**：MVP 阶段**暂时隐藏整块 Infrastructure Section**，因为当前没有可真实展示的基础设施亮点。等后续真上了多节点部署、缓存等再恢复。

如果必须保留，改为更务实的表述：

| 原卡片 | 改为 |
|--------|------|
| 全球智能分发 | 故障自动切换 — 多 Provider 按序容灾 |
| 超低延迟设计 | 流式响应加速 — SSE 流式完整代理 |
| 分层精细缓存 | ❌ 删除 |
| 自动弹性扩容 | ❌ 删除 |

### 2.5 定价 — `portal/src/data/pricing.ts` + `portal/src/components/PricingSection.vue`

| 问题 | 操作 |
|------|------|
| 1,000,000 Tokens 免费额度 | 确认后台是否已实现赠送逻辑，未实现则改为「注册即送体验额度」 |
| ¥299/月 定价 | 确认是否是真实定价，非则改为「请联系销售」 |
| 支付宝/微信支付 | 改为「请联系销售了解支付方式」 |

### 2.6 FAQ — `portal/src/data/faq.ts`

| # | 问题 | 修改内容 |
|:-:|------|---------|
| FAQ-2 | API 兼容 OpenAI 格式吗？ | 删除「支持 Function Calling、JSON Mode 等全部特性」，改为「支持 Chat Completions 标准接口」 |
| FAQ-3 | 支持哪些 AI 模型？ | 50+ 改为实际接入数量 |
| FAQ-6 | 故障自动切换如何工作？ | 删除「毫秒级」「最低延迟切换」「最低成本切换」，改为「按配置的优先级依次尝试」 |
| FAQ-7 | 语义缓存能省多少钱？ | ❌ 整条删除 |
| FAQ-8 | 是否支持 Function Calling？ | 改为「Gateway 透传 tools 参数到 Provider，具体支持程度取决于 Provider 本身」 |
| FAQ-9 | 企业客户有什么特殊支持？ | 删除「99.99% SLA」「数据路由区域锁定」 |

### 2.7 Footer — `portal/src/components/FooterSection.vue`

| 当前 | 改为 |
|------|------|
| SOC2 Type II 认证 | ❌ 删除该链接 |

---

## 3. 涉及文件汇总

| 文件 | 改动类型 | 预估改动量 |
|------|---------|:---------:|
| `portal/src/components/HeroSection.vue` | 文案修改 + 统计数字调整 | 小 |
| `portal/src/components/AppHeader.vue` | 删除 SLA 徽章区块 | 小 |
| `portal/src/data/features.ts` | **全部 6 个卡片重写** | 中 |
| `portal/src/components/InfrastructureSection.vue` | 整块隐藏或重写 | 中~大 |
| `portal/src/data/infrastructure.ts` | 数据文件重写 | 中 |
| `portal/src/data/faq.ts` | 6 条 FAQ 修改 + 1 条删除 | 中 |
| `portal/src/data/pricing.ts` | 确认定价真实性后调整 | 小 |
| `portal/src/components/FooterSection.vue` | 删除 SOC2 链接 | 小 |

---

## 4. 执行优先级

| 优先级 | 范围 | 影响 |
|:------:|------|------|
| P0 | Hero 文案 + Header SLA + Feature 卡片 #2#3#4#6 + Infrastructure | 虚假宣称，一旦被客户看到有法律风险 |
| P1 | FAQ 修正 + Footer + 定价确认 | 内容不准确，影响信任感 |
| P2 | 统计数字优化 + 措辞微调 | 体验优化 |

---

## 5. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-28 | v1.0 | 初始版本 | Product Manager |

---

# End
