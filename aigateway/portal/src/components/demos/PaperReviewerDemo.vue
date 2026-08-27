<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { CheckCircle2, ArrowRight } from 'lucide-vue-next'
import {
  PRESET_EXPERIMENT,
  INITIAL_PAPER_DATA,
  INITIAL_REVIEW_REPORT,
  type WorkflowStep,
  type ExperimentProject,
  type PaperData,
  type ReviewReport,
} from '@/data/paperAgentData'
import PaperAgentHeader from './paperAgent/PaperAgentHeader.vue'
import PaperAgentProgressModal from './paperAgent/PaperAgentProgressModal.vue'
import PaperAgentExportModal from './paperAgent/PaperAgentExportModal.vue'
import PaperAgentExperimentView from './paperAgent/PaperAgentExperimentView.vue'
import PaperAgentPaperView from './paperAgent/PaperAgentPaperView.vue'
import PaperAgentReviewerView from './paperAgent/PaperAgentReviewerView.vue'

const emit = defineEmits<{ (e: 'handoff'): void }>()

// 节点复用时定位：final-paper 节点直接进入论文正文页
const props = withDefaults(defineProps<{ initialView?: 'experiment' | 'paper' }>(), {
  initialView: 'experiment',
})

// ------------------------------------------------------------ 工作流状态机
const currentStep = ref<WorkflowStep>(props.initialView === 'paper' ? 'paper' : 'experiment')
const experiment = ref<ExperimentProject>({ ...PRESET_EXPERIMENT })
const paperData = ref<PaperData>(INITIAL_PAPER_DATA)
const reviewReport = ref<ReviewReport>(INITIAL_REVIEW_REPORT)

// 工作流进度 flags
const hasGeneratedPaper = ref(props.initialView === 'paper')
const hasReviewed = ref(false)
const hasAppliedAblation = ref(false)
const hasAppliedStats = ref(false)
const hasAppliedUnits = ref(false)
const hasAppliedReferences = ref(false)

// 弹窗 & UI 状态
const isGeneratingModalOpen = ref(false)
const isReviewingInProgress = ref(false)
const isExportModalOpen = ref(false)
const serifMode = ref(false)

let reviewTimer: ReturnType<typeof setTimeout> | null = null

onBeforeUnmount(() => {
  if (reviewTimer) clearTimeout(reviewTimer)
})

// ------------------------------------------------------------ 生成论文
const handleStartGeneration = () => {
  isGeneratingModalOpen.value = true
}

const handleGenerationComplete = () => {
  isGeneratingModalOpen.value = false
  hasGeneratedPaper.value = true
  currentStep.value = 'paper'
}

// ------------------------------------------------------------ 启动 AI 审稿
const handleStartReview = () => {
  currentStep.value = 'reviewer'
  isReviewingInProgress.value = true
  hasReviewed.value = true
  if (reviewTimer) clearTimeout(reviewTimer)
  reviewTimer = setTimeout(() => {
    isReviewingInProgress.value = false
  }, 2800)
}

// ------------------------------------------------------------ 修改闭环
const handleApplyAblation = () => {
  hasAppliedAblation.value = true
  paperData.value = {
    ...paperData.value,
    version: 'v1.1.0 (With Ablation Study)',
  }
}

const handleApplyStats = () => {
  hasAppliedStats.value = true
}

const handleApplyUnits = () => {
  hasAppliedUnits.value = true
}

const handleApplyReferences = () => {
  hasAppliedReferences.value = true
  paperData.value = {
    ...paperData.value,
    references: paperData.value.references.map((r) => ({
      ...r,
      text: r.text.includes('doi:') ? r.text : `${r.text} doi: 10.1109/TSG.2026.${1000000 + r.id}`,
    })),
  }
}

const handleApplyAllRevisions = () => {
  handleApplyAblation()
  handleApplyStats()
  handleApplyUnits()
  handleApplyReferences()
}

// ------------------------------------------------------------ 重置
const handleReset = () => {
  paperData.value = INITIAL_PAPER_DATA
  reviewReport.value = INITIAL_REVIEW_REPORT
  hasGeneratedPaper.value = false
  hasReviewed.value = false
  hasAppliedAblation.value = false
  hasAppliedStats.value = false
  hasAppliedUnits.value = false
  hasAppliedReferences.value = false
  currentStep.value = 'experiment'
  isExportModalOpen.value = false
  isReviewingInProgress.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    <!-- 顶部 Header 与闭环工作流导航 -->
    <PaperAgentHeader
      :current-step="currentStep"
      :has-generated-paper="hasGeneratedPaper"
      :has-reviewed="hasReviewed"
      :has-applied-ablation="hasAppliedAblation"
      :serif-mode="serifMode"
      @select-step="currentStep = $event"
      @open-export="isExportModalOpen = true"
      @reset="handleReset"
      @toggle-serif="serifMode = !serifMode"
    />

    <!-- 主内容区 -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      <PaperAgentExperimentView
        v-if="currentStep === 'experiment'"
        :experiment="experiment"
        :is-generating="isGeneratingModalOpen"
        :has-generated-paper="hasGeneratedPaper"
        @generate-paper="handleStartGeneration"
        @view-paper="currentStep = 'paper'"
      />

      <PaperAgentPaperView
        v-else-if="currentStep === 'paper'"
        :paper-data="paperData"
        :experiment="experiment"
        :serif-mode="serifMode"
        :has-applied-ablation="hasAppliedAblation"
        :has-applied-stats="hasAppliedStats"
        :has-applied-units="hasAppliedUnits"
        :has-applied-references="hasAppliedReferences"
        @start-review="handleStartReview"
        @open-export="isExportModalOpen = true"
      />

      <PaperAgentReviewerView
        v-else-if="currentStep === 'reviewer' || currentStep === 'revision'"
        :review-report="reviewReport"
        :is-reviewing="isReviewingInProgress"
        :has-applied-ablation="hasAppliedAblation"
        :has-applied-stats="hasAppliedStats"
        :has-applied-units="hasAppliedUnits"
        :has-applied-references="hasAppliedReferences"
        @apply-ablation="handleApplyAblation"
        @apply-stats="handleApplyStats"
        @apply-units="handleApplyUnits"
        @apply-references="handleApplyReferences"
        @apply-all="handleApplyAllRevisions"
        @go-to-paper="currentStep = 'paper'"
      />
    </main>

    <!-- 8 步论文生成动画 -->
    <PaperAgentProgressModal
      :is-open="isGeneratingModalOpen"
      @complete="handleGenerationComplete"
      @close="isGeneratingModalOpen = false"
    />

    <!-- 导出论文弹窗 -->
    <PaperAgentExportModal
      :is-open="isExportModalOpen"
      :paper-data="paperData"
      :experiment="experiment"
      :has-applied-ablation="hasAppliedAblation"
      @close="isExportModalOpen = false"
    />

    <!-- 完成演示 → 流转到下一节点 -->
    <div
      v-if="currentStep === 'reviewer' || currentStep === 'revision'"
      class="fixed bottom-6 right-6 z-[60]"
    >
      <button
        @click="emit('handoff')"
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-cyan-400 transition"
      >
        <CheckCircle2 v-if="hasReviewed" class="w-4 h-4" />
        <span>完成演示，进入下一步</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
