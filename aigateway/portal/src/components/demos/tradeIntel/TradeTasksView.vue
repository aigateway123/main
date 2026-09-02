<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/TaskCenterView.tsx -->
<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2, ChevronRight, History, RotateCcw, Settings, Star } from 'lucide-vue-next'
import type { CompanyLead, TaskHistoryItem } from '@/data/tradeIntelData'
import { mockLeads, mockTaskHistory } from '@/data/tradeIntelData'

const emit = defineEmits<{
  (e: 'select-lead', lead: CompanyLead): void
  (e: 'rerun-task', product: string, market: string): void
}>()

const tab = ref<'history' | 'starred' | 'settings'>('history')
const starredLeads = mockLeads.filter((l) => l.isStarred)

const handleSelectLead = (lead: CompanyLead) => {
  emit('select-lead', lead)
}

const handleRerunTask = (task: TaskHistoryItem) => {
  emit('rerun-task', task.product, task.market)
}
</script>

<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-900 tracking-tight">任务与收藏中心</h2>
      <p class="text-xs text-slate-500 mt-1">
        管理历史采集任务、重点关注客户档案及 AI 采集规则配置
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
      <button
        @click="tab = 'history'"
        :class="tab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'"
        class="px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
      >
        <History class="w-3.5 h-3.5" />
        <span>历史采集任务 ({{ mockTaskHistory.length }})</span>
      </button>

      <button
        @click="tab = 'starred'"
        :class="tab === 'starred' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'"
        class="px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
      >
        <Star class="w-3.5 h-3.5" />
        <span>重点客户收藏夹 ({{ starredLeads.length }})</span>
      </button>

      <button
        @click="tab = 'settings'"
        :class="tab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'"
        class="px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
      >
        <Settings class="w-3.5 h-3.5" />
        <span>AI采集与评分偏好设置</span>
      </button>
    </div>

    <!-- Tab 1: History -->
    <div v-if="tab === 'history'" class="space-y-2.5">
      <div
        v-for="task in mockTaskHistory"
        :key="task.id"
        class="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-900">{{ task.product }}</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {{ task.market }}
            </span>
            <span class="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
              <CheckCircle2 class="w-3 h-3 text-emerald-600" /> 已完成
            </span>
          </div>
          <div class="text-xs text-slate-500 flex items-center gap-3">
            <span>创建时间: {{ task.date }}</span>
            <span>·</span>
            <span class="text-blue-600 font-medium">已筛选高潜企业: {{ task.qualifiedCount }} 家</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="handleRerunTask(task)"
            class="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw class="w-3.5 h-3.5 text-blue-600" />
            <span>复用此任务配置</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab 2: Starred Leads -->
    <div v-if="tab === 'starred'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="lead in starredLeads"
        :key="lead.id"
        @click="handleSelectLead(lead)"
        class="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all cursor-pointer space-y-2.5 shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-xs">{{ lead.name }}</h4>
            <div class="text-xs text-slate-500 mt-0.5">{{ lead.country }} · {{ lead.city }}</div>
          </div>
          <span class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {{ lead.overallScore }}分
          </span>
        </div>

        <p class="text-xs text-slate-600 line-clamp-2">
          {{ lead.summary }}
        </p>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
          <span>查看企业详细画像</span>
          <ChevronRight class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Tab 3: Settings -->
    <div v-if="tab === 'settings'" class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 max-w-2xl">
      <div class="space-y-1">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">AI 智能评分权重配置</h3>
        <p class="text-xs text-slate-500">
          调整 5 维算分模型权重，定制属于您企业的客户筛选准则
        </p>
      </div>

      <div class="space-y-3.5 text-xs">
        <div class="space-y-1">
          <div class="flex justify-between text-slate-700 font-medium">
            <span>产品匹配度权重</span>
            <span class="font-mono font-bold text-blue-600">30%</span>
          </div>
          <input type="range" min="10" max="50" value="30" class="w-full accent-blue-600 cursor-pointer" />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-slate-700 font-medium">
            <span>企业规模与财力权重</span>
            <span class="font-mono font-bold text-blue-600">20%</span>
          </div>
          <input type="range" min="10" max="50" value="20" class="w-full accent-blue-600 cursor-pointer" />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-slate-700 font-medium">
            <span>市场契合度权重</span>
            <span class="font-mono font-bold text-blue-600">20%</span>
          </div>
          <input type="range" min="10" max="50" value="20" class="w-full accent-blue-600 cursor-pointer" />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-slate-700 font-medium">
            <span>采购潜力与体量权重</span>
            <span class="font-mono font-bold text-blue-600">15%</span>
          </div>
          <input type="range" min="5" max="30" value="15" class="w-full accent-blue-600 cursor-pointer" />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-slate-700 font-medium">
            <span>合作意愿与换供可能性权重</span>
            <span class="font-mono font-bold text-blue-600">15%</span>
          </div>
          <input type="range" min="5" max="30" value="15" class="w-full accent-blue-600 cursor-pointer" />
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex justify-end">
        <button class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer">
          保存配置偏好
        </button>
      </div>
    </div>
  </div>
</template>
