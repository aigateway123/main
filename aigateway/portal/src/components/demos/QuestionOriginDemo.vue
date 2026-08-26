<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  Play,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Circle,
  Terminal,
  ArrowRight,
  RotateCcw,
  Loader2,
  Compass,
  Cpu,
  GitBranch,
  Table2,
  Gauge,
} from 'lucide-vue-next'
import {
  TOPIC_BREAKDOWNS,
  buildGenericBreakdown,
  type TopicBreakdown,
} from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ---------------------------------------------------------------- 状态
const phase = ref<'select' | 'running' | 'result'>('select')
const useCustom = ref(false)
const selectedPresetId = ref<string>(TOPIC_BREAKDOWNS[0]?.id ?? '')
const customTopic = ref('')

const liveChecked = ref(false)
const liveEnabled = ref(false)
const resolving = ref(false)
const useLiveData = ref(false)
const breakdown = ref<TopicBreakdown | null>(null)

const stepState = ref<('pending' | 'running' | 'done')[]>(['pending', 'pending', 'pending', 'pending'])
const typedSub = ref('')
const shownVars = ref(0)
const feaShown = ref(0)
const agentLogs = ref<string[]>([])
const logPanel = ref<HTMLElement | null>(null)

const selectedPreset = computed(
  () => TOPIC_BREAKDOWNS.find((b) => b.id === selectedPresetId.value) ?? TOPIC_BREAKDOWNS[0],
)
const currentTopic = computed(() =>
  useCustom.value ? customTopic.value : (selectedPreset.value?.topic ?? ''),
)
const canStart = computed(() => currentTopic.value.trim().length > 0)

// ---------------------------------------------------------------- 定时器管理
const timers = new Set<ReturnType<typeof setTimeout>>()
const intervals = new Set<ReturnType<typeof setInterval>>()
const later = (fn: () => void, ms: number) => {
  const t = setTimeout(fn, ms)
  timers.add(t)
}
const every = (fn: () => void, ms: number) => {
  const t = setInterval(fn, ms)
  intervals.add(t)
  return t
}
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  intervals.forEach(clearInterval)
})

// 通讯日志自动滚动到底部
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
  intervals.forEach(clearInterval)
  intervals.clear()
  stepState.value = ['pending', 'pending', 'pending', 'pending']
  typedSub.value = ''
  shownVars.value = 0
  feaShown.value = 0
  agentLogs.value = []
}

// ---------------------------------------------------------------- 数据解析
const resolveCustom = async (topic: string): Promise<TopicBreakdown> => {
  if (!liveChecked.value) {
    try {
      const r = await fetch('/api/demo/live')
      const j = (await r.json()) as { enabled?: boolean }
      liveEnabled.value = !!j?.enabled
    } catch {
      liveEnabled.value = false
    }
    liveChecked.value = true
  }
  if (!liveEnabled.value) return buildGenericBreakdown(topic)
  try {
    const res = await fetch('/api/demo/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return buildGenericBreakdown(topic)
    const json = (await res.json()) as { source?: string; breakdown?: TopicBreakdown }
    if (json?.source === 'deepseek' && json?.breakdown) {
      useLiveData.value = true
      return json.breakdown
    }
    return buildGenericBreakdown(topic)
  } catch {
    return buildGenericBreakdown(topic)
  }
}

// ---------------------------------------------------------------- 开始
const startResearch = async () => {
  if (!canStart.value || resolving.value) return
  let data: TopicBreakdown
  if (useCustom.value) {
    resolving.value = true
    data = await resolveCustom(customTopic.value)
    resolving.value = false
  } else {
    data = selectedPreset.value!
    useLiveData.value = false
  }
  breakdown.value = data
  resetRun()
  phase.value = 'running'
  runSteps(data)
}

// ---------------------------------------------------------------- 拆解动画
const startTyping = (full: string) => {
  typedSub.value = ''
  let idx = 0
  const id = every(() => {
    idx += 1
    typedSub.value = full.slice(0, idx)
    if (idx >= full.length) {
      clearInterval(id)
      intervals.delete(id)
    }
  }, 16)
}

const runSteps = (data: TopicBreakdown) => {
  agentLogs.value.push(`[orchestrator] 已接收科研问题：「${data.topic}」`)
  agentLogs.value.push(`[orchestrator] 进入问题拆解流水线 → understand / decompose / variables / feasibility`)

  // Step 1: 问题理解
  later(() => {
    stepState.value[0] = 'running'
  }, 400)
  later(() => {
    stepState.value[0] = 'done'
    agentLogs.value.push(`[orchestrator] 领域识别完成 → ${data.domain}`)
    agentLogs.value.push(`[orchestrator] 任务类型判定 → ${data.taskType}`)
    stepState.value[1] = 'running'
  }, 1600)

  // Step 2: 科学问题降维（打字机）
  const typeFull = data.subQuestions.join('\n')
  const typeDuration = typeFull.length * 16
  later(() => startTyping(typeFull), 1800)
  later(() => {
    stepState.value[1] = 'done'
    agentLogs.value.push(`[orchestrator] 科学问题降维完成 → 拆出 ${data.subQuestions.length} 个子问题`)
    stepState.value[2] = 'running'
  }, 1800 + typeDuration + 300)

  // Step 3: 变量抽取（逐行填充）
  const varCount =
    data.variables.independent.length +
    data.variables.dependent.length +
    data.variables.control.length
  later(() => {
    let i = 0
    const tick = () => {
      i += 1
      shownVars.value = i
      if (i < varCount) {
        later(tick, 200)
      } else {
        stepState.value[2] = 'done'
        agentLogs.value.push(
          `[analysis] 变量抽取完成 → ${data.variables.independent.length} 自变量 / ${data.variables.dependent.length} 因变量 / ${data.variables.control.length} 控制变量`,
        )
        stepState.value[3] = 'running'
        let j = 0
        const tickF = () => {
          j += 1
          feaShown.value = j
          if (j < 3) {
            later(tickF, 280)
          } else {
            stepState.value[3] = 'done'
            const score = Math.round(
              (data.feasibility.data + data.feasibility.method + data.feasibility.compute) / 3,
            )
            agentLogs.value.push(`[reviewer] 可行性初判完成 → 综合评分 ${score}/100`)
            agentLogs.value.push(`[reviewer] 结论：问题定义清晰，可进入 Research Agent 编排`)
            later(() => {
              phase.value = 'result'
            }, 500)
          }
        }
        later(tickF, 400)
      }
    }
    later(tick, 400)
  }, 1800 + typeDuration + 500)
}

// ---------------------------------------------------------------- 结果视图辅助
const restart = () => {
  resetRun()
  breakdown.value = null
  phase.value = 'select'
}
const handoff = () => emit('handoff')

const STEP_ICONS = [Cpu, GitBranch, Table2, Gauge]
const STEP_TITLES = ['问题理解', '科学问题降维', '变量抽取', '可行性初判']
const STEP_DESCS = ['识别研究领域与任务类型', '拆解为可独立研究的子问题', '自变量 / 因变量 / 控制变量', '数据 / 方法 / 算力评估']

const varRows = computed(() => {
  const d = breakdown.value
  if (!d) return []
  return [
    ...d.variables.independent.map((v) => ({ ...v, cat: 'independent' as const })),
    ...d.variables.dependent.map((v) => ({ ...v, cat: 'dependent' as const })),
    ...d.variables.control.map((v) => ({ ...v, cat: 'control' as const })),
  ]
})
const CAT_LABEL: Record<string, string> = { independent: '自变量', dependent: '因变量', control: '控制变量' }
const CAT_CHIP: Record<string, string> = {
  independent: 'bg-blue-50 text-blue-700 border-blue-200',
  dependent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  control: 'bg-amber-50 text-amber-700 border-amber-200',
}
const CAT_BAR: Record<string, string> = {
  independent: 'bg-blue-500',
  dependent: 'bg-emerald-500',
  control: 'bg-amber-500',
}
const FEAS_BAR: Record<string, string> = {
  data: 'bg-blue-500',
  method: 'bg-indigo-500',
  compute: 'bg-violet-500',
}

const feasibilityMeta = computed(() => {
  const d = breakdown.value
  if (!d) return []
  return [
    { key: 'data', label: '数据可得性', value: d.feasibility.data, note: d.feasibility.dataNote },
    { key: 'method', label: '方法匹配度', value: d.feasibility.method, note: d.feasibility.methodNote },
    { key: 'compute', label: '算力评估', value: d.feasibility.compute, note: d.feasibility.computeNote },
  ]
})
const overallScore = computed(() => {
  const d = breakdown.value
  if (!d) return 0
  return Math.round((d.feasibility.data + d.feasibility.method + d.feasibility.compute) / 3)
})
</script>

<template>
  <div class="min-h-full">
    <!-- ==================== 阶段 1：提出问题 ==================== -->
    <div v-if="phase === 'select'" class="p-6 sm:p-8 space-y-6">
      <div class="text-center">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
          <Lightbulb class="w-3.5 h-3.5" />
          起点节点 · 交互演示
        </div>
        <h4 class="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900">提出一个科研问题</h4>
        <p class="mt-1.5 text-sm text-slate-500 max-w-lg mx-auto">
          选择预置问题，或输入你自己的科研问题，看 Research Agent 如何把它拆解成可研究的方向
        </p>
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
          :class="
            selectedPresetId === b.id
              ? 'border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/50'
              : 'border-slate-200 hover:border-blue-300 bg-white'
          "
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {{ b.domain }}
              </span>
              <p class="mt-2 text-sm font-semibold text-slate-800 leading-snug">{{ b.topic }}</p>
            </div>
            <CheckCircle2
              v-if="selectedPresetId === b.id"
              class="w-4 h-4 text-blue-600 shrink-0 mt-0.5"
            />
          </div>
        </button>
      </div>

      <!-- 自由输入 -->
      <div v-else class="max-w-2xl mx-auto">
        <div class="relative rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
          <Compass class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
          <input
            v-model="customTopic"
            @keyup.enter="startResearch"
            placeholder="例如：如何提升大模型在长文本上的推理准确性？"
            class="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <p class="mt-2.5 text-xs text-slate-400 text-center">
          <template v-if="liveChecked && liveEnabled">
            <Sparkles class="inline w-3 h-3 text-blue-500 mr-1" />
            已连接 DeepSeek，自由输入将实时生成拆解内容
          </template>
          <template v-else>未配置 DeepSeek 时，自由输入将使用通用拆解模板演示</template>
        </p>
      </div>

      <!-- CTA -->
      <div class="flex justify-center pt-2">
        <button
          @click="startResearch"
          :disabled="!canStart || resolving"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Loader2 v-if="resolving" class="w-4 h-4 animate-spin" />
          <Play v-else class="w-4 h-4 fill-current" />
          {{ resolving ? '正在生成拆解内容...' : '开始研究' }}
        </button>
      </div>
    </div>

    <!-- ==================== 阶段 2：问题拆解 ==================== -->
    <div v-else-if="phase === 'running'" class="p-6 sm:p-8 space-y-5">
      <!-- 主题头部 -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="animate-pulse h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          <h4 class="text-sm sm:text-base font-bold text-slate-900 truncate">{{ breakdown?.topic }}</h4>
          <span
            v-if="useLiveData"
            class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
          >
            DeepSeek 实时生成
          </span>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
          <Cpu class="w-3.5 h-3.5" />
          Nova Research Agent · 问题拆解
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <!-- 左：4 步拆解流水线 -->
        <div class="space-y-4">
          <div
            v-for="(s, idx) in STEP_TITLES"
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                "
              >
                <component :is="STEP_ICONS[idx]" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-slate-900">{{ s }}</span>
                  <span class="text-[10px] text-slate-400 font-mono">{{ STEP_DESCS[idx] }}</span>
                </div>
                <!-- Step 1 详情 -->
                <div v-if="idx === 0 && stepState[0] === 'done' && breakdown" class="mt-2.5 flex flex-wrap gap-2">
                  <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    领域：{{ breakdown.domain }}
                  </span>
                  <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    任务类型：{{ breakdown.taskType }}
                  </span>
                </div>
                <!-- Step 2 打字机 -->
                <div v-else-if="idx === 1" class="mt-2.5">
                  <div
                    class="font-mono text-xs text-slate-700 bg-white/80 border border-slate-200/80 rounded-lg p-3 whitespace-pre-wrap leading-relaxed min-h-[3.5rem]"
                  >
                    <span>{{ typedSub }}</span>
                    <span
                      v-if="stepState[1] === 'running'"
                      class="inline-block w-1.5 h-3.5 bg-blue-500 align-middle ml-0.5 animate-pulse"
                    />
                    <span v-if="typedSub.length === 0 && stepState[1] !== 'running'" class="text-slate-300 italic">
                      等待子问题输出...
                    </span>
                  </div>
                </div>
                <!-- Step 3 变量逐行填充 -->
                <div v-else-if="idx === 2" class="mt-2.5 space-y-1.5">
                  <div
                    v-for="(row, ri) in varRows.slice(0, shownVars)"
                    :key="ri"
                    class="flex items-center gap-2 text-xs bg-white/80 border border-slate-200/80 rounded-lg px-3 py-1.5"
                  >
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0" :class="CAT_CHIP[row.cat]">
                      {{ CAT_LABEL[row.cat] }}
                    </span>
                    <span class="font-semibold text-slate-800">{{ row.name }}</span>
                    <span class="text-slate-400 truncate">{{ row.desc }}</span>
                  </div>
                  <span v-if="shownVars === 0 && stepState[2] !== 'done'" class="text-xs text-slate-300 italic">
                    正在抽取变量...
                  </span>
                </div>
                <!-- Step 4 可行性评分条 -->
                <div v-else-if="idx === 3" class="mt-2.5 space-y-2">
                  <div v-for="(f, fi) in feasibilityMeta" :key="f.key" class="flex items-center gap-2.5">
                    <span class="text-[11px] font-semibold text-slate-600 w-16 shrink-0">{{ f.label }}</span>
                    <div class="flex-1 h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-700"
                        :class="FEAS_BAR[f.key]"
                        :style="{ width: feaShown >= fi + 1 ? f.value + '%' : '0%' }"
                      />
                    </div>
                    <span class="text-[11px] font-mono font-bold text-slate-700 w-8 text-right">
                      {{ feaShown >= fi + 1 ? f.value : '--' }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- 状态 -->
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

    <!-- ==================== 阶段 3：拆解结果 ==================== -->
    <div v-else class="p-6 sm:p-8 space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 class="w-3.5 h-3.5" />
            问题拆解完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">已准备好进入科研链路</h4>
          <p class="mt-1 text-sm text-slate-500">Research Agent 已完成问题理解与拆解，以下是拆解结果</p>
        </div>
        <span
          v-if="useLiveData"
          class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0"
        >
          DeepSeek 实时生成
        </span>
      </div>

      <!-- 主研究问题 -->
      <div class="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5">
        <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider">主研究问题</span>
        <p class="mt-1.5 text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
          {{ breakdown?.researchQuestion }}
        </p>
      </div>

      <!-- 子问题 -->
      <div>
        <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
          <GitBranch class="w-3.5 h-3.5 text-blue-600" />
          子问题拆解
        </h5>
        <ol class="space-y-2">
          <li
            v-for="(q, i) in breakdown?.subQuestions"
            :key="i"
            class="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3"
          >
            <span class="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600 text-white text-[10px] font-bold shrink-0 mt-0.5">
              {{ i + 1 }}
            </span>
            <span>{{ q }}</span>
          </li>
        </ol>
      </div>

      <!-- 变量表 -->
      <div>
        <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
          <Table2 class="w-3.5 h-3.5 text-blue-600" />
          变量抽取
        </h5>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div v-for="cat in ['independent', 'dependent', 'control']" :key="cat" class="rounded-2xl border border-slate-200 p-3">
            <div class="flex items-center gap-2 mb-2.5">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border" :class="CAT_CHIP[cat]">
                {{ CAT_LABEL[cat] }}
              </span>
            </div>
            <div class="space-y-1.5">
              <div v-for="(v, vi) in varRows.filter((r) => r.cat === cat)" :key="vi" class="text-xs">
                <div class="font-semibold text-slate-800">{{ v.name }}</div>
                <div class="text-slate-400">{{ v.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 可行性 -->
      <div class="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
        <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <Gauge class="w-3.5 h-3.5 text-blue-600" />
          可行性初判
        </h5>
        <div v-for="f in feasibilityMeta" :key="f.key" class="space-y-1">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-semibold text-slate-600">{{ f.label }}</span>
            <span class="font-mono font-bold text-slate-800">{{ f.value }}/100</span>
          </div>
          <div class="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :class="FEAS_BAR[f.key]" :style="{ width: f.value + '%' }" />
          </div>
          <p class="text-[11px] text-slate-400">{{ f.note }}</p>
        </div>
        <div class="pt-1 flex items-center justify-between rounded-xl bg-white border border-slate-200 px-4 py-2.5">
          <span class="text-xs font-bold text-slate-700">综合可行性评分</span>
          <span class="text-lg font-extrabold text-blue-600">{{ overallScore }}/100</span>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          @click="restart"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
        >
          <RotateCcw class="w-4 h-4" />
          换一个问题重试
        </button>
        <button
          @click="handoff"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
        >
          问题已就绪 → 交给 Research Agent
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
