<script setup lang="ts">
import { ref } from 'vue'
import { FileCode2, FolderTree, Terminal, ArrowRight, CheckCircle2, Play } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildCodingData, type CodingData, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<CodingData | null>(null)
const activeFile = ref(0)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '提取实验方法', desc: '从方案中解析方法 / 参数 / 依赖' },
  { title: '设计项目结构', desc: '数据 / 模型 / 训练评估分离' },
  { title: '生成 Python 代码', desc: '编写可运行的实验工程' },
  { title: '验证可运行', desc: '安装依赖并执行冒烟测试' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildCodingData(p)
  activeFile.value = 0
  const r = result.value
  stepLogs.value = [
    [`[coding] 已从实验方案中提取方法、超参数与依赖清单`],
    [`[coding] 项目结构设计完成：${r.files.length} 个模块（data / model / train-eval）`],
    [`[coding] 代码生成完成：${r.files.map((f) => f.name).join(' / ')}`],
    [`[coding] 依赖安装完成，冒烟测试通过，代码可运行`],
  ]
}

const LANG_BADGE: Record<string, string> = { python: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
</script>

<template>
  <NodeDemoShell
    badge="Coding Agent 节点 · 交互演示"
    title="代码生成 —— 自动生成实验代码"
    desc="把实验方案翻译成可运行的 Python 工程，并完成运行验证"
    accent="violet"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-xs font-semibold text-violet-700">
              <FileCode2 class="w-3.5 h-3.5" />
              代码生成完成
            </div>
            <h4 class="mt-3 text-xl font-extrabold text-slate-900">实验代码工程已就绪</h4>
            <p class="mt-1 text-sm text-slate-500">{{ result.files.length }} 个 Python 模块 · 已通过运行验证</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
            repo: nova-lab/experiment
          </span>
        </div>

        <!-- 文件 Tab + 代码 -->
        <div class="rounded-2xl border border-slate-200 overflow-hidden">
          <div class="flex items-center gap-1 bg-slate-50 border-b border-slate-200 px-2 pt-2">
            <button
              v-for="(f, i) in result.files"
              :key="f.name"
              @click="activeFile = i"
              class="flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-semibold transition-colors cursor-pointer"
              :class="activeFile === i ? 'bg-white border border-slate-200 border-b-white text-slate-900' : 'text-slate-400 hover:text-slate-600'"
            >
              <FileCode2 class="w-3.5 h-3.5" />
              {{ f.name }}
            </button>
          </div>
          <div class="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-300 text-[10px] font-mono">
            <span>{{ result.files[activeFile].desc }}</span>
            <span class="px-1.5 py-0.5 rounded border text-[9px]" :class="LANG_BADGE[result.files[activeFile].lang] ?? 'text-slate-300'">
              {{ result.files[activeFile].lang }}
            </span>
          </div>
          <pre
            class="bg-slate-950 text-slate-200 text-[11px] leading-relaxed p-4 overflow-x-auto max-h-[260px] font-mono"
          ><code>{{ result.files[activeFile].code }}</code></pre>
        </div>

        <!-- 模拟终端 -->
        <div class="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
            <span class="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span class="ml-2 text-[10px] font-mono text-slate-400">终端 · nova-agent</span>
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 ml-auto" />
          </div>
          <div class="px-4 py-3 font-mono text-[11px] text-slate-300 space-y-1">
            <div v-for="(line, i) in result.runLogs" :key="i" :class="line.startsWith('✓') ? 'text-emerald-400 font-bold' : ''">
              {{ line }}
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-violet-600/25 hover:from-violet-700 hover:to-purple-700 transition-all cursor-pointer"
          >
            <Play class="w-4 h-4 fill-current" />
            代码已就绪 → 开始实验复现
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
