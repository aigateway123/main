<!-- ============================================================================
     AI 法务员工 · 工作台左侧导航（深色侧栏）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/layout/Sidebar.tsx
     三组导航：核心能力 8 项（合同审查核心Demo徽章 / 合同管理 1,286）/
     我的任务 3 项（计数 badge 由 props 注入）/ 底部系统设置 + AI 在线状态卡
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import {
  Activity,
  BookOpen,
  Bot,
  ClockAlert,
  FileCheck2,
  FileText,
  FolderKanban,
  History,
  Home,
  ListTodo,
  Search,
  Settings,
  ShieldCheck,
} from 'lucide-vue-next'
import type { LegalView } from '@/data/legalIntelData'

const props = withDefaults(
  defineProps<{
    activeView: LegalView
    pendingContractsCount?: number
    myTasksCount?: number
  }>(),
  { pendingContractsCount: 32, myTasksCount: 10 },
)

const emit = defineEmits<{ (e: 'select-view', view: LegalView): void }>()

interface NavItem {
  id: LegalView
  label: string
  icon: Component
  badge?: string
}

interface TaskNavItem {
  id: LegalView
  label: string
  icon: Component
  count: number
}

// ① 核心能力：8 项主视图（照原型 Sidebar mainNavItems）
const mainNavItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'contract-review', label: '合同审查', icon: FileCheck2, badge: '核心Demo' },
  { id: 'contract-management', label: '合同管理', icon: FolderKanban, badge: '1,286' },
  { id: 'regulation-search', label: '法规检索', icon: Search },
  { id: 'enterprise-compliance', label: '企业合规', icon: ShieldCheck, badge: 'AI顾问' },
  { id: 'legal-risk', label: '法律风险', icon: Activity },
  { id: 'knowledge-base', label: '法务知识库', icon: BookOpen },
  { id: 'legal-reports', label: '法律报告', icon: FileText },
]

// ② 我的任务：3 项（计数来自 props，默认 10 / 32；computed 保证 props 更新后徽章同步）
const taskNavItems = computed<TaskNavItem[]>(() => [
  { id: 'my-tasks', label: '我的任务', icon: ListTodo, count: props.myTasksCount },
  { id: 'pending-contracts', label: '待处理合同', icon: ClockAlert, count: props.pendingContractsCount },
  { id: 'history-records', label: '历史记录', icon: History, count: 0 },
])

const selectView = (view: LegalView) => emit('select-view', view)

const isActive = (id: LegalView): boolean => props.activeView === id

// 行激活态：bg-blue-600/15 + text-blue-400 + 蓝边框；非激活 slate 文本
const rowClass = (id: LegalView): string =>
  isActive(id)
    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/25 shadow-sm'
    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'

// 文字徽章（核心Demo / 1,286 / AI顾问）
const badgeClass = (id: LegalView): string =>
  isActive(id) ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'

// 数字计数徽章（我的任务 / 待处理合同）
const countClass = (id: LegalView): string =>
  isActive(id) ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
</script>

<template>
  <aside
    class="w-60 bg-slate-900/70 text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800 select-none backdrop-blur-md"
  >
    <!-- 品牌区：XX AI · AI法务员工 + PRO -->
    <div class="p-5 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold italic shadow-sm text-sm"
        >
          XX
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-white tracking-tight text-sm">XX AI</span>
            <span
              class="text-[10px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30"
            >
              PRO
            </span>
          </div>
          <div class="text-[11px] text-slate-500 uppercase tracking-wide mt-0.5">
            AI法务员工
          </div>
        </div>
      </div>
    </div>

    <!-- 导航链接（可滚动） -->
    <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6 legal-custom-scrollbar">
      <!-- ① 核心能力 -->
      <div>
        <div class="px-3 pb-2 text-[10px] uppercase text-slate-500 tracking-widest font-semibold">
          核心能力
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in mainNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer"
            :class="rowClass(item.id)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5">
              <!-- 激活态显示蓝点，非激活显示图标 -->
              <span
                v-if="isActive(item.id)"
                class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"
              ></span>
              <component
                :is="item.icon"
                v-else
                class="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0"
              />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="text-[10px] px-1.5 py-0.5 rounded font-medium"
              :class="badgeClass(item.id)"
            >
              {{ item.badge }}
            </span>
          </button>
        </nav>
      </div>

      <!-- ② 我的任务 -->
      <div class="pt-2 border-t border-slate-800">
        <div class="px-3 pb-2 text-[10px] uppercase text-slate-500 tracking-widest font-semibold">
          我的任务
        </div>
        <nav class="space-y-1">
          <button
            v-for="item in taskNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer"
            :class="rowClass(item.id)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5">
              <span
                v-if="isActive(item.id)"
                class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"
              ></span>
              <component
                :is="item.icon"
                v-else
                class="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0"
              />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.count > 0"
              class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              :class="countClass(item.id)"
            >
              {{ item.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- ③ 系统设置 -->
      <div class="pt-2 border-t border-slate-800">
        <button
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer"
          :class="rowClass('settings')"
          @click="selectView('settings')"
        >
          <Settings
            class="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors"
          />
          <span>系统设置</span>
        </button>
      </div>
    </div>

    <!-- 底部 AI 员工在线状态卡 -->
    <div class="p-3 border-t border-slate-800 bg-slate-950/40">
      <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
        <div class="relative">
          <div
            class="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400"
          >
            <Bot class="w-4 h-4" />
          </div>
          <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-slate-200 truncate">AI法务员工在线</div>
          <div class="text-[10px] text-slate-500 truncate">首轮审查耗时 &lt; 3分钟</div>
        </div>
      </div>
    </div>
  </aside>
</template>
