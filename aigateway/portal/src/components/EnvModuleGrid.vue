<script setup lang="ts">
// ============================================================================
// 环保 AI 员工矩阵 —— 「业务模块平铺」展示组件（env-agent 详情页专用）
// 环保业务按模块并行运转、节奏各异，不存在统一先后主流程。
// 本组件把 8 个岗位 stage 渲染为无顺序的模块卡片网格；
// 每个模块卡内部展示该岗位独立的内部流程（stage.flow 等）。
// ============================================================================
import { computed } from 'vue'
import type { FunctionalComponent } from 'vue'
import {
  Handshake, Trophy, ShieldAlert, Activity, Recycle, FileCheck2, FileText,
  TrendingUp, Sparkles, ArrowRight, LayoutDashboard, ChevronRight, AlertTriangle,
  CheckCircle2,
} from 'lucide-vue-next'
import type { PipelineStage } from '@/types'
import { envAgentMetaOf } from '@/data/envAgentData'
import type { EnvAgentMeta, EnvEmployeeId } from '@/data/envAgentData'

const props = defineProps<{
  stages: PipelineStage[]
  demoBtnClass: string
}>()

const emit = defineEmits<{ (e: 'demo', nodeId: string): void }>()

// 仅排版顺序（监管/报告类在前、商务类在后），不代表业务先后
const MODULE_ORDER = [
  'env-compliance',
  'env-permit',
  'env-monitoring',
  'env-waste',
  'env-reporter',
  'env-sales',
  'env-bid',
  'env-operations',
]

// stage 图标映射（取自环保 pipeline 各岗位 stage.icon）
const STAGE_ICONS: Record<string, FunctionalComponent> = {
  Handshake,
  Trophy,
  ShieldAlert,
  Activity,
  Recycle,
  FileCheck2,
  FileText,
  TrendingUp,
}

// 岗位主题色 → 浅色卡片字面 class（主题色来源于 envAgentData primaryColor）
interface ModuleTone {
  box: string
  cardHover: string
  chip: string
  text: string
  check: string
}

const TONES: Record<string, ModuleTone> = {
  emerald: {
    box: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    cardHover: 'hover:border-emerald-300 hover:shadow-emerald-600/10',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    text: 'text-emerald-600',
    check: 'text-emerald-500',
  },
  teal: {
    box: 'bg-teal-50 border-teal-100 text-teal-600',
    cardHover: 'hover:border-teal-300 hover:shadow-teal-600/10',
    chip: 'bg-teal-50 text-teal-700 border-teal-100',
    text: 'text-teal-600',
    check: 'text-teal-500',
  },
  cyan: {
    box: 'bg-cyan-50 border-cyan-100 text-cyan-600',
    cardHover: 'hover:border-cyan-300 hover:shadow-cyan-600/10',
    chip: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    text: 'text-cyan-600',
    check: 'text-cyan-500',
  },
  blue: {
    box: 'bg-blue-50 border-blue-100 text-blue-600',
    cardHover: 'hover:border-blue-300 hover:shadow-blue-600/10',
    chip: 'bg-blue-50 text-blue-700 border-blue-100',
    text: 'text-blue-600',
    check: 'text-blue-500',
  },
  indigo: {
    box: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    cardHover: 'hover:border-indigo-300 hover:shadow-indigo-600/10',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    text: 'text-indigo-600',
    check: 'text-indigo-500',
  },
  amber: {
    box: 'bg-amber-50 border-amber-100 text-amber-600',
    cardHover: 'hover:border-amber-300 hover:shadow-amber-600/10',
    chip: 'bg-amber-50 text-amber-700 border-amber-100',
    text: 'text-amber-600',
    check: 'text-amber-500',
  },
  violet: {
    box: 'bg-violet-50 border-violet-100 text-violet-600',
    cardHover: 'hover:border-violet-300 hover:shadow-violet-600/10',
    chip: 'bg-violet-50 text-violet-700 border-violet-100',
    text: 'text-violet-600',
    check: 'text-violet-500',
  },
}

interface ModuleCard {
  stage: PipelineStage
  meta: EnvAgentMeta
  tone: ModuleTone
}

const modules = computed<PipelineStage[]>(() => {
  const orderIdx = new Map(MODULE_ORDER.map((id, i) => [id, i]))
  return [...props.stages].sort((a, b) => (orderIdx.get(a.id) ?? 99) - (orderIdx.get(b.id) ?? 99))
})

const cards = computed<ModuleCard[]>(() =>
  modules.value.map((stage) => {
    const meta = envAgentMetaOf(stage.id.replace('env-', '') as EnvEmployeeId)
    return { stage, meta, tone: TONES[meta.primaryColor] ?? TONES.emerald }
  }),
)

const openDemo = (nodeId: string) => emit('demo', nodeId)
</script>

<template>
  <div>
    <!-- 全景驾驶舱入口 -->
    <button
      type="button"
      class="w-full rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 group flex items-center gap-4 p-5 sm:p-6 text-left transition-all hover:shadow-lg hover:shadow-emerald-600/10 cursor-pointer"
      @click="openDemo('env-start')"
    >
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-2.5 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 shrink-0">
        <LayoutDashboard class="w-5 h-5" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-700">全景驾驶舱</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-teal-200 text-teal-700">总览 · Overview</span>
        </div>
        <h3 class="text-base sm:text-lg font-extrabold text-slate-900">8 大岗位 AI 员工全景驾驶舱</h3>
        <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          不确定从哪开始？先进入驾驶舱总览，一次看全 8 位 AI 员工与四大业务场景，再按需调用对应模块 →
        </p>
      </div>
      <div class="hidden sm:inline-flex items-center gap-1 shrink-0 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm transition-transform group-hover:translate-x-1">
        打开驾驶舱
        <ChevronRight class="w-3.5 h-3.5" />
      </div>
    </button>

    <p class="text-center text-xs text-slate-500 mt-4">
      以下模块<strong class="text-slate-700">无固定先后顺序</strong>，按企业当下业务随时调用；点击任意模块卡即可进入对应 AI 员工工作台完整推演。
    </p>

    <!-- 8 大业务模块平铺网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8 items-stretch">
      <article
        v-for="card in cards"
        :key="card.stage.id"
        class="group rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 flex flex-col overflow-hidden"
        :class="card.tone.cardHover"
      >
        <div class="p-5 sm:p-6 flex-1">
          <!-- 岗位图标 + code -->
          <div class="flex items-center justify-between mb-4">
            <div class="w-11 h-11 rounded-xl border p-2.5 flex items-center justify-center" :class="card.tone.box">
              <component :is="STAGE_ICONS[card.stage.icon] || Sparkles" class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-slate-900 text-emerald-400">{{ card.meta.code }}</span>
          </div>

          <!-- 岗位名 + roleName -->
          <h3 class="text-base font-extrabold text-slate-900 leading-snug">{{ card.meta.name }}</h3>
          <p class="text-[11px] font-semibold text-slate-400 mt-0.5">{{ card.meta.roleName }}</p>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">{{ card.meta.tagline }}</p>

          <!-- 模块内部流程（各岗位真实内部流程，文案天然不同） -->
          <div class="mt-4">
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span class="w-1 h-3 rounded-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
              模块内部流程
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
              <template v-for="(step, i) in card.stage.flow" :key="i">
                <span class="text-[11px] font-semibold px-2 py-1 rounded-lg border" :class="card.tone.chip">{{ step }}</span>
                <ArrowRight v-if="i < card.stage.flow.length - 1" class="w-3 h-3 text-slate-300 shrink-0" />
              </template>
            </div>
          </div>

          <!-- 传统痛点（前 2 条） -->
          <div v-if="card.stage.pain.length" class="mt-4">
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <AlertTriangle class="w-3 h-3 text-rose-400" />
              人工做不动的痛点
            </div>
            <ul class="space-y-1.5">
              <li
                v-for="(p, i) in card.stage.pain.slice(0, 2)"
                :key="i"
                class="flex items-start gap-1.5 text-[11px] text-slate-500 leading-relaxed"
              >
                <span class="text-rose-400 mt-0.5 shrink-0 font-bold">✕</span>
                <span>{{ p }}</span>
              </li>
            </ul>
          </div>

          <!-- 典型成果（前 2 项） -->
          <div v-if="card.stage.result.length" class="mt-4">
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <CheckCircle2 class="w-3 h-3" :class="card.tone.check" />
              AI 典型成果
            </div>
            <ul class="space-y-1.5">
              <li
                v-for="(r, i) in card.stage.result.slice(0, 2)"
                :key="i"
                class="flex items-start gap-1.5 text-[11px] leading-relaxed"
              >
                <CheckCircle2 class="w-3.5 h-3.5 shrink-0 mt-0.5" :class="card.tone.check" />
                <span>
                  <span class="font-bold text-slate-700">{{ r.label }}</span>
                  <span class="text-slate-500"> · {{ r.value }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 进入工作台演示 -->
        <div class="px-5 pb-5 sm:px-6 sm:pb-6">
          <button
            type="button"
            class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="demoBtnClass"
            @click="openDemo(card.stage.id)"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            进入工作台演示
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
