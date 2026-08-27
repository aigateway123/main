<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import {
  Brain,
  Activity,
  Sparkles,
  Compass,
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Circle,
  Loader2,
  Cpu,
  BookOpen,
  LineChart,
  Code2,
  ShieldCheck,
  Network,
  GitCommit,
  Terminal,
  ChevronRight,
  Zap,
  Map as MapIcon,
  Layers,
  AlertCircle,
  ArrowRight,
  Star,
  Flame,
  Database,
  Target,
  FileText,
  Download,
  Copy,
  Check,
  Calendar,
  Users,
  X,
  FileCode,
  GitBranch,
  Quote,
} from 'lucide-vue-next'
import {
  INITIAL_AGENTS,
  INITIAL_MESSAGES,
  PRESET_TOPICS,
  EV_CHARGING_DATA,
  buildResearchAgentData,
  buildResearchDataForTopic,
  type AgentRole,
  type AgentInfo,
  type InterAgentMessage,
  type ResearchAnalysisData,
  type ResearchOpportunity,
  type ResearchReport,
  type LiteratureItem,
} from '@/data/researchAgentData'

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ------------------------------------------------------------------ 常量与图标
const TOPIC_IDS = ['ev-charging', 'medical-hallucination', 'molecule-gnn', 'solid-state-battery']

const AGENT_ICON: Record<AgentRole, any> = {
  orchestrator: Cpu,
  literature: BookOpen,
  analysis: LineChart,
  coding: Code2,
  reviewer: ShieldCheck,
}

type ActionModalType = 'experiment' | 'literature' | 'coding' | 'plan' | null

// ------------------------------------------------------------------ 状态
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

const topic = ref<string>(EV_CHARGING_DATA.topic)
const researchData = ref<ResearchAnalysisData>(clone(EV_CHARGING_DATA))
const agents = ref<Record<AgentRole, AgentInfo>>(clone(INITIAL_AGENTS))
const activeMessages = ref<InterAgentMessage[]>(clone(INITIAL_MESSAGES))
const isRunning = ref(false)
const currentStepIndex = ref(6) // 0-6，6 表示全部完成

const inspectingAgent = ref<AgentInfo | null>(null)
const activeModal = ref<ActionModalType>(null)

// 输入区
const PIPELINE_STEPS = [
  { id: 'breakdown', label: '问题拆解', desc: '科学问题降维与变量抽取' },
  { id: 'literature', label: '文献研究', desc: 'ArXiv/IEEE 140+ 篇文献研读' },
  { id: 'hotspots', label: '研究热点分析', desc: '前沿聚类与演化图谱' },
  { id: 'gaps', label: '研究空白识别', desc: '现有方法三大局限性诊断' },
  { id: 'experiments', label: '实验方案设计', desc: '5基准模型与消融方案' },
  { id: 'feasibility', label: '可行性评估', desc: '审稿人视角把关与风险预警' },
  { id: 'report', label: '研究报告', desc: '自动生成 9 大章节学术白皮书' },
]

// ------------------------------------------------------------------ 定时器管理
const timers = new Set<ReturnType<typeof setTimeout>>()
const later = (ms: number, fn: () => void) => {
  const t = setTimeout(() => {
    timers.delete(t)
    fn()
  }, ms)
  timers.add(t)
}
onBeforeUnmount(() => timers.forEach(clearTimeout))

// ------------------------------------------------------------------ 数据解析
const resolveData = (t: string): ResearchAnalysisData => {
  const trimmed = t.trim()
  if (trimmed === PRESET_TOPICS[0]) return clone(EV_CHARGING_DATA)
  const idx = PRESET_TOPICS.findIndex((p) => p === trimmed)
  if (idx > 0) {
    return buildResearchAgentData({ topicId: TOPIC_IDS[idx], topic: trimmed, isGeneric: false })
  }
  return buildResearchDataForTopic(trimmed)
}

// ------------------------------------------------------------------ 编排动画
const startResearch = (customTopic?: string) => {
  const target = (customTopic ?? topic.value).trim()
  if (!target || isRunning.value) return

  isRunning.value = true
  currentStepIndex.value = 0
  researchData.value = resolveData(target)

  // 重置 Agent 为运行序列
  const resetAgents: Record<AgentRole, AgentInfo> = clone(INITIAL_AGENTS)
  resetAgents.orchestrator = { ...resetAgents.orchestrator, status: 'running', progress: 15, currentTask: `正在对科研问题【${target}】进行形式化拆解与任务调度...` }
  resetAgents.literature = { ...resetAgents.literature, status: 'running', progress: 10, currentTask: '正在检索 ArXiv / IEEE Xplore / Nature 期刊知识库...' }
  resetAgents.analysis = { ...resetAgents.analysis, status: 'waiting', progress: 0, currentTask: '等待 Literature Agent 交付文献特征包...' }
  resetAgents.coding = { ...resetAgents.coding, status: 'waiting', progress: 0, currentTask: '等待核心科学问题与空白定义...' }
  resetAgents.reviewer = { ...resetAgents.reviewer, status: 'waiting', progress: 0, currentTask: '等待实验方案与理论推导提交预审...' }
  agents.value = resetAgents

  activeMessages.value = [
    {
      id: `msg-${Date.now()}-1`,
      from: 'orchestrator',
      to: 'literature',
      content: `任务启动：对科研问题「${target}」展开多源知识挖掘。`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    },
  ]

  const pushMsg = (from: AgentRole, to: AgentRole, content: string, artifactType?: InterAgentMessage['artifactType']) => {
    activeMessages.value = [
      ...activeMessages.value,
      { id: `msg-${Date.now()}-${Math.random()}`, from, to, content, timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }), artifactType },
    ]
  }

  // Step 1: Literature 完成 → Analysis 开始
  later(1000, () => {
    currentStepIndex.value = 1
    agents.value = {
      ...agents.value,
      literature: { ...agents.value.literature, status: 'completed', progress: 100, currentTask: '文献知识库检索完毕，构建 140+ 篇文献关联图谱' },
      analysis: { ...agents.value.analysis, status: 'running', progress: 40, currentTask: '正在计算前沿演化聚类与三大 Research Gaps...' },
    }
    pushMsg('literature', 'analysis', '文献知识抽取完成，已向 Analysis Agent 发送文献聚类张量。', 'literature_packet')
  })

  // Step 2: Analysis 完成 → Coding 开始
  later(2000, () => {
    currentStepIndex.value = 3
    agents.value = {
      ...agents.value,
      analysis: { ...agents.value.analysis, status: 'completed', progress: 100, currentTask: '已识别三大创新空白，输出 3 项高价值研究机会矩阵' },
      coding: { ...agents.value.coding, status: 'running', progress: 50, currentTask: '正在构建 5 大 Baseline 与核心创新网络 PyTorch 架构...' },
    }
    pushMsg('analysis', 'coding', '已确定突破方向：要求构建融合物理先验与时空图的神经网络。', 'gap_matrix')
  })

  // Step 3: Coding 完成 → Reviewer 开始
  later(3000, () => {
    currentStepIndex.value = 4
    agents.value = {
      ...agents.value,
      coding: { ...agents.value.coding, status: 'completed', progress: 100, currentTask: '完成核心模型架构编写、损失函数与消融实验矩阵' },
      reviewer: { ...agents.value.reviewer, status: 'running', progress: 75, currentTask: '正在以顶刊同行评审标准审查技术方案与可行性风险...' },
    }
    pushMsg('coding', 'reviewer', '已提交 PyTorch 代码模型与消融实验对照组，请求可行性审查。', 'baseline_code')
  })

  // Step 4: Reviewer & Orchestrator 完成，数据落地
  later(4000, () => {
    currentStepIndex.value = 6
    agents.value = {
      ...agents.value,
      reviewer: { ...agents.value.reviewer, status: 'completed', progress: 100, currentTask: '评审通过 (96分)，生成可行性风控方案与 12 周科研排期' },
      orchestrator: { ...agents.value.orchestrator, status: 'completed', progress: 100, currentTask: '全链条闭环完成，9 大章节学术白皮书已生成' },
    }
    pushMsg('reviewer', 'orchestrator', '可行性审查评级 96 分，完成 12 周科研排期，交付最终发布。', 'review_score')
    isRunning.value = false
  })
}

// ------------------------------------------------------------------ 工具函数
const openAgentLogs = (id: AgentRole) => {
  inspectingAgent.value = agents.value[id] ?? null
}
const exploreAction = (type: Exclude<ActionModalType, null>) => {
  activeModal.value = type
}

const agentStatusBadge = (status: AgentInfo['status']) => {
  if (status === 'completed') {
    return { cls: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: false, text: '已完成' }
  }
  if (status === 'running') {
    return { cls: 'text-amber-700 bg-amber-50 border-amber-200', dot: true, text: '正在分析' }
  }
  return { cls: 'text-slate-500 bg-slate-100 border-slate-200', dot: false, text: '等待中' }
}

const renderStars = (score: number, max = 5) => Array.from({ length: max })

const isCenterAgent = (a: AgentInfo) => a.id === 'orchestrator'
const topologyRows = computed(() => [
  { isCenterRow: false, list: [agents.value.literature] },
  { isCenterRow: true, list: [agents.value.analysis, agents.value.orchestrator, agents.value.coding] },
  { isCenterRow: false, list: [agents.value.reviewer] },
])
const pipelineAgentList = computed(() => [agents.value.literature, agents.value.analysis, agents.value.coding, agents.value.reviewer])

// 科研图谱静态区块数据（与参考 demo ResearchMap.tsx 保持一致，聚焦 EV 充电默认主题）
const mapClusters = [
  {
    category: '时空关联建模 (Spatio-Temporal)',
    nodes: [
      { name: 'ST-GCN', type: '成熟基准', status: 'high' },
      { name: 'Graph WaveNet', type: '主流架构', status: 'high' },
      { name: '自适应可学习拓扑', type: '前沿热点', status: 'frontier' },
      { name: '跨城市图元学习', type: '新兴空白', status: 'gap' },
    ],
  },
  {
    category: '多源协变量耦合 (Multi-Covariates)',
    nodes: [
      { name: '历史负荷时序', type: '基础特征', status: 'high' },
      { name: 'ERA5 微气象网格', type: '关键物理量', status: 'frontier' },
      { name: '实时 LMP 分时电价', type: '因果博弈量', status: 'frontier' },
      { name: '极端天气降额方程', type: '物理先验空白', status: 'gap' },
    ],
  },
  {
    category: '决策与因果推断 (Causal & Decision)',
    nodes: [
      { name: '单向时间回归', type: '传统方法', status: 'high' },
      { name: '多智能体博弈 (MARL)', type: '前沿探索', status: 'frontier' },
      { name: '工具变量因果解耦', type: '前沿热点', status: 'frontier' },
      { name: '反事实涌浪负荷抑制', type: '理论制高点', status: 'gap' },
    ],
  },
]

const mapGaps = [
  {
    color: 'text-rose-400',
    title: 'GAP 01: 极端天气物理降额机制断裂',
    desc: '主流深度模型忽略了动力电池在 -15℃ 以下发生锂电极化阻抗剧增的 BMS 主动限功率行为，纯数据回归在极端寒潮发生时存在超过 35% 的虚高预测偏差。',
    solution: '引入 Arrhenius 电化学机理正则化算子',
  },
  {
    color: 'text-amber-400',
    title: 'GAP 02: 电价价格弹性的反向因果盲区',
    desc: '分时电价在传统文献中被作为外生独立变量输入，导致模型无法预测当降价广播发布后车主集体涌入同一场站引发的“二次反弹峰值”。',
    solution: '基于工具变量的双层博弈因果解耦网络',
  },
  {
    color: 'text-indigo-400',
    title: 'GAP 03: 新建场站与中小城市冷启动迁移瓶颈',
    desc: '高精度 ST-GNN 严重依赖长达数月的密集历史时序，对于新建区域或三四线试点城市存在严重的跨城市域偏移 (Domain Shift)。',
    solution: '图对比元学习 + 空间拓扑原型对齐',
  },
]

const variableFlowInputs = [
  '历史 15min 功率时序',
  'ERA5 气温/降雨/湿度',
  '实时 LMP 分时电价',
  '道路通达性拓扑图',
]
const variableFlowCore = ['自适应时空图扩散', '物理机理损失正则', '因果电价弹性门控', '时序双向自注意力']
const variableFlowOutputs = [
  '未来 1~12h 点预测功率',
  '95% 置信区间概率包络',
  '极端长尾尖峰预警',
  '价格敏感度弹性系数',
]

// 报告导出
const buildMarkdown = (report: ResearchReport) => {
  let md = `# ${report.title}\n\n${report.subtitle}\n\n**生成日期**: ${report.generatedDate}\n**报告作者**: ${report.authors.join(', ')}\n\n## 摘要\n${report.abstract}\n\n`
  report.sections.forEach((s) => {
    md += `## ${s.number}. ${s.title} (${s.enTitle})\n\n> ${s.summary}\n\n${s.content}\n\n`
    if (s.highlights) {
      md += `**核心要点**:\n` + s.highlights.map((h) => `- ${h}`).join('\n') + '\n\n'
    }
  })
  md += `## 参考文献 (References)\n\n`
  report.references.forEach((r) => {
    md += `[${r.id}] ${r.authors}. "${r.title}". *${r.venue}*, ${r.year}.\n`
  })
  return md
}

const reportCopied = ref(false)
const handleCopyMarkdown = async () => {
  await navigator.clipboard.writeText(buildMarkdown(researchData.value.report))
  reportCopied.value = true
  setTimeout(() => (reportCopied.value = false), 2000)
}

const handleDownloadMarkdown = () => {
  const md = buildMarkdown(researchData.value.report)
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${researchData.value.report.title.replace(/[《》]/g, '')}_研究报告.md`
  a.click()
  URL.revokeObjectURL(url)
}

const copyText = async (text: string, done: () => void) => {
  await navigator.clipboard.writeText(text)
  done()
}

// 4 个子弹窗（复现参考 demo InteractiveActionModal 交互）
const activeCodeFileIndex = ref(0)
const codeCopied = ref(false)
const bibtexCopiedId = ref<string | null>(null)
const simulatedRunning = ref(false)
const consoleOutput = ref<string[]>([])

const handleCopyBibtex = (lit: LiteratureItem) => {
  copyText(lit.bibtex, () => {
    bibtexCopiedId.value = lit.id
    setTimeout(() => (bibtexCopiedId.value = null), 2000)
  })
}

const handleCopyCode = () => {
  const file = researchData.value.codingDetail.files[activeCodeFileIndex.value]
  if (!file) return
  copyText(file.code, () => {
    codeCopied.value = true
    setTimeout(() => (codeCopied.value = false), 2000)
  })
}

// 报告章节导航
const activeSectionNum = ref(1)
const activeSection = computed(() => researchData.value.report.sections.find((s) => s.number === activeSectionNum.value) || researchData.value.report.sections[0])

// 机会矩阵选中
const selectedOppId = ref<string>(researchData.value.opportunities[0]?.id ?? 'opp-01')
const selectedOpp = computed<ResearchOpportunity>(() => researchData.value.opportunities.find((o) => o.id === selectedOppId.value) || researchData.value.opportunities[0])

// 科研图谱 Tabs
const mapTab = ref<'topology' | 'gap_matrix' | 'variable_flow'>('topology')

// 工作流视图切换
const viewMode = ref<'topology' | 'pipeline'>('topology')

// 推荐方案 Baseline Tab
const activeBaselineTab = ref<string>(researchData.value.recommendedScheme.baselineModels[0]?.name ?? 'LSTM')
const activeBaseline = computed(
  () =>
    researchData.value.recommendedScheme.baselineModels.find((b) => b.name === activeBaselineTab.value) ||
    researchData.value.recommendedScheme.baselineModels[0],
)

const handleRunCodeSimulation = () => {
  simulatedRunning.value = true
  consoleOutput.value = ['[Nova PyTorch Engine] 初始化 PyTorch Geometric 与 CUDA 设备...']
  later(600, () => {
    consoleOutput.value = [...consoleOutput.value, '[DataLoader] 加载城市 120,000 桩时空张量与 ERA5 气象网格: 15-min 窗口切分完成 (Batch=64).']
  })
  later(1200, () => {
    consoleOutput.value = [...consoleOutput.value, '[Epoch 01/50] Train Loss: 0.0842 | Val MAE: 4.82 kW | Arrhenius Physics Penalty: 0.0124']
  })
  later(2000, () => {
    consoleOutput.value = [
      ...consoleOutput.value,
      '[Epoch 15/50] 动态图自适应收敛 | Peak Error: 5.12% | 相对 LSTM 基线提升 26.4%',
      '>>> 训练收敛完成！Checkpoints 已存入 ./checkpoints/weather_causal_stgnn_best.pt',
    ]
    simulatedRunning.value = false
  })
}

const modalMeta = computed(() => {
  switch (activeModal.value) {
    case 'experiment':
      return { title: '深度实验设计方案 (Experimental Design & Ablations)', subtitle: '包含多源数据预处理管线、消融对照实验矩阵与超参数配置网格', icon: Target }
    case 'literature':
      return { title: '前沿文献研读看板 (Literature SOTA Matrix)', subtitle: 'ArXiv/IEEE 140+ 篇精选论文聚类、引用网络与 BibTeX 导出', icon: BookOpen }
    case 'coding':
      return { title: 'Coding 实验工作台 (PyTorch Experiment Workbench)', subtitle: '端到端即用型核心模型实现、损失函数、训练管线与学术评估脚本', icon: Code2 }
    case 'plan':
      return { title: '科研排期规划与甘特图 (Research Milestones & Roadmap)', subtitle: '12 周标准博士级研究排期与阶段可交付成果 (Deliverables)', icon: Calendar }
    default:
      return { title: '', subtitle: '', icon: Target }
  }
})

const activeAgentsCount = computed(() => Object.values(agents.value).filter((a) => a.status === 'running').length)
</script>

<template>
  <div class="min-h-full bg-slate-100/60 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
    <!-- ============ Header Banner ============ -->
    <header class="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Brain class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-bold tracking-tight text-slate-900 text-base truncate">Nova AI Research Agent</span>
              <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 shrink-0">
                Flagship v3.7
              </span>
            </div>
            <p class="text-[11px] text-slate-500 hidden sm:block truncate">
              多智能体自主科研探索系统 · Multi-Agent Autonomous Academic Engine
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600">
            <Activity class="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
            <span>4-Agent 协同总线</span>
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span class="text-slate-400">|</span>
            <span class="font-mono text-slate-700 hidden lg:inline">IEEE / ArXiv 检索源已挂载</span>
          </div>
          <div
            class="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            :class="isRunning ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'"
          >
            <span class="h-2 w-2 rounded-full" :class="isRunning ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'" />
            <span>{{ isRunning ? `研究推进中 (${activeAgentsCount} Agents)` : '系统就绪' }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ============ 2. 输入区 + 7 步流水线 ============ -->
    <section class="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div class="relative mx-auto max-w-5xl text-center">
        <div class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md mb-4 shadow-inner">
          <Sparkles class="h-3.5 w-3.5 text-indigo-400" />
          <span>Nova 科研 AI 旗舰平台 · 突破传统科研探索边界</span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
          AI Research Agent
        </h1>
        <p class="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          从一个科研问题开始，AI 自动完成一轮研究
        </p>

        <form @submit.prevent="startResearch()" class="w-full max-w-3xl mx-auto mb-6">
          <div class="relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-slate-800/90 p-2 border border-slate-700 shadow-2xl shadow-slate-950/60 backdrop-blur-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
            <div class="flex-1 flex items-center px-4 py-2 sm:py-1">
              <Compass class="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
              <input
                v-model="topic"
                type="text"
                placeholder="请输入您的前沿科研探索问题..."
                :disabled="isRunning"
                class="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none disabled:opacity-60"
              />
            </div>
            <div class="flex items-center gap-2 mt-2 sm:mt-0 p-1">
              <button
                type="submit"
                :disabled="isRunning || !topic.trim()"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-600 hover:to-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <RotateCcw v-if="isRunning" class="h-4 w-4 animate-spin text-white" />
                <Play v-else class="h-4 w-4 fill-current text-white" />
                <span>{{ isRunning ? '智能体协同研究中...' : '开始研究' }}</span>
              </button>
            </div>
          </div>
        </form>

        <!-- 预置课题 -->
        <div class="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
          <span class="text-slate-400 flex items-center gap-1 font-medium">
            <Lightbulb class="h-3.5 w-3.5 text-amber-400" />
            推荐科研课题：
          </span>
          <button
            v-for="(preset, idx) in PRESET_TOPICS"
            :key="idx"
            type="button"
            :disabled="isRunning"
            @click="topic = preset; startResearch(preset)"
            class="rounded-lg border px-2.5 py-1 transition-colors text-left cursor-pointer disabled:opacity-50"
            :class="topic === preset
              ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
              : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800'"
          >
            {{ preset.length > 22 ? preset.slice(0, 22) + '...' : preset }}
          </button>
        </div>

        <!-- 7 步流水线 -->
        <div class="w-full max-w-4xl mx-auto rounded-2xl bg-slate-950/80 border border-slate-800 p-5 backdrop-blur-md shadow-lg">
          <div class="flex items-center justify-between mb-4 px-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              AI 将自动完成全链路科研闭环：
            </span>
            <span class="text-xs text-slate-400">
              {{ isRunning ? `正在执行步骤 [${Math.min(currentStepIndex + 1, 7)}/7]` : '7 阶段学术自动化流水线' }}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <div
              v-for="(step, idx) in PIPELINE_STEPS"
              :key="step.id"
              class="flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all"
              :class="idx < currentStepIndex
                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                : (idx === currentStepIndex && isRunning)
                ? 'border-indigo-400 bg-indigo-600/20 ring-1 ring-indigo-400 shadow-md shadow-indigo-500/10'
                : 'border-slate-800 bg-slate-900/50 text-slate-400'"
            >
              <div class="flex items-center justify-center mb-1">
                <CheckCircle2 v-if="idx < currentStepIndex" class="h-4 w-4 text-emerald-400" />
                <span v-else-if="idx === currentStepIndex && isRunning" class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span v-else class="text-[10px] font-mono text-slate-500">0{{ idx + 1 }}</span>
              </div>
              <span
                class="text-xs font-semibold"
                :class="idx === currentStepIndex && isRunning ? 'text-white' : idx < currentStepIndex ? 'text-emerald-300' : 'text-slate-300'"
              >
                {{ step.label }}
              </span>
              <span class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{{ step.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- ============ 3. Agent 工作流可视化 ============ -->
    <section class="w-full py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-200">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Agent 工作流可视化</h2>
            </div>
            <p class="text-sm text-slate-500 mt-1">
              以 Research Agent 为调度中枢，4 大专业智能体分布式并发与递进推演
            </p>
          </div>

          <div class="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs">
            <button
              type="button"
              @click="viewMode = 'topology'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              :class="viewMode === 'topology' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            >
              <Network class="h-3.5 w-3.5" />
              星型协同拓扑 (Topology)
            </button>
            <button
              type="button"
              @click="viewMode = 'pipeline'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              :class="viewMode === 'pipeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            >
              <GitCommit class="h-3.5 w-3.5" />
              递进流水线 (Pipeline)
            </button>
          </div>
        </div>

        <!-- View 1: Topology Star Layout -->
        <div
          v-if="viewMode === 'topology'"
          class="relative rounded-3xl bg-gradient-to-b from-white to-slate-100/80 border border-slate-200/90 p-6 sm:p-10 shadow-sm overflow-hidden min-h-[580px] flex flex-col justify-between"
        >
          <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />

          <template v-for="(row, rIdx) in topologyRows" :key="rIdx">
            <div v-if="!row.isCenterRow" class="w-full flex justify-center z-10">
              <div v-for="a in row.list" :key="a.id" class="w-full max-w-sm">
                <!-- Agent Card -->
                <div
                  class="group cursor-pointer rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-xl"
                  :class="a.status === 'running'
                    ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40 shadow-amber-500/10'
                    : a.status === 'completed'
                    ? 'bg-white/95 border-emerald-300/80 hover:border-emerald-500'
                    : 'bg-slate-50/80 border-slate-200/80 opacity-90 hover:opacity-100'"
                  @click="openAgentLogs(a.id)"
                >
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <div class="flex items-center gap-2.5">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                        :class="a.status === 'running'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                          : a.status === 'completed'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-200 text-slate-600'"
                      >
                        <component :is="AGENT_ICON[a.id]" class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 class="text-sm font-bold tracking-tight text-slate-900">{{ a.name }}</h3>
                        <p class="text-[11px] font-mono text-slate-500">{{ a.enName }}</p>
                      </div>
                    </div>
                    <span
                      v-if="a.status === 'completed'"
                      class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                    >
                      <CheckCircle2 class="h-3.5 w-3.5 text-emerald-500" />
                      已完成
                    </span>
                    <span
                      v-else-if="a.status === 'running'"
                      class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                    >
                      <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      正在分析
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      <Circle class="h-3 w-3 text-slate-400" />
                      等待中
                    </span>
                  </div>

                  <div class="mt-2.5 rounded-lg px-2.5 py-1.5 text-xs bg-black/5 border border-black/5">
                    <span class="font-medium block text-[11px] mb-0.5 text-slate-500">当前动作 / 职责：</span>
                    <span class="line-clamp-2 font-mono text-xs text-slate-800">{{ a.currentTask }}</span>
                  </div>

                  <div class="mt-3">
                    <div class="flex items-center justify-between text-[10px] mb-1 font-mono">
                      <span class="text-slate-500">任务进度</span>
                      <span class="font-semibold text-slate-800">{{ a.progress }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="a.status === 'running'
                          ? 'bg-amber-500 animate-pulse'
                          : a.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'"
                        :style="{ width: a.progress + '%' }"
                      />
                    </div>
                  </div>

                  <div class="mt-2.5 flex items-center justify-between text-[11px] pt-1">
                    <span class="text-slate-400">已产出 {{ a.completedTasks.length }} 项成果</span>
                    <span class="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                      日志 & 详情 <ChevronRight class="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center my-6 z-10">
              <div v-for="a in row.list" :key="a.id" :class="isCenterAgent(a) ? 'w-full lg:scale-105' : 'w-full'">
                <!-- Agent Card (Center) -->
                <div
                  class="group cursor-pointer rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-xl"
                  :class="isCenterAgent(a)
                    ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-500/50 ring-2 ring-indigo-500/30'
                    : a.status === 'running'
                    ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40 shadow-amber-500/10'
                    : a.status === 'completed'
                    ? 'bg-white/95 border-emerald-300/80 hover:border-emerald-500'
                    : 'bg-slate-50/80 border-slate-200/80 opacity-90 hover:opacity-100'"
                  @click="openAgentLogs(a.id)"
                >
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <div class="flex items-center gap-2.5">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                        :class="isCenterAgent(a)
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40'
                          : a.status === 'running'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                          : a.status === 'completed'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-200 text-slate-600'"
                      >
                        <component :is="AGENT_ICON[a.id]" class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 :class="['text-sm font-bold tracking-tight', isCenterAgent(a) ? 'text-white' : 'text-slate-900']">{{ a.name }}</h3>
                        <p :class="['text-[11px] font-mono', isCenterAgent(a) ? 'text-indigo-200' : 'text-slate-500']">{{ a.enName }}</p>
                      </div>
                    </div>
                    <span
                      v-if="a.status === 'completed'"
                      class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                    >
                      <CheckCircle2 class="h-3.5 w-3.5 text-emerald-500" />
                      已完成
                    </span>
                    <span
                      v-else-if="a.status === 'running'"
                      class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                    >
                      <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      正在分析
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      <Circle class="h-3 w-3 text-slate-400" />
                      等待中
                    </span>
                  </div>

                  <div class="mt-2.5 rounded-lg px-2.5 py-1.5 text-xs bg-black/5 border border-black/5">
                    <span :class="['font-medium block text-[11px] mb-0.5', isCenterAgent(a) ? 'text-indigo-300' : 'text-slate-500']">
                      当前动作 / 职责：
                    </span>
                    <span :class="['line-clamp-2 font-mono text-xs', isCenterAgent(a) ? 'text-slate-200' : 'text-slate-800']">
                      {{ a.currentTask }}
                    </span>
                  </div>

                  <div class="mt-3">
                    <div class="flex items-center justify-between text-[10px] mb-1 font-mono">
                      <span :class="isCenterAgent(a) ? 'text-indigo-200' : 'text-slate-500'">任务进度</span>
                      <span :class="['font-semibold', isCenterAgent(a) ? 'text-white' : 'text-slate-800']">{{ a.progress }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="isCenterAgent(a)
                          ? 'bg-indigo-400'
                          : a.status === 'running'
                          ? 'bg-amber-500 animate-pulse'
                          : a.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'"
                        :style="{ width: a.progress + '%' }"
                      />
                    </div>
                  </div>

                  <div class="mt-2.5 flex items-center justify-between text-[11px] pt-1">
                    <span :class="isCenterAgent(a) ? 'text-indigo-300' : 'text-slate-400'">
                      已产出 {{ a.completedTasks.length }} 项成果
                    </span>
                    <span
                      :class="[
                        'inline-flex items-center gap-0.5 text-xs font-semibold group-hover:translate-x-0.5 transition-transform',
                        isCenterAgent(a) ? 'text-indigo-300' : 'text-indigo-600',
                      ]"
                    >
                      日志 & 详情 <ChevronRight class="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- View 2: Pipeline Layout -->
        <div v-else class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="a in pipelineAgentList" :key="a.id" class="w-full">
              <div
                class="group cursor-pointer rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md shadow-sm hover:shadow-xl"
                :class="a.status === 'running'
                  ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/40 shadow-amber-500/10'
                  : a.status === 'completed'
                  ? 'bg-white/95 border-emerald-300/80 hover:border-emerald-500'
                  : 'bg-slate-50/80 border-slate-200/80 opacity-90 hover:opacity-100'"
                @click="openAgentLogs(a.id)"
              >
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                      :class="a.status === 'running'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : a.status === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-200 text-slate-600'"
                    >
                      <component :is="AGENT_ICON[a.id]" class="h-5 w-5" />
                    </div>
                    <div>
                      <h3 class="text-sm font-bold tracking-tight text-slate-900">{{ a.name }}</h3>
                      <p class="text-[11px] font-mono text-slate-500">{{ a.enName }}</p>
                    </div>
                  </div>
                  <span
                    v-if="a.status === 'completed'"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                  >
                    <CheckCircle2 class="h-3.5 w-3.5 text-emerald-500" />
                    已完成
                  </span>
                  <span
                    v-else-if="a.status === 'running'"
                    class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                  >
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    正在分析
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200"
                  >
                    <Circle class="h-3 w-3 text-slate-400" />
                    等待中
                  </span>
                </div>

                <div class="mt-2.5 rounded-lg px-2.5 py-1.5 text-xs bg-black/5 border border-black/5">
                  <span class="font-medium block text-[11px] mb-0.5 text-slate-500">当前动作 / 职责：</span>
                  <span class="line-clamp-2 font-mono text-xs text-slate-800">{{ a.currentTask }}</span>
                </div>

                <div class="mt-3">
                  <div class="flex items-center justify-between text-[10px] mb-1 font-mono">
                    <span class="text-slate-500">任务进度</span>
                    <span class="font-semibold text-slate-800">{{ a.progress }}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="a.status === 'running'
                        ? 'bg-amber-500 animate-pulse'
                        : a.status === 'completed'
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'"
                      :style="{ width: a.progress + '%' }"
                    />
                  </div>
                </div>

                <div class="mt-2.5 flex items-center justify-between text-[11px] pt-1">
                  <span class="text-slate-400">已产出 {{ a.completedTasks.length }} 项成果</span>
                  <span class="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    日志 & 详情 <ChevronRight class="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Inter-Agent Communication Bus Log -->
        <div class="mt-6 rounded-2xl bg-slate-900 text-slate-100 p-4 border border-slate-800 shadow-lg">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div class="flex items-center gap-2">
              <Terminal class="h-4 w-4 text-emerald-400" />
              <span class="font-mono font-semibold text-slate-200">Agent 实时通讯总线 (Inter-Agent Data Stream)</span>
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <span class="font-mono text-slate-400 text-[11px]">Protocol: Nova-RPC / JSON-L Interop</span>
          </div>

          <div class="mt-3 space-y-2 max-h-36 overflow-y-auto font-mono text-xs pr-2">
            <div v-if="activeMessages.length === 0" class="text-slate-500 italic py-2 text-center">
              智能体总线就绪，点击“开始研究”即可捕获多 Agent 实时数据交换数据包...
            </div>
            <div
              v-for="msg in activeMessages"
              :key="msg.id"
              class="flex items-start gap-2 text-slate-300 hover:bg-slate-800/50 p-1.5 rounded transition-colors"
            >
              <span class="text-slate-500 text-[10px] select-none">[{{ msg.timestamp }}]</span>
              <span class="px-1.5 rounded bg-indigo-900/60 text-indigo-300 font-semibold text-[11px] border border-indigo-700/50">
                {{ msg.from.toUpperCase() }} → {{ msg.to.toUpperCase() }}
              </span>
              <span class="text-slate-200 flex-1">{{ msg.content }}</span>
              <span v-if="msg.artifactType" class="text-[10px] bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-700">
                📦 {{ msg.artifactType }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 4. Research Opportunity (机会矩阵) ============ -->
    <section class="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Flame class="h-4 w-4" />
              </span>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-800">Opportunity Matrix</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Research Opportunity (研究机会矩阵)
            </h2>
            <p class="text-sm text-slate-500 mt-1 max-w-2xl">
              经多智能体学术文献挖掘与空白识别，系统提炼出以下 {{ researchData.opportunities.length }} 项高学术价值突破方向
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Sparkles class="h-4 w-4 text-indigo-600" />
            <span>综合评审打分机制（5分制）</span>
          </div>
        </div>

        <!-- Opportunities Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="(opp, idx) in researchData.opportunities"
            :key="opp.id"
            @click="selectedOppId = opp.id"
            class="group relative rounded-3xl border p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            :class="selectedOppId === opp.id
              ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20 shadow-xl shadow-indigo-600/5'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-lg'"
          >
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="inline-flex items-center rounded-lg bg-indigo-100/80 px-2.5 py-1 text-xs font-bold text-indigo-900">{{ opp.code }}</span>
                <span class="text-xs text-slate-400 font-mono">Opportunity #{{ idx + 1 }}</span>
              </div>

              <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-1">{{ opp.title }}</h3>
              <p class="text-xs text-slate-500 font-mono mb-4">{{ opp.subtitle }}</p>

              <div class="space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-4">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-700">研究价值</span>
                  <span class="flex items-center gap-0.5">
                    <Star
                      v-for="(_, i) in renderStars(opp.ratings.researchValue)"
                      :key="i"
                      :class="i < opp.ratings.researchValue ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'"
                      class="h-4 w-4"
                    />
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-700">创新空间</span>
                  <span class="flex items-center gap-0.5">
                    <Star
                      v-for="(_, i) in renderStars(opp.ratings.innovationSpace)"
                      :key="i"
                      :class="i < opp.ratings.innovationSpace ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'"
                      class="h-4 w-4"
                    />
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600">数据可获得性</span>
                  <span class="flex items-center gap-0.5">
                    <Star
                      v-for="(_, i) in renderStars(opp.ratings.dataAvailability)"
                      :key="i"
                      :class="i < opp.ratings.dataAvailability ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'"
                      class="h-4 w-4"
                    />
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600">实验难度</span>
                  <span class="flex items-center gap-0.5">
                    <Star
                      v-for="(_, i) in renderStars(opp.ratings.experimentDifficulty)"
                      :key="i"
                      :class="i < opp.ratings.experimentDifficulty ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'"
                      class="h-4 w-4"
                    />
                  </span>
                </div>
              </div>

              <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">{{ opp.description }}</p>
            </div>

            <div>
              <div class="flex flex-wrap gap-1.5 mb-4">
                <span v-for="tag in opp.tags" :key="tag" class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  #{{ tag }}
                </span>
              </div>

              <button
                type="button"
                @click.stop="selectedOppId = opp.id"
                class="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                :class="selectedOppId === opp.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              >
                <span>{{ selectedOppId === opp.id ? '已选为当前主攻方案' : '查看方案拆解' }}</span>
                <ChevronRight class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Deep Dive Panel for Selected Direction -->
        <div
          v-if="selectedOpp"
          class="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/30 via-white to-slate-50 p-6 sm:p-8 shadow-sm"
        >
          <div class="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">深度机会拆解</span>
                <span class="text-sm font-bold text-slate-900">{{ selectedOpp.code }}</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900">{{ selectedOpp.title }}</h3>
              <p class="text-xs text-slate-500 font-mono mt-0.5">{{ selectedOpp.subtitle }}</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="exploreAction('experiment')"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <Target class="h-3.5 w-3.5" />
                生成实验方案
              </button>
              <button
                type="button"
                @click="exploreAction('coding')"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-md hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Cpu class="h-3.5 w-3.5" />
                创建 Coding 实验
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
            <div class="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div class="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Sparkles class="h-4 w-4 text-amber-500" />
                <span>核心突破点 (Breakthrough)</span>
              </div>
              <p class="text-slate-600 leading-relaxed">{{ selectedOpp.breakthroughPoint }}</p>
            </div>

            <div class="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div class="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Layers class="h-4 w-4 text-rose-500" />
                <span>关键挑战 (Key Challenges)</span>
              </div>
              <ul class="space-y-1.5 text-slate-600 list-disc list-inside">
                <li v-for="(ch, cIdx) in selectedOpp.keyChallenges" :key="cIdx" class="line-clamp-2">{{ ch }}</li>
              </ul>
            </div>

            <div class="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
              <div class="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <Database class="h-4 w-4 text-blue-500" />
                <span>推荐数据集与模型</span>
              </div>
              <p class="text-slate-600 mb-2">
                <span class="font-semibold text-slate-800">数据源：</span>
                {{ selectedOpp.recommendedDataset }}
              </p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="m in selectedOpp.recommendedModels"
                  :key="m"
                  class="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                >
                  {{ m }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 5. Research Map (科研全景图谱) ============ -->
    <section class="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div class="relative mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <MapIcon class="h-4 w-4" />
              </span>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Global Knowledge Landscape</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Research Map (科研全景图谱与空白识别)</h2>
            <p class="text-sm text-slate-400 mt-1">知识图谱演化路径 · 核心算法分支 · 关键空白 (Research Gap) 定位</p>
          </div>

          <div class="flex items-center gap-1.5 rounded-xl bg-slate-800/80 p-1 border border-slate-700 text-xs">
            <button
              type="button"
              @click="mapTab = 'topology'"
              class="px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              :class="mapTab === 'topology' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
            >
              前沿知识演化图谱
            </button>
            <button
              type="button"
              @click="mapTab = 'gap_matrix'"
              class="px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              :class="mapTab === 'gap_matrix' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
            >
              三维科研空白矩阵 (Gap Matrix)
            </button>
            <button
              type="button"
              @click="mapTab = 'variable_flow'"
              class="px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              :class="mapTab === 'variable_flow' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
            >
              多源变量耦合流 (Variable Flow)
            </button>
          </div>
        </div>

        <!-- Tab 1: Knowledge Clusters Topology -->
        <div v-if="mapTab === 'topology'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(cluster, idx) in mapClusters"
            :key="idx"
            class="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-bold font-mono text-indigo-400">Cluster 0{{ idx + 1 }}</span>
                <span class="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">学术聚类</span>
              </div>
              <h3 class="text-base font-bold text-white mb-4">{{ cluster.category }}</h3>

              <div class="space-y-2.5">
                <div
                  v-for="node in cluster.nodes"
                  :key="node.name"
                  class="flex items-center justify-between p-3 rounded-2xl border transition-all"
                  :class="node.status === 'gap'
                    ? 'border-rose-500/40 bg-rose-950/20 text-rose-200 shadow-sm shadow-rose-900/20 ring-1 ring-rose-500/20'
                    : node.status === 'frontier'
                    ? 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300'"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="node.status === 'gap'
                        ? 'bg-rose-400 animate-pulse'
                        : node.status === 'frontier'
                        ? 'bg-indigo-400'
                        : 'bg-slate-500'"
                    />
                    <span class="text-xs font-semibold">{{ node.name }}</span>
                  </div>
                  <span
                    class="text-[10px] px-2 py-0.5 rounded-md font-mono"
                    :class="node.status === 'gap'
                      ? 'bg-rose-500/30 text-rose-300 font-bold'
                      : node.status === 'frontier'
                      ? 'bg-indigo-500/30 text-indigo-300'
                      : 'bg-slate-800 text-slate-400'"
                  >
                    {{ node.type }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>红色标记项为待突破创新空白</span>
              <span class="text-indigo-400 font-mono">100% 覆盖</span>
            </div>
          </div>
        </div>

        <!-- Tab 2: Gap Matrix -->
        <div v-else-if="mapTab === 'gap_matrix'" class="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-md">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="gap in mapGaps" :key="gap.title" class="rounded-2xl bg-slate-900/90 border border-slate-800 p-5">
              <div :class="['flex items-center gap-2 font-bold text-sm mb-2', gap.color]">
                <AlertCircle class="h-4 w-4" />
                <span>{{ gap.title }}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">{{ gap.desc }}</p>
              <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <Zap class="h-3 w-3" />
                <span>✓ 解决方案：{{ gap.solution }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Variable Flow -->
        <div v-else class="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-md">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
            <div class="w-full lg:w-1/4 rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
              <div class="font-bold text-indigo-400 mb-1">多源输入张量</div>
              <div class="space-y-1 text-slate-300 text-[11px]">
                <div v-for="input in variableFlowInputs" :key="input">• {{ input }}</div>
              </div>
            </div>

            <ArrowRight class="h-5 w-5 text-slate-500 hidden lg:block" />

            <div class="w-full lg:w-2/4 rounded-2xl bg-indigo-950/40 p-4 border border-indigo-500/30 text-center">
              <div class="font-bold text-indigo-300 mb-1">Nova Weather-Causal ST-GNN 核心解耦中枢</div>
              <div class="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-300">
                <div v-for="core in variableFlowCore" :key="core" class="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  {{ core }}
                </div>
              </div>
            </div>

            <ArrowRight class="h-5 w-5 text-slate-500 hidden lg:block" />

            <div class="w-full lg:w-1/4 rounded-2xl bg-slate-900 p-4 border border-slate-800 text-center">
              <div class="font-bold text-emerald-400 mb-1">可解释学术产出</div>
              <div class="space-y-1 text-slate-300 text-[11px]">
                <div v-for="out in variableFlowOutputs" :key="out">• {{ out }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 6. 推荐研究方案 ============ -->
    <section class="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Target class="h-4 w-4" />
              </span>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-800">AI Formulated Research Blueprint</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">推荐研究方案 (Recommended Research Scheme)</h2>
            <p class="text-sm text-slate-500 mt-1">AI 自动提炼的科学假说、基准架构对比矩阵、多模态新增变量与量化评估体系</p>
          </div>

          <button
            type="button"
            @click="exploreAction('experiment')"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Cpu class="h-3.5 w-3.5" />
            生成深度实验方案
          </button>
        </div>

        <!-- Core Research Question Banner -->
        <div class="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />
          <div class="relative z-10">
            <div class="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <Sparkles class="h-4 w-4 text-amber-400" />
              <span>Research Question (核心科学问题)</span>
            </div>
            <h3 class="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-4 flex items-start gap-2">
              <Quote class="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
              <span>{{ researchData.recommendedScheme.researchQuestion }}</span>
            </h3>

            <div class="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-indigo-300">科学假说 (Hypothesis)：</span>
                <span class="text-slate-300 line-clamp-2">{{ researchData.recommendedScheme.hypothesis }}</span>
              </div>
              <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono whitespace-nowrap">
                Reviewer 评级: 96/100 (顶会立项标准)
              </span>
            </div>
          </div>
        </div>

        <!-- 3 Pillars Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Pillar 1: Baselines -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">01</span>
                  <h4 class="text-base font-bold text-slate-900">Baseline (基准模型)</h4>
                </div>
                <span class="text-xs text-slate-400 font-mono">5 大对照体系</span>
              </div>

              <div class="flex flex-wrap gap-1.5 mb-4">
                <button
                  v-for="b in researchData.recommendedScheme.baselineModels"
                  :key="b.name"
                  type="button"
                  @click="activeBaselineTab = b.name"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  :class="activeBaselineTab === b.name ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                >
                  {{ b.name }}
                </button>
              </div>

              <div
                v-if="researchData.recommendedScheme.baselineModels.find((b) => b.name === activeBaselineTab) || researchData.recommendedScheme.baselineModels[0]"
                class="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2.5 text-xs"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 text-sm">{{ (researchData.recommendedScheme.baselineModels.find((b) => b.name === activeBaselineTab) || researchData.recommendedScheme.baselineModels[0]).name }}</span>
                  <span class="text-[11px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{{ (researchData.recommendedScheme.baselineModels.find((b) => b.name === activeBaselineTab) || researchData.recommendedScheme.baselineModels[0]).category }}</span>
                </div>
                <div>
                  <span class="font-semibold text-emerald-700 block mb-0.5">✓ 核心优势 (Strength)：</span>
                  <p class="text-slate-600 leading-relaxed">{{ (researchData.recommendedScheme.baselineModels.find((b) => b.name === activeBaselineTab) || researchData.recommendedScheme.baselineModels[0]).strength }}</p>
                </div>
                <div>
                  <span class="font-semibold text-rose-700 block mb-0.5">✗ 固有局限 (Weakness)：</span>
                  <p class="text-slate-600 leading-relaxed">{{ (researchData.recommendedScheme.baselineModels.find((b) => b.name === activeBaselineTab) || researchData.recommendedScheme.baselineModels[0]).weakness }}</p>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>基线涵盖 RNN / GNN / Transformer</span>
              <span class="text-blue-600 font-semibold font-mono">已就绪</span>
            </div>
          </div>

          <!-- Pillar 2: Added Variables -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-xs">02</span>
                  <h4 class="text-base font-bold text-slate-900">新增变量 (Added Variables)</h4>
                </div>
                <span class="text-xs text-slate-400 font-mono">5 维多模态输入</span>
              </div>

              <div class="space-y-2.5">
                <div
                  v-for="v in researchData.recommendedScheme.addedVariables"
                  :key="v.name"
                  class="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-slate-900 text-xs">{{ v.name }}</span>
                    <span class="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded">{{ v.category }}</span>
                  </div>
                  <p class="text-[11px] text-slate-600 line-clamp-1">{{ v.importance }}</p>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>包含气象、电价与地理拓扑</span>
              <span class="text-amber-600 font-semibold font-mono">时空张量对齐</span>
            </div>
          </div>

          <!-- Pillar 3: Evaluation Metrics -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">03</span>
                  <h4 class="text-base font-bold text-slate-900">Evaluation (评估指标)</h4>
                </div>
                <span class="text-xs text-slate-400 font-mono">学术顶刊标准</span>
              </div>

              <div class="space-y-2.5">
                <div
                  v-for="ev in researchData.recommendedScheme.evaluations"
                  :key="ev.metric"
                  class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono font-bold text-xs text-slate-900">{{ ev.metric }}</span>
                      <span class="text-[10px] text-slate-500 line-clamp-1">{{ ev.fullName }}</span>
                    </div>
                    <p class="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{{ ev.description }}</p>
                  </div>
                  <div class="text-right flex-shrink-0 ml-2">
                    <span class="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono text-xs font-bold">{{ ev.targetValue }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>覆盖全网平均与极端尖峰误差</span>
              <span class="text-emerald-600 font-semibold font-mono">全面评估</span>
            </div>
          </div>
        </div>

        <!-- Technical Roadmap Stepper -->
        <div class="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <GitBranch class="h-5 w-5 text-indigo-600" />
              <h4 class="text-base font-bold text-slate-900">技术路线图 (Technical Roadmap)</h4>
            </div>
            <span class="text-xs text-slate-500 font-mono">4-Stage Pipeline</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              v-for="item in researchData.recommendedScheme.technicalRoadmap"
              :key="item.step"
              class="relative rounded-2xl bg-slate-50 p-4 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div class="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">{{ item.step }}</div>
                <div class="text-sm font-bold text-slate-900 mb-2">{{ item.title }}</div>
                <p class="text-xs text-slate-600 leading-relaxed">{{ item.methods }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 7. 研究报告 (9 章节) ============ -->
    <section class="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <FileText class="h-4 w-4" />
              </span>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Autonomous Academic Paper</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">研究报告 (Research Report)</h2>
            <p class="text-sm text-slate-500 mt-1">由 4-Agent 协同闭环自动撰写的 {{ researchData.report.sections.length }} 大章节高规格科研机会分析白皮书</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="handleCopyMarkdown"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Check v-if="reportCopied" class="h-3.5 w-3.5 text-emerald-600" />
              <Copy v-else class="h-3.5 w-3.5" />
              <span>{{ reportCopied ? '已复制 Markdown' : '复制全文' }}</span>
            </button>
            <button
              type="button"
              @click="handleDownloadMarkdown"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <Download class="h-3.5 w-3.5" />
              <span>导出 .MD 报告</span>
            </button>
          </div>
        </div>

        <!-- Paper Document Container -->
        <div class="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <!-- Left: TOC -->
          <div class="lg:col-span-4 bg-slate-50/90 border-r border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div class="mb-4">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">Table of Contents (目录导航)</span>
                <h4 class="text-sm font-extrabold text-slate-900 mt-0.5">报告 {{ researchData.report.sections.length }} 大核心板块</h4>
              </div>

              <nav class="space-y-1.5">
                <button
                  v-for="sec in researchData.report.sections"
                  :key="sec.number"
                  type="button"
                  @click="activeSectionNum = sec.number"
                  class="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer"
                  :class="activeSectionNum === sec.number
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-700 hover:bg-slate-200/70'"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                      :class="activeSectionNum === sec.number ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-600'"
                    >
                      0{{ sec.number }}
                    </span>
                    <span class="truncate">{{ sec.title }}</span>
                  </div>
                  <ChevronRight class="h-3.5 w-3.5" :class="activeSectionNum === sec.number ? 'text-white' : 'text-slate-400'" />
                </button>
              </nav>
            </div>

            <!-- Quick Metadata Box -->
            <div class="mt-8 pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1 font-mono">
              <div class="flex items-center gap-1.5">
                <Calendar class="h-3.5 w-3.5 text-slate-400" />
                <span>生成日期: {{ researchData.report.generatedDate }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Users class="h-3.5 w-3.5 text-slate-400" />
                <span>协同智能体: 4 Agents</span>
              </div>
            </div>
          </div>

          <!-- Right: Academic Content Reader -->
          <div class="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <!-- Paper Title Banner -->
              <div class="pb-6 border-b border-slate-100 mb-6">
                <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {{ researchData.report.title }}
                </h1>
                <p class="text-xs text-slate-500 font-mono mt-1">{{ researchData.report.subtitle }}</p>

                <div class="mt-4 rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100/80 text-xs">
                  <div class="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                    <Sparkles class="h-3.5 w-3.5 text-indigo-600" />
                    <span>【摘要】(Abstract)</span>
                  </div>
                  <p class="text-slate-700 leading-relaxed">{{ researchData.report.abstract }}</p>
                </div>
              </div>

              <!-- Active Section Content -->
              <div v-if="activeSection" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold text-indigo-600">
                      SECTION 0{{ activeSection.number }}
                    </span>
                    <h3 class="text-lg sm:text-xl font-bold text-slate-900">{{ activeSection.title }}</h3>
                    <p class="text-xs text-slate-400 font-mono">{{ activeSection.enTitle }}</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                    {{ activeSection.number }} / {{ researchData.report.sections.length }}
                  </span>
                </div>

                <div class="rounded-xl bg-slate-50 border-l-4 border-indigo-500 p-3 text-xs text-slate-700 italic">
                  {{ activeSection.summary }}
                </div>

                <div class="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif space-y-2">
                  {{ activeSection.content }}
                </div>

                <div v-if="activeSection.highlights && activeSection.highlights.length > 0" class="mt-6 pt-4 border-t border-slate-100">
                  <span class="text-xs font-bold text-slate-900 block mb-2">
                    本节核心结论与洞察 (Key Takeaways)：
                  </span>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div
                      v-for="(hl, hIdx) in activeSection.highlights"
                      :key="hIdx"
                      class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 font-sans"
                    >
                      • {{ hl }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Pagination Bottom -->
            <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                :disabled="activeSectionNum <= 1"
                @click="activeSectionNum = Math.max(1, activeSectionNum - 1)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                ← 上一章节
              </button>

              <div class="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <button
                  v-for="s in researchData.report.sections"
                  :key="s.number"
                  type="button"
                  @click="activeSectionNum = s.number"
                  class="h-6 w-6 rounded text-xs font-bold cursor-pointer"
                  :class="s.number === activeSectionNum ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'"
                >
                  {{ s.number }}
                </button>
              </div>

              <button
                type="button"
                :disabled="activeSectionNum >= researchData.report.sections.length"
                @click="activeSectionNum = Math.min(researchData.report.sections.length, activeSectionNum + 1)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                下一章节 →
              </button>
            </div>
          </div>
        </div>

        <!-- References Section -->
        <div class="mt-8 rounded-3xl bg-slate-50 p-6 sm:p-8 border border-slate-200">
          <div class="flex items-center gap-2 mb-4">
            <BookOpen class="h-4 w-4 text-indigo-600" />
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              参考文献 (References & Citations)
            </h4>
          </div>

          <div class="space-y-2 text-xs text-slate-600 font-mono">
            <div v-for="ref in researchData.report.references" :key="ref.id" class="flex items-start gap-2">
              <span class="text-indigo-600 font-bold">[{{ ref.id }}]</span>
              <div class="flex-1">
                <span class="font-semibold text-slate-800">{{ ref.authors }}.</span>
                <span class="italic">"{{ ref.title }}".</span>
                <span>{{ ref.venue }}, {{ ref.year }}.</span>
                <span v-if="ref.doi" class="text-indigo-500 ml-1 text-[11px]">DOI: {{ ref.doi }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 8. 底部粘性操作条 ============ -->
    <div class="sticky bottom-4 z-30 mx-auto max-w-4xl px-4 w-full">
      <div class="rounded-2xl bg-slate-900/95 text-white p-3 shadow-2xl border border-slate-700/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-xs font-semibold px-2 text-slate-300">
          <Sparkles class="h-4 w-4 text-amber-400 animate-pulse" />
          <span class="hidden sm:inline">科研闭环深入交互：</span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="exploreAction('experiment')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Target class="h-3.5 w-3.5" />
            生成实验方案
          </button>
          <button
            type="button"
            @click="exploreAction('literature')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen class="h-3.5 w-3.5" />
            开始文献综述
          </button>
          <button
            type="button"
            @click="exploreAction('coding')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Code2 class="h-3.5 w-3.5" />
            创建 Coding 实验
          </button>
          <button
            type="button"
            @click="exploreAction('plan')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Calendar class="h-3.5 w-3.5" />
            生成研究计划
          </button>
        </div>
      </div>
    </div>

    <!-- ============ 9. 交互子弹窗 (Experiment / Literature / Coding / Plan) ============ -->
    <div v-if="activeModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div class="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        <!-- Modal Top Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
              <component :is="modalMeta.icon" class="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900">{{ modalMeta.title }}</h3>
              <p class="text-xs text-slate-500 font-mono">{{ modalMeta.subtitle }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="activeModal = null"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 1. Experiment Design Modal -->
          <div v-if="activeModal === 'experiment'" class="space-y-6 text-xs">
            <div class="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100">
              <span class="font-bold text-indigo-900 block mb-1">
                方案名称：{{ researchData.experimentDetail.title }}
              </span>
              <p class="text-slate-600">
                面向科研课题：“{{ researchData.topic }}”，由 Coding Agent 与 Reviewer Agent 联合评审拟定。
              </p>
            </div>

            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Layers class="h-4 w-4 text-indigo-600" />
                1. 数据预处理与张量流水线 (Data Preprocessing Pipeline)
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="(p, pIdx) in researchData.experimentDetail.datasetPreprocessing"
                  :key="pIdx"
                  class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700"
                >
                  <span class="font-mono font-bold text-indigo-600 mr-1.5">[Step {{ pIdx + 1 }}]</span>
                  {{ p }}
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Cpu class="h-4 w-4 text-amber-600" />
                2. 消融实验对照矩阵 (Ablation Studies Matrix)
              </h4>
              <div class="border border-slate-200 rounded-2xl overflow-hidden">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 text-[11px] font-bold">
                    <tr>
                      <th class="p-3">消融模块 (Component)</th>
                      <th class="p-3">Baseline 对照设置</th>
                      <th class="p-3">Proposed 创新设置</th>
                      <th class="p-3">预期提升与验证目标</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-[11px]">
                    <tr v-for="ab in researchData.experimentDetail.ablationStudies" :key="ab.component" class="hover:bg-slate-50/60">
                      <td class="p-3 font-semibold text-slate-900">{{ ab.component }}</td>
                      <td class="p-3 text-slate-500 font-mono">{{ ab.baselineSetup }}</td>
                      <td class="p-3 text-indigo-700 font-mono font-semibold">{{ ab.proposedSetup }}</td>
                      <td class="p-3 text-emerald-700 font-medium">{{ ab.expectedOutcome }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Terminal class="h-4 w-4 text-blue-600" />
                3. 超参数搜索空间 (Hyperparameter Search Space)
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div
                  v-for="hp in researchData.experimentDetail.hyperparameters"
                  :key="hp.param"
                  class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div class="font-bold text-slate-800 text-[11px]">{{ hp.param }}</div>
                  <div class="text-slate-500 text-[10px] mt-0.5">范围: {{ hp.range }}</div>
                  <div class="mt-1 font-mono font-bold text-indigo-600 text-xs">默认: {{ hp.defaultVal }}</div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl bg-slate-900 text-slate-200 p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <span class="font-bold text-white block text-xs">硬件资源评估 (Hardware Requirements)</span>
                <p class="text-slate-400 text-[11px] mt-0.5">{{ researchData.experimentDetail.hardwareRequirement }}</p>
              </div>
              <span class="text-emerald-400 font-mono text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800">
                GPU 适配就绪
              </span>
            </div>
          </div>

          <!-- 2. Literature Review Modal -->
          <div v-else-if="activeModal === 'literature'" class="space-y-4 text-xs">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <span class="text-slate-500 font-mono">
                共精选检索 142 篇顶会/顶刊论文，精读标杆成果：
              </span>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                IEEE / Nature / NeurIPS 来源
              </span>
            </div>

            <div class="space-y-3">
              <div
                v-for="lit in researchData.literatureList"
                :key="lit.id"
                class="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-indigo-300 transition-colors"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 class="text-sm font-bold text-slate-900 leading-snug">{{ lit.title }}</h4>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">被引: {{ lit.citations }}</span>
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">相关度: {{ lit.relevanceScore }}%</span>
                  </div>
                </div>

                <p class="text-slate-500 text-[11px] font-mono mb-2">
                  {{ lit.authors }} · <span class="font-semibold text-slate-700">{{ lit.venue }}</span> ({{ lit.year }})
                </p>

                <div class="space-y-1 text-slate-700 text-xs mb-3">
                  <div>
                    <span class="font-semibold text-emerald-700">✓ 核心学术贡献：</span>
                    {{ lit.coreContribution }}
                  </div>
                  <div>
                    <span class="font-semibold text-rose-700">✗ 本文局限与留白：</span>
                    {{ lit.limitations }}
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="t in lit.tags" :key="t" class="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                      #{{ t }}
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="handleCopyBibtex(lit)"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <Check v-if="bibtexCopiedId === lit.id" class="h-3 w-3 text-emerald-600" />
                    <Copy v-else class="h-3 w-3" />
                    {{ bibtexCopiedId === lit.id ? '已复制' : '复制 BibTeX' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Coding Experiment Modal -->
          <div v-else-if="activeModal === 'coding'" class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div class="flex items-center gap-1.5 overflow-x-auto">
                <button
                  v-for="(file, fIdx) in researchData.codingDetail.files"
                  :key="file.filename"
                  type="button"
                  @click="activeCodeFileIndex = fIdx"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
                  :class="activeCodeFileIndex === fIdx ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                >
                  <FileCode class="h-3.5 w-3.5" />
                  {{ file.filename }}
                </button>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="handleCopyCode"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Check v-if="codeCopied" class="h-3.5 w-3.5 text-emerald-600" />
                  <Copy v-else class="h-3.5 w-3.5" />
                  <span>{{ codeCopied ? '已复制代码' : '复制代码' }}</span>
                </button>
                <button
                  type="button"
                  @click="handleRunCodeSimulation"
                  :disabled="simulatedRunning"
                  class="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                >
                  <Loader2 v-if="simulatedRunning" class="h-3.5 w-3.5 animate-spin" />
                  <Play v-else class="h-3.5 w-3.5 fill-current" />
                  <span>{{ simulatedRunning ? '运行中...' : '测试运行模型' }}</span>
                </button>
              </div>
            </div>

            <div v-if="researchData.codingDetail.files[activeCodeFileIndex]">
              <div class="text-xs text-slate-600 mb-2 font-mono flex items-center justify-between">
                <span>{{ researchData.codingDetail.files[activeCodeFileIndex].description }}</span>
                <span class="text-slate-400">
                  Env: {{ researchData.codingDetail.framework }} · {{ researchData.codingDetail.pythonVersion }}
                </span>
              </div>

              <div class="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto max-h-[340px]">
                <pre class="leading-relaxed"><code>{{ researchData.codingDetail.files[activeCodeFileIndex].code }}</code></pre>
              </div>
            </div>

            <div v-if="consoleOutput.length > 0" class="rounded-2xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-emerald-400 space-y-1">
              <div class="text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                Console Terminal Output:
              </div>
              <div v-for="(line, lIdx) in consoleOutput" :key="lIdx">{{ line }}</div>
            </div>
          </div>

          <!-- 4. Research Plan Modal -->
          <div v-else-if="activeModal === 'plan'" class="space-y-6 text-xs">
            <div class="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100">
              <span class="font-bold text-indigo-900 block mb-1">
                12 周全周期科研排期规划 (Gantt & Milestones)
              </span>
              <p class="text-slate-600">
                由 Reviewer Agent 依据国家自然科学基金与顶会审稿周期严格倒排。
              </p>
            </div>

            <div class="space-y-4">
              <div
                v-for="(m, mIdx) in researchData.milestones"
                :key="mIdx"
                class="p-5 rounded-2xl border transition-all"
                :class="m.status === 'in_progress'
                  ? 'border-indigo-400 bg-indigo-50/30 ring-1 ring-indigo-400/30'
                  : m.status === 'completed'
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50'"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold"
                      :class="m.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : m.status === 'in_progress'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-300 text-slate-700'"
                    >
                      0{{ mIdx + 1 }}
                    </span>
                    <h4 class="text-sm font-bold text-slate-900">{{ m.stage }}</h4>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-slate-500 font-semibold">{{ m.duration }}</span>
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="m.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'in_progress'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-600'"
                    >
                      {{ m.status === 'completed' ? '已完成' : m.status === 'in_progress' ? '推进中' : '计划中' }}
                    </span>
                  </div>
                </div>

                <p class="text-slate-600 mb-3">{{ m.objective }}</p>

                <div class="pt-2 border-t border-slate-200/70">
                  <span class="font-semibold text-slate-800 block mb-1 text-[11px]">
                    阶段可交付成果 (Deliverables)：
                  </span>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="d in m.deliverables" :key="d" class="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-700 text-[11px]">
                      📦 {{ d }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Bottom Footer -->
        <div class="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div class="flex items-center gap-1.5 font-mono">
            <Sparkles class="h-3.5 w-3.5 text-indigo-600" />
            <span>Nova Research Agent System</span>
          </div>
          <button
            type="button"
            @click="activeModal = null"
            class="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>

    <!-- ============ 10. Agent 日志抽屉 ============ -->
    <div v-if="inspectingAgent" class="fixed inset-y-0 right-0 z-[60] w-full max-w-lg bg-slate-900 text-white shadow-2xl border-l border-slate-800 flex flex-col">
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950 shrink-0">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <component :is="AGENT_ICON[inspectingAgent.id]" class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              {{ inspectingAgent.name }}
              <span class="text-xs font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                {{ inspectingAgent.enName }}
              </span>
            </h3>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">{{ inspectingAgent.role }}</p>
          </div>
        </div>

        <button
          type="button"
          @click="inspectingAgent = null"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Drawer Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-mono">
        <div class="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Agent 运行状态:</span>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="inspectingAgent.status === 'completed'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : inspectingAgent.status === 'running'
                ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                : 'bg-slate-800 text-slate-400'"
            >
              {{ inspectingAgent.status.toUpperCase() }}
            </span>
          </div>

          <div>
            <span class="text-slate-400 block mb-1">正在执行的任务:</span>
            <div class="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs border border-slate-800">
              {{ inspectingAgent.currentTask }}
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>任务执行度</span>
              <span class="text-white font-bold">{{ inspectingAgent.progress }}%</span>
            </div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-500 rounded-full transition-all duration-300"
                :style="{ width: inspectingAgent.progress + '%' }"
              />
            </div>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-slate-300 block mb-2">已产出交付物 (Artifacts):</span>
          <div class="space-y-1.5">
            <div
              v-for="(t, tIdx) in inspectingAgent.completedTasks"
              :key="tIdx"
              class="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-emerald-300 text-[11px]"
            >
              <CheckCircle2 class="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>{{ t }}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal class="h-3.5 w-3.5 text-indigo-400" />
              执行日志流 (Execution Trace):
            </span>
            <span class="text-[10px] text-slate-500">Live Buffer</span>
          </div>

          <div class="space-y-2 rounded-2xl bg-slate-950 p-3.5 border border-slate-800 max-h-72 overflow-y-auto">
            <div v-for="(log, logIdx) in inspectingAgent.logs" :key="logIdx" class="text-[11px] leading-relaxed">
              <span class="text-slate-500 select-none mr-2">[{{ log.timestamp }}]</span>
              <span
                :class="log.type === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : log.type === 'process'
                  ? 'text-amber-300'
                  : log.type === 'warning'
                  ? 'text-rose-400'
                  : 'text-slate-300'"
              >
                {{ log.message }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span>Nova Multi-Agent Engine v3.7</span>
        <button
          type="button"
          @click="inspectingAgent = null"
          class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
        >
          关闭抽屉
        </button>
      </div>
    </div>

    <!-- ============ Footer ============ -->
    <footer class="mt-16 w-full border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
      <div class="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-800">Nova AI Research Agent</span>
          <span>— 旗舰级多智能体科研探索系统</span>
        </div>
        <div>
          <span>基于分布式多 Agent 协同体系 · 遵守学术伦理与科研严谨性规范</span>
        </div>
      </div>
    </footer>
  </div>
</template>

