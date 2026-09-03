<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import StageDetails from '@/components/StageDetails.vue'
import NodeDemoModal from '@/components/demos/NodeDemoModal.vue'
import QuestionOriginDemo from '@/components/demos/QuestionOriginDemo.vue'
import ResearchAgentDemo from '@/components/demos/ResearchAgentDemo.vue'
import LiteratureAgentDemo from '@/components/demos/LiteratureAgentDemo.vue'
import ResearchInsightDemo from '@/components/demos/ResearchInsightDemo.vue'
import Paper2CodeDemo from '@/components/demos/Paper2CodeDemo.vue'
import DataAgentDemo from '@/components/demos/DataAgentDemo.vue'
import PaperReviewerDemo from '@/components/demos/PaperReviewerDemo.vue'
import ContentStudioDemo from '@/components/demos/ContentStudioDemo.vue'
import BidConsultantDemo from '@/components/demos/BidConsultantDemo.vue'
import EnvEmployeeMatrixDemo from '@/components/demos/EnvEmployeeMatrixDemo.vue'
import EnvModuleGrid from '@/components/EnvModuleGrid.vue'
import TradeIntelDemo from '@/components/demos/TradeIntelDemo.vue'
import EcomSelectionDemo from '@/components/demos/EcomSelectionDemo.vue'
import IpCounselDemo from '@/components/demos/IpCounselDemo.vue'
import LegalEmployeeDemo from '@/components/demos/LegalEmployeeDemo.vue'
import type { StudioView } from '@/data/contentStudioData'
import type { StepKey } from '@/data/bidConsultantData'
import type { EnvEmployeeId } from '@/data/envAgentData'
import type { TradeView } from '@/data/tradeIntelData'
import type { EcomView } from '@/data/ecomIntelData'
import type { IpView } from '@/data/ipIntelData'
import type { LegalView, ReviewDeepLink } from '@/data/legalIntelData'
import { NODE_DEMOS, NEXT_NODE_BY_ID } from '@/data/nodeDemos'
import {
  GraduationCap, ArrowLeft, ArrowRight, Layers, Users, Bot, Wallet,
  ChevronDown, Workflow, BarChart3, Sparkles, CheckCircle2, Terminal, Quote,
  Lightbulb, FlaskConical, BookOpen, Target, Code2, TestTube, LineChart, FileText, Award, Play,
  Radar, ScanSearch, Wand2, MessageSquare, Gauge, Database,
  FileSearch, ShieldAlert, UserCheck, AlertTriangle, Calculator, TrendingUp, GitCompare, CheckSquare, FolderTree, Activity, Stethoscope,
  ShieldCheck, Trophy, FileCheck2, Recycle, Handshake,
  Factory, Globe, Compass, Zap, ShoppingBag, Swords,
  Scale, Search, Building2,
  FilePlus2, FileEdit, FolderKanban, Landmark, ListTodo,
} from 'lucide-vue-next'
import { solutions } from '@/data/solutions'
import type { FunctionalComponent } from 'vue'

const route = useRoute()
const router = useRouter()
const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const slug = computed(() => String(route.params.slug || ''))
const solution = computed(() => solutions.find((s) => s.slug === slug.value))

const iconMap: Record<string, FunctionalComponent> = {
  // 能力图标
  Layers,
  Users,
  Bot,
  Wallet,
  // 链路节点图标
  Lightbulb,
  FlaskConical,
  BookOpen,
  Target,
  Code2,
  TestTube,
  BarChart3,
  LineChart,
  FileText,
  Award,
  // 内容增长工作台节点图标
  Radar,
  ScanSearch,
  Sparkles,
  Wand2,
  MessageSquare,
  Gauge,
  Database,
  // AI 投标顾问节点 / 能力图标
  FileSearch,
  ShieldAlert,
  UserCheck,
  AlertTriangle,
  Calculator,
  TrendingUp,
  GitCompare,
  CheckSquare,
  FolderTree,
  Activity,
  Stethoscope,
  // 环保 AI 员工矩阵节点 / 能力图标
  ShieldCheck,
  Trophy,
  FileCheck2,
  Recycle,
  Handshake,
  // AI 贸易情报员节点 / 能力图标
  Factory,
  Globe,
  Compass,
  Zap,
  // AI 跨境电商选品情报员节点 / 能力图标
  ShoppingBag,
  Swords,
  // AI 知识产权顾问节点 / 能力图标
  Scale,
  Search,
  Building2,
  // AI 法务员工节点 / 能力图标
  FilePlus2,
  FileEdit,
  FolderKanban,
  Landmark,
  ListTodo,
}

// 解决方案主题 class（缺省回退高校科研蓝色主题）
const theme = computed(() => {
  const t = solution.value?.theme ?? {}
  return {
    heroGlow: t.heroGlow ?? 'bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)]',
    badge: t.badge ?? 'bg-blue-50 border-blue-200 text-blue-700',
    badgeIcon: t.badgeIcon ?? 'text-blue-600',
    heroGradientText: t.heroGradientText ?? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent',
    btnPrimary: t.btnPrimary ?? 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25',
    valueCard: t.valueCard ?? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 shadow-xl shadow-blue-600/15',
    ctaCard: t.ctaCard ?? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 shadow-2xl shadow-blue-600/20',
    sectionGradientText: t.sectionGradientText ?? 'from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    cardHoverBorder: t.cardHoverBorder ?? 'hover:border-blue-300',
    iconBox: t.iconBox ?? 'bg-blue-50 border-blue-100 text-blue-600',
    iconBoxActive: t.iconBoxActive ?? 'group-hover:bg-blue-600 group-hover:text-white',
    cardTitleHover: t.cardTitleHover ?? 'group-hover:text-blue-600',
    sectionLine: t.sectionLine ?? 'from-blue-200 via-blue-100 to-blue-300',
    startDot: t.startDot ?? 'bg-blue-50 border-blue-200 text-blue-600',
    startCard: t.startCard ?? 'from-blue-50 to-indigo-50 border-blue-200',
    solidBadge: t.solidBadge ?? 'bg-blue-600 text-white',
    demoBtn: t.demoBtn ?? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/25',
    nodeDotActive: t.nodeDotActive ?? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-600/25',
    nodeDotIdle: t.nodeDotIdle ?? 'bg-white border-blue-200 text-blue-600',
    nodeCardActive: t.nodeCardActive ?? 'border-blue-400 shadow-md ring-1 ring-blue-500/10',
    nodeCardIdle: t.nodeCardIdle ?? 'border-slate-200 hover:border-blue-300',
    roleChip: t.roleChip ?? 'bg-blue-50 text-blue-700 border-blue-100',
    chevronActive: t.chevronActive ?? 'text-blue-600',
    branchIconBox: t.branchIconBox ?? 'bg-indigo-50 border-indigo-100 text-indigo-600',
    branchChip: t.branchChip ?? 'bg-indigo-50 text-indigo-700 border-indigo-100',
    branchBtn: t.branchBtn ?? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    branchCardActive: t.branchCardActive ?? 'border-indigo-300 bg-indigo-50/40 shadow-sm',
    branchCardIdle: t.branchCardIdle ?? 'border-slate-200 bg-white hover:border-indigo-200',
    endCard: t.endCard ?? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 shadow-lg shadow-blue-600/15',
    fundingIcon: t.fundingIcon ?? 'text-blue-600',
    fundingChip: t.fundingChip ?? 'bg-blue-50 text-blue-700 border-blue-200',
    ctaBtnText: t.ctaBtnText ?? 'text-blue-600',
    ctaBtnSecondary: t.ctaBtnSecondary ?? 'bg-blue-700/60 hover:bg-blue-700/80 border-white/30',
  }
})

// 文案覆盖（缺省回退高校科研默认文案）
const heroTitlePrefix = computed(() => solution.value?.heroTitlePrefix ?? '让科研团队')
const heroTitleGradient = computed(() => solution.value?.heroTitleGradient ?? '用得起 · 管得好 · 跑得快')
const valueTitlePrefix = computed(() => solution.value?.valueTitlePrefix ?? '让大模型成为课题组的基础设施，')
const valueTitleSuffix = computed(() => solution.value?.valueTitleSuffix ?? '而不是每个人各自购买、各自摸索的一堆 AI 工具。')
const valueSubtitle = computed(() => solution.value?.valueSubtitle ?? '让每一个课题组，都能拥有一套低成本、可管控、可扩展的 AI 科研工作台。')
const capabilitiesTitlePrefix = computed(() => solution.value?.capabilitiesTitlePrefix ?? '一套平台，覆盖课题组')
const capabilitiesTitleGradient = computed(() => solution.value?.capabilitiesTitleGradient ?? '用 AI 的全部需求')
const pipelineBadge = computed(() => solution.value?.pipelineBadge ?? '科研全流程 · Agent 协作链路')
const pipelineTitlePrefix = computed(() => solution.value?.pipelineTitlePrefix ?? '一个问题，驱动')
const pipelineTitleGradient = computed(() => solution.value?.pipelineTitleGradient ?? '整条科研链路')
const pipelineDesc = computed(() => solution.value?.pipelineDesc ?? '从提出科研问题到最终论文，各 Agent 接力协作。点击节点查看传统痛点、自动化流程与关键成果。')
const ctaTag = computed(() => solution.value?.ctaTag ?? '为课题组部署 Nova AI Gateway')
const ctaTitlePrefix = computed(() => solution.value?.ctaTitlePrefix ?? '让课题组的每一位成员，')
const ctaTitleGradient = computed(() => solution.value?.ctaTitleGradient ?? '都能用上「用得起」的大模型')
const ctaSubtitle = computed(() => solution.value?.ctaSubtitle ?? '统一接入 · 统一管控 · 统一计量。现在接入，即可体验科研 Agent 自动化带来的效率提升。')

// ---- 内容增长工作台：节点 → 工作台视图定位 ----
const CONTENT_STUDIO_VIEW_BY_NODE: Record<string, StudioView> = {
  'cc-start': 'dashboard',
  'viral-radar': 'radar',
  'content-dissect': 'dissect',
  'smart-topics': 'topics',
  'content-generation': 'generation',
  'reply-conversion': 'replies',
  'content-diagnostics': 'diagnostics',
  'asset-library': 'assets',
  'cc-studio': 'agent_hub',
  'cc-end': 'dashboard',
}
const isContentStudio = computed(() => (demoNodeId.value ? demoNodeId.value in CONTENT_STUDIO_VIEW_BY_NODE : false))
const studioInitialView = computed<StudioView>(() =>
  demoNodeId.value ? (CONTENT_STUDIO_VIEW_BY_NODE[demoNodeId.value] ?? 'dashboard') : 'dashboard',
)

// ---- AI 投标顾问：节点 → 投标作战指挥台步骤定位 ----
const BID_STEP_BY_NODE: Record<string, StepKey> = {
  'bid-start': 'overview',
  'tender-analysis': 'overview',
  'qualification-check': 'qualification',
  'risk-scan': 'risks',
  'score-breakdown': 'evaluation',
  'score-strategy': 'strategy',
  'capability-matrix': 'matrix',
  'combat-tasks': 'tasks',
  'proposal-writer': 'proposal',
  'health-check': 'healthCheck',
  'bid-report': 'report',
}
const isBidConsultant = computed(() => (demoNodeId.value ? demoNodeId.value in BID_STEP_BY_NODE : false))
const bidInitialStep = computed<StepKey>(() =>
  demoNodeId.value ? (BID_STEP_BY_NODE[demoNodeId.value] ?? 'overview') : 'overview',
)

// ---- 环保 AI 员工矩阵：节点 → 暗色工作台员工定位（overview 为全景驾驶舱） ----
const ENV_VIEW_BY_NODE: Record<string, EnvEmployeeId | 'overview'> = {
  'env-start': 'overview',
  'env-sales': 'sales',
  'env-bid': 'bid',
  'env-compliance': 'compliance',
  'env-monitoring': 'monitoring',
  'env-waste': 'waste',
  'env-permit': 'permit',
  'env-reporter': 'reporter',
  'env-operations': 'operations',
  'env-end': 'overview',
}
const isEnvMatrix = computed(() => (demoNodeId.value ? demoNodeId.value in ENV_VIEW_BY_NODE : false))
const envInitialEmployee = computed<EnvEmployeeId | 'overview'>(() =>
  demoNodeId.value ? (ENV_VIEW_BY_NODE[demoNodeId.value] ?? 'overview') : 'overview',
)

// ---- AI 贸易情报员：节点 → 贸易情报工作台视图定位 ----
const TRADE_VIEW_BY_NODE: Record<string, TradeView> = {
  'trade-start': 'home',
  'trade-crawl': 'progress',
  'trade-customers': 'customers',
  'trade-suppliers': 'suppliers',
  'trade-market': 'market',
  'trade-competitors': 'competitors',
  'trade-radar': 'radar',
  'trade-end': 'home',
}
const isTradeIntel = computed(() => (demoNodeId.value ? demoNodeId.value in TRADE_VIEW_BY_NODE : false))
const tradeInitialView = computed<TradeView>(() =>
  demoNodeId.value ? (TRADE_VIEW_BY_NODE[demoNodeId.value] ?? 'home') : 'home',
)

// ---- AI 跨境电商选品情报员：节点 → 选品情报工作台视图定位 ----
const ECOM_VIEW_BY_NODE: Record<string, EcomView> = {
  'ecom-start': 'home',
  'ecom-execution': 'agent-executing',
  'ecom-market': 'market-intel',
  'ecom-competitor': 'competitor-analysis',
  'ecom-consumer': 'consumer-insights',
  'ecom-supplier': 'supplier-hub',
  'ecom-profit': 'profit-calc',
  'ecom-report': 'selection-report',
}
const isEcomIntel = computed(() => (demoNodeId.value ? demoNodeId.value in ECOM_VIEW_BY_NODE : false))
const ecomInitialView = computed<EcomView>(() =>
  demoNodeId.value ? (ECOM_VIEW_BY_NODE[demoNodeId.value] ?? 'home') : 'home',
)

// ---- AI 知识产权顾问：节点 → 知产分析工作台视图定位 ----
const IP_VIEW_BY_NODE: Record<string, IpView> = {
  'ip-start': 'home',
  'ip-execution': 'workflow',
  'ip-search': 'search',
  'ip-overview': 'overview',
  'ip-competitor': 'competitors',
  'ip-risk': 'risks',
  'ip-layout': 'layout',
  'ip-report': 'report',
}
const isIpIntel = computed(() => (demoNodeId.value ? demoNodeId.value in IP_VIEW_BY_NODE : false))
const ipInitialView = computed<IpView>(() =>
  demoNodeId.value ? (IP_VIEW_BY_NODE[demoNodeId.value] ?? 'home') : 'home',
)

// ---- AI 法务员工：节点 → 法务工作台视图定位 + 合同审查深链 ----
const LEGAL_VIEW_BY_NODE: Record<string, LegalView> = {
  'legal-start': 'home',
  'legal-execution': 'contract-review',
  'legal-overview': 'contract-review',
  'legal-risk': 'contract-review',
  'legal-clause': 'contract-review',
  'legal-ops': 'contract-management',
  'legal-regulation': 'regulation-search',
  'legal-compliance': 'enterprise-compliance',
  'legal-taskboard': 'my-tasks',
  'legal-report': 'legal-reports',
}
const isLegal = computed(() => (demoNodeId.value ? demoNodeId.value in LEGAL_VIEW_BY_NODE : false))
const legalInitialView = computed<LegalView>(() =>
  demoNodeId.value ? (LEGAL_VIEW_BY_NODE[demoNodeId.value] ?? 'home') : 'home',
)
const legalReviewDeepLink = computed<ReviewDeepLink | undefined>(() => {
  const id = demoNodeId.value
  if (!id) return undefined
  if (id === 'legal-execution') return { autoRun: true, stage: 'running' }
  if (id === 'legal-overview') return { stage: 'result', tab: 'overview' }
  if (id === 'legal-risk') return { stage: 'result', tab: 'risks', openFirstHighRisk: true }
  if (id === 'legal-clause') return { stage: 'result', tab: 'comparisons' }
  return undefined
})

const startNode = computed(() => solution.value?.pipeline.find((s) => s.endpoint) ?? null)
const endNode = computed(() => solution.value?.pipeline.filter((s) => s.endpoint).pop() ?? null)
const mainStages = computed(() => solution.value?.pipeline.filter((s) => !s.endpoint) ?? [])

// 环保方案：详情页链路区改为「8 大业务模块矩阵」平铺（无先后主流程）
const isEnvAgent = computed(() => solution.value?.slug === 'env-agent')

// 展开状态：同一时刻只展开一个节点/分支，默认展开第一个主节点（Research Agent，含并行分支）
const expandedId = ref<string | null>(null)
const toggleStage = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const fundingOpen = ref(false)

if (mainStages.value[0]) {
  expandedId.value = mainStages.value[0].id
}

// ---------------- 链路节点 Demo 弹窗 ----------------
const demoOpen = ref(false)
const demoNodeId = ref<string | null>(null)
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const demoEntry = computed(() => (demoNodeId.value ? NODE_DEMOS[demoNodeId.value] : null))

const showToast = (msg: string) => {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2800)
}

const openDemo = (nodeId: string) => {
  const entry = NODE_DEMOS[nodeId]
  if (!entry?.ready) {
    showToast('该环节演示正在开发中，敬请期待')
    return
  }
  demoNodeId.value = nodeId
  demoOpen.value = true
}

const closeDemo = () => {
  demoOpen.value = false
  demoNodeId.value = null
}

// Demo 完成后流转到下一节点；终点则提示全链路完成
const handleHandoff = () => {
  const nodeId = demoNodeId.value
  const isStudio = !!nodeId && nodeId in CONTENT_STUDIO_VIEW_BY_NODE
  const isBid = !!nodeId && nodeId in BID_STEP_BY_NODE
  const isEnv = !!nodeId && nodeId in ENV_VIEW_BY_NODE
  const isTrade = !!nodeId && nodeId in TRADE_VIEW_BY_NODE
  const isEcom = !!nodeId && nodeId in ECOM_VIEW_BY_NODE
  const isIp = !!nodeId && nodeId in IP_VIEW_BY_NODE
  const isLegal = !!nodeId && nodeId in LEGAL_VIEW_BY_NODE
  const nextId = nodeId ? NEXT_NODE_BY_ID[nodeId] : null
  demoOpen.value = false
  demoNodeId.value = null
  if (nextId) {
    expandedId.value = nextId
    showToast('已提交至下一环节，该环节演示已就绪')
    nextTick(() => {
      document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  } else {
    showToast(
      isStudio
        ? '内容增长链路 10 环节演示已全部完成'
        : isBid
          ? '投标链路 10 环节演示已全部完成'
          : isEnv
            ? '环保业务模块演示已完成，可继续体验其他模块'
            : isTrade
              ? '商贸情报链路演示已全部完成'
              : isEcom
                ? '跨境电商选品链路演示已全部完成'
                : isIp
                  ? '知识产权链路演示已全部完成'
                  : isLegal
                    ? '企业法务链路演示已全部完成'
                    : '科研链路 10 环节演示已全部完成',
    )
  }
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <!-- Page header offset -->
    <div class="pt-20" />

    <main>
      <template v-if="solution">
        <!-- ============ Hero ============ -->
        <section class="relative py-16 sm:py-20 overflow-hidden bg-white border-b border-slate-200/80">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none" :class="theme.heroGlow" />
          <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <!-- Back link -->
            <button
              @click="router.push('/solutions')"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              返回解决方案中心
            </button>

            <div class="text-center max-w-5xl mx-auto space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm" :class="theme.badge">
                <GraduationCap class="w-3.5 h-3.5" :class="theme.badgeIcon" />
                {{ solution.tag }} · 第一期上线
                <span class="text-slate-300">|</span>
                <span>Nova AIGateway V2.5</span>
              </div>

              <h1 class="text-2xl md:text-3xl lg:text-4xl xl:text-[2.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.2] md:whitespace-nowrap">
                {{ heroTitlePrefix }}
                <span :class="theme.heroGradientText">{{ heroTitleGradient }}</span>
              </h1>

              <p class="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {{ solution.description }}
              </p>

              <!-- Highlight bar -->
              <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <span
                  v-for="h in solution.highlight"
                  :key="h"
                  class="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" :class="theme.badgeIcon" />
                  {{ h }}
                </span>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                <button
                  @click="handleOpenConsole"
                  class="w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  :class="theme.btnPrimary"
                >
                  <Terminal class="w-4 h-4" />
                  立即接入使用
                </button>
                <router-link
                  to="/models"
                  class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:shadow font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles class="w-4 h-4" :class="theme.badgeIcon" />
                  浏览模型广场
                </router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ 一句话价值主张 ============ -->
        <section class="py-14 bg-slate-50/80 border-b border-slate-200/80">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative p-8 sm:p-10 rounded-3xl text-white overflow-hidden" :class="theme.valueCard">
              <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <Quote class="absolute bottom-4 left-6 w-16 h-16 text-white/10 pointer-events-none" />
              <div class="relative z-10 space-y-4 text-center">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  {{ valueTitlePrefix }}
                  <br class="hidden sm:inline" />
                  {{ valueTitleSuffix }}
                </h2>
                <p class="text-blue-100 text-sm sm:text-base">
                  {{ valueSubtitle }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ 核心能力 ============ -->
        <section class="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
          <div class="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center max-w-3xl mx-auto mb-14 space-y-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" :class="theme.badge">
                <Layers class="w-3.5 h-3.5" :class="theme.badgeIcon" />
                核心能力 · Core Capabilities
              </div>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
                {{ capabilitiesTitlePrefix }}<span class="bg-gradient-to-r" :class="theme.sectionGradientText">{{ capabilitiesTitleGradient }}</span>
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="cap in solution.capabilities"
                :key="cap.title"
                class="group p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
                :class="theme.cardHoverBorder"
              >
                <div
                  class="w-11 h-11 rounded-xl p-2.5 flex items-center justify-center transition-all shadow-sm mb-5"
                  :class="[theme.iconBox, theme.iconBoxActive]"
                >
                  <component :is="iconMap[cap.icon] || Layers" class="w-6 h-6" />
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-2 transition-colors" :class="theme.cardTitleHover">{{ cap.title }}</h3>
                <p class="text-xs text-slate-600 leading-relaxed">{{ cap.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ 科研全流程（Agent 协作链路） ============ -->
        <section class="py-20 bg-slate-50/60 border-b border-slate-200/80 relative overflow-hidden">
          <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div class="mx-auto px-4 sm:px-6 lg:px-8 relative z-10" :class="isEnvAgent ? 'max-w-7xl' : 'max-w-5xl'">
            <!-- Section Header -->
            <div class="text-center mx-auto mb-16 space-y-4" :class="isEnvAgent ? 'max-w-4xl' : 'max-w-3xl'">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" :class="theme.badge">
                <Workflow class="w-3.5 h-3.5" :class="theme.badgeIcon" />
                {{ pipelineBadge }}
              </div>
              <h2
                class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                :class="isEnvAgent ? 'lg:whitespace-nowrap' : ''"
              >
                {{ pipelineTitlePrefix }}<span class="bg-gradient-to-r" :class="theme.sectionGradientText">{{ pipelineTitleGradient }}</span>
              </h2>
              <p class="text-slate-600 text-sm sm:text-base">{{ pipelineDesc }}</p>
            </div>

            <!-- 环保业务模块矩阵（8 模块平铺；环保方案不使用通用链路渲染） -->
            <EnvModuleGrid
              v-if="isEnvAgent"
              :stages="mainStages"
              :demo-btn-class="theme.demoBtn"
              @demo="openDemo"
            />

            <!-- 链路（通用科研全流程；环保方案 v-else 不渲染） -->
            <div v-else class="relative">
              <!-- 主线 -->
              <div class="absolute left-[22px] lg:left-[27px] top-12 bottom-12 w-px bg-gradient-to-b" :class="theme.sectionLine" />

              <!-- 起点 -->
              <div v-if="startNode" :id="startNode.id" class="relative pl-14 lg:pl-16 mb-8 scroll-mt-24">
                <div class="absolute left-0 top-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shadow-sm" :class="theme.startDot">
                  <component :is="iconMap[startNode.icon] || Workflow" class="w-5 h-5" />
                </div>
                <div class="rounded-2xl px-5 py-4 flex items-center justify-between gap-3 bg-gradient-to-r border" :class="theme.startCard">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" :class="theme.solidBadge">起点</span>
                    <h3 class="text-base font-extrabold text-slate-900 truncate">{{ startNode.title }}</h3>
                  </div>
                  <button
                    @click="openDemo(startNode.id)"
                    class="inline-flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    :class="NODE_DEMOS[startNode.id]?.ready
                      ? theme.demoBtn
                      : 'bg-white text-slate-400 border border-dashed border-slate-300'"
                  >
                    <Play v-if="NODE_DEMOS[startNode.id]?.ready" class="w-3 h-3 fill-current" />
                    {{ NODE_DEMOS[startNode.id]?.label ?? '演示' }}
                  </button>
                </div>
              </div>

              <!-- 主节点 -->
              <div v-for="(stage, idx) in mainStages" :key="stage.id" :id="stage.id" class="relative pl-14 lg:pl-16 scroll-mt-24">
                <!-- 节点圆点 -->
                <div
                  class="absolute left-0 top-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border shadow-sm transition-colors"
                  :class="expandedId === stage.id
                    ? [theme.nodeDotActive, 'text-white border-transparent']
                    : theme.nodeDotIdle"
                >
                  <component :is="iconMap[stage.icon] || Workflow" class="w-5 h-5" />
                </div>

                <!-- 卡片 -->
                <div
                  class="mb-6 rounded-2xl bg-white border transition-all duration-300 overflow-hidden"
                  :class="expandedId === stage.id ? theme.nodeCardActive : theme.nodeCardIdle"
                >
                  <!-- Header -->
                  <div
                    @click="toggleStage(stage.id)"
                    @keydown.enter="toggleStage(stage.id)"
                    role="button"
                    tabindex="0"
                    class="w-full flex items-center gap-4 p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap mb-1">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border" :class="theme.roleChip">{{ stage.role }}</span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">第 {{ idx + 1 }} 步</span>
                      </div>
                      <h3 class="text-base sm:text-lg font-bold text-slate-900">{{ stage.title }}</h3>
                      <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ stage.description }}</p>
                    </div>
                    <button
                      @click.stop="openDemo(stage.id)"
                      class="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      :class="NODE_DEMOS[stage.id]?.ready
                        ? theme.demoBtn
                        : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300 hover:border-slate-400'"
                    >
                      <Play v-if="NODE_DEMOS[stage.id]?.ready" class="w-3 h-3 fill-current" />
                      {{ NODE_DEMOS[stage.id]?.label ?? '演示' }}
                    </button>
                    <ChevronDown
                      class="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200"
                      :class="expandedId === stage.id ? ['rotate-180', theme.chevronActive] : ''"
                    />
                  </div>

                  <!-- Body -->
                  <div v-if="expandedId === stage.id" class="border-t border-slate-100 px-5 sm:px-6 py-6 animate-in fade-in duration-200">
                    <!-- 并行分支 -->
                    <div v-if="stage.branch?.length" class="mb-6">
                      <div class="flex items-center gap-2 mb-4">
                        <div class="flex-1 h-px bg-slate-200" />
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">并行编排</span>
                        <div class="flex-1 h-px bg-slate-200" />
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          v-for="b in stage.branch"
                          :key="b.id"
                          :id="b.id"
                          class="rounded-xl border transition-all duration-300 overflow-hidden scroll-mt-24"
                          :class="expandedId === b.id ? theme.branchCardActive : theme.branchCardIdle"
                        >
                          <div
                            @click="toggleStage(b.id)"
                            @keydown.enter="toggleStage(b.id)"
                            role="button"
                            tabindex="0"
                            class="w-full p-4 cursor-pointer flex items-start gap-3"
                          >
                            <div class="w-9 h-9 rounded-lg p-2 flex items-center justify-center shrink-0 border" :class="theme.branchIconBox">
                              <component :is="iconMap[b.icon] || Workflow" class="w-4 h-4" />
                            </div>
                            <div class="flex-1 min-w-0">
                              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border" :class="theme.branchChip">{{ b.role }}</span>
                              <h4 class="text-sm font-bold text-slate-900 mt-1.5">{{ b.title }}</h4>
                              <p class="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{{ b.description }}</p>
                            </div>
                            <button
                              @click.stop="openDemo(b.id)"
                              class="inline-flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                              :class="NODE_DEMOS[b.id]?.ready
                                ? theme.branchBtn
                                : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300'"
                            >
                              <Play v-if="NODE_DEMOS[b.id]?.ready" class="w-3 h-3 fill-current" />
                              {{ NODE_DEMOS[b.id]?.label ?? '演示' }}
                            </button>
                            <ChevronDown
                              class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
                              :class="expandedId === b.id ? ['rotate-180', theme.chevronActive] : ''"
                            />
                          </div>
                          <div v-if="expandedId === b.id" class="border-t border-slate-100 px-4 py-4 animate-in fade-in duration-200">
                            <StageDetails :stage="b" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 常规详情 -->
                    <StageDetails :stage="stage" />
                  </div>
                </div>
              </div>

              <!-- 终点 -->
              <div v-if="endNode" :id="endNode.id" class="relative pl-14 lg:pl-16 scroll-mt-24">
                <div class="absolute left-0 top-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white" :class="theme.nodeDotActive">
                  <component :is="iconMap[endNode.icon] || Workflow" class="w-5 h-5" />
                </div>
                <div class="rounded-2xl text-white px-5 py-5 flex items-center justify-between gap-3" :class="theme.endCard">
                  <div class="flex items-center gap-3 min-w-0">
                    <Award class="w-5 h-5 text-yellow-300 shrink-0" />
                    <div class="flex items-center gap-3 flex-wrap">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 border border-white/25">终点</span>
                      <span class="text-base font-extrabold">{{ endNode.title }}</span>
                    </div>
                  </div>
                  <button
                    @click="openDemo(endNode.id)"
                    class="inline-flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    {{ NODE_DEMOS[endNode.id]?.label ?? '即将上线' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 全程管控（经费） -->
            <div v-if="solution.funding" class="mt-14">
              <div class="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <button @click="fundingOpen = !fundingOpen" class="w-full flex items-center gap-4 p-5 sm:p-6 text-left">
                  <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 p-2.5 flex items-center justify-center text-amber-600 shrink-0">
                    <Wallet class="w-5 h-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">全程管控</span>
                    </div>
                    <h3 class="text-base sm:text-lg font-bold text-slate-900">{{ solution.funding.title }}</h3>
                    <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ solution.funding.description }}</p>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <span
                        v-for="p in solution.funding.points"
                        :key="p"
                        class="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        {{ p }}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    class="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200"
                    :class="fundingOpen ? 'rotate-180 text-amber-600' : ''"
                  />
                </button>

                <div v-if="fundingOpen" class="border-t border-slate-100 px-5 sm:px-6 py-6 animate-in fade-in duration-200">
                  <div class="mb-6">
                    <h4 class="flex items-center gap-1.5 text-xs font-bold mb-3" :class="theme.fundingIcon">
                      <Workflow class="w-3.5 h-3.5" />
                      管控流程
                    </h4>
                    <div class="flex flex-wrap items-center gap-2">
                      <template v-for="(step, i) in solution.funding.flow" :key="i">
                        <span class="text-[11px] font-semibold px-3 py-1.5 rounded-lg border" :class="theme.fundingChip">{{ step }}</span>
                        <ArrowRight v-if="i < solution.funding.flow.length - 1" class="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      </template>
                    </div>
                  </div>
                  <div>
                    <h4 class="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-3">
                      <BarChart3 class="w-3.5 h-3.5" />
                      管控效果
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        v-for="(r, i) in solution.funding.result"
                        :key="i"
                        class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
                      >
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{{ r.label }}</div>
                        <div class="text-sm font-semibold text-slate-800 leading-snug">{{ r.value }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ CTA ============ -->
        <section class="py-20 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative rounded-3xl text-white p-8 sm:p-14 overflow-hidden" :class="theme.ctaCard">
              <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div class="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

              <div class="relative z-10 max-w-3xl space-y-6">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
                  <GraduationCap class="w-3.5 h-3.5 text-yellow-300" />
                  {{ ctaTag }}
                </div>
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {{ ctaTitlePrefix }}
                  <br />
                  {{ ctaTitleGradient }}
                </h2>
                <p class="text-blue-100 text-base max-w-2xl leading-relaxed">
                  {{ ctaSubtitle }}
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    @click="handleOpenConsole"
                    class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 group"
                    :class="theme.ctaBtnText"
                  >
                    <Terminal class="w-4 h-4" :class="theme.ctaBtnText" />
                    立即接入使用
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" :class="theme.ctaBtnText" />
                  </button>
                  <router-link
                    to="/solutions"
                    class="w-full sm:w-auto px-7 py-3.5 rounded-xl text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center"
                    :class="theme.ctaBtnSecondary"
                  >
                    查看其他解决方案
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>

      <!-- 404 fallback -->
      <template v-else>
        <section class="py-32 text-center">
          <div class="max-w-lg mx-auto px-4 space-y-4">
            <GraduationCap class="w-12 h-12 text-slate-300 mx-auto" />
            <h1 class="text-2xl font-extrabold text-slate-900">解决方案不存在</h1>
            <p class="text-sm text-slate-500">你访问的解决方案页面不存在或已下线。</p>
            <router-link
              to="/solutions"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              返回解决方案中心
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </section>
      </template>
    </main>

    <FooterSection />
    <ContactFloat />

    <!-- 链路节点 Demo 弹窗 -->
    <NodeDemoModal
      :open="demoOpen"
      :title="demoEntry?.title ?? ''"
      :subtitle="demoEntry?.subtitle ?? ''"
      :icon="Lightbulb"
      :wide="demoNodeId === 'research-agent' || demoNodeId === 'coding-agent' || demoNodeId === 'experiment-reproduction' || demoNodeId === 'data-agent' || demoNodeId === 'experiment-result' || demoNodeId === 'paper-reviewer' || demoNodeId === 'final-paper' || isContentStudio || isBidConsultant || isEnvMatrix || isTradeIntel || isEcomIntel || isIpIntel || isLegal"
      @close="closeDemo"
    >
      <QuestionOriginDemo v-if="demoNodeId === 'research-question'" @handoff="handleHandoff" />
      <ResearchAgentDemo v-else-if="demoNodeId === 'research-agent'" @handoff="handleHandoff" />
      <LiteratureAgentDemo v-else-if="demoNodeId === 'literature-agent'" @handoff="handleHandoff" />
      <ResearchInsightDemo v-else-if="demoNodeId === 'research-insight'" @handoff="handleHandoff" />
      <Paper2CodeDemo v-else-if="demoNodeId === 'coding-agent'" initial-stage="code" @handoff="handleHandoff" />
      <Paper2CodeDemo v-else-if="demoNodeId === 'experiment-reproduction'" initial-stage="execute" @handoff="handleHandoff" />
      <DataAgentDemo v-else-if="demoNodeId === 'data-agent'" @handoff="handleHandoff" />
      <DataAgentDemo v-else-if="demoNodeId === 'experiment-result'" auto-scroll-to-report @handoff="handleHandoff" />
      <PaperReviewerDemo v-else-if="demoNodeId === 'paper-reviewer'" @handoff="handleHandoff" />
      <PaperReviewerDemo v-else-if="demoNodeId === 'final-paper'" initial-view="paper" @handoff="handleHandoff" />
      <ContentStudioDemo v-else-if="isContentStudio" :initial-view="studioInitialView" @handoff="handleHandoff" />
      <BidConsultantDemo v-else-if="isBidConsultant" :initial-step="bidInitialStep" @handoff="handleHandoff" />
      <EnvEmployeeMatrixDemo v-else-if="isEnvMatrix" :initial-employee="envInitialEmployee" @handoff="handleHandoff" />
      <TradeIntelDemo v-else-if="isTradeIntel" :initial-view="tradeInitialView" @handoff="handleHandoff" />
      <EcomSelectionDemo v-else-if="isEcomIntel" :initial-view="ecomInitialView" @handoff="handleHandoff" />
      <IpCounselDemo v-else-if="isIpIntel" :initial-view="ipInitialView" @handoff="handleHandoff" />
      <LegalEmployeeDemo
        v-else-if="isLegal"
        :initial-view="legalInitialView"
        :initial-review="legalReviewDeepLink"
        @handoff="handleHandoff"
      />
    </NodeDemoModal>

    <!-- 轻提示 -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold shadow-2xl flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles class="w-4 h-4 text-blue-400 shrink-0" />
          {{ toast }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
