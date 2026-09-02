<script setup lang="ts">
// AI 环保合规官 —— 转译自原型 ComplianceOfficerAgent.tsx
import { ref, computed } from 'vue'
import {
  ShieldAlert, Upload, FileText, CheckCircle2, Sparkles, Scale, Building2,
  HelpCircle, AlertCircle, Clock, UserCheck, Download,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  COMPLIANCE_CASES, COMPLIANCE_EXECUTION_STEPS, COMPLIANCE_RESULT_DATA,
  envAgentMetaOf,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('compliance')
const tone = ENV_TONES.emerald

const selectedCaseId = ref<string>(COMPLIANCE_CASES[0].id)
const isExecuting = ref(false)
const activeReportTab = ref<'diagnosis' | 'risks' | 'actions'>('diagnosis')
const showExportModal = ref(false)

const activeCase = computed(
  () => COMPLIANCE_CASES.find((c) => c.id === selectedCaseId.value) || COMPLIANCE_CASES[0],
)

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}

const dimensionColor = (score: number) =>
  score >= 80
    ? { badge: 'bg-emerald-500/20 text-emerald-400', bar: 'bg-emerald-500' }
    : score >= 70
      ? { badge: 'bg-amber-500/20 text-amber-400', bar: 'bg-amber-500' }
      : { badge: 'bg-rose-500/20 text-rose-400', bar: 'bg-rose-500' }
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="emerald"
      :icon="ShieldAlert"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 企业环保合规体检"
      :desc="`${meta.tagline}。通过智能比对环评批复、排污许可证副本、自行监测报告与危废台账，自动匹配国家及地方现行环保法规，输出体检评分、风险清单与整改工单。`"
      :stat-items="[
        { label: '人工需 3-5 天 → AI 仅需 3 分钟', accent: true },
        { label: '覆盖：手续合规 / 达标排放 / 自行监测 / 危废管理 / 设施台账' },
      ]"
      stat-label="法规库实时连线"
      stat-value="1,420+ 条"
      stat-note="GB / HJ 行业标准已同步"
    />

    <!-- 2. Preset Cases & Upload Input Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Case Selector & Enterprise Parameters -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4 text-emerald-400" />
            <span>选择演示企业案例</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">PRESET CASE</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in COMPLIANCE_CASES"
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

        <!-- Enterprise Meta Badges -->
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">当前受检企业画像：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>• 规模：{{ String(activeCase.inputParams.enterpriseScale) }}</div>
            <div>• 排污管理：{{ String(activeCase.inputParams.permitType) }}</div>
            <div>• 监测频次：{{ String(activeCase.inputParams.monitoringFrequency) }}</div>
            <div>• 危废年产：{{ String(activeCase.inputParams.wasteAnnualTonnage) }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Uploaded Documents & AI Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload class="w-4 h-4 text-emerald-400" />
              <span>已接入企业环保资料与台账 (支持 PDF / Excel / 扫描件)</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ activeCase.uploadedFiles.length }} 份文件已加载</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
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
            <Sparkles class="w-4 h-4 text-emerald-400" />
            <span>AI 将对 68 个合规核查点执行自动交叉验证</span>
          </div>

          <button
            id="run-compliance-btn"
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? 'AI 正在穿透核对 1,420 条法规...' : '开始 AI 环保合规体检' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. AI Execution Pipeline Workflow -->
    <EnvExecutionFlow
      :steps="COMPLIANCE_EXECUTION_STEPS"
      :is-executing="isExecuting"
      :agent-name="meta.name"
      @execute-again="handleRunExecution"
    />

    <!-- 4. Structured Analysis Results Dashboard -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Result Top Bar: Score & Risk Overview -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div class="flex items-center space-x-5">
          <!-- Score Circle Gauge -->
          <div class="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center shadow-lg shadow-amber-950/40">
            <div class="text-[10px] font-mono text-slate-400">合规综合得分</div>
            <div class="text-3xl font-black text-amber-400 font-mono">{{ COMPLIANCE_RESULT_DATA.overallScore }}</div>
            <div class="text-[10px] text-amber-300 font-semibold">满分 100</div>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                {{ COMPLIANCE_RESULT_DATA.riskLevelText }}
              </span>
              <span class="text-xs text-slate-400">检测出 2 项致命违规隐患，3 项管理缺陷</span>
            </div>
            <h2 class="text-lg font-bold text-slate-100 mt-1.5">
              {{ activeCase.companyName }} · 环保合规体检诊断报告
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              诊断时间：2026年最新扫描 · 评估基准：国家及江苏省现行生态环境保护法律标准体系
            </p>
          </div>
        </div>

        <!-- Action Tabs & Export Button -->
        <div class="flex items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeReportTab = 'diagnosis'"
              :class="activeReportTab === 'diagnosis' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              五维诊断
            </button>
            <button
              @click="activeReportTab = 'risks'"
              :class="activeReportTab === 'risks' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Top 风险条款 ({{ COMPLIANCE_RESULT_DATA.topRisks.length }})
            </button>
            <button
              @click="activeReportTab = 'actions'"
              :class="activeReportTab === 'actions' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              整改工单 ({{ COMPLIANCE_RESULT_DATA.actions.length }})
            </button>
          </div>

          <button
            @click="showExportModal = true"
            class="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: 5 Dimensions Breakdown -->
      <div v-if="activeReportTab === 'diagnosis'" class="space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          五大核心维度合规穿透得分与状态
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(dim, idx) in COMPLIANCE_RESULT_DATA.dimensions" :key="idx" class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-200">{{ dim.name }}</span>
              <span :class="['text-xs px-2 py-0.5 rounded font-mono font-bold', dimensionColor(dim.score).badge]">
                {{ dim.score }} 分 · {{ dim.status }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                :class="['h-full rounded-full', dimensionColor(dim.score).bar]"
                :style="{ width: `${dim.score}%` }"
              />
            </div>

            <p class="text-[11px] text-slate-400 leading-relaxed">{{ dim.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Tab 2: Top Critical Risks & Legal Clauses -->
      <div v-else-if="activeReportTab === 'risks'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4" />
            <span>违法违规与处罚隐患穿透核对（按严重程度排序）</span>
          </h3>
          <span class="text-xs text-slate-400">依据《水法》《大气法》《固废法》与排污许可条例</span>
        </div>

        <div class="space-y-4">
          <div
            v-for="risk in COMPLIANCE_RESULT_DATA.topRisks"
            :key="risk.id"
            :class="[
              'p-5 rounded-xl border space-y-3 transition-all',
              risk.level === 'high'
                ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                : 'bg-amber-950/20 border-amber-500/40 text-slate-200',
            ]"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span :class="['px-2 py-0.5 rounded text-xs font-mono font-bold', risk.level === 'high' ? 'bg-rose-500 text-slate-950' : 'bg-amber-500 text-slate-950']">
                  {{ risk.id }} · {{ risk.priority }}
                </span>
                <h4 class="text-sm font-bold text-slate-100">{{ risk.title }}</h4>
              </div>

              <span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold">
                潜在处罚敞口：{{ risk.penaltyExposure }}
              </span>
            </div>

            <!-- Legal Clause Reference -->
            <div class="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Scale class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span class="font-semibold text-amber-300">法律条款与处罚依据：</span>
                <span class="text-slate-300 ml-1">{{ risk.lawClause }}</span>
              </div>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed">
              <strong class="text-slate-200">事实核查：</strong>
              {{ risk.detail }}
            </p>

            <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
              <strong class="text-emerald-400">💡 AI 专家整改建议：</strong>
              {{ risk.rectification }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Action Items & Responsibilities -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <UserCheck class="w-4 h-4" />
          <span>整改行动工单清单（明确岗位、期限与标准）</span>
        </h3>

        <div class="space-y-3">
          <div
            v-for="act in COMPLIANCE_RESULT_DATA.actions"
            :key="act.id"
            class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div class="space-y-1.5 max-w-2xl">
              <div class="flex items-center gap-2">
                <span :class="['px-2 py-0.5 rounded text-xs font-semibold', act.priority.includes('P0') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30']">
                  {{ act.priority }}
                </span>
                <h4 class="text-xs font-bold text-slate-100">{{ act.title }}</h4>
              </div>
              <p class="text-xs text-slate-400">{{ act.description }}</p>
              <div class="text-[11px] text-emerald-400">💡 指引：{{ act.suggestedAction }}</div>
            </div>

            <div class="flex md:flex-col items-end justify-between text-right text-xs gap-2 min-w-[160px]">
              <div class="text-slate-400">
                责任部门：<span class="text-slate-200 font-semibold">{{ act.department }}</span>
              </div>
              <div class="text-amber-400 font-medium">完成期限：{{ act.deadline }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Professional Disclaimer Footer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
      <p>
        <strong>专业合规提示：</strong>
        本体检报告由 XX AI 环保大模型与国家环保法规知识库智能生成，供企业环境管理自查与整改参考。对于涉及重大行政处罚诉讼或重大技术改造投资，最终方案请以注册环保工程师审核及属地生态环境主管部门现行要求为准。
      </p>
    </div>

    <!-- Export Modal -->
    <EnvExportModal
      :is-open="showExportModal"
      :report-title="`${activeCase.companyName} 企业环保合规体检与整改诊断报告`"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      :summary-text="`综合合规评分 ${COMPLIANCE_RESULT_DATA.overallScore} 分 (${COMPLIANCE_RESULT_DATA.riskLevelText})。重点查出总氮连续超标超标罚款风险、DA001活性炭更换台账缺失及HW49废活性炭存期达320天超期风险，已配套生成 3 项闭环整改工单。`"
      @close="showExportModal = false"
    />
  </div>
</template>
