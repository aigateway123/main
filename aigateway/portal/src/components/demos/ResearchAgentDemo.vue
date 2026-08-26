<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  Play,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  Circle,
  Terminal,
  ArrowRight,
  RotateCcw,
  Loader2,
  Compass,
  Cpu,
  BookOpen,
  Target,
  Gauge,
  Star,
  ChevronDown,
  Zap,
  Database,
  Lightbulb,
} from 'lucide-vue-next'
import {
  TOPIC_BREAKDOWNS,
  DIRECTIONS_BY_TOPIC,
  buildGenericDirections,
  type TopicDirections,
  type ResearchDirection,
} from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ---------------------------------------------------------------- 状态
const phase = ref<'select' | 'running' | 'result'>('select')
const useCustom = ref(false)
const selectedPresetId = ref<string>(TOPIC_BREAKDOWNS[0]?.id ?? '')
const customTopic = ref('')
const isGeneric = ref(false)

const directions = ref<TopicDirections | null>(null)
const stepState = ref<('pending' | 'running' | 'done')[]>(['pending', 'pending', 'pending', 'pending'])
const typedHot = ref('')
const shownGaps = ref(0)
const dirShown = ref(0)
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
  typedHot.value = ''
  shownGaps.value = 0
  dirShown.value = 0
  agentLogs.value = []
}

// ---------------------------------------------------------------- 开始
const startResearch = () => {
  if (!canStart.value) return
  if (useCustom.value) {
    directions.value = buildGenericDirections(customTopic.value)
    isGeneric.value = true
  } else {
    directions.value = DIRECTIONS_BY_TOPIC[selectedPreset.value.id] ?? buildGenericDirections(currentTopic.value)
    isGeneric.value = false
  }
  resetRun()
  phase.value = 'running'
  runSteps(directions.value)
}

// ---------------------------------------------------------------- 编排动画
const startTyping = (full: string) => {
  typedHot.value = ''
  let idx = 0
  const id = every(() => {
    idx += 1
    typedHot.value = full.slice(0, idx)
    if (idx >= full.length) {
      clearInterval(id)
      intervals.delete(id)
    }
  }, 16)
}

const runSteps = (data: TopicDirections) => {
  agentLogs.value.push(`[orchestrator] 已接收科研问题：「${data.topic}」`)
  agentLogs.value.push(`[orchestrator] 自动编排启动 → literature / analysis 并行分发任务`)

  // Step 1: 任务编排
  later(() => {
    stepState.value[0] = 'running'
  }, 400)
  later(() => {
    stepState.value[0] = 'done'
    agentLogs.value.push(`[orchestrator] 任务编排完成 → 已向 Literature / Analysis Agent 下发指令`)
    stepState.value[1] = 'running'
  }, 1500)

  // Step 2: 文献图谱扫描（打字机）
  const hotFull = data.hotSpots.join('  ·  ')
  const hotDuration = hotFull.length * 16
  later(() => startTyping(hotFull), 1700)
  later(() => {
    stepState.value[1] = 'done'
    agentLogs.value.push(`[literature] 文献图谱扫描完成 → 提取 ${data.hotSpots.length} 类研究热点`)
    stepState.value[2] = 'running'
  }, 1700 + hotDuration + 300)

  // Step 3: 研究空白识别（逐行）
  later(() => {
    let i = 0
    const tick = () => {
      i += 1
      shownGaps.value = i
      if (i < data.gaps.length) {
        later(tick, 320)
      } else {
        stepState.value[2] = 'done'
        agentLogs.value.push(`[analysis] 研究空白识别完成 → 定位 ${data.gaps.length} 项关键空白`)
        stepState.value[3] = 'running'
        let j = 0
        const tickF = () => {
          j += 1
          dirShown.value = j
          if (j < data.directions.length) {
            later(tickF, 340)
          } else {
            stepState.value[3] = 'done'
            agentLogs.value.push(
              `[reviewer] 方向评估完成 → 综合研判「${data.conclusion}」`,
            )
            later(() => {
              phase.value = 'result'
            }, 500)
          }
        }
        later(tickF, 400)
      }
    }
    later(tick, 400)
  }, 1700 + hotDuration + 600)
}

// ---------------------------------------------------------------- 结果视图辅助
const restart = () => {
  resetRun()
  directions.value = null
  phase.value = 'select'
}
const handoff = () => emit('handoff')

const STEP_ICONS = [Cpu, BookOpen, Target, Gauge]
const STEP_TITLES = ['任务编排', '文献图谱扫描', '研究空白识别', '方向机会评估']
const STEP_DESCS = ['分发子任务给多 Agent', '检索领域文献与热点', '定位尚未解决的关键空白', '研究价值 / 可行性综合评分']

// 方向卡片展开（默认展开第一个）
const expandedDir = ref<string | null>(null)

const ratingMeta: { key: keyof ResearchDirection['ratings']; label: string }[] = [
  { key: 'researchValue', label: '研究价值' },
  { key: 'innovationSpace', label: '创新空间' },
  { key: 'dataAvailability', label: '数据可得性' },
  { key: 'experimentDifficulty', label: '实验难度' },
]

const dirScore = (d: ResearchDirection) => {
  const r = d.ratings
  return Math.round(((r.researchValue + r.innovationSpace + r.dataAvailability + r.experimentDifficulty) / 4) * 20)
}

const DIR_BAR = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500']
</script>

<template>
  <div class="min-h-full">
    <!-- ==================== 阶段 1：选择研究问题 ==================== -->
    <div v-if="phase === 'select'" class="p-6 sm:p-8 space-y-6">
      <div class="text-center">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700">
          <FlaskConical class="w-3.5 h-3.5" />
          Research Agent 节点 · 交互演示
        </div>
        <h4 class="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900">自动编排 · 判断方向与研究空白</h4>
        <p class="mt-1.5 text-sm text-slate-500 max-w-lg mx-auto">
          输入科研问题，Research Agent 将自动编排多 Agent 完成文献调研与方向研判，输出高价值研究方向
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
              ? 'border-indigo-400 ring-2 ring-indigo-500/20 bg-indigo-50/50'
              : 'border-slate-200 hover:border-indigo-300 bg-white'
          "
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {{ b.domain }}
              </span>
              <p class="mt-2 text-sm font-semibold text-slate-800 leading-snug">{{ b.topic }}</p>
            </div>
            <CheckCircle2
              v-if="selectedPresetId === b.id"
              class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5"
            />
          </div>
        </button>
      </div>

      <!-- 自由输入 -->
      <div v-else class="max-w-2xl mx-auto">
        <div class="relative rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
          <Compass class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none" />
          <input
            v-model="customTopic"
            @keyup.enter="startResearch"
            placeholder="例如：如何提升大模型在长文本上的推理准确性？"
            class="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <p class="mt-2.5 text-xs text-slate-400 text-center">自由输入将基于通用研究方向模板演示编排过程</p>
      </div>

      <!-- CTA -->
      <div class="flex justify-center pt-2">
        <button
          @click="startResearch"
          :disabled="!canStart"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play class="w-4 h-4 fill-current" />
          开始自动编排
        </button>
      </div>
    </div>

    <!-- ==================== 阶段 2：自动编排 ==================== -->
    <div v-else-if="phase === 'running'" class="p-6 sm:p-8 space-y-5">
      <!-- 主题头部 -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="animate-pulse h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
          <h4 class="text-sm sm:text-base font-bold text-slate-900 truncate">{{ directions?.topic }}</h4>
          <span
            v-if="isGeneric"
            class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0"
          >
            通用模板
          </span>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
          <FlaskConical class="w-3.5 h-3.5" />
          Nova Research Agent · 方向研判
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <!-- 左：4 步编排流水线 -->
        <div class="space-y-4">
          <div
            v-for="(s, idx) in STEP_TITLES"
            :key="idx"
            class="rounded-2xl border p-4 transition-colors"
            :class="
              stepState[idx] === 'done'
                ? 'border-emerald-200 bg-emerald-50/40'
                : stepState[idx] === 'running'
                ? 'border-indigo-300 bg-indigo-50/40 ring-1 ring-indigo-400/30'
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
                    ? 'bg-indigo-600 text-white'
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
                <!-- Step 1 任务编排详情 -->
                <div v-if="idx === 0 && stepState[0] === 'done' && directions" class="mt-2.5 flex flex-wrap gap-2">
                  <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    → Literature Agent · 文献调研
                  </span>
                  <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    → Analysis Agent · 空白识别
                  </span>
                  <span class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    → Reviewer Agent · 综合评估
                  </span>
                </div>
                <!-- Step 2 热点打字机 -->
                <div v-else-if="idx === 1" class="mt-2.5">
                  <div
                    class="font-mono text-xs text-slate-700 bg-white/80 border border-slate-200/80 rounded-lg p-3 whitespace-pre-wrap leading-relaxed min-h-[3.5rem]"
                  >
                    <span>{{ typedHot }}</span>
                    <span
                      v-if="stepState[1] === 'running'"
                      class="inline-block w-1.5 h-3.5 bg-indigo-500 align-middle ml-0.5 animate-pulse"
                    />
                    <span v-if="typedHot.length === 0 && stepState[1] !== 'running'" class="text-slate-300 italic">
                      正在扫描领域文献图谱...
                    </span>
                  </div>
                </div>
                <!-- Step 3 空白逐行 -->
                <div v-else-if="idx === 2" class="mt-2.5 space-y-1.5">
                  <div
                    v-for="(g, gi) in (directions?.gaps ?? []).slice(0, shownGaps)"
                    :key="gi"
                    class="flex items-center gap-2 text-xs bg-white/80 border border-slate-200/80 rounded-lg px-3 py-1.5"
                  >
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 text-rose-600 border-rose-200 shrink-0">
                      GAP {{ gi + 1 }}
                    </span>
                    <span class="font-semibold text-slate-800">{{ g }}</span>
                  </div>
                  <span v-if="shownGaps === 0 && stepState[2] !== 'done'" class="text-xs text-slate-300 italic">
                    正在交叉比对文献结论...
                  </span>
                </div>
                <!-- Step 4 方向评分条 -->
                <div v-else-if="idx === 3" class="mt-2.5 space-y-2">
                  <div
                    v-for="(d, di) in (directions?.directions ?? []).slice(0, dirShown)"
                    :key="d.id"
                    class="flex items-center gap-2.5"
                  >
                    <span class="text-[11px] font-semibold text-slate-600 w-14 shrink-0 truncate">{{ d.code }}</span>
                    <div class="flex-1 h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-700"
                        :class="DIR_BAR[di % 3]"
                        :style="{ width: dirScore(d) + '%' }"
                      />
                    </div>
                    <span class="text-[11px] font-mono font-bold text-slate-700 w-8 text-right">{{ dirScore(d) }}</span>
                  </div>
                  <span v-if="dirShown === 0 && stepState[3] !== 'done'" class="text-xs text-slate-300 italic">
                    正在评估方向机会...
                  </span>
                </div>
              </div>
              <!-- 状态 -->
              <div class="shrink-0">
                <CheckCircle2 v-if="stepState[idx] === 'done'" class="w-5 h-5 text-emerald-500" />
                <Loader2 v-else-if="stepState[idx] === 'running'" class="w-5 h-5 text-indigo-500 animate-spin" />
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

    <!-- ==================== 阶段 3：方向研究报告 ==================== -->
    <div v-else class="p-6 sm:p-8 space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 class="w-3.5 h-3.5" />
            方向研判完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">研究报告已生成</h4>
          <p class="mt-1 text-sm text-slate-500">Research Agent 已完成文献调研与空白分析，输出研究机会评估报告</p>
        </div>
        <span
          v-if="isGeneric"
          class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0"
        >
          通用模板
        </span>
      </div>

      <!-- 结论卡 -->
      <div class="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 p-5">
        <div class="flex items-center gap-1.5">
          <Zap class="w-3.5 h-3.5 text-indigo-600" />
          <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">综合研判结论</span>
        </div>
        <p class="mt-2 text-sm sm:text-base font-bold text-slate-900 leading-relaxed">{{ directions?.conclusion }}</p>
      </div>

      <!-- 热点 & 空白 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="rounded-2xl border border-slate-200 p-4">
          <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
            <BookOpen class="w-3.5 h-3.5 text-blue-600" />
            研究热点 · Hot Spots
          </h5>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="h in directions?.hotSpots"
              :key="h"
              class="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
            >
              {{ h }}
            </span>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 p-4">
          <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
            <Target class="w-3.5 h-3.5 text-rose-500" />
            研究空白 · Research Gaps
          </h5>
          <ul class="space-y-1.5">
            <li
              v-for="(g, i) in directions?.gaps"
              :key="i"
              class="flex items-start gap-2 text-xs text-slate-700"
            >
              <span class="mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 text-rose-600 border-rose-200 shrink-0">
                GAP {{ i + 1 }}
              </span>
              {{ g }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 方向机会卡片 -->
      <div>
        <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
          <Lightbulb class="w-3.5 h-3.5 text-indigo-600" />
          研究方向机会 · {{ directions?.directions.length }} 个方向
        </h5>
        <div class="space-y-3">
          <div
            v-for="(d, di) in directions?.directions"
            :key="d.id"
            class="rounded-2xl border transition-all duration-200 overflow-hidden"
            :class="expandedDir === d.id ? 'border-indigo-300 shadow-sm ring-1 ring-indigo-500/10' : 'border-slate-200 hover:border-indigo-200'"
          >
            <!-- 卡片头部 -->
            <button
              @click="expandedDir = expandedDir === d.id ? null : d.id"
              class="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
            >
              <span
                class="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg text-white"
                :class="[di === 0 ? 'bg-blue-600' : di === 1 ? 'bg-indigo-600' : 'bg-violet-600']"
              >
                {{ d.code }}
              </span>
              <div class="flex-1 min-w-0">
                <h6 class="text-sm font-bold text-slate-900">{{ d.title }}</h6>
                <p class="text-[11px] text-slate-400 truncate">{{ d.subtitle }}</p>
              </div>
              <!-- 综合分 -->
              <div class="shrink-0 text-center">
                <div class="text-lg font-extrabold text-indigo-600 leading-none">{{ dirScore(d) }}</div>
                <div class="text-[9px] text-slate-400 font-semibold mt-0.5">综合分</div>
              </div>
              <ChevronDown
                class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
                :class="expandedDir === d.id ? 'rotate-180 text-indigo-600' : ''"
              />
            </button>

            <!-- 展开详情 -->
            <div v-if="expandedDir === d.id" class="border-t border-slate-100 px-4 py-4 animate-in fade-in duration-200 space-y-4">
              <!-- 评分 -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div
                  v-for="r in ratingMeta"
                  :key="r.key"
                  class="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2"
                >
                  <div class="text-[10px] font-semibold text-slate-500">{{ r.label }}</div>
                  <div class="flex items-center gap-0.5 mt-1">
                    <Star
                      v-for="n in 5"
                      :key="n"
                      class="w-3 h-3"
                      :class="n <= d.ratings[r.key] ? 'fill-amber-400 text-amber-400' : 'text-slate-300'"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div class="text-[11px] font-bold text-slate-700 mb-1">方向描述</div>
                <p class="text-xs text-slate-600 leading-relaxed">{{ d.description }}</p>
              </div>

              <div>
                <div class="text-[11px] font-bold text-slate-700 mb-1.5">关键挑战</div>
                <ul class="space-y-1">
                  <li v-for="(c, ci) in d.keyChallenges" :key="ci" class="flex items-start gap-2 text-xs text-slate-600">
                    <span class="mt-1.5 h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                    {{ c }}
                  </li>
                </ul>
              </div>

              <div class="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3">
                <div class="text-[11px] font-bold text-indigo-700 mb-1">突破点</div>
                <p class="text-xs text-indigo-900 leading-relaxed">{{ d.breakthroughPoint }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div class="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5">
                    <Database class="w-3 h-3 text-slate-400" />
                    推荐数据集
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">{{ d.recommendedDataset }}</p>
                </div>
                <div class="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div class="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5">
                    <Sparkles class="w-3 h-3 text-slate-400" />
                    推荐方法 / 模型
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="m in d.recommendedModels"
                      :key="m"
                      class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                    >
                      {{ m }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-bold text-emerald-700 shrink-0">预期影响</span>
                <span class="text-xs text-emerald-800 leading-relaxed">{{ d.expectedImpact }}</span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="t in d.tags"
                  :key="t"
                  class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500"
                >
                  # {{ t }}
                </span>
              </div>
            </div>
          </div>
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
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
        >
          方向已明确 → 交给 Coding Agent
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
