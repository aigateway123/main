<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FolderOpen,
  FileCode,
  FileText,
  FileCog,
  Terminal,
  Copy,
  Check,
  Download,
  Sparkles,
  Search,
} from 'lucide-vue-next'
import type { GeneratedCodeFile, ResearchPaper } from '@/data/paper2codeData'

const props = defineProps<{
  paper: ResearchPaper
  activeFile: GeneratedCodeFile
  highlightFormula?: string | null
}>()

const emit = defineEmits<{
  (e: 'select-file', file: GeneratedCodeFile): void
  (e: 'download-zip'): void
}>()

const copied = ref(false)
const searchQuery = ref('')

const files = computed(() => props.paper.files)

const rootFiles = computed(() => files.value.filter((f) => f.folder === '/' || f.folder === ''))
const dataFiles = computed(() => files.value.filter((f) => f.folder === 'data'))
const modelFiles = computed(() => files.value.filter((f) => f.folder === 'models'))
const experimentFiles = computed(() => files.value.filter((f) => f.folder === 'experiments'))
const resultFiles = computed(() => files.value.filter((f) => f.folder === 'results'))

const filteredFiles = computed(() => {
  const q = searchQuery.value.trim()
  if (!q) return null
  return files.value.filter(
    (f) =>
      f.path.toLowerCase().includes(q.toLowerCase()) || f.purpose.toLowerCase().includes(q.toLowerCase()),
  )
})

const codeLines = computed(() => props.activeFile.content.split('\n'))

const isFormulaLine = (line: string) =>
  line.includes('Eq (') || line.includes('Formula:') || line.includes('Equation')

const isCommentLine = (line: string) => {
  const t = line.trim()
  return t.startsWith('#') || t.startsWith('//') || t.startsWith('"""') || t.startsWith('*')
}

const handleCopyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.activeFile.content)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* clipboard unavailable */
  }
}

const handleDownloadSingle = () => {
  const blob = new Blob([props.activeFile.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = props.activeFile.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const getFileIcon = (filename: string, _language: string) => {
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return FileCog
  if (filename.endsWith('.sh')) return Terminal
  if (filename.endsWith('.md')) return FileText
  return FileCode
}
</script>

<template>
  <div class="h-full flex flex-col bg-[#0A0B10] text-slate-300">
    <!-- Code Toolbar -->
    <div class="bg-[#0E1018] border-b border-white/5 px-4 py-2.5 flex items-center justify-between gap-3">
      <div class="flex items-center space-x-3 min-w-0">
        <div class="flex items-center space-x-2">
          <component :is="getFileIcon(activeFile.filename, activeFile.language)" class="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span class="font-mono text-xs font-semibold text-white truncate">{{ activeFile.path }}</span>
        </div>
        <span class="text-[11px] text-slate-500 hidden md:inline border-l border-white/10 pl-3 truncate">
          {{ activeFile.purpose }}
        </span>
      </div>

      <div class="flex items-center space-x-2 shrink-0">
        <span
          v-if="highlightFormula"
          class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono flex items-center gap-1.5 animate-pulse"
        >
          <Sparkles class="w-3 h-3 text-cyan-400" />
          定位公式: {{ highlightFormula }}
        </span>

        <button
          @click="handleCopyCode"
          class="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors cursor-pointer"
          title="复制代码到剪贴板"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
          <Copy v-else class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>

        <button
          @click="handleDownloadSingle"
          class="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors cursor-pointer"
          title="下载当前文件"
        >
          <Download class="w-3.5 h-3.5 text-slate-400" />
          <span class="hidden sm:inline">下载此文件</span>
        </button>

        <button
          @click="emit('download-zip')"
          class="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          title="下载完整工程代码包"
        >
          <Download class="w-3.5 h-3.5" />
          <span>打包项目 (ZIP)</span>
        </button>
      </div>
    </div>

    <!-- Main Split: Left File Explorer Tree & Right Code Editor View -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left File Tree Sidebar -->
      <div class="w-60 bg-[#0D0F16] border-r border-white/5 flex flex-col shrink-0">
        <!-- Search Box -->
        <div class="p-2 border-b border-white/5">
          <div class="relative">
            <Search class="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索项目文件..."
              class="w-full bg-[#0A0B10] border border-white/10 rounded-md pl-7 pr-2 py-1 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-2 space-y-1 text-xs font-mono">
          <div class="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2 py-1 flex items-center justify-between">
            <span>EXPLORER ({{ files.length }} FILES)</span>
          </div>

          <!-- Search results -->
          <div v-if="filteredFiles" class="space-y-0.5">
            <button
              v-for="file in filteredFiles"
              :key="file.path"
              @click="emit('select-file', file)"
              class="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
              :class="activeFile.path === file.path ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
            >
              <component :is="getFileIcon(file.filename, file.language)" class="w-3.5 h-3.5 shrink-0" />
              <span class="truncate">{{ file.path }}</span>
            </button>
          </div>

          <!-- Folder tree -->
          <div v-else class="space-y-2">
            <!-- Root files -->
            <div class="space-y-0.5">
              <button
                v-for="file in rootFiles"
                :key="file.path"
                @click="emit('select-file', file)"
                class="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
                :class="activeFile.path === file.path ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
              >
                <component :is="getFileIcon(file.filename, file.language)" class="w-3.5 h-3.5 shrink-0" />
                <span class="truncate">{{ file.filename }}</span>
              </button>
            </div>

            <!-- /data/ Folder -->
            <div v-if="dataFiles.length">
              <div class="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                <FolderOpen class="w-3.5 h-3.5 text-amber-400/80" />
                <span>data/</span>
              </div>
              <div class="pl-3 space-y-0.5 mt-0.5">
                <button
                  v-for="file in dataFiles"
                  :key="file.path"
                  @click="emit('select-file', file)"
                  class="w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors cursor-pointer"
                  :class="activeFile.path === file.path ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
                >
                  <component :is="getFileIcon(file.filename, file.language)" class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ file.filename }}</span>
                </button>
              </div>
            </div>

            <!-- /models/ Folder -->
            <div v-if="modelFiles.length">
              <div class="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                <FolderOpen class="w-3.5 h-3.5 text-cyan-400/80" />
                <span>models/</span>
              </div>
              <div class="pl-3 space-y-0.5 mt-0.5">
                <button
                  v-for="file in modelFiles"
                  :key="file.path"
                  @click="emit('select-file', file)"
                  class="w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors cursor-pointer"
                  :class="activeFile.path === file.path ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
                >
                  <component :is="getFileIcon(file.filename, file.language)" class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ file.filename }}</span>
                </button>
              </div>
            </div>

            <!-- /experiments/ Folder -->
            <div v-if="experimentFiles.length">
              <div class="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                <FolderOpen class="w-3.5 h-3.5 text-emerald-400/80" />
                <span>experiments/</span>
              </div>
              <div class="pl-3 space-y-0.5 mt-0.5">
                <button
                  v-for="file in experimentFiles"
                  :key="file.path"
                  @click="emit('select-file', file)"
                  class="w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors cursor-pointer"
                  :class="activeFile.path === file.path ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
                >
                  <component :is="getFileIcon(file.filename, file.language)" class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ file.filename }}</span>
                </button>
              </div>
            </div>

            <!-- /results/ Folder -->
            <div v-if="resultFiles.length">
              <div class="flex items-center space-x-1.5 px-1 py-0.5 text-slate-400 text-[11px]">
                <FolderOpen class="w-3.5 h-3.5 text-indigo-400/80" />
                <span>results/</span>
              </div>
              <div class="pl-3 space-y-0.5 mt-0.5">
                <button
                  v-for="file in resultFiles"
                  :key="file.path"
                  @click="emit('select-file', file)"
                  class="w-full flex items-center space-x-2 px-2 py-1 rounded-md text-left transition-colors cursor-pointer"
                  :class="activeFile.path === file.path ? 'bg-cyan-400/5 text-cyan-400 border-r-2 border-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
                >
                  <component :is="getFileIcon(file.filename, file.language)" class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ file.filename }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Code Content with Line Numbers -->
      <div class="flex-1 overflow-y-auto bg-[#0A0B10] p-4 font-mono text-xs leading-relaxed">
        <div class="table w-full">
          <div
            v-for="(line, idx) in codeLines"
            :key="idx"
            class="table-row hover:bg-white/[0.02]"
            :class="isFormulaLine(line) ? 'bg-cyan-950/30 text-cyan-200 border-l-2 border-cyan-400' : ''"
          >
            <span class="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px] w-10">{{ idx + 1 }}</span>
            <span
              class="table-cell whitespace-pre"
              :class="isFormulaLine(line)
                ? 'text-cyan-300 font-semibold'
                : isCommentLine(line)
                  ? 'text-slate-500 italic'
                  : 'text-slate-200'"
            >{{ line }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
