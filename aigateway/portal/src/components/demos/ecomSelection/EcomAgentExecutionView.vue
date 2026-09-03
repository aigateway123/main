<script setup lang="ts">
// ============================================================================
// AI Agent 执行视图（转译自选品原型 AiExecutionView.tsx）
//   原型来源：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/agent/AiExecutionView.tsx
//   数据契约：buildEcomAnalysisSteps(taskParams) / TaskInput（见 @/data/ecomIntelData.ts）
//   容器契约：EcomSelectionDemo.vue —— 传入 taskParams，收到 complete 事件后跳转选品报告
// 移植修复：React 副作用计时器改为 Vue onMounted + onBeforeUnmount 清理，避免切换视图后泄漏；
//           步骤动画完成后 800ms 自动 emit('complete')（与原型一致），期间按钮变为「查看选品报告」。
//           步骤文案随 taskParams 实时生成，新建任务后不再残留默认 ¥100k 预算字样。
// ============================================================================
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ArrowRight, CheckCircle2, Cpu, FastForward, Loader2, ShieldCheck } from 'lucide-vue-next'
import type { TaskInput } from '@/data/ecomIntelData'
import { buildEcomAnalysisSteps } from '@/data/ecomIntelData'

const props = defineProps<{ taskParams: TaskInput }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

// ---- 执行步骤：随当前任务参数实时生成（预算/市场/平台/类目不再写死） ----
const steps = computed(() => buildEcomAnalysisSteps(props.taskParams))
const TOTAL_STEPS = steps.value.length

// ---- 执行参数（与原型一致：每步 480ms，12 步总时长约 6.5s） ----
const TICK_INTERVAL = 480

const currentStepIndex = ref(0)
const progress = ref(5)
const finished = ref(false)

interface LiveMetrics {
  products: number
  competitors: number
  reviews: number
  opportunities: number
  highPotential: number
  recommended: number
}

const START_METRICS: LiveMetrics = {
  products: 120,
  competitors: 35,
  reviews: 850,
  opportunities: 3,
  highPotential: 1,
  recommended: 1,
}
const TARGET_METRICS: LiveMetrics = {
  products: 1286,
  competitors: 382,
  reviews: 12846,
  opportunities: 47,
  highPotential: 9,
  recommended: 3,
}

const metrics = reactive<LiveMetrics>({ ...START_METRICS })

const metricCards: { key: keyof LiveMetrics; label: string; unit: string; text: string; border: string }[] = [
  { key: 'products', label: '分析产品', unit: '款', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  { key: 'competitors', label: '分析竞品', unit: '个', text: 'text-blue-400', border: 'border-blue-500/20' },
  { key: 'reviews', label: '分析用户评价', unit: '条', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  { key: 'opportunities', label: '发现产品机会', unit: '个', text: 'text-amber-400', border: 'border-amber-500/20' },
  { key: 'highPotential', label: '高潜产品', unit: '款', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  { key: 'recommended', label: '重点推荐', unit: '款', text: 'text-rose-400', border: 'border-rose-500/20' },
]

let intervalTimer: ReturnType<typeof setInterval> | undefined
let finishTimer: ReturnType<typeof setTimeout> | undefined

const stopTimers = () => {
  if (intervalTimer !== undefined) {
    clearInterval(intervalTimer)
    intervalTimer = undefined
  }
  if (finishTimer !== undefined) {
    clearTimeout(finishTimer)
    finishTimer = undefined
  }
}

const applyFinalMetrics = () => {
  finished.value = true
  progress.value = 100
  metrics.products = TARGET_METRICS.products
  metrics.competitors = TARGET_METRICS.competitors
  metrics.reviews = TARGET_METRICS.reviews
  metrics.opportunities = TARGET_METRICS.opportunities
  metrics.highPotential = TARGET_METRICS.highPotential
  metrics.recommended = TARGET_METRICS.recommended
}

// 每 480ms 推进一步，仪表盘计数按比例向目标值平滑滚动
const tick = () => {
  if (currentStepIndex.value < TOTAL_STEPS - 1) {
    const next = currentStepIndex.value + 1
    currentStepIndex.value = next
    const factor = (next + 1) / TOTAL_STEPS
    progress.value = Math.min(Math.round(factor * 100), 98)
    metrics.products = Math.round(START_METRICS.products + (TARGET_METRICS.products - START_METRICS.products) * factor)
    metrics.competitors = Math.round(START_METRICS.competitors + (TARGET_METRICS.competitors - START_METRICS.competitors) * factor)
    metrics.reviews = Math.round(START_METRICS.reviews + (TARGET_METRICS.reviews - START_METRICS.reviews) * factor)
    metrics.opportunities = Math.round(START_METRICS.opportunities + (TARGET_METRICS.opportunities - START_METRICS.opportunities) * factor)
    metrics.highPotential = Math.min(9, Math.round(1 + (8 * (next + 1)) / TOTAL_STEPS))
    metrics.recommended = Math.min(3, Math.round(1 + (2 * (next + 1)) / TOTAL_STEPS))
    return
  }
  // 最后一步完成：定格终态并稍后自动进入报告页
  stopTimers()
  applyFinalMetrics()
  finishTimer = setTimeout(() => emit('complete'), 800)
}

// 加速完成：立即定格终态并跳转报告
const finishEarly = () => {
  stopTimers()
  applyFinalMetrics()
  emit('complete')
}

const handlePrimaryAction = () => {
  if (finished.value) emit('complete')
  else finishEarly()
}

onMounted(() => {
  intervalTimer = setInterval(tick, TICK_INTERVAL)
})

onBeforeUnmount(stopTimers)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
    <!-- 顶部任务摘要卡片 -->
    <div
      class="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
    >
      <div class="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Loader2 v-if="!finished" class="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <CheckCircle2 v-else class="w-3.5 h-3.5 text-emerald-400" />
            <span>{{ finished ? 'AI Agent 市场情报检索执行完成' : 'AI Agent 正在全力执行市场情报检索' }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI 正在分析{{ taskParams.targetMarket }} {{ taskParams.category }}市场
          </h1>
          <p class="text-xs sm:text-sm text-slate-400">
            平台: <span class="text-white font-medium">{{ taskParams.platform }}</span> ·
            预算: <span class="text-emerald-400 font-mono font-medium">¥{{ taskParams.budget.toLocaleString() }}</span> ·
            毛利门槛: <span class="text-cyan-400 font-mono font-medium">≥{{ taskParams.targetMargin }}%</span>
          </p>
        </div>

        <!-- 加速完成 / 完成后的查看报告按钮 -->
        <button
          class="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition shadow-sm cursor-pointer"
          @click="handlePrimaryAction"
        >
          <FastForward v-if="!finished" class="w-3.5 h-3.5 text-indigo-400" />
          <ArrowRight v-else class="w-3.5 h-3.5 text-emerald-400" />
          <span>{{ finished ? '查看选品报告' : '加速完成 / 直接查看报告' }}</span>
        </button>
      </div>

      <!-- 动态进度条 -->
      <div class="mt-6 space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="font-semibold text-slate-300 flex items-center gap-2">
            <Cpu class="w-4 h-4 text-indigo-400" />
            <span>智能决策引擎执行进度</span>
          </span>
          <span class="font-mono font-bold text-indigo-400 text-sm">{{ progress }}%</span>
        </div>

        <div class="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            class="h-full rounded-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-400 transition-all duration-300 relative shadow-lg shadow-indigo-500/50"
            :style="{ width: `${progress}%` }"
          >
            <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时统计计数器 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div
        v-for="card in metricCards"
        :key="card.key"
        class="bg-slate-900/80 p-4 rounded-xl border text-center space-y-1 shadow-md transition-all"
        :class="card.border"
      >
        <div class="text-[11px] text-slate-400 font-medium">{{ card.label }}</div>
        <div class="text-xl sm:text-2xl font-black font-mono tracking-tight" :class="card.text">
          {{ metrics[card.key].toLocaleString() }}
          <span class="text-[10px] text-slate-400 ml-1 font-normal">{{ card.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 12 步执行清单 & 终端日志 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 步骤清单 -->
      <div class="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>AI 自动化分析工作流拆解 (12 项专业校验)</span>
          </h3>
          <span class="text-[11px] text-slate-400 font-mono">
            完成: {{ Math.min(currentStepIndex + 1, TOTAL_STEPS) }} / {{ TOTAL_STEPS }}
          </span>
        </div>

        <div class="space-y-2.5 max-h-[420px] overflow-y-auto pr-2">
          <div
            v-for="(step, idx) in steps"
            :key="step.id"
            class="flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all duration-300"
            :class="
              idx === currentStepIndex
                ? 'bg-indigo-950/60 border-indigo-500/60 text-white shadow-sm ring-1 ring-indigo-500/40'
                : idx <= currentStepIndex
                  ? 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                  : 'bg-slate-950/20 border-slate-900 text-slate-400 opacity-60'
            "
          >
            <div class="flex items-center gap-2.5">
              <Loader2 v-if="idx === currentStepIndex" class="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              <CheckCircle2 v-else-if="idx <= currentStepIndex" class="w-4 h-4 text-emerald-400 shrink-0" />
              <div v-else class="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
              <span class="font-medium" :class="idx === currentStepIndex ? 'text-indigo-200 font-semibold' : ''">
                {{ step.text }}
              </span>
            </div>
            <span class="text-[11px] font-mono text-slate-400 shrink-0">{{ step.time }}</span>
          </div>
        </div>
      </div>

      <!-- 实时 Agent 日志流 -->
      <div class="lg:col-span-4 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between font-mono text-[11px] text-slate-300">
        <div class="space-y-2">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span class="flex items-center gap-1.5 font-bold text-slate-300">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>AGENT LOG STREAM</span>
            </span>
            <span>LIVE</span>
          </div>

          <div class="space-y-1.5 py-1 text-slate-400">
            <p class="text-emerald-400">&gt; [INFO] Initialized selection query for {{ taskParams.targetMarket }} {{ taskParams.platform }}</p>
            <p>&gt; [FETCH] Parsing Category Node: ID #2619533011</p>
            <p>&gt; [OCR] Tokenizing 12,846 customer reviews for recurring keywords...</p>
            <p v-if="currentStepIndex >= 4" class="text-cyan-400">
              &gt; [NLP] Clustering top buyer pain points: 'Leakage', 'Low Volume', 'Hard Cleaning'
            </p>
            <p v-if="currentStepIndex >= 7" class="text-amber-400">
              &gt; [MATH] Computing FBA Tier fees, tariffs &amp; gross margin sensitivity curve...
            </p>
            <p v-if="currentStepIndex >= 10" class="text-indigo-400">
              &gt; [SCORE] Generating Product Opportunity Scoring Matrix (Weighted 92/100)...
            </p>
          </div>
        </div>

        <div class="mt-4 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div class="text-slate-400">当前正在生成的报告:</div>
          <div class="text-white font-bold">Smart Pet Travel Water Bottle (TOP 1)</div>
          <div class="text-emerald-400">机会得分: 92 / 100 · 重点推荐</div>
        </div>
      </div>
    </div>
  </div>
</template>
