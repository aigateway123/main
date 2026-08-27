<script setup lang="ts">
import { Sparkles, GitCompare, AlertCircle, CheckCircle2, Award } from 'lucide-vue-next'
</script>

<template>
  <section class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
      <div>
        <h3 class="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">AI 科研洞察 (AI Insights)</h3>
        <p class="text-xs text-[#94a3b8] mt-0.5 pl-3">深度学习与统计推断提炼的学术结论与关键发现</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5">
          <CheckCircle2 class="w-3.5 h-3.5 text-blue-400" /> 置信度 99.9% (p &lt; 0.001)
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <!-- 洞察 1 -->
      <div class="rounded-xl bg-black/40 border border-[#1e293b] p-4 flex flex-col justify-between hover:border-slate-700 transition-all group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              <Award class="w-3 h-3" /> 核心性能突破
            </span>
            <span class="text-xs font-mono text-emerald-400 font-bold">+16.3%</span>
          </div>
          <blockquote class="text-sm font-semibold text-white leading-snug border-l-2 border-emerald-400 pl-3 py-0.5 mb-2.5">
            “实验组 C 的平均性能最高，相较实验组 A 提升约 <span class="text-white font-bold">16.3%</span>。”
          </blockquote>
          <p class="text-xs text-[#94a3b8] leading-relaxed">
            实验组 C 均值达到 <strong class="text-white">91.2 ± 3.1</strong>（组 A 为 78.4 ± 4.8）。在 95% 置信区间 [90.5, 91.9] 下，其协同催化强化机制显著突破了原有基线极限，且方差稳定性同步提升 35.4%。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>效应量 Cohen's d = 3.18</span>
          <span class="text-emerald-400 font-semibold">极强效应</span>
        </div>
      </div>

      <!-- 洞察 2 -->
      <div class="rounded-xl bg-black/40 border border-[#1e293b] p-4 flex flex-col justify-between hover:border-slate-700 transition-all group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              <GitCompare class="w-3 h-3" /> 组间差异显著
            </span>
            <span class="text-xs font-mono text-blue-400 font-bold">Δ = 6.5</span>
          </div>
          <blockquote class="text-sm font-semibold text-white leading-snug border-l-2 border-blue-400 pl-3 py-0.5 mb-2.5">
            “实验组 B 与 C 之间存在明显性能差异。”
          </blockquote>
          <p class="text-xs text-[#94a3b8] leading-relaxed">
            事后 Tukey HSD 检验显示，即使组 B（84.7）已较基线显著优化，组 C 仍实现统计学极显著超越（p &lt; 0.0001），证实强化协同并不等同于单一变量的简单线性叠加。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>Tukey q = 14.82</span>
          <span class="text-blue-400 font-semibold">p &lt; 0.001 ***</span>
        </div>
      </div>

      <!-- 洞察 3 -->
      <div class="rounded-xl bg-black/40 border border-[#1e293b] p-4 flex flex-col justify-between hover:border-slate-700 transition-all group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
              <AlertCircle class="w-3 h-3" /> 质量审计建议
            </span>
            <span class="text-xs font-mono text-red-400 font-bold">3 Samples</span>
          </div>
          <blockquote class="text-sm font-semibold text-white leading-snug border-l-2 border-red-400 pl-3 py-0.5 mb-2.5">
            “数据中发现 3 个潜在异常样本，建议进一步复核。”
          </blockquote>
          <p class="text-xs text-[#94a3b8] leading-relaxed">
            孤立森林模型定位了 3 处高维特征离群点（包含热电偶漂移与瞬态压力冲击）。在模拟剔除后，主要组间效应量波动低于 0.3%，论证了结论的高度稳健性。
          </p>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
          <span>异常率 = 0.012%</span>
          <span class="text-red-400 font-semibold">建议一键隔离</span>
        </div>
      </div>
    </div>
  </section>
</template>
