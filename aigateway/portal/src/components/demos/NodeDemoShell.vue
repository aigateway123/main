<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  Play,
  CheckCircle2,
  Circle,
  Terminal,
  Loader2,
  Compass,
  Sparkles,
} from 'lucide-vue-next'
import { TOPIC_BREAKDOWNS, type SelectPayload } from '@/data/nodeDemos'

const props = withDefaults(
  defineProps<{
    badge: string
    title: string
    desc: string
    steps: { title: string; desc: string }[]
    stepLogs: string[][]
    accent?: string
  }>(),
  { accent: 'blue' },
)

const emit = defineEmits<{
  (e: 'select', p: SelectPayload): void
  (e: 'finish'): void
}>()

// ---------------------------------------------------------------- 状态
const phase = ref<'select' | 'running' | 'result'>('select')
const useCustom = ref(false)
const selectedPresetId = ref<string>(TOPIC_BREAKDOWNS[0]?.id ?? '')
const customTopic = ref('')
const stepState = ref<('pending' | 'running' | 'done')[]>(props.steps.map(() => 'pending'))
const agentLogs = ref<string[]>([])
const logPanel = ref<HTMLElement | null>(null)

const selectedPreset = computed(
  () => TOPIC_BREAKDOWNS.find((b) => b.id === selectedPresetId.value) ?? TOPIC_BREAKDOWNS[0],
)
const currentTopic = computed(() =>
  useCustom.value ? customTopic.value : (selectedPreset.value?.topic ?? ''),
)
const canStart = computed(() => currentTopic.value.trim().length > 0)

// ---------------------------------------------------------------- 主题色映射
const ACCENTS: Record<string, { sel: string; chip: string; cta: string; run: string; bar: string }> = {
  blue: {
    sel: 'border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/50',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    cta: 'from-blue-600 to-indigo-600 shadow-blue-600/25',
    run: 'bg-blue-600',
    bar: 'bg-blue-500',
  },
  indigo: {
    sel: 'border-indigo-400 ring-2 ring-indigo-500/20 bg-indigo-50/50',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    cta: 'from-indigo-600 to-violet-600 shadow-indigo-600/25',
    run: 'bg-indigo-600',
    bar: 'bg-indigo-500',
  },
  emerald: {
    sel: 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/50',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cta: 'from-emerald-600 to-teal-600 shadow-emerald-600/25',
    run: 'bg-emerald-600',
    bar: 'bg-emerald-500',
  },
  amber: {
    sel: 'border-amber-400 ring-2 ring-amber-500/20 bg-amber-50/50',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    cta: 'from-amber-500 to-orange-600 shadow-amber-500/25',
    run: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  rose: {
    sel: 'border-rose-400 ring-2 ring-rose-500/20 bg-rose-50/50',
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
    cta: 'from-rose-500 to-pink-600 shadow-rose-500/25',
    run: 'bg-rose-500',
    bar: 'bg-rose-500',
  },
  violet: {
    sel: 'border-violet-400 ring-2 ring-violet-500/20 bg-violet-50/50',
    chip: 'bg-violet-50 text-violet-700 border-violet-200',
    cta: 'from-violet-600 to-purple-600 shadow-violet-600/25',
    run: 'bg-violet-600',
    bar: 'bg-violet-500',
  },
  cyan: {
    sel: 'border-cyan-400 ring-2 ring-cyan-500/20 bg-cyan-50/50',
    chip: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    cta: 'from-cyan-500 to-sky-600 shadow-cyan-500/25',
    run: 'bg-cyan-600',
    bar: 'bg-cyan-500',
  },
}
const acc = computed(() => ACCENTS[props.accent] ?? ACCENTS.blue)

// ---------------------------------------------------------------- 定时器管理
const timers = new Set<ReturnType<typeof setTimeout>>()
const later = (fn: () => void, ms: number) => {
  const t = setTimeout(fn, ms)
  timers.add(t)
}
onBeforeUnmount(() => timers.forEach(clearTimeout))

watch(
  agentLogs,
  () => {
    nextTick(() => {
      if (logPanel.value) logPanel.value.scrollTop = logPanel.value.scrollHeight
    })
  },
  { flush: 'sync' },
)

const resetRun = () => {
  timers.forEach(clearTimeout)
  timers.clear()
  stepState.value = props.steps.map(() => 'pending')
  agentLogs.value = []
}

// ---------------------------------------------------------------- 开始
const start = () => {
  if (!canStart.value) return
  emit('select', {
    topicId: useCustom.value ? 'custom' : selectedPreset.value.id,
    topic: currentTopic.value,
    isGeneric: useCustom.value,
  })
  resetRun()
  phase.value = 'running'
  props.steps.forEach((_, i) => {
    later(() => {
      stepState.value[i] = 'running'
    }, 300 + i * 900)
    later(() => {
      stepState.value[i] = 'done'
      ;(props.stepLogs[i] ?? []).forEach((l) => agentLogs.value.push(l))
      if (i === props.steps.length - 1) {
        emit('finish')
        later(() => {
          phase.value = 'result'
        }, 600)
      }
    }, 300 + i * 900 + 700)
  })
}

const restart = () => {
  resetRun()
  phase.value = 'select'
}
</script>

<template>
  <div class="min-h-full">
    <!-- ==================== 阶段 1：选择研究问题 ==================== -->
    <div v-if="phase === 'select'" class="p-6 sm:p-8 space-y-6">
      <div class="text-center">
        <div
          class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
          :class="acc.chip"
        >
          <Sparkles class="w-3.5 h-3.5" />
          {{ badge }}
        </div>
        <h4 class="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900">{{ title }}</h4>
        <p class="mt-1.5 text-sm text-slate-500 max-w-lg mx-auto">{{ desc }}</p>
      </div>

      <!-- 预置 / 自由输入 切换 -->
      <div class="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit mx-auto">
        <button
          @click="useCustom = false"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          :class="useCustom ? 'text-slate-500' : 'bg-white shadow-sm text-slate-900'"
        >
          预置问题
        </button>
        <button
          @click="useCustom = true"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          :class="useCustom ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'"
        >
          自由输入
        </button>
      </div>

      <!-- 预置问题卡片 -->
      <div v-if="!useCustom" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="b in TOPIC_BREAKDOWNS"
          :key="b.id"
          @click="selectedPresetId = b.id"
          class="text-left p-4 rounded-2xl border transition-all cursor-pointer"
          :class="selectedPresetId === b.id ? acc.sel : 'border-slate-200 hover:border-blue-300 bg-white'"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border" :class="acc.chip">
                {{ b.domain }}
              </span>
              <p class="mt-2 text-sm font-semibold text-slate-800 leading-snug">{{ b.topic }}</p>
            </div>
            <CheckCircle2 v-if="selectedPresetId === b.id" class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          </div>
        </button>
      </div>

      <!-- 自由输入 -->
      <div v-else class="max-w-2xl mx-auto">
        <div class="relative rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
          <Compass class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            v-model="customTopic"
            @keyup.enter="start"
            placeholder="例如：如何提升大模型在长文本上的推理准确性？"
            class="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <p class="mt-2.5 text-xs text-slate-400 text-center">自由输入将基于通用模板演示该环节的 Agent 工作流</p>
      </div>

      <!-- CTA -->
      <div class="flex justify-center pt-2">
        <button
          @click="start"
          :disabled="!canStart"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r text-white font-semibold text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          :class="acc.cta"
        >
          <Play class="w-4 h-4 fill-current" />
          开始演示
        </button>
      </div>
    </div>

    <!-- ==================== 阶段 2：Agent 工作流 ==================== -->
    <div v-else-if="phase === 'running'" class="p-6 sm:p-8 space-y-5">
      <!-- 主题头部 -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="animate-pulse h-2 w-2 rounded-full shrink-0" :class="acc.bar" />
          <h4 class="text-sm sm:text-base font-bold text-slate-900 truncate">{{ currentTopic }}</h4>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
          <Terminal class="w-3.5 h-3.5" />
          Nova Research Agent · {{ badge }}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <!-- 左：流水线步骤 -->
        <div class="space-y-4">
          <div
            v-for="(s, idx) in steps"
            :key="idx"
            class="rounded-2xl border p-4 transition-colors"
            :class="
              stepState[idx] === 'done'
                ? 'border-emerald-200 bg-emerald-50/40'
                : stepState[idx] === 'running'
                ? 'border-blue-300 bg-blue-50/40 ring-1 ring-blue-400/30'
                : 'border-slate-200 bg-white'
            "
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors"
                :class="
                  stepState[idx] === 'done'
                    ? 'bg-emerald-500 text-white'
                    : stepState[idx] === 'running'
                    ? acc.run + ' text-white'
                    : 'bg-slate-200 text-slate-500'
                "
              >
                <span class="text-sm font-extrabold">{{ String(idx + 1).padStart(2, '0') }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-slate-900">{{ s.title }}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ s.desc }}</div>
              </div>
              <div class="shrink-0">
                <CheckCircle2 v-if="stepState[idx] === 'done'" class="w-5 h-5 text-emerald-500" />
                <Loader2 v-else-if="stepState[idx] === 'running'" class="w-5 h-5 text-blue-500 animate-spin" />
                <Circle v-else class="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右：Agent 通讯总线 -->
        <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-800 text-xs shrink-0">
            <Terminal class="w-3.5 h-3.5 text-emerald-400" />
            <span class="font-mono font-semibold text-slate-200">Agent 通讯总线</span>
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping ml-auto"></span>
          </div>
          <div ref="logPanel" class="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-[340px]">
            <div v-if="agentLogs.length === 0" class="text-slate-500 italic">总线就绪，等待问题注入...</div>
            <div v-for="(line, i) in agentLogs" :key="i">{{ line }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 阶段 3：结果（节点插槽） ==================== -->
    <div v-else class="p-6 sm:p-8 space-y-6">
      <slot name="result" />
    </div>
  </div>
</template>
