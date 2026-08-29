<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import {
  FileText,
  UserCheck,
  AlertTriangle,
  Calculator,
  TrendingUp,
  GitCompare,
  CheckSquare,
  FolderTree,
  Activity,
  Award
} from 'lucide-vue-next'
import type { StepKey, TenderAnalysisResult } from '@/data/bidConsultantData'
import { STEP_ORDER, STEP_META } from '@/data/bidConsultantData'

interface Props {
  activeStep: StepKey
  tenderData: TenderAnalysisResult
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select-step', step: StepKey): void
}>()

type BadgeVariant = 'danger' | 'warning' | 'success' | 'info'

interface StepItem {
  key: StepKey
  stepNum: string
  label: string
  icon: Component
  badge?: {
    text: string
    variant: BadgeVariant
  }
}

const STEP_ICONS: Record<StepKey, Component> = {
  overview: FileText,
  qualification: UserCheck,
  risks: AlertTriangle,
  evaluation: Calculator,
  strategy: TrendingUp,
  matrix: GitCompare,
  tasks: CheckSquare,
  proposal: FolderTree,
  healthCheck: Activity,
  report: Award
}

const highRiskCount = computed(() => props.tenderData?.risks?.filter((r) => r.riskLevel === 'high')?.length || 0)
const pendingQualCount = computed(() => props.tenderData?.qualifications?.filter((q) => q.status === '待确认')?.length || 0)

const steps = computed<StepItem[]>(() =>
  STEP_ORDER.map((key, index) => {
    let badge: StepItem['badge']
    if (key === 'qualification' && pendingQualCount.value > 0) {
      badge = { text: `${pendingQualCount.value}项待确认`, variant: 'warning' }
    } else if (key === 'risks' && highRiskCount.value > 0) {
      badge = { text: `${highRiskCount.value}项高危`, variant: 'danger' }
    } else if (key === 'strategy') {
      badge = { text: '+8.5分抓手', variant: 'success' }
    } else if (key === 'healthCheck') {
      badge = { text: `${props.tenderData?.healthCheck?.healthScore || 84}分`, variant: 'info' }
    }
    return {
      key,
      stepNum: String(index + 1).padStart(2, '0'),
      label: STEP_META[key].label,
      icon: STEP_ICONS[key],
      badge
    }
  })
)

const badgeClass = (variant: BadgeVariant) => {
  switch (variant) {
    case 'danger':
      return 'bg-red-100 text-red-700 border border-red-200'
    case 'warning':
      return 'bg-amber-100 text-amber-700 border border-amber-200'
    case 'success':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    default:
      return 'bg-blue-100 text-blue-700 border border-blue-200'
  }
}
</script>

<template>
  <div class="w-full bg-white/90 border-b border-slate-200 backdrop-blur-sm sticky top-16 z-20 overflow-x-auto no-scrollbar shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex items-center space-x-1.5 sm:space-x-2 py-2.5 min-w-max">
        <button
          v-for="step in steps"
          :key="step.key"
          @click="emit('select-step', step.key)"
          class="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
          :class="step.key === activeStep
            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'"
        >
          <div class="flex items-center gap-1.5">
            <span
              :class="`text-[10px] font-mono font-bold ${
                step.key === activeStep ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
              }`"
            >
              {{ step.stepNum }}
            </span>
            <component
              :is="step.icon"
              :class="`w-3.5 h-3.5 ${
                step.key === activeStep ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
              }`"
            />
            <span>{{ step.label }}</span>
          </div>

          <span
            v-if="step.badge"
            :class="`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${badgeClass(step.badge.variant)}`"
          >
            {{ step.badge.text }}
          </span>

          <span v-if="step.key === activeStep" class="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
        </button>
      </nav>
    </div>
  </div>
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
