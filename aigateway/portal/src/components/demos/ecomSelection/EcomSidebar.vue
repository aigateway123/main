<!-- 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/layout/Sidebar.tsx -->
<!-- 移植修复：原型 NavTab 仅 11 项会与 App 13 视图错位；此处按 EcomView 全集 13 视图分组建导航 -->
<script setup lang="ts">
import type { Component } from 'vue'
import {
  BookmarkCheck,
  Bot,
  Calculator,
  Factory,
  FileSpreadsheet,
  Globe,
  LayoutDashboard,
  ListTodo,
  Package,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Swords,
  Users,
} from 'lucide-vue-next'
import type { EcomView } from '@/data/ecomIntelData'

const props = defineProps<{
  activeView: EcomView
  savedCount: number
}>()

const emit = defineEmits<{
  (e: 'select-view', view: EcomView): void
  (e: 'open-new-task'): void
}>()

interface NavItem {
  id: EcomView
  label: string
  icon: Component
  badge?: string
  count?: number
}

// 13 视图按逻辑分组：选品情报洞察 / 测算·供应链 / 任务与系统管理
const insightNavItems: NavItem[] = [
  { id: 'home', label: '首页', icon: LayoutDashboard },
  { id: 'selection-report', label: '选品报告', icon: Search, badge: '核心' },
  { id: 'agent-executing', label: 'AI 执行中', icon: Bot },
  { id: 'product-detail', label: '产品详情', icon: Package },
  { id: 'market-intel', label: '市场情报', icon: Globe },
  { id: 'competitor-analysis', label: '竞品分析', icon: Swords },
  { id: 'consumer-insights', label: '消费者洞察', icon: Users, badge: '高潜' },
]

const executionNavItems: NavItem[] = [
  { id: 'profit-calc', label: '利润测算', icon: Calculator },
  { id: 'supplier-hub', label: '供应商库', icon: Factory },
  { id: 'strategy-listing', label: '商品策略', icon: FileSpreadsheet, badge: 'Listing' },
  { id: 'my-selection', label: '我的选品', icon: BookmarkCheck },
]

const managementNavItems: NavItem[] = [
  { id: 'task-center', label: '任务中心', icon: ListTodo },
  { id: 'settings', label: '系统设置', icon: Settings },
]

const selectView = (view: EcomView) => emit('select-view', view)
const openNewTask = () => emit('open-new-task')

const itemClass = (item: NavItem): string =>
  props.activeView === item.id
    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-semibold shadow-sm'
    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'

const badgeClass = (item: NavItem): string =>
  props.activeView === item.id
    ? 'bg-indigo-500/20 text-indigo-300'
    : 'bg-slate-800 text-slate-400'
</script>

<template>
  <aside
    class="w-60 bg-[#0F1218] border-r border-slate-800 flex flex-col shrink-0 select-none h-full min-h-0"
  >
    <!-- Brand Header -->
    <div class="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2.5 min-w-0">
        <div
          class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/30 shrink-0"
        >
          XX
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
            XX AI Agent
            <span
              class="px-1 py-0.5 text-[9px] font-bold bg-indigo-500/20 text-indigo-400 rounded border border-indigo-500/30"
            >
              PRO
            </span>
          </span>
          <span class="text-[10px] text-slate-400 whitespace-nowrap">跨境选品情报员</span>
        </div>
      </div>
    </div>

    <!-- AI Agent Status Pill -->
    <div
      class="mx-3 mt-3 mb-1 p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs shrink-0"
    >
      <div class="flex items-center gap-2">
        <div class="relative flex">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <div
            class="absolute left-0 top-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75"
          ></div>
        </div>
        <span class="text-[11px] text-slate-300 font-medium">情报引擎就绪</span>
      </div>
      <span class="text-[10px] text-indigo-400 font-mono">v3.8</span>
    </div>

    <!-- Navigation Groups -->
    <div class="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-5">
      <!-- Core Intelligence -->
      <div>
        <div
          class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3 flex items-center justify-between"
        >
          <span>选品情报 · Intelligence</span>
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in insightNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="itemClass(item)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="activeView === item.id ? 'text-indigo-400' : 'text-slate-400'"
              />
              <span class="truncate">{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0"
              :class="badgeClass(item)"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Execution: Calc / Supply -->
      <div>
        <div
          class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3 flex items-center justify-between"
        >
          <span>测算 · 供应链</span>
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in executionNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="itemClass(item)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="activeView === item.id ? 'text-indigo-400' : 'text-slate-400'"
              />
              <span class="truncate">{{ item.label }}</span>
            </div>
            <span
              v-if="item.id === 'my-selection' && savedCount > 0"
              class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold shrink-0"
            >
              {{ savedCount }}
            </span>
            <span
              v-else-if="item.badge"
              class="text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0"
              :class="badgeClass(item)"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Management -->
      <div>
        <div
          class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2 px-3 flex items-center justify-between"
        >
          <span>任务 · 系统</span>
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in managementNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="itemClass(item)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <component
                :is="item.icon"
                class="w-4 h-4 shrink-0"
                :class="activeView === item.id ? 'text-indigo-400' : 'text-slate-400'"
              />
              <span class="truncate">{{ item.label }}</span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Bottom New Task CTA -->
    <div class="mt-auto p-3 border-t border-slate-800 shrink-0">
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer"
        @click="openNewTask"
      >
        <PlusCircle class="w-4 h-4" />
        <span>发起新任务</span>
      </button>
      <div class="mt-2 text-center flex items-center justify-center gap-1 text-[10px] text-slate-500">
        <Sparkles class="w-3 h-3 text-amber-400/80" />
        <span>启动新一轮 AI 选品调研</span>
      </div>
    </div>
  </aside>
</template>
