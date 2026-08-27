<script setup lang="ts">
import { GraduationCap, BookOpen, RotateCcw, Download, ArrowRight } from 'lucide-vue-next'
import type { WorkflowStep } from '@/data/paperAgentData'

const props = defineProps<{
  currentStep: WorkflowStep
  hasGeneratedPaper: boolean
  hasReviewed: boolean
  hasAppliedAblation: boolean
  serifMode: boolean
}>()

const emit = defineEmits<{
  (e: 'select-step', step: WorkflowStep): void
  (e: 'open-export'): void
  (e: 'reset'): void
  (e: 'toggle-serif'): void
}>()

const stepMeta: { id: WorkflowStep; label: string; enLabel: string }[] = [
  { id: 'experiment', label: '1. 实验项目', enLabel: '实验数据与图表' },
  { id: 'paper', label: '2. 论文正文', enLabel: '论文与实验结果' },
  { id: 'reviewer', label: '3. AI 审稿', enLabel: '同行审稿专家' },
  { id: 'revision', label: '4. 修改与消融', enLabel: '修改建议与消融实验' },
]

const isDoneMap = (id: WorkflowStep) =>
  id === 'paper' ? props.hasGeneratedPaper : id === 'reviewer' ? props.hasReviewed : id === 'revision' ? props.hasAppliedAblation : false

function onSelect(step: WorkflowStep) {
  emit('select-step', step)
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
    <!-- Top Brand Banner -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3 cursor-pointer" @click="emit('select-step', 'experiment')">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <GraduationCap class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AI Paper Agent
              </span>
              <span class="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                科研智能工作台
              </span>
            </div>
            <p class="text-xs text-slate-400 font-normal hidden sm:block">从实验结果到论文，让 AI 帮你完成科研写作与审稿</p>
          </div>
        </div>

        <!-- Right Action Controls -->
        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="emit('toggle-serif')"
            :title="'切换排版字体 (LaTeX 衬线体 / 现代无衬线体)'"
            :class="`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              serifMode ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-inner' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span class="hidden md:inline">{{ serifMode ? 'LaTeX 衬线体' : '无衬线体' }}</span>
          </button>

          <button
            @click="emit('reset')"
            title="重置工作流"
            class="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">重置</span>
          </button>

          <button
            @click="emit('open-export')"
            :class="`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md ${
              hasGeneratedPaper
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`"
          >
            <Download class="w-3.5 h-3.5" />
            <span>导出论文</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Closed-Loop Workflow Stepper -->
    <div class="bg-slate-950/80 border-t border-slate-800/80 py-2.5 px-4 sm:px-6">
      <div class="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
        <template v-for="(step, idx) in stepMeta" :key="step.id">
          <button
            @click="onSelect(step.id)"
            :class="`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              currentStep === step.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : isDoneMap(step.id)
                  ? 'bg-slate-800/90 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`"
          >
            <span
              :class="`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === step.id
                  ? 'bg-white text-blue-700'
                  : isDoneMap(step.id)
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-700 text-slate-400'
              }`"
            >
              {{ isDoneMap(step.id) ? '✓' : idx + 1 }}
            </span>
            <span>{{ step.label }}</span>
            <span class="text-[10px] opacity-70 hidden md:inline">({{ step.enLabel }})</span>
          </button>

          <ArrowRight v-if="idx < stepMeta.length - 1" class="w-3.5 h-3.5 text-slate-600 mx-1 flex-shrink-0" />
        </template>
      </div>
    </div>
  </header>
</template>
