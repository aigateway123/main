<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, Target, Zap, ArrowRight, Lightbulb, Database, Sparkles } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildInsightData, type InsightData, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<InsightData | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '汇总文献结论', desc: '融合多篇核心文献的关键结论' },
  { title: '识别研究热点', desc: '统计高频方法与主题聚类' },
  { title: '定位研究空白', desc: '交叉比对找出未解决的问题' },
  { title: '输出实验建议', desc: '给出数据集 / 模型 / 评测建议' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildInsightData(p)
  const d = result.value
  stepLogs.value = [
    [`[insight] 已汇总文献结论 ${d.hotSpots.length} 类主题`],
    [`[insight] 研究热点识别完成：${d.hotSpots.join(' / ')}`],
    [`[insight] 定位研究空白：${d.gaps.length} 项尚未被系统性解决`],
    [`[insight] 实验建议已输出（数据集 / 模型 / Baseline / 评估指标）`],
  ]
}
</script>

<template>
  <NodeDemoShell
    badge="Research Insight 节点 · 交互演示"
    title="研究洞察 —— 找到研究空白"
    desc="基于文献调研结论，识别研究热点与空白，为实验设计提供依据"
    accent="amber"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
            <Target class="w-3.5 h-3.5" />
            研究洞察完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">研究空白与实验建议</h4>
        </div>

        <!-- 结论卡 -->
        <div class="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5">
          <div class="flex items-center gap-1.5">
            <Zap class="w-3.5 h-3.5 text-amber-600" />
            <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">洞察结论</span>
          </div>
          <p class="mt-2 text-sm sm:text-base font-bold text-slate-900 leading-relaxed">{{ result.conclusion }}</p>
        </div>

        <!-- 热点 & 空白 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="rounded-2xl border border-slate-200 p-4">
            <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
              <BookOpen class="w-3.5 h-3.5 text-blue-600" />
              研究热点 · Hot Spots
            </h5>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="h in result.hotSpots"
                :key="h"
                class="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
              >
                {{ h }}
              </span>
            </div>
          </div>
          <div class="rounded-2xl border border-slate-200 p-4">
            <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
              <Target class="w-3.5 h-3.5 text-rose-500" />
              研究空白 · Research Gaps
            </h5>
            <ul class="space-y-1.5">
              <li v-for="(g, i) in result.gaps" :key="i" class="flex items-start gap-2 text-xs text-slate-700">
                <span class="mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 text-rose-600 border-rose-200 shrink-0">
                  GAP {{ i + 1 }}
                </span>
                {{ g }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 实验建议 -->
        <div>
          <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
            <Lightbulb class="w-3.5 h-3.5 text-amber-600" />
            实验建议
          </h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="s in result.suggestions"
              :key="s.title"
              class="rounded-2xl border border-slate-200 p-4 hover:border-amber-300 transition-colors"
            >
              <div class="flex items-center gap-1.5">
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                  :class="
                    s.tags[0] === '数据'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : s.tags[0] === '方法'
                      ? 'bg-violet-50 text-violet-700 border-violet-200'
                      : s.tags[0] === '对比'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  "
                >
                  {{ s.tags[0] }}
                </span>
                <span class="text-xs font-bold text-slate-800">{{ s.title }}</span>
              </div>
              <p class="mt-2 text-xs text-slate-600 leading-relaxed">{{ s.desc }}</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
          >
            方向与建议已明确 → 进入 Coding Agent
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
