<!-- ============================================================================
     AI 法务员工 · 合同审查核心视图（三阶段向导：config → running → result）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/review/ContractReviewView.tsx
     props: { initialContractPreset?; reviewDeepLink? } —— emits: deep-link-consumed
     深链消费（onMounted，仅一次）：
       autoRun / stage=running  → 直入 running 推理动画（自然落 result·overview）
       stage=result / tab 提供 → 直落 result 并切对应页签
       tab=risks 且 openFirstHighRisk → 自动打开首个高风险白盒
     结果数据一律来自 DEFAULT_EQUIPMENT_REVIEW_DATA（固定演示数据集）
     顶部渲染 LegalDisclaimer banner（本簇唯一 banner；全局 footer 由容器渲染）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  AlertTriangle,
  ArrowRight,
  CheckSquare,
  ChevronRight,
  Columns,
  FileText,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Square,
  UploadCloud,
} from 'lucide-vue-next'
import type {
  ContractReviewData,
  ReviewDeepLink,
  ReviewStage,
  ReviewTab,
  RiskItem,
  RiskLevel,
} from '@/data/legalIntelData'
import { REVIEW_FOCUS_OPTIONS, REVIEW_PRESETS } from '@/data/legalIntelData'
import { DEFAULT_EQUIPMENT_REVIEW_DATA } from '@/data/legalMockData'
import LegalDisclaimer from './LegalDisclaimer.vue'
import LegalReviewRunning from './LegalReviewRunning.vue'
import LegalRiskDetailModal from './LegalRiskDetailModal.vue'
import LegalReportModal from './LegalReportModal.vue'

const props = withDefaults(
  defineProps<{
    /** 初始选中的模拟合同文件名（来自首页/合同库/待办等入口） */
    initialContractPreset?: string
    /** 工作台深链参数：控制打开后的初始阶段/页签（容器消费后清空门闩） */
    reviewDeepLink?: ReviewDeepLink
  }>(),
  { initialContractPreset: '设备采购合同.pdf' },
)

const emit = defineEmits<{ (e: 'deep-link-consumed'): void }>()

// ---- 固定演示审查数据源（与原型一致：结果数据与 config 输入解耦） ----
const reviewData: ContractReviewData = DEFAULT_EQUIPMENT_REVIEW_DATA

// ---- 三阶段状态机 ----
const stage = ref<ReviewStage>('config')

// ---- Config 阶段状态 ----
const selectedFileName = ref(props.initialContractPreset)
const partyA = ref('XX科技有限公司（或企业自身）')
const partyB = ref('ABC设备有限公司')
const contractType = ref('设备采购合同')
const focusItems = ref<Record<string, boolean>>(
  REVIEW_FOCUS_OPTIONS.reduce<Record<string, boolean>>((acc, opt) => {
    acc[opt.id] = opt.defaultChecked
    return acc
  }, {}),
)

const toggleFocusItem = (id: string) => {
  focusItems.value[id] = !focusItems.value[id]
}

// 选择模拟合同：按文件名关键字联动合同类型/乙方（照原型 handleSelectPresetContract）
const handleSelectPresetContract = (fileName: string) => {
  selectedFileName.value = fileName
  if (fileName.includes('销售')) {
    contractType.value = '产品销售合同'
    partyB.value = '客户销售方'
  } else if (fileName.includes('服务')) {
    contractType.value = '技术服务合同'
    partyB.value = '某技术咨询服务商'
  } else if (fileName.includes('软件')) {
    contractType.value = '软件采购合同'
    partyB.value = '用友广联软件系统股份有限公司'
  } else {
    contractType.value = '设备采购合同'
    partyB.value = 'ABC设备有限公司'
  }
}

const handleStartScan = () => {
  stage.value = 'running'
}

const handleScanComplete = () => {
  stage.value = 'result'
  activeTab.value = 'overview'
}

// ---- Result 阶段状态 ----
const activeTab = ref<ReviewTab>('overview')
const riskFilter = ref<'all' | RiskLevel>('all')
const riskSearchQuery = ref('')
const selectedRisk = ref<RiskItem | null>(null)
const isReportModalOpen = ref(false)
const addedReportRiskIds = ref<string[]>([])

const isRiskAdded = (riskId: string): boolean => addedReportRiskIds.value.includes(riskId)

const handleAddToReport = (riskId: string) => {
  if (!addedReportRiskIds.value.includes(riskId)) {
    addedReportRiskIds.value = [...addedReportRiskIds.value, riskId]
  }
}

// 风险清单过滤（等级 + 关键字，照原型 filteredRisks）
const filteredRisks = computed(() =>
  reviewData.risks.filter((risk) => {
    const matchesFilter = riskFilter.value === 'all' || risk.riskLevel === riskFilter.value
    const q = riskSearchQuery.value.trim().toLowerCase()
    const matchesQuery =
      q === '' ||
      risk.title.toLowerCase().includes(q) ||
      risk.clauseIndex.toLowerCase().includes(q) ||
      risk.clauseTitle.toLowerCase().includes(q)
    return matchesFilter && matchesQuery
  }),
)

// 「法务必须关注事项」点击 → 定位到对应风险白盒（照原型 find 匹配逻辑）
const handleOpenConcern = (title: string, clauseNumber: string) => {
  const target =
    reviewData.risks.find(
      (r) => r.clauseTitle.includes(title.slice(0, 4)) || r.clauseIndex.includes(clauseNumber.slice(0, 3)),
    ) ?? reviewData.risks[0]
  selectedRisk.value = target
}

const openFirstHighRisk = () => {
  const firstHigh = reviewData.risks.find((r) => r.riskLevel === 'high')
  if (firstHigh) selectedRisk.value = firstHigh
}

// ---- 深链消费（onMounted 单次；容器收到 deep-link-consumed 后清空门闩，不会重复触发） ----
onMounted(() => {
  const link = props.reviewDeepLink
  if (!link) return
  if (link.autoRun || link.stage === 'running') {
    stage.value = 'running'
  } else if (link.stage === 'result' || link.tab) {
    stage.value = 'result'
    if (link.tab) {
      activeTab.value = link.tab
      if (link.tab === 'risks' && link.openFirstHighRisk) openFirstHighRisk()
    }
  }
  emit('deep-link-consumed')
})
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- 顶部法律免责提示（本簇唯一 banner） -->
    <LegalDisclaimer />

    <!-- Stage 1: 上传与审查任务配置 -->
    <div v-if="stage === 'config'" class="space-y-6 max-w-4xl mx-auto">
      <!-- 标题区 -->
      <div class="border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500" />
          <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            合同AI审查 · 第一步
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1">
          AI合同审查
        </h1>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          上传合同，AI自动提取关键条款并识别潜在风险。
        </p>
      </div>

      <!-- 上传区域 -->
      <div
        class="border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-8 sm:p-12 text-center bg-slate-900/60 transition-all group"
      >
        <div
          class="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/25 text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
        >
          <UploadCloud class="w-7 h-7" />
        </div>

        <div class="text-base font-bold text-slate-200 mb-1">
          拖拽合同到这里，或点击选择文件
        </div>
        <p class="text-xs text-slate-400 mb-4">
          支持扩展名：PDF / Word (.docx, .doc) / TXT · 单个文件最大支持 50MB
        </p>

        <div
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium"
        >
          <FileText class="w-4 h-4 text-blue-400" />
          <span>当前已选中：</span>
          <strong class="text-blue-300 font-semibold">{{ selectedFileName }}</strong>
        </div>
      </div>

      <!-- 模拟合同选择 -->
      <div class="bg-slate-900/60 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div class="text-xs font-bold text-slate-300">
          或者选择模拟合同（一键体验）：
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            v-for="item in REVIEW_PRESETS"
            :key="item.name"
            type="button"
            @click="handleSelectPresetContract(item.name)"
            :class="[
              'p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedFileName === item.name
                ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/25 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900',
            ]"
          >
            <div class="flex items-center justify-between mb-1.5">
              <FileText
                class="w-4 h-4 shrink-0"
                :class="selectedFileName === item.name ? 'text-blue-400' : 'text-slate-500'"
              />
              <span
                class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium border border-slate-700/50"
              >
                {{ item.badge }}
              </span>
            </div>
            <div class="text-xs font-bold text-slate-200 truncate">{{ item.label }}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">点击切换审查范本</div>
          </button>
        </div>
      </div>

      <!-- 审查任务设置 -->
      <div class="bg-slate-900/60 rounded-xl p-6 border border-slate-800 shadow-sm space-y-5">
        <h2 class="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
          合同审查任务设置
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              审查对象 · 甲方（我方）
            </label>
            <input
              v-model="partyA"
              type="text"
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950/80 text-slate-200 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              审查对象 · 乙方（相对方）
            </label>
            <input
              v-model="partyB"
              type="text"
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950/80 text-slate-200 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              合同类型识别
            </label>
            <input
              v-model="contractType"
              type="text"
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950/80 text-slate-200 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <!-- 审查重点 10 项勾选 -->
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <label class="text-xs font-bold text-slate-300">
              审查重点（可勾选重点扫描维度）：
            </label>
            <span class="text-[11px] text-blue-400">默认已全选10大核心维度</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <button
              v-for="opt in REVIEW_FOCUS_OPTIONS"
              :key="opt.id"
              type="button"
              @click="toggleFocusItem(opt.id)"
              :class="[
                'flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer',
                focusItems[opt.id]
                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-300 font-semibold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300',
              ]"
            >
              <CheckSquare
                v-if="focusItems[opt.id]"
                class="w-4 h-4 text-blue-400 shrink-0"
              />
              <Square v-else class="w-4 h-4 text-slate-500 shrink-0" />
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- 开始审查 CTA -->
        <div class="pt-3 flex justify-end">
          <button
            type="button"
            @click="handleStartScan"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>开始AI审查</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stage 2: AI 执行动画 -->
    <LegalReviewRunning v-else-if="stage === 'running'" @complete="handleScanComplete" />

    <!-- Stage 3: 完整审查结果 -->
    <div v-else-if="stage === 'result'" class="space-y-6 max-w-6xl mx-auto">
      <!-- 结果头部与操作 -->
      <div
        class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <div class="flex items-center gap-2">
            <span
              class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 font-semibold border border-emerald-800/40"
            >
              AI 首轮审查已完成
            </span>
            <span class="text-xs text-slate-400">审查耗时：2分18秒</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mt-1.5">
            {{ reviewData.contractTitle }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            甲方：{{ reviewData.partyA }} · 乙方：{{ reviewData.partyB }}
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button
            type="button"
            @click="stage = 'config'"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            <span>重新审查</span>
          </button>

          <button
            type="button"
            @click="isReportModalOpen = true"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <FileText class="w-4 h-4" />
            <span>生成完整审查报告</span>
          </button>
        </div>
      </div>

      <!-- 顶部数据卡（7 项，数值取自 reviewData） -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div class="text-[11px] text-slate-400">合同金额</div>
          <div class="text-lg font-black text-blue-400 font-mono mt-0.5">
            {{ reviewData.contractAmount }}
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div class="text-[11px] text-slate-400">合同期限</div>
          <div class="text-lg font-black text-slate-200 font-mono mt-0.5">
            {{ reviewData.contractDuration }}
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div class="text-[11px] text-slate-400">识别条款</div>
          <div class="text-lg font-black text-slate-200 font-mono mt-0.5">
            {{ reviewData.totalClauses }}
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div class="text-[11px] text-slate-400">风险事项</div>
          <div class="text-lg font-black text-slate-100 font-mono mt-0.5">
            {{ reviewData.totalRisks }}
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-800/40 shadow-sm">
          <div class="text-[11px] text-rose-300 font-medium">高风险</div>
          <div class="text-lg font-black text-rose-400 font-mono mt-0.5">
            {{ reviewData.highRiskCount }}
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-amber-950/25 border border-amber-800/40 shadow-sm">
          <div class="text-[11px] text-amber-300 font-medium">中风险</div>
          <div class="text-lg font-black text-amber-400 font-mono mt-0.5">
            {{ reviewData.mediumRiskCount }}
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 shadow-sm">
          <div class="text-[11px] text-slate-400 font-medium">低风险</div>
          <div class="text-lg font-black text-slate-300 font-mono mt-0.5">
            {{ reviewData.lowRiskCount }}
          </div>
        </div>
      </div>

      <!-- 页签导航 -->
      <div class="flex border-b border-slate-800 space-x-6 text-sm font-semibold overflow-x-auto">
        <button
          type="button"
          @click="activeTab = 'overview'"
          :class="[
            'pb-3 border-b-2 transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200',
          ]"
        >
          合同风险总览与评分
        </button>
        <button
          type="button"
          @click="activeTab = 'risks'"
          :class="[
            'pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
            activeTab === 'risks'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200',
          ]"
        >
          <span>风险事项清单</span>
          <span
            class="text-xs px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30"
          >
            {{ reviewData.totalRisks }}
          </span>
        </button>
        <button
          type="button"
          @click="activeTab = 'comparisons'"
          :class="[
            'pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
            activeTab === 'comparisons'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200',
          ]"
        >
          <Columns class="w-4 h-4" />
          <span>AI 条款对比 (原合同 vs 建议版本)</span>
        </button>
        <button
          type="button"
          @click="activeTab = 'summary'"
          :class="[
            'pb-3 border-b-2 transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'summary'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200',
          ]"
        >
          合同核心摘要与结论
        </button>
      </div>

      <!-- Tab 1: 风险总览与评分 -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 评分卡 -->
          <div
            class="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col items-center justify-center text-center"
          >
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI 合同风险综合评分
            </div>
            <div class="relative my-4 flex items-baseline justify-center">
              <span class="text-6xl font-black text-rose-500 tracking-tight font-mono">
                {{ reviewData.overallScore }}
              </span>
              <span class="text-slate-500 text-xl font-bold ml-1">/ 100</span>
            </div>
            <div
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs mb-3"
            >
              <AlertTriangle class="w-3.5 h-3.5" />
              <span>等级：{{ reviewData.overallRiskLevel }}</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed max-w-xs">
              多项关键条款对甲方不利，建议在正式盖章前根据AI示范条款进行谈判修正。
            </p>
          </div>

          <!-- 各维度风险拆解 -->
          <div class="lg:col-span-2 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-bold text-slate-100">
                各维度风险拆解（风险评分由高至低）
              </h2>
              <span class="text-xs text-slate-500">分值越高代表风险隐患越突出</span>
            </div>

            <div class="space-y-3">
              <div v-for="item in reviewData.riskBreakdown" :key="item.category" class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-200 flex items-center gap-2">
                    <span>{{ item.category }}</span>
                    <span class="text-[10px] text-slate-500">({{ item.riskCount }}项风险)</span>
                  </span>
                  <span class="font-mono font-bold text-slate-300">{{ item.score }}</span>
                </div>
                <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="
                      item.score >= 80
                        ? 'bg-rose-500'
                        : item.score >= 65
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                    "
                    :style="{ width: `${item.score}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 法务必须关注事项（P0/P1/P2） -->
        <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ShieldAlert class="w-4 h-4 text-rose-400" />
              <h2 class="text-sm font-bold text-slate-100">
                法务必须关注事项（AI优先级排序）
              </h2>
            </div>
            <span class="text-xs text-slate-500">点击任意事项可直接定位示范条款</span>
          </div>

          <div class="divide-y divide-slate-800">
            <div
              v-for="(item, idx) in reviewData.criticalConcerns"
              :key="idx"
              @click="handleOpenConcern(item.title, item.clauseNumber)"
              class="py-3.5 flex items-start justify-between gap-4 hover:bg-slate-800/50 px-2 rounded-lg transition-colors cursor-pointer group"
            >
              <div class="flex items-start gap-3">
                <span
                  :class="[
                    'text-[10px] px-2 py-0.5 rounded font-bold shrink-0 mt-0.5 border',
                    item.priority === 'P0'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : item.priority === 'P1'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  ]"
                >
                  {{ item.priority }}
                </span>
                <div>
                  <div class="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {{ item.title }}
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 text-xs font-mono text-slate-500 shrink-0">
                <span>{{ item.clauseNumber }}</span>
                <ChevronRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <!-- AI 最终审查结论 -->
        <div class="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 border border-slate-800">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4"
          >
            <div>
              <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                AI 最终审查结论
              </span>
              <h2 class="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                总体风险评定：
                <span class="text-rose-400 font-black ml-1">
                  {{ reviewData.overallRiskLevel }}
                </span>
              </h2>
            </div>

            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold"
            >
              <AlertTriangle class="w-4 h-4" />
              <span>建议：{{ reviewData.reviewConclusion.overallVerdict }}</span>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {{ reviewData.reviewConclusion.actionAdvice }}
          </p>

          <div class="space-y-2 pt-2">
            <div class="text-xs font-bold text-slate-400">签署前重点修改优先顺序：</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div
                v-for="(item, idx) in reviewData.reviewConclusion.prioritizedModifications.slice(0, 3)"
                :key="idx"
                class="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs"
              >
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold mr-1.5"
                >
                  {{ item.priority }}
                </span>
                <div class="text-slate-200 font-semibold mt-1 line-clamp-2">{{ item.item }}</div>
              </div>
            </div>
          </div>

          <div class="pt-4 flex justify-end">
            <button
              type="button"
              @click="isReportModalOpen = true"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FileText class="w-4 h-4" />
              <span>生成完整审查报告（8大章节）</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab 2: 风险事项清单 -->
      <div v-else-if="activeTab === 'risks'" class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-5">
        <!-- 表格控制条 -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div class="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              type="button"
              @click="riskFilter = 'all'"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                riskFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200',
              ]"
            >
              全部风险 ({{ reviewData.risks.length }})
            </button>
            <button
              type="button"
              @click="riskFilter = 'high'"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                riskFilter === 'high'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/40',
              ]"
            >
              🔴 高风险 ({{ reviewData.highRiskCount }})
            </button>
            <button
              type="button"
              @click="riskFilter = 'medium'"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                riskFilter === 'medium'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-950/40 text-amber-400 border border-amber-800/40 hover:bg-amber-900/40',
              ]"
            >
              🟠 中风险 ({{ reviewData.mediumRiskCount }})
            </button>
            <button
              type="button"
              @click="riskFilter = 'low'"
              :class="[
                'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                riskFilter === 'low'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200',
              ]"
            >
              🟡 低风险 ({{ reviewData.lowRiskCount }})
            </button>
          </div>

          <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              v-model="riskSearchQuery"
              type="text"
              placeholder="搜索风险事项或条款..."
              class="w-full sm:w-60 pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- 风险表格 -->
        <div class="border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th class="px-4 py-3">风险事项</th>
                <th class="px-4 py-3">涉及条款</th>
                <th class="px-4 py-3">风险等级</th>
                <th class="px-4 py-3 text-right">风险评分</th>
                <th class="px-4 py-3">AI 建议类型</th>
                <th class="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              <tr
                v-for="risk in filteredRisks"
                :key="risk.id"
                @click="selectedRisk = risk"
                class="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <td class="px-4 py-3.5 font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                  <div class="flex items-center gap-2">
                    <span>{{ risk.title }}</span>
                    <span
                      v-if="isRiskAdded(risk.id)"
                      class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50"
                    >
                      已加入报告
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3.5 font-mono text-slate-400">
                  {{ risk.clauseIndex }}
                </td>
                <td class="px-4 py-3.5">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] border',
                      risk.riskLevel === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : risk.riskLevel === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700',
                    ]"
                  >
                    <span>
                      {{ risk.riskLevel === 'high' ? '🔴 高' : risk.riskLevel === 'medium' ? '🟠 中' : '🟡 低' }}
                    </span>
                  </span>
                </td>
                <td class="px-4 py-3.5 font-mono font-bold text-slate-200 text-right">
                  {{ risk.score }}
                </td>
                <td class="px-4 py-3.5">
                  <span
                    class="px-2 py-0.5 rounded bg-blue-600/15 text-blue-300 font-medium border border-blue-500/30"
                  >
                    {{ risk.suggestionType }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-right">
                  <span
                    class="text-blue-400 font-semibold inline-flex items-center gap-1 group-hover:underline"
                  >
                    <span>查看详情</span>
                    <ChevronRight class="w-3 h-3" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: AI 条款对比 -->
      <div v-else-if="activeTab === 'comparisons'" class="space-y-6">
        <div
          class="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
        >
          <div>
            <h2 class="text-sm font-bold text-slate-100">
              AI 条款逐条对比（原合同 vs AI建议示范版本）
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              AI不仅“发现问题”，更能直接帮助法务出具符合买方权益的修改版本
            </p>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
              <span class="text-slate-400">原合同版本</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded bg-emerald-950/60 border border-emerald-500/40" />
              <span class="text-emerald-400 font-semibold">AI 示范修改版本</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="comp in reviewData.comparisons"
            :key="comp.id"
            class="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-3"
          >
            <div
              class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="text-xs px-2 py-0.5 rounded bg-blue-600/15 text-blue-300 font-bold border border-blue-500/30"
                >
                  {{ comp.clauseNumber }}
                </span>
                <h3 class="text-sm font-bold text-slate-100">
                  {{ comp.title }}
                </h3>
                <span class="text-xs text-slate-500">（{{ comp.category }}）</span>
              </div>
              <span class="text-xs text-slate-400">{{ comp.changeExplanation }}</span>
            </div>

            <!-- 左右双栏对比 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>原合同条款</span>
                  <span class="text-[10px] text-slate-500 font-normal">待修改</span>
                </div>
                <div class="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
                  {{ comp.originalClause }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span class="flex items-center gap-1.5">
                    <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI 建议版本（示范条款）</span>
                  </span>
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30"
                  >
                    推荐采纳
                  </span>
                </div>
                <div class="text-xs text-emerald-200 font-mono leading-relaxed whitespace-pre-wrap">
                  {{ comp.proposedClause }}
                </div>
              </div>
            </div>

            <!-- 修改亮点 -->
            <div class="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span class="text-slate-400 font-medium">修改亮点：</span>
              <span
                v-for="(kc, i) in comp.keyChanges"
                :key="i"
                class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60"
              >
                ✓ {{ kc }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: 合同核心摘要 -->
      <div v-else-if="activeTab === 'summary'" class="space-y-6">
        <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
          <h2 class="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
            合同核心信息抽取与摘要
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span class="text-slate-400 block mb-1">合同类型</span>
              <span class="font-bold text-slate-100 text-sm">
                {{ reviewData.contractType }}
              </span>
            </div>

            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span class="text-slate-400 block mb-1">标的总金额</span>
              <span class="font-bold text-blue-400 text-sm">
                {{ reviewData.contractAmount }}
              </span>
            </div>

            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span class="text-slate-400 block mb-1">合同期限</span>
              <span class="font-bold text-slate-100 text-sm">
                {{ reviewData.contractDuration }}
              </span>
            </div>

            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span class="text-slate-400 block mb-1">付款方式约定</span>
              <span class="font-bold text-rose-400 text-sm">
                {{ reviewData.paymentMethod }}（风险偏高）
              </span>
            </div>

            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span class="text-slate-400 block mb-1">交付周期</span>
              <span class="font-bold text-slate-100 text-sm">
                {{ reviewData.deliveryPeriod }}
              </span>
            </div>

            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span class="text-slate-400 block mb-1">违约责任比例</span>
              <span class="font-bold text-rose-400 text-sm">
                {{ reviewData.breachPenalty }}
              </span>
            </div>

            <div class="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 sm:col-span-2">
              <span class="text-slate-400 block mb-1">争议解决管辖</span>
              <span class="font-bold text-slate-100 text-sm">
                {{ reviewData.disputeResolution }}（建议更改为原告或甲方住所地法院）
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 风险白盒详情弹窗 -->
    <LegalRiskDetailModal
      :open="selectedRisk !== null"
      :risk="selectedRisk"
      :is-added-to-report="selectedRisk ? isRiskAdded(selectedRisk.id) : false"
      @close="selectedRisk = null"
      @add-to-report="handleAddToReport"
    />

    <!-- 完整审查报告弹窗 -->
    <LegalReportModal
      :is-open="isReportModalOpen"
      :data="reviewData"
      :added-risk-ids="addedReportRiskIds"
      @close="isReportModalOpen = false"
    />
  </div>
</template>
