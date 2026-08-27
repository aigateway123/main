<script setup lang="ts">
import { computed } from 'vue'
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Terminal,
  Activity,
  Cpu,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-vue-next'
import type { ConsoleLogMessage, ResearchPaper, TrainingEpochLog } from '@/data/paper2codeData'

const props = defineProps<{
  paper: ResearchPaper
  trainingLogs: TrainingEpochLog[]
  consoleLogs: ConsoleLogMessage[]
  currentEpoch: number
  maxEpochs: number
  isRunning: boolean
  isCompleted: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
  (e: 'reset'): void
  (e: 'fast-forward'): void
  (e: 'proceed-compare'): void
}>()

const latestLog = computed<TrainingEpochLog>(
  () => props.trainingLogs[props.trainingLogs.length - 1] || {
    epoch: 0,
    train_loss: 0.482,
    val_loss: 0.495,
    test_mse: 0.151,
    test_mae: 0.199,
    learning_rate: 0.0005,
    gpu_mem_mb: 1840,
    time_seconds: 0,
  },
)

const progressPct = computed(() => Math.min(100, Math.round((props.currentEpoch / props.maxEpochs) * 100)))

const consoleColor = (level: string) =>
  level === 'ERROR'
    ? 'text-rose-400'
    : level === 'WARN'
      ? 'text-amber-300'
      : level === 'METRIC'
        ? 'text-emerald-300'
        : level === 'DEBUG'
          ? 'text-slate-500'
          : 'text-cyan-300'

// ------------------------------------------------------- 纯 SVG 损失曲线
const CHART_W = 600
const CHART_H = 240
const PAD = { l: 42, r: 14, t: 14, b: 26 }

function toPoints(series: Array<{ epoch: number; value: number }>, maxEpoch: number, minV: number, maxV: number): string {
  if (series.length === 0) return ''
  const innerW = CHART_W - PAD.l - PAD.r
  const innerH = CHART_H - PAD.t - PAD.b
  const range = maxV - minV || 1
  return series
    .map((p) => {
      const x = PAD.l + (p.epoch / (maxEpoch || 1)) * innerW
      const y = PAD.t + (1 - (p.value - minV) / range) * innerH
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

const chartData = computed(() => {
  const logs = props.trainingLogs
  if (logs.length === 0) return { trainPath: '', valPath: '', testPath: '', gridLines: [], xLabels: [], yLabels: [] }

  const allVals = logs.flatMap((l) => [l.train_loss, l.val_loss, l.test_mse])
  let minV = Math.min(...allVals)
  let maxV = Math.max(...allVals)
  const padV = (maxV - minV) * 0.1 || 0.05
  minV = Math.max(0, minV - padV)
  maxV = maxV + padV

  const trainPath = toPoints(logs.map((l) => ({ epoch: l.epoch, value: l.train_loss })), props.maxEpochs, minV, maxV)
  const valPath = toPoints(logs.map((l) => ({ epoch: l.epoch, value: l.val_loss })), props.maxEpochs, minV, maxV)
  const testPath = toPoints(logs.map((l) => ({ epoch: l.epoch, value: l.test_mse })), props.maxEpochs, minV, maxV)

  const innerW = CHART_W - PAD.l - PAD.r
  const innerH = CHART_H - PAD.t - PAD.b

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = PAD.t + (i / 4) * innerH
    const val = maxV - (i / 4) * (maxV - minV)
    return { y: y.toFixed(1), label: val.toFixed(3) }
  })
  const xLabels = [1, 10, 20, 30, 40, 50]
    .filter((e) => e <= props.maxEpochs)
    .map((e) => ({ x: (PAD.l + (e / props.maxEpochs) * innerW).toFixed(1), label: String(e) }))

  return { trainPath, valPath, testPath, gridLines, xLabels, yLabels: [] }
})
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6 text-slate-300">
    <!-- Top Execution Dashboard Header -->
    <div class="bg-[#161923] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2.5">
          <span
            class="w-3 h-3 rounded-full"
            :class="isRunning ? 'bg-cyan-400 animate-ping' : isCompleted ? 'bg-emerald-400' : 'bg-slate-600'"
          />
          <h1 class="text-base font-bold text-white tracking-tight">实验拟合与模型训练执行器 (Sandbox Experiment Runner)</h1>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          执行指令: <span class="font-mono text-cyan-300">python train.py --data Weather --seq_len {{ paper.experimentPlan.hyperparameters.seq_len }} --pred_len {{ paper.experimentPlan.hyperparameters.pred_len }}</span>
        </p>
      </div>

      <!-- Execution Control Buttons -->
      <div class="flex items-center space-x-2">
        <button
          v-if="!isRunning && !isCompleted"
          @click="emit('start')"
          class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer"
        >
          <Play class="w-3.5 h-3.5 fill-current" />
          <span>开始训练</span>
        </button>

        <button
          v-if="isRunning"
          @click="emit('pause')"
          class="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Pause class="w-3.5 h-3.5 fill-current" />
          <span>暂停</span>
        </button>

        <button
          @click="emit('fast-forward')"
          :disabled="isCompleted"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
          :class="isCompleted
            ? 'bg-white/5 text-slate-600 border-white/5'
            : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'"
          title="直接加速至 50 Epochs 最终收敛状态"
        >
          <FastForward class="w-3.5 h-3.5" />
          <span>极速完成</span>
        </button>

        <button
          @click="emit('reset')"
          class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          title="重置实验"
        >
          <RotateCcw class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Progress & Stat Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
        <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
          <span>训练轮次 (Epoch)</span>
          <span class="font-mono text-cyan-400 font-bold">{{ progressPct }}%</span>
        </div>
        <div class="text-xl font-mono font-bold text-white">
          {{ currentEpoch }} <span class="text-xs text-slate-500 font-normal">/ {{ maxEpochs }}</span>
        </div>
        <div class="w-full bg-black/40 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
          <div
            class="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
            :style="{ width: `${progressPct}%` }"
          />
        </div>
      </div>

      <div class="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
        <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
          <span>当前 Train / Val MSE</span>
          <TrendingDown class="w-3 h-3 text-emerald-400" />
        </div>
        <div class="text-xl font-mono font-bold text-emerald-400">{{ latestLog.val_loss.toFixed(4) }}</div>
        <div class="text-[10px] text-slate-500 mt-1 font-mono">Train Loss: {{ latestLog.train_loss.toFixed(4) }}</div>
      </div>

      <div class="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
        <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
          <span>测试集 Test MSE (H=96)</span>
          <Activity class="w-3 h-3 text-cyan-400" />
        </div>
        <div class="text-xl font-mono font-bold text-cyan-300">{{ latestLog.test_mse.toFixed(3) }}</div>
        <div class="text-[10px] text-slate-500 mt-1">
          原论文目标: <span class="font-mono text-slate-300">{{ paper.reproducedTable2[0].h96_mse.toFixed(3) }}</span>
        </div>
      </div>

      <div class="bg-[#161923] border border-white/10 rounded-xl p-4 shadow-sm">
        <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
          <span>GPU 显存 / 学习率</span>
          <Cpu class="w-3 h-3 text-amber-400" />
        </div>
        <div class="text-xl font-mono font-bold text-slate-200">
          {{ (latestLog.gpu_mem_mb / 1024).toFixed(2) }} <span class="text-xs text-slate-500 font-normal">GB</span>
        </div>
        <div class="text-[10px] text-slate-500 mt-1 font-mono">LR: {{ latestLog.learning_rate.toExponential(1) }}</div>
      </div>
    </div>

    <!-- Completion Banner -->
    <div
      v-if="isCompleted"
      class="bg-[#161923] border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl shadow-emerald-950/20"
    >
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5" />
        </div>
        <div>
          <div class="text-xs font-bold text-emerald-300">实验已顺利完成收敛！(Table 2 全部多步长复现就绪)</div>
          <div class="text-xs text-slate-300 mt-0.5">
            测试集指标 H=96 MSE 达到 {{ paper.reproducedTable2[0].h96_mse.toFixed(3) }}（与论文 {{ paper.paperTable2.find(r => r.isOurs)?.h96_mse.toFixed(3) }} 偏差在 ±1.3% 容差区间内）。
          </div>
        </div>
      </div>

      <button
        @click="emit('proceed-compare')"
        class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <Sparkles class="w-3.5 h-3.5 text-cyan-300" />
        <span>进入结果对比与归因分析</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Chart & Live Terminal Logs Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Loss Curve Chart (纯 SVG) -->
      <div class="bg-[#161923] border border-white/10 rounded-xl p-4 flex flex-col shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-bold text-white flex items-center gap-2">
            <TrendingDown class="w-4 h-4 text-cyan-400" />
            <span>训练损失与验证损失曲线 (Loss Convergence Curve)</span>
          </h2>
          <span class="text-[10px] text-slate-400 font-mono">MSE Loss</span>
        </div>

        <div class="w-full">
          <svg :viewBox="`0 0 ${CHART_W} ${CHART_H}`" class="w-full h-64">
            <!-- Grid lines + y labels -->
            <g v-for="(g, i) in chartData.gridLines" :key="'g' + i">
              <line :x1="PAD.l" :x2="CHART_W - PAD.r" :y1="g.y" :y2="g.y" stroke="#1A1C24" stroke-dasharray="3 3" />
              <text :x="PAD.l - 6" :y="Number(g.y) + 3" fill="#475569" font-size="9" text-anchor="end" font-family="monospace">{{ g.label }}</text>
            </g>
            <!-- X axis labels -->
            <g v-for="(x, i) in chartData.xLabels" :key="'x' + i">
              <text :x="x.x" :y="CHART_H - 8" fill="#475569" font-size="9" text-anchor="middle" font-family="monospace">{{ x.label }}</text>
            </g>
            <text :x="CHART_W - 16" :y="CHART_H - 8" fill="#94a3b8" font-size="10" text-anchor="end">Epoch</text>

            <!-- Data lines -->
            <polyline v-if="chartData.trainPath" :points="chartData.trainPath" fill="none" stroke="#22d3ee" stroke-width="2" />
            <polyline v-if="chartData.valPath" :points="chartData.valPath" fill="none" stroke="#10b981" stroke-width="2" />
            <polyline v-if="chartData.testPath" :points="chartData.testPath" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="4 4" />

            <!-- Empty state -->
            <text v-if="!chartData.trainPath" :x="CHART_W / 2" :y="CHART_H / 2" fill="#475569" font-size="12" text-anchor="middle" font-family="monospace">
              点击「开始训练」启动 50 Epochs 损失拟合…
            </text>
          </svg>

          <!-- Legend -->
          <div class="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-300">
            <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-cyan-400 inline-block" />Train MSE Loss</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-emerald-400 inline-block" />Val MSE Loss</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-violet-400 inline-block border-t-2 border-dotted" style="height:0; border-top:1.5px dashed #a78bfa" />Test MSE (H=96)</span>
          </div>
        </div>
      </div>

      <!-- Right: Live Terminal Console Output -->
      <div class="bg-[#161923] border border-white/10 rounded-xl p-4 flex flex-col shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <Terminal class="w-4 h-4 text-emerald-400" />
            <h2 class="text-xs font-bold text-white">终端实时运行日志 (STDOUT Console)</h2>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5 font-mono">
            PyTorch 2.2 · CUDA 12.1
          </span>
        </div>

        <div class="flex-1 bg-black/50 rounded-lg p-3 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-1 border border-white/5">
          <div v-for="log in consoleLogs" :key="log.id" class="leading-tight">
            <span class="text-slate-600 select-none">[{{ log.timestamp }}] </span>
            <span class="font-semibold" :class="consoleColor(log.level)">[{{ log.level }}] </span>
            <span class="text-slate-200">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
