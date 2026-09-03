<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 导出选品决策报告弹窗
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/modals/ExportReportModal.tsx
// props: open / productName —— emits: close
// （原型 canvas-confetti 已替换为 EcomConfettiLayer，零依赖）
// ============================================================================
import { ref, watch } from 'vue'
import { X, FileDown, Sparkles, Download } from 'lucide-vue-next'
import EcomConfettiLayer from './EcomConfettiLayer.vue'

type ExportFormat = 'pdf' | 'excel' | 'docx'

const props = withDefaults(
  defineProps<{
    open: boolean
    productName?: string
  }>(),
  { productName: 'Smart Pet Water Bottle' },
)

const emit = defineEmits<{ (e: 'close'): void }>()

const selectedFormat = ref<ExportFormat>('pdf')
const isExporting = ref(false)
const downloadReady = ref(false)
const celebrate = ref(false)

// 每次打开重置状态
watch(
  () => props.open,
  (v) => {
    if (v) {
      selectedFormat.value = 'pdf'
      isExporting.value = false
      downloadReady.value = false
      celebrate.value = false
    }
  },
)

const formatOptions: { id: ExportFormat; label: string; desc: string }[] = [
  { id: 'pdf', label: 'PDF 综合报告', desc: '排版精美/适合汇报' },
  { id: 'excel', label: 'Excel 财务模型', desc: '包含完整算利公式' },
  { id: 'docx', label: 'Listing 文案包', desc: '英文标题与五点' },
]

const handleExport = () => {
  isExporting.value = true
  setTimeout(() => {
    isExporting.value = false
    downloadReady.value = true
    celebrate.value = true
  }, 1200)
}

const handleDownload = () => {
  const content = `==========================================================\nXX AI · 跨境电商选品情报员立项深度调研报告\n产品名称: ${props.productName}\n分析市场: 美国 Amazon\n机会评分: 92 / 100\n预计毛利率: 42.5%\n==========================================================\n\n一、市场大盘与需求\n- 12个月搜索增长: +38.4%\n- 核心需求: 防漏 + 易清洗 + 大容量便携\n\n二、竞品与痛点分析\n- 主要竞品: 38款\n- 头号痛点: 28% 集中漏水差评\n\n三、AI 差异化设计方案\n1. 360°防漏硅胶密封\n2. 600ml大容量加量设计\n3. 全可拆卸水仓\n4. 单手按键出水与回流\n\n四、财务模型\n- 售价: $19.99\n- 采购: $4.80\n- 物流: $3.20\n- 平台: $3.50\n- 单件净利润: $8.49\n\n五、AI 决策结论: 强烈推荐进入打样与产品验证阶段！\n`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `XX-AI-Selection-Report-${props.productName.replace(/\s+/g, '-')}.${selectedFormat.value === 'excel' ? 'csv' : 'txt'}`
  link.click()
  URL.revokeObjectURL(url)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-xs">
        <!-- Header -->
        <div class="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 min-w-0">
            <FileDown class="w-5 h-5 text-indigo-400 shrink-0" />
            <h3 class="text-base font-bold text-white">导出选品决策与立项调研报告</h3>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            @click="emit('close')"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5">
          <p class="text-xs text-slate-300 leading-relaxed">
            将为您导出包含 <span class="text-white font-bold">{{ productName }}</span> 的市场趋势、竞品矩阵、痛点词频、差异化开模方案、动态利润测算模型与完整 Listing。
          </p>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-300">选择导出格式与报告类型</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="f in formatOptions"
                :key="f.id"
                type="button"
                class="p-3 rounded-xl border text-left transition cursor-pointer"
                :class="
                  selectedFormat === f.id
                    ? 'bg-indigo-950 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                "
                @click="selectedFormat = f.id"
              >
                <div class="font-bold text-xs">{{ f.label }}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">{{ f.desc }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold cursor-pointer"
            @click="emit('close')"
          >
            取消
          </button>

          <button
            v-if="!downloadReady"
            type="button"
            :disabled="isExporting"
            class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            @click="handleExport"
          >
            <Sparkles class="w-3.5 h-3.5" :class="isExporting ? 'animate-spin' : ''" />
            <span>{{ isExporting ? '正在打包报告...' : '生成并下载报告' }}</span>
          </button>

          <button
            v-else
            type="button"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            @click="handleDownload"
          >
            <Download class="w-3.5 h-3.5" />
            <span>立即保存文件到本地</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- 报告就绪庆祝礼花（替代原型 canvas-confetti） -->
  <EcomConfettiLayer :trigger="celebrate" @done="celebrate = false" />
</template>
