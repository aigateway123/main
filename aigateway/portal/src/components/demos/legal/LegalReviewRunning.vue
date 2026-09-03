<!-- ============================================================================
     AI 法务员工 · 合同审查第二阶段：AI 推理执行动画
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/review/ReviewRunningAnimation.tsx
     13 步（REVIEW_STEPS）逐条走查 + 实时累计数字 + 进度条；完成后 emit complete；
     计时器 onMounted + setInterval，onBeforeUnmount 清理；「跳过等待」直接完成
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-vue-next'
import { REVIEW_STEPS } from '@/data/legalIntelData'

const emit = defineEmits<{ (e: 'complete'): void }>()

const STEP_COUNT = REVIEW_STEPS.length

const currentStepIndex = ref(0)
const progress = ref(12)

// 实时累计数字（初始值照原型第 1 步）
const stats = reactive({
  pages: 4,
  clauses: 9,
  keyClauses: 3,
  risks: 2,
  high: 1,
  medium: 1,
  low: 0,
})

let tickTimer: ReturnType<typeof setInterval> | undefined
let finishTimeout: ReturnType<typeof setTimeout> | undefined

const stopTimer = () => {
  if (tickTimer !== undefined) {
    clearInterval(tickTimer)
    tickTimer = undefined
  }
}

// 全部 13 步走查完后 600ms 才 emit complete（照原型 setTimeout 600）
const scheduleFinish = () => {
  if (finishTimeout !== undefined) return
  finishTimeout = setTimeout(() => emit('complete'), 600)
}

// 每步按原型插值公式推进进度与 7 项实时统计
const syncByNextStep = (next: number) => {
  progress.value = Math.min(100, Math.round(((next + 1) / STEP_COUNT) * 100))
  stats.pages = Math.min(18, Math.round(4 + (14 * next) / STEP_COUNT))
  stats.clauses = Math.min(47, Math.round(9 + (38 * next) / STEP_COUNT))
  stats.keyClauses = Math.min(16, Math.round(3 + (13 * next) / STEP_COUNT))
  stats.risks = Math.min(12, Math.round(2 + (10 * next) / STEP_COUNT))
  stats.high = next > 8 ? 3 : next > 4 ? 2 : 1
  stats.medium = next > 10 ? 6 : next > 5 ? 4 : 2
  stats.low = next > 11 ? 3 : next > 7 ? 2 : 1
}

const tick = () => {
  const prev = currentStepIndex.value
  if (prev < STEP_COUNT - 1) {
    const next = prev + 1
    currentStepIndex.value = next
    syncByNextStep(next)
  } else {
    stopTimer()
    scheduleFinish()
  }
}

// 跳过等待：清理计时器后直接完成
const skipWaiting = () => {
  stopTimer()
  if (finishTimeout !== undefined) {
    clearTimeout(finishTimeout)
    finishTimeout = undefined
  }
  emit('complete')
}

onMounted(() => {
  tickTimer = setInterval(tick, 400)
})

onBeforeUnmount(() => {
  stopTimer()
  if (finishTimeout !== undefined) clearTimeout(finishTimeout)
})
</script>

<template>
  <div
    class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300"
  >
    <!-- 标题与状态脉冲 -->
    <div class="text-center space-y-2">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-400 text-xs font-semibold"
      >
        <Loader2 class="w-3.5 h-3.5 animate-spin text-blue-400" />
        <span>AI 法务员工深度推理执行中</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
        AI正在审查合同
      </h2>
      <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
        运用企业级法律知识图谱与条款审查大模型，正在全面扫描合同潜在风险并生成修改示范条款
      </p>
    </div>

    <!-- 进度条 -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-semibold">
        <span class="text-slate-300 flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-blue-400" />
          <span>{{ REVIEW_STEPS[currentStepIndex] }}</span>
        </span>
        <span class="text-blue-400 font-mono">{{ progress }}%</span>
      </div>
      <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300 ease-out shadow-sm shadow-blue-500/50"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- 实时动态统计面板（7 项） -->
    <div
      class="grid grid-cols-3 sm:grid-cols-7 gap-2.5 py-4 px-5 bg-slate-950/60 rounded-xl border border-slate-800 text-center"
    >
      <div>
        <div class="text-[11px] text-slate-400 font-medium">合同页数</div>
        <div class="text-lg font-black text-slate-100 font-mono mt-0.5">{{ stats.pages }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-400 font-medium">识别条款</div>
        <div class="text-lg font-black text-slate-100 font-mono mt-0.5">{{ stats.clauses }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-400 font-medium">关键条款</div>
        <div class="text-lg font-black text-blue-400 font-mono mt-0.5">{{ stats.keyClauses }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-400 font-medium">发现风险</div>
        <div class="text-lg font-black text-slate-100 font-mono mt-0.5">{{ stats.risks }}</div>
      </div>
      <div>
        <div class="text-[11px] text-rose-400 font-medium">高风险</div>
        <div class="text-lg font-black text-rose-400 font-mono mt-0.5">{{ stats.high }}</div>
      </div>
      <div>
        <div class="text-[11px] text-amber-400 font-medium">中风险</div>
        <div class="text-lg font-black text-amber-400 font-mono mt-0.5">{{ stats.medium }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-400 font-medium">低风险</div>
        <div class="text-lg font-black text-slate-300 font-mono mt-0.5">{{ stats.low }}</div>
      </div>
    </div>

    <!-- 13 步走查清单 -->
    <div
      class="border border-slate-800 rounded-xl bg-slate-950/40 p-4 max-h-72 overflow-y-auto space-y-2 legal-custom-scrollbar"
    >
      <div
        v-for="(step, idx) in REVIEW_STEPS"
        :key="idx"
        :class="[
          'flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all',
          idx < currentStepIndex
            ? 'bg-slate-900/80 text-slate-200 font-medium border border-slate-800'
            : idx === currentStepIndex
            ? 'bg-blue-600/15 text-blue-300 font-semibold border border-blue-500/30'
            : 'text-slate-500 opacity-60',
        ]"
      >
        <CheckCircle2 v-if="idx < currentStepIndex" class="w-4 h-4 text-emerald-400 shrink-0" />
        <Loader2 v-else-if="idx === currentStepIndex" class="w-4 h-4 text-blue-400 animate-spin shrink-0" />
        <span v-else class="w-4 h-4 rounded-full border border-slate-700 shrink-0 inline-block" />
        <span>{{ step }}</span>
      </div>
    </div>

    <!-- 跳过等待（演示快捷模式） -->
    <div class="text-center pt-2">
      <button
        type="button"
        @click="skipWaiting"
        class="text-xs text-slate-400 hover:text-slate-200 underline font-medium cursor-pointer transition-colors"
      >
        演示快捷模式：跳过等待直接查看审查结果 &rarr;
      </button>
    </div>
  </div>
</template>
