# Nova AI Gateway Admin Console — 设计规范

| 版本 | 日期 | 作者 | 状态 |
|------|------|------|------|
| v1.0 | 2026-07-26 | UI Designer | ✅ 定稿 |

---

## 1. 设计语言

| 维度 | 规范 |
|------|------|
| 风格 | 白色系 B2B SaaS，极简干净，参考 Vercel/Linear 设计语言 |
| 底色 | `#f8f9fa`（页面背景）、`#ffffff`（卡片/弹窗/侧边栏） |
| 边框 | `#e2e8f0`（全平台统一边框色） |
| 主色 | `#2563eb`（蓝色 — 按钮、链接、强调色、品牌色） |
| 正文色 | `#1e293b`（标题/正文）、`#64748b`（次要文字/表头） |
| 成功色 | `#059669` / `bg-emerald-50 text-emerald-700` |
| 错误色 | `#e11d48` / `bg-rose-50 text-rose-700` |
| 选中态 | `bg-blue-50` + `text-[#2563eb]` + 左侧蓝色 4px 边框 |
| 圆角 | 卡片 8px `rounded-lg`，按钮 6px `rounded-md`，标签 4px `rounded` |
| 阴影 | `shadow-xs`（卡片/弹窗/按钮的轻微阴影） |
| 字体 | 系统字体栈 `font-sans antialiased`，等宽用 `font-mono` |
| 字号 | 标题 18-24px，正文 14px，次要 12-13px，标签 11px |

---

## 2. 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar(240px)           │  Header(64px)                │
│  bg-white                 │  bg-white, border-b #e2e8f0  │
│  border-r #e2e8f0         ├──────────────────────────────┤
│                           │  Content(页面内容区)           │
│  ┌─ Brand ───────────┐   │  bg-#f8f9fa, padding: 24px   │
│  │ ⚡ Nova AI Gateway │   │  space-y: 24px               │
│  │   Management Portal│   │                              │
│  └───────────────────┘   │  ┌─ 操作栏 ────────────────┐  │
│                           │  │ 搜索框 | [新建按钮]     │  │
│  总览                     │  └────────────────────────┘  │
│    · 仪表盘               │  ┌─ 数据表格 ──────────────┐  │
│  管理                     │  │ bg-white + border        │  │
│    · API Key              │  │ p-5 + rounded-lg         │  │
│    · Provider 管理        │  │ 交替行 + hover 蓝色      │  │
│    · 模型管理             │  └────────────────────────┘  │
│  计费                     │                              │
│    · 定价管理             │  ┌─ 弹窗 ──────────────────┐  │
│    · 账单报表             │  │ bg-white, backdrop-blur  │  │
│    · 请求日志             │  │ max-w-md/lg/xl           │  │
│  权限管理                 │  └────────────────────────┘  │
│    · 学生管理             │                              │
│    · 角色管理             │                              │
│                           │                              │
│  ┌─ User ──────────────┐ │                              │
│  │ AD 系统管理员       │ │                              │
│  │    admin@nova.ai  ⏻│ │                              │
│  └─────────────────────┘ │                              │
└─────────────────────────────────────────────────────────┘
```

---

## 3. 侧边栏规范 (Sidebar)

> 文件: [Sidebar.tsx](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/07-PRD/nova-ai-gateway-admin-console/src/components/Sidebar.tsx)

| 属性 | 值 |
|------|-----|
| 宽度 | `w-[240px] shrink-0` |
| 背景 | `bg-white` |
| 右边框 | `border-r border-[#e2e8f0]` |
| 布局 | `flex flex-col h-full justify-between` |
| 用户选择 | `select-none` |

### 3.1 品牌区

| 属性 | 值 |
|------|-----|
| 高度 | `h-16` |
| 下边框 | `border-b border-[#e2e8f0]` |
| 内边距 | `px-5` |
| Logo 图标 | 蓝色方块 36px `bg-[#2563eb] rounded-lg`，内嵌白色闪电 `Zap` 图标 20px |
| 品牌名 | `font-bold text-[#1e293b] text-base` — **Nova AI Gateway** |
| 副标题 | `text-[11px] text-[#64748b] uppercase tracking-wide` — **Management Portal** |

### 3.2 导航分组

| 分组名 | 菜单项 | 图标 |
|--------|--------|------|
| **总览** | 仪表盘 | `LayoutDashboard` |
| **管理** | API Key、Provider 管理、模型管理 | `Key` / `Server` / `Cpu` |
| **计费** | 定价管理、账单报表、请求日志 | `DollarSign` / `BarChart3` / `FileText` |
| **权限管理** | 学生管理、角色管理 | `Users` / `ShieldCheck` |

### 3.3 菜单项样式

| 状态 | 样式 |
|------|------|
| 默认 | `w-full h-10 px-3 text-sm font-medium text-[#1e293b] hover:bg-gray-50 rounded-md` |
| 选中 | `text-[#2563eb] bg-blue-50 font-medium border-l-4 border-[#2563eb]` |
| 图标 | `w-4 h-4 shrink-0`，默认 `text-[#64748b]`，选中 `text-[#2563eb]` |
| 分组标题 | `px-3 text-[11px] font-semibold text-[#64748b] tracking-wider uppercase mb-1.5` |

### 3.4 用户信息区

| 属性 | 值 |
|------|-----|
| 位置 | 底部 `p-3 border-t border-[#e2e8f0] bg-white` |
| 容器 | `p-2 rounded-lg bg-[#f8f9fa] border border-[#e2e8f0]` |
| 头像 | 32px 圆形 `bg-[#2563eb]/10 text-[#2563eb] font-bold text-xs` |
| 用户名 | `text-xs font-semibold text-[#1e293b]` |
| 邮箱 | `text-[11px] text-[#64748b]` |
| 退出按钮 | `p-1.5 text-[#64748b] hover:text-red-600 hover:bg-red-50 rounded-md` |

---

## 4. 顶部导航栏规范 (Header)

> 文件: [Header.tsx](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/07-PRD/nova-ai-gateway-admin-console/src/components/Header.tsx)

| 属性 | 值 |
|------|-----|
| 高度 | `h-16 px-6` |
| 背景 | `bg-white border-b border-[#e2e8f0]` |
| 布局 | `flex items-center justify-between shrink-0 z-10` |

### 4.1 左侧标题区

| 属性 | 值 |
|------|-----|
| 标题 | `text-lg font-bold text-[#1e293b]` |
| 副标题 | `text-xs text-[#64748b] font-normal` |

### 4.2 右侧功能区

| 元素 | 样式 |
|------|------|
| 页面切换下拉 | `hidden lg:flex`，快速切换器，仅开发/演示用 |
| 系统状态 | `px-2.5 py-1 rounded-full bg-emerald-50 border-emerald-200/60 text-emerald-700 text-xs` |
| 搜索框 | `h-8 pl-8 pr-3 text-xs bg-[#f8f9fa] border border-[#e2e8f0] rounded w-40 focus:w-56 transition-all` |
| 通知铃铛 | `p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8f9fa] rounded-md relative`，右上角蓝色 8px 圆点 |
| 帮助 | 同通知按钮样式 |

---

## 5. 页面标题体系

| 页面 ID | 页面标题 | 页面副标题 |
|---------|----------|-----------|
| `login` | 系统登录 | Nova AI Gateway 管理系统鉴权登录 |
| `dashboard` | **仪表盘** | 网关全局请求量、Token 消耗、延迟及成本实时监控 |
| `apikeys` | **API Key 管理** | 客户端密钥生成、作用域隔离与安全撤销控制 |
| `providers` | **Provider 管理** | 大模型供应商节点、优先级调度与负载权重配置 |
| `models` | **模型管理** | 统一模型标识命名与多 Provider 实例路由绑定 |
| `pricing` | **定价管理** | 阶梯定价、统一定价与高峰期分时段策略配置 |
| `billing` | **账单报表** | 按用户/模型维度的 Token 消费统计与多条件筛选 |
| `logs` | **请求日志** | 秒级实时网关转发日志、延迟响应与异常报错排查 |
| `students` | **学生管理** | 高校/机构学生账号额度授权与模型细粒度访问控制 |
| `roles` | **角色管理** | 系统角色定义与基于 RBAC 的底层权限列表映射 |

---

## 6. 表格规范 (Table)

> 参考实现: [DashboardView.tsx](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/07-PRD/nova-ai-gateway-admin-console/src/components/views/DashboardView.tsx) (L233-L294)

### 6.1 表格容器

```tsx
<div className="bg-white rounded-lg border border-[#e2e8f0] p-5 space-y-4">
  <div className="overflow-x-auto rounded border border-[#e2e8f0]">
    <table className="w-full text-left text-xs border-collapse">
      ...
    </table>
  </div>
</div>
```

### 6.2 表头

| 属性 | 值 |
|------|-----|
| 行高 | `h-10` |
| 背景 | `bg-[#f8f9fa]` |
| 分割 | `border-b border-[#e2e8f0]` |
| 文字 | `text-[#64748b] font-semibold` |
| 内边距 | `px-4 py-2` |

### 6.3 数据行

| 属性 | 值 |
|------|-----|
| 行高 | `h-12` |
| 交替色 | 偶 `bg-white` / 奇 `bg-[#fafbfc]` |
| hover | `hover:bg-[#eff6ff]/60` |
| 分割 | `divide-y divide-[#e2e8f0]` |
| 内边距 | `px-4 py-2` |

### 6.4 表格列数据类型样式

| 数据类型 | 样式 |
|----------|------|
| 名称/标题 | `font-bold text-[#1e293b]` |
| 代码/编码 | `font-mono text-[#64748b]` (用 `<code>` 标签) |
| 数字/金额 | `font-mono font-bold text-[#1e293b]` |
| 时间戳 | `text-[#64748b] font-mono text-[11px]` |
| 状态标签 | 见第 8 节 Badge 规范 |
| URL (长文本) | `max-w-[200px] truncate` + `title` 属性 |

---

## 7. 按钮规范 (Button)

### 7.1 按钮尺寸

| 尺寸 | 高度 | 内边距 | 字号 |
|------|------|--------|------|
| 大号 (主按钮) | `h-9` | `px-4` | `text-xs` |
| 中号 (操作) | `h-8` | `px-3` | `text-xs` |
| 小号 (表格内) | — | `px-2.5 py-1` | `text-xs` / `text-[11px]` |

### 7.2 按钮类型

| 类型 | 样式模板 | 使用场景 |
|------|----------|---------|
| **主按钮 Primary** | `bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-md shadow-xs` | 创建/保存/搜索/登录 |
| **次按钮 Secondary** | `border border-[#cbd5e1] text-[#334155] bg-white hover:bg-slate-50 font-medium rounded-md` | 取消/关闭/详情 |
| **蓝色操作** | `border border-blue-200 text-[#2563eb] hover:bg-blue-50 font-medium rounded` | 编辑/编辑权限 |
| **红色危险** | `border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded` | 删除/撤销 |
| **绿色启用** | `border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-medium rounded` | 启用学生 |
| **红色禁用** | `border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 font-medium rounded` | 禁用学生 |
| **图标按钮** | `p-1.5 text-[#64748b] hover:text-[#1e293b] hover:bg-[#f8f9fa] rounded-md` | 通知/帮助/退出 |

### 7.3 按钮状态

- **disabled**: `opacity-70` 或 `cursor-not-allowed`
- 所有按钮通用: `transition-colors cursor-pointer`

---

## 8. 标签规范 (Badge)

| 类型 | 色值 | 场景 |
|------|------|------|
| **绿色 成功/启用** | `bg-emerald-50 text-emerald-700 border border-emerald-200/60` | `success`, 启用, `enabled`, `active` |
| **红色 失败/禁用** | `bg-rose-50 text-rose-700 border border-rose-200/60` | `failed`, 禁用, `revoked`, `disabled` |
| **蓝色 系统** | `bg-blue-50 text-blue-700 border border-blue-200/60` | 系统角色, 统一定价 |
| **紫色 分时段** | `bg-purple-50 text-purple-700 border border-purple-200/60` | 分时段定价 |
| **灰色 禁用状态** | `bg-slate-100 text-slate-600 border border-slate-200` | Provider 禁用 |

```tsx
// 通用模板
<span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium {colorClasses}">
  {label}
</span>
```

---

## 9. 弹窗/模态框规范 (Modal/Dialog)

> 参考实现: [StudentView.tsx](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/07-PRD/nova-ai-gateway-admin-console/src/components/views/StudentView.tsx) (L214-L406)

### 9.1 遮罩层

```tsx
<div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
```

### 9.2 弹窗容器

```tsx
<div className="bg-white w-full max-w-md rounded-lg border border-[#e2e8f0] shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
```

### 9.3 弹窗尺寸

| 尺寸 | class | 适用场景 |
|------|-------|---------|
| 小 | `max-w-md` (420px) | 创建学生、创建角色 |
| 中 | `max-w-lg` (560px) | 学生详情、角色权限编辑、定价编辑 |
| 大 | `max-w-xl` (680px) | Provider 编辑（字段较多） |

### 9.4 弹窗内容结构

```
┌─ dialog ─────────────────────────────────┐
│  ┌─ 标题区 (border-b pb-3) ────────────┐ │
│  │  标题 20px bold  #1e293b    [X] 关闭  │ │
│  │  副标题/描述 12px #64748b             │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌─ success toast (可选) ───────────────┐ │
│  │ ✓ 操作成功提示 (bg-emerald-50)       │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌─ 表单内容区 (space-y-4) ────────────┐ │
│  │  表单项: label 12px + input 36px    │ │
│  │  (各类字段)                          │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌─ 底部按钮区 (border-t pt-3) ─────────┐ │
│  │            [取消] [主按钮/保存]       │ │
│  └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 10. 表单规范

### 10.1 输入框

| 属性 | 值 |
|------|-----|
| 高度 | `h-9` (36px) |
| 内边距 | `px-3` |
| 字号 | `text-xs` |
| 背景 | `bg-white` |
| 边框 | `border border-[#e2e8f0] rounded` |
| Focus | `focus:outline-none focus:border-[#2563eb]` |
| 标签 | `text-xs font-semibold text-[#1e293b]` |
| 标签间距 | `space-y-1.5` |

### 10.2 选择框 (Select)

```tsx
<select className="w-full h-9 px-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]">
```

### 10.3 文本域 (Textarea)

```tsx
<textarea rows={3} className="w-full p-3 text-xs bg-white border border-[#e2e8f0] rounded text-[#1e293b] focus:outline-none focus:border-[#2563eb]" />
```

### 10.4 开关 (Toggle Switch)

```tsx
<button
  type="button"
  onClick={() => setEnabled(!enabled)}
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
    enabled ? 'bg-[#2563eb]' : 'bg-slate-300'
  }`}
>
  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
    enabled ? 'translate-x-6' : 'translate-x-1'
  }`} />
</button>
```

### 10.5 复选框 (Checkbox)

| 属性 | 值 |
|------|-----|
| 尺寸 | `rounded` |
| 颜色 | `text-[#2563eb]` |
| Focus | `focus:ring-[#2563eb]` |
| 容器 | `flex items-start gap-2.5 p-2.5 rounded border border-[#e2e8f0] bg-[#f8f9fa] hover:bg-white cursor-pointer transition-colors` |

---

## 11. 统计卡片规范 (Stat Card)

> 参考实现: [DashboardView.tsx](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/07-PRD/nova-ai-gateway-admin-console/src/components/views/DashboardView.tsx) (L99-L133)

```tsx
<div className="bg-white rounded-[8px] border border-[#e2e8f0] p-4 flex flex-col justify-between hover:border-[#2563eb]/40 transition-all shadow-2xs">
  <!-- 图标 + 标题行 -->
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-semibold text-[#64748b]">{title}</span>
    <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 {color}">
      <Icon className="w-4 h-4" />
    </div>
  </div>
  <!-- 数值 + 趋势 -->
  <div>
    <div className="text-2xl font-bold text-[#1e293b] tracking-tight">{value}</div>
    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#64748b]">
      {trendIcon}
      <span>{change}</span>
    </div>
  </div>
</div>
```

### 卡片颜色映射

| 指标 | 图标背景色 |
|------|-----------|
| 今日请求数 | `text-blue-600 bg-blue-50` |
| 今日 Token | `text-indigo-600 bg-indigo-50` |
| 今日成本 | `text-emerald-600 bg-emerald-50` |
| 平均延迟 | `text-amber-600 bg-amber-50` |
| 活跃 API Key | `text-sky-600 bg-sky-50` |
| 活跃 Provider | `text-purple-600 bg-purple-50` |
| 总请求数 | `text-blue-600 bg-blue-50` |
| 总成本 | `text-teal-600 bg-teal-50` |

---

## 12. 图表占位区规范

```tsx
<div className="w-full h-56 border-2 border-dashed border-[#cbd5e1] rounded-lg bg-[#fafbfc] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
  <!-- 背景虚线 SVG 折线图 -->
  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 500 150">
    <path d="..." fill="none" stroke="#2563eb" strokeWidth="4" />
    <path d="..." fill="none" stroke="#10b981" strokeWidth="3" />
  </svg>
  <!-- 占位文字 -->
  <div className="text-sm font-bold text-[#1e293b]">「待接入图表」</div>
  <p className="text-xs text-[#64748b] max-w-md">可接入 ECharts / Recharts ...</p>
</div>
```

### 图表 Tab 切换按钮

```tsx
<button className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
  active ? 'bg-[#2563eb] text-white' : 'bg-[#f8f9fa] text-[#64748b] hover:bg-[#e2e8f0]'
}`} />
```

---

## 13. 图标库 (Icons)

使用 **lucide-react** 图标库。当前项目使用的图标清单：

| 页面/元素 | 图标组件 | 用途 |
|-----------|---------|------|
| Brand Logo | `Zap` | 品牌闪电标志 |
| 仪表盘 | `LayoutDashboard` | 侧边栏导航 |
| API Key | `Key` | 侧边栏导航 |
| Provider | `Server` | 侧边栏导航 |
| 模型管理 | `Cpu` | 侧边栏导航 |
| 定价管理 | `DollarSign` | 侧边栏导航 + 页面标题 |
| 账单报表 | `BarChart3` | 侧边栏导航 + 图表区 |
| 请求日志 | `FileText` | 侧边栏导航 |
| 学生管理 | `Users` | 侧边栏导航 |
| 角色管理 | `ShieldCheck` | 侧边栏导航 + 页面标题 |
| 搜索 | `Search` | Header + 列表搜索 |
| 通知 | `Bell` | Header |
| 帮助 | `HelpCircle` | Header |
| 新增/创建 | `Plus` | 页面操作按钮 |
| 编辑 | `Edit` | 表格操作 |
| 删除 | `Trash2` | 表格操作 |
| 关闭 | `X` | 弹窗关闭 |
| 成功 | `Check` | Toast 提示 |
| 错误 | `AlertCircle` | 错误状态 |
| 详情 | `Eye` | 查看详情 |
| 返回/前进 | `ArrowRight` / `ArrowLeft` | 登录/趋势 |
| 上升/下降 | `ArrowUpRight` / `ArrowDownRight` | 卡片趋势指示 |
| 时间 | `Clock` | 最近请求 + 分时段时间 |
| 刷新 | `RefreshCw` | 刷新按钮 |
| 金额 | `DollarSign` | 额度管理区域 |
| 锁 | `Lock` / `ShieldCheck` | 登录页安全标识 |
| 邮件 | `Mail` | 登录页邮箱图标 |
| 全局 | `Globe` / `Activity` / `Layers` / `TrendingUp` | 卡片/指标 |

---

## 14. 页面级布局规范

### 14.1 通用页面容器

```tsx
<div className="p-6 space-y-6 bg-[#f8f9fa] min-h-full">
```

### 14.2 操作栏（搜索 + 新建按钮）

```tsx
<div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#e2e8f0]">
  <!-- 左侧搜索 -->
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <div className="relative w-full sm:w-72">
      <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-2.5" />
      <input type="text" placeholder="搜索..." className="w-full h-8 pl-8 pr-3 text-xs bg-[#f8f9fa] ..." />
    </div>
    <button className="h-8 px-3 bg-[#2563eb] text-white text-xs font-medium rounded">搜索</button>
  </div>
  <!-- 右侧新建 -->
  <button className="h-9 px-4 bg-[#2563eb] ...">
    <Plus className="w-4 h-4" /> 创建学生
  </button>
</div>
```

### 14.3 分隔处理

- 弹窗标题区: `border-b border-[#e2e8f0] pb-3`
- 弹窗按钮区: `border-t border-[#e2e8f0] pt-3`
- 侧边栏分组: `space-y-5` 分组间距
- 侧边栏用户区: `border-t border-[#e2e8f0]`
- 表单内分割: `pt-3 border-t border-[#e2e8f0]`

### 14.4 弹窗表单网格布局

- 两列并排: `grid grid-cols-2 gap-3`
- 四列网格: `grid grid-cols-1 sm:grid-cols-2 gap-2`（权限复选框）
- 标签 + 输入框: `space-y-1` 或 `space-y-1.5`

---

## 15. 过滤/筛选栏规范

> 参考实现: [BillingView.tsx](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/07-PRD/nova-ai-gateway-admin-console/src/components/views/BillingView.tsx)

```tsx
<div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg border border-[#e2e8f0]">
  <!-- 各筛选条件 inline 排列 -->
  <input type="text" placeholder="用户 ID" className="w-28 h-8 px-2.5 text-xs bg-white border border-[#e2e8f0] rounded" />
  <input type="date" className="w-36 h-8 px-2.5 text-xs bg-white border border-[#e2e8f0] rounded" />
  <input type="date" className="w-36 h-8 px-2.5 text-xs bg-white border border-[#e2e8f0] rounded" />
  <select className="h-8 px-2.5 text-xs bg-white border border-[#e2e8f0] rounded">
    <option>全部状态</option>
  </select>
  <button className="h-8 px-3 bg-[#2563eb] text-white text-xs font-medium rounded">搜索</button>
</div>
```

---

## 16. 分页规范

```tsx
<div className="flex items-center gap-3 text-xs text-[#64748b] mt-4">
  <span>共 XX 条</span>
  <button className="h-8 px-3 border border-[#cbd5e1] rounded text-[#334155] bg-white hover:bg-slate-50 text-xs" disabled={page <= 1}>
    上一页
  </button>
  <span>第 X / Y 页</span>
  <button className="h-8 px-3 border border-[#cbd5e1] rounded text-[#334155] bg-white hover:bg-slate-50 text-xs" disabled={page >= totalPages}>
    下一页
  </button>
</div>
```

---

## 17. 交互与动效

| 交互 | 规范 |
|------|------|
| 按钮 hover | 颜色加深 `transition-colors duration-150` |
| 表格行 hover | `hover:bg-[#eff6ff]/60` 蓝色调 |
| 弹窗出现 | `animate-in zoom-in-95 duration-150` |
| 搜索框 focus | 宽度从 160px 展开到 224px `transition-all` |
| 状态切换按钮 | 颜色从绿↔红动态变化 |
| 成功提示 toast | 绿色底 `bg-emerald-50`，2.5 秒自动消失 |
| 卡片 hover | `hover:border-[#2563eb]/40 transition-all` |
| 所有可交互元素 | `transition-colors` 或 `transition-all` |

---

## 18. 圆角系统

| 层级 | 圆角值 | 应用场景 |
|------|--------|---------|
| 卡片 | `rounded-lg` (8px) | 白色统计卡片、表格容器、操作栏 |
| 弹窗 | `rounded-lg` (8px) | 模态框容器 |
| 按钮 | `rounded-md` (6px) | 所有按钮 |
| 输入框 | `rounded` (4px) | 所有表单输入框 |
| 标签 | `rounded` (4px) | Badge 标签 |
| 品牌图标 | `rounded-lg` (8px) | 侧边栏品牌 Logo 方块 |
| 头像 | `rounded-full` (50%) | 用户头像圆形 |
| 搜索框 | `rounded` (4px) | Header 及页面搜索框 |

---

## 19. 间距系统

| 层级 | 值 | 应用场景 |
|------|-----|---------|
| 页面边距 | `p-6` (24px) | 页面内容区 |
| 页面间距 | `space-y-6` (24px) | 页面内块级间距 |
| 卡片内边距 | `p-4` ~ `p-5` (16~20px) | 卡片容器 |
| 表格单元格 | `px-4 py-2` (16px / 8px) | 表头/数据行 |
| 弹窗内边距 | `p-6` (24px) | 弹窗容器 |
| 弹窗内容间距 | `space-y-5` (20px) | 弹窗内段落间距 |
| 表单间距 | `space-y-4` (16px) | 表单项间距 |
| 表单行内 | `gap-3` (12px) | 并排字段间距 |
| 导航项间距 | `gap-3` (12px) | 菜单项内图标文字间距 |
| 分组间距 | `space-y-5` (20px) | 侧边栏分组 |

---

## 20. Tailwind CSS 类名速查

项目中所有样式使用 Tailwind CSS v3+ 实现，核心自定义变量：

| 类名 | 值 | 用途 |
|------|----|------|
| `bg-[#f8f9fa]` | #f8f9fa | 页面底色 |
| `bg-[#fafbfc]` | #fafbfc | 表格交替行底色 |
| `bg-[#eff6ff]/60` | #eff6ff @ 60% | 表格行 hover |
| `bg-blue-50` | #eff6ff | 蓝色选中/激活背景 |
| `text-[#2563eb]` | #2563eb | 主蓝色文字 |
| `text-[#1e293b]` | #1e293b | 正文/标题 |
| `text-[#64748b]` | #64748b | 次要文字 |
| `text-[#334155]` | #334155 | 按钮文字 |
| `border-[#e2e8f0]` | #e2e8f0 | 全平台边框 |
| `border-[#cbd5e1]` | #cbd5e1 | 次按钮边框 |
| `shadow-xs` | — | 卡片/按钮阴影 |
| `bg-slate-900/50` | rgba(15,23,42,0.5) | 弹窗遮罩 |
| `backdrop-blur-xs` | 4px | 遮罩模糊 |
