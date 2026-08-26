<script setup lang="ts">
import { ref } from 'vue'
import { PenLine, MessageSquareText, RotateCcw, Award, ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildReviewData, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<ReturnType<typeof buildReviewData> | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '论文初稿提交', desc: '整合全链路成果为论文初稿' },
  { title: '模拟同行评审', desc: '多视角审稿意见生成' },
  { title: '意见修正闭环', desc: '逐条修订并回填证据' },
  { title: '终审评分', desc: '四维评分与录用建议' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildReviewData(p)
  const r = result.value
  stepLogs.value = [
    [`[reviewer] 论文初稿已提交，进入同行评审队列`],
    [`[reviewer] 生成审稿意见 ${r.comments.length} 条，涉及方法 / 实验 / 复现`],
    [`[reviewer] 修改意见已逐条闭环并回填修订记录`],
    [`[reviewer] 终审完成：${r.verdict}`],
  ]
}

const SCORE_COLORS = ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500']
</script>

<template>
  <NodeDemoShell
    badge="Reviewer Agent 节点 · 交互演示"
    title="论文评审 —— 模拟同行评审"
    desc="对论文初稿执行多轮评审，输出审稿意见、评分与修改闭环"
    accent="rose"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
            <Award class="w-3.5 h-3.5" />
            评审完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">同行评审意见与评分</h4>
          <p class="mt-1 text-sm text-slate-500">{{ result.topic }}</p>
        </div>

        <!-- 评审意见 -->
        <div class="space-y-3">
          <div
            v-for="c in result.comments"
            :key="c.id"
            class="rounded-2xl border border-slate-200 p-4 flex items-start gap-3 hover:border-rose-300 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[11px] font-extrabold text-rose-600 shrink-0">
              {{ c.id }}
            </div>
            <div>
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">审稿人 {{ c.id }} 意见</div>
              <p class="mt-1 text-xs text-slate-700 leading-relaxed">{{ c.text }}</p>
            </div>
          </div>
        </div>

        <!-- 评分 -->
        <div class="rounded-2xl border border-slate-200 p-4">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
            <MessageSquareText class="w-3.5 h-3.5 text-rose-500" />
            四维终审评分
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div v-for="(s, i) in result.scores" :key="s.label">
              <div class="flex items-center justify-between text-[11px] mb-1">
                <span class="font-semibold text-slate-600">{{ s.label }}</span>
                <span class="font-mono font-bold text-slate-800">{{ s.value }} <span class="text-slate-300">/ 100</span></span>
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :class="SCORE_COLORS[i]" :style="{ width: s.value + '%' }" />
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">{{ s.hint }}</div>
            </div>
          </div>
        </div>

        <!-- 结论 -->
        <div class="rounded-2xl bg-rose-50/60 border border-rose-200 p-4 flex items-center gap-2.5">
          <CheckCircle2 class="w-4 h-4 text-rose-600 shrink-0" />
          <p class="text-xs text-rose-900 font-semibold">{{ result.verdict }}</p>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700 transition-all cursor-pointer"
          >
            评审通过 → 输出最终论文
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
