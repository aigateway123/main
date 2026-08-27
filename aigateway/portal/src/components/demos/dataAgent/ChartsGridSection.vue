<script setup lang="ts">
import { ref } from 'vue'
import { Download, FilePlus, Check } from 'lucide-vue-next'
import {
  GROUP_STATS,
  DISTRIBUTION_CHART_DATA,
  TREND_CHART_DATA,
  ANOMALY_SCATTER_DATA,
} from '@/data/dataAgentData'

const downloadingId = ref<string | null>(null)
const insertedId = ref<string | null>(null)
const paletteTheme = ref<'nature' | 'science' | 'cell'>('nature')

const emit = defineEmits<{ (e: 'insert-to-paper', figureId: string): void }>()

const handleDownload = (id: string, name: string) => {
  downloadingId.value = id
  setTimeout(() => {
    const content = `Publication Grade Scientific Figure\nTitle: ${name}\nFormat: High-Res 600 DPI Vector SVG\nTheme: ${paletteTheme.value.toUpperCase()} Journal Standard\nTimestamp: ${new Date().toISOString()}\nStatistical Power: 1-beta > 0.999\nData points: 186,420 rows`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${id}_600dpi_figure.txt`
    a.click()
    URL.revokeObjectURL(a.href)
    downloadingId.value = null
  }, 600)
}

const handleInsert = (id: string) => {
  insertedId.value = id
  emit('insert-to-paper', id)
  setTimeout(() => (insertedId.value = null), 2200)
}

// ===== 通用 SVG 几何 =====
const W = 560
const H = 240
const PAD = { top: 16, right: 14, bottom: 26, left: 40 }
const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom
const base = PAD.top + plotH

// ---- Fig 1A: 组间柱状图 ----
const Y1_MIN = 60
const Y1_MAX = 100
const y1 = (v: number) => PAD.top + plotH - ((v - Y1_MIN) / (Y1_MAX - Y1_MIN)) * plotH
const xA = (i: number) => PAD.left + (plotW / 3) * (i + 0.5)
const BAR_W = 44
const gridA = [60, 70, 80, 90, 100].map((v) => ({ v, y: y1(v) }))
const barsA = GROUP_STATS.map((s, i) => ({
  ...s,
  x: xA(i) - BAR_W / 2,
  y: y1(s.score),
  h: base - y1(s.score),
  e1: y1(Math.min(s.score + s.stdDev, 100)),
  e2: y1(Math.max(s.score - s.stdDev, Y1_MIN)),
  fill: s.group === 'A' ? 'rgba(59,130,246,0.3)' : s.group === 'B' ? 'rgba(59,130,246,0.6)' : '#3b82f6',
  stroke: s.group === 'A' ? 'rgba(59,130,246,0.6)' : s.group === 'B' ? 'rgba(59,130,246,0.8)' : '#60a5fa',
}))

// ---- Fig 1B: KDE 分布 Area 图 ----
const XB_MIN = 65
const XB_MAX = 100
const xB = (score: number) => PAD.left + ((score - XB_MIN) / (XB_MAX - XB_MIN)) * plotW
const yB = (v: number) => PAD.top + plotH - (v / 100) * plotH
const distA = DISTRIBUTION_CHART_DATA.map((d) => ({ ...d, x: xB(d.score), yA: yB(d.Group_A), yBv: yB(d.Group_B), yC: yB(d.Group_C) }))
const areaPath = (key: 'yA' | 'yBv' | 'yC') => {
  const pts = distA.map((d) => `${d.x},${d[key]}`)
  return `M ${distA[0].x},${base} L ${pts.join(' L ')} L ${distA[distA.length - 1].x},${base} Z`
}
const linePath = (key: 'yA' | 'yBv' | 'yC') => distA.map((d) => `${d.x},${d[key]}`).join(' L ')

// ---- Fig 1C: 动力学时序 Line 图 ----
const yC = (v: number) => PAD.top + plotH - (v / 100) * plotH
const trend = TREND_CHART_DATA.map((d, i) => ({
  ...d,
  x: PAD.left + (plotW / (TREND_CHART_DATA.length - 1)) * i,
  yA: yC(d.Group_A),
  yBv: yC(d.Group_B),
  yC: yC(d.Group_C),
  yBase: yC(d.Baseline),
}))
const trendPath = (key: 'yA' | 'yBv' | 'yC' | 'yBase') => trend.map((d) => `${d.x},${d[key]}`).join(' L ')

// ---- Fig 1D: 异常散点图 ----
const xD = (p: number) => PAD.left + (p / 9) * plotW
const yD = (v: number) => PAD.top + plotH - ((v - 20) / 80) * plotH
const scatterPts = ANOMALY_SCATTER_DATA.map((d) => ({
  ...d,
  x: xD(d.pressure),
  y: yD(d.yield),
}))

const gridB = [0, 25, 50, 75, 100].map((v) => ({ v, y: yB(v) }))
const gridC = [0, 25, 50, 75, 100].map((v) => ({ v, y: yC(v) }))
const gridD = [20, 40, 60, 80, 100].map((v) => ({ v, y: yD(v) }))
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e293b]">
      <div>
        <h3 class="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">自动生成科研图表 (Publication Charts)</h3>
        <p class="text-xs text-[#94a3b8] mt-0.5 pl-3">提供符合 Nature / Science 规范的高分辨率科研图表，支持一键插图与矢量导出</p>
      </div>
      <div class="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-[#1e293b] self-start sm:self-auto">
        <span class="text-[10px] uppercase tracking-wider text-[#64748b] px-2 font-semibold">配色风格:</span>
        <button v-for="style in (['nature', 'science', 'cell'] as const)" :key="style"
          class="px-2 py-0.5 text-xs rounded font-mono uppercase transition-all cursor-pointer"
          :class="paletteTheme === style ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-[#64748b] hover:text-white'"
          @click="paletteTheme = style">{{ style }}</button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- CHART 1: 实验组对比图 -->
      <div class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <span class="text-xs font-bold text-white font-mono">Figure 1A. 实验组对比图</span>
              <p class="text-[11px] text-[#94a3b8] mt-0.5">组间性能均值与误差棒 (Mean ± SD)</p>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">ANOVA *** p&lt;0.001</span>
          </div>

          <div class="w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
            <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto">
              <g v-for="g in gridA" :key="g.v">
                <line :x1="PAD.left" :x2="W - PAD.right" :y1="g.y" :y2="g.y" stroke="#1e293b" stroke-dasharray="3 3" />
                <text :x="PAD.left - 8" :y="g.y + 4" text-anchor="end" fill="#64748b" font-size="11" font-family="monospace">{{ g.v }}</text>
              </g>
              <g v-for="b in barsA" :key="b.group">
                <rect :x="b.x" :y="b.y" :width="BAR_W" :height="b.h" rx="4" :fill="b.fill" :stroke="b.stroke" stroke-width="1.5" />
                <line :x1="b.x + BAR_W / 2" :x2="b.x + BAR_W / 2" :y1="b.e1" :y2="b.e2" stroke="#94a3b8" stroke-width="2" />
                <line :x1="b.x + BAR_W / 2 - 5" :x2="b.x + BAR_W / 2 + 5" :y1="b.e1" :y2="b.e1" stroke="#94a3b8" stroke-width="2" />
                <line :x1="b.x + BAR_W / 2 - 5" :x2="b.x + BAR_W / 2 + 5" :y1="b.e2" :y2="b.e2" stroke="#94a3b8" stroke-width="2" />
                <text :x="b.x + BAR_W / 2" :y="H - 8" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="monospace">Group {{ b.group }}</text>
              </g>
            </svg>
          </div>

          <p class="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
            <strong class="text-white">Fig. 1A | 实验组性能对比.</strong> 组别 A、B、C 展现梯度提升，实验组 C 获得峰值得分 91.2 ± 3.1（显著优于 A 组 78.4 ± 4.8，p &lt; 0.001）。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
          <button class="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            @click="handleDownload('fig1a_comparison', 'Figure 1A 实验组对比图')">
            <span v-if="downloadingId === 'fig1a_comparison'" class="text-blue-400">导出中...</span>
            <template v-else><Download class="w-3.5 h-3.5" /><span>下载图片</span></template>
          </button>
          <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            @click="handleInsert('fig1a_comparison')">
            <template v-if="insertedId === 'fig1a_comparison'"><Check class="w-3.5 h-3.5 text-white" /><span>已插入论文</span></template>
            <template v-else><FilePlus class="w-3.5 h-3.5" /><span>插入论文</span></template>
          </button>
        </div>
      </div>

      <!-- CHART 2: 指标分布图 -->
      <div class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <span class="text-xs font-bold text-white font-mono">Figure 1B. 指标分布图</span>
              <p class="text-[11px] text-[#94a3b8] mt-0.5">组间核密度估计 (KDE) 与频率分布谱线</p>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">Gaussian KDE</span>
          </div>

          <div class="w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
            <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto">
              <g v-for="g in gridB" :key="g.v">
                <line :x1="PAD.left" :x2="W - PAD.right" :y1="g.y" :y2="g.y" stroke="#1e293b" stroke-dasharray="3 3" />
                <text :x="PAD.left - 8" :y="g.y + 4" text-anchor="end" fill="#64748b" font-size="11" font-family="monospace">{{ g.v }}</text>
              </g>
              <text :x="PAD.left" :y="H - 8" fill="#64748b" font-size="11" font-family="monospace">Score: 65</text>
              <text :x="W - PAD.right" :y="H - 8" text-anchor="end" fill="#64748b" font-size="11" font-family="monospace">100</text>
              <path :d="areaPath('yA')" fill="#3b82f6" fill-opacity="0.2" />
              <path :d="areaPath('yBv')" fill="#6366f1" fill-opacity="0.25" />
              <path :d="areaPath('yC')" fill="#10b981" fill-opacity="0.3" />
              <path :d="`M ${linePath('yA')}`" fill="none" stroke="#3b82f6" stroke-width="2" />
              <path :d="`M ${linePath('yBv')}`" fill="none" stroke="#6366f1" stroke-width="2" />
              <path :d="`M ${linePath('yC')}`" fill="none" stroke="#10b981" stroke-width="2" />
            </svg>
          </div>

          <p class="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
            <strong class="text-white">Fig. 1B | 性能指标核密度分布.</strong> 实验组 C 的概率密度峰值向右偏移，分布峰态明显尖锐，验证系统一致性大幅增强。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
          <button class="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            @click="handleDownload('fig1b_distribution', 'Figure 1B 指标分布图')">
            <span v-if="downloadingId === 'fig1b_distribution'" class="text-blue-400">导出中...</span>
            <template v-else><Download class="w-3.5 h-3.5" /><span>下载图片</span></template>
          </button>
          <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            @click="handleInsert('fig1b_distribution')">
            <template v-if="insertedId === 'fig1b_distribution'"><Check class="w-3.5 h-3.5 text-white" /><span>已插入论文</span></template>
            <template v-else><FilePlus class="w-3.5 h-3.5" /><span>插入论文</span></template>
          </button>
        </div>
      </div>

      <!-- CHART 3: 趋势图 -->
      <div class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <span class="text-xs font-bold text-white font-mono">Figure 1C. 动力学时序趋势图</span>
              <p class="text-[11px] text-[#94a3b8] mt-0.5">反应时间动力学曲线 (Time-Course Kinetics 0h ~ 12h)</p>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">k_rate = 1.64x</span>
          </div>

          <div class="w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
            <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto">
              <g v-for="g in gridC" :key="g.v">
                <line :x1="PAD.left" :x2="W - PAD.right" :y1="g.y" :y2="g.y" stroke="#1e293b" stroke-dasharray="3 3" />
                <text :x="PAD.left - 8" :y="g.y + 4" text-anchor="end" fill="#64748b" font-size="11" font-family="monospace">{{ g.v }}</text>
              </g>
              <g v-for="(d, i) in trend" :key="i">
                <circle v-if="i % 2 === 0" :cx="d.x" :cy="base" r="2" fill="#64748b" />
                <text v-if="i % 2 === 0" :x="d.x" :y="H - 8" text-anchor="middle" fill="#64748b" font-size="11" font-family="monospace">{{ d.time }}</text>
              </g>
              <path :d="`M ${trendPath('yBase')}`" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="4 4" />
              <path :d="`M ${trendPath('yA')}`" fill="none" stroke="#3b82f6" stroke-width="2" />
              <path :d="`M ${trendPath('yBv')}`" fill="none" stroke="#6366f1" stroke-width="2" />
              <path :d="`M ${trendPath('yC')}`" fill="none" stroke="#10b981" stroke-width="2.5" />
              <g v-for="(d, i) in trend" :key="`c${i}`">
                <circle :cx="d.x" :cy="d.yC" r="3" fill="#10b981" />
                <circle :cx="d.x" :cy="d.yA" r="2" fill="#3b82f6" />
                <circle :cx="d.x" :cy="d.yBv" r="2" fill="#6366f1" />
              </g>
            </svg>
          </div>

          <p class="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
            <strong class="text-white">Fig. 1C | 反应动力学历程.</strong> 实验组 C 在反应前 4 小时即展现出极陡峭的活化斜率，最终稳态转化率较对照组提高 16.3%。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
          <button class="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            @click="handleDownload('fig1c_trend', 'Figure 1C 趋势图')">
            <span v-if="downloadingId === 'fig1c_trend'" class="text-blue-400">导出中...</span>
            <template v-else><Download class="w-3.5 h-3.5" /><span>下载图片</span></template>
          </button>
          <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            @click="handleInsert('fig1c_trend')">
            <template v-if="insertedId === 'fig1c_trend'"><Check class="w-3.5 h-3.5 text-white" /><span>已插入论文</span></template>
            <template v-else><FilePlus class="w-3.5 h-3.5" /><span>插入论文</span></template>
          </button>
        </div>
      </div>

      <!-- CHART 4: 异常值图 -->
      <div class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <span class="text-xs font-bold text-white font-mono">Figure 1D. 异常值残差散点图</span>
              <p class="text-[11px] text-[#94a3b8] mt-0.5">3-Sigma 边界与 Isolation Forest 离群点定位</p>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">3 重点异常标记</span>
          </div>

          <div class="w-full mt-3 bg-black/40 rounded-lg p-2 border border-[#1e293b]">
            <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto">
              <g v-for="g in gridD" :key="g.v">
                <line :x1="PAD.left" :x2="W - PAD.right" :y1="g.y" :y2="g.y" stroke="#1e293b" stroke-dasharray="3 3" />
                <text :x="PAD.left - 8" :y="g.y + 4" text-anchor="end" fill="#64748b" font-size="11" font-family="monospace">{{ g.v }}</text>
              </g>
              <line :x1="PAD.left" :x2="W - PAD.right" :y1="yD(95)" :y2="yD(95)" stroke="#ef4444" stroke-dasharray="3 3" stroke-width="1" />
              <line :x1="PAD.left" :x2="W - PAD.right" :y1="yD(65)" :y2="yD(65)" stroke="#ef4444" stroke-dasharray="3 3" stroke-width="1" />
              <text :x="PAD.left" :y="H - 8" fill="#64748b" font-size="11" font-family="monospace">Pressure (MPa): 0 → 9</text>
              <circle v-for="p in scatterPts" :key="p.id" :cx="p.x" :cy="p.y" :r="p.status === 'Anomaly' ? 7 : 5"
                :fill="p.status === 'Anomaly' ? '#ef4444' : '#3b82f6'"
                :stroke="p.status === 'Anomaly' ? '#fca5a5' : '#60a5fa'" :stroke-width="p.status === 'Anomaly' ? 2 : 1" />
              <text v-for="p in scatterPts.filter((d) => d.status === 'Anomaly')" :key="`t${p.id}`"
                :x="p.x" :y="p.y - 10" text-anchor="middle" fill="#fca5a5" font-size="10" font-family="monospace">{{ p.sample }}</text>
            </svg>
          </div>

          <p class="text-[11px] text-[#94a3b8] mt-2 italic leading-relaxed">
            <strong class="text-white">Fig. 1D | 孤立森林残差散点.</strong> 红色高亮样本偏离 3σ 置信椭圆域（如 #12842），判定为传感器硬件漂移。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-end gap-2">
          <button class="px-3 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            @click="handleDownload('fig1d_anomaly', 'Figure 1D 异常值散点图')">
            <span v-if="downloadingId === 'fig1d_anomaly'" class="text-blue-400">导出中...</span>
            <template v-else><Download class="w-3.5 h-3.5" /><span>下载图片</span></template>
          </button>
          <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            @click="handleInsert('fig1d_anomaly')">
            <template v-if="insertedId === 'fig1d_anomaly'"><Check class="w-3.5 h-3.5 text-white" /><span>已插入论文</span></template>
            <template v-else><FilePlus class="w-3.5 h-3.5" /><span>插入论文</span></template>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
