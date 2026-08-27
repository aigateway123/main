<script setup lang="ts">
import { CalendarCheck, Code2, Play, FileSpreadsheet, Sliders, Zap } from 'lucide-vue-next'
import type { ResearchPaper } from '@/data/paper2codeData'

const props = defineProps<{ paper: ResearchPaper }>()

const emit = defineEmits<{
  (e: 'proceed-code'): void
  (e: 'run'): void
}>()

const hp = props.paper.experimentPlan.hyperparameters
const horizons = props.paper.experimentPlan.forecastHorizons.join(', ')
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6 text-slate-300">
    <!-- 头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161923] border border-white/10 rounded-2xl p-5 shadow-xl">
      <div>
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <CalendarCheck class="w-4 h-4" />
          </div>
          <h1 class="text-base font-bold text-white tracking-tight">实验计划与协议设计 (Experimental Plan & Protocol)</h1>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Agent 已根据论文 {{ paper.targetSection }} 结构化提取了完整基准协议、数据集划分、超参数矩阵及评测方案。
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="emit('proceed-code')"
          class="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Code2 class="w-3.5 h-3.5 text-cyan-400" />
          <span>查看工程代码</span>
        </button>
        <button
          @click="emit('run')"
          class="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Play class="w-3.5 h-3.5 fill-current" />
          <span>执行实验拟合</span>
        </button>
      </div>
    </div>

    <!-- 协议 + 超参 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左 2 列：目标表格结构 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <FileSpreadsheet class="w-4 h-4 text-cyan-400" />
              <h2 class="text-sm font-bold text-white">目标复现表格结构: {{ paper.experimentPlan.targetTable }}</h2>
            </div>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              Multivariate Setting
            </span>
          </div>

          <p class="text-xs text-slate-400 leading-relaxed">
            在 {{ paper.experimentPlan.datasets[0]?.name ?? 'Weather' }} 数据集上，针对预测步长 H ∈
            &#123;{{ horizons }}&#125; 进行多变量输入到多变量输出预测。评测指标为
            {{ paper.experimentPlan.metrics.join(' 与 ') }}。
          </p>

          <!-- 协议矩阵 -->
          <div class="border border-white/10 rounded-lg overflow-hidden text-xs">
            <div class="bg-white/5 px-3.5 py-2.5 text-slate-200 font-bold text-[11px] uppercase tracking-wider border-b border-white/10 flex justify-between">
              <span>实验评测配置维度</span>
              <span>协议规范</span>
            </div>
            <div class="divide-y divide-white/5 bg-black/30">
              <div class="px-3.5 py-2.5 flex justify-between items-center">
                <span class="text-slate-400">回看窗口 (Lookback Window L)</span>
                <span class="font-mono text-cyan-300 font-semibold">{{ hp.seq_len }} steps</span>
              </div>
              <div class="px-3.5 py-2.5 flex justify-between items-center">
                <span class="text-slate-400">预测步长集合 (Forecast Horizons H)</span>
                <span class="font-mono text-emerald-400 font-semibold">[{{ horizons }}]</span>
              </div>
              <div class="px-3.5 py-2.5 flex justify-between items-center">
                <span class="text-slate-400">基准对比方法 (Baselines)</span>
                <span class="text-slate-200">{{ paper.experimentPlan.baselines.filter((b) => !b.includes('Ours')).join(', ') }}</span>
              </div>
              <div class="px-3.5 py-2.5 flex justify-between items-center">
                <span class="text-slate-400">随机种子检验 (Multiple Seeds)</span>
                <span class="font-mono text-slate-200">Seeds = [2021, 2022, 2023] (3-Run Mean)</span>
              </div>
              <div class="px-3.5 py-2.5 flex justify-between items-center">
                <span class="text-slate-400">硬件与早停标准</span>
                <span class="text-slate-200">Patience = {{ hp.patience }} epochs on Validation Loss</span>
              </div>
            </div>
          </div>

          <!-- 执行脚本管线 -->
          <div class="bg-black/40 border border-white/5 rounded-lg p-3.5 text-xs text-slate-300">
            <div class="font-semibold text-cyan-300 mb-2 flex items-center gap-1.5">
              <Zap class="w-3.5 h-3.5 text-amber-400" />
              <span>自动执行脚本管线:</span>
            </div>
            <div class="font-mono text-[11px] text-slate-400 bg-black/60 p-3 rounded-lg border border-white/5 space-y-1">
              <div><span class="text-slate-500"># 1. 运行完整基准脚本</span></div>
              <div class="text-emerald-400">bash experiments/run_benchmark.sh</div>
              <div><span class="text-slate-500"># 2. 导出 Table 2 结果与 LaTeX</span></div>
              <div class="text-cyan-300">python results/generate_table.py --dataset Weather</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右列：超参数矩阵 -->
      <div class="space-y-4">
        <div class="bg-[#161923] border border-white/10 rounded-xl p-5 space-y-3 shadow-sm">
          <div class="flex items-center space-x-2">
            <Sliders class="w-4 h-4 text-emerald-400" />
            <h2 class="text-sm font-bold text-white">模型与训练超参数 (config.yaml)</h2>
          </div>

          <div class="space-y-2 text-xs">
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">Patch Length (P) / Stride (S)</span>
              <span class="font-mono text-white font-semibold">{{ hp.patch_len }} / {{ hp.stride }}</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">Model Dim / Heads / Layers</span>
              <span class="font-mono text-cyan-300 font-semibold">{{ hp.d_model }} / {{ hp.n_heads }} / {{ hp.e_layers }}</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">Learning Rate</span>
              <span class="font-mono text-emerald-400 font-semibold">{{ hp.learning_rate }}</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">Batch Size / Epochs</span>
              <span class="font-mono text-white font-semibold">{{ hp.batch_size }} / {{ hp.epochs }}</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">Optimizer / Scheduler</span>
              <span class="font-mono text-slate-300 font-semibold">{{ hp.optimizer }} ({{ hp.scheduler }})</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">Dropout Rate</span>
              <span class="font-mono text-amber-300 font-semibold">{{ hp.dropout }}</span>
            </div>
            <div class="bg-black/40 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span class="text-slate-400">RevIN Normalization</span>
              <span class="font-mono text-emerald-400 font-semibold">Enabled (Affine=True)</span>
            </div>
          </div>

          <div class="pt-2 text-[11px] text-slate-500">
            * 超参数可通过左侧科研监督智能体直接以自然语言修改（例如：“将初始学习率修改为 5e-4”）。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
