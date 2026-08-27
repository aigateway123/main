<script setup lang="ts">
import { Database, Columns, AlertTriangle, Layers, ShieldCheck, CheckCircle2 } from 'lucide-vue-next'
import type { DatasetMeta } from '@/data/dataAgentData'

defineProps<{ dataset: DatasetMeta }>()

const cards = [
  { id: 'rows', label: '数据量', icon: Database, badge: '全量样本', valColor: 'text-white' },
  { id: 'cols', label: '字段', icon: Columns, badge: '42 维度对齐', valColor: 'text-blue-400' },
  { id: 'missing', label: '缺失值', icon: ShieldCheck, badge: '已清洗修复', valColor: 'text-orange-400' },
  { id: 'anomalies', label: '异常样本', icon: AlertTriangle, badge: 'Isolation Forest', valColor: 'text-red-400' },
  { id: 'groups', label: '实验组', icon: Layers, badge: '平衡对照设计', valColor: 'text-emerald-400' },
]

const VALUES: Record<string, string> = {
  rows: '186,420',
  cols: '42',
  missing: '1.2%',
  anomalies: '23',
  groups: '3',
}

const SUBTEXTS: Record<string, string> = {
  rows: '总计观测样本 (N)',
  cols: '多维物理/化学特征',
  missing: 'MICE 算法链式插补',
  anomalies: '3 个重点关注锁定',
  groups: 'A (基线) / B (优化) / C (强化)',
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">数据概览 (Data Profile)</h3>
      <div class="text-xs font-mono text-[#94a3b8] flex items-center gap-1.5">
        <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
        数据质量指数: <span class="text-emerald-400 font-bold">98.8% (Grade A)</span>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <div
        v-for="card in cards"
        :key="card.id"
        class="relative overflow-hidden rounded-xl bg-[#0f172a] border border-[#1e293b] p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold">{{ card.label }}</span>
          <div class="w-6 h-6 rounded bg-black/40 border border-[#1e293b] flex items-center justify-center">
            <component :is="card.icon" class="w-3.5 h-3.5 text-[#94a3b8]" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-mono font-bold" :class="card.valColor">{{ VALUES[card.id] }}</div>
          <div class="text-[10px] text-[#64748b] mt-0.5">{{ SUBTEXTS[card.id] }}</div>
        </div>
        <div class="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[10px]">
          <span class="font-mono text-[#94a3b8]">{{ card.badge }}</span>
          <span class="text-blue-400">100%</span>
        </div>
      </div>
    </div>
  </section>
</template>
