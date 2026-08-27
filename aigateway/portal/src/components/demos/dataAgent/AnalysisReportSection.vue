<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Copy, Check, ArrowRight, FileEdit, CheckCircle2, Award, BarChart, ShieldCheck, Activity, Layers } from 'lucide-vue-next'
import { REPORT_SECTIONS } from '@/data/dataAgentData'

const emit = defineEmits<{ (e: 'open-paper'): void }>()

const copied = ref(false)
const activeTab = ref<string>('all')

const copyFullReport = async () => {
  let text = `# 科研数据分析完整学术报告\n\n`
  REPORT_SECTIONS.forEach((sec) => {
    text += `## ${sec.number}、${sec.title}\n`
    text += `**摘要**：${sec.summary}\n\n`
    sec.content.forEach((p) => {
      text += `- ${p}\n`
    })
    if (sec.keyMetrics) {
      text += `\n关键指标：` + sec.keyMetrics.map((m) => `${m.label}: ${m.value} (${m.note || ''})`).join(' | ') + `\n`
    }
    text += `\n---\n\n`
  })
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const getSectionIcon = (num: string) => {
  switch (num) {
    case '一': return Layers
    case '二': return ShieldCheck
    case '三': return BarChart
    case '四': return Activity
    case '五': return CheckCircle2
    case '六': return Award
    default: return FileText
  }
}
</script>

<template>
  <section class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1e293b]">
      <div>
        <h3 class="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">学术级完整分析报告 (Research Analysis Report)</h3>
        <p class="text-xs text-[#94a3b8] mt-0.5 pl-3">涵盖数据概况、质量校验、实验组对比、异常分析、统计检验与科研结论六大维度</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          class="px-3 py-2 rounded bg-black/40 hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="复制完整 Markdown 报告文本"
          @click="copyFullReport"
        >
          <template v-if="copied">
            <Check class="w-3.5 h-3.5 text-emerald-400" />
            <span class="text-emerald-400 font-bold">已复制全文</span>
          </template>
          <template v-else>
            <Copy class="w-3.5 h-3.5" />
            <span>复制完整报告</span>
          </template>
        </button>

        <button
          class="py-2 px-4 bg-white text-black font-bold text-xs rounded hover:bg-blue-50 transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
          @click="emit('open-paper')"
        >
          <FileEdit class="w-3.5 h-3.5 text-black" />
          <span>生成 Results</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <div class="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-[#1e293b] text-xs">
      <button
        class="px-3 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
        :class="activeTab === 'all' ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40' : 'text-[#64748b] hover:text-white'"
        @click="activeTab = 'all'"
      >全部 6 章节</button>
      <button v-for="sec in REPORT_SECTIONS" :key="sec.id"
        class="px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer"
        :class="activeTab === sec.id ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40' : 'text-[#64748b] hover:text-white'"
        @click="activeTab = sec.id"
      >{{ sec.number }}、{{ sec.title }}</button>
    </div>

    <div class="space-y-4 mt-5">
      <div v-for="section in REPORT_SECTIONS.filter((sec) => activeTab === 'all' || sec.id === activeTab)" :key="section.id"
        class="rounded-xl bg-black/40 border border-[#1e293b] p-4 sm:p-5 hover:border-slate-700 transition-all">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
              <component :is="getSectionIcon(section.number)" class="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h4 class="text-sm font-bold text-white">{{ section.number }}、{{ section.title }}</h4>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Ready</span>
        </div>

        <div class="bg-[#0f172a] rounded-lg p-2.5 border border-[#1e293b] text-xs text-[#cbd5e1] mb-3">
          <span class="font-semibold text-blue-400">章节摘要：</span>{{ section.summary }}
        </div>

        <div v-if="section.keyMetrics?.length" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div v-for="(metric, i) in section.keyMetrics" :key="i" class="bg-[#0f172a] rounded p-2 border border-[#1e293b]">
            <div class="text-[10px] text-[#64748b]">{{ metric.label }}</div>
            <div class="text-xs font-mono font-bold text-white mt-0.5">{{ metric.value }}</div>
            <div v-if="metric.note" class="text-[9px] text-blue-400">{{ metric.note }}</div>
          </div>
        </div>

        <div class="space-y-1 text-xs text-[#94a3b8] leading-relaxed font-sans">
          <div v-for="(paragraph, pIndex) in section.content" :key="pIndex" class="flex items-start gap-2">
            <span class="text-blue-500 font-bold mt-0.5">•</span>
            <span>{{ paragraph }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 text-[#64748b]">
        <CheckCircle2 class="w-4 h-4 text-emerald-400" />
        <span>报告已按最新期刊规范整理完毕（支持一键导入论文 Results）</span>
      </div>
      <button
        class="w-full sm:w-auto py-2.5 px-6 bg-white text-black font-bold text-xs rounded hover:bg-blue-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        @click="emit('open-paper')"
      >
        <span>生成 Results</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </section>
</template>
