# Nova AI Gateway 官网规划 — Skill 商城上线

Version: v1.0

Status: Draft

Owner: AI Project Manager / Frontend Engineer

Last Updated: 2026-08-30

Related: [PLAN-20260830-业务升级规划-商业模式V2.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/01-product/PLAN-20260830-业务升级规划-商业模式V2.md)

---

## 1. 目标与定位

### 1.1 目标

在现有 Portal（nova-ai-gateway-portal）基础上，将官网升级为**「产品展示 + Skill 商城」双核心官网**，作为商业模式 B1 阶段的获客与变现入口：

> 用户访问官网 → 浏览 Skill 商城 → 在线试用 → 购买 → 使用，形成获客闭环。

### 1.2 本次范围

- ✅ 官网导航与信息架构升级（新增 Skill 商城入口）
- ✅ Skill 商城列表页 + 详情页 + 在线使用页
- ✅ 购买引导流程（UI 闭环，订单后端在 B1 迭代打通）
- ✅ 复用现有品牌视觉规范（Portal-Design-Spec v1.0）

### 1.3 非目标

- ❌ 不建设后端 Skill API / 数据模型（属 B1 平台迭代，单独排期）
- ❌ 不做作者市场 / 分润体系
- ❌ 不做 AI 员工 / 行业方案展示页（B2/B3 再做）

---

## 2. 官网信息架构

```
官网（React + Vite + Tailwind，新增 react-router）
│
├── /                       首页（现有 Hero/特性/模型/定价精简保留 + Skill 商城入口横幅）
├── /skills                 Skill 商城（核心新增）
│   ├── /skills?category=投标 分类筛选
│   └── /skills/:id         Skill 详情页
├── /skills/:id/use         Skill 在线使用页（接入现有 Chat 能力）
├── /pricing                定价（现有 Pricing 区块独立成页）
├── /docs                   文档中心（现有，保留）
└── /console                控制台（现有外链，保留）
```

**导航设计**（Header 改造）：

| 位置 | 入口 | 链接 |
|------|------|------|
| 主导航 | 产品能力 | `/#features` |
| 主导航 | **Skill 商城** | `/skills` |
| 主导航 | 支持模型 | `/#models` |
| 主导航 | 定价方案 | `/pricing` |
| 主导航 | 文档中心 | `/docs` |
| 右上 | 登录控制台 | 现有按钮保留 |

---

## 3. Skill 商城页面规划

### 3.1 商城列表页 `/skills`

**结构**：

```
┌────────────────────────────────────────────┐
│ Header（含导航）                             │
│                                            │
│ Hero 条：Skill 商城 · 开箱即用的 AI 能力       │
│ [搜索框]  [分类 Tab: 全部/投标/外贸/合同/内容/数据] │
│                                            │
│ ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ Skill卡│ │ Skill卡│ │ Skill卡│  (网格 1/2/3列)│
│ └────────┘ └────────┘ └────────┘           │
│                                            │
│ CTA：成为 Skill 作者 / 企业定制 AI 员工        │
│ Footer                                     │
└────────────────────────────────────────────┘
```

**Skill 卡片字段**（对齐商业模式定价三级）：

| 字段 | 说明 |
|------|------|
| 图标 / 名称 | Skill 品牌标识 |
| 分类标签 | 投标 / 外贸 / 合同 / 内容 / 数据 |
| 一句话卖点 | 解决什么场景问题 |
| 定价 | ¥99 / ¥199 / ¥499…（Basic/Pro/Business 徽章） |
| 操作 | 「在线试用」「立即购买」 |

### 3.2 详情页 `/skills/:id`

| 区块 | 内容 |
|------|------|
| 顶部 | 图标 + 名称 + 分类 + 价格 + 评分/销量（Mock） |
| 主 CTA | 「立即购买」+「免费试用」双按钮 |
| 功能亮点 | 3~4 个能力点（参考现有 FeatureGrid 卡片风格） |
| 使用场景 | 2~3 个典型场景描述 |
| 效果示例 | 输入→输出 对照示例（静态展示） |
| 定价选项 | Basic / Pro / Business 三档价格卡片 |
| FAQ | 该 Skill 常见问题（复用 FAQ 手风琴） |

### 3.3 在线使用页 `/skills/:id/use`

MVP 采用「**配置化对话试用**」：复用现有 Chat 链路（`POST /v1/chat/completions`），按 Skill 预设系统提示词 + 输入表单渲染。

| 区块 | 内容 |
|------|------|
| 左侧 | Skill 输入表单（根据 Skill 定义渲染，如投标：粘贴招标文件/填企业信息） |
| 右侧 | 对话结果区（SSE 流式输出，复用 Playground 交互） |
| 顶部 | 模型选择（默认该 Skill 推荐模型）+ 返回商城 |

> 注：在线使用先接现有 Chat 端点 + 前端配置提示词，后端 Skill 运行时（B1）上线后无缝切换。

### 3.4 购买流程（UI 闭环）

```
详情页点击「立即购买」
    ↓
登录检查（未登录 → 跳转控制台登录/注册）
    ↓
确认订单弹窗（Skill 名称 / 价格 / 有效期 / 支付方式占位）
    ↓
支付成功 → 「我的 Skill」入口 → 进入在线使用页
```

> B1 阶段：订单支付后端在平台迭代中实现；本阶段先完成前端流程 UI 与 Mock 态，支付后跳转逻辑预留。

---

## 4. 数据方案

| 数据 | 来源 | 说明 |
|------|------|------|
| Skill 列表 | `src/data/skills.ts`（Mock） | 与后端 B1 数据结构对齐（skills / skill_versions），便于后续切换 |
| 详情 / 定价 | 同上 | 每 Skill 一个对象 |
| 试用对话 | 现有 Chat API | 前端按 Skill 注入 system prompt |
| 订单 | Mock | 预留 `order` 类型，B1 接后端 |

**首批 Skill 清单（6 个）**：

| # | Skill | 定价带 | 来源 |
|:-:|-------|--------|------|
| 1 | AI投标经理 | ¥199~499 | 已有 Demo：ai投标顾问-agent |
| 2 | AI外贸销售 | ¥99~399 | 新建 |
| 3 | AI合同审查 | ¥199~499 | 新建 |
| 4 | AI内容运营 | ¥99~299 | 已有 Demo：爆款工厂 |
| 5 | AI数据分析 | ¥99~299 | 已有 Demo：科研数据分析-agent |
| 6 | AI营销文案 | ¥99~299 | 新建 |

---

## 5. 技术方案

### 5.1 路由引入

现有 Portal 为单页堆叠组件（App.tsx 直接渲染全部 Section），需引入 **react-router-dom v6**：

```
src/
├── pages/
│   ├── HomePage.tsx        # 现有内容迁移
│   ├── SkillsPage.tsx      # 商城列表
│   ├── SkillDetailPage.tsx # 详情
│   └── SkillUsePage.tsx    # 在线使用
├── components/
│   ├── skill/
│   │   ├── SkillCard.tsx
│   │   ├── SkillDetail.tsx
│   │   ├── SkillUseConsole.tsx
│   │   └── PurchaseModal.tsx
│   └── (现有组件保留)
├── data/
│   └── skills.ts           # 新增
├── types.ts                # 扩展 Skill 类型
└── router/index.tsx        # 新增路由配置
```

### 5.2 依赖变更

```json
"dependencies": {
  "react-router-dom": "^6.28.0"   // 新增
}
```

### 5.3 视觉规范

完全复用 [Portal-Design-Spec.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/01-product/Portal-Design-Spec.md)：
- 主色 `blue-600 #2563eb` → `indigo-600 #6366f1` 渐变体系
- 卡片 `rounded-2xl bg-white border border-slate-200 hover:shadow-xl`
- CTA 按钮 `from-blue-600 to-indigo-600` 渐变
- 响应式断点 md/lg 网格切换

---

## 6. 里程碑

| 里程碑 | 交付物 | 验收标准 |
|--------|--------|---------|
| M1 | 官网架构改造：路由 + Header 导航 + 首页重构 | `/skills` 可访问，导航跳转正常，现有区块不回归 |
| M2 | Skill 商城列表页 + 详情页 | 6 个 Skill 展示完整，分类筛选 / 搜索可用 |
| M3 | 在线使用页（接 Chat）+ 购买流程 UI | 试用可对话（真实 Chat），购买流程前端闭环 |
| M4 | 响应式 + 视觉走查 + 部署 | 移动端正常，设计规范符合度 ≥ 90%，预发布验证通过 |

---

## 7. 风险与开放问题

| # | 风险 | 等级 | 缓解 |
|---|------|:---:|------|
| 1 | 首页改版导致现有转化入口（Playground/控制台）回归 | 中 | 首页保留现有核心区块与交互，仅调整导航 |
| 2 | Mock 购买流程与后端 B1 计费实现衔接差异 | 中 | Mock 数据结构提前对齐后端设计（见业务规划 §5.2） |
| 3 | 在线使用页直连 Chat 无 Skill 运行时控制 | 低 | 前端按 Skill 配置注入提示词，后续切换运行时无感 |

| # | 开放问题 | 决策 |
|---|---------|------|
| 1 | 首页是「保留现有全部区块」还是「精简聚焦 + 商城引流」？ | 待 CEO 确认 |
| 2 | 首批 6 个 Skill 清单是否确认？ | 待 CEO 确认 |
| 3 | 在线试用是否接入真实 Chat（消耗 Token）还是 Mock 回复？ | 待 CEO 确认 |

---

## 8. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-08-30 | v1.0 | 初始版本：官网升级 + Skill 商城规划 | AI Project Manager |

---

# End
