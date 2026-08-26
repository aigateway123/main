<script setup lang="ts">
import { ref } from 'vue'
import { TestTube, ArrowRight, CheckCircle2, Terminal, FlaskConical } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildExperimentData, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<ReturnType<typeof buildExperimentData> | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '构建运行环境', desc: 'Python 依赖 / GPU 驱动 / 数据路径' },
  { title: '执行实验脚本', desc: '批量运行 5 组基线 + 改进模型' },
  { title: '采集实验结果', desc: '记录指标、输出日志与中间产物' },
  { title: '与论文基线比对', desc: '逐项对齐指标并输出差异报告' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildExperimentData(p)
  const r = result.value
  stepLogs.value = [
    [`[repro] 环境构建完成：torch 2.2 + cuda 12.1 + python 3.11`],
    [`[repro] 已执行 ${r.baselines.length} 组基线脚本，全部退出码 0`],
    [`[repro] 实验结果采集完成：MAE / RMSE / R² 已落盘`],
    [`[repro] 与论文报告比对：指标误差 < 2%，全部对齐`],
  ]
}
</script>

<template>
  <NodeDemoShell
    badge="实验复现 节点 · 交互演示"
    title="实验复现 —— 自动跑通与比对"
    desc="构建环境、执行脚本，与论文基线逐项比对并输出复现报告"
    accent="cyan"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
            <TestTube class="w-3.5 h-3.5" />
            实验复现完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">5 组基线全部复现成功</h4>
          <p class="mt-1 text-sm text-slate-500">{{ result.topic }}</p>
        </div>

        <!-- 基线说明表 -->
        <div class="rounded-2xl border border-slate-200 overflow-hidden">
          <div class="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            <FlaskConical class="w-3.5 h-3.5 text-cyan-600" />
            基线方法对照
          </div>
          <table class="w-full text-xs">
            <thead>
              <tr class="text-left text-[10px] text-slate-400 border-b border-slate-100">
                <th class="px-4 py-2 font-semibold">模型</th>
                <th class="px-4 py-2 font-semibold">类别</th>
                <th class="px-4 py-2 font-semibold">优势</th>
                <th class="px-4 py-2 font-semibold">局限</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in result.baselines" :key="b.model" class="border-b border-slate-50 last:border-0">
                <td class="px-4 py-2 font-bold text-slate-800 font-mono">{{ b.model }}</td>
                <td class="px-4 py-2 text-slate-500">{{ b.category }}</td>
                <td class="px-4 py-2 text-slate-600">{{ b.strength }}</td>
                <td class="px-4 py-2 text-slate-500">{{ b.weakness }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 复现结果 -->
        <div class="rounded-2xl border border-slate-200 overflow-hidden">
          <div class="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            <Terminal class="w-3.5 h-3.5 text-cyan-600" />
            复现结果（MAE ↓）
          </div>
          <div class="p-4 space-y-2.5">
            <div v-for="r in result.results" :key="r.model" class="flex items-center gap-3">
              <span class="text-[11px] font-mono font-bold text-slate-700 w-24 shrink-0">{{ r.model }}</span>
              <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                  :style="{ width: Math.max(12, r.score * 1000) + '%' }"
                />
              </div>
              <span class="text-[11px] font-mono font-bold text-slate-700 w-12 text-right">{{ r.score.toFixed(3) }}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 w-10 text-center shrink-0">
                {{ r.verdict }}
              </span>
            </div>
          </div>
        </div>

        <!-- 复现报告 -->
        <div class="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-4 flex items-start gap-2.5">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p class="text-xs text-emerald-900 leading-relaxed">{{ result.report }}</p>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-sky-700 transition-all cursor-pointer"
          >
            复现完成 → 交给 Data Agent
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
