<!-- ============================================================================
     AI 法务员工 · 企业多维度合规健康体检（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/compliance/EnterpriseComplianceView.tsx
     数据：MOCK_ENTERPRISE_PROFILES[0]（企业画像）+ MOCK_COMPLIANCE_CATEGORIES（8 大合规维度）
     Vue 数据字段对齐：ComplianceCategory.score/level/description/keyRisks/actionPlans
     （原型 actionItems/riskCount 由 actionPlans / keyRisks.length 等价呈现）
     图标映射：CheckCircle2→CircleCheck、AlertTriangle→TriangleAlert（0.577 新命名）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Building2, ChevronRight, CircleCheck, Download, TriangleAlert } from 'lucide-vue-next'
import { MOCK_COMPLIANCE_CATEGORIES, MOCK_ENTERPRISE_PROFILES } from '@/data/legalMockData'
import type { ComplianceCategory } from '@/data/legalIntelData'

// 行业场景切换清单（照原型逐字硬编码，React 原型即如此）
const INDUSTRIES = [
  '新能源与储能装备制造',
  '跨境电商与出海贸易',
  '智能高端制造',
  '生物医药与医疗器械',
  '企业级SaaS与人工智能',
]

// 当前诊断企业画像：照 App.tsx 默认取档案第一条
const profile = MOCK_ENTERPRISE_PROFILES[0]

const selectedIndustry = ref<string>('新能源与储能装备制造')
const selectedDimension = ref<ComplianceCategory>(MOCK_COMPLIANCE_CATEGORIES[0])
const exportToast = ref<string | null>(null)
let toastTimer1: ReturnType<typeof setTimeout> | null = null
let toastTimer2: ReturnType<typeof setTimeout> | null = null

const levelText = (level: string): string => (level === 'high' ? '高' : level === 'medium' ? '中' : '低')
// 维度等级徽章配色：high rose / medium amber / low emerald
const levelBadgeClass = (level: string): string =>
  level === 'high'
    ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
    : level === 'medium'
      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
// 整改计划优先级徽章配色：P0 rose / P1 amber / P2 blue
const planPriorityClass = (priority: string): string =>
  priority === 'P0'
    ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
    : priority === 'P1'
      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
      : 'bg-blue-950/60 text-blue-300 border border-blue-800/50'

const handleExportRoadmap = () => {
  exportToast.value = '正在生成《企业合规全景排查与P0整改计划白皮书.pdf》...'
  if (toastTimer1) clearTimeout(toastTimer1)
  toastTimer1 = setTimeout(() => {
    exportToast.value = '下载已完成！已为您输出高管汇报专属格式。'
    if (toastTimer2) clearTimeout(toastTimer2)
    toastTimer2 = setTimeout(() => {
      exportToast.value = null
    }, 3000)
  }, 1500)
}

const closeToast = () => {
  exportToast.value = null
}

onBeforeUnmount(() => {
  if (toastTimer1) clearTimeout(toastTimer1)
  if (toastTimer2) clearTimeout(toastTimer2)
})
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500" />
          <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            全业务场景合规风险全景地图
          </span>
        </div>
        <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
          企业多维度合规健康体检
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          基于8大合规维度对企业组织、经营与涉外贸易进行全方位扫描，定位合规隐患并制定落地整改路线图
        </p>
      </div>

      <button
        type="button"
        @click="handleExportRoadmap"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
      >
        <Download class="w-4 h-4" />
        <span>导出合规全景整改报告</span>
      </button>
    </div>

    <!-- Export Toast -->
    <div
      v-if="exportToast"
      class="p-3 bg-blue-600 text-white rounded-xl text-xs font-medium flex items-center justify-between"
    >
      <span>{{ exportToast }}</span>
      <button type="button" class="cursor-pointer" @click="closeToast">✕</button>
    </div>

    <!-- Industry Scenario Switcher -->
    <div class="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <Building2 class="w-4 h-4 text-slate-400" />
        <span class="text-xs font-bold text-slate-300">当前诊断行业画像：</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="ind in INDUSTRIES"
          :key="ind"
          type="button"
          @click="selectedIndustry = ind"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
          :class="
            selectedIndustry === ind
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
          "
        >
          {{ ind }}
        </button>
      </div>
    </div>

    <!-- 企业合规画像（默认取 MOCK_ENTERPRISE_PROFILES[0]） -->
    <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
      <div class="flex items-start gap-3 lg:w-72 shrink-0">
        <div class="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/25 text-blue-400 flex items-center justify-center shrink-0">
          <Building2 class="w-5 h-5" />
        </div>
        <div>
          <div class="text-sm font-bold text-slate-100">{{ profile.name }}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">
            {{ profile.industry }} · {{ profile.scale }}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5 font-mono">
            {{ profile.employees }}人 · {{ profile.targetMarkets.join(' / ') }}
          </div>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-[11px] text-slate-400">主营业务</div>
        <div class="text-xs text-slate-300 mt-0.5 leading-relaxed">{{ profile.mainBusiness }}</div>
        <div class="text-[11px] text-slate-400 mt-2">AI 合规风险画像总评</div>
        <div class="text-xs text-slate-300 mt-0.5 leading-relaxed">{{ profile.summary }}</div>
      </div>
      <div class="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
        <div>
          <div class="text-[11px] text-slate-400">综合风险评分</div>
          <div class="text-xl font-black font-mono" :class="profile.riskScore >= 75 ? 'text-rose-500' : profile.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'">
            {{ profile.riskScore }}
            <span class="text-xs font-normal text-slate-500 ml-1">/100</span>
          </div>
        </div>
        <div class="w-px h-8 bg-slate-800" />
        <div>
          <div class="text-[11px] text-slate-400">风险等级</div>
          <span class="text-xs px-2 py-0.5 rounded font-bold" :class="levelBadgeClass(profile.riskLevel === '高' ? 'high' : profile.riskLevel === '中等' ? 'medium' : 'low')">
            {{ profile.riskLevel }}风险
          </span>
        </div>
      </div>
    </div>

    <!-- 8 Compliance Dimensions Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="dim in MOCK_COMPLIANCE_CATEGORIES"
        :key="dim.id"
        @click="selectedDimension = dim"
        class="p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between"
        :class="
          selectedDimension.id === dim.id
            ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-sm'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:shadow-sm'
        "
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] px-2 py-0.5 rounded font-bold" :class="levelBadgeClass(dim.level)">
              {{ levelText(dim.level) }}风险 · {{ dim.score }}分
            </span>
            <span class="text-xs text-slate-500 font-mono">{{ dim.keyRisks.length }}项隐患</span>
          </div>
          <h3 class="text-sm font-bold text-slate-100 mb-1">{{ dim.name }}</h3>
          <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {{ dim.description }}
          </p>
        </div>

        <div class="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400">
          <span>查看整改清单</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </div>
      </div>
    </div>

    <!-- Selected Dimension Detail Card -->
    <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 font-bold">
              重点分析维度
            </span>
            <span class="text-xs text-slate-400">行业基准：{{ selectedIndustry }}</span>
          </div>
          <h2 class="text-xl font-bold text-slate-100 mt-1">
            {{ selectedDimension.name }}合规诊断详析
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">{{ selectedDimension.description }}</p>
        </div>

        <div class="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
          <div>
            <div class="text-[11px] text-slate-400">风险评分</div>
            <div class="text-xl font-black font-mono" :class="selectedDimension.level === 'high' ? 'text-rose-500' : selectedDimension.level === 'medium' ? 'text-amber-400' : 'text-emerald-400'">
              {{ selectedDimension.score }}
              <span class="text-xs font-normal text-slate-500 ml-1">/100</span>
            </div>
          </div>
          <div class="w-px h-8 bg-slate-800" />
          <div>
            <div class="text-[11px] text-slate-400">隐患项</div>
            <div class="text-xl font-black text-slate-200 font-mono">
              {{ selectedDimension.keyRisks.length }}
              <span class="text-xs font-normal text-slate-500 ml-1">条</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 已识别重点隐患 -->
      <div class="space-y-2.5">
        <div class="text-xs font-bold text-slate-300 flex items-center gap-2">
          <TriangleAlert class="w-4 h-4 text-rose-400" />
          <span>AI 已识别重点隐患清单：</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div
            v-for="(risk, idx) in selectedDimension.keyRisks"
            :key="idx"
            class="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 p-3 rounded-lg"
          >
            <span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0" :class="selectedDimension.level === 'high' ? 'bg-rose-500' : selectedDimension.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'" />
            <span class="leading-relaxed">{{ risk }}</span>
          </div>
        </div>
      </div>

      <!-- Action Plans（P0/P1/P2 整改路线图） -->
      <div class="space-y-3">
        <div class="text-xs font-bold text-slate-300 flex items-center gap-2">
          <CircleCheck class="w-4 h-4 text-emerald-400" />
          <span>AI 输出之企业落地整改行动路线图：</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(plan, idx) in selectedDimension.actionPlans"
            :key="idx"
            class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 hover:bg-slate-800/40 transition-colors"
          >
            <span class="w-6 h-6 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {{ idx + 1 }}
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <div class="text-xs font-bold text-slate-200">行动项 0{{ idx + 1 }}</div>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-bold" :class="planPriorityClass(plan.priority)">
                  {{ plan.priority }}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                {{ plan.action }}
              </p>
              <div class="text-[11px] text-slate-500 mt-1.5 font-mono">
                责任部门：{{ plan.department }} · 完成周期：{{ plan.cycle }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
