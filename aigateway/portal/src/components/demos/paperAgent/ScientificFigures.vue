<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck } from 'lucide-vue-next'

// ------------------------------------------------------------------ Figure 1：24h 负荷曲线（纯 SVG）

withDefaults(defineProps<{ showConfidenceInterval?: boolean }>(), {
  showConfidenceInterval: true,
})

const hoverIndex = ref<number | null>(null)

// 24 hours of data points (00:00 to 23:00)
const hours = Array.from({ length: 24 }, (_, i) => i)

const groundTruth = [42, 35, 28, 25, 29, 48, 85, 142, 185, 172, 160, 168, 175, 162, 155, 170, 210, 285, 320, 295, 230, 165, 110, 65]
const transformerPred = [43, 36, 29, 26, 30, 49, 82, 139, 182, 170, 162, 169, 174, 160, 156, 172, 208, 282, 318, 292, 228, 163, 108, 66]
const lstmPred = [48, 41, 35, 30, 32, 42, 70, 120, 160, 158, 150, 155, 160, 148, 142, 155, 185, 240, 265, 250, 205, 145, 95, 58]

const ciUpper = transformerPred.map((v) => v + 12.5)
const ciLower = transformerPred.map((v) => Math.max(10, v - 12.5))

const width = 640
const height = 300
const padding = { top: 35, right: 30, bottom: 45, left: 55 }
const plotWidth = width - padding.left - padding.right
const plotHeight = height - padding.top - padding.bottom
const maxVal = 360
const minVal = 0

const getX = (hour: number) => padding.left + (hour / 23) * plotWidth
const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight

const makePath = (data: number[]) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d)}`).join(' ')

const makeAreaPath = (upper: number[], lower: number[]) => {
  const forward = upper.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d)}`).join(' ')
  const backward = lower.map((d, i) => `L ${getX(lower.length - 1 - i)} ${getY(lower[lower.length - 1 - i])}`).join(' ')
  return `${forward} ${backward} Z`
}
</script>

<template>
  <div class="bg-slate-900 border border-slate-700/80 rounded-xl p-4 shadow-md text-slate-100">
    <!-- Header / Caption Bar -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-semibold rounded border border-blue-500/30">Figure 1</span>
        <span class="font-medium text-slate-200">24小时多步长电动汽车充电负荷曲线：预测值 vs 真实值对比</span>
      </div>
      <span v-if="showConfidenceInterval" class="flex items-center gap-1 text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>95% 阴影置信区间 (5次随机种子 CI)</span>
      </span>
    </div>

    <!-- SVG Canvas -->
    <div class="relative mt-3">
      <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="paperAgentCiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.05" />
          </linearGradient>
          <linearGradient id="paperAgentPeakHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        <g v-for="val in [0, 100, 200, 300]" :key="val">
          <line :x1="padding.left" :y1="getY(val)" :x2="width - padding.right" :y2="getY(val)" stroke="#334155" stroke-dasharray="3 3" stroke-width="1" />
          <text :x="padding.left - 8" :y="getY(val) + 4" fill="#94a3b8" font-size="10" text-anchor="end" font-family="monospace">{{ val }} kW</text>
        </g>

        <!-- Peak hour shaded zone (17:00 - 21:00) -->
        <rect :x="getX(17)" :y="padding.top" :width="getX(21) - getX(17)" :height="plotHeight" fill="url(#paperAgentPeakHighlight)" />
        <text :x="getX(19)" :y="padding.top + 14" fill="#f87171" font-size="10" font-weight="bold" text-anchor="middle">
          晚高峰用电激增区 (分时动态电价调控)
        </text>

        <!-- X Axis Ticks -->
        <g v-for="hour in [0, 4, 8, 12, 16, 20, 23]" :key="hour">
          <line :x1="getX(hour)" :y1="padding.top + plotHeight" :x2="getX(hour)" :y2="padding.top + plotHeight + 5" stroke="#64748b" stroke-width="1" />
          <text :x="getX(hour)" :y="padding.top + plotHeight + 18" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="monospace">
            {{ `${String(hour).padStart(2, '0')}:00` }}
          </text>
        </g>

        <!-- Confidence interval area -->
        <path v-if="showConfidenceInterval" :d="makeAreaPath(ciUpper, ciLower)" fill="url(#paperAgentCiGrad)" />

        <!-- LSTM curve (orange dashed) -->
        <path :d="makePath(lstmPred)" fill="none" stroke="#fb923c" stroke-width="2" stroke-dasharray="5 4" opacity="0.85" />
        <!-- Ground truth curve (white solid) -->
        <path :d="makePath(groundTruth)" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
        <!-- Proposed Transformer curve (cyan solid) -->
        <path :d="makePath(transformerPred)" fill="none" stroke="#38bdf8" stroke-width="3" />

        <!-- Data point dots & hover targets -->
        <g v-for="h in hours" :key="h" class="cursor-pointer" @mouseenter="hoverIndex = h" @mouseleave="hoverIndex = null">
          <circle :cx="getX(h)" :cy="getY(transformerPred[h])" :r="hoverIndex === h ? 6 : 3" fill="#38bdf8" stroke="#0f172a" stroke-width="2" class="transition-all duration-150" />
          <circle :cx="getX(h)" :cy="getY(groundTruth[h])" :r="hoverIndex === h ? 5 : 2.5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
          <rect :x="getX(h) - plotWidth / 48" :y="padding.top" :width="plotWidth / 24" :height="plotHeight" fill="transparent" />
        </g>
      </svg>

      <!-- Dynamic Tooltip on Hover -->
      <div v-if="hoverIndex !== null" class="absolute top-2 right-4 bg-slate-950/95 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs space-y-1 pointer-events-none z-10">
        <div class="font-mono font-bold text-slate-300 border-b border-slate-800 pb-1">时刻: {{ `${String(hoverIndex).padStart(2, '0')}:00` }}</div>
        <div class="flex items-center justify-between gap-4 text-emerald-400">
          <span>真实值 (Ground Truth):</span>
          <span class="font-mono font-bold">{{ groundTruth[hoverIndex] }} kW</span>
        </div>
        <div class="flex items-center justify-between gap-4 text-cyan-400">
          <span>ST-Trans (本文提出):</span>
          <span class="font-mono font-bold">{{ transformerPred[hoverIndex] }} kW</span>
        </div>
        <div class="flex items-center justify-between gap-4 text-amber-400">
          <span>LSTM 基准模型:</span>
          <span class="font-mono font-bold">{{ lstmPred[hoverIndex] }} kW</span>
        </div>
        <div class="text-[10px] text-slate-400 pt-0.5">
          误差绝对值: 本文模型 {{ Math.abs(transformerPred[hoverIndex] - groundTruth[hoverIndex]) }} kW vs LSTM {{ Math.abs(lstmPred[hoverIndex] - groundTruth[hoverIndex]) }} kW
        </div>
      </div>
    </div>

    <!-- Legend & Stats Summary -->
    <div class="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <div class="w-3.5 h-0.5 bg-slate-100 rounded" />
          <span class="text-slate-300">实际真实负荷 (Ground Truth)</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3.5 h-1 bg-cyan-400 rounded" />
          <span class="text-cyan-300 font-medium">ST-Transformer (本文提出)</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3.5 h-0.5 border-b-2 border-dashed border-amber-400" />
          <span class="text-amber-300">LSTM 基准模型</span>
        </div>
      </div>
      <div class="text-[11px] text-slate-400 font-mono">
        高峰负荷: <span class="text-white font-bold">320 kW</span> · 峰值误差 MAE: <span class="text-cyan-400 font-bold">2.1 kW</span>
      </div>
    </div>
  </div>
</template>
