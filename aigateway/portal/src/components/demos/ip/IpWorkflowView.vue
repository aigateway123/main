<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/AnalysisWorkflowView.tsx -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { CheckCircle2, FastForward, Loader2 } from 'lucide-vue-next'
import type { AnalysisInput } from '@/data/ipIntelData'
import { buildIpWorkflowSteps } from '@/data/ipIntelData'

const props = defineProps<{ analysisInput: AnalysisInput }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

// 12 步执行清单：随当前任务参数实时生成（勿用写死的默认示例文案）
const steps = computed(() => buildIpWorkflowSteps(props.analysisInput))
const totalSteps = computed(() => steps.value.length)

const currentStepIndex = ref(0)
const progress = ref(8)
const speedMultiplier = ref(1)

// 7 项统计上限（照原型）
const finalCounters = {
  searched: 12846,
  relevant: 1286,
  highRelevant: 328,
  core: 76,
  competitors: 23,
  highRisks: 8,
  opportunities: 17,
}

// 初始值即第 1 步比例，避免挂载后数字跳变
const counters = reactive({
  searched: 1124,
  relevant: 109,
  highRelevant: 42,
  core: 13,
  competitors: 2,
  highRisks: 2,
  opportunities: 2,
})

let tickTimer: ReturnType<typeof setInterval> | undefined
let finishTimeout: ReturnType<typeof setTimeout> | undefined

// 按当前步骤比例插值进度与 7 指标（照原型插值公式）
const syncByStep = (stepIndex: number) => {
  const stepRatio = (stepIndex + 1) / totalSteps.value
  progress.value = Math.round(stepRatio * 100)
  counters.searched = Math.round(finalCounters.searched * Math.min(1, stepRatio * 1.05))
  counters.relevant = Math.round(finalCounters.relevant * Math.min(1, stepRatio * 1.02))
  counters.highRelevant = Math.round(finalCounters.highRelevant * Math.min(1, stepRatio * 0.95 + 0.05))
  counters.core = Math.round(finalCounters.core * Math.min(1, Math.max(0.1, stepRatio * 0.9 + 0.1)))
  counters.competitors = Math.round(finalCounters.competitors * Math.min(1, stepRatio * 1.1))
  counters.highRisks = Math.round(finalCounters.highRisks * Math.min(1, Math.max(0.2, stepRatio)))
  counters.opportunities = Math.round(finalCounters.opportunities * Math.min(1, Math.max(0.1, stepRatio)))
}

const stopTimer = () => {
  if (tickTimer !== undefined) {
    clearInterval(tickTimer)
    tickTimer = undefined
  }
}

// 全部步骤跑完后 500ms 才 emit complete（动画中间态不外发）
const scheduleFinish = () => {
  if (finishTimeout !== undefined) return
  finishTimeout = setTimeout(() => emit('complete'), 500)
}

const tick = () => {
  if (currentStepIndex.value < totalSteps.value - 1) {
    currentStepIndex.value += 1
    syncByStep(currentStepIndex.value)
  } else {
    stopTimer()
    scheduleFinish()
  }
}

const startTimer = () => {
  stopTimer()
  tickTimer = setInterval(tick, 600 / speedMultiplier.value)
}

watch(speedMultiplier, startTimer)
onMounted(() => {
  syncByStep(0)
  startTimer()
})
onBeforeUnmount(() => {
  stopTimer()
  if (finishTimeout !== undefined) clearTimeout(finishTimeout)
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-5 space-y-4">
    <!-- 标题 & 运行状态 -->
    <div class="text-center space-y-1.5">
      <div
        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold"
      >
        <Loader2 class="w-3 h-3 animate-spin" />
        <span>AI Agent 多智能体协同引擎运行中</span>
      </div>
      <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">
        AI正在分析企业知识产权风险
      </h2>
      <p class="text-xs text-slate-500">
        正在比对CNIPA、USPTO及EPO专利数据库，拆解技术特征并构建竞品专利攻防地图
      </p>
    </div>

    <!-- 进度条 & 加速/跳过 -->
    <div class="bg-white rounded-xl border border-slate-200 p-3 shadow-sm space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
          当前执行进度：步骤 {{ Math.min(totalSteps, currentStepIndex + 1) }} / {{ totalSteps }}
        </span>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5" title="播放速度">
            <button
              type="button"
              @click="speedMultiplier = 1"
              :class="speedMultiplier === 1 ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'"
              class="px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors"
            >
              1x
            </button>
            <button
              type="button"
              @click="speedMultiplier = 2"
              :class="speedMultiplier === 2 ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'"
              class="px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors"
            >
              2x
            </button>
          </div>
          <span class="font-mono text-xs font-bold text-blue-600">{{ progress }}%</span>
          <button
            type="button"
            @click="emit('complete')"
            class="text-[11px] text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 cursor-pointer"
            title="跳过动画直接查看分析结果"
          >
            <FastForward class="w-3 h-3" />
            <span>跳过等待</span>
          </button>
        </div>
      </div>

      <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- 实时统计滚动计数（7 指标） -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
      <div class="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
        <span class="text-[10px] font-semibold text-slate-400 block">检索专利</span>
        <span class="text-sm sm:text-base font-extrabold text-slate-900 font-mono mt-0.5 block">{{ counters.searched.toLocaleString() }}</span>
      </div>
      <div class="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
        <span class="text-[10px] font-semibold text-slate-400 block">相关专利</span>
        <span class="text-sm sm:text-base font-extrabold text-blue-600 font-mono mt-0.5 block">{{ counters.relevant.toLocaleString() }}</span>
      </div>
      <div class="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
        <span class="text-[10px] font-semibold text-slate-400 block">高相关专利</span>
        <span class="text-sm sm:text-base font-extrabold text-indigo-600 font-mono mt-0.5 block">{{ counters.highRelevant.toLocaleString() }}</span>
      </div>
      <div class="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
        <span class="text-[10px] font-semibold text-slate-400 block">重点专利</span>
        <span class="text-sm sm:text-base font-extrabold text-slate-800 font-mono mt-0.5 block">{{ counters.core.toLocaleString() }}</span>
      </div>
      <div class="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
        <span class="text-[10px] font-semibold text-slate-400 block">竞争企业</span>
        <span class="text-sm sm:text-base font-extrabold text-purple-600 font-mono mt-0.5 block">{{ counters.competitors.toLocaleString() }}</span>
      </div>
      <div class="p-2 bg-rose-50/40 border border-rose-100 rounded-lg shadow-sm text-center">
        <span class="text-[10px] font-semibold text-rose-600 block">高风险专利</span>
        <span class="text-sm sm:text-base font-extrabold text-rose-600 font-mono mt-0.5 block">{{ counters.highRisks.toLocaleString() }}</span>
      </div>
      <div class="p-2 bg-emerald-50/40 border border-emerald-100 rounded-lg shadow-sm text-center col-span-2 sm:col-span-1">
        <span class="text-[10px] font-semibold text-emerald-600 block">潜在机会</span>
        <span class="text-sm sm:text-base font-extrabold text-emerald-600 font-mono mt-0.5 block">{{ counters.opportunities.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 12 步执行管道细节 -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-4 py-2 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600">
          执行管道细节 (Pipeline Execution)
        </span>
        <span class="text-[10px] text-slate-400 font-mono">
          {{ currentStepIndex + 1 }} / {{ totalSteps }} COMPLETED
        </span>
      </div>

      <div class="p-3 divide-y divide-slate-100">
        <div
          v-for="(step, idx) in steps"
          :key="step.id"
          :class="['py-2 flex items-start gap-3 transition-all', idx === currentStepIndex ? 'bg-blue-50/50 -mx-3 px-3 rounded-lg' : '']"
        >
          <!-- 状态指示 -->
          <div class="shrink-0 mt-0.5">
            <CheckCircle2 v-if="idx < currentStepIndex" class="w-4 h-4 text-emerald-600 animate-in zoom-in-50" />
            <Loader2 v-else-if="idx === currentStepIndex" class="w-4 h-4 text-blue-600 animate-spin" />
            <div
              v-else
              class="w-4 h-4 rounded-full border border-slate-300 bg-slate-100 text-slate-400 text-[9px] font-mono flex items-center justify-center"
            >
              {{ step.id }}
            </div>
          </div>

          <!-- 文案内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <p
                :class="[
                  'text-xs font-semibold',
                  idx < currentStepIndex ? 'text-slate-800' : idx === currentStepIndex ? 'text-blue-700 font-bold' : 'text-slate-400',
                ]"
              >
                {{ step.text }}
              </p>
              <span
                v-if="idx === currentStepIndex"
                class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 animate-pulse"
              >
                进行中
              </span>
            </div>
            <p
              :class="['text-[10px] mt-0.5', idx === currentStepIndex ? 'text-blue-600/80 font-medium' : 'text-slate-400']"
            >
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
