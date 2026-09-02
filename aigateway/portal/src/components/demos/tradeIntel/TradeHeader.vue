<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/Header.tsx -->
<script setup lang="ts">
import { Download, HelpCircle, Layers, Sparkles } from 'lucide-vue-next'

defineProps<{
  currentProduct: string
}>()

const emit = defineEmits<{
  (e: 'open-new-task'): void
  (e: 'open-pitch-guide'): void
  (e: 'change-preset', value: string): void
  (e: 'export-all'): void
}>()

const presets = [
  { label: '铝合金门窗 (默认 · 美国/加拿大)', value: 'aluminum_windows' },
  { label: '智能光伏支架 (欧洲/德国)', value: 'solar_brackets' },
  { label: '注塑模具与机械配件 (东南亚)', value: 'injection_molds' },
]

const openNewTask = () => emit('open-new-task')
const openPitchGuide = () => emit('open-pitch-guide')
const exportAll = () => emit('export-all')

const handleChangePreset = (e: Event) => {
  emit('change-preset', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <header
    class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0"
  >
    <!-- Left Title & Status -->
    <div class="flex items-center gap-6">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>AI贸易情报员</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h1>
          <span class="text-xs text-slate-300 font-normal">|</span>
          <span class="text-xs text-blue-600 font-medium hidden sm:inline">全球商业信息智能采集与商机挖掘平台</span>
        </div>
        <div class="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 font-mono">
          <span class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">●</span> 实时海关网络: 142口岸连通
          </span>
          <span class="hidden md:inline text-slate-300">·</span>
          <span class="hidden md:inline">
            全球已索引企业: 1,840,000+
          </span>
        </div>
      </div>

      <!-- Current Scenario Preset Badge -->
      <div class="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs">
        <Layers class="w-3.5 h-3.5 text-blue-600" />
        <span class="text-slate-500 font-medium">当前演示行业:</span>
        <select
          class="bg-transparent text-slate-800 font-semibold text-xs focus:outline-none cursor-pointer"
          value="aluminum_windows"
          @change="handleChangePreset"
        >
          <option v-for="p in presets" :key="p.value" :value="p.value" class="bg-white text-slate-800">
            {{ p.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-2.5">
      <!-- Pitch Guide -->
      <button
        class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium transition-colors cursor-pointer"
        title="3分钟给客户演示的标准话术流程"
        @click="openPitchGuide"
      >
        <HelpCircle class="w-3.5 h-3.5 text-blue-600" />
        <span>演示路演向导</span>
      </button>

      <!-- Export Data Simulation -->
      <button
        class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer shadow-sm"
        title="一键导出全套情报分析报表"
        @click="exportAll"
      >
        <Download class="w-3.5 h-3.5 text-slate-500" />
        <span>导出报告</span>
      </button>

      <!-- Main CTA -->
      <button
        class="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        @click="openNewTask"
      >
        <Sparkles class="w-3.5 h-3.5 text-blue-200" />
        <span>新建采集任务</span>
      </button>
    </div>
  </header>
</template>
