<!-- 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/layout/Header.tsx -->
<script setup lang="ts">
import { FileDown, Globe, PlusCircle, Sparkles } from 'lucide-vue-next'
import type { Currency, TargetMarket } from '@/data/ecomIntelData'
import { TARGET_MARKETS } from '@/data/ecomIntelData'

defineProps<{
  market: TargetMarket
  currency: Currency
}>()

const emit = defineEmits<{
  (e: 'change-market', market: TargetMarket): void
  (e: 'toggle-currency'): void
  (e: 'export'): void
  (e: 'new-task'): void
}>()

const selectMarket = (m: TargetMarket) => emit('change-market', m)
const toggleCurrency = () => emit('toggle-currency')
const exportReport = () => emit('export')
const newTask = () => emit('new-task')
</script>

<template>
  <header
    class="h-16 bg-[#0F1218]/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4 shrink-0 z-30"
  >
    <!-- Title & Slogan -->
    <div class="flex items-center gap-4 min-w-0">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="text-sm font-semibold text-slate-100 flex items-center gap-1.5 whitespace-nowrap">
            <span>XX AI Selection</span>
            <span class="text-slate-500">/</span>
            <span class="text-slate-400 text-xs font-normal truncate">Amazon {{ market }}</span>
          </h1>
        </div>
        <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
          <Sparkles class="w-3 h-3 text-amber-400 shrink-0" />
          <span class="truncate">AI 深度情报分析与选品研判</span>
        </p>
      </div>
    </div>

    <!-- Center Market Switcher & Controls -->
    <div class="flex items-center gap-2.5 min-w-0">
      <!-- Market Selector Pills -->
      <div
        class="hidden lg:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs max-w-[46vw] overflow-x-auto no-scrollbar"
      >
        <span class="text-slate-500 px-2 flex items-center gap-1 text-[11px] shrink-0">
          <Globe class="w-3.5 h-3.5 text-indigo-400" />
          <span>站点:</span>
        </span>
        <div class="flex items-center gap-1 shrink-0">
          <button
            v-for="m in TARGET_MARKETS"
            :key="m"
            type="button"
            class="px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
            :class="
              market === m
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            "
            @click="selectMarket(m)"
          >
            {{ m }}
          </button>
        </div>
      </div>

      <!-- Currency Toggle -->
      <button
        type="button"
        title="切换显示币种 (美元 / 人民币)"
        class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer shrink-0"
        @click="toggleCurrency"
      >
        <span class="text-[10px] text-slate-500">货币</span>
        <span class="font-mono text-indigo-400">{{ currency === 'USD' ? '$ USD' : '¥ CNY' }}</span>
      </button>

      <!-- Export Report Trigger -->
      <button
        type="button"
        class="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer shrink-0"
        @click="exportReport"
      >
        <FileDown class="w-3.5 h-3.5 text-slate-400" />
        <span>导出 PDF 简报</span>
      </button>

      <!-- New Task Action Button -->
      <button
        type="button"
        id="header-new-task-btn"
        class="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 transition active:scale-95 cursor-pointer shrink-0"
        @click="newTask"
      >
        <PlusCircle class="w-3.5 h-3.5" />
        <span class="whitespace-nowrap">发起新任务</span>
      </button>
    </div>
  </header>
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
