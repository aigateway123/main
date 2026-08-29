<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle2, Sparkles } from 'lucide-vue-next'
import type { StepKey, TenderAnalysisResult, CompanyProfile } from '@/data/bidConsultantData'
import { STEP_ORDER, SAMPLE_TENDERS, SAMPLE_COMPANY_PROFILES } from '@/data/bidConsultantData'
import Navbar from './bidConsultant/Navbar.vue'
import StepNavigation from './bidConsultant/StepNavigation.vue'
import StepOverview from './bidConsultant/StepOverview.vue'
import StepQualification from './bidConsultant/StepQualification.vue'
import StepRisks from './bidConsultant/StepRisks.vue'
import StepEvaluation from './bidConsultant/StepEvaluation.vue'
import StepStrategy from './bidConsultant/StepStrategy.vue'
import StepCapabilityMatrix from './bidConsultant/StepCapabilityMatrix.vue'
import StepCombatTasks from './bidConsultant/StepCombatTasks.vue'
import StepProposalOutline from './bidConsultant/StepProposalOutline.vue'
import StepHealthCheck from './bidConsultant/StepHealthCheck.vue'
import StepFinalReport from './bidConsultant/StepFinalReport.vue'
import TenderInputModal from './bidConsultant/TenderInputModal.vue'
import CompanyProfileModal from './bidConsultant/CompanyProfileModal.vue'
import AIConsultantDrawer from './bidConsultant/AIConsultantDrawer.vue'

// 节点定位：打开工作台时直接进入对应步骤
const props = withDefaults(defineProps<{ initialStep?: StepKey }>(), {
  initialStep: 'overview',
})

const emit = defineEmits<{ (e: 'handoff'): void }>()

const allTenders = ref<Record<string, TenderAnalysisResult>>(JSON.parse(JSON.stringify(SAMPLE_TENDERS)))
const activeTenderId = ref<string>('smart-city-it')
const activeStep = ref<StepKey>(props.initialStep)
const activeCompany = ref<CompanyProfile>(JSON.parse(JSON.stringify(SAMPLE_COMPANY_PROFILES.it_company)))

const isUploadModalOpen = ref(false)
const isCompanyModalOpen = ref(false)
const isChatOpen = ref(false)

const currentTender = computed<TenderAnalysisResult>(
  () => allTenders.value[activeTenderId.value] || SAMPLE_TENDERS['smart-city-it'],
)

const handleNextStep = () => {
  const index = STEP_ORDER.indexOf(activeStep.value)
  if (index < STEP_ORDER.length - 1) {
    activeStep.value = STEP_ORDER[index + 1]
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handlePrevStep = () => {
  const index = STEP_ORDER.indexOf(activeStep.value)
  if (index > 0) {
    activeStep.value = STEP_ORDER[index - 1]
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleNewTenderAnalyzed = (tender: TenderAnalysisResult) => {
  allTenders.value = { ...allTenders.value, [tender.id]: tender }
  activeTenderId.value = tender.id
  activeStep.value = 'overview'
}

const handleSelectPreset = (id: string) => {
  activeTenderId.value = id
  // 根据项目行业联动企业画像，增强代入感
  if (id.includes('medical')) {
    activeCompany.value = JSON.parse(JSON.stringify(SAMPLE_COMPANY_PROFILES.medical_company))
  } else if (id.includes('construction')) {
    activeCompany.value = JSON.parse(JSON.stringify(SAMPLE_COMPANY_PROFILES.construction_company))
  } else {
    activeCompany.value = JSON.parse(JSON.stringify(SAMPLE_COMPANY_PROFILES.it_company))
  }
  activeStep.value = 'overview'
}

const handleSelectStep = (step: StepKey) => {
  activeStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
    <!-- 顶部导航 -->
    <Navbar
      :current-tender="currentTender"
      :all-tenders="allTenders"
      :active-company="activeCompany"
      :is-chat-open="isChatOpen"
      @select-tender="handleSelectPreset"
      @open-upload-modal="isUploadModalOpen = true"
      @open-company-modal="isCompanyModalOpen = true"
      @toggle-chat="isChatOpen = !isChatOpen"
    />

    <!-- 10 步流程条 -->
    <StepNavigation :active-step="activeStep" :tender-data="currentTender" @select-step="handleSelectStep" />

    <!-- 主工作区 -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
      <StepOverview v-if="activeStep === 'overview'" :overview="currentTender.overview" @next-step="handleNextStep" />
      <StepQualification
        v-else-if="activeStep === 'qualification'"
        :qualifications="currentTender.qualifications"
        @next-step="handleNextStep"
        @prev-step="handlePrevStep"
      />
      <StepRisks v-else-if="activeStep === 'risks'" :risks="currentTender.risks" @next-step="handleNextStep" @prev-step="handlePrevStep" />
      <StepEvaluation
        v-else-if="activeStep === 'evaluation'"
        :scores="currentTender.evaluationScores"
        @next-step="handleNextStep"
        @prev-step="handlePrevStep"
      />
      <StepStrategy v-else-if="activeStep === 'strategy'" :strategy="currentTender.strategy" @next-step="handleNextStep" @prev-step="handlePrevStep" />
      <StepCapabilityMatrix
        v-else-if="activeStep === 'matrix'"
        :matrix="currentTender.capabilityMatrix"
        :active-company="activeCompany"
        @open-company-modal="isCompanyModalOpen = true"
        @next-step="handleNextStep"
        @prev-step="handlePrevStep"
      />
      <StepCombatTasks v-else-if="activeStep === 'tasks'" :tasks="currentTender.combatTasks" @next-step="handleNextStep" @prev-step="handlePrevStep" />
      <StepProposalOutline
        v-else-if="activeStep === 'proposal'"
        :outline="currentTender.proposalOutline"
        :overview="currentTender.overview"
        @next-step="handleNextStep"
        @prev-step="handlePrevStep"
      />
      <StepHealthCheck v-else-if="activeStep === 'healthCheck'" :health-check="currentTender.healthCheck" @next-step="handleNextStep" @prev-step="handlePrevStep" />
      <StepFinalReport v-else-if="activeStep === 'report'" :report="currentTender.finalReport" :overview="currentTender.overview" @prev-step="handlePrevStep" />
    </main>

    <!-- 底部 -->
    <footer class="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 mt-6">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
          <span class="font-semibold text-slate-700">AI 投标作战指挥中心</span>
          <span>• 中小企业招投标全流程实战决策与控险平台</span>
        </div>
        <span>严格对齐《中华人民共和国招标投标法》与《政府采购法》规范</span>
      </div>
    </footer>

    <!-- 完成此环节，进入下一步 -->
    <button
      class="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs font-bold text-white px-4 py-2.5 shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
      @click="emit('handoff')"
    >
      <CheckCircle2 class="w-4 h-4" />
      完成此环节，进入下一步
    </button>

    <!-- 上传 / 导入弹窗 -->
    <TenderInputModal
      :is-open="isUploadModalOpen"
      :active-company="activeCompany"
      @close="isUploadModalOpen = false"
      @analyze-success="handleNewTenderAnalyzed"
      @select-preset="handleSelectPreset"
    />

    <!-- 企业档案弹窗 -->
    <CompanyProfileModal
      :is-open="isCompanyModalOpen"
      :active-company="activeCompany"
      @close="isCompanyModalOpen = false"
      @select-company="activeCompany = $event"
    />

    <!-- AI 顾问对话抽屉 -->
    <AIConsultantDrawer :is-open="isChatOpen" :tender-data="currentTender" @close="isChatOpen = false" />
  </div>
</template>
