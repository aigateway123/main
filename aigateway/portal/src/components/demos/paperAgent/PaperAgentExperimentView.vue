<script setup lang="ts">
import { ref } from 'vue'
import {
  Sparkles,
  CheckCircle2,
  Database,
  TrendingUp,
  BarChart3,
  Table as TableIcon,
  FileText,
  Sliders,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-vue-next'
import type { ExperimentProject } from '@/data/paperAgentData'
import ScientificFigure1 from './ScientificFigures.vue'
import Figure2Heatmap from './Figure2Heatmap.vue'

defineProps<{
  experiment: ExperimentProject
  isGenerating: boolean
  hasGeneratedPaper: boolean
}>()

const emit = defineEmits<{ (e: 'generate-paper'): void; (e: 'view-paper'): void }>()

const activeTab = ref<'overview' | 'figures' | 'baselines' | 'parameters'>('overview')

const readyAssets = [
  { label: '实验结果', sub: 'MAE 14.28 kW (提升 21.4%)' },
  { label: 'Figure 1', sub: '24小时负荷预测拟合曲线' },
  { label: 'Figure 2', sub: '时空交叉注意力热力图' },
  { label: 'Table 1', sub: '数据集特征与超参数表' },
  { label: 'Table 2', sub: '基准算法对比性能评测' },
]

const tabItems = [
  { id: 'overview' as const, label: '核心结论与发现', icon: TrendingUp },
  { id: 'figures' as const, label: '实验图表 (Figure 1 & 2)', icon: BarChart3 },
  { id: 'baselines' as const, label: '基准模型对比 (Table 2)', icon: TableIcon },
  { id: 'parameters' as const, label: '模型与实验参数 (Table 1)', icon: Sliders },
]
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Top Banner Card: Project Identity -->
    <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 relative overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="max-w-3xl space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-lg flex items-center gap-1.5">
              <Database class="w-3.5 h-3.5" />
              <span>预置科研实验项目</span>
            </span>
            <span class="px-2.5 py-1 text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 rounded-lg">{{ experiment.domain }}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{{ experiment.title }}</h1>
          <p class="text-sm text-slate-300 leading-relaxed">{{ experiment.objective }}</p>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-slate-400 font-mono">
            <span>数据规模: {{ experiment.datasetSize }}</span>
            <span>•</span>
            <span>基准数据集: {{ experiment.datasetName }}</span>
          </div>
        </div>

        <!-- Quick Action Box -->
        <div class="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
          <button
            @click="emit('generate-paper')"
            :disabled="isGenerating"
            class="w-full px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <Sparkles class="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>{{ hasGeneratedPaper ? '重新生成论文' : '生成论文 (Generate Paper)' }}</span>
          </button>

          <button
            v-if="hasGeneratedPaper"
            @click="emit('view-paper')"
            class="w-full px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <FileText class="w-4 h-4 text-blue-400" />
            <span>进入论文正文查看</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Ready Assets Checklist bar from Prompt -->
      <div class="relative z-10 mt-6 pt-5 border-t border-slate-800/80">
        <div class="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
          <CheckCircle2 class="w-4 h-4 text-emerald-400" />
          <span>已就绪实验资产 (准备用于 AI 论文生成)</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <div v-for="(item, idx) in readyAssets" :key="idx" class="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-2.5 flex items-start gap-2 shadow-inner">
            <div class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">✓</div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-slate-200 truncate">{{ item.label }}</div>
              <div class="text-[10px] text-slate-400 truncate">{{ item.sub }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(metric, idx) in experiment.metrics" :key="idx" class="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md text-slate-100 hover:border-slate-700 transition">
        <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span class="truncate">{{ metric.name }}</span>
          <span v-if="metric.improvement" class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">{{ metric.improvement }}</span>
        </div>
        <div class="flex items-baseline gap-1.5 my-1">
          <span class="text-2xl sm:text-3xl font-extrabold font-mono text-white">{{ metric.value }}</span>
          <span v-if="metric.unit" class="text-xs font-medium text-slate-400 font-mono">{{ metric.unit }}</span>
        </div>
        <p class="text-[11px] text-slate-400 leading-tight">{{ metric.description }}</p>
      </div>
    </div>

    <!-- Tabs for Deep Data Exploration -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <!-- Navigation Tab Bar -->
      <div class="flex items-center gap-1 p-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
            activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`"
        >
          <component :is="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Contents -->
      <div class="p-6">
        <!-- Overview -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div>
            <h3 class="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Flame class="w-4 h-4 text-amber-400" />
              <span>AI 提炼的核心实验结论与科研发现</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div v-for="(finding, idx) in experiment.keyFindings" :key="idx" class="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3 hover:border-slate-700 transition">
                <span class="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center font-mono font-bold flex-shrink-0 text-[11px]">0{{ idx + 1 }}</span>
                <span>{{ finding }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Peek of Figure 1 -->
          <div>
            <h3 class="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <BarChart3 class="w-4 h-4 text-cyan-400" />
              <span>实验结果拟合效果预览 (Figure 1 24小时负荷曲线)</span>
            </h3>
            <ScientificFigure1 :show-confidence-interval="true" />
          </div>
        </div>

        <!-- Figures -->
        <div v-else-if="activeTab === 'figures'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ScientificFigure1 :show-confidence-interval="true" />
            <p class="mt-2 text-xs text-slate-400 italic">{{ experiment.figures[0]?.caption }}</p>
          </div>
          <div>
            <Figure2Heatmap />
            <p class="mt-2 text-xs text-slate-400 italic">{{ experiment.figures[1]?.caption }}</p>
          </div>
        </div>

        <!-- Baselines -->
        <div v-else-if="activeTab === 'baselines'" class="space-y-4">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 font-semibold">Table 2. UrbanEV-ChargeBench 上的定量基准模型评测</span>
            <span class="text-slate-400 font-mono text-[11px]">评测机制: 5折交叉验证 (5-Fold Cross Validation)</span>
          </div>

          <div class="overflow-x-auto border border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3">模型架构 (Model)</th>
                  <th class="px-4 py-3">MAE (kW) ↓</th>
                  <th class="px-4 py-3">RMSE (kW) ↓</th>
                  <th class="px-4 py-3">MAPE (%) ↓</th>
                  <th class="px-4 py-3">推理时延 (ms)</th>
                  <th class="px-4 py-3">统计显著性 (p-value)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 font-mono">
                <tr v-for="(b, idx) in experiment.baselines" :key="idx" :class="b.isOurs ? 'bg-blue-950/40 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800/40'">
                  <td class="px-4 py-3 font-sans flex items-center gap-2">
                    <span>{{ b.model }}</span>
                    <span v-if="b.isOurs" class="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded">本文提出 (Ours)</span>
                  </td>
                  <td class="px-4 py-3">{{ b.mae.toFixed(2) }}</td>
                  <td class="px-4 py-3">{{ b.rmse.toFixed(2) }}</td>
                  <td class="px-4 py-3">{{ b.mape.toFixed(2) }}%</td>
                  <td class="px-4 py-3">{{ b.inferenceTimeMs.toFixed(1) }} ms</td>
                  <td class="px-4 py-3 text-slate-400">{{ b.pValVsOurs }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Parameters -->
        <div v-else class="space-y-4">
          <div class="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <Zap class="w-3.5 h-3.5 text-amber-400" />
            <span>Table 1. 实验配置与网络超参数表</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="(param, idx) in experiment.parameters" :key="idx" class="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs flex flex-col justify-between">
              <span class="text-slate-400 font-mono text-[11px] mb-1">{{ param.key }}</span>
              <span class="text-slate-100 font-medium">{{ param.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
