# 官网新增「解决方案」区块与页面 — 规划方案

Version: v2.0

Status: Draft（待审阅）

Owner: Frontend Engineer

Last Updated: 2026-08-27

---

## 1. 背景与目标

官网当前是「产品能力导向」（网关能力、模型、定价），缺少「面向具体客户场景」的表达。
第一期上线 **高校科研 Agent 解决方案**（素材：`docs/01-product/面向高校的agent解决方案.md`），
向高校课题组传递：**用得起 · 管得好 · 跑得快**。

目标：

- 首页新增「解决方案」区块，承载场景化解决方案入口
- 模型广场新增解决方案入口，打通「模型 → 场景」转化
- 建立可扩展的解决方案架构（列表页 + 详情页），后续可加企业研发、量化金融等行业方案

---

## 2. 总体架构

```
导航: 首页 | 模型广场 | 解决方案 | 文档中心   ← 新增「解决方案」

首页 /
  └─ Hero → Features → 【新增】解决方案 Section → Pricing → CTA → FAQ

模型广场 /models
  └─ 【新增】解决方案入口横幅（页面顶部）

解决方案中心 /solutions              ← 新增列表页
  └─ Hero + 解决方案卡片列表（第一期 1 张，可扩展）

解决方案详情 /solutions/:slug        ← 新增详情页（第一期: /solutions/university-agent）
  ├─ Hero（让科研团队 用得起·管得好·跑得快）
  ├─ 一句话价值主张
  ├─ 核心能力（4 项）
  ├─ 应用场景（6 大科研场景）
  ├─ CTA Banner
```

---

## 3. 路由设计

```ts
// src/router/index.ts
{
  path: '/solutions',
  name: 'solutions',
  component: () => import('@/pages/SolutionsPage.vue'),
},
{
  path: '/solutions/:slug',
  name: 'solution-detail',
  component: () => import('@/pages/SolutionDetailPage.vue'),
},
```

slug 由数据文件驱动，后续新增方案只需加数据，无需改路由。

---

## 4. 页面设计

### 4.1 首页「解决方案」Section（新增 `SolutionsSection.vue`）

- **位置**：FeatureSection 之后、PricingSection 之前
- **风格**：沿用既有 Section 骨架（徽章 + 标题 + 描述 + 卡片网格），遵循 Portal-Design-Spec
- **内容**：
  - 徽章：`行业解决方案 · Solutions`
  - 标题：不止是一个 API 网关，更是**场景化解决方案**
  - 描述：针对高校科研、企业研发等场景，将模型能力封装成开箱即用的工作台
  - 卡片布局（第一期）：
    - **主卡片（1 张）**：高校科研 Agent 解决方案
      - 标签：面向高校 · 第一期上线
      - 标题 + 一句话：让科研团队 **用得起 · 管得好 · 跑得快**
      - 关键能力标签：文献调研 / 代码复现 / 数据分析 / 经费管控
      - CTA：`了解详情 →` 跳转 `/solutions/university-agent`
    - **占位卡（2 张）**：更多解决方案「敬请期待」（灰化，锁定状态），为后续扩展留位
- **视觉**：主卡片用品牌蓝→靛蓝渐变描边/光晕，与特性卡片区分但保持统一

线框图：

```
┌────────────────────────────────────────────────────┐
│  [徽章] 行业解决方案 · Solutions                      │
│  不止是一个 API 网关，更是场景化解决方案              │
│  针对高校科研、企业研发等场景…                        │
│                                                    │
│  ┌────────────────────┐ ┌───────────┐ ┌─────────┐ │
│  │ 🎓 高校科研 Agent    │ │ 🏭 企业研发 │ │ 🔬 更多  │ │
│  │    解决方案         │ │  敬请期待   │ │  敬请期待 │ │
│  │ 用得起·管得好·跑得快 │ │  (灰化)    │ │  (灰化)  │ │
│  │ [了解详情 →]        │ │           │ │         │ │
│  └────────────────────┘ └───────────┘ └─────────┘ │
└────────────────────────────────────────────────────┘
```

### 4.2 模型广场入口（新增 `SolutionEntryBanner.vue`）

- **位置**：ModelsSection 顶部（价格说明条之前）
- **形态**：一条渐变横幅（`from-blue-600 via-indigo-600 to-indigo-700`），白字
  - 文案：`做科研的你，还在自己拼 API、写工具？`
  - 副文案：`高校科研 Agent 解决方案 —— 文献调研 / 代码复现 / 数据分析 / 经费管控 开箱即用`
  - CTA：`查看解决方案 →` 跳转 `/solutions/university-agent`

### 4.3 解决方案中心 `/solutions`（新增 `SolutionsPage.vue`）

```
┌────────────────────────────────────────────┐
│ Header（高亮「解决方案」）                    │
├────────────────────────────────────────────┤
│  Hero: 按场景，为你的团队准备好了一切          │
│  从模型能力到完整工作流，一次接入             │
│                                            │
│  解决方案卡片列表（数据驱动，支持多张）         │
│  ┌────────────────────────────┐            │
│  │ 🎓 高校科研 Agent 解决方案    │            │
│  │ 让科研团队 用得起·管得好·跑得快│            │
│  │ 4 能力标签 + 6 场景预览      │            │
│  │ [查看详情 →]                 │            │
│  └────────────────────────────┘            │
│  后续方案在此追加（卡片渲染由数据驱动）        │
│                                            │
│ Footer                                     │
└────────────────────────────────────────────┘
```

### 4.4 详情页 `/solutions/:slug`（新增 `SolutionDetailPage.vue`）

以高校科研方案为例，内容全部来自素材文档：

#### 区块 1｜Hero
- 徽章：面向高校 · 第一期上线
- 主标题：**让科研团队 用得起 · 管得好 · 跑得快**
- 副标题：面向高校课题组的大模型科研基础设施
- 描述：从文献综述、知识检索，到实验代码、数据分析、论文撰写，通过统一 API 网关接入主流大模型与科研 Agent
- 能力横条：多模型统一接入 · 团队统一管理 · Agent 自动化协作 · 经费全程可控
- CTA：`申请试用 / 联系我们`

#### 区块 2｜一句话价值主张
> 让大模型成为课题组的基础设施，而不是每个人各自购买、各自摸索的一堆 AI 工具。

#### 区块 3｜核心能力（4 卡片，沿用特性卡片样式）
| 能力 | 要点 |
|------|------|
| 统一模型入口 | GPT / Claude / Gemini / 国内主流模型统一接入，按任务智能选择 |
| 团队协作管理 | 成员、组织、API Key、权限、额度统一管理，告别各自为战 |
| 科研 Agent 自动化 | 文献调研、代码生成、数据分析、论文辅助编排成可复用工作流 |
| 经费与用量管控 | Token / 调用量 / 成本实时可见，支持额度、预算与异常控制 |

#### 区块 4｜应用场景（6 大科研场景，手风琴/卡片切换）
| # | 场景 | 一句话 |
|---|------|--------|
| 1 | 材料学院 · 文献调研 | 从 200 篇论文到实验方案（检索→筛选→阅读→分类→总结） |
| 2 | 计算机学院 · 代码复现 | 论文 PDF + 数据 → 自动生成 Python 项目 → 复现实验 |
| 3 | 生物/医学 · 数据分析 | 几十 GB CSV/Excel → 自动清洗统计 → 异常检测 → 分析报告 |
| 4 | 课题组 · 经费管控 | 导师后台看清每个人、每个模型花了多少钱，超支自动降级 |
| 5 | 导师 · 多 Agent 编排 | 一个问题 → Literature/Analysis/Coding/Reviewer Agent 接力 → 研究报告 |
| 6 | 论文 Agent | 实验数据+图表+代码 → Results 草稿 → 按 IEEE 审稿标准自审 |

每个场景展开后展示：痛点 → 传统流程 vs Nova 流程 → 关键结果（表格/数字）→ 典型话术。
数据全部静态化到 `src/data/solutions.ts`。

#### 区块 5｜CTA Banner
- 复用 `CtaBanner` 视觉：`立即为课题组部署 Nova AI Gateway`
- 按钮：`联系我们获取专属方案`

---

## 5. 数据结构（`src/data/solutions.ts`）

```ts
export interface SolutionCapability {
  icon: string        // lucide 图标名
  title: string
  description: string
}

export interface SolutionCase {
  id: string
  scene: string       // 适用学院/角色
  title: string       // 场景标题
  summary: string     // 一句话
  pain: string[]      // 痛点
  flow: string[]      // Nova 自动化流程步骤
  result: { label: string; value: string }[]  // 关键结果
  quote?: string      // 典型话术
}

export interface Solution {
  slug: string
  name: string
  tag: string                 // 标签，如「面向高校」
  tagline: string             // 一句话定位
  description: string
  capabilities: SolutionCapability[]
  cases: SolutionCase[]
  status: 'online' | 'coming-soon'
}
```

---

## 6. 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/data/solutions.ts` | 解决方案数据（第一期：高校科研） |
| 新增 | `src/pages/SolutionsPage.vue` | 解决方案中心列表页 |
| 新增 | `src/pages/SolutionDetailPage.vue` | 解决方案详情页 |
| 新增 | `src/components/SolutionsSection.vue` | 首页解决方案区 |
| 新增 | `src/components/SolutionEntryBanner.vue` | 模型广场入口横幅 |
| 修改 | `src/router/index.ts` | 新增 `/solutions`、`/solutions/:slug` 路由 |
| 修改 | `src/components/AppHeader.vue` | 导航新增「解决方案」（桌面 + 移动抽屉） |
| 修改 | `src/pages/HomePage.vue` | 引入 SolutionsSection |
| 修改 | `src/pages/ModelsPage.vue` | 引入 SolutionEntryBanner |
| 修改 | `src/components/FooterSection.vue` | Footer 新增「解决方案」链接 |
| 修改 | `src/types/index.ts` | 新增 Solution 相关类型 |

---

## 7. MVP 范围 vs 后续迭代

**MVP（第一期）**
- 高校科研解决方案详情页完整上线（6 场景、4 能力，静态数据）
- 首页解决方案 Section + 模型广场入口横幅
- 解决方案中心 `/solutions`（轻量版，1 张卡 + 占位）

**后续迭代**
- 更多行业解决方案（企业研发、量化金融、教育信息化…），仅追加数据
- 案例图片 / 场景化配图（对接 text_to_image）
- 解决方案数据接入后端 CMS

---

## 8. 决策记录（已确认 2026-08-27）

| # | 问题 | 决策 |
|---|------|------|
| 1 | 页面架构 | ✅ 新增顶部导航「解决方案」+ `/solutions` 列表页 + `/solutions/:slug` 详情页 |
| 2 | 首页 Section 形态 | ✅ 1 大卡 + 2 占位卡（灰化「敬请期待」） |
| 3 | 详情页场景呈现 | ✅ 6 个场景全部展示，手风琴展开痛点/流程/结果详情 |
| 4 | 视觉风格 | ✅ 沿用品牌蓝（blue-600 → indigo-600），与全站统一 |

---

## 9. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-08-27 | v1.0 | 初始方案 | Frontend Engineer |
| 2026-08-27 | v1.1 | 确认 4 项关键决策 | Product / Frontend |
| 2026-08-27 | v2.0 | 新增科研链路节点 Demo 阶段方案（起点节点为首个 Demo） | Frontend Engineer |
| 2026-08-27 | v2.1 | 完成 Research Agent 节点 Demo（自动编排 · 判断方向与研究空白） | Frontend Engineer |
| 2026-08-27 | v2.2 | 补全剩余 8 个节点 Demo，科研链路 10 环节全部可用（新增公共演示壳 NodeDemoShell） | Frontend Engineer |

---

## 10. 科研链路节点 Demo 阶段方案（v2.0）

### 10.1 背景

详情页将「6 个孤立场景」重构为「一条完整科研链路」（起点 → Research Agent → 分支 → Coding → 实验复现 → Data → 实验结果 → Paper & Reviewer → 终点论文）后，
需为**每个链路环节制作可点击演示 Demo**，从「起点：一个科研问题」节点开始。

参考 demo：`docs/仓库/外部demo/ai-research-agent`（React + Gemini 完整科研工作流产品演示，仅作交互与内容参考）。

### 10.2 已确认决策（2026-08-27）

| # | 问题 | 决策 |
|---|------|------|
| 1 | Demo 呈现形式 | ✅ 弹窗内嵌（详情页点击节点 → 全屏遮罩弹窗演示，纯 Vue 实现） |
| 2 | 拆解模拟方式 | ✅ 静态脚本动画为主，可选 DeepSeek 实时生成（无 key 时自动回退静态） |
| 3 | 预置科研问题 | ✅ 4 个全做（EV 充电 / AI 医疗幻觉 / 小分子 GNN / 固态电池，与参考 demo 一致） |
| 4 | 演示按钮入口 | ✅ 全部链路节点放置演示按钮，未开发的显示「即将上线」 |

### 10.3 架构（可扩展，支撑后续所有节点）

```
portal/src/
├── components/demos/
│   ├── NodeDemoModal.vue        # 通用全屏弹窗壳（标题/图标/关闭/内容插槽）
│   └── QuestionOriginDemo.vue   # 起点节点 demo（本次开发，3 阶段交互）
├── data/
│   └── nodeDemos.ts             # 节点→demo 注册表 + 4 主题拆解静态数据 + 通用模板
```

- 每个节点一个 `XxxDemo.vue`，在 `nodeDemos.ts` 的 `NODE_DEMOS` 注册 `ready: true` 后，
  链路卡片自动出现可点击的「演示此环节」按钮，**后续节点只加文件不改页面**。
- 全部静态数据驱动，零后端、零 API key 也能演示；可选 DeepSeek（见 10.6）。

### 10.4 交互流程（起点节点，弹窗内 3 阶段）

| 阶段 | 交互内容 |
|------|---------|
| 1. 提出问题 | 4 个预置科研问题卡片（点击选中）或「自由输入」；底部「开始研究」按钮 |
| 2. 问题拆解 | 4 步拆解流水线依次运行（问题理解 → 科学问题降维 → 变量抽取 → 可行性初判），每步状态灯 + 打字机输出 + 右侧/底部 Agent 通讯日志滚动 |
| 3. 拆解结果 | 汇总卡片：主问题、子问题清单、变量表、可行性评分条；CTA「问题已就绪 → 交给 Research Agent」→ 关闭弹窗并自动展开下一节点（Research Agent）+ toast 提示 |

### 10.5 链路联动

- `NEXT_NODE_BY_ID['research-question'] = 'research-agent'`：起点 demo 完成后自动展开下一节点，展示链路连续性。
- 弹窗「换一个问题重试」回到阶段 1 重新演示。

### 10.6 可选 DeepSeek 实时生成（静态为主）

- 配置方式：`portal/.env.local` 中设置 `DEEPSEEK_API_KEY=sk-xxx`。
- 实现：`vite.config.ts` 新增开发代理插件（仅 dev 生效）：
  - `GET /api/demo/live` → `{ enabled: 是否有 key }`
  - `POST /api/demo/analyze { topic }` → 转发 DeepSeek `deepseek-chat`，要求输出 `TopicBreakdown` JSON。
- 客户端：预置主题始终用静态数据（内容稳定一致）；自由输入先探测 `live`，未配置则立即用通用模板，配置了则尝试实时生成，超时/失败自动回退通用模板。

### 10.7 文件变更清单（v2.0）

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/data/nodeDemos.ts` | 节点 Demo 注册表 + 4 主题拆解数据 + 通用模板 |
| 新增 | `src/components/demos/NodeDemoModal.vue` | 通用演示弹窗壳 |
| 新增 | `src/components/demos/QuestionOriginDemo.vue` | 起点节点 demo（3 阶段） |
| 修改 | `src/pages/SolutionDetailPage.vue` | 各节点卡片加「演示」按钮 + 弹窗/联动/ toast |
| 修改 | `vite.config.ts` | 可选 DeepSeek 开发代理（默认静态） |

### 10.8 后续迭代（非本次）

- 依次开发 research-agent / literature-agent / research-insight / coding-agent / experiment-reproduction / data-agent / experiment-result / paper-reviewer / final-paper 节点 demo。
- 每个节点一个 `XxxDemo.vue` 注册进 `NODE_DEMOS` 即可。

---

# End
