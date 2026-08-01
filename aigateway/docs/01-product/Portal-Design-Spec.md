# Nova AI Gateway 门户网站 — 设计规范

Version: v1.0

Status: Active

Owner: Designer / Frontend Engineer

Last Updated: 2026-07-27

---

## 1. 品牌视觉体系

### 1.1 品牌 Logo

| 属性 | 规范 |
|------|------|
| Logo 图形 | 蓝靛渐变圆角方形底板 + 白色 CPU 芯片图标 |
| Logo 尺寸 | Header: 40×40px; Footer: 36×36px |
| Logo 底板渐变 | `from-blue-600 (#2563eb) → to-indigo-600 (#6366f1)` |
| Logo 内嵌 | 白色底板 + 蓝色图标，rounded-[10px] |

### 1.2 品牌文字

| 场景 | 文案 | 样式 |
|------|------|------|
| 全称 | Nova AI Gateway | "Nova" 黑体 / "AI Gateway" 蓝色渐变 |
| 简称 | Nova | 单字品牌名 |
| 后缀文字 | 企业级 API 网关平台 | 11px slate-500 |

---

## 2. 色彩规范

### 2.1 主色板

| Token | Tailwind | Hex | 用途 |
|-------|----------|-----|------|
| `--primary` | blue-600 | `#2563eb` | 主色、CTA 按钮、链接、激活态 |
| `--primary-dark` | blue-700 | `#1d4ed8` | 按钮 hover |
| `--indigo` | indigo-600 | `#6366f1` | 渐变副色、特性强调 |
| `--indigo-dark` | indigo-700 | `#4338ca` | 渐变深端 |

### 2.2 辅助色

| Token | Tailwind | Hex | 用途 |
|-------|----------|-----|------|
| `--accent-emerald` | emerald-500/600 | `#10b981 / #059669` | 状态正常、节省金额 |
| `--accent-teal` | teal-600 | `#14b8a6` | 成本计算强调 |
| `--accent-red` | red-500 | `#ef4444` | 爱心图标等装饰色 |

### 2.3 中性色板

| Token | Tailwind | Hex | 用途 |
|-------|----------|-----|------|
| `--text-primary` | slate-900 | `#0f172a` | 主标题、重要文字 |
| `--text-secondary` | slate-800 | `#1e293b` | 次标题、价格数字 |
| `--text-body` | slate-600 | `#475569` | 正文、描述文字 |
| `--text-muted` | slate-500 | `#64748b` | 辅助文字、统计标签 |
| `--text-light` | slate-400 | `#94a3b8` | 代码行号、次要信息 |
| `--bg-white` | white | `#ffffff` | 卡片、内容区背景 |
| `--bg-light` | slate-50 | `#f8fafc` | Section 交替背景 |
| `--bg-subtle` | slate-100 | `#f1f5f9` | 导航背景、次级容器 |
| `--border-default` | slate-200 | `#e2e8f0` | 默认边框色 |
| `--border-strong` | slate-300 | `#cbd5e1` | 强调边框 |

### 2.4 渐变规范

| 渐变名称 | 定义 | 应用场景 |
|----------|------|---------|
| `brand-gradient` | `from-blue-600 via-indigo-600 to-indigo-700` | CTA 按钮、Hero 背景装饰（参考 CTA Banner） |
| `text-gradient` | `from-blue-600 to-indigo-600 bg-clip-text text-transparent` | 重点文字高亮（标题中的强调词） |
| `text-gradient-wide` | `from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent` | 三色渐变文字强调 |
| `brand-btn-hover` | `hover:from-blue-700 hover:to-indigo-700` | 按钮 hover 加深 |
| `logo-gradient` | `from-blue-600 to-indigo-600` | Logo 底板、小徽章 |
| `feature-banner` | `from-blue-50 via-white to-indigo-50` | 特性区底部 CTA 横幅 |
| `cta-banner` | `from-blue-600 via-indigo-600 to-indigo-700` | CTA 行动号召横幅背景 |
| `savings-gradient` | `from-emerald-600 to-teal-600` | 成本节省指示 |
| `card-popular` | `from-blue-50/20 to-white` | 定价推荐卡背景 |

---

## 3. 字体规范

### 3.1 字体栈

| 位置 | 字体 |
|------|------|
| 默认 | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` |
| 代码 | font-mono（系统默认等宽字体） |

### 3.2 字号体系

| 层级 | Tailwind | 值 | 使用场景 |
|------|----------|-----|----------|
| H1 | `text-4xl sm:text-6xl lg:text-7xl` | 36px → 60px → 72px | Hero 主标题 |
| H2 | `text-3xl sm:text-5xl` | 30px → 48px | Section 大标题 |
| H3 | `text-xl` | 20px | 卡片标题 |
| H4 | `text-lg` | 18px | 子标题、CTA Banner 内标题 |
| Body | `text-base` | 16px | 正文 |
| Body Small | `text-sm` | 14px | 次要正文、描述 |
| Caption | `text-xs` | 12px | 标签、面板文字、导航链接 |
| Micro | `text-[10px]` 或 `text-[11px]` | 10-11px | 极小标签、统计角标 |

### 3.3 字重体系

| 字重 | Tailwind | 使用场景 |
|------|----------|---------|
| ExtraBold (800) | `font-extrabold` | Hero 标题、Section 标题、价格数字 |
| Bold (700) | `font-bold` | 卡片标题、按钮文字、FAQ 问题 |
| SemiBold (600) | `font-semibold` | 导航链接、Section 标签、强调文字 |
| Medium (500) | `font-medium` | 状态提示 |
| Normal (400) | `font-normal` | 正文、描述 |

### 3.4 行高规范

| 场景 | 值 | Tailwind |
|------|-----|----------|
| Hero 标题 | 1.12 | `leading-[1.12]` |
| 正文 | 1.625 | `leading-relaxed` |
| 代码 | 默认 | — |

### 3.5 字距规范

| 场景 | Tailwind | 说明 |
|------|----------|------|
| 大标题 | `tracking-tight` | -0.025em，标题紧排 |
| Section 标签 | `tracking-wider` | 0.05em，小字标签宽松 |
| 页脚标题 | `tracking-wider` | 全大写标签 |

---

## 4. 间距规范

### 4.1 Section 间距

| 场景 | Tailwind | 值 |
|------|----------|-----|
| 标准 Section 上下内边距 | `py-24` | 96px |
| Hero 上内边距 | `pt-32` | 128px（为固定 Header 留空间） |
| Hero 下内边距 | `pb-20` | 80px |
| Section 内容区最大宽度 | `max-w-7xl` | 1280px |
| Section 文字区最大宽度 | `max-w-3xl` | 768px |

### 4.2 卡片间距

| 场景 | Tailwind | 值 |
|------|----------|-----|
| 卡片标准内边距 | `p-8` | 32px |
| 模型卡片内边距 | `p-6` | 24px |
| 特性卡片网格间距 | `gap-8` | 32px |
| 模型网格间距 | `gap-6` | 24px |
| 基础设施网格间距 | `gap-8` | 32px |
| 定价卡片网格间距 | `gap-8` | 32px |
| 图标与文字间距 | `gap-2` ~ `gap-3` | 8~12px |

### 4.3 布局容器

| 场景 | Tailwind |
|------|----------|
| 顶部导航栏 | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Section 容器 | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| FAQ 容器 | `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8` |

### 4.4 Section 标题间距

| 场景 | Tailwind |
|------|----------|
| Section 标题区 | `text-center max-w-3xl mx-auto mb-16 space-y-4` |
| 徽章标签 | 自身 `gap-2 px-3 py-1 rounded-full bg-xxx border` |

---

## 5. 圆角规范

| 层级 | Tailwind | 值 | 使用场景 |
|------|----------|-----|----------|
| XL | `rounded-3xl` | 24px | 大卡片、CTA Banner、Modal |
| LG | `rounded-2xl` | 16px | 特性/模型/基础设施卡片、代码框 |
| MD | `rounded-xl` | 12px | 按钮、Logo 底板、输入框、小容器 |
| SM | `rounded-lg` | 8px | 徽章、标签、搜索框、社交图标 |
| Pill | `rounded-full` | 9999px | 导航标签、状态指示器 |
| Custom | `rounded-[10px]` | 10px | Logo 内嵌白底 |

---

## 6. 阴影规范

| 层级 | Tailwind | 使用场景 |
|------|----------|---------|
| xs | `shadow-2xs` | 极浅阴影（区域标签） |
| sm | `shadow-sm` | 默认卡片、导航滚动状态 |
| md | `shadow-md` | 卡片 hover、特性 Banner、表格卡片 |
| lg | `shadow-lg` | 主要 CTA 按钮 |
| xl | `shadow-xl` | 突出卡片、卡片弹出态、移动端菜单 |
| 2xl | `shadow-2xl` | Modal 弹窗、CTA Banner |
| inner | `shadow-inner` | 代码面板内阴影 |

### 阴影修饰

| 场景 | 定义 |
|------|------|
| 蓝色光晕按钮 | `shadow-lg shadow-blue-600/25` |
| 蓝色光晕卡片 | `shadow-xl shadow-blue-500/10` |
| CTA 大横幅 | `shadow-2xl shadow-blue-600/20` |
| 卡片暗影 | `hover:shadow-xl hover:shadow-slate-200/60` |
| 推荐卡光环 | `ring-2 ring-blue-500/20` |

---

## 7. 响应式断点

| 断点 | 宽度 | 行为 |
|------|------|------|
| 默认 | < 640px | 移动端：单列布局，汉堡菜单 |
| `sm` | ≥ 640px | 小平板：开始显示多列 |
| `md` | ≥ 768px | 平板：2 列网格，状态栏显示 |
| `lg` | ≥ 1024px | 桌面：3~4 列网格，完整导航 |
| `xl` | ≥ 1280px | 大屏：SLA 状态徽章显示 |

### 网格布局断点

| 组件 | 移动端 | md | lg |
|------|--------|-----|-----|
| 特性卡片 (6) | 1 col | 2 cols | 3 cols |
| 模型卡片 (10) | 1 col | 2 cols | 4 cols |
| Provider Logo | 2 cols | 4 cols | 8 cols |
| 基础设施 (4) | 1 col | 2 cols | — |
| 定价 (3) | 1 col | — | 3 cols |
| Footer | 1 col | 2 cols | 5 cols |
| Playground | 1 col | — | 12 cols (5+7) |

---

## 8. 组件规范

### 8.1 Header（导航栏）

| 属性 | 默认态 | 滚动态 |
|------|--------|--------|
| 背景 | `bg-white/60 backdrop-blur-sm` | `bg-white/90 backdrop-blur-md` |
| 底部边框 | `border-b border-slate-200/40` | `border-b border-slate-200/80` |
| 阴影 | 无 | `shadow-sm` |
| 纵向内边距 | `py-4` | `py-3` |
| Logo 动画 | 无 | `group-hover:scale-105` |

**导航链接**：隐藏在 `< lg`，在 `lg` 及以上显示为圆角胶囊条。

**状态徽章**：隐藏在 `< xl`，在 `xl` 及以上显示绿色脉冲动画 + "SLA 99.99%"。

**移动端**：`< lg` 显示汉堡菜单，点击后展开全宽抽屉。

### 8.2 Hero 主视觉区

| 属性 | 值 |
|------|-----|
| 背景 | `bg-white`，顶部有径向渐变光晕 `radial-gradient(ellipse_at_top, rgba(37,99,235,0.08), transparent 70%)` |
| 网格装饰 | `bg-[linear-gradient...] bg-[size:4rem_4rem]`，遮罩径向渐变 |
| 标题字号 | `text-4xl sm:text-6xl lg:text-7xl` |
| 行高 | `leading-[1.12]` |
| 代码框 | `bg-slate-900 text-slate-100 rounded-2xl`，行号 `text-slate-600` |
| 统计数字 | 4 个统计卡片：`rounded-2xl bg-white border border-slate-200` |

### 8.3 CTA 按钮（主要）

| 状态 | 样式 |
|------|------|
| Default | `bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white` |
| Hover | `hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5` |
| Active | `active:translate-y-0` |
| Shadow | `shadow-lg shadow-blue-600/25` |
| Padding | `px-8 py-3.5` |
| Radius | `rounded-xl` |

### 8.4 次要按钮

| 状态 | 样式 |
|------|------|
| Default | `bg-white border border-slate-300 text-slate-800` |
| Hover | `hover:bg-slate-50 hover:shadow` |
| Padding | `px-7 py-3.5` |
| Radius | `rounded-xl` |

### 8.5 卡片系统

**特性卡片（白色系）**：

| 属性 | 值 |
|------|-----|
| 背景 | `bg-white` |
| 边框 | `border border-slate-200` |
| 圆角 | `rounded-2xl` |
| 内边距 | `p-8` |
| Hover | `hover:border-blue-300 hover:shadow-xl hover:-translate-y-1` |
| 选中态 | `border-blue-600 shadow-xl ring-2 ring-blue-500/20` |

**基础设施卡片（深色强调）**：

| 属性 | 值 |
|------|-----|
| 背景 | `bg-white` |
| 边框 | `border border-slate-200/90` |
| 圆角 | `rounded-2xl` |
| 内边距 | `p-8` |
| Hover | `hover:border-indigo-300 hover:shadow-xl` |
| 统计数字渐变 | `bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent` |

**定价卡片**：

| 属性 | 普通 | 推荐（Popular） |
|------|------|-----------------|
| 边框 | `border-slate-200/90` | `border-blue-500 shadow-xl ring-2 ring-blue-500/20` |
| 偏移 | 无 | `lg:-translate-y-2` |
| 推荐徽章 | — | 顶部居中 `rounded-full from-blue-600 to-indigo-600 text-white` |

**模型卡片**：

| 属性 | 值 |
|------|-----|
| 圆角 | `rounded-2xl` |
| 内边距 | `p-6` |
| 流行款 | `border-blue-400 ring-1 ring-blue-500/20` |

### 8.6 FAQ 手风琴

| 属性 | 值 |
|------|-----|
| 容器圆角 | `rounded-2xl` |
| 容器边框 | Default: `border-slate-200`; 展开: `border-blue-400 shadow-md ring-1 ring-blue-500/10` |
| 问题文字 | `text-base font-bold text-slate-900` |
| 回答文字 | `text-sm text-slate-600 leading-relaxed` |
| 答案左边界 | `border-l-2 border-blue-600` |
| 展开图标 | `w-8 h-8 rounded-full bg-slate-100`，展开时旋转 180° 并变为蓝色 |

### 8.7 徽章 / 标签

| 类型 | 样式 |
|------|------|
| Section 标签 | `rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider` |
| 状态标签（绿色） | `rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700` |
| 版本号 | `rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px]` |
| 模型特性标签 | `rounded bg-slate-50 text-slate-600 border border-slate-200 text-[10px]` |
| 推荐标签（Popular） | `rounded-full from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md` |

### 8.8 Footer

| 属性 | 值 |
|------|-----|
| 背景 | `bg-white` |
| 上边框 | `border-t border-slate-200` |
| 文字色 | `text-slate-600` |
| 上内边距 | `pt-16` |
| 下内边距 | `pb-12` |
| 网格 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10` |
| 链接色 | Default: `text-slate-600`, Hover: `hover:text-blue-600` |
| 图标社交按钮 | `w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200` |

---

## 9. 交互规范

### 9.1 过渡动画

| 场景 | 定义 | 时长 |
|------|------|------|
| 通用过渡 | `transition-all duration-300` | 300ms |
| 快速过渡 | `transition-all duration-200` | 200ms |
| Header 滚动 | `transition-all duration-300` | 300ms |
| CTA 按钮 hover | `hover:-translate-y-0.5` | 300ms |
| CTA 按钮 active | `active:translate-y-0` | — |
| Logo hover 旋转 | `group-hover:rotate-12 duration-300` | 300ms |
| 属性卡片点击 | `hover:-translate-y-1 duration-300` | 300ms |
| 展开图标旋转 | `transition-transform duration-200` | 200ms |
| 弹窗淡入 | `animate-in fade-in duration-200` | 200ms |
| 状态脉冲 | `animate-pulse` | 持续 |
| 状态 ping | `animate-ping` | 持续 |

### 9.2 滚动行为

- `html { scroll-behavior: smooth }` — 全局平滑滚动
- 导航锚点点击 → 平滑滚动到对应 id 区块
- Header 固定在顶部（`fixed top-0 left-0 right-0 z-50`）
- 滚动超过 20px 时 Header 样式切换

### 9.3 按钮交互

| 行为 | 效果 |
|------|------|
| 主要 CTA hover | 背景加深 + 上浮 + 阴影加重 |
| 主要 CTA active | 压回原位 |
| 次要按钮 hover | 背景浅灰 + 阴影 |
| 链接 hover | 颜色变蓝 |
| 社交图标 hover | 背景加深 |
| Schema 重置 (active) | `active:scale-95` |

### 9.4 FAQ 交互

- 点击问题行展开/收起答案
- 同一时间可展开多个 FAQ
- 展开时图标旋转 180°
- 默认展开第一个 FAQ（`faq-1`）

---

## 10. 装饰性元素

### 10.1 背景装饰光晕

每个主要 Section 都有背景装饰光晕（`absolute` + `blur-[120~150px]` + `pointer-events-none`）：

```
// 蓝色光晕
absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px]

// 靛蓝光晕
absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px]
```

### 10.2 网格装饰（Hero）

```
bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),
     linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)]
bg-[size:4rem_4rem]
[mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]
```

### 10.3 状态指示灯

```
// 脉冲绿点
<span className="relative flex h-2 w-2">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
</span>
```

---

## 11. Icons

使用 **lucide-react** 图标库。主要使用的图标：

| 图标名 | 使用位置 |
|--------|---------|
| `Cpu` | Logo、品牌标识 |
| `Terminal` | CTA 按钮、控制台入口 |
| `Menu` / `X` | 移动端汉堡菜单 |
| `ChevronRight` | 按钮箭头指示 |
| `ArrowRight` | CTA 按钮 |
| `ArrowUpRight` | 卡片外部链接指示 |
| `Layers` | 统一 API 特性 |
| `ShieldCheck` | 安全性、PDF 图标 |
| `Zap` | 特性强调、基础设施 |
| `Lock` | 安全合规 |
| `Globe` | 全球分发 |
| `Gauge` | 低延迟指标 |
| `Database` | 缓存引擎 |
| `Server` | 自动扩容 |
| `Check` / `CheckCircle2` | 功能列表、复制成功 |
| `Play` | Playground 入口 |
| `HelpCircle` | FAQ 区域 |
| `MessageSquare` | FAQ 底部联系 |
| `Search` | 模型搜索 |
| `Sparkles` | 特性强调装饰 |
| `Activity` | 网关状态 |
| `Copy` | 代码复制 |
| `RefreshCw` | Playground 加载 |
| `Calculator` | 成本计算器 |
| `TrendingDown` | 成本节省 |
| `DollarSign` | 金额 |
| `Github` / `Twitter` / `Mail` | Footer 社交 |
| `Heart` | Footer "Crafted with" |

---

## 12. 代码风格指南

### 12.1 色彩命名映射

| 语义名 | Tailwind 类 | 说明 |
|--------|-------------|------|
| `color-primary` | `blue-600` | 主色 |
| `color-primary-hover` | `blue-700` | 主色 Hover |
| `color-indigo` | `indigo-600` | 渐变副色 |
| `color-accent` | `emerald-500` | 强调色 |
| `color-bg-section` | `slate-50/80` | Section 交替背景 |
| `color-bg-card` | `white` | 卡片背景 |
| `color-text-title` | `slate-900` | 标题文字 |
| `color-text-body` | `slate-600` | 正文文字 |
| `color-border` | `slate-200` | 边框色 |

### 12.2 常用组合

```
// Section 标准骨架
<section id="{id}" className="py-24 bg-slate-50/80 border-b border-slate-200/80">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border...">
        {icon} 标签文字
      </div>
      <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
        标题 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">强调</span>
      </h2>
      <p className="text-slate-600 text-base sm:text-lg">描述</p>
    </div>
    // 网格内容
  </div>
</section>

// 卡片标准
<div className="p-8 rounded-2xl bg-white border border-slate-200 transition-all duration-300
            hover:border-blue-300 hover:shadow-xl hover:-translate-y-1
            flex flex-col justify-between">

// CTA 主要按钮
<button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600
                  hover:from-blue-700 hover:to-indigo-700 text-white font-semibold
                  shadow-lg shadow-blue-600/25
                  transition-all transform hover:-translate-y-0.5 active:translate-y-0
                  flex items-center justify-center gap-2">

// Section 标签徽章
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50
              border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">

// 文字渐变强调
<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
```

---

## 13. 文件结构规范

```
src/
├── components/        # UI 组件
│   ├── Header.tsx       # 导航栏
│   ├── Hero.tsx         # 主视觉区
│   ├── FeatureGrid.tsx  # 特性卡片
│   ├── ModelWall.tsx    # 模型展示
│   ├── Infrastructure.tsx  # 基础设施
│   ├── CostCalculator.tsx  # 成本计算器
│   ├── Pricing.tsx      # 定价套餐
│   ├── CtaBanner.tsx    # CTA 横幅
│   ├── FaqSection.tsx   # FAQ
│   ├── Footer.tsx       # 底部
│   ├── ConsoleModal.tsx # 控制台弹窗
│   └── PlaygroundModal.tsx  # API 沙盒弹窗
├── data/
│   └── mockData.ts      # 所有静态数据
├── types.ts             # TypeScript 类型定义
├── App.tsx              # 根组件
├── main.tsx             # 入口
└── index.css            # 全局样式
```

---

## 14. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-27 | v1.0 | 初始版本 | Designer / Frontend Engineer |

---

# End
