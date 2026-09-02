<script setup lang="ts">
// AI 环保报告员 —— 转译自原型 EnvironmentalReporterAgent.tsx
import { ref, computed } from 'vue'
import {
  FileText, Download, Sparkles, Building2, FileSpreadsheet,
  HelpCircle, Check,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  REPORTER_CASES, envAgentMetaOf, type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

interface ReporterChapter {
  id: number
  title: string
  content: string
  metrics?: { label: string; value: string }[]
  tableData?: { item: string; avgConc: string; limitConc: string; totalEmission: string; quota: string; remaining: string }[]
}

const meta = envAgentMetaOf('reporter')
const tone = ENV_TONES.cyan

const selectedCaseId = ref<string>(REPORTER_CASES[0].id)
const isExecuting = ref(false)
const activeChapter = ref<number>(1)
const showExportModal = ref(false)

const activeCase = computed(
  () => REPORTER_CASES.find((c) => c.id === selectedCaseId.value) || REPORTER_CASES[0],
)

// React 源内联执行步骤（数据文件无对应常量，原样落位组件 script）
const reporterExecutionSteps: EnvExecutionStep[] = [
  {
    id: 1,
    title: '解析时序监测数据与原辅料台账',
    description: '导入 2,200 余条连续在线小时均值、进出水日均值及药剂用电量台账。',
    status: 'completed',
    detailLogs: ['水质总排口：COD、氨氮、总磷连续92天时序解析完成', '废气排口：非甲烷总烃小时均值提取完成'],
  },
  {
    id: 2,
    title: '核算各污染物实际排放总量与达标率',
    description: '运用物料衡算法与实测浓度积分法，对比排污许可证季度许可量指标。',
    status: 'completed',
    rulesMatched: ['《排污许可证执行报告编制规范》(HJ 944-2018)', '《排污单位自行监测技术指南 总则》(HJ 819-2017)'],
  },
  {
    id: 3,
    title: '环保设施运行效率与物耗评价',
    description: '分析生化处理效率(98.2%)、RTO焚烧处理效率(99.1%)及单位产品电耗药耗。',
    status: 'completed',
    detailLogs: ['综合出水达标率 99.6%，无重大超标事件', '核定全季度累计减排 COD 185.6 吨'],
  },
  {
    id: 4,
    title: '自动生成标准排污许可执行报告全文章节',
    description: '按生态环境部标准模板排版，自动生成文字叙述、图表、统计附表与下一阶段计划。',
    status: 'completed',
    detailLogs: ['共生成 6 大章节、14 张结构化数据附表'],
  },
]

// React 源内联的报告 6 大章节数据（正文 / 指标卡 / 附表）
const reportChapters: ReporterChapter[] = [
  {
    id: 1,
    title: '第一章：企业基本情况与排污许可证执行概况',
    content: `苏州光驰半导体新材料有限公司位于苏州相城区高新技术产业开发区。本季度（2025年Q4），公司严格落实生态环境部《排污许可管理条例》及排污许可证（编号：91320507MA1N88888X）要求。全厂主要生产设施运行时间为 2,160 小时，主要环保治理设施（综合污水处理站、RTO蓄热式焚烧系统）与生产设施同步运转率达 100%，未发生非计划停运。`,
    metrics: [
      { label: '生产设施运行', value: '2,160 小时' },
      { label: '环保设施同步率', value: '100%' },
      { label: '超标排放记录', value: '0 起' },
    ],
  },
  {
    id: 2,
    title: '第二章：水污染物自行监测与排放总量核算',
    content: `本季度综合废水总排口（DW001）累计排放废水量为 68,450 m³。主要污染物排放浓度及总量核算如下：\n- 化学需氧量 (COD)：季度平均排放浓度为 36.4 mg/L（许可限值 50.0 mg/L），季度实际排放量 2.49 吨（季度许可限额 4.50 吨，余量 44.7%）；\n- 氨氮 (NH3-N)：季度平均浓度 1.82 mg/L（限值 5.0 mg/L），实际排放量 0.12 吨（许可限额 0.45 吨，余量 73.3%）；\n- 总磷 (TP)：季度平均浓度 0.28 mg/L（限值 0.5 mg/L），排放量 0.019 吨。所有水污染物均稳定达到纳管排放标准。`,
    tableData: [
      { item: 'COD', avgConc: '36.4 mg/L', limitConc: '50.0 mg/L', totalEmission: '2.49 t', quota: '4.50 t', remaining: '44.7%' },
      { item: '氨氮 (NH3-N)', avgConc: '1.82 mg/L', limitConc: '5.0 mg/L', totalEmission: '0.12 t', quota: '0.45 t', remaining: '73.3%' },
      { item: '总磷 (TP)', avgConc: '0.28 mg/L', limitConc: '0.5 mg/L', totalEmission: '0.019 t', quota: '0.045 t', remaining: '57.8%' },
    ],
  },
  {
    id: 3,
    title: '第三章：大气污染物有组织与无组织排放监测',
    content: `厂区共设有 2 个废气排气筒。DA001（RTO排气筒）非甲烷总烃平均排放浓度为 14.2 mg/L（GB 31573限值 60.0 mg/L），去除效率达 99.1%，季度排放总量 0.95 吨（许可量 1.62 吨）；DA002（酸性废气洗涤塔）硫酸雾排放浓度均低于 0.8 mg/m³。厂界无组织挥发性有机物监测最大浓度为 1.2 mg/m³，符合 GB 37822 厂区内监控限值。`,
    metrics: [
      { label: 'RTO去除效率', value: '99.1%' },
      { label: 'VOCs实际排放', value: '0.95 吨' },
      { label: 'VOCs许可余量', value: '41.4%' },
    ],
  },
  {
    id: 4,
    title: '第四章：污染防治设施运行与耗材物料消耗评价',
    content: `本季度污水处理站累计耗电 48,200 kW·h，投加复合碳源 14.2 吨、PAC 混凝剂 6.8 吨；RTO 系统消耗天然气 12,500 m³，在线监控系统标定校验 6 次，零漂/量漂均符合规范要求。全厂环保设施运行处于优良受控状态。`,
    metrics: [
      { label: '污水处理电耗', value: '0.70 kWh/m³' },
      { label: '天然气消耗', value: '12,500 m³' },
      { label: 'CEMS标定校准', value: '6 次全部合格' },
    ],
  },
  {
    id: 5,
    title: '第五章：存在问题分析与整改落实情况',
    content: `经系统筛查，本季度 11 月 08 日在线监测系统因光纤网络通信故障出现 2 小时数据中断。企业已在 1 小时内启动应急手工采样比对（实测达标），并向属地生态环境局报备。针对历史遗留的活性炭更换台账规范化问题，已在本季度全面建立电子扫码台账系统。`,
  },
  {
    id: 6,
    title: '第六章：下一阶段生态环境保护工作计划',
    content: `1. 计划在 2026 年 Q1 对生化系统曝气微孔膜进行全套预防性检修清洗；\n2. 进一步优化 RTO 进气风量调配，预计降低天然气助燃能耗 8%；\n3. 启动 2025 年度企业环境信息依法披露报告编制工作。`,
  },
]

const currentChapter = computed(
  () => reportChapters.find((c) => c.id === activeChapter.value) || reportChapters[0],
)

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="cyan"
      :icon="FileText"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 环保报告自动编制与数据核算"
      :desc="`${meta.tagline}。上传监测 Excel 表格、工况日志，AI 自动清洗数据、核算总量、比对许可限额，一键生成符合规范的标准执行报告与年报。`"
      :stat-items="[
        { label: '撰写由 2-3 天 → 1 分钟一键成文', accent: true },
        { label: '对标 HJ 944-2018 排污许可执行报告编制技术规范' },
      ]"
      stat-label="数据计算准确率"
      stat-value="100.0%"
      stat-note="公式自动闭环校验"
    />

    <!-- 2. Cases & Inputs -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Case selector -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4" :class="tone.icon" />
            <span>选择报告编制任务</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">REPORT TASK</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in REPORTER_CASES"
            :key="item.id"
            @click="selectedCaseId = item.id"
            :class="[
              'w-full p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedCaseId === item.id
                ? ['text-slate-100', tone.caseActive]
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60',
            ]"
          >
            <div class="text-xs font-bold text-slate-200">{{ item.companyName }}</div>
            <div class="text-[11px] text-cyan-400/90 mt-0.5">{{ item.inputParams.reportType }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <!-- 报告编制参数核定 -->
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">报告编制参数核定：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>• 报告类别：<span class="text-cyan-300">{{ String(activeCase.inputParams.reportType) }}</span></div>
            <div>• 统计周期：{{ String(activeCase.inputParams.reportingPeriod) }}</div>
            <div>• 许可证号：<span class="font-mono">{{ String(activeCase.inputParams.permitCode) }}</span></div>
          </div>
        </div>
      </div>

      <!-- Uploaded Files & Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileSpreadsheet class="w-4 h-4" :class="tone.icon" />
              <span>已汇聚监测数据与运行台账表格</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">
              {{ activeCase.uploadedFiles.length }} 份数据源已连接
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg flex-shrink-0" :class="tone.fileIconBox">
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

        <!-- Action Button & AI Execution Start -->
        <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles class="w-4 h-4" :class="tone.icon" />
            <span>AI 自动核算总量并注入 HJ 944 报告标准模板</span>
          </div>

          <button
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在执行 2,200 条数据公式核算与排版...' : '一键生成排污许可执行报告' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. Execution flow -->
    <EnvExecutionFlow
      :steps="reporterExecutionSteps"
      :is-executing="isExecuting"
      :agent-name="meta.name"
      @execute-again="handleRunExecution"
    />

    <!-- 4. Interactive Report Previewer & Chapters -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Top Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-xs font-bold font-mono" :class="tone.codePill">
              排污许可证执行报告（季度报告）
            </span>
            <span class="text-xs text-slate-400">
              HJ 944-2018 标准格式 · 已完成自动校验
            </span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            {{ activeCase.companyName }} · 2025年第四季度排污许可执行报告
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="showExportModal = true"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-cyan-500/30',
              tone.codePill,
            ]"
          >
            <Download class="w-4 h-4" />
            <span>导出 Word / PDF 报告</span>
          </button>
        </div>
      </div>

      <!-- Chapter Tabs & Interactive Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Chapter Outline Sidebar -->
        <div class="lg:col-span-1 space-y-2">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
            报告章节目录 (CHAPTERS)
          </div>
          <button
            v-for="chap in reportChapters"
            :key="chap.id"
            @click="activeChapter = chap.id"
            :class="[
              'w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between',
              activeChapter === chap.id
                ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800',
            ]"
          >
            <span class="truncate">{{ chap.title }}</span>
            <Check v-if="activeChapter === chap.id" class="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          </button>
        </div>

        <!-- Chapter Content Main Canvas -->
        <div class="lg:col-span-3 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5">
          <div v-if="currentChapter" class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText class="w-4 h-4" :class="tone.icon" />
                <span>{{ currentChapter.title }}</span>
              </h3>
              <span class="text-xs text-slate-500 font-mono">AI AUTO-GENERATED</span>
            </div>

            <!-- Text Content -->
            <div class="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              {{ currentChapter.content }}
            </div>

            <!-- Summary Metric Cards -->
            <div v-if="currentChapter.metrics" class="grid grid-cols-3 gap-3 pt-2">
              <div
                v-for="(m, mIdx) in currentChapter.metrics"
                :key="mIdx"
                class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center"
              >
                <div class="text-[11px] text-slate-400">{{ m.label }}</div>
                <div class="text-sm font-bold text-cyan-300 font-mono mt-1">{{ m.value }}</div>
              </div>
            </div>

            <!-- Data Table -->
            <div v-if="currentChapter.tableData" class="overflow-x-auto rounded-xl border border-slate-800">
              <table class="w-full text-xs text-left text-slate-300">
                <thead class="text-[11px] uppercase bg-slate-900 text-slate-400 font-mono">
                  <tr>
                    <th class="px-3 py-2">监测因子</th>
                    <th class="px-3 py-2">实际均值</th>
                    <th class="px-3 py-2">许可限值</th>
                    <th class="px-3 py-2">季度实际总量</th>
                    <th class="px-3 py-2">季度许可量</th>
                    <th class="px-3 py-2">许可余量</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                  <tr v-for="(row, rIdx) in currentChapter.tableData" :key="rIdx" class="hover:bg-slate-900/50 font-mono text-[11px]">
                    <td class="px-3 py-2 font-bold text-slate-200">{{ row.item }}</td>
                    <td class="px-3 py-2 text-cyan-300">{{ row.avgConc }}</td>
                    <td class="px-3 py-2 text-slate-400">{{ row.limitConc }}</td>
                    <td class="px-3 py-2 text-emerald-400 font-semibold">{{ row.totalEmission }}</td>
                    <td class="px-3 py-2 text-slate-400">{{ row.quota }}</td>
                    <td class="px-3 py-2 text-emerald-300 font-bold">{{ row.remaining }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Disclaimer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 flex-shrink-0 mt-0.5" :class="tone.icon" />
      <p>
        <strong>报告编制审核提示：</strong>
        本报告由 AI 报告员基于上传监测数据自动核算并生成标准格式。企业向属地生态环境主管部门平台正式报送前，请由企业环境保护负责人进行最终复核签章。
      </p>
    </div>

    <!-- 6. Export -->
    <EnvExportModal
      :is-open="showExportModal"
      :report-title="`${String(activeCase.inputParams.reportType)} · ${activeCase.companyName}`"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      :summary-text="`已整合 92 天 2,200 余组连续在线监测数据，完成 COD、VOCs 等总量核算，生成全套 6 大章节及 14 张标准附表。`"
      @close="showExportModal = false"
    />
  </div>
</template>
