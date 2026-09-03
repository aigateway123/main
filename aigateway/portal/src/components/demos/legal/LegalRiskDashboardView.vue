<!-- ============================================================================
     AI 法务员工 · 法律风险大盘与预警（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/risk/LegalRiskDashboardView.tsx
     数据：概览指标 / 风险分布 / 紧急预警 均为原型硬编码（React 原型即无 mock 依赖）
     emits：start-review（「一键发起审查」，容器进入 contract-review 默认设备采购合同）
     图标映射：AlertTriangle→TriangleAlert（lucide-vue-next 0.577 新命名）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ArrowRight, TriangleAlert } from 'lucide-vue-next'

const emit = defineEmits<{ (e: 'start-review'): void }>()

// 顶部 4 项风险概况指标（照原型硬编码）
const METRICS: { label: string; value: string; unit: string; note: string; noteCls: string; valueCls: string }[] = [
  {
    label: '累计高风险敞口',
    value: '¥14,820,000',
    unit: '',
    note: '主要集中在预付款及违约金',
    noteCls: 'text-rose-400',
    valueCls: 'text-rose-500',
  },
  {
    label: '待整改P0风险条款',
    value: '7',
    unit: '处',
    note: '急需商务出具补充协议',
    noteCls: 'text-amber-400',
    valueCls: 'text-slate-100',
  },
  {
    label: '相对方失信/涉诉风险',
    value: '2',
    unit: '家',
    note: '1家涉及被执行人记录',
    noteCls: 'text-slate-400',
    valueCls: 'text-slate-100',
  },
  {
    label: '30天内到期合同',
    value: '4',
    unit: '份',
    note: '需发送续约/终止通知函',
    noteCls: 'text-blue-400',
    valueCls: 'text-blue-400',
  },
]

// 近90天风险类型分布（照原型硬编码）
const RISK_DISTRIBUTION: { type: string; count: number; risk: string; percent: number; color: string }[] = [
  { type: '预付款过高且无保函', count: 18, risk: '高风险', percent: 85, color: 'bg-rose-500' },
  { type: '单边过低违约金/免责约定', count: 14, risk: '高风险', percent: 72, color: 'bg-rose-500' },
  { type: '验收以送达即合格/异议期过短', count: 11, risk: '中风险', percent: 64, color: 'bg-amber-500' },
  { type: '知识产权定制成果归属模糊', count: 9, risk: '中风险', percent: 52, color: 'bg-amber-500' },
  { type: '管辖法院设在异地相对方所在地', count: 22, risk: '中风险', percent: 78, color: 'bg-amber-500' },
  { type: '未约定不可抗力通知及减损期限', count: 6, risk: '低风险', percent: 34, color: 'bg-blue-500' },
]
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-rose-500" />
        <span class="text-xs font-semibold text-rose-400 uppercase tracking-wider">
          企业全景风险态势监测
        </span>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
        法律风险大盘与预警
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        实时监测全量合同履约敞口、高风险违约条款、相对方涉诉风险及到期履行异常
      </p>
    </div>

    <!-- Top 4 Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="m in METRICS"
        :key="m.label"
        class="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-sm"
      >
        <div class="text-xs text-slate-400">{{ m.label }}</div>
        <div class="text-2xl font-black font-mono mt-1" :class="m.valueCls">
          {{ m.value }}
          <span v-if="m.unit" class="text-xs font-normal text-slate-400">{{ m.unit }}</span>
        </div>
        <div class="text-[11px] mt-1 font-medium" :class="m.noteCls">{{ m.note }}</div>
      </div>
    </div>

    <!-- Main Risk Distribution & Incident List -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-100">企业合同风险类型分布态势</h2>
          <span class="text-xs text-slate-400">近90天AI审查统计</span>
        </div>

        <div class="space-y-3">
          <div v-for="(item, idx) in RISK_DISTRIBUTION" :key="idx" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-200">{{ item.type }}</span>
              <span class="text-slate-400 font-mono">{{ item.count }} 份合同 ({{ item.risk }})</span>
            </div>
            <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="item.color" :style="{ width: item.percent + '%' }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Urgent alerts -->
      <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
        <div class="flex items-center gap-2">
          <TriangleAlert class="w-4 h-4 text-rose-500" />
          <h2 class="text-sm font-bold text-slate-100">高优先级风险预警处理</h2>
        </div>

        <div class="space-y-3">
          <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-1.5 text-xs">
            <div class="font-bold text-rose-300">《设备采购合同》预付款70%风险</div>
            <p class="text-rose-200/90 leading-relaxed">
              合同金额¥2,860,000，未约定履约保函与无条件退款，建议立即由法务改写。
            </p>
            <button
              type="button"
              @click="emit('start-review')"
              class="text-xs text-rose-400 font-bold hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
            >
              <span>立即打开审查与条款示范</span>
              <ArrowRight class="w-3 h-3" />
            </button>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 space-y-1.5 text-xs">
            <div class="font-bold text-amber-300">《二期厂房租赁合同》租期临界</div>
            <p class="text-amber-200/90 leading-relaxed">
              距合同届满仅27天，需依据第14.2条于届满前30天书面发出续租确认函。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
