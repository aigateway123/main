<!-- ============================================================================
     AI 法务员工 · AI 工作历史日志与审查归档（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/history/HistoryRecordsView.tsx
     （原型为浅色主题，本批统一深色：slate-200/white 系 → slate-800/slate-900 系）
     emits：start-review（「重现该审查现场」仅出现在《设备采购合同》相关日志条目）
     数据：'@/data/legalMockData' 的 MOCK_AI_WORK_LOGS（6 条，log.type 决定时间轴圆点颜色）
     图标映射：原型 History/Clock/Bot/CheckCircle2/ShieldAlert 未渲染，未引入；仅用到 ArrowRight
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { MOCK_AI_WORK_LOGS } from '@/data/legalMockData'
import type { AiWorkLog } from '@/data/legalIntelData'

const emit = defineEmits<{ (e: 'start-review'): void }>()

// 时间轴圆点颜色：risk→rose / review→blue / expire→amber / regulation→violet / compliance→emerald
const dotCls = (type: AiWorkLog['type']) =>
  type === 'risk'
    ? 'bg-rose-500'
    : type === 'review'
      ? 'bg-blue-500'
      : type === 'expire'
        ? 'bg-amber-500'
        : type === 'regulation'
          ? 'bg-violet-500'
          : 'bg-emerald-500'

const canReplay = (title: string) => title.includes('设备采购合同')
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          不可篡改审计流
        </span>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
        AI 工作历史日志与审查归档
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        记录企业法务AI员工的所有审查事件、风险拦截历史与修改版本输出
      </p>
    </div>

    <!-- Timeline -->
    <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm">
      <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        <div v-for="log in MOCK_AI_WORK_LOGS" :key="log.id" class="relative group">
          <div class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0A0F1D]" :class="dotCls(log.type)" />
          <div class="flex items-baseline justify-between gap-4">
            <div class="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              {{ log.title }}
            </div>
            <span class="text-xs text-slate-500 font-mono shrink-0">{{ log.time }}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">
            {{ log.description }}
          </p>
          <button
            v-if="canReplay(log.title)"
            type="button"
            @click="emit('start-review')"
            class="mt-2 text-xs text-blue-400 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>重现该审查现场与条款对比</span>
            <ArrowRight class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
