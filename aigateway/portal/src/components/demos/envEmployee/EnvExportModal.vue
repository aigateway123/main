<script setup lang="ts">
// 转译自原型 ExportModal.tsx —— 员工工作台「一键生成与导出交付成果」弹窗
// 注：原型使用 canvas-confetti；portal 无该依赖，以轻量 CSS 粒子替代动画。
import { ref } from 'vue'
import { X, Download, FileText, FileSpreadsheet, Check, ShieldCheck, Copy } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  reportTitle: string
  agentName: string
  companyName: string
  summaryText: string
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

type ExportFormat = 'pdf' | 'docx' | 'xlsx'
const selectedFormat = ref<ExportFormat>('pdf')
const isExporting = ref(false)
const isExported = ref(false)
const copiedLink = ref(false)
const confettiPieces = ref<{ id: number; left: string; delay: string; color: string }[]>([])

const CONFETTI_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b', '#8b5cf6']

const handleExport = () => {
  if (isExporting.value) return
  isExporting.value = true
  isExported.value = false
  setTimeout(() => {
    isExporting.value = false
    isExported.value = true
    // 简易 confetti：一次性生成 60 个粒子
    const pieces = []
    for (let i = 0; i < 60; i++) {
      pieces.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.45}s`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })
    }
    confettiPieces.value = pieces
    setTimeout(() => (confettiPieces.value = []), 2600)
  }, 1200)
}

const handleCopyLink = () => {
  copiedLink.value = true
  setTimeout(() => (copiedLink.value = false), 2000)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      >
        <div class="relative w-full max-w-2xl bg-[#0F1218] border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
          <!-- Confetti 粒子层 -->
          <div v-if="confettiPieces.length" class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <div
              v-for="p in confettiPieces"
              :key="p.id"
              class="env-confetti-piece"
              :style="{ left: p.left, background: p.color, animationDelay: p.delay }"
            />
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0C10]">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Download class="w-4 h-4" />
              </div>
              <div>
                <h2 class="text-sm font-bold text-white">一键生成与导出交付成果</h2>
                <p class="text-xs text-slate-400">由 {{ agentName }} 依据国家与行业技术规范自动排版生成</p>
              </div>
            </div>
            <button @click="emit('close')" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <!-- Document Preview Card -->
            <div class="p-4 rounded-xl bg-[#0A0C10] border border-slate-800 space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {{ agentName }} · 结构化交付成果
                  </span>
                  <h3 class="text-sm font-bold text-white mt-1.5">{{ reportTitle }}</h3>
                  <p class="text-xs text-slate-400 mt-0.5">对象企业：{{ companyName }}</p>
                </div>
                <div class="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-mono">
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>AI 校验完成</span>
                </div>
              </div>
              <p class="text-xs text-slate-300 bg-[#0F1218] p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
                {{ summaryText }}
              </p>
            </div>

            <!-- Export Format Selector -->
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">选择导出格式与交付载体：</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  @click="selectedFormat = 'pdf'"
                  :class="[
                    'p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                    selectedFormat === 'pdf'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:bg-slate-800/60',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <FileText class="w-5 h-5 text-rose-400" />
                    <Check v-if="selectedFormat === 'pdf'" class="w-4 h-4 text-emerald-400" />
                  </div>
                  <div class="mt-2">
                    <div class="text-xs font-bold text-white">标准 PDF 报告</div>
                    <div class="text-[10px] text-slate-400">带封面、目录与骑缝章</div>
                  </div>
                </button>
                <button
                  @click="selectedFormat = 'docx'"
                  :class="[
                    'p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                    selectedFormat === 'docx'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:bg-slate-800/60',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <FileText class="w-5 h-5 text-blue-400" />
                    <Check v-if="selectedFormat === 'docx'" class="w-4 h-4 text-emerald-400" />
                  </div>
                  <div class="mt-2">
                    <div class="text-xs font-bold text-white">Word (DOCX) 可编辑</div>
                    <div class="text-[10px] text-slate-400">方便工程师微调定稿</div>
                  </div>
                </button>
                <button
                  @click="selectedFormat = 'xlsx'"
                  :class="[
                    'p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                    selectedFormat === 'xlsx'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0A0C10] border-slate-800 text-slate-400 hover:bg-slate-800/60',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <FileSpreadsheet class="w-5 h-5 text-emerald-400" />
                    <Check v-if="selectedFormat === 'xlsx'" class="w-4 h-4 text-emerald-400" />
                  </div>
                  <div class="mt-2">
                    <div class="text-xs font-bold text-white">Excel 核算底稿表</div>
                    <div class="text-[10px] text-slate-400">含公式与时序台账明细</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Professional Compliance Notice -->
            <div class="p-3 rounded-lg bg-[#0A0C10] border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <span class="font-bold flex-shrink-0 font-mono">⚠️ 合规提示：</span>
              <span>AI 辅助核算与编制成果已严格对标国家标准规范，最终用于生态环境主管部门正式申报或法律审计前，建议由注册环保工程师复核签署。</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0A0C10]">
            <button
              @click="handleCopyLink"
              class="px-3 py-2 rounded-lg bg-[#0F1218] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check v-if="copiedLink" class="w-4 h-4 text-emerald-400" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copiedLink ? '已复制分享专属链接' : '复制在线协作链接' }}</span>
            </button>

            <div class="flex items-center gap-3">
              <button @click="emit('close')" class="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer">关闭</button>
              <button
                @click="handleExport"
                :disabled="isExporting"
                class="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-70"
              >
                <template v-if="isExporting">
                  <div class="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>正在渲染打包...</span>
                </template>
                <template v-else-if="isExported">
                  <Check class="w-4 h-4" />
                  <span>已成功下载成果包</span>
                </template>
                <template v-else>
                  <Download class="w-4 h-4" />
                  <span>立即导出 {{ selectedFormat.toUpperCase() }}</span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.env-confetti-piece {
  position: absolute;
  top: -12px;
  width: 8px;
  height: 12px;
  border-radius: 2px;
  animation: env-confetti-fall 1.6s ease-in forwards;
}
@keyframes env-confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(480px) rotate(540deg);
    opacity: 0;
  }
}
</style>
