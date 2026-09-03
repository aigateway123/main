<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/HomeView.tsx -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  AlertTriangle,
  ArrowRight,
  Building,
  Check,
  ChevronRight,
  Compass,
  FileCheck2,
  Radio,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-vue-next'
import type { AnalysisInput } from '@/data/ipIntelData'
import { IP_PRESET_TASKS } from '@/data/ipIntelData'

const props = defineProps<{ analysisInput: AnalysisInput }>()
const emit = defineEmits<{
  (e: 'update-input', input: AnalysisInput): void
  (e: 'start-analysis'): void
  (e: 'quick-demo'): void
}>()

// 预置场景 pill 文案（结构化字段复用 ipIntelData 的 IP_PRESET_TASKS）
const presetLabels = [
  '新能源储能 · 液冷系统 (默认演示)',
  '动力电池 · 全固态电池体系',
  '集成电路 · 存算一体AI加速芯片',
]

// 本地编辑状态：初始化跟随父传入的 analysisInput，后续输入框修改仅本地保存
const initialPresetIndex = Math.max(
  0,
  IP_PRESET_TASKS.findIndex((t) => t.requirement === props.analysisInput.requirement),
)
const activePreset = ref(initialPresetIndex)
const customText = ref(props.analysisInput.requirement)
const dismissed = ref(false)

// 顶部免责横幅可关闭
const dismissBanner = () => {
  dismissed.value = true
}

// 选中预置场景：本地刷新 + 立即同步结构化参数到父（结构化参数卡随父 props 联动）
const handleSelectPreset = (index: number) => {
  activePreset.value = index
  const preset = IP_PRESET_TASKS[index]
  if (!preset) return
  customText.value = preset.requirement
  emit('update-input', { ...preset })
}

// 输入框修改仅本地编辑，点「开始分析」才把最终输入提交给父
const handleTextInput = (event: Event) => {
  customText.value = (event.target as HTMLTextAreaElement).value
}

// 「开始全流程AI分析」：先提交最终需求，再通知父启动
const handleStartAnalysis = () => {
  emit('update-input', { ...props.analysisInput, requirement: customText.value })
  emit('start-analysis')
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-5 space-y-4 pb-8">
    <!-- 合规免责横幅（原 DisclaimerBanner compact，内联化） -->
    <div
      v-if="!dismissed"
      class="flex items-start gap-2.5 bg-amber-50/90 border border-amber-200/80 text-amber-900 rounded-xl p-3 shadow-sm"
    >
      <div class="p-1 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
        <AlertTriangle class="w-4 h-4" />
      </div>
      <div class="flex-1 min-w-0 leading-relaxed">
        <div class="font-semibold text-amber-950 flex items-center gap-2 flex-wrap">
          <span>重要合规与法律免责声明</span>
          <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
            Demo环境 · 辅助决策
          </span>
        </div>
        <p class="mt-1 text-amber-800/90 text-xs">
          <strong>AI分析结果仅用于知识产权检索、分析和决策辅助，不构成法律意见、侵权结论或专利授权判断。</strong>
          涉及专利申请、无效宣告、专利侵权诉讼及FTO尽调等法律事项，应由具备国家执业资质的专利代理师与知识产权专业律师进一步审核确认。
        </p>
      </div>
      <button
        type="button"
        @click="dismissBanner"
        class="text-amber-500 hover:text-amber-800 p-1 rounded-md shrink-0 cursor-pointer"
        title="关闭提醒"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Hero Header -->
    <div class="text-center space-y-2 pt-1">
      <div
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-semibold shadow-sm"
      >
        <Sparkles class="w-3.5 h-3.5 text-blue-600" />
        <span>企业级 AI 知识产权专家顾问 · 7×24小时在线</span>
      </div>

      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
        让AI帮企业看懂专利，<span class="text-blue-600">精准识别风险与布局机会</span>
      </h1>

      <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-normal">
        从专利检索、竞品专利分析，到深度侵权风险排查和四层专利布局，AI全流程贯通。
      </p>
    </div>

    <!-- 主 AI 需求输入卡 -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

      <!-- 预设场景 pill -->
      <div class="flex flex-wrap items-center justify-between gap-2.5 mb-3.5 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Compass class="w-3.5 h-3.5 text-blue-600" />
          <span>预设场景：</span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(preset, index) in IP_PRESET_TASKS"
            :key="preset.industry"
            type="button"
            @click="handleSelectPreset(index)"
            :class="[
              'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer',
              activePreset === index ? 'bg-blue-600 text-white shadow-sm font-semibold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700',
            ]"
          >
            <Check v-if="activePreset === index" class="w-3 h-3" />
            <span>{{ presetLabels[index] }}</span>
          </button>
        </div>
      </div>

      <!-- 大型 AI Prompt 输入框 -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            告诉AI，你想分析什么技术或产品？
          </h2>
          <span class="text-[10px] text-slate-400 font-mono">自然语言输入 · 自动特征抽取</span>
        </div>

        <div class="relative">
          <textarea
            id="analysis-prompt-input"
            rows="4"
            :value="customText"
            @input="handleTextInput"
            class="w-full rounded-lg border border-slate-200 p-3 text-xs sm:text-[13px] text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-all font-sans resize-none"
            placeholder="例如：我们是一家新能源储能企业，正在开发液冷储能系统。希望分析中国、美国、欧洲市场的相关专利，重点关注CATL、BYD、Tesla的专利布局..."
          />
        </div>

        <!-- 结构化参数预览卡 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div class="p-2 bg-slate-50 rounded-lg border border-slate-200/70">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">所属行业</span>
            <span class="text-xs font-bold text-slate-800 mt-0.5 block truncate">{{ analysisInput.industry }}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-lg border border-slate-200/70">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">研发产品标的</span>
            <span class="text-xs font-bold text-blue-700 mt-0.5 block truncate">{{ analysisInput.product }}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-lg border border-slate-200/70">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">目标市场</span>
            <span class="text-xs font-bold text-slate-800 mt-0.5 block truncate">{{ analysisInput.targetMarkets.join(' / ') }}</span>
          </div>
          <div class="p-2 bg-slate-50 rounded-lg border border-slate-200/70">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">重点竞对</span>
            <span class="text-xs font-bold text-rose-700 mt-0.5 block truncate">{{ analysisInput.competitors.join(' / ') }}</span>
          </div>
        </div>

        <!-- CTA 按钮：开始分析 / 快速查看总览 -->
        <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-[11px] text-slate-500 flex items-center gap-1">
            <FileCheck2 class="w-3.5 h-3.5 text-emerald-600" />
            <span>涵盖权威数据源：CNIPA · USPTO · EPO · WIPO</span>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              @click="emit('quick-demo')"
              class="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              快速查看智能总览
            </button>

            <button
              type="button"
              @click="handleStartAnalysis"
              class="flex-1 sm:flex-initial px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
            >
              <span>开始全流程AI分析</span>
              <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 三大能力特性卡 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <div class="w-8 h-8 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-2">
          <ShieldAlert class="w-4 h-4" />
        </div>
        <h3 class="font-bold text-slate-900 text-xs">白盒级侵权风险比对</h3>
        <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
          告别黑盒模糊检索，精准拆解独立权利要求与从属特征重合度及等同原则风险。
        </p>
      </div>

      <div class="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <div class="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
          <Building class="w-4 h-4" />
        </div>
        <h3 class="font-bold text-slate-900 text-xs">2D竞争对手专利气泡地图</h3>
        <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
          横轴技术分支，纵轴布局壁垒强度。一目了然看清CATL、BYD、Tesla在各大核心技术分支的分布。
        </p>
      </div>

      <div class="bg-white rounded-lg p-3.5 border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
        <div class="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
          <TrendingUp class="w-4 h-4" />
        </div>
        <h3 class="font-bold text-slate-900 text-xs">AI挖掘技术空白与四层布局</h3>
        <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
          发现巨头尚未覆盖的专利蓝海，按基础部件、系统集成、控制算法四层金字塔生成布局蓝图。
        </p>
      </div>
    </div>

    <!-- 今日知识产权情报（实时巡检） -->
    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Radio class="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xs font-bold text-white">今日知识产权情报</h3>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                实时巡检中
              </span>
            </div>
            <p class="text-[10px] text-slate-400 mt-0.5">
              AI Agent 24小时主动追踪行业专利动向，如同一名专职驻企知识产权工程师
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="emit('quick-demo')"
          class="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 self-start md:self-auto cursor-pointer"
        >
          <span>进入情报雷达</span>
          <ChevronRight class="w-3 h-3" />
        </button>
      </div>

      <!-- 情报统计指标 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
        <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70">
          <span class="text-[10px] text-slate-400 font-medium">新增相关专利</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-extrabold text-white font-mono">26</span>
            <span class="text-[10px] text-emerald-400 font-medium">件</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">较昨日 +14%</p>
        </div>

        <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70">
          <span class="text-[10px] text-slate-400 font-medium">竞争对手新增</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-extrabold text-blue-400 font-mono">8</span>
            <span class="text-[10px] text-blue-300 font-medium">件</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">CATL (5) / Tesla (3)</p>
        </div>

        <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70">
          <span class="text-[10px] text-slate-400 font-medium">风险变化</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-extrabold text-rose-400 font-mono">3</span>
            <span class="text-[10px] text-rose-300 font-medium">项</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">1项授权转入诉讼期</p>
        </div>

        <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/70">
          <span class="text-[10px] text-slate-400 font-medium">潜在布局机会</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-xl font-extrabold text-emerald-400 font-mono">7</span>
            <span class="text-[10px] text-emerald-300 font-medium">项</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">动态流控评分 91</p>
        </div>
      </div>
    </div>
  </div>
</template>
