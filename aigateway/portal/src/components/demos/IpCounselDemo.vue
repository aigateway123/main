<script setup lang="ts">
// ============================================================================
// 知识产权 · AI 知识产权顾问 工作台 Demo 容器（浅色全量移植）
// 对照原型 App.tsx 整体结构：Sidebar → Header → 11 视图 → 新建分析弹窗
// 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/App.tsx
// 视觉：浅色 slate-50 内容区 + 深蓝 #0F172A 侧栏 + blue-600 主色（忠实原型）
// ============================================================================
import { ref } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import type { IpView, AnalysisInput } from '@/data/ipIntelData'
import { DEFAULT_ANALYSIS_INPUT } from '@/data/ipIntelData'
import IpSidebar from './ip/IpSidebar.vue'
import IpHeader from './ip/IpHeader.vue'
import IpHomeView from './ip/IpHomeView.vue'
import IpWorkflowView from './ip/IpWorkflowView.vue'
import IpOverviewView from './ip/IpOverviewView.vue'
import IpSearchView from './ip/IpSearchView.vue'
import IpCompetitorsView from './ip/IpCompetitorsView.vue'
import IpRisksView from './ip/IpRisksView.vue'
import IpLayoutView from './ip/IpLayoutView.vue'
import IpReportView from './ip/IpReportView.vue'
import IpMyPatentsView from './ip/IpMyPatentsView.vue'
import IpRadarView from './ip/IpRadarView.vue'
import IpSettingsView from './ip/IpSettingsView.vue'
import IpNewAnalysisModal from './ip/IpNewAnalysisModal.vue'

// 节点定位：打开工作台时直接进入对应视图（SolutionDetailPage 按 pipeline 节点传入）
const props = withDefaults(
  defineProps<{
    initialView?: IpView
  }>(),
  { initialView: 'home' },
)

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ---- 共享状态中枢（照原型 App.tsx，收敛默认参数为唯一 DEFAULT_ANALYSIS_INPUT） ----
const activeView = ref<IpView>(props.initialView)
const analysisInput = ref<AnalysisInput>({ ...DEFAULT_ANALYSIS_INPUT })
const newAnalysisOpen = ref(false)

const navigate = (view: IpView) => {
  activeView.value = view
}

// HomeView：更新输入 → 跳转执行流；快速查看 → 直接看总览
const updateInput = (input: AnalysisInput) => {
  analysisInput.value = { ...input }
}
const startAnalysis = () => {
  navigate('workflow')
}
const quickDemo = () => {
  navigate('overview')
}

// 执行流跑完 → 自动落到智能总览（照原型 handleWorkflowComplete）
const workflowComplete = () => {
  navigate('overview')
}

// 新建分析提交：更新任务参数并重新走执行流
const submitNewAnalysis = (input: AnalysisInput) => {
  analysisInput.value = { ...input }
  newAnalysisOpen.value = false
  navigate('workflow')
}
</script>

<template>
  <div class="flex h-full min-h-[540px] bg-slate-50 text-slate-900 overflow-hidden">
    <!-- 1. Sidebar 深蓝左导航 -->
    <IpSidebar :active-view="activeView" @select-view="navigate" @open-new-analysis="newAnalysisOpen = true" />

    <!-- 2. 主内容区 -->
    <div class="flex-1 flex flex-col h-full min-w-0">
      <!-- 顶部 Header -->
      <IpHeader
        :current-view="activeView"
        :analysis-input="analysisInput"
        @navigate="navigate"
        @export-report="navigate('report')"
        @open-new-analysis="newAnalysisOpen = true"
      />

      <!-- 3. 主视图分发（11 视图） -->
      <main class="flex-1 overflow-y-auto min-h-0 bg-slate-50">
        <IpHomeView
          v-if="activeView === 'home'"
          :analysis-input="analysisInput"
          @update-input="updateInput"
          @start-analysis="startAnalysis"
          @quick-demo="quickDemo"
        />
        <IpWorkflowView
          v-else-if="activeView === 'workflow'"
          :analysis-input="analysisInput"
          @complete="workflowComplete"
        />
        <IpOverviewView
          v-else-if="activeView === 'overview'"
          :analysis-input="analysisInput"
          @navigate="navigate"
        />
        <IpSearchView v-else-if="activeView === 'search'" />
        <IpCompetitorsView v-else-if="activeView === 'competitors'" />
        <IpRisksView v-else-if="activeView === 'risks'" />
        <IpLayoutView v-else-if="activeView === 'layout'" />
        <IpReportView v-else-if="activeView === 'report'" :analysis-input="analysisInput" />
        <IpMyPatentsView v-else-if="activeView === 'my-patents'" />
        <IpRadarView v-else-if="activeView === 'radar'" />
        <IpSettingsView v-else-if="activeView === 'settings'" />
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

  <!-- 新建分析弹窗（全局，Header / Sidebar 触发） -->
  <IpNewAnalysisModal
    :open="newAnalysisOpen"
    :current-input="analysisInput"
    @close="newAnalysisOpen = false"
    @submit="submitNewAnalysis"
  />
</template>
