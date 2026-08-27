<script setup lang="ts">
import { Flame, LayoutDashboard, Radar, Sparkles, Lightbulb, PenTool, MessageSquareCode, TrendingUp, FolderHeart, Cpu, Settings } from 'lucide-vue-next'
import type { StudioView } from '@/data/contentStudioData'

defineProps<{ currentView: StudioView }>()
const emit = defineEmits<{ (e: 'navigate', view: StudioView): void }>()

const NAV_ITEMS: { id: StudioView; label: string; icon: any; badge?: string; badgeCls?: string }[] = [
  { id: 'dashboard', label: '首页 Dashboard', icon: LayoutDashboard },
  { id: 'radar', label: '爆款雷达', icon: Radar, badge: '实时', badgeCls: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40' },
  { id: 'dissect', label: '爆文拆解', icon: Sparkles },
  { id: 'topics', label: 'AI选题工厂', icon: Lightbulb },
  { id: 'generation', label: '内容生成中心', icon: PenTool },
  { id: 'replies', label: '评论成交Agent', icon: MessageSquareCode },
  { id: 'diagnostics', label: '数据诊断中心', icon: TrendingUp },
  { id: 'assets', label: '内容资产库', icon: FolderHeart },
  { id: 'agent_hub', label: 'AI Agent中心', icon: Cpu, badge: '工作流', badgeCls: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'settings', label: '系统设置', icon: Settings },
]
</script>

<template>
  <aside class="w-56 shrink-0 h-full border-r border-[#1f1f1f] bg-[#0c0c0c] flex flex-col">
    <!-- Brand -->
    <div class="p-5 border-b border-[#1f1f1f] flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <Flame class="w-5 h-5 text-black" fill="currentColor" />
      </div>
      <div>
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-bold text-white">爆款工厂</span>
          <span class="text-[9px] bg-[#222] text-[#888] font-mono px-1 py-0.5 rounded">V1.0</span>
        </div>
        <p class="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">System Agent Console</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <button
        v-for="item in NAV_ITEMS"
        :key="item.id"
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-left"
        :class="currentView === item.id ? 'bg-[#1a1a1a] text-white border border-zinc-800/60' : 'text-zinc-400 hover:bg-[#151515]'"
        @click="emit('navigate', item.id)"
      >
        <component :is="item.icon" class="w-4 h-4 shrink-0" :class="currentView === item.id ? 'text-orange-500' : ''" />
        <span class="flex-1">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border"
          :class="item.badgeCls"
        >
          {{ item.badge }}
        </span>
      </button>
    </nav>

    <!-- User card -->
    <div class="p-4 border-t border-[#1f1f1f] bg-[#161616] flex items-center gap-3">
      <div class="relative">
        <div class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-400 font-bold text-xs">MCN</div>
        <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#161616]"></span>
      </div>
      <div>
        <p class="text-[11px] font-bold text-zinc-200">增长负责人 - 陈立明</p>
        <p class="text-[9px] text-zinc-500 font-mono">Pro Account</p>
      </div>
    </div>
  </aside>
</template>
