# 门户文案修正 — 执行方案

Version: v1.0

Status: Draft

Owner: Frontend Engineer

Last Updated: 2026-07-28

---

## 变更总览

| 文件 | 改动类型 | 预计工时 |
|------|---------|:--------:|
| `src/data/features.ts` | 6 个卡片全部重写 | 20min |
| `src/components/HeroSection.vue` | 描述文案 + 统计数字 | 15min |
| `src/components/AppHeader.vue` | 删除 SLA 徽章 | 5min |
| `src/data/faq.ts` | 7 条修改 + 1 条删除 | 15min |
| `src/components/InfrastructureSection.vue` | 整块隐藏 | 10min |
| `src/data/infrastructure.ts` | 数据文件冗余 | 5min |
| `src/components/FooterSection.vue` | 删除 SOC2 链接 | 5min |
| `src/data/pricing.ts` | 确认后调整 | 5min |
| **合计** | | **~1.5h** |

---

## 1. feature.ts — 6 个卡片全部重写

**文件路径**: `portal/src/data/features.ts`

### 卡片 1：统一 API

```
旧 → 新

title:    '统一 API，无限模型' → '统一 API，自由切换'
highlight: '一次接入，自由切换'  → '兼容 OpenAI 接口规范'
description: → 不变（保留）
details:  [
-  '支持 Function Calling 与 JSON Mode',
-  '50+ 模型统一接入，零改造迁移',
-  '统一的鉴权、计费与流控体系',
] → [
+  '兼容 OpenAI Chat Completions 标准接口',
+  '多模型统一接入，零改造迁移',
+  '统一的鉴权、计费与流控体系',
]
metrics:  '50+ Models' → '统一接入'
```

### 卡片 2：故障切换（整张替换）

```
旧 → 新

id:        'smart-routing' → 'auto-fallback'
iconName:  'Cpu' → 'ShieldCheck'
title:     '智能企业级模型路由' → '多 Provider 自动故障切换'
highlight: '动态调度，高可用保障' → '服务连续不中断'
description:
  '根据实时节点延迟、成功率动态调整路由策略。
   遇到厂商波动时，极速平滑热切换至备用模型，保障核心体验。'
  →
  '当主用 Provider 返回错误或超时时，系统自动按优先级顺序
   切换至备用 Provider，整个过程对用户透明，业务无感。'
details: [
-  '毫秒级故障自动切流',
-  '基于延迟/成本的智能调度',
-  '支持 A/B 测试与灰度发布',
] → [
+  '多 Provider 自动容灾切换',
+  '按优先级/权重自动路由选择',
+  '可配置多组 Provider 绑定',
]
metrics:  '< 5ms' → '自动切换'
```

### 卡片 3：按量计费（整张替换）

```
旧 → 新

id:        'stability' → 'pay-per-use'
iconName:  'ShieldCheck' → 'Zap'
title:     '金融级网关稳定性' → '按量计费，透明可控'
highlight: '99.99% SLA 保障' → 'Token 级精确计费'
description:
  '自建全球多地域分发网络，具备请求断路器、指数重试与
   智能限流策略。为企业级负载提供坚如磐石的可靠保证。'
  →
  '按实际 Token 消耗计费，精确区分输入（Prompt）和输出
   （Completion）Token。支持峰值/低谷差异化定价策略，
   所有费用在控制台实时可查。'
details: [
-  '自建全球 Anycast 分发网络',
-  '请求断路器与指数退避重试',
-  '多级限流与熔断保护',
] → [
+  '精确区分输入/输出 Token 计费',
+  '支持峰谷定价，后台可动态配置',
+  '实时用量监控与成本报表导出',
]
metrics:  '99.99%' → '按量付费'
```

### 卡片 4：SSE 流式（整张替换）

```
旧 → 新

id:        'cost-optimization' → 'streaming-support'
iconName:  'Zap' → 'Terminal'
title:     '显著降低推理成本' → 'SSE 流式响应支持'
highlight: '语义缓存，直降 40-70%' → '完整流式转发'
description:
  '融合语义精准缓存架构，面对高频相似请求直接返回结果。
   无需调用大模型，每百万次 Token 调用可省下 40-70% 费用。'
  →
  '完整支持 SSE（Server-Sent Events）流式响应，实时转发
   Provider 的流式输出。流式计费精度与普通请求一致，从
   最后一块数据中精确解析 Token 用量，不遗漏任何费用。'
details: [
-  '语义级精准缓存命中',
-  '后置成本的自动路由策略',
-  '详细的可视化成本分析报表',
] → [
+  '完整 SSE 流式代理转发',
+  '流式场景 Token 级精确计费',
+  '实时监控流式响应状态',
]
metrics:  '-70%' → 'SSE'
```

### 卡片 5：开发者体验（微调）

```
旧 → 新

title:    → 不变
highlight: → 不变
description:
  '极简配置。提供 SDK 及原生 HTTP 直连支持。开箱即用的
   Playground 支持即时的调试、参数监控与流式结果展示。'
  →
  '极简配置。提供原生 HTTP 直连支持，兼容 OpenAI 原生 SDK。
   只需修改 base_url 和 api_key，5 分钟内即可完成接入。'
details: [
  '兼容 OpenAI 原生 SDK',
- '在线 API 沙盒即时调试',
- '实时日志与调用链路追踪',
] → [
  '兼容 OpenAI 原生 SDK',
+ '每次 API 调用的请求日志记录',
+ '支持多语言 cURL/Python/JS/Go 示例',
]
metrics:  → 不变
```

### 卡片 6：API Key 管理（整张替换）

```
旧 → 新

id:        'security' → 'api-key-management'
iconName:  'Lock' → 'Lock'
title:     '企业合规与安全边界' → 'API Key 管理与权限控制'
highlight: '数据完全由您掌控' → '多 Key + 额度限制'
description:
  '拥有您数据的完全控制。含高级审计日志、子账户角色访问
   鉴权（RBAC），并可针对合规需求锁定数据路由物理区域。'
  →
  '支持创建多个 API Key，每个 Key 可独立设置额度上限和
   模型访问白名单。内置角色权限体系，支持管理员、操作员
   等不同角色，满足团队协作需求。'
details: [
-  '完整的审计日志记录',
-  'RBAC 角色权限体系',
-  '数据路由区域锁定',
] → [
+  '多 API Key 独立管理',
+  '额度上限与模型白名单控制',
+  '请求日志审计记录',
]
metrics:  'SOC 2' → '安全可控'
```

---

## 2. HeroSection.vue — 文案修正

**文件路径**: `portal/src/components/HeroSection.vue`

### 2.1 顶部 Badge（约第 70 行）

```html
<!-- 当前 -->
<span>完全支持 DeepSeek R1 & GPT-4o 智能双路降级</span>

<!-- 改为 -->
<span>已支持 DeepSeek、智谱 GLM 等多模型统一接入</span>
```

### 2.2 主描述（约第 88-90 行）

```html
<!-- 当前 -->
<p class="...">
  企业级 AI 统一网关，兼容 OpenAI SDK 接口规范。免改造集成
  DeepSeek、GPT-4o、Claude 3.5、Qwen 等 50+ 顶级大模型，
  内置语义缓存与毫秒级故障自动切流。
</p>

<!-- 改为 -->
<p class="...">
  企业级 AI 统一网关，兼容 OpenAI SDK 接口规范。免改造集成
  DeepSeek、智谱 GLM 等主流大模型，支持多 Provider 自动故障切换，
  让您专注于业务而非基础设施。
</p>
```

### 2.3 第二个按钮（约第 102-107 行）

```html
<!-- 当前 -->
<button class="...">
  <Play class="..." />
  <span>在线试用 API 沙盒</span>
</button>

<!-- 改为 → 直接删除该按钮 -->
```

### 2.4 统计数字区域（约第 193-205 行）

```html
<!-- 当前：4 个统计卡片 -->
<div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
  <div>...5,000,000,000+ 日均API请求...</div>       <!-- ❌ 删除 -->
  <div>...< 5 ms 网关额外代理延时...</div>           <!-- 保留 -->
  <div>...99.99% 企业级SLA...</div>                 <!-- ❌ 删除 -->
  <div>...50+ 全球主流模型...</div>                   <!-- ❌ 删除 -->
</div>

<!-- 改为：只保留 1 个真实统计 -->
<div class="mt-12 text-center text-sm text-slate-500">
  <!-- 整块统计区暂时隐藏，等有真实数据再恢复 -->
</div>
```

**直接删除整个 `.grid` 统计区块**（保留骨架，等有真实运营数据再恢复）。

---

## 3. AppHeader.vue — 删除 SLA 徽章

**文件路径**: `portal/src/components/AppHeader.vue`

### 删除 SLA 状态徽章（约第 73-79 行）

```html
<!-- 当前 -->
<div class="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50
            border border-emerald-200/80 text-emerald-700 text-xs font-medium">
  <span class="relative flex h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
  <span>SLA 99.99%</span>
</div>

<!-- 改为：直接删除这整段 <div> -->
```

### 移动端菜单中的状态提示（约第 112-117 行）

```html
<!-- 当前 -->
<div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50
            border border-emerald-200 text-emerald-700 text-xs mb-2">
  <span class="relative flex h-2 w-2">
    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
  <span>系统状态: 99.99% 正常运行</span>
</div>

<!-- 改为：直接删除这整段 <div> -->
```

---

## 4. Infrastructure — 整块隐藏

**文件**: `portal/src/components/InfrastructureSection.vue` + `portal/src/data/infrastructure.ts`

**方案**：MVP 阶段直接隐藏整个 Section，等基础设施真正具备后再展示。

### 在 HomePage.vue 中注释掉引用

**文件**: `portal/src/pages/HomePage.vue`

```html
<!-- 当前 -->
<InfrastructureSection />

<!-- 改为 -->
<!-- <InfrastructureSection /> 待基础设施具备后恢复 -->
```

同时移除 import：
```ts
// 当前
import InfrastructureSection from '@/components/InfrastructureSection.vue'

// 改为
// import InfrastructureSection from '@/components/InfrastructureSection.vue'
```

---

## 5. FAQ — 修改 7 条，删除 1 条

**文件路径**: `portal/src/data/faq.ts`

### FAQ-2：API 兼容性

```ts
// 旧
answer: '...同时支持 Function Calling、Stream、JSON Mode 等全部特性。'

// 新
answer: '...同时支持 Stream 流式响应模式。Chat Completions 接口与 OpenAI 标准格式完全兼容，您可以直接使用 OpenAI 的 Python SDK、Node.js SDK、cURL 等工具无缝切换，只需修改 base_url 和 api_key 即可。'
```

### FAQ-3：支持哪些模型

```ts
// 旧
answer: '目前已接入 50+ 主流模型，包括 OpenAI（GPT-4o/o1）、Anthropic（Claude 3.5）...'

// 新
answer: '目前已接入 DeepSeek（R1/V3）、智谱（GLM-4）等主流模型。平台支持灵活接入新模型，您可以在 Admin 控制台中查看最新模型列表。'
```

### FAQ-6：故障切换

```ts
// 旧
answer: '当主调模型返回错误或超时时，系统会在毫秒级自动切换到您配置的备用模型。支持多种切换策略：① 按优先级顺序切换；② 按最低延迟切换；③ 按最低成本切换。...'

// 新
answer: '当主用 Provider 返回错误或超时时，系统会自动按配置的优先级顺序切换至备用 Provider。您可以在模型中绑定多个 Provider 并设置权重，系统会按权重分配流量，失败时自动尝试下一个。整个过程对用户透明，业务无感。'
```

### FAQ-7：语义缓存（整条删除）

```ts
// 旧
{
  id: 'faq-7',
  question: '语义缓存能省多少钱？',
  answer: '语义缓存对高频相似请求场景效果显著...',
},

// 新 → 整条删除
```

### FAQ-8：Function Calling

```ts
// 旧
answer: '完全支持。Nova AI Gateway 完整透传 OpenAI 标准的 Function Calling（工具调用）参数...'

// 新
answer: 'Gateway 会将 tools/functions 参数完整透传给 Provider。具体是否支持 Function Calling 取决于您调用的 Provider 本身的能力，建议查阅对应 Provider 的文档。'
```

### FAQ-9：企业支持

```ts
// 旧
answer: '企业客户可享受：① 专属技术支持群（7×24h）；② 定制化 SLA 保障（最高 99.99%）；③ 私有化部署方案；④ 月结账期与用量折扣；⑤ 数据路由区域锁定（满足 GDPR 等合规要求）。...'

// 新
answer: '企业客户可享受：① 专属技术支持群（7×24h）；② 私有化部署方案；③ 月结账期与用量折扣。详情请联系售前团队。'
```

---

## 6. Footer — 删除 SOC2 链接

**文件路径**: `portal/src/components/FooterSection.vue`

```html
<!-- 当前（约第 74-82 行） -->
<div class="space-y-3">
  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">安全与合规</h4>
  <ul class="space-y-2 text-xs">
    <li><a href="#" class="hover:text-blue-600 transition-colors">SOC2 Type II 认证</a></li>  <!-- ❌ 删除 -->
    <li><a href="#" class="hover:text-blue-600 transition-colors">数据零留存 (Zero-Log)</a></li>
    <li><a href="#" class="hover:text-blue-600 transition-colors">企业级 SLA 保证</a></li>       <!-- ⚠️ 措辞待确认 -->
    <li><a href="#" class="hover:text-blue-600 transition-colors">服务条款 & 隐私协议</a></li>
  </ul>
</div>

<!-- 改为 -->
<div class="space-y-3">
  <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">安全与合规</h4>
  <ul class="space-y-2 text-xs">
    <li><a href="#" class="hover:text-blue-600 transition-colors">数据零留存 (Zero-Log)</a></li>
    <li><a href="#" class="hover:text-blue-600 transition-colors">服务条款 & 隐私协议</a></li>
  </ul>
</div>
```

---

## 7. Pricing — 确认后调整

**文件路径**: `portal/src/data/pricing.ts`

| 字段 | 当前 | 待确认 | 修改后（默认） |
|------|------|--------|---------------|
| 免费额度 | 1,000,000 Tokens 免费额度 | 是否已实现赠送？ | 暂改为「注册即送体验额度」 |
| 支付宝/微信支付 | 支持支付宝、微信支付 | 是否已对接？ | 改为「请联系销售了解支付方式」 |
| ¥299/月 | 专业版 ¥299/月 | 是否真实定价？ | 待确认后决定 |

---

## 8. 执行检查清单

### 修改前

- [ ] 确认定价信息是否真实（需与后端/销售确认）
- [ ] 确认免费额度赠送逻辑是否已实现

### 修改后

- [ ] `npx vue-tsc --noEmit` — TypeScript 类型检查通过
- [ ] `npm run build` — 生产构建成功
- [ ] 浏览器打开页面，所有 Section 渲染正常
- [ ] Infrastructure Section 已隐藏，导航链接中对应锚点已不在
- [ ] FAQ 展开/收起功能正常
- [ ] Header 不再显示 SLA 徽章

---

## 9. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-28 | v1.0 | 初始版本 | Product Manager |

---

# End
