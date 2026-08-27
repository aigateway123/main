<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileSpreadsheet, Sparkles, Play, Table, ChevronDown, ChevronUp, RefreshCw, Sliders, FileCheck2 } from 'lucide-vue-next'
import type { DatasetMeta } from '@/data/dataAgentData'
import { PRESET_DATASETS } from '@/data/dataAgentData'

const props = defineProps<{
  dataset: DatasetMeta
  goal: string
  isAnalyzing: boolean
  hasAnalyzed: boolean
}>()

const emit = defineEmits<{
  (e: 'select-dataset', ds: DatasetMeta): void
  (e: 'goal-change', goal: string): void
  (e: 'start-analysis'): void
}>()

const isDragging = ref(false)
const showPreview = ref(false)
const showGoalTemplates = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const GOAL_PRESETS = [
  '比较实验组 A、B、C 的性能差异，寻找异常样本，并生成适合论文使用的分析图表。',
  '检验优化催化体系在多温度梯度下的动力学差异，定位异常副反应离群样本。',
  '执行组间单因素方差分析 (ANOVA) 与 Tukey HSD 检验，生成 Nature 格式图表与 Results 报告。',
  "筛选高通量筛选 (HTS) 异常样本点，量化实验组 C 协同增效机理与效应量 Cohen's d。",
]

const buildCustomMeta = (file: File): DatasetMeta => ({
  id: `custom-${Date.now()}`,
  fileName: file.name,
  fileType: file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'xlsx',
  fileSize: `${Math.max(Number((file.size / 1024 / 1024).toFixed(1)), 0.1)} MB`,
  rowCount: props.dataset.rowCount,
  columnCount: props.dataset.columnCount,
  description: `用户自定义导入实验数据: ${file.name}`,
  uploadTime: new Date().toLocaleString('zh-CN', { hour12: false }),
  columns: props.dataset.columns,
  previewRows: props.dataset.previewRows,
})

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files?.length) {
    emit('select-dataset', buildCustomMeta(e.dataTransfer.files[0]))
  }
}

const onPickFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    emit('select-dataset', buildCustomMeta(input.files[0]))
    input.value = ''
  }
}

const previewKeys = computed(() => {
  const first = props.dataset.previewRows[0]
  return first ? Object.keys(first).filter((k) => k !== 'id') : []
})
</script>

<template>
  <section class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
    <!-- 顶部标题与预置数据切换 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
      <div>
        <div class="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">
          <Sparkles class="w-3.5 h-3.5" /> 数据输入与分析设定
        </div>
        <h2 class="text-lg font-bold text-white tracking-tight">实验数据导入与假设配置</h2>
        <p class="text-xs text-[#94a3b8] mt-0.5">
          支持 Excel (.xlsx, .xls) 与 CSV 格式，自动识别对照组设计、缺失值插补与异常检测
        </p>
      </div>

      <div class="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-[#1e293b] self-start md:self-auto">
        <span class="text-[10px] uppercase tracking-wider font-semibold text-[#64748b] px-2 py-1 flex items-center gap-1">
          <Sliders class="w-3 h-3 text-blue-400" /> 预置数据:
        </span>
        <button
          v-for="ds in PRESET_DATASETS"
          :key="ds.id"
          :disabled="isAnalyzing"
          class="px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer disabled:cursor-not-allowed"
          :class="dataset.id === ds.id
            ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/50'
            : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'"
          @click="emit('select-dataset', ds)"
        >
          {{ ds.fileName }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
      <!-- 左侧 / 文件拖放区 -->
      <div class="lg:col-span-6 flex flex-col">
        <input ref="fileInputRef" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onPickFile" />

        <div
          class="group relative flex-1 min-h-[180px] rounded-xl border border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
          :class="isDragging
            ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
            : 'border-[#1e293b] hover:border-blue-500/60 bg-black/40 hover:bg-black/60'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop="onDrop"
          @click="fileInputRef?.click()"
        >
          <div class="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <FileSpreadsheet class="w-5 h-5 text-blue-400" />
          </div>

          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
              拖入实验数据文件 或 点击选择
            </span>
            <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">.XLSX / .CSV</span>
          </div>

          <p class="text-[11px] text-[#64748b] max-w-sm mb-3">支持多组学特征、反应动力学矩阵与多张工作表</p>

          <div class="w-full bg-[#0f172a] rounded-lg border border-[#1e293b] px-3 py-2 flex items-center justify-between text-left">
            <div class="flex items-center gap-2.5 min-w-0">
              <FileCheck2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div class="truncate">
                <div class="text-xs font-mono font-medium text-white truncate">{{ dataset.fileName }}</div>
                <div class="text-[10px] text-[#64748b] font-mono">
                  {{ dataset.rowCount.toLocaleString() }} rows · {{ dataset.columnCount }} columns · {{ dataset.fileSize }}
                </div>
              </div>
            </div>
            <span class="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex-shrink-0">已就绪</span>
          </div>
        </div>
      </div>

      <!-- 右侧 / 分析目标与运行按钮 -->
      <div class="lg:col-span-6 flex flex-col justify-between space-y-4">
        <div class="bg-black/40 rounded-xl border border-[#1e293b] p-3.5">
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-[10px] uppercase font-bold text-blue-400 tracking-widest flex items-center gap-1.5">
              <Sparkles class="w-3 h-3 text-blue-400" /> Analysis Target (分析目标)
            </label>
            <button
              type="button"
              class="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              @click="showGoalTemplates = !showGoalTemplates"
            >
              {{ showGoalTemplates ? '收起预置目标' : '选择快捷目标' }}
              <ChevronUp v-if="showGoalTemplates" class="w-3 h-3" />
              <ChevronDown v-else class="w-3 h-3" />
            </button>
          </div>

          <div v-if="showGoalTemplates" class="mb-2 p-2 rounded-lg bg-[#0f172a] border border-[#1e293b] space-y-1 max-h-32 overflow-y-auto">
            <button
              v-for="(preset, idx) in GOAL_PRESETS"
              :key="idx"
              type="button"
              class="w-full text-left p-1.5 rounded text-[11px] text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] transition-colors flex items-start gap-1.5 cursor-pointer"
              @click="emit('goal-change', preset); showGoalTemplates = false"
            >
              <span class="text-blue-400 font-mono mt-0.5">{{ idx + 1 }}.</span>
              <span>{{ preset }}</span>
            </button>
          </div>

          <textarea
            :value="goal"
            rows="3"
            :disabled="isAnalyzing"
            class="w-full rounded-lg bg-[#0f172a] border border-[#1e293b] p-2.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed transition-all disabled:cursor-not-allowed"
            placeholder="请输入或调整科研分析目标..."
            @input="emit('goal-change', ($event.target as HTMLTextAreaElement).value)"
          />

          <div class="flex items-center justify-between mt-1 text-[10px] text-[#64748b]">
            <span>支持自然语言输入任意假设与检验维度</span>
            <span class="font-mono">{{ goal.length }} 字</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            :disabled="isAnalyzing"
            class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all shadow-lg cursor-pointer disabled:cursor-not-allowed"
            :class="isAnalyzing
              ? 'bg-[#1e293b] text-[#64748b] border border-[#334155]'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'"
            @click="emit('start-analysis')"
          >
            <template v-if="isAnalyzing">
              <RefreshCw class="w-4 h-4 animate-spin text-blue-400" />
              <span>AI Agent 正在分析中...</span>
            </template>
            <template v-else>
              <Play class="w-4 h-4 fill-current" />
              <span>{{ hasAnalyzed ? '重新开始分析' : '开始分析' }}</span>
            </template>
          </button>

          <button
            type="button"
            class="px-3.5 py-2.5 rounded-lg bg-black/40 hover:bg-[#1e293b] text-slate-300 hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="查看原始数据表格结构"
            @click="showPreview = !showPreview"
          >
            <Table class="w-4 h-4 text-blue-400" />
            <span class="hidden sm:inline">{{ showPreview ? '收起预览' : '数据预览' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 原始数据预览表格 -->
    <div v-if="showPreview" class="mt-4 pt-4 border-t border-[#1e293b] animate-in fade-in duration-200">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-white">原始数据切片 (前 {{ dataset.previewRows.length }} 行采样 / 共 {{ dataset.rowCount.toLocaleString() }} 行)</span>
          <span class="text-[10px] text-[#64748b] font-mono">{{ dataset.fileName }}</span>
        </div>
        <span class="text-[10px] text-[#64748b]">{{ dataset.columnCount }} 列字段已全部映射完毕</span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-[#1e293b] bg-black/40">
        <table class="w-full text-left text-xs font-mono">
          <thead>
            <tr class="bg-[#0f172a] border-b border-[#1e293b] text-[#94a3b8]">
              <th class="py-2 px-3">#</th>
              <th v-for="k in previewKeys" :key="k" class="py-2 px-3 text-blue-400">{{ k }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1e293b] text-[#cbd5e1]">
            <tr v-for="(row, i) in dataset.previewRows" :key="i" class="hover:bg-[#1e293b]/40"
              :class="row.Status === 'Anomaly' ? 'bg-red-500/10 text-red-300' : ''">
              <td class="py-2 px-3 text-[#64748b]">{{ i + 1 }}</td>
              <td v-for="k in previewKeys" :key="k" class="py-2 px-3">
                <span v-if="k === 'Group'" class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold"
                  :class="row.Group === 'Group A' ? 'bg-blue-950 text-blue-300' : row.Group === 'Group B' ? 'bg-indigo-950 text-indigo-300' : 'bg-emerald-950 text-emerald-300'">
                  {{ row[k] }}
                </span>
                <span v-else-if="k === 'Status'">
                  <span v-if="row.Status === 'Anomaly'" class="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">离群检测</span>
                  <span v-else class="text-[10px] text-emerald-400">有效</span>
                </span>
                <span v-else>{{ row[k] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
