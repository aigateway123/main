<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/Sidebar.tsx -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import {
  CheckSquare,
  Factory,
  Globe,
  HelpCircle,
  History,
  Radar,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-vue-next'
import type { TradeView } from '@/data/tradeIntelData'

const props = defineProps<{
  activeView: TradeView
  favoriteCount: number
}>()

const emit = defineEmits<{
  (e: 'select-view', view: TradeView): void
  (e: 'open-new-task'): void
  (e: 'open-pitch-guide'): void
}>()

interface NavItem {
  id: string
  label: string
  icon: Component
  badge?: string
  badgeColor?: string
  count?: number
}

const mainNavItems: NavItem[] = [
  { id: 'home', label: '平台首页', icon: Globe, badge: '核心' },
  { id: 'customers', label: '客户情报', icon: Users, badge: '237' },
  { id: 'suppliers', label: '供应商情报', icon: Factory, badge: '328' },
  { id: 'market', label: '市场情报', icon: TrendingUp, badge: '热门' },
  { id: 'competitors', label: '竞争对手', icon: ShieldAlert },
  { id: 'radar', label: '商机监控', icon: Radar, badge: 'LIVE', badgeColor: 'bg-rose-500 text-white animate-pulse' },
]

const secondaryNavItems = computed<NavItem[]>(() => [
  { id: 'tasks', label: '任务中心', icon: CheckSquare },
  { id: 'favorites', label: '我的收藏', icon: Star, count: props.favoriteCount },
  { id: 'history', label: '历史任务', icon: History },
])

const isActive = (id: string): boolean => props.activeView === id

const selectView = (id: string) => {
  // 原型中点击「我的收藏」→ 实际切到 customers、点击「历史任务」→ 实际切到 tasks（映射在原型的 App 层完成）
  if (id === 'favorites') emit('select-view', 'customers')
  else if (id === 'history') emit('select-view', 'tasks')
  else emit('select-view', id as TradeView)
}

const openNewTask = () => emit('open-new-task')
const openPitchGuide = () => emit('open-pitch-guide')

const navItemClass = (id: string): string =>
  isActive(id)
    ? 'bg-slate-800/80 text-white border-l-[3px] border-blue-500 shadow-sm font-semibold'
    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-l-[3px] border-transparent'

const navIconClass = (id: string): string => (isActive(id) ? 'text-blue-400' : 'text-slate-400')

const navBadgeClass = (id: string, badgeColor?: string): string =>
  badgeColor || (isActive(id) ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400')
</script>

<template>
  <nav
    class="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 h-full sticky top-0 z-30 select-none border-r border-slate-800"
  >
    <!-- Brand Header -->
    <div class="p-5 border-b border-slate-800/90 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
          AI
        </div>
        <div>
          <span class="text-white font-bold text-base tracking-tight block leading-tight">
            XX AI · 贸易情报员
          </span>
          <span class="text-[10px] text-blue-400 font-mono font-medium">B2B ENTERPRISE</span>
        </div>
      </div>
    </div>

    <!-- Quick Launch Button -->
    <div class="px-4 pt-3.5 pb-1">
      <button
        class="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        @click="openNewTask"
      >
        <Sparkles class="w-3.5 h-3.5 text-blue-200" />
        <span>新建情报采集任务</span>
      </button>
    </div>

    <!-- Navigation Sections -->
    <div class="flex-1 overflow-y-auto px-3 py-3 space-y-5 no-scrollbar">
      <!-- Main Intelligence Category -->
      <div>
        <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
          <span>核心业务情报</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">LIVE</span>
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in mainNavItems"
            :key="item.id"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            :class="navItemClass(item.id)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5">
              <component :is="item.icon" class="w-4 h-4" :class="navIconClass(item.id)" />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.badge"
              class="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium"
              :class="navBadgeClass(item.id, item.badgeColor)"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- Workspace Category -->
      <div>
        <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          数据资产与工作台
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in secondaryNavItems"
            :key="item.id"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            :class="navItemClass(item.id)"
            @click="selectView(item.id)"
          >
            <div class="flex items-center gap-2.5">
              <component :is="item.icon" class="w-4 h-4" :class="navIconClass(item.id)" />
              <span>{{ item.label }}</span>
            </div>
            <span
              v-if="item.count !== undefined && item.count > 0"
              class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono"
            >
              {{ item.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- System Settings -->
      <div>
        <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          系统管理
        </div>
        <button
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          :class="navItemClass('settings')"
          @click="selectView('settings')"
        >
          <Settings class="w-4 h-4" :class="navIconClass('settings')" />
          <span>数据源与规则配置</span>
        </button>
      </div>
    </div>

    <!-- Demo Tour Pitch Guide Footer Card -->
    <div class="p-3 border-t border-slate-800/90 bg-[#0B1120]">
      <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
            <Zap class="w-3.5 h-3.5 text-amber-400" />
            <span>3分钟客户路演向导</span>
          </div>
        </div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          给传统商贸企业老板演示时，一键打开标准话术与操作流。
        </p>
        <button
          class="w-full py-1.5 px-2 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          @click="openPitchGuide"
        >
          <HelpCircle class="w-3.5 h-3.5 text-blue-400" />
          <span>打开路演讲解卡</span>
        </button>
      </div>

      <!-- Demo status watermark -->
      <div class="mt-2 text-center">
        <span class="text-[10px] text-slate-400 font-mono">演示账号 · High Density Pro</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
