<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-vue-next'
import type { TenderAnalysisResult, CompanyProfile } from '@/data/bidConsultantData'
import { SAMPLE_TENDERS } from '@/data/bidConsultantData'

interface Props {
  isOpen: boolean
  activeCompany: CompanyProfile
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'analyze-success', tender: TenderAnalysisResult): void
  (e: 'select-preset', id: string): void
}>()

type TabKey = 'upload' | 'preset' | 'text'

const activeTab = ref<TabKey>('preset')
const tenderTitle = ref('')
const tenderText = ref('')
const uploadedFileName = ref<string | null>(null)
const isAnalyzing = ref(false)
const analysisPhase = ref('')
const errorMsg = ref<string | null>(null)

const presetList = computed(() => Object.values(SAMPLE_TENDERS))

// 本地模拟分析所用的定时器（组件卸载时清理）
let analysisTimers: ReturnType<typeof setTimeout>[] = []

onBeforeUnmount(() => {
  analysisTimers.forEach((timer) => clearTimeout(timer))
})

const handleFileUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadedFileName.value = file.name
  tenderTitle.value = file.name.replace(/\.[^/.]+$/, '')

  // Read text from file if possible
  const reader = new FileReader()
  reader.onload = (event) => {
    const content = (event.target?.result as string) || ''
    tenderText.value = content || `【已上传文件】：${file.name}\n（正在通过智能OCR/文档解析引擎深度识别招标文件结构...）`
  }
  reader.readAsText(file)
}

// 本地模拟：不依赖任何后端，约 1500ms 后把预置标书深拷贝作为解析结果返回
const handleRunAnalysis = () => {
  if (!tenderText.value.trim()) {
    errorMsg.value = '请上传招标文件或粘贴招标文件正文内容'
    return
  }

  errorMsg.value = null
  isAnalyzing.value = true
  analysisPhase.value = '正在解析招标文件结构与关键条款...'

  analysisTimers = [
    setTimeout(() => {
      analysisPhase.value = '正在提取资格审查硬门槛与一票否决项...'
    }, 400),
    setTimeout(() => {
      analysisPhase.value = '正在拆解综合评分规则与测算提分空间...'
    }, 800),
    setTimeout(() => {
      // 从预置标书深拷贝一份作为解析结果，避免污染源数据
      const baseTemplate = SAMPLE_TENDERS['smart-city-it'] || Object.values(SAMPLE_TENDERS)[0]
      const result: TenderAnalysisResult = JSON.parse(JSON.stringify(baseTemplate))
      result.id = 'custom-' + Date.now()
      result.timestamp = new Date().toISOString()
      result.overview.projectName = tenderTitle.value || '自定义招标文件项目'
      result.overview.coreSummary =
        `【智能解析结果】：本项目聚焦于${tenderTitle.value || '特定专业领域'}采购，` +
        '包含严格的资格准入标准、阶梯式综合评分法则及多项实质性技术条款。'

      isAnalyzing.value = false
      emit('analyze-success', result)
      emit('close')
    }, 1500)
  ]
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Modal Title -->
        <div class="mb-6">
          <div class="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles class="w-4 h-4" />
            <span>智能标书解析与顾问推演引擎</span>
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">
            导入招标文件进行全流程深度剖析
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            支持一键加载真实行业标书模板，或上传本地 PDF、Word、Excel、图片扫描件及正文文本。
          </p>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            @click="activeTab = 'preset'"
            class="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'preset'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'"
          >
            <Layers class="w-3.5 h-3.5" />
            <span>真实行业标书示范案例</span>
          </button>

          <button
            @click="activeTab = 'upload'"
            class="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'"
          >
            <UploadCloud class="w-3.5 h-3.5" />
            <span>上传文件 (PDF/Word/Excel)</span>
          </button>

          <button
            @click="activeTab = 'text'"
            class="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'text'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'"
          >
            <FileText class="w-3.5 h-3.5" />
            <span>粘贴正文文本</span>
          </button>
        </div>

        <!-- Content Body -->
        <div class="flex-1 overflow-y-auto space-y-4 pr-1">
          <!-- 1. Presets -->
          <div v-if="activeTab === 'preset'" class="space-y-3">
            <div class="text-xs text-slate-400 font-medium">
              点击直接加载包含完整实质性条款与评分细则的真实招标文件：
            </div>
            <div
              v-for="tender in presetList"
              :key="tender.id"
              @click="emit('select-preset', tender.id); emit('close')"
              class="p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex items-start justify-between gap-4 group"
            >
              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                    {{ tender.overview.projectType }}
                  </span>
                  <h4 class="font-bold text-slate-100 text-sm group-hover:text-blue-300 transition-colors">
                    {{ tender.overview.projectName }}
                  </h4>
                </div>

                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {{ tender.overview.coreSummary }}
                </p>

                <div class="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span class="text-amber-400 font-mono font-bold">预算: {{ tender.overview.budget }}</span>
                  <span>•</span>
                  <span>招标人: {{ tender.overview.tenderer }}</span>
                  <span>•</span>
                  <span class="text-red-400">高危项: {{ tender.risks.filter((r) => r.riskLevel === 'high').length }} 项</span>
                </div>
              </div>

              <ArrowRight class="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
            </div>
          </div>

          <!-- 2. File Upload -->
          <div v-else-if="activeTab === 'upload'" class="space-y-4">
            <label class="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                @change="handleFileUpload"
                class="hidden"
              />
              <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <UploadCloud class="w-6 h-6" />
              </div>
              <span class="text-sm font-bold text-slate-200">
                {{ uploadedFileName ? `已选择文件：${uploadedFileName}` : '点击或拖拽上传招标文件' }}
              </span>
              <p class="text-xs text-slate-500 mt-1">
                支持 PDF、Word (.docx)、Excel (.xlsx)、扫描件图片或纯文本
              </p>
            </label>

            <div v-if="uploadedFileName" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">
                  项目名称（自动提取或手动校对）
                </label>
                <input
                  v-model="tenderTitle"
                  type="text"
                  placeholder="例如：某市人民医院医疗设备采购项目"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div class="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-blue-300 flex items-start gap-2">
                <CheckCircle2 class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>文件就绪，点击下方「启动 AI 深度解析」即可展开10步全流程实战推演。</span>
              </div>
            </div>
          </div>

          <!-- 3. Raw Text Paste -->
          <div v-else class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                项目名称 / 标段名称
              </label>
              <input
                v-model="tenderTitle"
                type="text"
                placeholder="例如：2026年智慧校园大数据综合管理平台项目"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                招标文件关键条款内容（建议包含：资格要求、否决条款、评分办法、技术要求）
              </label>
              <textarea
                v-model="tenderText"
                rows="8"
                placeholder="请粘贴招标文件全文或关键章节内容..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>
          </div>

          <div
            v-if="errorMsg"
            class="p-3 rounded-xl bg-red-950/40 border border-red-900/50 text-xs text-red-300 flex items-start gap-2"
          >
            <AlertCircle class="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{{ errorMsg }}</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div v-if="activeTab === 'upload' || activeTab === 'text'" class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 mt-4">
          <button
            @click="emit('close')"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            取消
          </button>

          <button
            @click="handleRunAnalysis"
            :disabled="isAnalyzing"
            class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 disabled:opacity-50 transition-all"
          >
            <template v-if="isAnalyzing">
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>{{ analysisPhase || 'AI 正在深度解析中...' }}</span>
            </template>
            <template v-else>
              <Sparkles class="w-4 h-4" />
              <span>启动 AI 全流程投标顾问剖析</span>
            </template>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
