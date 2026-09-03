<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/RadarView.tsx -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, Sparkles } from 'lucide-vue-next'
import type { IPIntelligence } from '@/data/ipIntelData'
import { MOCK_INTELLIGENCE } from '@/data/ipMockData'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'

// 情报类别 Tab 过滤：全部 / 高危风险异动 / 竞对最新公开 / 空白机遇捕捉
type RadarFilter = 'all' | 'risk' | 'competitor_new' | 'opportunity'
const filterType = ref<RadarFilter>('all')
// 当前选中情报（列表选中态高亮，不弹空弹窗）
const selectedId = ref<string | null>(null)

const filteredItems = computed(() => {
  const t = filterType.value
  return MOCK_INTELLIGENCE.filter((item) => {
    if (t === 'all') return true
    if (t === 'risk') return item.priority === 'high'
    if (t === 'competitor_new') return item.category.includes('新增')
    if (t === 'opportunity') return item.category.includes('空白') || item.priority === 'low'
    return true
  })
})

// 顶部 4 张实时动态 ticker 卡（照原型演示快照数字）
const tickerCards: { label: string; value: string; sub: string; valueCls: string; subCls: string }[] = [
  { label: '近24小时动态', value: '37 条', sub: '较昨日 +8 条', valueCls: 'text-slate-900', subCls: 'text-emerald-600' },
  { label: '高优涉案预警', value: '3 项', sub: '需法务跟进', valueCls: 'text-rose-600', subCls: 'text-rose-600' },
  { label: '竞对海外公开', value: '12 件', sub: '涵盖 USPTO/EPO', valueCls: 'text-blue-600', subCls: 'text-slate-400' },
  { label: 'AI策略建议', value: '9 条', sub: '待技术交底确认', valueCls: 'text-purple-600', subCls: 'text-slate-400' },
]

// 处置等级 pill：高→rose / 空白或低→emerald / 其余→blue（照原型配色逻辑）
const priorityPillClass = (item: IPIntelligence): string => {
  if (item.priority === 'high') return 'bg-rose-100 text-rose-700'
  if (item.category.includes('空白') || item.priority === 'low') return 'bg-emerald-100 text-emerald-700'
  return 'bg-blue-100 text-blue-700'
}
const priorityLabel = (item: IPIntelligence): string => {
  if (item.priority === 'high') return '紧急处置'
  if (item.priority === 'medium') return '跟进排查'
  return '信息建档'
}

// 「立即增量刷新」演示动作
const handleRefresh = () => {
  window.alert('已触发全网专利库即时增量扫描。')
}
</script>

<template>
  <div class="p-4 sm:p-5 space-y-4 pb-8">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 页面头部（含 ping 雷达头） -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-1 h-4 bg-emerald-600 rounded-full"></span>
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">
            AI知识产权雷达 · 24小时主动侦测
          </h2>
          <!-- ping 雷达头（持续脉冲指示实时监听中） -->
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">
          持续监控目标竞争对手最新公开专利、法律状态异动、被引证动向及无效宣告请求
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] text-slate-400 font-mono">巡检频次：实时</span>
        <button
          type="button"
          class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold border border-blue-200 transition-colors cursor-pointer"
          @click="handleRefresh"
        >
          立即增量刷新
        </button>
      </div>
    </div>

    <!-- 实时动态 Ticker 卡 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <div v-for="card in tickerCards" :key="card.label" class="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
        <span class="text-[10px] text-slate-400 block font-medium">{{ card.label }}</span>
        <span class="text-xl font-extrabold font-mono mt-0.5 block" :class="card.valueCls">{{ card.value }}</span>
        <span class="text-[10px] block mt-0.5" :class="card.subCls">{{ card.sub }}</span>
      </div>
    </div>

    <!-- 4 类情报过滤 Tabs -->
    <div class="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-[11px] overflow-x-auto">
      <button
        type="button"
        class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer whitespace-nowrap"
        :class="filterType === 'all' ? 'bg-slate-900 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'"
        @click="filterType = 'all'"
      >
        全部 ({{ MOCK_INTELLIGENCE.length }})
      </button>
      <button
        type="button"
        class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer whitespace-nowrap"
        :class="filterType === 'risk' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'"
        @click="filterType = 'risk'"
      >
        高危风险异动
      </button>
      <button
        type="button"
        class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer whitespace-nowrap"
        :class="filterType === 'competitor_new' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'"
        @click="filterType = 'competitor_new'"
      >
        竞对最新公开
      </button>
      <button
        type="button"
        class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer whitespace-nowrap"
        :class="filterType === 'opportunity' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100'"
        @click="filterType = 'opportunity'"
      >
        空白机遇捕捉
      </button>
    </div>

    <!-- 情报时间线列表（点击行高亮选中，不弹弹窗） -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="p-3 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 border-l-[3px]"
        :class="selectedId === item.id ? 'bg-blue-50/40 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50/80'"
        @click="selectedId = selectedId === item.id ? null : item.id"
      >
        <div class="space-y-1 min-w-0">
          <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span class="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{{ item.competitor }}</span>
            <span class="text-slate-400">·</span>
            <span class="text-slate-400 font-mono text-[10px]">{{ item.time }}</span>
            <span class="text-slate-400">·</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" :class="priorityPillClass(item)">
              {{ priorityLabel(item) }}
            </span>
          </div>

          <h3 class="text-xs font-bold text-slate-900">{{ item.title }}</h3>
          <p class="text-[11px] text-slate-600 leading-snug">{{ item.details }}</p>

          <div class="pt-0.5 flex items-center gap-1.5 text-[11px] text-blue-700 font-medium">
            <Sparkles class="w-3 h-3 text-blue-600 shrink-0" />
            <span>AI建议对策：{{ item.recommendation }}</span>
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
          <span v-if="item.patentNumber" class="text-[10px] font-mono text-slate-400">{{ item.patentNumber }}</span>
          <ChevronRight
            class="w-3.5 h-3.5 transition-transform"
            :class="selectedId === item.id ? 'text-blue-600 rotate-90' : 'text-slate-300'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
