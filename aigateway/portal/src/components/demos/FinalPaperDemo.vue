<script setup lang="ts">
import { ref } from 'vue'
import { FileText, ArrowRight, CheckCircle2, Feather, ListOrdered, BookMarked, Sparkles } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildPaperData, type PaperData, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<PaperData | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '整合全链路成果', desc: '文献 / 代码 / 实验 / 评审全量汇集' },
  { title: '结构化论文写作', desc: '章节大纲驱动逐章生成' },
  { title: '参考文献校对', desc: '引用格式与事实核验' },
  { title: '输出终稿', desc: '排版定稿并生成 DOI 预登记' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildPaperData(p)
  const r = result.value
  stepLogs.value = [
    [`[paper] 已汇集全链路成果：文献、代码、实验、评审记录`],
    [`[paper] 按 ${r.outline.length} 章大纲完成论文写作`],
    [`[paper] 参考文献校对完成：${r.references.length} 条引用格式校验通过`],
    [`[paper] 论文终稿已输出，进入投稿流程`],
  ]
}
</script>

<template>
  <NodeDemoShell
    badge="最终论文 节点 · 交互演示"
    title="最终论文 —— 成稿输出"
    desc="整合全链路成果，输出结构化论文终稿并进入投稿流程"
    accent="indigo"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Feather class="w-3.5 h-3.5" />
              全链路完成 · 论文终稿
            </div>
            <h4 class="mt-3 text-xl font-extrabold text-slate-900">科研链路 10 环节全部闭环</h4>
          </div>
          <CheckCircle2 class="w-10 h-10 text-emerald-500 shrink-0" />
        </div>

        <!-- 论文卡片 -->
        <div class="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-sm">
          <div class="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            <FileText class="w-3.5 h-3.5" />
            研究论文
          </div>
          <h5 class="mt-2 text-lg font-extrabold text-slate-900 leading-snug">{{ result.title }}</h5>
          <p class="mt-1 text-xs text-slate-500">{{ result.authors }}</p>
          <div class="mt-4 rounded-xl bg-white border border-slate-200 p-4">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">摘要 · Abstract</div>
            <p class="text-xs text-slate-700 leading-relaxed">{{ result.abstract }}</p>
          </div>
        </div>

        <!-- 章节大纲 -->
        <div class="rounded-2xl border border-slate-200 p-4">
          <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-3">
            <ListOrdered class="w-3.5 h-3.5 text-indigo-600" />
            章节结构
          </h5>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div
              v-for="o in result.outline"
              :key="o.no"
              class="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5"
            >
              <div class="text-[10px] font-extrabold text-indigo-600">§{{ o.no }}</div>
              <div class="text-xs font-bold text-slate-800 mt-0.5">{{ o.title }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">{{ o.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 参考文献 -->
        <div class="rounded-2xl border border-slate-200 p-4">
          <h5 class="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
            <BookMarked class="w-3.5 h-3.5 text-indigo-600" />
            参考文献
          </h5>
          <ul class="space-y-1.5">
            <li
              v-for="(r, i) in result.references"
              :key="i"
              class="flex items-start gap-2 text-[11px] font-mono text-slate-600"
            >
              <span class="text-indigo-500 shrink-0">[{{ i + 1 }}]</span>
              {{ r }}
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
          >
            <Sparkles class="w-4 h-4" />
            完成全部链路演示
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
