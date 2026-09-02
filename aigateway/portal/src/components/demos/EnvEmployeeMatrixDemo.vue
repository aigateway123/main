<script setup lang="ts">
// ============================================================================
// 环保行业 AI 员工矩阵 Demo 容器（暗色工作台）
// 对照环保原型 App.tsx 整体结构：Navbar → overview / 8 员工页 → PitchGuideModal → Footer
// 转译自：docs/仓库/xx-ai-环保行业-ai-员工产品原型/src/App.tsx
// ============================================================================
import { ref } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import type { EnvEmployeeId } from '@/data/envAgentData'
import EnvNavbar from './envEmployee/EnvNavbar.vue'
import EnvAgentMatrixOverview from './envEmployee/EnvAgentMatrixOverview.vue'
import EnvPitchGuideModal from './envEmployee/EnvPitchGuideModal.vue'
import ComplianceOfficerAgent from './envEmployee/ComplianceOfficerAgent.vue'
import PollutionPermitAgent from './envEmployee/PollutionPermitAgent.vue'
import EnvironmentalReporterAgent from './envEmployee/EnvironmentalReporterAgent.vue'
import BidManagerAgent from './envEmployee/BidManagerAgent.vue'
import EnvironmentalSalesAgent from './envEmployee/EnvironmentalSalesAgent.vue'
import MonitoringAnalystAgent from './envEmployee/MonitoringAnalystAgent.vue'
import HazardousWasteAgent from './envEmployee/HazardousWasteAgent.vue'
import EnterpriseOperationsAgent from './envEmployee/EnterpriseOperationsAgent.vue'

type EnvNavTab = EnvEmployeeId | 'overview'

// 节点定位：打开工作台时直接进入对应员工 / 驾驶舱
const props = withDefaults(
  defineProps<{
    initialEmployee?: EnvEmployeeId | 'overview'
  }>(),
  { initialEmployee: 'overview' },
)

const emit = defineEmits<{ (e: 'handoff'): void }>()

const activeTab = ref<EnvNavTab>(props.initialEmployee)
const isPitchGuideOpen = ref(false)
const pitchGuideDefaultAgent = ref<EnvEmployeeId | undefined>(undefined)

const handleSelectTab = (tab: EnvNavTab) => {
  activeTab.value = tab
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleOpenPitchGuide = (agentId?: EnvEmployeeId) => {
  pitchGuideDefaultAgent.value = agentId ?? (activeTab.value === 'overview' ? undefined : activeTab.value)
  isPitchGuideOpen.value = true
}
</script>

<template>
  <div class="min-h-screen bg-[#0A0C10] text-slate-200 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
    <!-- 顶部导航 -->
    <EnvNavbar
      :active-tab="activeTab"
      @select-tab="handleSelectTab"
      @open-pitch-guide="handleOpenPitchGuide()"
    />

    <!-- 主工作区 -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28">
      <EnvAgentMatrixOverview
        v-if="activeTab === 'overview'"
        @select-agent="handleSelectTab"
        @open-pitch-guide="handleOpenPitchGuide"
      />
      <ComplianceOfficerAgent v-else-if="activeTab === 'compliance'" />
      <PollutionPermitAgent v-else-if="activeTab === 'permit'" />
      <EnvironmentalReporterAgent v-else-if="activeTab === 'reporter'" />
      <BidManagerAgent v-else-if="activeTab === 'bid'" />
      <EnvironmentalSalesAgent v-else-if="activeTab === 'sales'" />
      <MonitoringAnalystAgent v-else-if="activeTab === 'monitoring'" />
      <HazardousWasteAgent v-else-if="activeTab === 'waste'" />
      <EnterpriseOperationsAgent v-else-if="activeTab === 'operations'" />
    </main>

    <!-- 底部 -->
    <footer class="border-t border-slate-800/80 bg-[#0F1218]/90 py-6 text-center text-xs text-slate-400">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="font-bold text-white tracking-tight">AI 环保智能员工矩阵</span>
          </div>
          <span class="text-slate-600">•</span>
          <span class="text-slate-400 text-xs font-mono">v2.4.0 · 系统运行正常</span>
        </div>

        <div class="text-[10px] text-slate-500 flex items-center gap-2 bg-[#0A0C10] px-4 py-1.5 rounded-full border border-slate-800">
          <span class="text-amber-400/80 font-bold">免责提示:</span>
          <span>AI 辅助分析结果与报告底稿供专业参考，最终以现行国家/地方环保法规及工程师核定为准。</span>
        </div>
      </div>
    </footer>

    <!-- 完成此环节，进入下一步 -->
    <button
      class="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white px-4 py-2.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
      @click="emit('handoff')"
    >
      <CheckCircle2 class="w-4 h-4" />
      完成此环节，进入下一步
    </button>

    <!-- 现场销售对客演练指南 -->
    <EnvPitchGuideModal
      :is-open="isPitchGuideOpen"
      :current-agent-id="activeTab"
      :initial-agent-id="pitchGuideDefaultAgent"
      @close="isPitchGuideOpen = false"
      @select-agent="handleSelectTab"
    />
  </div>
</template>
