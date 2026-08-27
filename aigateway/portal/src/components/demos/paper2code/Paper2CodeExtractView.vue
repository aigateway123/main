<script setup lang="ts">
import { Binary, Database, Layers, ExternalLink, ArrowRight, Sparkles, BookMarked, CheckCircle2 } from 'lucide-vue-next'
import type { ResearchPaper } from '@/data/paper2codeData'

defineProps<{ paper: ResearchPaper }>()

const emit = defineEmits<{
  (e: 'navigate-code', path: string, formulaName: string): void
  (e: 'proceed-plan'): void
}>()
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6 text-slate-300">
    <!-- 顶部论文横幅 -->
    <div
      class="bg-gradient-to-br from-[#161923] via-[#0E1018] to-[#161923] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    >
      <div class="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div class="flex flex-wrap items-center gap-2 mb-3">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {{ paper.venue }} {{ paper.year }}
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
          {{ paper.domain }}
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <CheckCircle2 class="w-3 h-3" />
          方法与公式已提取
        </span>
      </div>

      <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">{{ paper.title }}</h1>
      <p class="text-xs sm:text-sm text-slate-400 mb-4">
        <span class="font-semibold text-slate-300">作者: </span>{{ paper.authors }}
      </p>

      <div class="bg-black/40 border border-white/5 rounded-xl p-4 text-xs leading-relaxed text-slate-300 font-sans">
        <div class="font-semibold text-cyan-300 mb-1.5 flex items-center gap-1.5">
          <BookMarked class="w-3.5 h-3.5" />
          <span>Abstract (论文摘要提取):</span>
        </div>
        {{ paper.abstract }}
      </div>
    </div>

    <!-- 复现指令目标 -->
    <div class="bg-[#161923] border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-cyan-950/20">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
          <Sparkles class="w-4 h-4" />
        </div>
        <div>
          <div class="text-xs font-bold text-cyan-300 uppercase tracking-wide">博士生复现指令目标 (Target Objective):</div>
          <div class="text-sm font-semibold text-white mt-0.5">“{{ paper.targetGoal }}”</div>
          <div class="text-xs text-slate-400 mt-1">
            目标章节: <span class="text-cyan-300 font-mono">{{ paper.targetSection }}</span>
          </div>
        </div>
      </div>

      <button
        @click="emit('proceed-plan')"
        class="self-start sm:self-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <span>查看实验规划</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- 公式映射 & 数据要求 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左 2 列：数学公式与代码映射 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-white flex items-center gap-2">
            <Binary class="w-4 h-4 text-cyan-400" />
            <span>提取数学公式与模型层映射 (Formula-to-Code Traceability)</span>
          </h2>
          <span class="text-xs text-slate-400 font-mono">{{ paper.mathFormulas.length }} 个核心公式已对齐</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="(formula, idx) in paper.mathFormulas"
            :key="formula.id"
            class="bg-[#161923] border border-white/10 hover:border-cyan-500/40 rounded-xl p-4 transition-all group shadow-sm"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold flex items-center justify-center font-mono">
                  {{ idx + 1 }}
                </span>
                <span class="font-semibold text-xs text-white">{{ formula.name }}</span>
              </div>
              <button
                @click="emit('navigate-code', formula.codeMapping.split(':')[0], formula.name)"
                class="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono bg-black/40 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-500/40 transition-colors cursor-pointer"
                title="在代码编辑器中定位此公式实现"
              >
                <span>{{ formula.codeMapping }}</span>
                <ExternalLink class="w-3 h-3" />
              </button>
            </div>

            <div class="bg-black/50 border border-white/5 rounded-lg p-3 my-2 font-mono text-xs text-cyan-200/90 overflow-x-auto">
              <code>{{ formula.latex }}</code>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed">{{ formula.description }}</p>
          </div>
        </div>
      </div>

      <!-- 右列：数据要求与切分规范 -->
      <div class="space-y-4">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <Database class="w-4 h-4 text-emerald-400" />
          <span>数据要求与切分规范</span>
        </h2>

        <div class="bg-[#161923] border border-white/10 rounded-xl p-4 space-y-3 text-xs shadow-sm">
          <div v-for="(ds, i) in paper.experimentPlan.datasets" :key="i" class="pb-3 border-b border-white/5 last:border-0 last:pb-0">
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-white text-xs">{{ ds.name }} 数据集</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-white/5 font-mono">{{ ds.features }} 维特征</span>
            </div>
            <div class="text-[11px] text-slate-400 mb-1.5">
              切分比例: <span class="text-slate-200 font-mono">{{ ds.split }}</span> · 采样率: <span class="text-slate-200">{{ ds.sampleRate }}</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-normal">{{ ds.description }}</p>
          </div>

          <div class="pt-2.5 border-t border-white/5">
            <div class="font-semibold text-slate-300 mb-1.5">标准化与防漂移策略:</div>
            <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>可逆实例归一化 (RevIN with learnable affine parameters)</li>
              <li>滑动窗口步长: 8, 回看窗口 L: 336 步</li>
              <li>预测步长集合 H: [96, 192, 336, 720]</li>
            </ul>
          </div>
        </div>

        <!-- 基准模型 -->
        <div class="bg-[#161923] border border-white/10 rounded-xl p-4 text-xs shadow-sm">
          <h3 class="font-bold text-white mb-2.5 flex items-center gap-1.5">
            <Layers class="w-3.5 h-3.5 text-indigo-400" />
            <span>对比基准模型 (Baselines):</span>
          </h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(b, i) in paper.experimentPlan.baselines"
              :key="i"
              class="px-2 py-1 rounded-md text-[11px] font-medium border"
              :class="b.includes('Ours') || b.includes('PatchTST') || b.includes('NodeFormer')
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-semibold'
                : 'bg-white/5 text-slate-300 border-white/10'"
            >
              {{ b }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
