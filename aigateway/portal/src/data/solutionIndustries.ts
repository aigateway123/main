// ============================================================================
// 解决方案中心 · 行业分组元数据
// 行业清单驱动：/solutions 列表页筛选 Tabs + 卡片、首页 SolutionsSection 轮播、
// 「规划中」行业占位、SolutionEntryBanner 入口徽章。
// 新增行业流程：此处 push 一条 + solutions.ts 提供方案并填入 solutionSlugs；
//   id 需在 INDUSTRY_ICONS / INDUSTRY_TONES 同步补对应项（均为字面量 class）。
// ============================================================================
import type { FunctionalComponent } from 'vue'
import {
  GraduationCap, Flame, Trophy, Leaf, Cpu, LineChart, BookOpen, Ship, ShoppingBag,
} from 'lucide-vue-next'

export interface SolutionIndustry {
  /** 行业 key（同时是 INDUSTRY_ICONS / INDUSTRY_TONES 的 key） */
  id: string
  /** 行业/场景短名（Tab、徽章、占位卡标题显示） */
  name: string
  /** 行业一句话定位 */
  desc: string
  /** lucide 图标名（经 INDUSTRY_ICONS 解析为组件） */
  icon: string
  /** 该行业已上线方案的 slug 列表（预留数组：未来 1:N，现为 1:1） */
  solutionSlugs: string[]
  status: 'online' | 'coming-soon'
}

export const SOLUTION_INDUSTRIES: SolutionIndustry[] = [
  {
    id: 'education',
    name: '高校科研',
    icon: 'GraduationCap',
    desc: '文献、复现、数据分析与论文全流程自动化',
    status: 'online',
    solutionSlugs: ['university-agent'],
  },
  {
    id: 'content',
    name: '内容增长',
    icon: 'Flame',
    desc: '选题、创作、发布与私信转化的爆款内容中枢',
    status: 'online',
    solutionSlugs: ['content-creator'],
  },
  {
    id: 'bid',
    name: '投标作战',
    icon: 'Trophy',
    desc: '从招标解读到标书成稿的投标作战指挥台',
    status: 'online',
    solutionSlugs: ['bid-consultant'],
  },
  {
    id: 'env',
    name: '环保行业',
    icon: 'Leaf',
    desc: '合规、排污、监测到经营的环保 AI 员工矩阵',
    status: 'online',
    solutionSlugs: ['env-agent'],
  },
  {
    id: 'trade',
    name: '传统商贸',
    icon: 'Ship',
    desc: '寻客户、找供应商、读市场，把碎片信息整理成可跟进商机的商贸情报中枢',
    status: 'online',
    solutionSlugs: ['trade-intel'],
  },
  {
    id: 'ecommerce',
    name: '跨境电商',
    icon: 'ShoppingBag',
    desc: '选品、竞品、买家与利润，跨境电商爆款决策的 AI 情报中枢',
    status: 'online',
    solutionSlugs: ['ecom-intel'],
  },
  {
    id: 'rd',
    name: '企业研发',
    icon: 'Cpu',
    desc: '企业级 AI 应用研发、私有化部署与合规管控',
    status: 'coming-soon',
    solutionSlugs: [],
  },
  {
    id: 'finance',
    name: '量化金融',
    icon: 'LineChart',
    desc: '金融数据分析、策略研究自动化',
    status: 'coming-soon',
    solutionSlugs: [],
  },
  {
    id: 'edu-it',
    name: '教育信息化',
    icon: 'BookOpen',
    desc: '高校教学与行政场景的 AI 赋能',
    status: 'coming-soon',
    solutionSlugs: [],
  },
]

/** 行业图标：lucide 名 → 组件 */
export const INDUSTRY_ICONS: Record<string, FunctionalComponent> = {
  GraduationCap,
  Flame,
  Trophy,
  Leaf,
  Cpu,
  LineChart,
  BookOpen,
  Ship,
  ShoppingBag,
}

export interface IndustryTone {
  /** 徽章底色/文字 */
  badge: string
  /** 卡片内小徽章 */
  chip: string
  /** 卡片 hover 边框/阴影 */
  card: string
  /** 图标底渐变 */
  iconBox: string
  /** 筛选 Tab 激活态 */
  tabActive: string
}

/** 行业 id → 浅色主题字面量（每项均为完整 class，保证 Tailwind 扫描命中） */
export const INDUSTRY_TONES: Record<string, IndustryTone> = {
  education: {
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    chip: 'bg-blue-50 text-blue-700 border border-blue-100',
    iconBox: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
    tabActive: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20',
    card: 'hover:border-blue-300 hover:shadow-blue-600/10',
  },
  content: {
    badge: 'bg-orange-50 text-orange-700 border border-orange-200',
    chip: 'bg-orange-50 text-orange-700 border border-orange-100',
    iconBox: 'bg-gradient-to-tr from-orange-500 to-rose-500',
    tabActive: 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20',
    card: 'hover:border-orange-300 hover:shadow-orange-600/10',
  },
  bid: {
    badge: 'bg-violet-50 text-violet-700 border border-violet-200',
    chip: 'bg-violet-50 text-violet-700 border border-violet-100',
    iconBox: 'bg-gradient-to-tr from-violet-600 to-purple-600',
    tabActive: 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20',
    card: 'hover:border-violet-300 hover:shadow-violet-600/10',
  },
  env: {
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    chip: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    iconBox: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
    tabActive: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20',
    card: 'hover:border-emerald-300 hover:shadow-emerald-600/10',
  },
  trade: {
    badge: 'bg-sky-50 text-sky-700 border border-sky-200',
    chip: 'bg-sky-50 text-sky-700 border border-sky-100',
    iconBox: 'bg-gradient-to-tr from-sky-500 to-blue-700',
    tabActive: 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20',
    card: 'hover:border-sky-300 hover:shadow-sky-600/10',
  },
  ecommerce: {
    badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    chip: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    iconBox: 'bg-gradient-to-tr from-indigo-500 to-violet-600',
    tabActive: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20',
    card: 'hover:border-indigo-300 hover:shadow-indigo-600/10',
  },
  rd: {
    badge: 'bg-slate-100 text-slate-600 border border-slate-200',
    chip: 'bg-slate-50 text-slate-500 border border-slate-200',
    iconBox: 'bg-gradient-to-tr from-slate-500 to-slate-700',
    tabActive: 'bg-slate-600 text-white border-slate-600 shadow-md shadow-slate-600/20',
    card: 'hover:border-slate-300',
  },
  finance: {
    badge: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    chip: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
    iconBox: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
    tabActive: 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20',
    card: 'hover:border-cyan-300 hover:shadow-cyan-600/10',
  },
  'edu-it': {
    badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    chip: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    iconBox: 'bg-gradient-to-tr from-indigo-500 to-blue-600',
    tabActive: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20',
    card: 'hover:border-indigo-300 hover:shadow-indigo-600/10',
  },
}

/** 行业主色按钮（CTA/箭头用，取自对应 iconBox 渐变） */
export const INDUSTRY_BTN: Record<string, string> = {
  education: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
  content: 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600',
  bid: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
  env: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
  trade: 'bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-600 hover:to-blue-800',
  ecommerce: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700',
  rd: 'bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800',
  finance: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
  'edu-it': 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700',
}

/** 行业入口：按 slug 反查行业元数据（不存在时返回 undefined） */
export const industryOfSlug = (slug: string): SolutionIndustry | undefined =>
  SOLUTION_INDUSTRIES.find((i) => i.solutionSlugs.includes(slug))
