<script setup lang="ts">
// AI 排污许可助手 —— 转译自原型 PollutionPermitAgent.tsx
import { ref, computed } from 'vue'
import {
  FileCheck2, Upload, FileText, CheckCircle2, Sparkles, Building2,
  HelpCircle, Network, Calendar, AlertTriangle, Download,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  PERMIT_CASES, PERMIT_TOPOLOGY, envAgentMetaOf, type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('permit')
const tone = ENV_TONES.teal

const selectedCaseId = ref<string>(PERMIT_CASES[0].id)
const isExecuting = ref(false)
const activeResultTab = ref<'topology' | 'roadmap' | 'checklist' | 'warnings'>('topology')
const showExportModal = ref(false)

const activeCase = computed(
  () => PERMIT_CASES.find((c) => c.id === selectedCaseId.value) || PERMIT_CASES[0],
)

// React 源内联执行步骤（数据文件无对应常量，原样落位组件 script）
const permitExecutionSteps: EnvExecutionStep[] = [
  {
    id: 1,
    title: '识别行业分类与排污管理类别判定',
    description: '依据《固定污染源排污许可分类管理名录(2019年版)》，精准判定为“重点管理”类别。',
    status: 'completed',
    detailLogs: ['匹配行业代码：C3985 电子专用材料制造', '判定级别：重点管理（涉及重金属镍/钴/锰排放）'],
  },
  {
    id: 2,
    title: '构建产排污节点与治理设施拓扑链路',
    description: '自动关联各生产工段与治理设施，核算收集率、处理效率与排气筒几何参数。',
    status: 'completed',
    rulesMatched: ['《排污许可证申请与核发技术规范 无机化学工业》(HJ 1031-2019)', 'GB 31573-2015 排放限值'],
  },
  {
    id: 3,
    title: '申报资料缺口扫描与指标核对',
    description: '交叉比对环评批复、总量平衡意见与实际设备台账，扫描 12 项高频驳回点。',
    status: 'completed',
    detailLogs: ['检测到窑炉尾气 SCR 脱硝氨逃逸在线监测仪参数未录入', '核准常州市总量指标替代来源合法合规'],
  },
  {
    id: 4,
    title: '生成申报路线图与技术核算底稿',
    description: '编制全周期申报甘特图、材料清单与填报指导底稿。',
    status: 'completed',
    detailLogs: ['已生成标准填报底稿，预计缩短填报周期 85%'],
  },
]

// 申领全景路线图（React 源内联数组）
const permitRoadmapStages = [
  { stage: '第一阶段：资料准备与缺口补齐', days: '第 1-3 天', color: 'border-teal-500', desc: '收集环评批复、总量指标批文、工程设计说明，由 AI 排污许可助手生成技术核算底稿。' },
  { stage: '第二阶段：国家平台填报与自审', days: '第 4-8 天', color: 'border-cyan-500', desc: '登录全国排污许可证管理信息平台，将 AI 底稿快速导入系统，完成 35 张附表填报。' },
  { stage: '第三阶段：生态环境部门技术审查', days: '第 9-15 天', color: 'border-amber-500', desc: '属地生态环境局及评估中心专家技术审查。针对反馈意见，由 AI 助手实时提供答复依据。' },
  { stage: '第四阶段：公示与正副本核发', days: '第 16-20 天', color: 'border-emerald-500', desc: '全国平台公示无异议，生态环境局下发排污许可证正副本，同步启动自行监测与台账工作。' },
]

// 资料准备清单（React 源内联数组）
const permitChecklistItems = [
  { name: '建设项目环境影响评价文件审批意见 (批复)', status: '已齐备', tag: 'bg-emerald-500/20 text-emerald-400', note: '常环审[2024]106号批复文件齐全' },
  { name: '主要污染物总量指标平衡来源及排污权交易凭证', status: '已齐备', tag: 'bg-emerald-500/20 text-emerald-400', note: '已取得常州市生态环境局总量核定批文' },
  { name: '主要生产设施、产污环节及污染防治设施技术参数表', status: 'AI已生成', tag: 'bg-teal-500/20 text-teal-300', note: 'AI排污助手已按技术规范自动核算提取' },
  { name: '企业自行监测方案 (含监测点位、指标、频次、方法)', status: 'AI已编制', tag: 'bg-teal-500/20 text-teal-300', note: '依据 HJ 1031-2019 自动编制完成' },
  { name: '突发环境事件应急预案备案登记表及预案文件', status: '需核对最新版', tag: 'bg-amber-500/20 text-amber-300', note: '需确认应急预案与本期新建产线是否同步更新' },
  { name: '地下水与土壤污染隐患排查报告', status: '待第三方出具', tag: 'bg-rose-500/20 text-rose-300', note: '重点管理排污单位需在领证前补充提交' },
]

// 高频驳回预警（React 源内联数组）
const permitWarningItems = [
  { title: '窑炉 SCR 脱硝氨逃逸在线监测参数缺失', desc: '根据 HJ 1031 规范，新建脱硝排口必须设置氨逃逸监控。AI 已自动在监测方案中补齐该项参数。' },
  { title: '物料平衡图中的重金属衡算不闭环', desc: '正极材料硫酸镍投料量与废渣、废水、产品中的镍元素必须衡算平衡（误差≤5%）。AI 底稿已完成全流程物料守恒计算。' },
  { title: '无组织废气收集效率取值过高导致失真', desc: '技术规范要求密闭负压收集效率一般按 90-95% 核算。AI 已调整参数，避免因取值 100% 被审查专家质疑驳回。' },
  { title: '雨水排放口监控要求未明确', desc: '重点管理单位雨水总排口必须设置切断阀并在方案中明确雨水排放监测频次。AI 底稿已包含雨水排口规范化设置表。' },
]

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
      tone="teal"
      :icon="FileCheck2"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 排污许可证办理/变更/执行辅助"
      :desc="`${meta.tagline}。输入企业行业、工艺及污染物信息，AI 自动梳理污染源拓扑、识别资料缺口，生成申报路线图、材料清单与待确认事项。`"
      :stat-items="[
        { label: '资料整理从 5-7 天 → 缩短至 2 分钟', accent: true },
        { label: '精准对标生态环境部 HJ 行业技术规范' },
      ]"
      stat-label="核发技术规范匹配"
      stat-value="100% 覆盖"
      stat-note="零漏报 · 零参数逻辑冲突"
    />

    <!-- 2. Cases & Inputs -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Case selector -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4" :class="tone.icon" />
            <span>选择排污许可办理场景</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">PERMIT SCENARIO</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in PERMIT_CASES"
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
            <div class="text-[11px] text-teal-400/90 mt-0.5">{{ item.industry }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <!-- 排污许可技术核算参数 -->
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">排污许可技术核算参数：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>• 申报类别：<span class="text-teal-300 font-semibold">{{ String(activeCase.inputParams.applyType) }}</span></div>
            <div>• 产能规模：{{ String(activeCase.inputParams.productionCapacity) }}</div>
            <div>• 环评批文：{{ String(activeCase.inputParams.eiaApprovalNo) }}</div>
            <div>• 排放口数：{{ String(activeCase.inputParams.emissionOutlets) }}</div>
          </div>
        </div>
      </div>

      <!-- Uploaded Files & Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload class="w-4 h-4" :class="tone.icon" />
              <span>申报依据资料与设计图纸</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">
              {{ activeCase.uploadedFiles.length }} 份文件已就绪
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg flex-shrink-0" :class="tone.fileIconBox">
                <FileText class="w-4 h-4" />
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
            <span>自动匹配生态环境部排污许可填报系统格式底稿</span>
          </div>

          <button
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在构建污染源拓扑与技术核算...' : '生成排污许可申报路线与底稿' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. Execution flow -->
    <EnvExecutionFlow
      :steps="permitExecutionSteps"
      :is-executing="isExecuting"
      :agent-name="meta.name"
      @execute-again="handleRunExecution"
    />

    <!-- 4. Structured Results -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Results Nav Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-xs font-bold font-mono" :class="tone.codePill">
              重点管理排污许可 (HJ 1031-2019)
            </span>
            <span class="text-xs text-slate-400">
              涉及 3 个主要废气排口，1 个废水综合排口
            </span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            {{ activeCase.companyName }} · 排污许可证办理技术底稿与申报清单
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeResultTab = 'topology'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                activeResultTab === 'topology'
                  ? ['text-slate-950 font-bold', tone.tabActive]
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              产污治理拓扑
            </button>
            <button
              @click="activeResultTab = 'roadmap'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                activeResultTab === 'roadmap'
                  ? ['text-slate-950 font-bold', tone.tabActive]
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              申领全景路线图
            </button>
            <button
              @click="activeResultTab = 'checklist'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                activeResultTab === 'checklist'
                  ? ['text-slate-950 font-bold', tone.tabActive]
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              资料准备清单
            </button>
            <button
              @click="activeResultTab = 'warnings'"
              :class="[
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer',
                activeResultTab === 'warnings'
                  ? ['text-slate-950 font-bold', tone.tabActive]
                  : 'text-slate-400 hover:text-white',
              ]"
            >
              高频驳回预警
            </button>
          </div>

          <button
            @click="showExportModal = true"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-teal-500/30',
              tone.codePill,
            ]"
          >
            <Download class="w-4 h-4" />
            <span>导出技术底稿</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: Topology Flow -->
      <div v-if="activeResultTab === 'topology'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" :class="tone.icon">
            <Network class="w-4 h-4" />
            <span>产污工段 → 污染因子 → 治理工艺 → 排放口拓扑映射图</span>
          </h3>
          <span class="text-xs text-slate-400">已智能对标国家标准排放限值</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in PERMIT_TOPOLOGY"
            :key="idx"
            class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all space-y-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-xs font-bold font-mono">
                  工段 {{ idx + 1 }}
                </span>
                <h4 class="text-sm font-bold text-slate-100">{{ item.node }}</h4>
              </div>
              <span class="text-xs text-slate-400 font-mono">
                排放口：<strong class="text-teal-300">{{ item.outlet }}</strong>
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div class="text-slate-400 font-medium">涉及主要污染物：</div>
                <div class="text-slate-200 flex flex-wrap gap-1">
                  <span v-for="(p, pIdx) in item.pollutants" :key="pIdx" class="px-1.5 py-0.5 rounded bg-slate-800 text-[11px] text-amber-300">
                    {{ p }}
                  </span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div class="text-slate-400 font-medium">污染治理工艺与设施：</div>
                <div class="text-teal-300 font-medium text-[11px]">
                  {{ item.treatment }}
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div class="text-slate-400 font-medium">治理效率与执行标准：</div>
                <div class="text-slate-300 text-[11px]">
                  效率: {{ item.efficiency }}
                </div>
                <div class="text-[10px] text-slate-500 line-clamp-1">
                  {{ item.standard }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Roadmap Timeline -->
      <div v-else-if="activeResultTab === 'roadmap'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" :class="tone.icon">
          <Calendar class="w-4 h-4" />
          <span>排污许可申领全流程标准路线图 (总工期预计 15-20 工作日)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            v-for="(step, idx) in permitRoadmapStages"
            :key="idx"
            :class="['p-4 rounded-xl bg-slate-950/80 border space-y-2', step.color]"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-mono font-bold" :class="tone.icon">STAGE 0{{ idx + 1 }}</span>
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">{{ step.days }}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-100">{{ step.stage }}</h4>
            <p class="text-[11px] text-slate-400 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Tab 3: Checklist -->
      <div v-else-if="activeResultTab === 'checklist'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono" :class="tone.icon">
          排污许可申请必备材料准备清单与状态
        </h3>

        <div class="space-y-2.5">
          <div
            v-for="(item, idx) in permitChecklistItems"
            :key="idx"
            class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-3">
              <CheckCircle2 class="w-4 h-4" :class="tone.icon" />
              <div>
                <span class="font-semibold text-slate-200">{{ item.name }}</span>
                <div class="text-[11px] text-slate-400 mt-0.5">{{ item.note }}</div>
              </div>
            </div>
            <span :class="['px-2 py-0.5 rounded font-medium text-[11px]', item.tag]">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tab 4: Warnings -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <AlertTriangle class="w-4 h-4" />
          <span>排污许可审查高频驳回点预警 (AI 已提前规避)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(warn, idx) in permitWarningItems" :key="idx" class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div class="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{{ warn.title }}</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">{{ warn.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Disclaimer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 flex-shrink-0 mt-0.5" :class="tone.icon" />
      <p>
        <strong>AI 辅助申报提示：</strong>
        排污许可证申请底稿与技术核算由 AI 助手依据国家技术规范自动生成。正式在全国排污许可证管理信息平台提交报审前，请由企业环保主管及具备资质的咨询顾问进行终审。
      </p>
    </div>

    <!-- 6. Export -->
    <EnvExportModal
      :is-open="showExportModal"
      :report-title="`${activeCase.companyName} 排污许可申报路线图与技术核算底稿`"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      :summary-text="`已完成污染源拓扑构建与 HJ 1031-2019 技术规范匹配，生成 4 阶段申领路线图、6 项材料准备清单及 4 项高频驳回点规避方案。`"
      @close="showExportModal = false"
    />
  </div>
</template>
