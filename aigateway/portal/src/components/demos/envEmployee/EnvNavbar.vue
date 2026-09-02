<script setup lang="ts">
// 环保 AI 员工矩阵 · 顶部导航 —— 转译自原型 Navbar.tsx
import {
  ShieldAlert, FileCheck2, FileText, Trophy, Briefcase, Activity, AlertTriangle,
  BarChart3, Sparkles, LayoutDashboard, BookOpenCheck, Clock, CheckCircle2,
  type LucideIcon,
} from 'lucide-vue-next'
import type { EnvEmployeeId } from '@/data/envAgentData'
import { ENV_AGENTS_META } from '@/data/envAgentData'

type EnvNavTab = EnvEmployeeId | 'overview'

defineProps<{
  activeTab: EnvNavTab
}>()

const emit = defineEmits<{
  (e: 'select-tab', tab: EnvNavTab): void
  (e: 'open-pitch-guide'): void
}>()

const handleSelect = (tab: EnvNavTab) => emit('select-tab', tab)
const handleOpenPitch = () => emit('open-pitch-guide')

const iconOf = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'ShieldAlert': return ShieldAlert
    case 'FileCheck2': return FileCheck2
    case 'FileText': return FileText
    case 'Trophy': return Trophy
    case 'Briefcase': return Briefcase
    case 'Activity': return Activity
    case 'AlertTriangle': return AlertTriangle
    case 'BarChart3': return BarChart3
    default: return Sparkles
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-[#0F1218]/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top Brand Bar -->
      <div class="flex items-center justify-between h-16 border-b border-slate-800/80">
        <!-- Logo & Product Title -->
        <div class="flex items-center gap-3 cursor-pointer select-none" @click="handleSelect('overview')">
          <div class="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <div class="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold tracking-tight text-white">
                AI 环保 <span class="text-emerald-400">员工矩阵</span>
              </span>
              <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                ENTERPRISE AGENTS
              </span>
            </div>
            <p class="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>让环保企业低成本拥有自己的 AI 员工团队</span>
            </p>
          </div>
        </div>

        <!-- Quick Metrics & Actions -->
        <div class="hidden lg:flex items-center gap-3">
          <div class="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0A0C10] border border-slate-800 text-xs text-slate-300">
            <div class="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <Clock class="w-3.5 h-3.5" />
              <span>平均提效 90%+</span>
            </div>
            <div class="w-px h-3.5 bg-slate-800" />
            <div class="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>8 大岗位即开即用</span>
            </div>
          </div>

          <!-- Live Demo Pitch Script Trigger -->
          <button
            id="pitch-guide-btn"
            @click="handleOpenPitch"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <BookOpenCheck class="w-4 h-4 text-emerald-400" />
            <span>3分钟客户路演脚本</span>
          </button>
        </div>
      </div>

      <!-- 8 Agents Nav Bar -->
      <div class="flex items-center gap-1.5 py-2.5 overflow-x-auto text-xs font-medium [scrollbar-width:none]">
        <!-- Overview Dashboard Tab -->
        <button
          id="nav-overview-btn"
          @click="handleSelect('overview')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer"
          :class="activeTab === 'overview'
            ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
        >
          <LayoutDashboard class="w-3.5 h-3.5" />
          <span>AI 员工全景驾驶舱</span>
        </button>

        <div class="w-px h-4 bg-slate-800 mx-1 flex-shrink-0" />

        <!-- 8 Agent Buttons -->
        <button
          v-for="(agent, index) in ENV_AGENTS_META"
          :key="agent.id"
          :id="`nav-${agent.id}-btn`"
          @click="handleSelect(agent.id)"
          class="flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer group"
          :class="activeTab === agent.id
            ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
        >
          <span class="text-[10px] font-mono text-slate-500">{{ String(index + 1).padStart(2, '0') }}</span>
          <span :class="activeTab === agent.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'">
            <component :is="iconOf(agent.avatarIcon)" class="w-3.5 h-3.5" />
          </span>
          <span class="text-xs">{{ agent.name }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
