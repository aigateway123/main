<!-- ============================================================================
     AI 法务员工 · 工作台 Demo 容器（深色全量移植壳层）
     对照原型 App.tsx 整体结构：LegalSidebar → LegalHeader → 12 视图 v-if 分发 → 页脚免责
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/App.tsx
     视觉：全深色工作台 #0A0F1D + slate-900 面板 + blue-600 主色（忠实原型）
     协作契约（供并行创建 legal/ 其余视图的同事对齐）：
       - LegalContractReviewView props: initialContractPreset / reviewDeepLink，
         emits: deep-link-consumed（深链消费后由本容器清空 reviewGate）
       - LegalMyTasksView props: initialTab（'tasks' | 'pending'）
       - 事件命名假定按原型 React 回调去 on 前缀（onSelectContractForReview →
         @select-contract-for-review、onStartReviewContract → @start-review-contract 等），
         若与同事实际 emit 名不一致，最终统一编译阶段由双方同步修正
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import type { EnterpriseProfile, LegalView, ReviewDeepLink } from '@/data/legalIntelData'
import { MOCK_ENTERPRISE_PROFILES } from '@/data/legalMockData'
import LegalSidebar from './legal/LegalSidebar.vue'
import LegalHeader from './legal/LegalHeader.vue'
import LegalDisclaimer from './legal/LegalDisclaimer.vue'
import LegalNewTaskModal from './legal/LegalNewTaskModal.vue'
import LegalHomeView from './legal/LegalHomeView.vue'
import LegalContractReviewView from './legal/LegalContractReviewView.vue'
import LegalContractManagementView from './legal/LegalContractManagementView.vue'
import LegalRegulationSearchView from './legal/LegalRegulationSearchView.vue'
import LegalEnterpriseComplianceView from './legal/LegalEnterpriseComplianceView.vue'
import LegalRiskDashboardView from './legal/LegalRiskDashboardView.vue'
import LegalKnowledgeBaseView from './legal/LegalKnowledgeBaseView.vue'
import LegalReportsView from './legal/LegalReportsView.vue'
import LegalMyTasksView from './legal/LegalMyTasksView.vue'
import LegalHistoryRecordsView from './legal/LegalHistoryRecordsView.vue'
import LegalSettingsView from './legal/LegalSettingsView.vue'

// 节点定位：打开工作台时直接进入对应视图 / 携带合同审查深链
const props = withDefaults(
  defineProps<{
    initialView?: LegalView
    initialReview?: ReviewDeepLink
  }>(),
  { initialView: 'home' },
)

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ---- 共享状态中枢（照原型 App.tsx） ----
const activeView = ref<LegalView>(props.initialView)
const currentEnterprise = ref<EnterpriseProfile>(MOCK_ENTERPRISE_PROFILES[0])
const newTaskOpen = ref(false)
const currentReviewPreset = ref('设备采购合同.pdf')
// 自增 key：重新发起审查（更换范本）时强制重挂载 contract-review 视图
const reviewSessionKey = ref(0)
// 深链门闩：初值来自 initialReview prop；被 contract-review 消费后清空，避免重复触发
const reviewGate = ref<ReviewDeepLink | undefined>(props.initialReview)

const navigate = (view: LegalView) => {
  activeView.value = view
}

// 从首页/合同库/我的任务等发起审查：携带范本文件名则更新 preset 并重挂载
const startReview = (contract?: string) => {
  if (contract) {
    currentReviewPreset.value = contract
    reviewSessionKey.value += 1
  }
  activeView.value = 'contract-review'
}

// legal-risk / history-records 等视图的一键发起（无参，默认设备采购合同）
const startDefaultReview = () => {
  startReview('设备采购合同.pdf')
}

// 新建任务弹窗四选一：review 带范本走 contract-review；其余直跳对应视图并关闭弹窗
const handleSelectAction = (view: LegalView, preset?: string) => {
  if (preset) {
    currentReviewPreset.value = preset
    reviewSessionKey.value += 1
    activeView.value = 'contract-review'
  } else {
    activeView.value = view
  }
  newTaskOpen.value = false
}

// 企业主体切换（影响 header 徽章与合规画像）
const handleSelectEnterprise = (p: EnterpriseProfile) => {
  currentEnterprise.value = p
}

// 深链被 contract-review 消费后清空门闩
const consumeDeepLink = () => {
  reviewGate.value = undefined
}
</script>

<template>
  <div class="flex h-full min-h-[600px] overflow-hidden bg-[#0A0F1D] text-slate-200 font-sans">
    <!-- 1. 左侧深色导航 -->
    <LegalSidebar :active-view="activeView" @select-view="navigate" />

    <!-- 2. 主内容区 -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <!-- 顶部 Header（企业下拉 / 全局搜索 / 通知 / 新建任务） -->
      <LegalHeader
        :current-enterprise="currentEnterprise"
        @open-new-task="newTaskOpen = true"
        @navigate="navigate"
        @select-enterprise="handleSelectEnterprise"
      />

      <!-- 3. 可滚动视图容器（12 视图 v-if 分发，照原型 App.tsx） -->
      <main class="flex-1 overflow-y-auto min-h-0 legal-custom-scrollbar px-4 sm:px-8 py-6">
        <div class="max-w-7xl mx-auto space-y-6">
          <LegalHomeView
            v-if="activeView === 'home'"
            @navigate="navigate"
            @start-review="startReview"
          />

          <LegalContractReviewView
            v-else-if="activeView === 'contract-review'"
            :key="reviewSessionKey"
            :initial-contract-preset="currentReviewPreset"
            :review-deep-link="reviewGate"
            @deep-link-consumed="consumeDeepLink"
          />

          <LegalContractManagementView
            v-else-if="activeView === 'contract-management'"
            @select-contract-for-review="startReview"
          />

          <LegalRegulationSearchView v-else-if="activeView === 'regulation-search'" />

          <LegalEnterpriseComplianceView v-else-if="activeView === 'enterprise-compliance'" />

          <LegalRiskDashboardView
            v-else-if="activeView === 'legal-risk'"
            @start-review="startDefaultReview"
          />

          <LegalKnowledgeBaseView v-else-if="activeView === 'knowledge-base'" />

          <LegalReportsView v-else-if="activeView === 'legal-reports'" />

          <!-- 我的任务：initialTab=tasks -->
          <LegalMyTasksView
            v-else-if="activeView === 'my-tasks'"
            :key="'tasks'"
            initial-tab="tasks"
            @start-review-contract="startReview"
          />

          <!-- 待处理合同：复用 LegalMyTasksView 双 tab 模式（initialTab=pending，照原型） -->
          <LegalMyTasksView
            v-else-if="activeView === 'pending-contracts'"
            :key="'pending'"
            initial-tab="pending"
            @start-review-contract="startReview"
          />

          <LegalHistoryRecordsView
            v-else-if="activeView === 'history-records'"
            @start-review="startDefaultReview"
          />

          <LegalSettingsView v-else-if="activeView === 'settings'" />

          <!-- 视图流结束：页脚法律合规声明（全局一次） -->
          <div class="pt-8 border-t border-slate-800">
            <LegalDisclaimer variant="footer" />
            <div class="text-center text-[11px] text-slate-500 mt-2">
              XX AI · AI法务员工 企业法律风险智能管理系统 · 专业法律科技辅助决策平台 · v3.2.0 Demo
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 完成演示，返回解决方案 -->
    <button
      class="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-xs font-bold text-white px-4 py-2.5 shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
      @click="emit('handoff')"
    >
      <CheckCircle2 class="w-4 h-4" />
      完成演示，返回解决方案
    </button>
  </div>

  <!-- 新建法务任务弹窗（全局，Header 触发） -->
  <LegalNewTaskModal
    :open="newTaskOpen"
    @close="newTaskOpen = false"
    @select-action="handleSelectAction"
  />
</template>

<!-- 全局自定义滚动条（非 scoped，供容器 main 与 Sidebar 导航区等内部滚动容器使用） -->
<style>
.legal-custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.legal-custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.legal-custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 3px;
}
.legal-custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
