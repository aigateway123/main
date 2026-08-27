<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  Download,
  Play,
  Sparkles,
  BookOpen,
  FilePlus2,
  Send,
  Bot,
  User,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  CalendarCheck,
  Code2,
  PlaySquare,
  Scale,
  LineChart,
  ChevronRight,
} from 'lucide-vue-next'
import {
  PRESET_PAPERS,
  generateEpochLog,
  createUniqueId,
  nowTime,
  simulateChatReply,
  buildCustomPaper,
  type ResearchPaper,
  type PipelineStage,
  type GeneratedCodeFile,
  type TrainingEpochLog,
  type ConsoleLogMessage,
  type ChatMessage,
} from '@/data/paper2codeData'
import { exportProjectAsZip } from '@/utils/zipExporter'
import Paper2CodeExtractView from './paper2code/Paper2CodeExtractView.vue'
import Paper2CodePlanView from './paper2code/Paper2CodePlanView.vue'
import Paper2CodeCodeView from './paper2code/Paper2CodeCodeView.vue'
import Paper2CodeRunView from './paper2code/Paper2CodeRunView.vue'
import Paper2CodeCompareView from './paper2code/Paper2CodeCompareView.vue'
import Paper2CodeChartsView from './paper2code/Paper2CodeChartsView.vue'

const emit = defineEmits<{ (e: 'handoff'): void }>()

// 打开弹窗时定位到的阶段（用于按节点复用本弹窗：coding-agent → code，experiment-reproduction → execute）
const props = withDefaults(defineProps<{ initialStage?: PipelineStage }>(), {
  initialStage: 'extract',
})

// ------------------------------------------------------------ 全局状态
const allPapers = ref<ResearchPaper[]>([...PRESET_PAPERS])
const currentPaper = ref<ResearchPaper>(PRESET_PAPERS[0])
const activeStage = ref<PipelineStage>('extract')
const activeFile = ref<GeneratedCodeFile>(PRESET_PAPERS[0].files[0])
const highlightFormula = ref<string | null>(null)
const isUploadModalOpen = ref(false)

// 实验运行状态
const currentEpoch = ref(0)
const currentEpochRef = ref(0)
const maxEpochs = 50
const isExecuting = ref(false)
const isCompleted = ref(false)
const trainingLogs = ref<TrainingEpochLog[]>([])
const consoleLogs = ref<ConsoleLogMessage[]>([
  {
    id: 'log-init-0',
    timestamp: nowTime(),
    level: 'INFO',
    message: 'Paper2Code Agent initialized. Environment ready (PyTorch 2.2 + CUDA 12.1).',
  },
])

// AI 科研监督智能体对话
const chatMessages = ref<ChatMessage[]>([])
const isChatLoading = ref(false)

const buildInitialChat = (paper: ResearchPaper): ChatMessage => ({
  id: createUniqueId('msg-init'),
  role: 'assistant',
  content: `您好！我是您的 **Paper2Code 科研实验代码复现智能体**。\n\n针对当前论文 **《${paper.title}》**，我已经完成以下准备：\n1. ✅ **论文解析**：已提取 Section 4 实验方法、数据切分与核心数学公式；\n2. 📋 **实验规划**：已设定 Table 2 多变量预测协议（H=96, 192, 336, 720）；\n3. 💻 **代码工程**：已自动生成完整 Python 项目（\`/data\`, \`/models\`, \`train.py\`, \`evaluate.py\`, \`config.yaml\` 等）；\n\n您可以点击右上角「**一键复现 Table 2**」或直接对我说：“**按照论文 Section 4 的实验设计，帮我复现 Table 2**”。`,
  timestamp: 'Just now',
  suggestedAction: { label: '一键复现 Table 2', type: 'run_experiment' },
})
chatMessages.value = [buildInitialChat(PRESET_PAPERS[0])]

// ------------------------------------------------------------ 论文切换
const handleSelectPaper = (paper: ResearchPaper) => {
  currentPaper.value = paper
  activeFile.value = paper.files[0]
  activeStage.value = 'extract'
  isExecuting.value = false
  isCompleted.value = false
  currentEpoch.value = 0
  currentEpochRef.value = 0
  trainingLogs.value = []
  consoleLogs.value = [
    {
      id: createUniqueId('log-switch'),
      timestamp: nowTime(),
      level: 'INFO',
      message: `Switched active paper to [${paper.shortName}]. Ready for reproduction.`,
    },
  ]
  chatMessages.value = [buildInitialChat(paper)]
}

// ------------------------------------------------------------ 跳转代码并高亮公式
const handleNavigateToCode = (targetPath: string, formulaName?: string) => {
  const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`
  const found = currentPaper.value.files.find((f) => f.path === cleanPath || f.filename === targetPath)
  activeFile.value = found ?? currentPaper.value.files[2]
  highlightFormula.value = formulaName ?? null
  activeStage.value = 'code'
}

// ------------------------------------------------------------ ZIP 打包导出
const handleDownloadZip = () => {
  exportProjectAsZip(currentPaper.value.title, currentPaper.value.files)
  consoleLogs.value.push({
    id: createUniqueId('log-zip'),
    timestamp: nowTime(),
    level: 'INFO',
    message: `Project exported as ZIP (${currentPaper.value.files.length} files bundled).`,
  })
}
// ------------------------------------------------------------ 实验运行控制
const startExperiment = () => {
  activeStage.value = 'execute'
  isExecuting.value = true
  isCompleted.value = false
  consoleLogs.value.push({
    id: createUniqueId('log-start'),
    timestamp: nowTime(),
    level: 'INFO',
    message: `Starting PyTorch training: dataset=Weather, seq_len=336, pred_len=96, batch_size=128...`,
  })
}

const pauseExperiment = () => {
  isExecuting.value = false
}

const resetExperiment = () => {
  isExecuting.value = false
  isCompleted.value = false
  currentEpoch.value = 0
  currentEpochRef.value = 0
  trainingLogs.value = []
}

const fastForwardExperiment = () => {
  isExecuting.value = false
  isCompleted.value = true
  currentEpoch.value = maxEpochs
  currentEpochRef.value = maxEpochs
  const fullLogs: TrainingEpochLog[] = []
  for (let e = 1; e <= maxEpochs; e++) {
    fullLogs.push(generateEpochLog(e, maxEpochs))
  }
  trainingLogs.value = fullLogs
  consoleLogs.value.push(
    {
      id: createUniqueId('log-ff-done'),
      timestamp: nowTime(),
      level: 'METRIC',
      message: `[Fast-Forward Completed] ${maxEpochs}/${maxEpochs} Epochs finished. Best Val MSE: 0.1512. Test MSE (H=96): 0.151.`,
    },
    {
      id: createUniqueId('log-ff-ckpt'),
      timestamp: nowTime(),
      level: 'INFO',
      message: `Best model checkpoint saved to ./results/checkpoints/best_checkpoint.pth.`,
    },
  )
}

// 训练计时器（350ms / epoch）
let timerId: number | null = null
watch([isExecuting, isCompleted], ([running, done]) => {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
  if (running && !done) {
    timerId = window.setInterval(() => {
      const next = currentEpochRef.value + 1
      if (next > maxEpochs) {
        isExecuting.value = false
        isCompleted.value = true
        return
      }
      const log = generateEpochLog(next, maxEpochs)
      currentEpochRef.value = next
      currentEpoch.value = next
      trainingLogs.value = [...trainingLogs.value, log]

      if (next % 5 === 0 || next === 1 || next === maxEpochs) {
        const formatted = `Epoch [${next < 10 ? '0' + next : next}/${maxEpochs}] | Train Loss: ${log.train_loss.toFixed(4)} | Val Loss: ${log.val_loss.toFixed(4)} | Test MSE: ${log.test_mse.toFixed(4)} | LR: ${log.learning_rate.toFixed(6)}`
        consoleLogs.value.push({
          id: createUniqueId(`log-ep-${next}`),
          timestamp: nowTime(),
          level: next === maxEpochs ? 'METRIC' : 'INFO',
          message: formatted,
        })
      }

      if (next >= maxEpochs) {
        isExecuting.value = false
        isCompleted.value = true
        consoleLogs.value.push({
          id: createUniqueId('log-completed'),
          timestamp: nowTime(),
          level: 'METRIC',
          message: '[✓] Training and Evaluation finished! All Table 2 horizons evaluated.',
        })
      }
    }, 350)
  }
})
onBeforeUnmount(() => {
  if (timerId !== null) clearInterval(timerId)
})

// ------------------------------------------------------------ 一键复现 Table 2 闭环
const handleQuickReproduce = () => {
  fastForwardExperiment()
  activeStage.value = 'compare'
  chatMessages.value.push(
    {
      id: createUniqueId('chat-user-repro'),
      role: 'user',
      content: '按照论文 Section 4 的实验设计，帮我复现 Table 2。',
      timestamp: nowTime(),
    },
    {
      id: createUniqueId('chat-agent-repro'),
      role: 'assistant',
      content: `已为您自动完成 **Table 2 实验复现闭环**：\n\n1. **数据与模型加载**：已在 \`models/model.py\` 与 \`data/dataset.py\` 完成 RevIN 归一化与 Patch Tokenization；\n2. **多步长训练与评测**：完成 Weather 数据集在 4 个预测步长（H=96, 192, 336, 720）下的拟合；\n3. **复现结果对齐**：\n   - H=96 MSE: **0.151**（原论文报告: 0.149，偏差仅 +1.3%）\n   - H=192 MSE: **0.196**（原论文报告: 0.194）\n   - H=336 MSE: **0.247**（原论文报告: 0.245）\n   - H=720 MSE: **0.318**（原论文报告: 0.314）\n\n已自动跳转至「**结果对比与归因**」面板，您可以查看详细差异归因分析！`,
      timestamp: nowTime(),
      suggestedAction: { label: '查看差异成因与 LaTeX 表格', type: 'switch_tab', payload: 'compare' },
    },
  )
}
// ------------------------------------------------------------ AI 助手消息
const handleSendMessage = async (userMsg: string) => {
  if (isChatLoading.value) return
  const msg = userMsg.trim()
  if (!msg) return
  chatInput.value = ''
  chatMessages.value.push({
    id: createUniqueId('chat-u'),
    role: 'user',
    content: msg,
    timestamp: nowTime(),
  })
  isChatLoading.value = true

  await new Promise((r) => setTimeout(r, 650))
  const sim = simulateChatReply(userMsg, currentPaper.value)
  chatMessages.value.push({
    id: createUniqueId('chat-a'),
    role: 'assistant',
    content: sim.reply,
    timestamp: nowTime(),
  })
  isChatLoading.value = false

  if (sim.reproduce) {
    handleQuickReproduce()
  } else if (sim.stage) {
    activeStage.value = sim.stage
  }
}

const handleApplySuggestedAction = (action: any) => {
  if (action?.type === 'run_experiment') {
    handleQuickReproduce()
  } else if (action?.type === 'switch_tab') {
    activeStage.value = action.payload || 'compare'
  }
}

// ------------------------------------------------------------ 上传自定义论文
const uploadForm = ref({ title: '', authors: '', venue: 'NeurIPS 2024', targetGoal: '按照论文 Section 4 的实验设计，帮我复现 Table 2。', paperContent: '' })
const uploadError = ref<string | null>(null)
const isUploading = ref(false)

const submitCustomPaper = () => {
  if (!uploadForm.value.title.trim()) {
    uploadError.value = '请输入论文标题'
    return
  }
  isUploading.value = true
  uploadError.value = null
  const newPaper = buildCustomPaper({ ...uploadForm.value })
  allPapers.value = [newPaper, ...allPapers.value]
  handleSelectPaper(newPaper)
  isUploading.value = false
  isUploadModalOpen.value = false
  uploadForm.value = { title: '', authors: '', venue: 'NeurIPS 2024', targetGoal: '按照论文 Section 4 的实验设计，帮我复现 Table 2。', paperContent: '' }
}

// 阶段 Stepper 配置
const STEPS = [
  { id: 'extract', title: '1. 论文解析', subtitle: '提取方法与公式', icon: FileText },
  { id: 'plan', title: '2. 实验规划', subtitle: '设定基准与指标', icon: CalendarCheck },
  { id: 'code', title: '3. 代码工程', subtitle: '生成完整Python项目', icon: Code2 },
  { id: 'execute', title: '4. 实验运行', subtitle: '训练与损失拟合', icon: PlaySquare },
  { id: 'compare', title: '5. 结果对比与归因', subtitle: '对比原论文差异', icon: Scale },
  { id: 'charts', title: '6. 图表与 LaTeX', subtitle: '出版级图表与表格', icon: LineChart },
] as const

const activeIdx = ref(0)
const stageIdx = (s: PipelineStage) => STEPS.findIndex((x) => x.id === s)
watch(activeStage, (s) => (activeIdx.value = stageIdx(s)), { immediate: true })

// 挂载时定位到指定阶段；experiment-reproduction 节点需自动开始实验运行
onMounted(() => {
  if (props.initialStage === 'execute') {
    startExperiment()
  } else if (props.initialStage !== 'extract') {
    activeStage.value = props.initialStage
  }
})

// 聊天输入框 & 快捷指令
const chatInput = ref('')
const QUICK_PROMPTS = [
  { label: '复现 Table 2', prompt: '按照论文 Section 4 的实验设计，帮我复现 Table 2。' },
  { label: '对比结果差异', prompt: '把实验结果和论文原结果进行对比，告诉我差异在哪里？' },
  { label: '解释公式 (2) 代码', prompt: '解释一下 models/model.py 里公式 (2) Patch Projection 的代码实现逻辑。' },
  { label: '设计消融实验', prompt: '帮我设计一个消融实验（Ablation Study），验证 Patching 与 RevIN 的贡献。' },
  { label: '生成 LaTeX 表格', prompt: '生成可以直接粘贴到 Overleaf 的 Table 2 论文对比表格代码。' },
]
</script>
<template>
  <div class="h-[82vh] flex flex-col bg-[#0A0B10] text-slate-100 font-sans selection:bg-cyan-400 selection:text-black">
    <!-- 顶部导航 -->
    <header class="bg-[#0E1018] border-b border-white/5 text-slate-300 shrink-0">
      <div class="flex items-center justify-between h-14 px-4 gap-3">
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Code2 class="w-4 h-4 text-white" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-sm tracking-tight text-white whitespace-nowrap">Paper2Code <span class="text-cyan-400">Agent</span></span>
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">PhD Copilot</span>
            </div>
            <p class="text-[10px] text-slate-500 font-medium hidden md:block truncate">论文实验代码复现智能体 · 科研全流程闭环</p>
          </div>
        </div>

        <!-- 论文选择 -->
        <div class="hidden lg:flex items-center bg-[#161923] rounded-full px-3 py-1.5 border border-white/10">
          <span class="text-[10px] font-mono text-cyan-400 mr-2 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            ACTIVE SESSION:
          </span>
          <select
            :value="currentPaper.id"
            @change="(e: any) => { const found = allPapers.find(p => p.id === (e.target as HTMLSelectElement).value); if (found) handleSelectPaper(found) }"
            class="bg-transparent text-xs font-medium text-slate-100 outline-none cursor-pointer pr-1 max-w-[180px]"
          >
            <option v-for="p in allPapers" :key="p.id" :value="p.id" class="bg-[#161923] text-slate-200">{{ p.shortName }}</option>
          </select>
          <button @click="isUploadModalOpen = true" class="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer" title="导入新论文进行复现">
            <FilePlus2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- 快捷操作 -->
        <div class="flex items-center space-x-2">
          <button
            @click="handleQuickReproduce"
            class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles class="w-3.5 h-3.5 text-cyan-300" />
            <span class="hidden sm:inline">一键复现 Table 2</span>
          </button>

          <button
            @click="startExperiment"
            :disabled="isExecuting"
            class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:cursor-wait"
            :class="isExecuting ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'"
          >
            <span v-if="isExecuting" class="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <Play v-else class="w-3.5 h-3.5 fill-current" />
            <span>{{ isExecuting ? '实验拟合中...' : '运行实验' }}</span>
          </button>

          <button
            @click="handleDownloadZip"
            class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            title="打包导出完整 Python 项目"
          >
            <Download class="w-3.5 h-3.5 text-slate-400" />
            <span>导出代码</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 6 阶段流水线 Stepper -->
    <div class="bg-[#0E1018] border-b border-white/5 px-3 py-2 shrink-0">
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
        <template v-for="(step, idx) in STEPS" :key="step.id">
          <button
            @click="activeStage = step.id"
            class="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition-all whitespace-nowrap shrink-0 cursor-pointer"
            :class="activeStage === step.id
              ? 'bg-indigo-950/40 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 ring-1 ring-cyan-500/20'
              : idx < activeIdx || isCompleted
                ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'"
          >
            <span
              class="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold transition-colors shrink-0"
              :class="activeStage === step.id
                ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20'
                : (idx < activeIdx || isCompleted) && activeStage !== step.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#161923] text-slate-400 border border-white/5'"
            >
              <CheckCircle2 v-if="(idx < activeIdx || isCompleted) && activeStage !== step.id" class="w-3.5 h-3.5 text-emerald-400" />
              <component :is="step.icon" v-else class="w-3.5 h-3.5" />
            </span>
            <span class="flex flex-col">
              <span class="text-xs font-semibold" :class="activeStage === step.id ? 'text-cyan-200' : 'text-slate-200'">{{ step.title }}</span>
              <span class="text-[10px] text-slate-400 font-normal">{{ step.subtitle }}</span>
            </span>
          </button>
          <ChevronRight v-if="idx < STEPS.length - 1" class="w-3 h-3 text-slate-700 shrink-0 hidden sm:block" />
        </template>
      </div>
    </div>
    <!-- 主工作区：左侧 AI 助手 + 右侧阶段工作站 -->
    <div class="flex-1 flex overflow-hidden min-h-0">
      <!-- 左侧：科研监督智能体聊天面板 -->
      <div class="w-80 lg:w-96 shrink-0 hidden md:flex flex-col bg-[#0D0F16] border-r border-white/5">
        <div class="p-3.5 border-b border-white/5 bg-[#0E1018] flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot class="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 class="text-xs font-semibold text-white">科研监督智能体 (AI Supervisor)</h3>
              <p class="text-[10px] text-slate-400">人类在环 (Human-in-the-loop) 实验交互</p>
            </div>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            在线
          </span>
        </div>

        <!-- 快捷指令 -->
        <div class="p-2.5 border-b border-white/5 bg-[#0A0B10]/60">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center">
            <Sparkles class="w-3 h-3 text-cyan-400 mr-1" />
            快捷科研指令:
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="qp in QUICK_PROMPTS"
              :key="qp.label"
              @click="handleSendMessage(qp.prompt)"
              :disabled="isChatLoading"
              class="text-[11px] px-2.5 py-1 rounded-md bg-[#161923] hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-500/40 border border-white/10 text-slate-300 transition-all text-left cursor-pointer disabled:opacity-50"
            >
              {{ qp.label }}
            </button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
          <template v-for="msg in chatMessages" :key="msg.id">
            <div v-if="msg.role === 'system'" class="text-center my-2">
              <span class="px-2.5 py-1 rounded-full bg-[#161923] text-[10px] text-slate-400 border border-white/5">{{ msg.content }}</span>
            </div>
            <div v-else class="flex items-start space-x-2" :class="msg.role === 'assistant' ? '' : 'flex-row-reverse space-x-reverse'">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                :class="msg.role === 'assistant' ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-sm' : 'bg-indigo-600 text-white shadow-sm'"
              >
                <Bot v-if="msg.role === 'assistant'" class="w-3.5 h-3.5" />
                <User v-else class="w-3.5 h-3.5" />
              </div>
              <div
                class="max-w-[85%] rounded-xl p-3 leading-relaxed"
                :class="msg.role === 'assistant'
                  ? 'bg-[#161923] text-slate-200 border border-white/10 shadow-sm'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'"
              >
                <div class="whitespace-pre-wrap font-sans text-xs">{{ msg.content }}</div>
                <div v-if="msg.suggestedAction" class="mt-2.5 pt-2 border-t border-white/10">
                  <button
                    @click="handleApplySuggestedAction(msg.suggestedAction)"
                    class="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    <span>{{ msg.suggestedAction.label }}</span>
                    <ChevronRight class="w-3 h-3" />
                  </button>
                </div>
                <div class="mt-1 text-[9px] opacity-40 text-right font-mono">{{ msg.timestamp }}</div>
              </div>
            </div>
          </template>

          <div v-if="isChatLoading" class="flex items-start space-x-2">
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-xs shrink-0">
              <Bot class="w-3.5 h-3.5" />
            </div>
            <div class="bg-[#161923] border border-white/10 rounded-xl p-3 text-slate-300">
              <div class="flex items-center space-x-1.5">
                <div class="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                <div class="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div class="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span class="text-[11px] text-slate-400 ml-1">科研智能体正在解析并生成...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入框 -->
        <form class="p-3 border-t border-white/5 bg-[#0E1018]" @submit.prevent="handleSendMessage(chatInput)">
          <div class="relative flex items-center">
            <input
              v-model="chatInput"
              type="text"
              placeholder="输入科研指令（如：复现 Section 4、调参、分析差异...）"
              :disabled="isChatLoading"
              class="w-full bg-[#0A0B10] border border-white/10 rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            <button
              type="submit"
              :disabled="!chatInput.trim() || isChatLoading"
              class="absolute right-1.5 p-1.5 rounded-md text-white transition-all cursor-pointer"
              :class="chatInput.trim() && !isChatLoading
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-sm'
                : 'text-slate-600 cursor-not-allowed'"
            >
              <Send class="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      <!-- 右侧：当前阶段工作站 -->
      <div class="flex-1 overflow-y-auto bg-[#0A0B10]">
        <Paper2CodeExtractView
          v-if="activeStage === 'extract'"
          :paper="currentPaper"
          @navigate-code="handleNavigateToCode"
          @proceed-plan="activeStage = 'plan'"
        />
        <Paper2CodePlanView
          v-else-if="activeStage === 'plan'"
          :paper="currentPaper"
          @proceed-code="activeStage = 'code'"
          @run="startExperiment"
        />
        <Paper2CodeCodeView
          v-else-if="activeStage === 'code'"
          :paper="currentPaper"
          :active-file="activeFile"
          :highlight-formula="highlightFormula"
          @select-file="(file) => { activeFile = file; highlightFormula = null }"
          @download-zip="handleDownloadZip"
        />
        <Paper2CodeRunView
          v-else-if="activeStage === 'execute'"
          :paper="currentPaper"
          :training-logs="trainingLogs"
          :console-logs="consoleLogs"
          :current-epoch="currentEpoch"
          :max-epochs="maxEpochs"
          :is-running="isExecuting"
          :is-completed="isCompleted"
          @start="startExperiment"
          @pause="pauseExperiment"
          @reset="resetExperiment"
          @fast-forward="fastForwardExperiment"
          @proceed-compare="activeStage = 'compare'"
        />
        <Paper2CodeCompareView
          v-else-if="activeStage === 'compare'"
          :paper="currentPaper"
          @proceed-charts="activeStage = 'charts'"
          @ask-supervisor="handleSendMessage"
        />
        <Paper2CodeChartsView v-else :paper="currentPaper" />
      </div>
    </div>

    <!-- 上传自定义论文弹窗 -->
    <div
      v-if="isUploadModalOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      @click.self="isUploadModalOpen = false"
    >
      <div class="bg-[#0D0F16] border border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl shadow-black/80 relative text-slate-200">
        <button
          @click="isUploadModalOpen = false"
          class="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center space-x-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <BookOpen class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white tracking-tight">导入论文并自动构建复现项目</h2>
            <p class="text-xs text-slate-400">Agent 将自动提取公式、生成 Python 工程及实验基准</p>
          </div>
        </div>

        <div
          v-if="uploadError"
          class="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2"
        >
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ uploadError }}</span>
        </div>

        <form class="space-y-3.5 text-xs" @submit.prevent="submitCustomPaper">
          <div>
            <label class="block text-slate-300 font-semibold mb-1">论文标题 (Paper Title) *</label>
            <input
              v-model="uploadForm.title"
              type="text"
              required
              placeholder="例如：《XXX模型在时间序列预测中的应用》"
              class="w-full bg-[#0A0B10] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-semibold mb-1">作者 / 团队</label>
              <input
                v-model="uploadForm.authors"
                type="text"
                placeholder="例如：Research Lab"
                class="w-full bg-[#0A0B10] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            <div>
              <label class="block text-slate-300 font-semibold mb-1">目标会议 / 期刊</label>
              <input
                v-model="uploadForm.venue"
                type="text"
                placeholder="例如：ICLR 2024 / NeurIPS"
                class="w-full bg-[#0A0B10] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-semibold mb-1">复现要求 / 目标章节 (Target Goal)</label>
            <input
              v-model="uploadForm.targetGoal"
              type="text"
              placeholder="例如：按照论文 Section 4 的实验设计，帮我复现 Table 2。"
              class="w-full bg-[#0A0B10] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label class="block text-slate-300 font-semibold mb-1">论文文本摘录 / 摘要 / 核心公式或实验描述 (选填)</label>
            <textarea
              v-model="uploadForm.paperContent"
              rows="4"
              placeholder="粘贴论文摘要、Section 4 实验设计或核心公式描述..."
              class="w-full bg-[#0A0B10] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none font-mono text-[11px] transition-colors"
            />
          </div>

          <div class="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              @click="isUploadModalOpen = false"
              class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isUploading"
              class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Sparkles class="w-3.5 h-3.5 text-cyan-300" />
              <span>{{ isUploading ? 'AI 解析中...' : '开始一键解析并生成代码' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
