<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Sparkles, FileCode, Table, BarChart3, LineChart } from 'lucide-vue-next'
import type { ResearchPaper } from '@/data/paper2codeData'

const props = defineProps<{ paper: ResearchPaper }>()

const copiedLatex = ref(false)
const copiedScript = ref(false)
const activeTab = ref<'latex' | 'python'>('latex')

const analysis = computed(() => props.paper.discrepancyAnalysis)

const handleCopyLatex = async () => {
  await navigator.clipboard.writeText(analysis.value.latexTableCode)
  copiedLatex.value = true
  setTimeout(() => (copiedLatex.value = false), 2000)
}

const handleCopyScript = async () => {
  await navigator.clipboard.writeText(pythonPlotScript.value)
  copiedScript.value = true
  setTimeout(() => (copiedScript.value = false), 2000)
}

// ------------------------------------------------------- 纯 SVG 柱状图数据
const HORIZON_KEYS = [
  { key: 'h96_mse', label: 'H=96' },
  { key: 'h192_mse', label: 'H=192' },
  { key: 'h336_mse', label: 'H=336' },
  { key: 'h720_mse', label: 'H=720' },
] as const

const BAR_COLORS = ['#475569', '#64748b', '#0ea5e9', '#f59e0b', '#818cf8', '#22d3ee']

const chartData = computed(() => {
  const rows = props.paper.paperTable2
  const maxVal = Math.max(...rows.flatMap((r) => [r.h96_mse, r.h192_mse, r.h336_mse, r.h720_mse]))

  const W = 720
  const H = 300
  const PAD = { l: 46, r: 10, t: 16, b: 28 }
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b

  const groupW = innerW / HORIZON_KEYS.length
  const barW = Math.min(26, (groupW / rows.length) * 0.72)

  const groups = HORIZON_KEYS.map((h, gi) => {
    const gx = PAD.l + gi * groupW + (groupW - barW * rows.length) / 2
    const bars = rows.map((row, ri) => {
      const v = row[h.key] as number
      const bh = (v / maxVal) * innerH
      return {
        model: row.model,
        value: v,
        x: gx + ri * barW,
        y: PAD.t + innerH - bh,
        w: barW,
        h: bh,
        color: BAR_COLORS[ri % BAR_COLORS.length],
      }
    })
    return { label: h.label, x: gx + (groupW / 2) - 10, bars }
  })

  // 横向网格线 + y 刻度
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = PAD.t + (i / 4) * innerH
    const val = maxVal - (i / 4) * maxVal
    return { y: y.toFixed(1), label: val.toFixed(2) }
  })

  return { groups, gridLines, maxVal }
})

// ------------------------------------------------------- Matplotlib 出图脚本（按论文数据模板化）
const pythonPlotScript = computed(() => {
  const rows = props.paper.paperTable2
  const modelVars = rows.map((r, i) => {
    const varName = r.model.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').toLowerCase() || `model_${i}`
    return { varName, model: r.model, values: [r.h96_mse, r.h192_mse, r.h336_mse, r.h720_mse] }
  })
  const colorList = ['#94a3b8', '#64748b', '#475569', '#f59e0b', '#3b82f6', '#10b981']

  const lines = modelVars.map((m, i) => {
    const vals = m.values.map((v) => v.toFixed(3)).join(', ')
    return `ax.bar(x + (${i - 2.5}) * width, np.array([${vals}]), width, label='${m.model}', color='${colorList[i % colorList.length]}'${i === modelVars.length - 1 ? ", hatch='//'" : ''})`
  })

  return `"""
Publication Figure Generator for Paper Reproduction
Generates IEEE / NeurIPS / ICLR style vector PDF & PNG plots.
"""
import matplotlib.pyplot as plt
import numpy as np

# Set publication style
plt.style.use('seaborn-v0_8-paper' if 'seaborn-v0_8-paper' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 11

horizons = ['H=96', 'H=192', 'H=336', 'H=720']

x = np.arange(len(horizons))
width = 0.13

fig, ax = plt.subplots(figsize=(8, 4.5), dpi=300)
${lines.join('\n')}

ax.set_ylabel('Multivariate MSE Loss (Lower is Better)')
ax.set_title('${props.paper.shortName.replace(/'/g, '')}: Paper Reported vs. Reproduced Comparison across Horizons')
ax.set_xticks(x)
ax.set_xticklabels(horizons)
ax.legend(frameon=True, facecolor='white', framealpha=0.9, loc='upper left')
ax.grid(axis='y', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig('results/figure_reproduction_comparison.pdf', bbox_inches='tight')
plt.savefig('results/figure_reproduction_comparison.png', bbox_inches='tight', dpi=300)
print("[✓] High-res publication plots saved to results/figure_reproduction_comparison.pdf")
`
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6 text-slate-300">
    <!-- Top Banner -->
    <div class="bg-[#161923] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <BarChart3 class="w-4 h-4" />
          </div>
          <h1 class="text-base font-bold text-white tracking-tight">出版级科研图表与 Overleaf LaTeX 代码生成</h1>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          自动将复现数据格式化为顶级会议 (NeurIPS/ICLR/CVPR/IEEE) 标准矢量图与 Booktabs 表格代码。
        </p>
      </div>

      <button
        @click="handleCopyLatex"
        class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer"
      >
        <Check v-if="copiedLatex" class="w-3.5 h-3.5 text-cyan-300" />
        <Copy v-else class="w-3.5 h-3.5" />
        <span>{{ copiedLatex ? '已复制 LaTeX 代码' : '一键复制 LaTeX 表格 (Overleaf)' }}</span>
      </button>
    </div>

    <!-- Visual Chart Card -->
    <div class="bg-[#161923] border border-white/10 rounded-xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-4 gap-3">
        <div>
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <LineChart class="w-4 h-4 text-cyan-400" />
            <span>多预测步长 MSE 对比柱状图 (Multivariate Long-term Forecasting Benchmark)</span>
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">对比基准方法与原论文指标，数值越低（MSE 越小）代表预测精度越高。</p>
        </div>
        <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono shrink-0">
          {{ paper.experimentPlan.datasets[0].name }} Dataset
        </span>
      </div>

      <div class="w-full">
        <svg viewBox="0 0 720 300" class="w-full">
          <!-- Grid lines -->
          <g v-for="(g, i) in chartData.gridLines" :key="'g' + i">
            <line x1="46" x2="710" :y1="g.y" :y2="g.y" stroke="#1A1C24" stroke-dasharray="3 3" />
            <text x="40" :y="Number(g.y) + 3" fill="#64748b" font-size="9" text-anchor="end" font-family="monospace">{{ g.label }}</text>
          </g>

          <!-- Bars -->
          <g v-for="(group, gi) in chartData.groups" :key="'grp' + gi">
            <text :x="group.x" y="294" fill="#64748b" font-size="10" text-anchor="middle" font-family="monospace">{{ group.label }}</text>
            <g v-for="bar in group.bars" :key="bar.model + group.label">
              <rect :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" :fill="bar.color" rx="1.5" opacity="0.9" />
              <title>{{ bar.model }} · {{ group.label }} MSE = {{ bar.value.toFixed(3) }}</title>
            </g>
          </g>

          <text x="20" y="120" fill="#94a3b8" font-size="9" font-family="monospace" transform="rotate(-90 20 120)" text-anchor="middle">MSE</text>
        </svg>

        <!-- Legend -->
        <div class="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 pt-3 text-[11px] text-slate-300">
          <span v-for="(row, i) in paper.paperTable2" :key="row.model" class="flex items-center gap-1.5">
            <span
              class="w-3 h-3 rounded-sm inline-block border border-white/20"
              :style="{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }"
            />
            {{ row.model }}
          </span>
        </div>
      </div>
    </div>

    <!-- Code Export: LaTeX vs Matplotlib Python Script -->
    <div class="bg-[#161923] border border-white/10 rounded-xl overflow-hidden shadow-sm">
      <!-- Tab switcher -->
      <div class="bg-[#0E1018] px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-3">
        <div class="flex items-center space-x-2">
          <button
            @click="activeTab = 'latex'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            :class="activeTab === 'latex'
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'"
          >
            <Table class="w-3.5 h-3.5" />
            <span>LaTeX Table Code (Overleaf)</span>
          </button>

          <button
            @click="activeTab = 'python'"
            class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            :class="activeTab === 'python'
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'"
          >
            <FileCode class="w-3.5 h-3.5" />
            <span>Matplotlib 出图脚本 (Python)</span>
          </button>
        </div>

        <button
          @click="activeTab === 'latex' ? handleCopyLatex() : handleCopyScript()"
          class="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs transition-colors cursor-pointer shrink-0"
        >
          <Check v-if="activeTab === 'latex' ? copiedLatex : copiedScript" class="w-3 h-3 text-emerald-400" />
          <Copy v-else class="w-3 h-3 text-slate-400" />
          <span>{{ activeTab === 'latex' ? (copiedLatex ? '已复制' : '复制 LaTeX') : (copiedScript ? '已复制' : '复制 Python 脚本') }}</span>
        </button>
      </div>

      <!-- Code Content -->
      <div class="p-4 bg-[#0A0B10] font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
        <pre class="whitespace-pre">{{ activeTab === 'latex' ? analysis.latexTableCode : pythonPlotScript }}</pre>
      </div>
    </div>
  </div>
</template>
