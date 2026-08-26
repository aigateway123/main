<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, ArrowRight, Database, Sparkles, ListChecks } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildDataAnalysisData, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<ReturnType<typeof buildDataAnalysisData> | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '识别数据字段', desc: '自动解析 schema 与字段语义' },
  { title: '数据清洗', desc: '缺失插值 / 异常剔除 / 标准化' },
  { title: '统计分析', desc: '组间差异 / 相关性 / 分布检验' },
  { title: '生成可视化报告', desc: '图表 + 结论自动排版' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildDataAnalysisData(p)
  const d = result.value
  stepLogs.value = [
    [`[data] 已识别 ${d.fields.length} 个字段并完成语义标注`],
    [`[data] 清洗完成：缺失 2.3% 已插值，异常 37 条已剔除`],
    [`[data] 统计检验完成：${d.findings.length} 项显著性结论`],
    [`[data] 可视化报告已生成：${d.bars.length} 组对比图表`],
  ]
}

const TYPE_BADGE: Record<string, string> = {
  datetime: 'bg-blue-50 text-blue-700 border-blue-200',
  categorical: 'bg-amber-50 text-amber-700 border-amber-200',
  numeric: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}
</script>

<template>
  <NodeDemoShell
    badge="Data Agent 节点 · 交互演示"
    title="数据分析 —— 从字段到洞察"
    desc="识别字段、清洗数据、统计分析并生成可视化报告"
    accent="blue"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
            <BarChart3 class="w-3.5 h-3.5" />
            数据分析完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">数据洞察报告已生成</h4>
          <p class="mt-1 text-sm text-slate-500">{{ result.topic }}</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="s in result.stats" :key="s.label" class="rounded-2xl border border-slate-200 p-3.5">
            <div class="text-xs font-bold text-slate-400">{{ s.label }}</div>
            <div class="mt-1 text-xl font-extrabold text-slate-900">{{ s.value }}</div>
            <div class="mt-0.5 text-[10px] text-slate-400">{{ s.sub }}</div>
          </div>
        </div>

        <!-- 字段表 + 可视化 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="rounded-2xl border border-slate-200 p-4">
            <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
              <Database class="w-3.5 h-3.5 text-blue-600" />
              字段识别结果
            </h5>
            <div class="space-y-2">
              <div v-for="f in result.fields" :key="f.name" class="flex items-center gap-2.5">
                <span class="font-mono text-[11px] font-bold text-slate-800 w-24 shrink-0">{{ f.name }}</span>
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0" :class="TYPE_BADGE[f.type]">
                  {{ f.type }}
                </span>
                <span class="text-[11px] text-slate-500 truncate">{{ f.desc }}</span>
              </div>
            </div>
          </div>

          <!-- 柱状图 -->
          <div class="rounded-2xl border border-slate-200 p-4">
            <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
              <BarChart3 class="w-3.5 h-3.5 text-blue-600" />
              分组均值对比
            </h5>
            <div class="space-y-3">
              <div v-for="b in result.bars" :key="b.label">
                <div class="flex items-center justify-between text-[11px] mb-1">
                  <span class="font-semibold text-slate-600">{{ b.label }}</span>
                  <span class="font-mono font-bold text-slate-700">{{ b.value }}%</span>
                </div>
                <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700" :class="b.color" :style="{ width: b.value + '%' }" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结论 -->
        <div class="rounded-2xl border border-slate-200 p-4">
          <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
            <ListChecks class="w-3.5 h-3.5 text-blue-600" />
            统计结论
          </h5>
          <ul class="space-y-1.5">
            <li v-for="(f, i) in result.findings" :key="i" class="flex items-start gap-2 text-xs text-slate-600">
              <Sparkles class="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
              {{ f }}
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
          >
            数据洞察已就绪 → 归档实验结果
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
