<script setup lang="ts">
import { ref } from 'vue'
import { Database, BarChart3, FileCode2, FlaskConical, Gauge, Target, FolderArchive, ArrowRight } from 'lucide-vue-next'
import NodeDemoShell from './NodeDemoShell.vue'
import { buildArchiveData, type ArchiveItem, type SelectPayload } from '@/data/nodeDemos'

const emit = defineEmits<{ (e: 'handoff'): void }>()

const result = ref<ReturnType<typeof buildArchiveData> | null>(null)
const stepLogs = ref<string[][]>([])

const steps = [
  { title: '汇总实验结果', desc: '收集指标、日志与中间产物' },
  { title: '生成结果图表', desc: '训练曲线与误差分布渲染' },
  { title: '归档数据与代码', desc: '按素材规范整理入库' },
  { title: '输出素材清单', desc: '生成可检索的归档索引' },
]

const onSelect = (p: SelectPayload) => {
  result.value = buildArchiveData(p)
  const r = result.value
  stepLogs.value = [
    [`[archive] 已收集实验指标与日志，共 ${r.items.length} 类素材`],
    [`[archive] 结果图表渲染完成（训练曲线 / 误差分布 / 对比图）`],
    [`[archive] 数据与代码已按规范归档到实验仓库`],
    [`[archive] 素材清单已生成，索引可检索`],
  ]
}

const ICONS: Record<ArchiveItem['icon'], typeof Database> = {
  database: Database,
  chart: BarChart3,
  code: FileCode2,
  flask: FlaskConical,
  gauge: Gauge,
  target: Target,
}

const COLORS: Record<ArchiveItem['icon'], string> = {
  database: 'bg-blue-50 text-blue-600 border-blue-200',
  chart: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  code: 'bg-violet-50 text-violet-600 border-violet-200',
  flask: 'bg-amber-50 text-amber-600 border-amber-200',
  gauge: 'bg-rose-50 text-rose-600 border-rose-200',
  target: 'bg-cyan-50 text-cyan-600 border-cyan-200',
}
</script>

<template>
  <NodeDemoShell
    badge="实验结果 节点 · 交互演示"
    title="结果归档 —— 素材自动整理"
    desc="汇总实验结果，将数据、图表与代码归档为可检索的素材库"
    accent="emerald"
    :steps="steps"
    :step-logs="stepLogs"
    @select="onSelect"
  >
    <template #result>
      <div v-if="result" class="space-y-5">
        <!-- 完成头 -->
        <div>
          <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            <FolderArchive class="w-3.5 h-3.5" />
            素材归档完成
          </div>
          <h4 class="mt-3 text-xl font-extrabold text-slate-900">实验结果素材库已就绪</h4>
          <p class="mt-1 text-sm text-slate-500">{{ result.topic }} · 全部素材一键可检索、可复用</p>
        </div>

        <!-- 素材网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="item in result.items"
            :key="item.title"
            class="rounded-2xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="w-9 h-9 rounded-xl border flex items-center justify-center" :class="COLORS[item.icon]">
                <component :is="ICONS[item.icon]" class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-mono text-slate-400">{{ item.meta }}</span>
            </div>
            <h6 class="mt-2.5 text-sm font-bold text-slate-900">{{ item.title }}</h6>
            <p class="mt-1 text-xs text-slate-500 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>

        <!-- 提示 -->
        <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
          <p class="text-xs text-slate-500">
            全部素材已进入课题组共享空间，可直接作为论文「数据可用性声明」与「复现包」的原始材料
          </p>
        </div>

        <!-- CTA -->
        <div class="flex justify-center pt-2">
          <button
            @click="emit('handoff')"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
          >
            素材已归档 → 提交论文评审
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </template>
  </NodeDemoShell>
</template>
