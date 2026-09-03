<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/MyPatentsView.tsx -->
<!-- 数据全部来自 ENTERPRISE_SELF_PATENTS（ipMockData），无任何硬编码资产数字 -->
<script setup lang="ts">
import { CalendarDays, Globe, Layers, Plus } from 'lucide-vue-next'
import { ENTERPRISE_SELF_PATENTS } from '@/data/ipMockData'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'

// 领域分布进度条配色（按数组顺序循环取用）
const BAR_COLORS = ['bg-blue-600', 'bg-emerald-500', 'bg-violet-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500']

// 顶部 4 张统计卡（数值全部派生自 ENTERPRISE_SELF_PATENTS）
const statCards: { label: string; value: string; sub: string; valueCls: string; wrap: string }[] = [
  { label: '有效授权专利', value: `${ENTERPRISE_SELF_PATENTS.activeCount} 件`, sub: '已授权并维持有效', valueCls: 'text-emerald-600', wrap: '' },
  { label: '核心专利资产', value: `${ENTERPRISE_SELF_PATENTS.coreCount} 件`, sub: '重点法律状态监控', valueCls: 'text-blue-600', wrap: '' },
  { label: 'PCT海外布局', value: `${ENTERPRISE_SELF_PATENTS.overseasCount} 件`, sub: '覆盖美欧日等市场', valueCls: 'text-purple-600', wrap: '' },
  { label: '年费到期预警', value: `${ENTERPRISE_SELF_PATENTS.expiringCount} 件`, sub: '待财务审核续费', valueCls: 'text-amber-600', wrap: 'bg-amber-50/30 border-amber-200' },
]

// 年费状态 pill：含「待缴」→ amber 预警，其余（处理中）→ blue
const feePillClass = (status: string): string =>
  status.includes('待缴') ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'

// 「登记新交底书」演示动作
const handleNewDisclosure = () => {
  window.alert('已打开新增企业交底提案表单。')
}
</script>

<template>
  <div class="p-4 sm:p-5 space-y-4 pb-8">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
          <span>我的专利资产管家</span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            自有专利组合：{{ ENTERPRISE_SELF_PATENTS.totalCount }} 件
          </span>
        </h2>
        <p class="text-[11px] text-slate-500 mt-0.5">
          企业自主专利全生命周期管理、年费监控、实审答辩与海外布局档案
        </p>
      </div>

      <button
        type="button"
        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        @click="handleNewDisclosure"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>登记新交底书 / 申请</span>
      </button>
    </div>

    <!-- 资产统计卡 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
        :class="card.wrap"
      >
        <span class="text-[10px] text-slate-400 font-medium block">{{ card.label }}</span>
        <span class="text-xl font-extrabold font-mono mt-0.5 block" :class="card.valueCls">{{ card.value }}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">{{ card.sub }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <!-- 左 2/3：技术领域分布 + 年费到期管理 -->
      <div class="lg:col-span-2 space-y-3">
        <!-- 技术领域分布（CSS 条） -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Layers class="w-3.5 h-3.5 text-blue-600" />
            <span>自有专利技术领域分布</span>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 ml-auto">
              合计 {{ ENTERPRISE_SELF_PATENTS.totalCount }} 件
            </span>
          </h3>

          <div class="space-y-2.5">
            <div v-for="(f, i) in ENTERPRISE_SELF_PATENTS.fieldDistribution" :key="f.field" class="flex items-center gap-2.5">
              <span class="w-24 shrink-0 text-[11px] font-medium text-slate-600 truncate">{{ f.field }}</span>
              <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="BAR_COLORS[i % BAR_COLORS.length]"
                  :style="{ width: f.percentage + '%' }"
                />
              </div>
              <span class="w-12 shrink-0 text-right text-[11px] font-mono font-bold text-slate-700">{{ f.count }}</span>
              <span class="w-12 shrink-0 text-right text-[10px] font-mono text-slate-400">{{ f.percentage }}%</span>
            </div>
          </div>
        </div>

        <!-- 近期待缴年费与续费管理表 -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-3.5 border-b border-slate-100 flex items-center justify-between gap-2">
            <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarDays class="w-3.5 h-3.5 text-amber-500" />
              <span>年费到期与续费提醒</span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                近期待处理 {{ ENTERPRISE_SELF_PATENTS.expiringCount }} 件
              </span>
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[10px]">
                  <th class="py-2.5 px-3 w-72">专利名称与申请号</th>
                  <th class="py-2.5 px-3 w-32">缴费截止日</th>
                  <th class="py-2.5 px-3 w-24">年费金额</th>
                  <th class="py-2.5 px-3">缴费状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in ENTERPRISE_SELF_PATENTS.recentRenewals" :key="r.patentNumber" class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-2 px-3">
                    <span class="font-bold text-slate-900 block leading-snug">{{ r.name }}</span>
                    <span class="font-mono text-slate-400 text-[10px] block mt-0.5">{{ r.patentNumber }}</span>
                  </td>
                  <td class="py-2 px-3 font-mono text-slate-600">{{ r.dueDate }}</td>
                  <td class="py-2 px-3 font-mono font-bold text-slate-800">{{ r.fee }}</td>
                  <td class="py-2 px-3">
                    <span class="px-1.5 py-0.5 rounded font-semibold text-[10px]" :class="feePillClass(r.status)">
                      {{ r.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右 1/3：国家分布 -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 self-start">
        <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Globe class="w-3.5 h-3.5 text-blue-600" />
          <span>授权地域国家分布</span>
        </h3>

        <div class="space-y-2">
          <div
            v-for="c in ENTERPRISE_SELF_PATENTS.countryDistribution"
            :key="c.country"
            class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-base leading-none">{{ c.flag }}</span>
              <span class="text-[11px] font-bold text-slate-800 truncate">{{ c.country }}</span>
            </div>
            <span class="text-sm font-extrabold font-mono text-blue-600 shrink-0">{{ c.count }} 件</span>
          </div>
        </div>

        <p class="text-[10px] text-slate-400 leading-snug pt-1 border-t border-slate-100">
          海外资产合计 {{ ENTERPRISE_SELF_PATENTS.overseasCount }} 件，PCT 途径进入美欧国家阶段的案件由知识产权法务部统一归档。
        </p>
      </div>
    </div>
  </div>
</template>
