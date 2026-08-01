# 差异分析报告: 门户内容 vs 后端实际能力

Version: v1.0

Status: Draft

Owner: Product Manager

Last Updated: 2026-07-28

---

## 门户功能宣称分类

将门户上所有宣称的能力分为三类：**真正的宣传点**、**功能罗列**、**虚假/夸大**。

---

### 🟢 真正的宣传点 — 有实现、能打动客户、可做卖点

这些是 Nova AI Gateway 真实的差异化价值，可用于 Hero、特性卡片等核心位置：

| # | 宣传点 | 门户位置 | 后端依据 | 是否充分表达 |
|:-:|--------|---------|---------|:-----------:|
| 1 | **一个API调用全品类AI模型** | Hero 主标题 | 多Provider + Model 管理，支持自由切换 | ✅ 已表达 |
| 2 | **完全兼容 OpenAI 接口规范** | Hero 副标题 + 代码示例 | ChatController 处理标准 Chat Completions 格式 | ✅ 代码示例很加分 |
| 3 | **5分钟零改造接入** | 特性卡片 #5 + FAQ-1 | 替换 base_url + api_key 即可，SDK 不变 | ✅ 已表达 |
| 4 | **故障自动切换（Fallback）** | 特性卡片 #2 + FAQ-6 | CallWithFallback 按优先级依次尝试，失败自动切下一个 | ⚠️ 措辞过度，下面会讲 |
| 5 | **SSE 流式响应** | FAQ 提及 | chat_controller 完整支持 Stream 模式 + 流式计费 | ✅ 但未突出 |
| 6 | **按量计费 + Token 解析** | 定价卡片 + FAQ-4 | BillingService + parseStreamUsage | ✅ 但未突出 |
| 7 | **API Key + 额度管理** | FAQ-10 | ValidateApiKey + quota check + SELECT FOR UPDATE | ✅ 已表达 |
| 8 | **RBAC 权限体系** | 特性卡片 #6 | RBAC service + middleware + 15+ 权限点 | ✅ 已表达 |

**核心卖点浓缩成一句话：**
> **「兼容 OpenAI SDK，一个 Key 接入所有主流大模型，故障自动切换，按量付费。」**

---

### 🟡 功能罗列 — 技术事实，可作为详情页/FAQ 补充，不适合做主宣传

这些是产品真正有但不足以成为"卖点"的底层功能：

| # | 功能 | 门户位置 | 建议处理 |
|:-:|------|---------|---------|
| 1 | **请求日志记录** | 特性卡片 #6 提到"审计日志" | 改为"每次API调用的请求日志记录" |
| 2 | **多Provider绑定/Binding 管理** | 未明确展示 | 可在后续文档站中介绍 |
| 3 | **峰谷定价（Peak/Off-peak）** | 未提及 | 后续定价页可展示 |
| 4 | **成本报告（汇总/详情/CSV）** | 特性卡片 #4 提到"成本分析报表" | 结合 Admin 后台功能做实 |
| 5 | **用户额度白名单模型控制** | FAQ-10 有提及 | 保留在 FAQ |
| 6 | **健康检查端点** | 未提及 | 后续文档站 |
| 7 | **TLS 1.3 加密传输** | FAQ-5 | 保留在 FAQ |

---

### 🔴 虚假/夸大 — 必须删除或改写

| # | 门户宣称 | 位置 | 实际 | 操作 |
|:-:|---------|------|------|------|
| 1 | **99.99% SLA** | 特性卡片 #3 / Header 状态徽章 | 单机部署，无 SLA 监控 | ❌ 删除 |
| 2 | **自建全球 Anycast 分发网络 / 32+ Edge Regions** | 基础设施 #1 / Hero 旁 | 单服务器部署 | ❌ 删除 |
| 3 | **语义缓存直降 40-70%** | 特性卡片 #4 / Hero 描述 | 无缓存实现 | ❌ 删除 |
| 4 | **SOC 2 认证** | 特性卡片 #6 | 无此认证 | ❌ 删除 |
| 5 | **50+ 模型** | Hero / 特性 #1 / FAQ-3 | 仅验证了 DeepSeek + 智谱连通 | 改为 "已接入 DeepSeek、智谱等主流模型" |
| 6 | **基于延迟/成本的智能调度** | 特性卡片 #2 / FAQ-6 | 仅 Priority + Weight 排序 | 改为 "按优先级自动路由" |
| 7 | **支持 A/B 测试与灰度发布** | 特性卡片 #2 | 不支持 | ❌ 删除 |
| 8 | **请求断路器 / 指数重试** | 特性卡片 #3 | 无实现 | ❌ 删除 |
| 9 | **多级限流与熔断保护** | 特性卡片 #3 | 无实现 | ❌ 删除 |
| 10 | **数据路由区域锁定** | 特性卡片 #6 / FAQ-9 | 无实现 | ❌ 删除 |
| 11 | **Function Calling / JSON Mode** | 特性 #1 / FAQ-2 / FAQ-8 | 后端无 tools/function 参数解析 | 改为 "支持 OpenAI 标准接口，可透传 tools 参数" |
| 12 | **在线 API 沙盒 / Playground** | 特性卡片 #5 / Hero 按钮 | 未实现 | ❌ 删除按钮 |
| 13 | **实时日志与调用链路追踪** | 特性卡片 #5 | 仅有 request_log，无 trace | 改为 "API 调用日志记录" |
| 14 | **完整的审计日志** | 特性卡片 #6 | 仅有 API log，无管理员操作审计 | 改为 "API 请求记录" |
| 15 | **毫秒级故障自动切流** | 特性卡片 #2 / FAQ-6 | Fallback 按序尝试，但无健康探测 | 改为 "自动切换至备用 Provider" |
| 16 | **Rust 高性能代理内核** | 基础设施 #2 | 后端是 Go 实现 | ❌ 删除 "Rust" |
| 17 | **K8s HPA 自动弹性扩容** | 基础设施 #4 | 无 K8s 部署 | ❌ 删除 |
| 18 | **支付方式（支付宝/微信）** | FAQ-4 | 未对接支付 | FAQ 中改为 "请联系销售" |
| 19 | **1,000,000 Tokens 免费额度** | 定价卡片  | 需确认是否已实现额度赠送逻辑 | 核实后确认 |
| 20 | **SOC 2** | Footer 链接 | 无认证 | ❌ 删除 |

---

## 建议修改汇总

### 需要修改的文件清单

| 文件 | 修改优先级 |
|------|:----------:|
| `portal/src/data/features.ts` | 🔴 P0 — 5/6 个特性卡片需重写 |
| `portal/src/data/infrastructure.ts` | 🔴 P0 — 4 个卡片全部虚假 |
| `portal/src/components/HeroSection.vue` (描述文案) | 🔴 P0 |
| `portal/src/components/HeroSection.vue` (统计数字 + 按钮) | 🔴 P0 |
| `portal/src/components/InfrastructureSection.vue` | 🔴 P0 |
| `portal/src/components/PricingSection.vue` | 🟡 P1 |
| `portal/src/data/faq.ts` | 🟡 P1 |
| `portal/src/data/pricing.ts` | 🟡 P1 |
| `portal/src/components/Header.vue` ("SLA 99.99%" 徽章) | 🔴 P0 |

---

## 真实宣传点重新提案

建议门户只使用以下真实能力作为核心宣传：

```
Hero: 一个 API 调用全品类 AI 模型
       兼容 OpenAI SDK · 5 分钟接入 · 按量付费

特性卡片 1: 统一 API，无限模型
          兼容 OpenAI 接口规范，一次接入自由切换

特性卡片 2: 智能故障切换
          多 Provider 自动容灾，保障服务连续

特性卡片 3: 按量计费，透明可控
          精确 Token 计费 + 实时用量监控

特性卡片 4: API Key 管理
          多 Key + 额度控制 + RBAC 权限体系

特性卡片 5: SSE 流式支持
          完整流式转发 + Token 级计费

特性卡片 6: 企业级安全
          TLS 加密 + 请求日志 + 角色权限
```

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-28 | v1.0 | 初始版本 | Product Manager |

---

# End
