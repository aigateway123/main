<script setup lang="ts">
import { AlertTriangle, Workflow, BarChart3, MessageSquareQuote, ArrowRight } from 'lucide-vue-next'
import type { PipelineStage } from '@/types'

defineProps<{ stage: PipelineStage }>()
</script>

<template>
  <div>
    <!-- 痛点 -->
    <div v-if="stage.pain.length" class="mb-6">
      <h4 class="flex items-center gap-1.5 text-xs font-bold text-red-600 mb-3">
        <AlertTriangle class="w-3.5 h-3.5" />
        传统流程的痛点
      </h4>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <li
          v-for="(p, i) in stage.pain"
          :key="i"
          class="flex items-start gap-2 text-xs text-slate-600 bg-red-50/60 border border-red-100/80 rounded-lg px-3 py-2"
        >
          <span class="text-red-400 mt-0.5">✕</span>
          <span>{{ p }}</span>
        </li>
      </ul>
    </div>

    <!-- Nova 自动化流程 -->
    <div v-if="stage.flow.length" class="mb-6">
      <h4 class="flex items-center gap-1.5 text-xs font-bold text-blue-600 mb-3">
        <Workflow class="w-3.5 h-3.5" />
        Nova 自动化流程
      </h4>
      <div class="flex flex-wrap items-center gap-2">
        <template v-for="(step, i) in stage.flow" :key="i">
          <span class="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">{{ step }}</span>
          <ArrowRight v-if="i < stage.flow.length - 1" class="w-3.5 h-3.5 text-slate-300 shrink-0" />
        </template>
      </div>
    </div>

    <!-- 关键成果 -->
    <div v-if="stage.result.length">
      <h4 class="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-3">
        <BarChart3 class="w-3.5 h-3.5" />
        关键成果
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="(r, i) in stage.result"
          :key="i"
          class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
        >
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{{ r.label }}</div>
          <div class="text-sm font-semibold text-slate-800 leading-snug">{{ r.value }}</div>
        </div>
      </div>
    </div>

    <!-- 典型输入 -->
    <div v-if="stage.quote" class="mt-6 flex items-start gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 px-4 py-3.5">
      <MessageSquareQuote class="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
      <p class="text-xs text-slate-700 leading-relaxed">
        <span class="font-bold text-blue-700">典型输入：</span>{{ stage.quote }}
      </p>
    </div>
  </div>
</template>
