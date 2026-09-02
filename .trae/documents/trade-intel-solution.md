# 解决方案中心新增「传统商贸 · AI 贸易情报员」—— 全量工作台 Demo 方案（v2）

## 一、背景与目标

在 `/solutions` 解决方案中心新增行业「传统商贸」（内外贸通用口径），上线「AI 贸易情报员」解决方案：帮贸易公司（做产品差价的商贸/贸易企业）自动寻找客户、供应商、市场机会，把互联网碎片信息（海关提单、企业官网、展会名录、行业黄页、招标与更换供应商公告）清洗整理成可直接跟进的商机。

原型：`aigateway/docs/仓库/xx-ai-·-ai贸易情报员`（React + Vite 演示工作台，无后端）。本轮已与用户确认两个决策：

1. **行业命名口径 = 传统商贸（内外贸通用）**：方案中心 Tab / 首页轮播文案用「传统商贸」；贸易 Demo 的销售内容（海外客户样例、海关提单等）仍保留原型样例，仅做小改文案与数据层标签（弱化排他性的「外贸」二字）。
2. **Demo 形态 = 全量工作台完整移植**：忠实还原原型左侧导航 + 全部业务视图（需求输入 / AI 采集进度 / 客户情报矩阵 / 供应商寻源 / 市场情报 / 竞品情报 / 商机雷达 / 任务中心 / 设置）+ 客户画像 / AI 开发信 两个弹窗 + 3 分钟路演向导条与话术 Modal。

技术栈：Vue3 `<script setup>` + TS + Tailwind 3.4 + lucide-vue-next + vue-router（portal 是 Vue，React 原型只作**数据与交互的翻译来源**，不引入 React）。构建 `npm run build`（vue-tsc --noEmit && vite build）。

本方案同时是对已上线「行业筛选网格」扩展性的真实验收：**新增行业 = 加数据 + 新 Demo 工作台**，不改列表页 / 轮播组件。

## 二、现状分析

### 2.1 原型结构（待移植内容）

| 视图/弹窗 | 文件 | 主要 UI | 消费数据 |
|---|---|---|---|
| 首页（新建任务） | `HomeView.tsx` | 价值主张、传统 vs AI 对比、任务表单（产品/市场/客户类型/要求）、高级过滤手风琴、最近任务卡、3 行业预设 | `TaskHistoryItem` |
| AI 采集进度 | `AIProgressView.tsx` | 5 张跳动计数卡、10 节点流水线 + 进度条、深色终端日志流、1x/2x 变速 | 内部 setInterval |
| 客户情报矩阵 | `CustomerLeadsView.tsx` | 统计头 5 指标卡、过滤工具栏、高密度表格、星级/排序/多选/导出、画像/开发信入口 | `CompanyLead[]` |
| 供应商寻源 | `SupplierIntelligenceView.tsx` | 左列表右档案 master-detail、产业集群筛选 | `SupplierItem[]` |
| 市场情报 | `MarketIntelligenceView.tsx` | 指标卡 4 张、区域机会排行 + 区域档案、产品趋势列表 | `MarketOpportunity[]` |
| 竞品情报 | `CompetitorIntelligenceView.tsx` | 品牌多维对比矩阵、突围策略卡 | `CompetitorItem[]` |
| 商机雷达 | `OpportunityRadarView.tsx` | LIVE 徽章、过滤 pills、商机卡流（查看画像 / 生成开发信） | `CommercialOpportunity[]` |
| 任务与收藏中心 | `TaskCenterView.tsx` | history / starred / settings（五维权重滑杆）三 Tab | `TaskHistoryItem[]`、`CompanyLead[]` |
| 设置（系统） | App.tsx 内嵌 | 数据接入通道状态卡 | 静态 |
| 客户画像弹窗 | `CustomerDetailModal.tsx` | 5 Tab：企业画像与匹配 / 五维评分 / 商机行动 / 决策人 / 数据溯源；nextSteps 勾选 | `CompanyLead` 嵌套字段 |
| AI 开发信弹窗 | `EmailGeneratorModal.tsx` | 4 种语气策略、语言下拉、3 条 A/B 主题行、正文预览、假 loading 重新生成、一键复制 | lead.contacts 等 |
| 3 分钟路演引导 | 顶部 Banner + PitchGuideModal | ①输入需求→②采集→③客户矩阵→④画像→⑤开发信 可点跳转 | — |

**已验证：** 原型 UI 除 lucide 图标外全部为纯 CSS/Tailwind（recharts / motion / canvas-confetti 仅声明依赖、实际未用），移植零外部依赖。

### 2.2 Portal 现有方案装配模式与当前进度

- **行业元数据驱动**：`solutionIndustries.ts` 的 `SOLUTION_INDUSTRIES`（online 驱动 Tab + 轮播）；`INDUSTRY_ICONS` / `INDUSTRY_TONES` / `INDUSTRY_BTN` 为 id → 字面量 class map。
- **解决方案数据**：`solutions.ts` 的 `Solution[]`（slug/…/pipeline/funding/theme + 文案 override + status）。
- **详情页**：`SolutionDetailPage.vue` 按 slug 渲染线性 pipeline；各节点经 `NODE_DEMOS[nodeId]` 控制「演示」按钮，`openDemo` → `NodeDemoModal`（wide）内按 id 分发到对应 Demo（env 范式：`ENV_VIEW_BY_NODE` stage→员工视图映射 + `EnvEmployeeMatrixDemo(:initial-employee)` + `@handoff`）。路由 `/solutions/:slug` 动态，无需改。
- **Demo 组件目录**：`portal/src/components/demos/`（各方案一套），复杂工作台放子目录（`demos/envEmployee/` 等）。

**上一会话已落地但未提交（`git status` 可见 M / ?? 文件）**：
- `solutionIndustries.ts`：已加 `trade` 行业（name 暂为「传统外贸」，需按决策改「传统商贸」）+ Ship 图标 + sky 系 tones/btn。
- `solutions.ts`：已加 `trade-intel` Solution（theme/pipeline 8 节点/funding/文案 override 齐全，文案暂偏「外贸」，需弱化）。
- `nodeDemos.ts`：已注册 `trade-start/crawl/customers/suppliers/market/competitors/radar/end` 8 条（ready true）。
- `tradeIntelData.ts` + `tradeLeads.ts`（未跟踪）：类型（`TradeView`/`CompanyLead`/`SupplierItem`/…）+ 常量组（presets/stats/crawl steps/channels/score dims）+ mock 数据（10 客户 / 4 供应商 / 4 市场 / 3 竞品 / 4 商机 / 3 历史任务）已建。

**尚未落地（本轮主要工作量）**：`TradeIntelDemo.vue` 容器 + `tradeIntel/` 子组件全套、`SolutionDetailPage.vue` 接线、构建验证与发布。

### 2.3 关键差异点

- 贸易原型是**亮色 SaaS 工作台**（`#F8FAFC` + slate + blue-600 强调），与环保暗色工作台（`#0A0C10` + emerald）观感不同 → 贸易 Demo 容器走亮色原型风，保留原型主视觉。
- 贸易 Demo 是多 Tab 工作台：详情页各 pipeline 节点打开**同一工作台的不同视图**（与环保「同一容器不同员工」同构），复用 env 的「容器 + initial-view + handoff」模式，实现风险低。
- 图标/评分等字段多数以数据内嵌，无外部图表依赖。

## 三、目标结构设计

### 3.1 数据层：行业名改口径 + 文案弱化（改已有未提交内容）

**A. `portal/src/data/solutionIndustries.ts`**
- `trade.name`: 「传统外贸」→「**传统商贸**」；`desc` 建议改为「寻客户、找供应商、读市场，把碎片信息整理成可跟进商机的商贸情报中枢」（弱化「外贸」排他词）。
- `Ship` 图标、sky tones、`INDUSTRY_BTN.trade` 保持不动。

**B. `portal/src/data/solutions.ts`（`trade-intel` 条目文案做「商贸化」小改，结构与数据不动）**
- `name`: 「AI 贸易情报员 · 外贸客户与商机雷达」→「AI 贸易情报员 · **客户与商机雷达**」。
- `tag`: 「面向外贸企业」→「面向**商贸企业**」。
- `description` / `audience` / `highlight` / `capabilities[].description`：把排他性的「外贸公司、工厂外贸部」改为「内外贸贸易公司、批发与分销商、工贸一体企业」等商贸通用口径；海关提单 / 供应商认证 / 商机雷达等业务表述保留（本就通用）。
- `pipeline`：节点 copy 中「外贸业务员」「外贸情报任务」等 → 「贸易业务员 / 商贸情报任务」；`funding` 与文案 override（`heroTitlePrefix`「让外贸企业」→「让商贸企业」、`pipelineBadge`「外贸情报工作流」→「商贸情报工作流」、`ctaTag/ctaTitlePrefix` 同步）统一商贸化。
- 主题 sky-blue 系、pipeline id、status online 均不动。

**C. `tradeIntelData.ts` / `tradeLeads.ts`（已建）**
- 数据与工作台内部文案基本保留原型样例（海外客户 / 铝合金门窗北美 etc. 是贸易业务的标准演示）；仅把「给传统外贸企业老板演示」这类面向定位的引导句改为「传统商贸企业」，属 Demo 组件内部文案，随组件实现时处理。

### 3.2 Demo 工作台：`TradeIntelDemo.vue` + 子组件（亮色全量移植）

**容器 `portal/src/components/demos/TradeIntelDemo.vue`**（仿 `EnvEmployeeMatrixDemo.vue` 装配）
- `defineProps<{ initialView?: TradeView }>()`，`defineEmits<{ (e:'handoff'):void }>()`；`activeTab = ref(initialView)`。
- 布局：亮色工作台三栏 —— 左 `TradeSidebar`（深色 `#0F172A`）、右 `TradeHeader` + 可关闭「3 分钟路演向导条」、滚动主区按 activeTab `v-if` 渲染各视图、底部悬浮「完成演示，返回解决方案」按钮 emit handoff（复用 env 悬浮钮样式但 sky 渐变）。
- 顶层共享状态集中于此（照原型 App.tsx）：`leads`（星标可变）、`currentProduct/currentMarket`（preset 联动）、toast（导出成功）、`customerDetail` / `emailLead` 两弹窗开关、路演 Modal 开关。

**子组件（新建 `portal/src/components/tradeIntel/` 目录，前缀 Trade* 防全局冲突）**

| 文件 | 内容要点（对照原型） |
|---|---|
| `TradeSidebar.vue` | 品牌 + 新建任务 + 核心情报分组（客户情报 237 / 供应商 328 / 市场 / 竞品 / 商机 LIVE 红点）+ 数据资产与工作台（任务中心 / 我的收藏计数 / 历史任务）+ 系统设置 + 底部路演卡；active 高亮 |
| `TradeHeader.vue` | 标题 + 状态（142 口岸 · 全球已索引企业）、行业 preset 下拉（3 预设联动 product/market）、路演向导、导出报告、新建采集 |
| `TradeHomeView.vue` | 价值 Banner（传统 vs AI 对比）、任务表单（产品/市场/客户类型/要求 + 预设快捷卡 + 高级过滤手风琴）、最近任务（重跑跳 progress） |
| `TradeProgressView.vue` | AI 采集动画：跳动计数卡 + 10 步流水线 + 进度条 + 深色终端日志流 + 1x/2x 变速；进度满后按钮跳「客户情报矩阵」 |
| `TradeCustomersView.vue` | 统计 5 卡 + 过滤工具（搜索/国家/等级/业态/最低匹配度滑杆/只看星标）+ 排序 + 表格（匹配条/tier/行动）+ 多选行 + 导出 toast + 行点击开画像、行内开开发信、星标切换 |
| `TradeSuppliersView.vue` | 左列表右档案 master-detail（省级筛选），档案含认证 / 优势 / OEM·ODM / MOQ / 交期 |
| `TradeMarketView.vue` | 指标卡 4 张 + 区域机会排行（机会指数条/主需求/客户类型/政策摘要/进入壁垒/AI 建议）+ 产品趋势标签 |
| `TradeCompetitorsView.vue` | 竞品多维对比矩阵（份额/价格带/产品结构/渠道/软肋/我方优势）+ 突围策略卡（行选中高亮） |
| `TradeRadarView.vue` | LIVE 徽章 + 过滤 pills + 商机卡流（等级星 / 需求摘要 / 目标产品 / 预估体量 / AI 建议动作 / 查看画像 / 生成开发信） |
| `TradeTasksView.vue` | 三 Tab：历史任务（重跑）/ 我的收藏（去画像）/ 评分权重设置（五维滑杆 30/20/20/15/15 实时预览重排序） |
| `TradeSettingsView.vue` | 系统设置：数据接入通道状态卡（4 通道 CONNECTED/RUNNING/READY/SYNCED）+ 返回新建任务 |
| `TradeCustomerDetailModal.vue` | 客户画像 5 Tab：企业画像与匹配 / 五维评分（雷达条）/ 商机行动（opportunities）/ 决策人（contacts）/ 数据溯源（sources + importData）；nextSteps 勾选、收藏、导出、生成开发信 |
| `TradeEmailGeneratorModal.vue` | AI 开发信：语气策略（针对痛点/成本优势/专业合规/差异化）+ 语言下拉 + A/B 主题行 + 正文预览 + 重新生成 loading + 一键复制 |
| `TradePitchGuideModal.vue` | 3 分钟路演话术 Modal（第 1/2/3 分钟步骤 + 演示动作 + 话术要点） |

> 数据一律从 `tradeIntelData.ts` / `tradeLeads.ts` 导入；组件内部仅放演示所需本地小数组（突围策略、产品趋势、开发生成模板，照原型）。

### 3.3 详情页与节点注册：接入 TradeIntelDemo

**`portal/src/pages/SolutionDetailPage.vue`**（接入，改动小）
- `import TradeIntelDemo from '@/components/demos/TradeIntelDemo.vue'`；`import type { TradeView } from '@/data/tradeIntelData'`。
- 脚本区新增：`TRADE_VIEW_BY_NODE`（`trade-start→home / trade-crawl→progress / trade-customers→customers / trade-suppliers→suppliers / trade-market→market / trade-competitors→competitors / trade-radar→radar / trade-end→home`）、`isTradeIntel`、`tradeInitialView`。
- `NodeDemoModal` `:wide` 并入 `|| isTradeIntel`（L732）；内容末尾加 `<TradeIntelDemo v-else-if="isTradeIntel" :initial-view="tradeInitialView" @handoff="handleHandoff" />`。
- `iconMap` 补键：pipeline 用到 `Target / Factory / Globe / Compass / Zap`（Radar/Handshake/Award/Lightbulb 已有；无 key 时兜底 Workflow 可接受，但补齐更佳）。
- `nodeDemos.ts` 已注册的 trade 条目不动（不加 NEXT 自动跳转，工作台内自由浏览，关闭返回方案页，与 env 一致）。

### 3.4 列表页 / 首页轮播自动呈现（零组件改动）

- /solutions Tab 自动多「传统商贸(1)」、「全部(6)」计数自动更新；网格自动多一卡（sky 配色 + Ship）。
- 首页轮播自动多一页「传统商贸」行业卡（`INDUSTRY_TONES['trade']`）。
- `SolutionEntryBanner` primary 仍取首个 online（university-agent），无需处理。

### 3.5 不做的事（边界）

- 不改 `types/index.ts` 的 `Solution` 接口；不改路由 / SolutionsPage / SolutionsSection / SolutionEntryBanner（继续验证数据驱动零改动）。
- 不引入图表库 / 不做后端接入，纯前端静态演示数据。
- 详情页不复制 env 的模块网格特判（trade 语义用线性链路）。
- 其它行业与方案（含 coming-soon）不动。

## 四、改动清单（相对当前工作区）

| # | 文件 | 类型 | 要点 |
|---|---|---|---|
| 1 | `solutionIndustries.ts` | 改 | trade.name →「传统商贸」、desc 商贸化（其余已建不动） |
| 2 | `solutions.ts` | 改 | `trade-intel` 文案商贸化小改（name/tag/desc/audience/能力/pipeline 措辞/funding/文案 override） |
| 3 | `tradeIntelData.ts` / `tradeLeads.ts` | 已建 | 复核字段与原型一致性（新增或微调仅在实现中发现差异时） |
| 4 | `tradeIntel/TradeSidebar.vue` | 新增 | 深色左导航（核心情报/工作台/系统管理/路演卡） |
| 5 | `tradeIntel/TradeHeader.vue` | 新增 | 顶栏 + preset 下拉 + 导出 + 向导入口 + 新建采集 |
| 6 | `tradeIntel/TradeHomeView.vue` | 新增 | 需求输入页（表单/预设/高级过滤/最近任务） |
| 7 | `tradeIntel/TradeProgressView.vue` | 新增 | AI 采集动画（计数卡/10 步/终端日志/变速） |
| 8 | `tradeIntel/TradeCustomersView.vue` | 新增 | 客户情报矩阵（统计/过滤/排序/表格/星标/多选/导出） |
| 9 | `tradeIntel/TradeSuppliersView.vue` | 新增 | 供应商 master-detail |
| 10 | `tradeIntel/TradeMarketView.vue` | 新增 | 市场机会区域档案 + 产品趋势 |
| 11 | `tradeIntel/TradeCompetitorsView.vue` | 新增 | 竞品对比矩阵 + 突围策略 |
| 12 | `tradeIntel/TradeRadarView.vue` | 新增 | 商机雷达 LIVE 流 |
| 13 | `tradeIntel/TradeTasksView.vue` | 新增 | 历史/收藏/权重设置三 Tab |
| 14 | `tradeIntel/TradeSettingsView.vue` | 新增 | 系统设置通道状态 |
| 15 | `tradeIntel/TradeCustomerDetailModal.vue` | 新增 | 客户画像 5 Tab 弹窗 |
| 16 | `tradeIntel/TradeEmailGeneratorModal.vue` | 新增 | AI 开发信弹窗 |
| 17 | `tradeIntel/TradePitchGuideModal.vue` | 新增 | 3 分钟路演话术 |
| 18 | `demos/TradeIntelDemo.vue` | 新增 | 工作台容器（initialView/handoff/共享状态中枢） |
| 19 | `SolutionDetailPage.vue` | 改 | TRADE_VIEW_BY_NODE + isTradeIntel + wide 并入 + Modal 分发 + iconMap 补键 |
| 20 | `nodeDemos.ts` | 已建 | trade-* 8 条已注册，不动 |

## 五、假定与决策（已确认）

1. 行业定位 = **传统商贸（内外贸通用）**：Tab / 轮播 / 徽章 =「传统商贸」；方案名去「外贸」；文案弱化排他性外贸词，贸易业务能力表述保留。
2. Demo 范围 = **全量工作台移植**：9 视图 + 2 弹窗 + 3 分钟路演，交互（筛选/排序/星标/多选/收藏/开发信/复制/变速/权重滑杆）按原型还原。
3. 客户数据用原型 lead-01~10（10 条完整档案）；供应商 4 / 市场 4 / 竞品 3 / 商机 4 / 历史任务 3；表格顶部总览大数字（1286/823/237/38/12）以静态统计卡呈现。
4. 视觉：Demo 工作台 = 原型亮色（#F8FAFC + slate + blue/sky）；方案页主题 = sky-blue 海洋系（已建）；所有主题 class 为完整字面量。
5. 详情页沿用线性 pipeline + NodeDemoModal 分发（不引入 env 模块网格）；阶段间不自动 NEXT，「完成演示」返回方案页。
6. 其它行业/方案（含 coming-soon）数据与组件不动；纯前端静态 Demo。

## 六、验证步骤

1. `cd aigateway/portal && npm run build`（vue-tsc --noEmit && vite build）通过。
2. 本地起 dev server（`npx vite`），浏览器逐项：
   - `/solutions`：出现「传统商贸」Tab，默认「全部」= 6 卡；切「传统商贸」仅剩贸易卡（Ship + sky）；计数正确；规划中区不受影响。
   - `/solutions/trade-intel`：Hero/能力/管控配色 sky-blue；pipeline 8 节点渲染完整；节点文案为商贸口径。
   - 点 `trade-customers / trade-radar` 等节点演示 → 弹亮色工作台并落在对应视图；Sidebar 全 Tab 可切换；客户矩阵可筛选/排序/星标/多选；行 → 画像 5 Tab 正常；画像内「AI 生成开发信」→ 开发信生成/复制正常；商机雷达 LIVE 卡可画像/开发信；任务中心收藏/权重滑杆可用；「完成演示，返回解决方案」回到详情页。
   - 首页 `/`：轮播新增「传统商贸」页，配色/图标正确。
3. 回归抽查 `/solutions/university-agent`、`/solutions/env-agent`、`/solutions/bid-consultant`、`/solutions/content-creator` 详情页与既有 Demo 不受影响。
4. `git add`（portal 相关 4 改 + tradeIntelData.ts/tradeLeads.ts + tradeIntel/ 目录 + TradeIntelDemo.vue）→ `git commit`（`feat(portal): add trade-intel solution with full trade intelligence workbench demo`）→ `git push origin main`。
5. 服务器 `ssh root@101.200.198.113`：`cd /root/aigateway/aigateway && git pull origin main && docker compose -f infra/docker/docker-compose.yml up -d --build portal`；`curl -I http://www.starnov.cn/solutions` 200，抽查 `/solutions` 有「传统商贸」Tab、`/solutions/trade-intel` 200。

## 附：验收判据

- 行业扩展性验证通过：新增「传统商贸」未改列表页 / 轮播组件，只动数据 + 新 Demo。
- 从详情页任意情报环节一键进入对应视图，完整讲完「输入需求 → 全网采集 → 客户/供应商/市场/竞品情报 → 实时商机 → AI 开发信」的贸易情报获客故事。
