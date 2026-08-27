<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, Copy, Check, Table2, Info } from 'lucide-vue-next'
import { GROUP_STATS, type GroupStat } from '@/data/dataAgentData'

const props = defineProps<{ stats?: GroupStat[] }>()
const stats = props.stats ?? GROUP_STATS

const copiedLatex = ref(false)
const showTable = ref(true)

const copyLatexTable = async () => {
  const latex = `\\begin{table}[htbp]
\\centering
\\caption{Performance comparison among experimental groups A, B, and C (Mean $\\pm$ SD, 95\\% CI)}
\\label{tab:group-performance}
\\begin{tabular}{lcccc}
\\hline
\\textbf{Group} & \\textbf{Sample Size (n)} & \\textbf{Performance Mean $\\pm$ SD} & \\textbf{95\\% CI} & \\textbf{Relative Gain} \\\\
\\hline
Group A (Baseline) & 62,140 & $78.4 \\pm 4.8$ & $[77.2, 79.6]$ & Ref. (0.0\\%) \\\\
Group B (Optimized) & 62,140 & $84.7 \\pm 3.9$ & $[83.8, 85.6]$ & $+8.04\\%^{***}$ \\\\
Group C (Enhanced) & 62,140 & $91.2 \\pm 3.1$ & $[90.5, 91.9]$ & $+16.33\\%^{***}$ \\\\
\\hline
\\multicolumn{5}{l}{\\footnotesize $^{***} p < 0.001$ versus baseline, one-way ANOVA with Tukey's HSD test.}
\\end{tabular}
\\end{table}`
  await navigator.clipboard.writeText(latex)
  copiedLatex.value = true
  setTimeout(() => (copiedLatex.value = false), 2000)
}

// ---- SVG 柱状图几何计算 ----
const W = 560
const H = 240
const PAD = { top: 16, right: 12, bottom: 28, left: 40 }
const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom
const Y_MIN = 60
const Y_MAX = 100
const yPos = (v: number) => PAD.top + plotH - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * plotH
const xPos = (i: number) => PAD.left + (plotW / 3) * (i + 0.5)
const BAR_W = 48
const gridLines = [60, 70, 80, 90, 100].map((v) => ({ v, y: yPos(v) }))

const barGeom = stats.map((s, i) => ({
  ...s,
  x: xPos(i) - BAR_W / 2,
  barH: yPos(Y_MIN) - yPos(s.score),
  y: yPos(s.score),
  errY1: yPos(Math.min(s.score + s.stdDev, 100)),
  errY2: yPos(Math.max(s.score - s.stdDev, Y_MIN)),
}))
</script>

<template>
  <section class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
      <div>
        <h3 class="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">实验组性能对比 (Average Score)</h3>
        <p class="text-xs text-[#94a3b8] mt-0.5 pl-3">
          单因素方差分析 F(2, 186417) = 428.6，组间均值呈梯次显著上升 (p &lt; 0.001)
        </p>
      </div>

      <div class="flex items-center gap-2">
        <div class="px-2.5 py-1 rounded bg-black/40 border border-[#1e293b] text-xs text-blue-400 font-mono">
          A: 78.4 | B: 84.7 | <span class="font-bold text-white">C: 91.2</span>
        </div>
        <button
          class="px-2.5 py-1 rounded bg-black/40 hover:bg-[#1e293b] text-slate-300 hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="showTable = !showTable"
        >
          <Table2 class="w-3.5 h-3.5 text-blue-400" />
          <span>{{ showTable ? '收起参数表' : '统计参数表' }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
      <!-- 左侧 / 图表区 -->
      <div class="lg:col-span-7 flex flex-col justify-between">
        <div class="bg-black/40 rounded-xl border border-[#1e293b] p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-3 text-xs">
            <span class="font-semibold text-slate-200 flex items-center gap-1.5">
              <BarChart3 class="w-4 h-4 text-blue-400" /> 组间性能均值对比 (Mean ± SD)
            </span>
            <div class="flex items-center gap-2 text-[10px]">
              <span class="px-2 py-0.5 rounded border border-[#334155] bg-black/30 font-mono text-[#94a3b8]">PDF</span>
              <span class="px-2 py-0.5 rounded border border-[#334155] bg-black/30 font-mono text-[#94a3b8]">SVG</span>
              <span class="text-[#64748b] font-mono">N = 186,420</span>
            </div>
          </div>

          <div class="w-full">
            <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-auto">
              <!-- 网格线 -->
              <g v-for="g in gridLines" :key="g.v">
                <line :x1="PAD.left" :x2="W - PAD.right" :y1="g.y" :y2="g.y" stroke="#1e293b" stroke-dasharray="3 3" />
                <text :x="PAD.left - 8" :y="g.y + 4" text-anchor="end" fill="#64748b" font-size="11" font-family="monospace">{{ g.v }}</text>
              </g>
              <!-- 柱 -->
              <g v-for="b in barGeom" :key="b.group">
                <rect :x="b.x" :y="b.y" :width="BAR_W" :height="b.barH" rx="6"
                  :fill="b.group === 'A' ? 'rgba(59,130,246,0.3)' : b.group === 'B' ? 'rgba(59,130,246,0.6)' : '#3b82f6'"
                  :stroke="b.group === 'A' ? 'rgba(59,130,246,0.6)' : b.group === 'B' ? 'rgba(59,130,246,0.8)' : '#60a5fa'" stroke-width="1.5" />
                <!-- 误差棒 -->
                <line :x1="b.x + BAR_W / 2" :x2="b.x + BAR_W / 2" :y1="b.errY1" :y2="b.errY2" stroke="#94a3b8" stroke-width="2" />
                <line :x1="b.x + BAR_W / 2 - 5" :x2="b.x + BAR_W / 2 + 5" :y1="b.errY1" :y2="b.errY1" stroke="#94a3b8" stroke-width="2" />
                <line :x1="b.x + BAR_W / 2 - 5" :x2="b.x + BAR_W / 2 + 5" :y1="b.errY2" :y2="b.errY2" stroke="#94a3b8" stroke-width="2" />
                <!-- 组标签 -->
                <text :x="b.x + BAR_W / 2" :y="H - 8" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="monospace">Group {{ b.group }}</text>
              </g>
            </svg>
          </div>

          <!-- 数值标签 -->
          <div class="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#1e293b]">
            <div class="p-1.5 rounded bg-black/40 border border-[#1e293b]">
              <div class="text-[10px] text-[#64748b]">Group A</div>
              <div class="text-sm font-mono font-bold text-white">78.4 <span class="text-[10px] text-[#64748b]">±4.8</span></div>
            </div>
            <div class="p-1.5 rounded bg-black/40 border border-[#1e293b]">
              <div class="text-[10px] text-[#64748b]">Group B</div>
              <div class="text-sm font-mono font-bold text-blue-400">84.7 <span class="text-[10px] text-[#64748b]">±3.9</span></div>
            </div>
            <div class="p-1.5 rounded bg-black/40 border border-[#1e293b]">
              <div class="text-[10px] text-[#64748b]">Group C</div>
              <div class="text-sm font-mono font-bold text-emerald-400">91.2 <span class="text-[10px] text-[#64748b]">±3.1</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧 / 统计指标 -->
      <div class="lg:col-span-5 flex flex-col justify-between space-y-3">
        <div class="bg-black/40 rounded-xl border border-[#1e293b] p-4 flex-1">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5" /> 组间统计检验指标 (ANOVA)
            </span>
            <button
              class="text-[10px] text-[#94a3b8] hover:text-white flex items-center gap-1 bg-[#0f172a] px-2 py-1 rounded border border-[#1e293b] transition-colors cursor-pointer"
              title="一键复制 LaTeX 表格代码"
              @click="copyLatexTable"
            >
              <Check v-if="copiedLatex" class="w-3 h-3 text-emerald-400" />
              <Copy v-else class="w-3 h-3" />
              <span>{{ copiedLatex ? '已复制 LaTeX' : '复制 LaTeX 表格' }}</span>
            </button>
          </div>

          <div class="space-y-2 text-xs">
            <div class="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
              <span class="text-[#94a3b8]">组 C 相对提升 (Gain vs A):</span>
              <span class="font-mono font-bold text-emerald-400 text-sm">+16.3% (p &lt; 0.001)</span>
            </div>
            <div class="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
              <span class="text-[#94a3b8]">效应量 (Cohen's d):</span>
              <span class="font-mono font-bold text-white">d = 3.18 (极高效应量)</span>
            </div>
            <div class="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
              <span class="text-[#94a3b8]">方差齐性检验 (Levene):</span>
              <span class="font-mono text-slate-300">W = 1.12 (p = 0.326, 齐性满足)</span>
            </div>
            <div class="p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] flex items-center justify-between">
              <span class="text-[#94a3b8]">事后多重比较 (Tukey HSD):</span>
              <span class="font-mono text-blue-400">A vs B (p&lt;0.001), B vs C (p&lt;0.001)</span>
            </div>
          </div>

          <div class="mt-3 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[11px] text-[#cbd5e1] leading-relaxed">
            <span class="text-blue-400 font-semibold">推断结论：</span> 实验组 C 的均值置信区间无重叠，证实强化体系相较于传统优化（组 B）具有质的跃升，而非单一调参的线性外推。
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
