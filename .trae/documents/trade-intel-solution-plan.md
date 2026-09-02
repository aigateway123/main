# 「传统商贸 · AI 贸易情报员」方案上线 —— 实施计划（收尾交付版）

> 承接已确认设计方案 v2（`.trae/documents/trade-intel-solution.md`，双决策：行业口径=传统商贸、Demo=全量工作台移植）。
> 上一会话已完成数据层 + 14 个 Demo 组件 + 工作台容器 + 详情页接线，且 `npm run build`（vue-tsc + vite）已通过；
> 当前**未提交、未部署**。本文件为收尾交付唯一执行依据：浏览器验收 → 修复 → 提交推送 → 远程部署验证。

---

## 一、目标（沿用已确认决策，不再变更设计）

1. `/solutions` 新增行业 **「传统商贸」（内外贸通用口径）**，上线 **「AI 贸易情报员 · 客户与商机雷达」**：帮商贸/贸易公司自动寻找客户、供应商、市场机会，把互联网碎片信息（海关提单、企业官网、展会名录、黄页、招标/换供应商公告）整理成可直接跟进的商机。
2. 详情页 8 个 pipeline 节点 → 打开**全量移植的贸易情报工作台 Demo**（亮色 `#F8FAFC` SaaS 风、sky-blue 主题）对应视图：输入需求 / AI 采集进度 / 客户情报矩阵 / 供应商寻源 / 市场情报 / 竞品情报 / 商机雷达 / 任务中心 / 设置，另含客户画像 5Tab、AI 开发信、3 分钟路演向导条与话术 Modal。
3. 验证「新增行业 = 数据 + 新 Demo 工作台」零组件改动模式；提交并部署远程。

## 二、当前状态（只读核实于 2026-09-02，git 未提交）

### 2.1 已完成并验证存在（`git status` 显示 M / ??，均未提交）
| 项 | 状态 |
|---|---|
| `data/solutionIndustries.ts`：trade 行业 = **「传统商贸」** + 商贸 desc + Ship/sky tones | ✅ 已核实（L61-66 / L149 / L185） |
| `data/solutions.ts`：`trade-intel` 条目文案商贸化（name「客户与商机雷达」/tag 面向商贸企业/pipeline 8 节点/funding/theme sky） | ✅ 已核实（L975 起） |
| `data/nodeDemos.ts`：`trade-start/crawl/customers/suppliers/market/competitors/radar/end` 8 条 ready:true | ✅ 不动 |
| `data/tradeIntelData.ts` + `data/tradeLeads.ts` 数据层 | ✅ 已建 |
| `components/demos/tradeIntel/` **14 个文件**（8 视图 + Sidebar/Header/Settings + Detail/Email/Pitch 弹窗） | ✅ 已核实全部存在 |
| `components/demos/TradeIntelDemo.vue` 工作台容器 | ✅ 已建 |
| `pages/SolutionDetailPage.vue` 接线：`TradeIntelDemo` import + `TRADE_VIEW_BY_NODE`(L213) + `isTradeIntel`(L223) + `tradeInitialView`(L224) + `handleHandoff` isTrade(L282) + `:wide` 并入 `|| isTradeIntel`(L759) + 分发 `<TradeIntelDemo v-else-if>`(L775) + iconMap 补 `Factory/Globe/Compass/Zap` | ✅ 已核实 |
| `portal/_TRADE_TRANSLATION_GUIDE.md` 临时文件 | ✅ 已删除 |
| `npm run build`（vue-tsc --noEmit && vite build） | ✅ 上次通过（exit 0） |

### 2.2 尚未完成（本次执行范围）
- r6 本地浏览器验收（新 Tab + 方案页 + 各节点 Demo 分发 + 工作台交互 + 首页轮播 + 回归其它方案）。
- r7 git 提交 + push origin main。
- r8 远程 Docker 部署 + curl 验证。

## 三、收尾执行步骤

### 3.1 本地浏览器验收（r6）
1. 复用/重启 `cd aigateway/portal && npm run dev`（端口 3001，勿开 5173），用 browser_use 子代理逐项验收并截图取证：
   - `/solutions`：出现「传统商贸」Tab；「全部」= 6 卡；切「传统商贸」仅剩贸易卡（Ship + sky）；计数正确；规划中区不受影响。
   - `/solutions/trade-intel`：Hero/能力/管控 sky 配色；pipeline 8 节点商贸口径文案；各节点「演示」按钮就绪。
   - 依次点 `trade-crawl`（→progress 采集动画）、`trade-customers`（→客户矩阵）、`trade-suppliers`、`trade-market`、`trade-competitors`、`trade-radar`（→商机雷达）节点 → 亮色工作台落位对应视图：
     - Sidebar 全 Tab 可切换；客户矩阵筛选/排序/星标/多选/导出 toast；行 → 画像 5 Tab + nextSteps 勾选；画像内生成开发信 → 4 策略/语言/主题行/复制反馈；商机雷达卡可画像/开发信；任务中心三 Tab（重跑→progress、收藏→客户、权重滑杆实时排序）；设置页通道状态卡。
     - 底部「完成演示，返回解决方案」→ 回详情页；右下实时采集悬浮卡（823/1,286）→ progress。
   - 首页 `/`：轮播新增「传统商贸」页。
   - 回归 `/solutions/university-agent`、`/solutions/env-agent`、`/solutions/bid-consultant`、`/solutions/content-creator` 详情页与既有 Demo 弹窗不受影响。
2. 发现 bug → 修复 → 重复 `npm run build` 通过 → 复验。

### 3.2 提交推送（r7）
- `git add` 精确名单：portal 下 `data/solutionIndustries.ts`、`data/solutions.ts`、`data/nodeDemos.ts`、`data/tradeIntelData.ts`、`data/tradeLeads.ts`、`components/demos/tradeIntel/`、`components/demos/TradeIntelDemo.vue`、`pages/SolutionDetailPage.vue`；`.trae/documents/trade-intel-solution.md` + `trade-intel-solution-plan.md`（治理文档）。原型目录 `docs/仓库/xx-ai-·-ai贸易情报员/` 一并入库（演示翻译源）。
- commit：`feat(portal): add trade-intel solution with full trade intelligence workbench demo`（沿用仓库 type(scope) 规范）。
- `git push origin main`。

### 3.3 远程部署验证（r8）
- `ssh root@101.200.198.113`：
  `cd /root/aigateway/aigateway && git pull origin main && docker compose -f infra/docker/docker-compose.yml up -d --build portal`
- curl 验证：`/solutions` 含「传统商贸」Tab 与新卡；`/solutions/trade-intel` HTTP 200；抽查页面含「AI 贸易情报员」字样。

## 四、假定与决策（沿用确认结论）
1. 行业口径 = 传统商贸（内外贸通用）；Demo 内样例（海外客户/铝合金门窗北美/海关提单）保留，仅业务定位句为商贸口径。
2. Demo = 全量工作台移植（交互照原型，客户端星标用深拷贝副本不污染源数据）。
3. 详情页沿用线性 pipeline + NodeDemoModal 分发，`nodeDemos.ts` trade 条目不加 NEXT；不引入模块网格特判。
4. 其余行业/方案/路由与组件零改动；纯前端静态 Demo，不新增依赖。
5. 浏览器验收采用截图取证；提交遵循仓库 `feat(portal): …` 规范。

## 五、验收判据
- 「新增行业」未改动列表页/轮播组件（仅数据 + 新 Demo），行业网格扩展性验收通过。
- 任一情报环节一键进入对应视图，可完整讲完「一句话输入需求 → 全网采集 → 客户/供应商/市场/竞品情报 → 实时商机 → AI 开发信」获客故事。
- `npm run build` 通过；git 提交推送成功；远程 `curl` 返回 200 且页面含新行业/方案。
