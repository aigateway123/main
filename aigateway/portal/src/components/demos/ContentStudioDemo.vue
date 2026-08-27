<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sun, Bell, CheckCircle2 } from 'lucide-vue-next'
import type { StudioView, StudioAsset, StudioAssetType } from '@/data/contentStudioData'
import { INITIAL_ASSETS } from '@/data/contentStudioData'
import ContentStudioSidebar from './contentStudio/ContentStudioSidebar.vue'
import ContentStudioDashboard from './contentStudio/ContentStudioDashboard.vue'
import ContentStudioRadar from './contentStudio/ContentStudioRadar.vue'
import ContentStudioDissect from './contentStudio/ContentStudioDissect.vue'
import ContentStudioTopics from './contentStudio/ContentStudioTopics.vue'
import ContentStudioGeneration from './contentStudio/ContentStudioGeneration.vue'
import ContentStudioReplies from './contentStudio/ContentStudioReplies.vue'
import ContentStudioDiagnostics from './contentStudio/ContentStudioDiagnostics.vue'
import ContentStudioAssets from './contentStudio/ContentStudioAssets.vue'
import ContentStudioAgentHub from './contentStudio/ContentStudioAgentHub.vue'
import ContentStudioSettings from './contentStudio/ContentStudioSettings.vue'

// 节点定位：打开工作台时直接进入对应视图
const props = withDefaults(defineProps<{ initialView?: StudioView }>(), {
  initialView: 'dashboard',
})

const emit = defineEmits<{ (e: 'handoff'): void }>()

const currentView = ref<StudioView>(props.initialView)
const assets = ref<StudioAsset[]>(JSON.parse(JSON.stringify(INITIAL_ASSETS)))

// 联动状态：选题 → 生成 / 雷达 → 拆解
const pendingTopicTitle = ref('')
const pendingTopicIndustry = ref('')
const pendingUrl = ref('')

const handleNavigate = (view: StudioView) => {
  currentView.value = view
}
const handleNotify = () => window.alert('系统提示: 您目前已挂载1个对练模拟、2次小红书大盘热点追踪任务。运行极度健康。')

const handleAnalyzeUrl = (url: string) => {
  pendingUrl.value = url
  currentView.value = 'dissect'
}

const handleSelectTopicForGeneration = (title: string, industry: string) => {
  pendingTopicTitle.value = title
  pendingTopicIndustry.value = industry
  currentView.value = 'generation'
}

const handleSaveToAssets = (title: string, content: string, category: string, type: StudioAssetType) => {
  const now = new Date().toISOString().substring(0, 10)
  assets.value = [
    { id: `ast-${Date.now()}`, title, content, type, category, tags: ['#智能收录', `#${category}`], createdAt: now },
    ...assets.value,
  ]
}

const handleAddAsset = (data: Omit<StudioAsset, 'id' | 'createdAt'>) => {
  const now = new Date().toISOString().substring(0, 10)
  assets.value = [{ ...data, id: `ast-${Date.now()}`, createdAt: now }, ...assets.value]
}

const handleRemoveAsset = (id: string) => {
  assets.value = assets.value.filter((a) => a.id !== id)
}

// 顶部状态栏：活跃 Agent 数
const activeAgents = computed(() => 8)
</script>

<template>
  <div class="flex h-full min-h-[540px] bg-[#080808] text-[#E0E0E0] select-none overflow-hidden">
    <!-- 左侧导航 -->
    <ContentStudioSidebar :current-view="currentView" @navigate="handleNavigate" />

    <!-- 右侧工作区 -->
    <div class="flex-1 flex flex-col h-full bg-[#0a0a0a] min-w-0">
      <!-- 顶部状态栏 -->
      <header class="h-14 shrink-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1f1f1f] flex items-center justify-between px-5">
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">工作台概览 Workspace</span>
          <span class="h-4 w-px bg-[#262626]"></span>
          <span class="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ activeAgents }}个活跃 Agent 正在为您工作
          </span>
        </div>
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
            <Sun class="w-3.5 h-3.5" />
            系统时间: 2026-06-07 UTC
          </span>
          <button
            class="relative p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all"
            title="大盘消息盒"
            @click="handleNotify"
          >
            <Bell class="w-4 h-4" />
            <span class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          </button>
          <button
            class="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-[11px] font-bold text-white px-3.5 py-1.5 shadow-lg shadow-pink-500/20 cursor-pointer transition-all"
            @click="emit('handoff')"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            完成此环节，进入下一步
          </button>
        </div>
      </header>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-y-auto px-6 md:px-8 py-6 pb-20">
        <!-- Dashboard -->
        <ContentStudioDashboard v-if="currentView === 'dashboard'" @navigate="handleNavigate" />
        <!-- 爆款雷达 -->
        <ContentStudioRadar v-else-if="currentView === 'radar'" @analyze-url="handleAnalyzeUrl" @navigate="handleNavigate" />
        <!-- 爆文拆解 -->
        <ContentStudioDissect v-else-if="currentView === 'dissect'" :initial-url="pendingUrl" @save-to-assets="handleSaveToAssets" />
        <!-- AI 选题工厂 -->
        <ContentStudioTopics v-else-if="currentView === 'topics'" @save-to-assets="handleSaveToAssets" @select-topic-for-generation="handleSelectTopicForGeneration" />
        <!-- 内容生成中心 -->
        <ContentStudioGeneration v-else-if="currentView === 'generation'" :initial-title="pendingTopicTitle" :initial-industry="pendingTopicIndustry" @save-to-assets="handleSaveToAssets" />
        <!-- 评论成交 Agent -->
        <ContentStudioReplies v-else-if="currentView === 'replies'" @save-to-assets="handleSaveToAssets" />
        <!-- 数据诊断中心 -->
        <ContentStudioDiagnostics v-else-if="currentView === 'diagnostics'" @save-to-assets="handleSaveToAssets" />
        <!-- 内容资产库 -->
        <ContentStudioAssets v-else-if="currentView === 'assets'" :assets="assets" @remove="handleRemoveAsset" @add="handleAddAsset" />
        <!-- AI Agent 中心 -->
        <ContentStudioAgentHub v-else-if="currentView === 'agent_hub'" />
        <!-- 系统设置 -->
        <ContentStudioSettings v-else-if="currentView === 'settings'" />
      </main>
    </div>
  </div>
</template>
