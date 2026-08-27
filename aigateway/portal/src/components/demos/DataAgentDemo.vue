<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { FileSpreadsheet, CheckCircle2, RefreshCw, ArrowUp } from 'lucide-vue-next'
import type { AgentStep, DatasetMeta } from '@/data/dataAgentData'
import { AGENT_STEPS, DEFAULT_DATASET } from '@/data/dataAgentData'
import DataUploaderSection from './dataAgent/DataUploaderSection.vue'
import AgentWorkflowSection from './dataAgent/AgentWorkflowSection.vue'
import DataOverviewSection from './dataAgent/DataOverviewSection.vue'
import GroupComparisonSection from './dataAgent/GroupComparisonSection.vue'
import AnomalyDetectionSection from './dataAgent/AnomalyDetectionSection.vue'
import AiInsightsSection from './dataAgent/AiInsightsSection.vue'
import ChartsGridSection from './dataAgent/ChartsGridSection.vue'
import AnalysisReportSection from './dataAgent/AnalysisReportSection.vue'
import DataPaperWritingModal from './dataAgent/DataPaperWritingModal.vue'

const emit = defineEmits<{ (e: 'handoff'): void }>()

// 结果归档节点复用时，打开弹窗自动滚动到「学术级完整分析报告」
const props = withDefaults(defineProps<{ autoScrollToReport?: boolean }>(), {
  autoScrollToReport: false,
})

const currentDataset = ref<DatasetMeta>(DEFAULT_DATASET)
const analysisGoal = ref('比较实验组 A、B、C 的性能差异，寻找异常样本，并生成适合论文使用的分析图表。')
const steps = ref<AgentStep[]>(AGENT_STEPS.map((s) => ({ ...s, status: 'completed' })))
const currentStepIndex = ref(0)
const isAnalyzing = ref(false)
const hasAnalyzed = ref(true)
const isPaperModalOpen = ref(false)
const showScrollTop = ref(false)
const resultsRef = ref<HTMLElement | null>(null)
const reportRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

let stepTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  steps.value = AGENT_STEPS.map((s) => ({ ...s, status: 'completed' }))
  const el = scrollRef.value
  if (el) el.addEventListener('scroll', handleScroll, { passive: true })
  if (props.autoScrollToReport) {
    nextTick(() => {
      setTimeout(() => {
        reportRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    })
  }
})

onBeforeUnmount(() => {
  if (stepTimer) clearInterval(stepTimer)
  scrollRef.value?.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  const el = scrollRef.value
  if (el) showScrollTop.value = el.scrollTop > 400
}

const startAnalysis = () => {
  isAnalyzing.value = true
  hasAnalyzed.value = false
  steps.value = AGENT_STEPS.map((s) => ({ ...s, status: 'pending' }))
  currentStepIndex.value = 0

  if (stepTimer) clearInterval(stepTimer)
  let idx = 0
  stepTimer = setInterval(() => {
    if (idx < steps.value.length) {
      currentStepIndex.value = idx
      steps.value = steps.value.map((s, i) => {
        if (i < idx) return { ...s, status: 'completed' }
        if (i === idx) return { ...s, status: 'running' }
        return { ...s, status: 'pending' }
      })
      idx++
    } else {
      if (stepTimer) clearInterval(stepTimer)
      steps.value = AGENT_STEPS.map((s) => ({ ...s, status: 'completed' }))
      isAnalyzing.value = false
      hasAnalyzed.value = true
      setTimeout(() => resultsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }, 350)
}

const handleReset = () => {
  steps.value = AGENT_STEPS.map((s) => ({ ...s, status: 'pending' }))
  hasAnalyzed.value = false
  isAnalyzing.value = false
  if (stepTimer) clearInterval(stepTimer)
}

const scrollToTop = () => {
  scrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div ref="scrollRef" class="min-h-[80vh] max-h-[86vh] overflow-y-auto bg-[#050505] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
    <!-- 顶部 Header -->
    <header class="border-b border-[#1e293b] bg-[#050505] sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              科研数据分析 <span class="text-blue-500">Agent</span>
            </h1>
          </div>
          <p class="text-[#94a3b8] text-xs sm:text-sm">从原始实验数据到科研洞察，让 AI 自动完成数据分析</p>
        </div>

        <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div class="text-left sm:text-right">
            <p class="text-[10px] uppercase tracking-widest text-blue-400 font-semibold">System Status</p>
            <p class="text-xs font-mono text-slate-300">Analysis Engine v2.4.0</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#1e293b] text-xs text-slate-300">
              <FileSpreadsheet class="w-3.5 h-3.5 text-blue-400" />
              <span class="font-mono text-xs text-white">{{ currentDataset.fileName }}</span>
              <span v-if="hasAnalyzed" class="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 class="w-3 h-3" /> 就绪
              </span>
              <span v-if="isAnalyzing" class="inline-flex items-center gap-1 text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30 animate-pulse">
                <RefreshCw class="w-3 h-3 animate-spin" /> 计算中
              </span>
            </div>
            <button v-if="hasAnalyzed" class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-slate-400 hover:text-white border border-[#1e293b] transition-colors cursor-pointer"
              @click="handleReset">重置</button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <DataUploaderSection
        :dataset="currentDataset"
        :goal="analysisGoal"
        :is-analyzing="isAnalyzing"
        :has-analyzed="hasAnalyzed"
        @select-dataset="(ds) => { currentDataset = ds; startAnalysis() }"
        @goal-change="analysisGoal = $event"
        @start-analysis="startAnalysis"
      />

      <AgentWorkflowSection
        :steps="steps"
        :current-step-index="currentStepIndex"
        :is-analyzing="isAnalyzing"
        :has-analyzed="hasAnalyzed"
      />

      <div v-if="hasAnalyzed || isAnalyzing" ref="resultsRef" class="space-y-8 transition-opacity duration-300">
        <DataOverviewSection :dataset="currentDataset" />
        <GroupComparisonSection />
        <AnomalyDetectionSection />
        <AiInsightsSection />
        <ChartsGridSection @insert-to-paper="isPaperModalOpen = true" />
        <div ref="reportRef" class="scroll-mt-20">
          <AnalysisReportSection @open-paper="isPaperModalOpen = true" />
        </div>
      </div>
    </main>

    <footer class="mt-12 border-t border-[#1e293b] bg-[#050505] py-6 text-center text-xs text-[#64748b]">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>科研数据分析 Agent · 自动化科研数据流与学术制图系统</span>
        <span class="font-mono text-[#94a3b8]">Excel → Clean → Anomaly Detection → Publication Charts → Results</span>
      </div>
    </footer>

    <DataPaperWritingModal :open="isPaperModalOpen" :dataset-name="currentDataset.fileName" @close="isPaperModalOpen = false" />

    <button v-if="showScrollTop"
      class="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-blue-400 border border-[#1e293b] shadow-xl transition-all hover:scale-110 cursor-pointer"
      title="返回顶部"
      @click="scrollToTop">
      <ArrowUp class="w-4 h-4" />
    </button>
  </div>
</template>
