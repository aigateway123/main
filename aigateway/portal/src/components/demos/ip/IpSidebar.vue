<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/Sidebar.tsx -->
<!-- 移植修复（原型 bug）：secondary 导航「我的项目」id 误指 overview、及重复/一名两义项
     已重构为三组：智能分析 / 资产与情报 / 设置（与 IpView 全集对齐，无重复项） -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import {
  AlertOctagon,
  BarChart3,
  Bookmark,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Layers,
  PlusCircle,
  Radio,
  Search,
  Settings,
  Sparkles,
} from 'lucide-vue-next'
import type { IpView } from '@/data/ipIntelData'

const props = defineProps<{
  activeView: IpView
}>()

const emit = defineEmits<{
  (e: 'select-view', view: IpView): void
  (e: 'open-new-analysis'): void
}>()

// 侧栏折叠状态由组件内部自管理（展开 w-56 / 折叠 w-[4.5rem]）
const collapsed = ref(false)

interface NavItem {
  id: IpView
  label: string
  icon: Component
  badge?: string
  badgeClass?: string
  pulse?: boolean
}

// ① 智能分析：7 项主视图
const analysisNavItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'search', label: '专利检索', icon: Search, badge: '1.2k+' },
  { id: 'overview', label: '专利分析', icon: BarChart3 },
  { id: 'competitors', label: '竞品专利', icon: Building2, badge: '23家' },
  { id: 'risks', label: '风险分析', icon: AlertOctagon, badge: '8高危', badgeClass: 'bg-rose-500 text-white' },
  { id: 'layout', label: '专利布局', icon: Layers, badge: '17机会', badgeClass: 'bg-emerald-500 text-white' },
  { id: 'report', label: '知识产权报告', icon: FileText },
]

// ② 资产与情报
const assetNavItems: NavItem[] = [
  { id: 'my-patents', label: '我的专利', icon: Bookmark, badge: '126' },
  { id: 'radar', label: '实时雷达', icon: Radio, pulse: true },
]

// ③ 设置
const settingsNavItems: NavItem[] = [{ id: 'settings', label: '设置', icon: Settings }]

const selectView = (view: IpView) => emit('select-view', view)
const openNewAnalysis = () => emit('open-new-analysis')

// 导航项基础类：激活态高亮蓝（深蓝 #0F172A 底 + blue-600 强调）
const itemClass = (item: NavItem): string =>
  props.activeView === item.id
    ? 'text-white bg-blue-600/20 border-r-4 border-blue-600 font-semibold'
    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'

const badgeClass = (item: NavItem): string => {
  if (item.badgeClass) return item.badgeClass
  return props.activeView === item.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
}
</script>

<template>
  <aside
    class="bg-[#0F172A] text-slate-300 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 shrink-0 select-none h-full min-h-0"
    :class="collapsed ? 'w-[4.5rem]' : 'w-56'"
  >
    <!-- 品牌区：XX AI 顾问 / 企业知识产权总监 -->
    <div
      class="flex items-center bg-[#1E293B] border-b border-slate-800/90 transition-all shrink-0"
      :class="collapsed ? 'gap-3 p-3 justify-center h-16' : 'gap-3 p-4 h-16'"
    >
      <template v-if="!collapsed">
        <div
          class="flex items-center gap-3 overflow-hidden cursor-pointer min-w-0"
          title="回到首页"
          @click="selectView('home')"
        >
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0"
          >
            XX
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-white tracking-tight text-sm whitespace-nowrap">XX AI 顾问</span>
              <span
                class="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-0.5 rounded font-semibold font-mono"
              >
                PRO
              </span>
            </div>
            <p class="text-[10px] text-slate-400 truncate">企业知识产权总监</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm cursor-pointer shrink-0"
          title="XX AI · AI知识产权顾问"
          @click="selectView('home')"
        >
          XX
        </div>
      </template>

      <!-- 折叠切换按钮 -->
      <button
        type="button"
        class="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-auto shrink-0"
        :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
        @click="collapsed = !collapsed"
      >
        <ChevronRight v-if="collapsed" class="w-3.5 h-3.5" />
        <ChevronLeft v-else class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- 导航主体（可滚动） -->
    <div class="flex-1 overflow-y-auto py-3 space-y-4 min-h-0">
      <!-- ① 智能分析 -->
      <div>
        <p v-if="!collapsed" class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          智能分析
        </p>
        <nav class="space-y-0.5 text-xs font-medium">
          <button
            v-for="item in analysisNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center gap-2.5 px-4 py-2 transition-all group relative cursor-pointer text-left"
            :class="itemClass(item)"
            :title="collapsed ? item.label : undefined"
            @click="selectView(item.id)"
          >
            <component
              :is="item.icon"
              class="w-4 h-4 shrink-0 transition-transform"
              :class="activeView === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'"
            />
            <template v-if="!collapsed">
              <span class="truncate flex-1">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                :class="badgeClass(item)"
              >
                {{ item.badge }}
              </span>
            </template>
            <span
              v-if="collapsed && item.badge"
              class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"
            ></span>
          </button>
        </nav>
      </div>

      <!-- ② 资产与情报 -->
      <div class="pt-2 border-t border-slate-800/60">
        <p v-if="!collapsed" class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          资产与情报
        </p>
        <nav class="space-y-0.5 text-xs font-medium">
          <button
            v-for="item in assetNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center gap-2.5 px-4 py-2 transition-all group relative cursor-pointer text-left"
            :class="itemClass(item)"
            :title="collapsed ? item.label : undefined"
            @click="selectView(item.id)"
          >
            <component
              :is="item.icon"
              class="w-4 h-4 shrink-0"
              :class="activeView === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'"
            />
            <template v-if="!collapsed">
              <span class="truncate flex-1">{{ item.label }}</span>
              <!-- 实时雷达：呼吸绿点 -->
              <span v-if="item.pulse" class="relative flex h-2 w-2 shrink-0">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span
                v-else-if="item.badge"
                class="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0"
              >
                {{ item.badge }}
              </span>
            </template>
            <span
              v-if="collapsed && item.badge"
              class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"
            ></span>
          </button>
        </nav>
      </div>

      <!-- ③ 设置 -->
      <div class="pt-2 border-t border-slate-800/60">
        <p v-if="!collapsed" class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          设置
        </p>
        <nav class="space-y-0.5 text-xs font-medium">
          <button
            v-for="item in settingsNavItems"
            :key="item.id"
            type="button"
            class="w-full flex items-center gap-2.5 px-4 py-2 transition-all group relative cursor-pointer text-left"
            :class="itemClass(item)"
            :title="collapsed ? item.label : undefined"
            @click="selectView(item.id)"
          >
            <component
              :is="item.icon"
              class="w-4 h-4 shrink-0"
              :class="activeView === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'"
            />
            <template v-if="!collapsed">
              <span class="truncate flex-1">{{ item.label }}</span>
            </template>
          </button>
        </nav>
      </div>
    </div>

    <!-- 底部：新建分析 CTA + 系统状态 -->
    <div class="mt-auto p-3 border-t border-slate-800 shrink-0">
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
        :title="collapsed ? '新建知识产权分析' : undefined"
        @click="openNewAnalysis"
      >
        <PlusCircle class="w-4 h-4 shrink-0" />
        <span v-if="!collapsed" class="whitespace-nowrap">新建分析</span>
      </button>

      <template v-if="!collapsed">
        <div class="mt-2.5 flex items-center justify-between px-1">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
            <span class="text-xs font-medium text-slate-300 truncate">AI 引擎运行中</span>
          </div>
        </div>
        <div class="mt-0.5 px-1 text-[10px] opacity-60 uppercase font-mono text-slate-400 tracking-wider flex items-center gap-1">
          <Sparkles class="w-2.5 h-2.5 text-blue-400/80" />
          <span>v2.4 Enterprise</span>
        </div>
      </template>
      <div v-else class="mt-2.5 flex justify-center">
        <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
      </div>
    </div>
  </aside>
</template>
