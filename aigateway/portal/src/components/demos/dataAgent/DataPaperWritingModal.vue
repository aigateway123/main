<script setup lang="ts">
import { ref } from 'vue'
import { FileText, X, Copy, Check, FileDown, Code, Layers, CheckCircle2 } from 'lucide-vue-next'
import { PAPER_DRAFT_TEXT, PAPER_LATEX_TEXT } from '@/data/dataAgentData'

withDefaults(
  defineProps<{
    open: boolean
    datasetName?: string
  }>(),
  { datasetName: 'experiment_result.xlsx' },
)

const emit = defineEmits<{ (e: 'close'): void }>()

const styleFormat = ref<'nature' | 'apa' | 'ieee'>('nature')
const language = ref<'zh' | 'en'>('zh')
const copiedType = ref<'latex' | 'md' | null>(null)

const currentContent = () => PAPER_DRAFT_TEXT[language.value]

const handleCopy = async (type: 'latex' | 'md') => {
  if (type === 'latex') {
    await navigator.clipboard.writeText(PAPER_LATEX_TEXT)
  } else {
    await navigator.clipboard.writeText(currentContent())
  }
  copiedType.value = type
  setTimeout(() => (copiedType.value = null), 2000)
}

const handleDownloadDoc = () => {
  const blob = new Blob([currentContent()], { type: 'text/markdown;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `Paper_Results_Draft_${styleFormat.value.toUpperCase()}_${language.value}.md`
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-[#050505]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div class="relative w-full max-w-5xl h-[90vh] bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <!-- 顶部栏 -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-[#1e293b] bg-black/40">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <FileText class="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-lg font-bold text-white tracking-tight">论文写作 (Paper Results Generator)</h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Ready to Publish</span>
              </div>
              <p class="text-xs text-[#94a3b8]">已根据 18.6 万条实验数据自动组织 SCI 顶刊 Results 标准章节与图表引用</p>
            </div>
          </div>
          <button class="w-8 h-8 rounded-lg bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] flex items-center justify-center transition-colors cursor-pointer"
            @click="emit('close')">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- 工具栏 -->
        <div class="px-5 py-3 border-b border-[#1e293b] bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-[#94a3b8] font-medium">期刊规范:</span>
            <button v-for="fmt in (['nature', 'apa', 'ieee'] as const)" :key="fmt"
              class="px-2.5 py-1 rounded uppercase font-mono transition-colors cursor-pointer"
              :class="styleFormat === fmt
                ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40'
                : 'text-[#64748b] hover:text-white bg-black/40 border border-[#1e293b]'"
              @click="styleFormat = fmt">{{ fmt }}</button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[#94a3b8] font-medium">语言:</span>
            <button class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
              :class="language === 'zh' ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-[#64748b] hover:text-white bg-black/40 border border-[#1e293b]'"
              @click="language = 'zh'">中文 (学术规范)</button>
            <button class="px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
              :class="language === 'en' ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40' : 'text-[#64748b] hover:text-white bg-black/40 border border-[#1e293b]'"
              @click="language = 'en'">English (SCI Format)</button>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 rounded bg-black/40 hover:bg-[#1e293b] text-slate-300 font-mono text-xs flex items-center gap-1.5 border border-[#1e293b] transition-colors cursor-pointer"
              @click="handleCopy('latex')">
              <template v-if="copiedType === 'latex'">
                <Check class="w-3.5 h-3.5 text-emerald-400" />
                <span class="text-emerald-400 font-bold">已复制 LaTeX</span>
              </template>
              <template v-else>
                <Code class="w-3.5 h-3.5 text-blue-400" />
                <span>复制 LaTeX 源码</span>
              </template>
            </button>
            <button class="px-3 py-1.5 rounded bg-black/40 hover:bg-[#1e293b] text-slate-300 font-mono text-xs flex items-center gap-1.5 border border-[#1e293b] transition-colors cursor-pointer"
              @click="handleCopy('md')">
              <template v-if="copiedType === 'md'">
                <Check class="w-3.5 h-3.5 text-emerald-400" />
                <span class="text-emerald-400 font-bold">已复制 MD</span>
              </template>
              <template v-else>
                <Copy class="w-3.5 h-3.5 text-blue-400" />
                <span>复制 Markdown</span>
              </template>
            </button>
            <button class="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="handleDownloadDoc">
              <FileDown class="w-3.5 h-3.5" />
              <span>下载文稿 (.md)</span>
            </button>
          </div>
        </div>

        <!-- 论文预览 -->
        <div class="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#050505] flex justify-center">
          <div class="w-full max-w-3xl bg-[#0f172a] rounded-xl border border-[#1e293b] p-6 sm:p-10 font-serif text-[#e2e8f0] leading-relaxed text-sm sm:text-base space-y-6">
            <div class="border-b border-[#1e293b] pb-4 flex items-center justify-between font-sans text-xs text-[#94a3b8]">
              <span class="font-mono uppercase tracking-wider text-blue-400">Manuscript Section: 3. Results &amp; Statistical Analysis</span>
              <span>Dataset: {{ datasetName }}</span>
            </div>

            <div class="space-y-4 text-[#e2e8f0]">
              <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">3. Results</h2>

              <h3 class="text-base sm:text-lg font-bold text-blue-300 mt-4">3.1 实验组性能对比与主效应显著性</h3>
              <p class="leading-relaxed text-justify">
                本次研究基于大规模高通量实验数据集（<span class="font-mono text-blue-400">N = 186,420</span>，涵盖 42 个物理、化学与动力学特征维度），在完成数据缺失值无偏链式插补（MICE 算法）与全域噪声清洗后，对三个平行对照实验组展开了系统的统计推断与性能评估（<span class="font-bold text-blue-400 cursor-pointer hover:underline">Figure 1A</span>）。
              </p>
              <p class="leading-relaxed text-justify">
                单因素方差分析（One-way ANOVA）结果表明，各实验组间存在极显著的统计学主效应差异（<span class="font-mono font-bold text-emerald-400">F(2, 186417) = 428.6, p &lt; 0.001</span>）。事后 Tukey's HSD 多重比对分析进一步证实，<strong class="text-white">实验组 C</strong> 展现出最优的性能水平（均值：<span class="font-mono text-white">91.2 ± 3.1</span>，95% CI: [90.5, 91.9]），相较基准实验组 A（均值：<span class="font-mono text-white">78.4 ± 4.8</span>，95% CI: [77.2, 79.6]）实现了净增 <span class="font-bold text-emerald-400 font-mono">+16.33%</span> 的性能跃升（效应量 Cohen's d = 3.18）。此外，实验组 B（84.7 ± 3.9）相较组 A 提升 8.04%（p &lt; 0.001），而组 C 相较组 B 仍有极其显著的梯次增强（p &lt; 0.0001，Cohen's d = 1.84）。
              </p>

              <h3 class="text-base sm:text-lg font-bold text-blue-300 mt-6">3.2 概率密度分布与反应动力学历程</h3>
              <p class="leading-relaxed text-justify">
                高斯核密度分布估计（<span class="font-bold text-blue-400 cursor-pointer hover:underline">Figure 1B</span>）表明，实验组 C 的概率密度峰型显著右移，且方差离散度相较组 A 缩窄约 35.4%（离散系数 CV = 3.4%），证实协同催化体系在大幅提升响应强度的同时抑制了工况波动。12 小时反应动力学时序曲线（<span class="font-bold text-blue-400 cursor-pointer hover:underline">Figure 1C</span>）显示，实验组 C 在前 4 小时内即展现出陡峭的活化速率，随后平稳收敛至高转化率稳态。
              </p>

              <h3 class="text-base sm:text-lg font-bold text-blue-300 mt-6">3.3 孤立森林异常检测与敏感性复核</h3>
              <p class="leading-relaxed text-justify">
                通过全局 Isolation Forest 孤立森林与 3-Sigma 边界联合扫描，在全量样本中共定位 23 个异常样本点（<span class="font-bold text-blue-400 cursor-pointer hover:underline">Figure 1D</span>），重点包括 <span class="font-mono text-red-400">Sample #12842</span>（瞬态超温 137℃）、<span class="font-mono text-red-400">Sample #45109</span>（产率骤降至 31.2%）以及 <span class="font-mono text-red-400">Sample #98231</span>（瞬态背压 7.84 MPa）。在剔除该部分离群样本后的敏感性重估检验中，组间核心差异与 F 统计量波动小于 0.3%，证明了本研究结论的极高稳健性与学术复现力。
              </p>
            </div>

            <div class="mt-8 p-4 rounded-xl bg-black/40 border border-[#1e293b] font-sans text-xs text-[#94a3b8] space-y-2">
              <div class="font-bold text-white flex items-center gap-1.5">
                <Layers class="w-4 h-4 text-blue-400" />
                <span>已绑定并交叉引用的学术图表清单</span>
              </div>
              <ul class="list-disc pl-5 space-y-1 font-mono text-[11px] text-[#cbd5e1]">
                <li>Fig. 1A: 实验组对比图 (Bar chart with error bars, n=62,140/group, p &lt; 0.001)</li>
                <li>Fig. 1B: 指标分布图 (Gaussian Kernel Density Estimation curves)</li>
                <li>Fig. 1C: 动力学时序趋势图 (Time-course kinetics from 0h to 12h)</li>
                <li>Fig. 1D: 异常值残差散点图 (Isolation Forest &amp; 3-Sigma envelope)</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="px-5 py-3 border-t border-[#1e293b] bg-black/40 flex items-center justify-between text-xs text-[#94a3b8]">
          <div class="flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            <span>符合《Nature》《Science》期刊实验结果 (Results) 章节写作规范</span>
          </div>
          <button class="px-4 py-1.5 rounded bg-black/40 hover:bg-[#1e293b] text-white font-medium border border-[#1e293b] transition-colors cursor-pointer"
            @click="emit('close')">完成</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
