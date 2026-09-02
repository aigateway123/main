// ============================================================================
// 环保员工矩阵 · 主题色调令牌
// 环保原型中 8 位员工各自主色（emerald / teal / cyan / blue / indigo / amber / violet），
// 对应完整 Tailwind class 字面量集中于此，供 Tailwind JIT 扫描并保证 class 可复用。
// ============================================================================

export type EnvTone = 'emerald' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'amber' | 'violet'

export interface EnvToneSet {
  /** Header Banner 渐变 */
  banner: string
  /** Header Banner 边框 */
  bannerBorder: string
  /** 主图标 / 强调文字颜色 */
  icon: string
  /** code / 角色 徽章（半透明底 + 同色描边） */
  codePill: string
  /** 强调文案色（指标行时钟等） */
  accentText: string
  /** 主行动按钮渐变 */
  btnGradient: string
  /** 结果区激活 Tab */
  tabActive: string
  /** 左栏案例选中态卡片 */
  caseActive: string
  /** 文件卡图标底 */
  fileIconBox: string
  /** 右侧统计卡边框 */
  statBorder: string
  /** 右侧统计大数字 */
  statValue: string
  /** 选中卡片 / 数据项激活底 */
  softBg: string
  /** 章节/标签 高亮字 */
  chipText: string
}

export const ENV_TONES: Record<EnvTone, EnvToneSet> = {
  emerald: {
    banner: 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    codePill: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    accentText: 'text-emerald-400',
    btnGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400',
    tabActive: 'bg-emerald-500',
    caseActive: 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/40',
    fileIconBox: 'bg-emerald-500/10 text-emerald-400',
    statBorder: 'border-emerald-500/30',
    statValue: 'text-emerald-400',
    softBg: 'bg-emerald-500/10',
    chipText: 'text-emerald-400',
  },
  teal: {
    banner: 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-teal-500/30',
    icon: 'text-teal-400',
    codePill: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
    accentText: 'text-teal-400',
    btnGradient: 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400',
    tabActive: 'bg-teal-500',
    caseActive: 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/40',
    fileIconBox: 'bg-teal-500/10 text-teal-400',
    statBorder: 'border-teal-500/30',
    statValue: 'text-teal-400',
    softBg: 'bg-teal-500/10',
    chipText: 'text-teal-400',
  },
  cyan: {
    banner: 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-cyan-500/30',
    icon: 'text-cyan-400',
    codePill: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    accentText: 'text-cyan-400',
    btnGradient: 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400',
    tabActive: 'bg-cyan-500',
    caseActive: 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/40',
    fileIconBox: 'bg-cyan-500/10 text-cyan-400',
    statBorder: 'border-cyan-500/30',
    statValue: 'text-cyan-400',
    softBg: 'bg-cyan-500/10',
    chipText: 'text-cyan-400',
  },
  blue: {
    banner: 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-blue-500/30',
    icon: 'text-blue-400',
    codePill: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    accentText: 'text-blue-400',
    btnGradient: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400',
    tabActive: 'bg-blue-500',
    caseActive: 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/40',
    fileIconBox: 'bg-blue-500/10 text-blue-400',
    statBorder: 'border-blue-500/30',
    statValue: 'text-blue-400',
    softBg: 'bg-blue-500/10',
    chipText: 'text-blue-400',
  },
  indigo: {
    banner: 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-indigo-500/30',
    icon: 'text-indigo-400',
    codePill: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
    accentText: 'text-indigo-400',
    btnGradient: 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400',
    tabActive: 'bg-indigo-500',
    caseActive: 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/40',
    fileIconBox: 'bg-indigo-500/10 text-indigo-400',
    statBorder: 'border-indigo-500/30',
    statValue: 'text-indigo-400',
    softBg: 'bg-indigo-500/10',
    chipText: 'text-indigo-400',
  },
  amber: {
    banner: 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-amber-500/30',
    icon: 'text-amber-400',
    codePill: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    accentText: 'text-amber-400',
    btnGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
    tabActive: 'bg-amber-500',
    caseActive: 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40',
    fileIconBox: 'bg-amber-500/10 text-amber-400',
    statBorder: 'border-amber-500/30',
    statValue: 'text-amber-400',
    softBg: 'bg-amber-500/10',
    chipText: 'text-amber-400',
  },
  violet: {
    banner: 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950',
    bannerBorder: 'border-violet-500/30',
    icon: 'text-violet-400',
    codePill: 'bg-violet-500/20 text-violet-300 border border-violet-500/40',
    accentText: 'text-violet-400',
    btnGradient: 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400',
    tabActive: 'bg-violet-500',
    caseActive: 'bg-violet-500/10 border-violet-500 ring-1 ring-violet-500/40',
    fileIconBox: 'bg-violet-500/10 text-violet-400',
    statBorder: 'border-violet-500/30',
    statValue: 'text-violet-400',
    softBg: 'bg-violet-500/10',
    chipText: 'text-violet-400',
  },
}

export const toneOf = (id: string): EnvTone => {
  const t: EnvTone = id as EnvTone
  return t in ENV_TONES ? t : 'emerald'
}
