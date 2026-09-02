<script setup lang="ts">
// AI 环境监测分析师 —— 转译自原型 MonitoringAnalystAgent.tsx
// 时序趋势曲线用纯内联 SVG 双折线 + 虚线 ReferenceLine 实现（无图表库依赖，等价替代 recharts）
import { ref, computed } from 'vue'
import {
  Activity, Building2, FileSpreadsheet, Sparkles, Download,
  AlertCircle, Sliders, HelpCircle,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  MONITORING_CASES, MONITORING_TIME_SERIES, envAgentMetaOf,
  type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('monitoring')
const tone = ENV_TONES.emerald

type MetricKey = 'cod' | 'nh3' | 'tp' | 'do'
type SeriesKey = 'inCod' | 'outCod' | 'inNh3' | 'outNh3' | 'tp' | 'do'

const selectedCaseId = ref<string>(MONITORING_CASES[0].id)
const isExecuting = ref(false)
const activeMetric = ref<MetricKey>('cod')
const activeTab = ref<'trends' | 'events' | 'prescriptions'>('trends')
const showExportModal = ref(false)
const hoverIndex = ref<number | null>(null)

const activeCase = computed(
  () => MONITORING_CASES.find((c) => c.id === selectedCaseId.value) || MONITORING_CASES[0],
)

const EXECUTION_STEPS: EnvExecutionStep[] = [
  {
    id: 1,
    title: '时序数据流清洗与离群点识别',
    description: '清洗 720 个小时连续时序数据，识别 4 处突发数据跳变与 1 处仪器零漂。',
    status: 'completed',
    detailLogs: ['有效数据捕获率 99.8%', '识别出 11月09日-11日 出现周期性夜间高负荷冲击'],
  },
  {
    id: 2,
    title: '多因子关联性因果诊断模型',
    description: '将进水 COD、进水氨氮与生化池 DO、回流比进行多维相关性回归计算。',
    status: 'completed',
    rulesMatched: ['《固定污染源水质在线监控系统运行规范》(HJ 355-2019)', '城镇污水厂污染物排放标准 GB 18918-2002'],
  },
  {
    id: 3,
    title: '超标风险提前预警与溯源归因',
    description: '提前 6-8 小时发出出水氨氮超标预警，锁定根本原因为"上游周末偷排高氨氮进水导致硝化受抑制"。',
    status: 'completed',
    detailLogs: ['达标率：COD 97.2%, 氨氮 96.5%, 总磷 98.8%'],
  },
  {
    id: 4,
    title: '生成水厂运营调控处方与调度工单',
    description: '给出曝气量调整、内回流比提升与应急碳源投加精确参数。',
    status: 'completed',
    detailLogs: ['已生成《环境监测数据智能分析与超标预警诊断专报》'],
  },
]

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}

// ---- 顶部监测指标切换（激活底色：COD emerald / 氨氮 cyan / 总磷 amber / DO blue）----

const METRIC_ACTIVE_CLASS: Record<MetricKey, string> = {
  cod: 'bg-emerald-500 text-slate-950 font-bold',
  nh3: 'bg-cyan-500 text-slate-950 font-bold',
  tp: 'bg-amber-500 text-slate-950 font-bold',
  do: 'bg-blue-500 text-slate-950 font-bold',
}

const metricPillClass = (m: MetricKey) =>
  activeMetric.value === m ? METRIC_ACTIVE_CLASS[m] : 'text-slate-400 hover:text-white'

const switchMetric = (m: MetricKey) => {
  activeMetric.value = m
  hoverIndex.value = null
}

// ---- 纯 SVG 折线图：双线（进水细线 + 出水粗线）与 ReferenceLine 出水限值 ----

interface MetricSeries {
  key: SeriesKey
  label: string
  color: string
  width: number
}

interface MetricChartConfig {
  domainMax: number
  yTicks: number[]
  refValue: number
  refLabel: string
  refColor: string
  series: MetricSeries[]
}

const METRIC_CHARTS: Record<MetricKey, MetricChartConfig> = {
  cod: {
    domainMax: 900,
    yTicks: [0, 300, 600, 900],
    refValue: 50,
    refLabel: '出水限值 50 mg/L',
    refColor: '#ef4444',
    series: [
      { key: 'inCod', label: '进水 COD', color: '#06b6d4', width: 1.5 },
      { key: 'outCod', label: '出水 COD', color: '#10b981', width: 2.5 },
    ],
  },
  nh3: {
    domainMax: 80,
    yTicks: [0, 20, 40, 60, 80],
    refValue: 5.0,
    refLabel: '出水限值 5.0 mg/L',
    refColor: '#ef4444',
    series: [
      { key: 'inNh3', label: '进水氨氮', color: '#06b6d4', width: 1.5 },
      { key: 'outNh3', label: '出水氨氮', color: '#10b981', width: 2.5 },
    ],
  },
  tp: {
    domainMax: 0.8,
    yTicks: [0, 0.2, 0.4, 0.6, 0.8],
    refValue: 0.5,
    refLabel: '出水限值 0.5 mg/L',
    refColor: '#ef4444',
    series: [{ key: 'tp', label: '出水总磷', color: '#f59e0b', width: 2.5 }],
  },
  do: {
    domainMax: 4,
    yTicks: [0, 1, 2, 3, 4],
    refValue: 2.0,
    refLabel: '最佳 DO 下限 2.0 mg/L',
    refColor: '#eab308',
    series: [{ key: 'do', label: '生化池 DO', color: '#3b82f6', width: 2.5 }],
  },
}

const chartCfg = computed(() => METRIC_CHARTS[activeMetric.value])

const CHART_W = 1000
const CHART_H = 280
const CHART_PAD = { top: 24, right: 24, bottom: 40, left: 56 }
const plotW = CHART_W - CHART_PAD.left - CHART_PAD.right
const plotH = CHART_H - CHART_PAD.top - CHART_PAD.bottom
const dotSeries = computed(() => chartCfg.value.series.filter((s) => s.width > 1.5))

const getX = (i: number) => CHART_PAD.left + (i / (MONITORING_TIME_SERIES.length - 1)) * plotW
const getY = (v: number) => CHART_PAD.top + plotH - (v / chartCfg.value.domainMax) * plotH

const linePathOf = (key: SeriesKey) =>
  MONITORING_TIME_SERIES.map((row, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(row[key] as number)}`).join(' ')

const hoverRow = computed(() =>
  hoverIndex.value === null ? null : MONITORING_TIME_SERIES[hoverIndex.value],
)
const seriesValueOf = (s: MetricSeries) => (hoverRow.value ? (hoverRow.value[s.key] as number) : 0)
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="emerald"
      :icon="Activity"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 环境监测数据智能分析与超标预警"
      :desc="`${meta.tagline}。秒级解析万条时序数据，识别 COD、氨氮、总磷、VOCs 等指标趋势异常，多因子关联溯源夜间偷排与菌种失活，输出水厂运营调控处方。`"
      :stat-items="[
        { label: '分析由 4-8 小时 → 30 秒完成计算', accent: true },
        { label: '提前 4-8 小时识别超标隐患，杜绝突发罚单' },
      ]"
      stat-label="水质综合达标率"
      stat-value="96.8%"
      stat-note="检测到 1 起周末夜间冲击事件"
    />

    <!-- 2. Preset Cases & Input Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Case Selector & Monitoring Profile -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4 text-emerald-400" />
            <span>选择监测分析点位</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">MONITORING SITE</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in MONITORING_CASES"
            :key="item.id"
            @click="selectedCaseId = item.id"
            :class="[
              'w-full p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedCaseId === item.id
                ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 ring-1 ring-emerald-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60',
            ]"
          >
            <div class="text-xs font-bold text-slate-200">{{ item.companyName }}</div>
            <div class="text-[11px] text-emerald-400/90 mt-0.5">{{ item.industry }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">监测时序数据概况：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>• 监测点位：{{ String(activeCase.inputParams.monitoringSite) }}</div>
            <div>• 时间跨度：{{ String(activeCase.inputParams.timeRange) }}</div>
            <div v-if="activeCase.inputParams.standardLimits">• 排放限值：{{ String(activeCase.inputParams.standardLimits) }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Online Monitoring DB & AI Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileSpreadsheet class="w-4 h-4 text-emerald-400" />
              <span>已连接在线监测时序数据库 (720 小时连续数据)</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ activeCase.uploadedFiles.length }} 份时序报表</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                <FileSpreadsheet class="w-4 h-4" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-semibold text-slate-200 truncate">{{ file.name }}</div>
                <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span class="font-mono">{{ file.size }}</span>
                  <span>•</span>
                  <span>{{ file.type }}</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-1 line-clamp-1">{{ file.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Trigger -->
        <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles class="w-4 h-4 text-emerald-400" />
            <span>AI 执行 COD/氨氮/DO 多因子关联回归与超标归因诊断</span>
          </div>

          <button
            id="run-monitoring-btn"
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在执行时序模型诊断与异常溯源...' : '开始多因子智能诊断分析' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. AI Execution Pipeline Workflow -->
    <EnvExecutionFlow
      :steps="EXECUTION_STEPS"
      :is-executing="isExecuting"
      :agent-name="meta.name"
      @execute-again="handleRunExecution"
    />

    <!-- 4. Structured Results Dashboard -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Result Top Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
              30 天连续在线监测智能诊断 (720 小时)
            </span>
            <span class="text-xs text-slate-400">出水执行标准：GB 18918-2002 一级A</span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            {{ activeCase.companyName }} · 水质连续在线监测数据智能分析报告
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeTab = 'trends'"
              :class="activeTab === 'trends' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              时序趋势曲线
            </button>
            <button
              @click="activeTab = 'events'"
              :class="activeTab === 'events' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              异常事件溯源 (1起)
            </button>
            <button
              @click="activeTab = 'prescriptions'"
              :class="activeTab === 'prescriptions' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              工艺调控处方
            </button>
          </div>

          <button
            @click="showExportModal = true"
            class="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>导出诊断专报</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: 时序趋势曲线（纯 SVG 折线图） -->
      <div v-if="activeTab === 'trends'" class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-300">切换监测指标：</span>
            <div class="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button @click="switchMetric('cod')" :class="['px-2.5 py-1 rounded transition-all cursor-pointer', metricPillClass('cod')]">
                化学需氧量 (COD)
              </button>
              <button @click="switchMetric('nh3')" :class="['px-2.5 py-1 rounded transition-all cursor-pointer', metricPillClass('nh3')]">
                氨氮 (NH3-N)
              </button>
              <button @click="switchMetric('tp')" :class="['px-2.5 py-1 rounded transition-all cursor-pointer', metricPillClass('tp')]">
                总磷 (TP)
              </button>
              <button @click="switchMetric('do')" :class="['px-2.5 py-1 rounded transition-all cursor-pointer', metricPillClass('do')]">
                生化池 DO (溶解氧)
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5 text-slate-400">
              <span class="w-2.5 h-0.5 bg-cyan-400" />
              <span>进水浓度</span>
            </span>
            <span class="flex items-center gap-1.5 text-emerald-400">
              <span class="w-2.5 h-0.5 bg-emerald-400" />
              <span>出水实测值</span>
            </span>
            <span class="flex items-center gap-1.5 text-rose-400">
              <span class="w-2.5 h-0.5 bg-rose-500 border-b border-dashed" />
              <span>排放国家限值</span>
            </span>
          </div>
        </div>

        <!-- SVG Chart Canvas -->
        <div class="relative w-full bg-slate-950/80 rounded-xl border border-slate-800 p-4">
          <svg :viewBox="`0 0 ${CHART_W} ${CHART_H}`" class="w-full h-auto overflow-visible select-none">
            <!-- Y Axis Grid & Ticks -->
            <g v-for="tick in chartCfg.yTicks" :key="tick">
              <line :x1="CHART_PAD.left" :y1="getY(tick)" :x2="CHART_W - CHART_PAD.right" :y2="getY(tick)" stroke="#1e293b" stroke-dasharray="3 3" stroke-width="1" />
              <text :x="CHART_PAD.left - 10" :y="getY(tick) + 4" fill="#64748b" font-size="11" text-anchor="end" font-family="monospace">{{ tick }}</text>
            </g>

            <!-- X Axis Grid (偶数日 + 末点) -->
            <template v-for="(row, i) in MONITORING_TIME_SERIES" :key="row.day">
              <g v-if="i % 2 === 0 || i === MONITORING_TIME_SERIES.length - 1">
                <line :x1="getX(i)" :y1="CHART_PAD.top" :x2="getX(i)" :y2="CHART_PAD.top + plotH" stroke="#1e293b" stroke-dasharray="3 3" stroke-width="1" />
                <line :x1="getX(i)" :y1="CHART_PAD.top + plotH" :x2="getX(i)" :y2="CHART_PAD.top + plotH + 5" stroke="#64748b" stroke-width="1" />
                <text :x="getX(i)" :y="CHART_PAD.top + plotH + 22" fill="#64748b" font-size="11" text-anchor="middle" font-family="monospace">{{ row.day }}</text>
              </g>
            </template>

            <!-- ReferenceLine 出水限值 -->
            <line
              :x1="CHART_PAD.left"
              :y1="getY(chartCfg.refValue)"
              :x2="CHART_W - CHART_PAD.right"
              :y2="getY(chartCfg.refValue)"
              :stroke="chartCfg.refColor"
              stroke-dasharray="4 4"
              stroke-width="1"
            />
            <text :x="CHART_W - CHART_PAD.right" :y="getY(chartCfg.refValue) - 6" :fill="chartCfg.refColor" font-size="11" text-anchor="end" font-family="monospace">
              {{ chartCfg.refLabel }}
            </text>

            <!-- 双折线（进水细线在前 / 出水粗线在后） -->
            <path
              v-for="s in chartCfg.series"
              :key="s.key"
              :d="linePathOf(s.key)"
              fill="none"
              :stroke="s.color"
              :stroke-width="s.width"
              stroke-linejoin="round"
              stroke-linecap="round"
            />

            <!-- 数据点 & 悬浮命中区域 -->
            <g
              v-for="(row, i) in MONITORING_TIME_SERIES"
              :key="row.day"
              class="cursor-pointer"
              @mouseenter="hoverIndex = i"
              @mouseleave="hoverIndex = null"
            >
              <circle v-for="s in dotSeries" :key="s.key" :cx="getX(i)" :cy="getY(row[s.key] as number)" r="3" :fill="s.color" stroke="#0f172a" stroke-width="1.5" />
              <rect
                :x="getX(i) - plotW / MONITORING_TIME_SERIES.length / 2"
                :y="CHART_PAD.top"
                :width="plotW / MONITORING_TIME_SERIES.length"
                :height="plotH"
                fill="transparent"
              />
            </g>
          </svg>

          <!-- Hover Tooltip -->
          <div
            v-if="hoverIndex !== null && hoverRow"
            class="absolute top-3 right-3 z-10 bg-[#0f172a] border border-slate-600/80 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none space-y-1"
          >
            <div class="font-mono font-bold text-slate-300 border-b border-slate-700 pb-1">日期：{{ hoverRow.day }}</div>
            <div v-for="s in chartCfg.series" :key="s.key" class="flex items-center justify-between gap-6">
              <span class="flex items-center gap-1.5 text-slate-300">
                <span class="w-2 h-2 rounded-full" :style="{ background: s.color }" />
                <span>{{ s.label }}</span>
              </span>
              <span class="font-mono font-bold" :style="{ color: s.color }">{{ seriesValueOf(s) }}</span>
            </div>
            <div class="text-[10px] text-slate-500 pt-0.5 font-mono">{{ chartCfg.refLabel }}</div>
          </div>
        </div>
      </div>

      <!-- Tab 2: 异常事件溯源 -->
      <div v-else-if="activeTab === 'events'" class="space-y-4">
        <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <AlertCircle class="w-4 h-4" />
          <span>异常事件根因定位与机理分析 (11月09日-11日 周末冲击)</span>
        </h3>

        <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3 text-xs leading-relaxed text-slate-200">
          <div class="flex items-center justify-between gap-3">
            <span class="font-bold text-amber-300 text-sm">事件：进水氨氮突增 62 mg/L 导致出水连续 24 小时微超标 (5.8 mg/L)</span>
            <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-bold flex-shrink-0">已预警拦截</span>
          </div>
          <p>
            <strong>AI 根因分析：</strong>
            结合进水时序特征与管网溯源，发现 11 月 09 日（周五）22:00 至 11 月 10 日 06:00，园区上游某化肥合成树脂企业发生集中排放，进水 COD 突增至 850 mg/L、氨氮突增至 62 mg/L。因高负荷耗尽曝气池溶解氧（DO 骤降至 1.2 mg/L），导致硝化细菌活性严重受抑制，出水氨氮发生短暂突破。
          </p>
        </div>
      </div>

      <!-- Tab 3: 工艺调控处方 -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Sliders class="w-4 h-4" />
          <span>AI 专家调控处方 (直接下发值班运行工程师)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-slate-400 font-semibold">1. 曝气量与风机调频</div>
            <div class="text-sm font-bold text-emerald-400">曝气风量 +18%</div>
            <p class="text-[11px] text-slate-400">
              将好氧段 DO 快速拉升并维持在 2.5-3.0 mg/L，加速恢复硝化菌群活性。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-slate-400 font-semibold">2. 污泥与混合液回流比</div>
            <div class="text-sm font-bold text-cyan-400">内回流比提升至 250%</div>
            <p class="text-[11px] text-slate-400">
              增加反硝化脱氮负荷，二沉池外回流提升 15%，防止污泥在沉淀池停留缺氧释磷。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-slate-400 font-semibold">3. 应急外加碳源投加</div>
            <div class="text-sm font-bold text-amber-400">乙酸钠补加 +15 mg/L</div>
            <p class="text-[11px] text-slate-400">
              保障反硝化系统碳氮比 C/N ≥ 4.5，确保总氮与氨氮同步平稳受控。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Professional Disclaimer Footer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
      <p>
        <strong>监测诊断辅助提示：</strong>
        AI 算法基于多因子时序建模进行异常关联分析。在调整大型污水处理设施或焚烧炉关键工艺参数前，请由水务运行工程师结合现场化验数据复核执行。
      </p>
    </div>

    <!-- 6. Export Modal -->
    <EnvExportModal
      :is-open="showExportModal"
      report-title="工业园区污水处理厂 30 天水质在线监测智能分析专报"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      summary-text="已清洗 720 个小时连续时序数据，识别进水冲击并提前预警出水波动，配套输出曝气量、内回流比及碳源调优处方。"
      @close="showExportModal = false"
    />
  </div>
</template>
