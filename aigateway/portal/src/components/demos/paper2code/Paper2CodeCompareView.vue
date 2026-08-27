<script setup lang="ts">
import { computed } from 'vue'
import {
  Scale,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Table,
  ShieldCheck,
} from 'lucide-vue-next'
import type { ResearchPaper } from '@/data/paper2codeData'

const props = defineProps<{ paper: ResearchPaper }>()

const emit = defineEmits<{
  (e: 'proceed-charts'): void
  (e: 'ask-supervisor', query: string): void
}>()

const analysis = computed(() => props.paper.discrepancyAnalysis)
const paperTable = computed(() => props.paper.paperTable2)
const reproRow = computed(() => props.paper.reproducedTable2[0])
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6 text-slate-300">
    <!-- Top Banner: Scientific Reproduction Score -->
    <div class="bg-gradient-to-r from-indigo-950/60 via-[#161923] to-[#161923] border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start space-x-3.5">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center space-x-2 flex-wrap">
            <h1 class="text-base font-bold text-white tracking-tight">科研实验复现对比与归因分析报告 (Table 2 vs Reproduced)</h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              可复现性评分: {{ analysis.overallMatchScore }}%
            </span>
          </div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">{{ analysis.summary }}</p>
        </div>
      </div>

      <button
        @click="emit('proceed-charts')"
        class="self-start md:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer"
      >
        <span>生成论文图表 & LaTeX</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Main Benchmark Comparison Table -->
    <div class="bg-[#161923] border border-white/10 rounded-xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <Table class="w-4 h-4 text-cyan-400" />
          <h2 class="text-sm font-bold text-white">{{ paper.experimentPlan.targetTable }} 对比总览</h2>
        </div>
        <span class="text-[11px] text-slate-400">* 绿色高亮行表示本次 Agent 自动复现结果</span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-white/10">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="bg-[#0E1018] text-slate-300 border-b border-white/10 text-[11px] uppercase tracking-wider">
              <th class="py-2.5 px-3 font-semibold">Model / Method</th>
              <th colspan="2" class="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">Horizon 96</th>
              <th colspan="2" class="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">Horizon 192</th>
              <th colspan="2" class="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">Horizon 336</th>
              <th colspan="2" class="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-cyan-300">Horizon 720</th>
              <th colspan="2" class="py-2.5 px-2 text-center border-l border-white/10 font-semibold text-emerald-400">Average</th>
            </tr>
            <tr class="bg-[#0A0B10] text-slate-400 border-b border-white/10 text-[10px] font-mono">
              <th class="py-1 px-3"></th>
              <th class="py-1 px-2 text-center border-l border-white/10">MSE</th>
              <th class="py-1 px-2 text-center">MAE</th>
              <th class="py-1 px-2 text-center border-l border-white/10">MSE</th>
              <th class="py-1 px-2 text-center">MAE</th>
              <th class="py-1 px-2 text-center border-l border-white/10">MSE</th>
              <th class="py-1 px-2 text-center">MAE</th>
              <th class="py-1 px-2 text-center border-l border-white/10">MSE</th>
              <th class="py-1 px-2 text-center">MAE</th>
              <th class="py-1 px-2 text-center border-l border-white/10 font-bold text-slate-300">MSE</th>
              <th class="py-1 px-2 text-center font-bold text-slate-300">MAE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 font-mono text-[11px]">
            <tr
              v-for="(row, idx) in paperTable"
              :key="idx"
              class="hover:bg-white/5 transition-colors"
              :class="row.isOurs ? 'bg-indigo-950/30 font-semibold text-indigo-200' : 'text-slate-300'"
            >
              <td class="py-2 px-3 font-sans font-medium text-white">
                <span class="flex items-center gap-1.5">
                  <span v-if="row.isOurs" class="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {{ row.model }}
                </span>
              </td>
              <td class="py-2 px-2 text-center border-l border-white/5">{{ row.h96_mse.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center">{{ row.h96_mae.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center border-l border-white/5">{{ row.h192_mse.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center">{{ row.h192_mae.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center border-l border-white/5">{{ row.h336_mse.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center">{{ row.h336_mae.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center border-l border-white/5">{{ row.h720_mse.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center">{{ row.h720_mae.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center border-l border-white/5 font-bold text-white">{{ row.avg_mse.toFixed(3) }}</td>
              <td class="py-2 px-2 text-center font-bold text-white">{{ row.avg_mae.toFixed(3) }}</td>
            </tr>

            <!-- Reproduced Ours Row -->
            <tr v-if="reproRow" class="bg-cyan-950/30 border-t-2 border-cyan-400 font-semibold text-cyan-200">
              <td class="py-2.5 px-3 font-sans font-bold text-white">
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {{ reproRow.model }}
                </span>
              </td>
              <td class="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300 font-bold">{{ reproRow.h96_mse.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center text-cyan-300">{{ reproRow.h96_mae.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300">{{ reproRow.h192_mse.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center text-cyan-300">{{ reproRow.h192_mae.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300">{{ reproRow.h336_mse.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center text-cyan-300">{{ reproRow.h336_mae.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center border-l border-white/5 text-cyan-300">{{ reproRow.h720_mse.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center text-cyan-300">{{ reproRow.h720_mae.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center border-l border-white/5 font-bold text-cyan-300">{{ reproRow.avg_mse.toFixed(3) }}</td>
              <td class="py-2.5 px-2 text-center font-bold text-cyan-300">{{ reproRow.avg_mae.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid: Delta Tolerances & Deep Discrepancy Diagnostics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Per-Metric Delta Tolerances -->
      <div class="space-y-4">
        <div class="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-3 shadow-sm">
          <h3 class="text-xs font-bold text-white flex items-center gap-1.5">
            <Scale class="w-4 h-4 text-cyan-400" />
            <span>细分步长误差偏差容限 (Delta Analysis)</span>
          </h3>

          <div class="space-y-2 text-xs">
            <div
              v-for="(m, i) in analysis.metricsComparison"
              :key="i"
              class="bg-[#0A0B10] p-2.5 rounded-lg border border-white/5 flex items-center justify-between"
            >
              <div>
                <div class="font-semibold text-slate-200">{{ m.metric }}</div>
                <div class="text-[10px] text-slate-500 font-mono">原论文: {{ m.paperVal }} | 复现: {{ m.reproVal }}</div>
              </div>
              <div class="text-right">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  +{{ m.deltaPercent }}%
                </span>
                <div class="text-[9px] text-emerald-400/80 mt-0.5">置信区间内</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 2 Cols: Root-Cause Diagnostics -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Lightbulb class="w-4 h-4 text-amber-400" />
              <h3 class="text-sm font-bold text-white">差异成因深度归因 (Root-Cause Discrepancy Diagnostics)</h3>
            </div>
            <span class="text-[11px] text-slate-400 font-mono">AI 科研诊断结论</span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(reason, idx) in analysis.reasons"
              :key="idx"
              class="bg-[#0A0B10] border border-white/5 hover:border-cyan-400/30 rounded-xl p-4 transition-all"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-semibold text-xs text-white flex items-center gap-1.5">
                  <span class="w-4 h-4 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center">{{ idx + 1 }}</span>
                  {{ reason.factor }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-semibold border"
                  :class="reason.probability === 'High'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/5 text-slate-400 border-white/10'"
                >
                  相关度: {{ reason.probability }}
                </span>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed mb-2.5">{{ reason.explanation }}</p>

              <div class="bg-[#161923] border border-white/10 rounded-lg p-2.5 text-[11px] text-cyan-300 flex items-start space-x-2">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div><span class="font-semibold text-slate-200">优化与收敛建议: </span>{{ reason.recommendation }}</div>
              </div>
            </div>
          </div>

          <!-- Interactive Supervisor Call -->
          <div class="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs gap-3">
            <span class="text-slate-300">需要针对上述成因调整实验参数或运行消融实验？</span>
            <button
              @click="emit('ask-supervisor', '按照诊断建议，帮我优化 config.yaml 消除这 1.3% 的微小偏差')"
              class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-105 cursor-pointer shrink-0"
            >
              智能优化超参
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
