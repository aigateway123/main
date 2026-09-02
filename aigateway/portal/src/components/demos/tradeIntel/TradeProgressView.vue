<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/AIProgressView.tsx -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cpu,
  FileCheck2,
  Filter,
  Globe2,
  Loader2,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
import { CRAWL_STEPS } from '@/data/tradeIntelData'

const props = defineProps<{ product: string; market: string }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const currentStepIndex = ref(0)
const progressPercent = ref(8)
const speedMultiplier = ref(1)

// Dynamic ticking numbers（上限与原型一致）
const caps = { collected: 1286, identified: 823, qualified: 237, highPotential: 38, keyLeads: 12 }
const stats = ref({ collected: 120, identified: 45, qualified: 12, highPotential: 2, keyLeads: 0 })

const logs = ref<string[]>([
  '▶ [0.1s] 初始化分布式全球数据采集节点...',
  `▶ [0.3s] 加载业务意图分析模型: 目标品类「${props.product}」, 目标市场「${props.market}」`,
])

let timer: ReturnType<typeof setInterval> | undefined
let finishTimeout: ReturnType<typeof setTimeout> | undefined

const stepPercent = computed(() => Math.min(Math.round(((currentStepIndex.value + 1) / CRAWL_STEPS.length) * 100), 100))
const barWidth = computed(() => Math.min(((currentStepIndex.value + 1) / CRAWL_STEPS.length) * 100, 100) + '%')

const scheduleFinish = () => {
  if (finishTimeout) return
  finishTimeout = setTimeout(() => emit('complete'), 1000)
}

const stopTimer = () => {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

const tick = () => {
  if (currentStepIndex.value < CRAWL_STEPS.length - 1) {
    const nextIndex = currentStepIndex.value + 1
    logs.value = [...logs.value.slice(-6), `▶ [${(nextIndex * 0.7).toFixed(1)}s] ${CRAWL_STEPS[nextIndex].log}`]
    currentStepIndex.value = nextIndex
  }

  if (progressPercent.value < 98) {
    progressPercent.value = Math.min(progressPercent.value + Math.floor(Math.random() * 8) + 8, 98)
  }

  const s = stats.value
  stats.value = {
    collected: Math.min(s.collected + Math.floor(Math.random() * 120 + 80), caps.collected),
    identified: Math.min(s.identified + Math.floor(Math.random() * 80 + 50), caps.identified),
    qualified: Math.min(s.qualified + Math.floor(Math.random() * 25 + 15), caps.qualified),
    highPotential: Math.min(s.highPotential + Math.floor(Math.random() * 4 + 3), caps.highPotential),
    keyLeads: Math.min(s.keyLeads + Math.floor(Math.random() * 2 + 1), caps.keyLeads),
  }

  if (progressPercent.value >= 98 && currentStepIndex.value >= CRAWL_STEPS.length - 1) {
    progressPercent.value = 100
    stopTimer()
    scheduleFinish()
  }
}

const startTimer = () => {
  stopTimer()
  timer = setInterval(tick, 700 / speedMultiplier.value)
}

watch(speedMultiplier, startTimer)
onMounted(startTimer)
onBeforeUnmount(() => {
  stopTimer()
  if (finishTimeout !== undefined) clearTimeout(finishTimeout)
})
</script>

<template>
  <div class="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
    <!-- 1. Header Banner -->
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
        <Sparkles class="w-3.5 h-3.5 text-blue-600" />
        <span>AI 自动化商业情报采集与多源交叉清洗引擎</span>
      </div>
      <h2 class="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
        AI正在为你寻找全球潜在客户
      </h2>
      <p class="text-xs text-slate-500 max-w-2xl mx-auto">
        正在从全球公开海关提单、企业官网、行业展会及商业信用库中进行大规模语义解析与商机匹配
      </p>

      <!-- Speed and Skip actions -->
      <div class="flex items-center justify-center gap-3 pt-2">
        <div class="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md p-1 text-xs shadow-sm">
          <span class="text-slate-500 px-2 text-[11px] font-medium">播放速度:</span>
          <button
            @click="speedMultiplier = 1"
            :class="speedMultiplier === 1 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'"
            class="px-2 py-0.5 rounded text-xs font-mono cursor-pointer"
          >
            1.0x
          </button>
          <button
            @click="speedMultiplier = 2"
            :class="speedMultiplier === 2 ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'"
            class="px-2 py-0.5 rounded text-xs font-mono cursor-pointer"
          >
            2.0x (加速)
          </button>
        </div>

        <button
          @click="emit('complete')"
          class="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Zap class="w-3.5 h-3.5 text-blue-200" />
          <span>跳过等待 · 直接查看结果</span>
        </button>
      </div>
    </div>

    <!-- 2. Dynamic Live Data Counter Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>已采集企业</span>
          <Globe2 class="w-4 h-4 text-slate-400" />
        </div>
        <div class="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
          {{ stats.collected.toLocaleString() }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">海量公开多源数据源</div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>已识别企业</span>
          <Building2 class="w-4 h-4 text-blue-600" />
        </div>
        <div class="mt-2 text-2xl font-extrabold text-blue-600 font-mono">
          {{ stats.identified.toLocaleString() }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">完成官网语义解析</div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
        <div class="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>符合条件企业</span>
          <Filter class="w-4 h-4 text-blue-600" />
        </div>
        <div class="mt-2 text-2xl font-extrabold text-blue-700 font-mono">
          {{ stats.qualified.toLocaleString() }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1">匹配目标产品线</div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between shadow-sm bg-gradient-to-b from-white to-emerald-50/30">
        <div class="flex items-center justify-between text-emerald-800 text-xs font-semibold">
          <span>高潜客户 (A级)</span>
          <Sparkles class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
          {{ stats.highPotential }}
        </div>
        <div class="text-[10px] text-emerald-700 mt-1 font-medium">具备高合作意愿</div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-amber-200 flex flex-col justify-between shadow-sm bg-gradient-to-b from-white to-amber-50/30 col-span-2 sm:col-span-1">
        <div class="flex items-center justify-between text-amber-800 text-xs font-semibold">
          <span>重点客户 (S级)</span>
          <TrendingUp class="w-4 h-4 text-amber-600" />
        </div>
        <div class="mt-2 text-2xl font-extrabold text-amber-600 font-mono">
          {{ stats.keyLeads }}
        </div>
        <div class="text-[10px] text-amber-700 mt-1 font-medium">推荐优先开发</div>
      </div>
    </div>

    <!-- 3. Execution Pipeline & Terminal Logs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: 10 Milestone Steps -->
      <div class="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Cpu class="w-4 h-4 text-blue-600" />
            <span>实时执行工作流 (10项全自动分析节点)</span>
          </h3>
          <span class="text-xs font-mono font-bold text-blue-600">
            {{ stepPercent }}%
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-600 transition-all duration-300" :style="{ width: barWidth }"></div>
        </div>

        <!-- Step items -->
        <div class="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          <div
            v-for="(step, idx) in CRAWL_STEPS"
            :key="idx"
            :class="[
              'p-3 rounded-lg border transition-all',
              idx < currentStepIndex
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : idx === currentStepIndex
                  ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-400',
            ]"
          >
            <div class="flex items-start gap-3">
              <div class="mt-0.5 shrink-0">
                <CheckCircle2 v-if="idx < currentStepIndex" class="w-4 h-4 text-emerald-600" />
                <Loader2 v-else-if="idx === currentStepIndex" class="w-4 h-4 text-blue-600 animate-spin" />
                <div
                  v-else
                  class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-mono"
                >
                  {{ idx + 1 }}
                </div>
              </div>

              <div class="space-y-0.5 flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h4
                    :class="idx === currentStepIndex ? 'text-blue-900' : idx < currentStepIndex ? 'text-slate-800' : 'text-slate-400'"
                    class="text-xs font-semibold"
                  >
                    {{ step.title }}
                  </h4>
                  <span
                    v-if="idx === currentStepIndex"
                    class="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono font-semibold"
                  >
                    PROCESSING
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 leading-snug">
                  {{ step.detail }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Live Terminal Log Stream -->
      <div class="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <Terminal class="w-4 h-4 text-emerald-400" />
              <span class="text-xs font-bold text-slate-200">AI 实时采集控制台</span>
            </div>
            <span class="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ACTIVE STREAM
            </span>
          </div>

          <!-- Terminal Window -->
          <div class="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 h-[260px] overflow-y-auto">
            <div class="text-slate-500 text-[10px] pb-1 border-b border-slate-800 font-mono">
              XX-TRADE-INTELLIGENCE v4.8 [NODE: US-WEST-01 / SG-HUB]
            </div>
            <div v-for="(log, i) in logs" :key="i" class="text-emerald-400/90 leading-relaxed break-words">
              {{ log }}
            </div>
            <div class="flex items-center gap-1 text-blue-400 animate-pulse">
              <span>❯</span>
              <span class="w-2 h-4 bg-blue-400 inline-block"></span>
            </div>
          </div>
        </div>

        <!-- Bottom Card Summary -->
        <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <FileCheck2 class="w-4 h-4 text-blue-400" />
            <span>预计完成：正在生成最终客户情报</span>
          </div>
          <button
            @click="emit('complete')"
            class="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-xs cursor-pointer"
          >
            <span>查看结果</span>
            <ArrowRight class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
