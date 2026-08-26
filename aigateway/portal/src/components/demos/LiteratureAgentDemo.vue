<script setup lang="ts">
import { ref } from 'vue'
import { Search, Filter, FolderTree, FileText, ArrowRight, ExternalLink, Quote } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildLiteratureData, type LiteratureItem, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<ReturnType<typeof buildLiteratureData> | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '检索论文', desc: 'WoS / Google Scholar / arXiv 联合查询' },
  { title: '筛选精读', desc: '按相关度阈值与引用量排序' },
  { title: '分类聚类', desc: '方法 / 数据 / 评测维度归类' },
  { title: '输出综述', desc: '生成结构化文献清单' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildLiteratureData(p)
  const d = result.value
  stepLogs.value = [
    [`[literature] 开始检索：WoS + Scholar + arXiv 联合查询`],
    [`[literature] 命中 ${d.totalScanned} 篇候选论文 → 相关度阈值 85 筛选`],
    [`[literature] 精读 ${d.coreSelected} 篇，按方法与评测维度聚类`],
    [`[literature] 文献综述已生成：输出 ${d.coreSelected} 篇核心文献清单`],
  ]
}

const accIcon = (item: LiteratureItem) =>
  item.relevance >= 95 ? 'bg-emerald-500' : item.relevance >= 90 ? 'bg-blue-500' : 'bg-slate-400'
</script>

<template>
  <NodeDemoShell
    badge="Literature Agent 节点 · 交互演示"
    title="文献调研 —— 从 200 篇论文到实验方案"
    desc="自动完成论文检索、筛选、阅读与分类，输出结构化调研结果"
    accent="emerald"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FileText class="w-3.5 h-3.5" />
              文献调研完成
            </div>
            <h4 class="mt-3 text-xl font-extrabold text-slate-900">结构化文献清单已生成</h4>
            <p class="mt-1 text-sm text-slate-500 max-w-xl">共扫描 {{ result.totalScanned }} 篇候选论文，精读 {{ result.coreSelected }} 篇核心文献</p>
          </div>
          <!-- 统计 -->
          <div class="flex gap-3 shrink-0">
            <div class="text-center rounded-xl bg-slate-50 border border-slate-200 px-4 py-2">
              <div class="text-lg font-extrabold text-slate-900">{{ result.totalScanned.toLocaleString() }}</div>
              <div class="text-[10px] text-slate-400 font-semibold">候选论文</div>
            </div>
            <div class="text-center rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2">
              <div class="text-lg font-extrabold text-emerald-600">{{ result.coreSelected }}</div>
              <div class="text-[10px] text-slate-400 font-semibold">核心文献</div>
            </div>
          </div>
        </div>

        <!-- 文献列表 -->
        <div class="space-y-3">
          <div
            v-for="(item, i) in result.items"
            :key="item.id"
            class="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-extrabold text-white"
                :class="accIcon(item)"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <h6 class="text-sm font-bold text-slate-900 leading-snug">{{ item.title }}</h6>
                  <ExternalLink class="w-3.5 h-3.5 text-slate-300 shrink-0" />
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono">
                  <span>{{ item.venue }} · {{ item.year }}</span>
                  <span class="text-slate-300">|</span>
                  <span>引用 {{ item.citations }}</span>
                </div>
                <div class="mt-2.5 flex items-center gap-2">
                  <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :class="item.relevance >= 95 ? 'bg-emerald-500' : item.relevance >= 90 ? 'bg-blue-500' : 'bg-slate-400'"
                      :style="{ width: item.relevance + '%' }"
                    />
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 w-16 text-right">相关度 {{ item.relevance }}%</span>
                </div>
                <div class="mt-2 flex items-start gap-1.5 text-xs text-slate-600">
                  <Quote class="w-3 h-3 text-slate-300 mt-0.5 shrink-0" />
                  <span>{{ item.contribution }}</span>
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span
                    v-for="t in item.tags"
                    :key="t"
                    class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <Search class="w-3.5 h-3.5" />
            <Filter class="w-3.5 h-3.5" />
            <FolderTree class="w-3.5 h-3.5" />
            检索 → 筛选 → 聚类 → 综述
          </div>
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
          >
            文献已就绪 → 研究洞察
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
