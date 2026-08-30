# Nova AI Gateway 官网规划 — Skill · 专家 · 专家团 合并页

Version: v1.0

Status: Draft

Owner: AI Project Manager / Frontend Engineer

Last Updated: 2026-08-30

Related: [PLAN-20260830-官网规划-Skill商城.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/01-product/PLAN-20260830-官网规划-Skill商城.md) / [PLAN-20260830-官网规划-专家团.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/01-product/PLAN-20260830-官网规划-专家团.md)

---

## 1. 目标

将官网的「Skill 商城」与「专家团」两大业务入口**合并为一个统一页面**，导航名升级为「Skill · 专家 · 专家团」，形成「单能力（专家）→ 团队协作（专家团）」的一条升级动线。

> 一句话定位：**一个入口，两种形态 —— Skill 即专家（单点能力），专家团是组合（多专家协作）。**

## 2. 已确认决策

| # | 决策点 | 结论 |
|:-:|--------|------|
| 1 | 「专家」含义 | **Skill 即专家**：现有 6 个 Skill（如 AI 投标经理）本身就是一位专家，无需新增独立专家概念 |
| 2 | 页面组织 | **Tab 切换**：/skills 顶部加 Tab「全部 / 技能·专家 / 专家团」 |
| 3 | /teams 路由 | **详情页保留**：/teams 列表页重定向到 /skills；/teams/:slug 与 /teams/:slug/use 保留（收藏链接不断） |

---

## 3. 改动清单

### 3.1 导航（AppHeader.vue）

| 项目 | 现状 | 改为 |
|------|------|------|
| 导航项 | Skill 商城 `/skills` | **Skill · 专家 · 专家团** `/skills` |
| 导航项 | 专家团 `/teams`（独立项） | **移除**（已合并进 /skills） |
| 激活态 | `route.path.startsWith(link.to)` | 增加 `/teams` 前缀联动：访问 /teams/:slug 详情时，「Skill · 专家 · 专家团」保持高亮 |

导航最终顺序：首页 → 模型广场 → **Skill · 专家 · 专家团** → 解决方案 → 文档中心

### 3.2 /skills 页面改造（SkillsPage.vue）

**Tab 结构**（两级）：

```
Header（标题：Skill · 专家 · 专家团）
├── 类型 Tab：全部 | 技能·专家 | 专家团
└── 场景 Tab（随类型动态切换）：
    ├── 类型=全部 / 技能·专家 → 投标 | 外贸 | 合同 | 内容 | 数据 | 营销（skill 分类）
    └── 类型=专家团           → 投标 | 外贸 | 内容增长（team 场景）
```

**卡片渲染逻辑**：

| 类型 Tab | 展示内容 | 场景过滤 |
|----------|---------|---------|
| 全部 | 6 个 Skill 卡片 + 3 个专家团卡片（混合网格） | skill 分类 与 team 场景并集匹配 |
| 技能·专家 | 6 个 Skill 卡片 | skill.category 匹配 |
| 专家团 | 3 个专家团卡片（复用 TeamsPage 卡片样式） | team.industry 匹配 |

> 团队卡片视觉区分：团队卡带成员头像组 + 「并行/串行/混合」徽章（沿用现有 TeamsPage 卡片样式），与技能卡并排展示时信息层次清晰。

**Query 支持**：页面读取 `?tab=team`（或 `?tab=all`）自动定位到对应 Tab，供首页横幅、旧 /teams 重定向跳转使用。

### 3.3 路由（router/index.ts）

```ts
{
  path: '/teams',
  name: 'teams',
  redirect: { path: '/skills', query: { tab: 'team' } },  // 原列表页重定向
},
// /teams/:slug、/teams/:slug/use 保持不变（详情页 / 使用页）
```

### 3.4 入口更新

| 文件 | 改动 |
|------|------|
| SkillEntryBanner.vue | 文案更新为「Skill · 专家 · 专家团 · 9 个能力上线」，跳转 `/skills` |
| TeamEntryBanner.vue | 跳转 `/skills?tab=team`（不再跳 /teams） |
| HomePage.vue | 不变（两个横幅并排保留） |

### 3.5 清理

- TeamsPage.vue：保留文件（供 /teams 重定向前的快照？）→ **不删除**，但路由不再使用；卡片结构提取为可复用片段供 SkillsPage 引用（避免重复代码）。
  - 实际方案：新增 `src/components/team/TeamCard.vue`（从 TeamsPage 卡片抽取），SkillsPage 与 TeamsPage 共用。
- TeamDetailPage.vue / TeamUsePage.vue：不变，仅把「返回专家团」面包屑链接从 `/teams` 改为 `/skills?tab=team`。

---

## 4. 页面结构示意（/skills）

```
┌───────────────────────────────────────────────┐
│ Header：Skill · 专家 · 专家团                    │
│ [搜索框]                                       │
│ 类型 Tab：[全部] [技能·专家] [专家团]              │
│ 场景 Tab：[投标] [外贸] [合同] [内容] [数据] [营销]  │
│                                               │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│ │技能卡片  │ │技能卡片  │ │团队卡片  │ │技能卡片  │ 4列  │
│ └────────┘ └────────┘ └────────┘ └────────┘  │
│                                               │
│ CTA：定制你的 AI 员工                            │
│ Footer                                        │
└───────────────────────────────────────────────┘
```

---

## 5. 数据与类型

- 无需新增数据：Skill（skills.ts）与专家团（expertTeams.ts）均已存在。
- 场景过滤统一：定义 `tab` 状态（'all' | 'skill' | 'team'）+ 场景状态，`filteredCards` 按组合条件计算。
- 团队卡片图标、成员头像组复用现有 `teamIconMap` / `skillIconMap`。

---

## 6. 里程碑

| 里程碑 | 交付物 | 验收标准 |
|--------|--------|---------|
| M1 | AppHeader 导航改名 + /teams 重定向 + 激活态联动 | 导航显示「Skill · 专家 · 专家团」，旧 /teams 跳转 /skills?tab=team |
| M2 | SkillsPage 类型 Tab + 场景 Tab 动态切换 + 团队卡片抽取复用 | 三个 Tab 展示正确，场景过滤正确，卡片样式统一 |
| M3 | 横幅文案/跳转更新 + 面包屑修正 | 首页横幅跳转正确，详情页返回链接正确 |
| M4 | 构建 + 视觉走查 | vue-tsc/vite build 通过，Tab 交互无回归，console 无报错 |

---

## 7. 风险与开放问题

| # | 风险 | 等级 | 缓解 |
|---|------|:---:|------|
| 1 | 全部 Tab 混排技能卡与团队卡，视觉层次易乱 | 中 | 团队卡带成员头像组与协作徽章，与技能卡有明确视觉差异 |
| 2 | 两套场景 Tab 动态切换逻辑复杂度上升 | 中 | 场景 Tab 随类型联动渲染，状态单一来源（computed），代码集中注释 |
| 3 | 旧链接 /teams 收藏失效 | 低 | 重定向到 /skills?tab=team，无感跳转 |

| # | 开放问题 | 决策 |
|---|---------|------|
| 1 | 「全部」Tab 中团队卡与技能卡是否混排？ | 建议混排（同一网格，团队卡视觉区分） |
| 2 | 首页横幅是否保留两个（Skill + 专家团）？ | 建议保留，TeamEntryBanner 指向 /skills?tab=team |

---

## 8. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-08-30 | v1.0 | 初始版本：Skill·专家·专家团合并页规划 | AI Project Manager |

---

# End
