<script setup lang="ts">
// 产品详情 · 分段子组件 7/9 —— 供应商智能匹配（原型 TAB: suppliers）
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/selection/ProductDetailView.tsx
// 行点击 / 企业画像按钮 emit open-supplier(sup)；供应商报价随容器 currency 切换
// 原型 canvas-confetti 以共享 EcomConfettiLayer（CSS 粒子）替代
import { ref, watch } from 'vue'
import { Factory, Sparkles } from 'lucide-vue-next'
import type { ProductOpportunity, Currency, SupplierItem } from '@/data/ecomIntelData'
import EcomConfettiLayer from '../EcomConfettiLayer.vue'

const props = defineProps<{
  product: ProductOpportunity
  currency: Currency
}>()

const emit = defineEmits<{
  (e: 'open-supplier', sup: SupplierItem): void
}>()

// 供应商检索模拟（原型 handleRunSupplierSearch）
const isSearchingSuppliers = ref(false)
const suppliersFoundCount = ref(128)
const confettiOn = ref(false)

watch(
  () => props.product.id,
  () => {
    isSearchingSuppliers.value = false
    confettiOn.value = false
  },
)

const fmtPrice = (v: number): string =>
  props.currency === 'CNY' ? `¥${(v * 7.2).toFixed(1)}` : `$${v.toFixed(2)}`

const runSupplierSearch = () => {
  if (isSearchingSuppliers.value) return
  isSearchingSuppliers.value = true
  window.setTimeout(() => {
    isSearchingSuppliers.value = false
    suppliersFoundCount.value = 142
    confettiOn.value = true
  }, 1200)
}

const openSupplier = (sup: SupplierItem) => emit('open-supplier', sup)
</script>

<template>
  <section class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
    <!-- Section 头部 + 检索按钮 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <Factory class="w-5 h-5 text-indigo-400" />
          <span>AI 供应商智能匹配 (Sourcing & Factory Profiles)</span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          已检索中国主要产业带 (广东东莞、浙江宁波/义乌、江苏苏州) 优质制造源头
        </p>
      </div>

      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer w-fit"
        :disabled="isSearchingSuppliers"
        @click="runSupplierSearch"
      >
        <Sparkles class="w-4 h-4" :class="isSearchingSuppliers ? 'animate-spin' : ''" />
        <span>{{ isSearchingSuppliers ? 'AI 正在寻找匹配供应商...' : '重新寻找匹配供应商' }}</span>
      </button>
    </div>

    <!-- 检索统计横幅 -->
    <div class="grid grid-cols-3 gap-3 text-center text-xs">
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div class="text-[11px] text-slate-400">发现供应商</div>
        <div class="text-xl font-mono font-bold text-white">{{ suppliersFoundCount }} 家</div>
      </div>
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div class="text-[11px] text-slate-400">高匹配供应商 (Match &gt; 90%)</div>
        <div class="text-xl font-mono font-bold text-indigo-400">26 家</div>
      </div>
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div class="text-[11px] text-slate-400">AI 重点推荐供应商</div>
        <div class="text-xl font-mono font-bold text-emerald-400">8 家</div>
      </div>
    </div>

    <!-- 精选匹配供应商表格 -->
    <div class="space-y-3">
      <div class="text-xs font-bold text-slate-300">精选匹配工厂列表 (点击查看企业画像)</div>
      <div v-if="product.matchedSuppliers.length" class="overflow-x-auto rounded-xl border border-slate-800">
        <table class="w-full text-left text-xs min-w-[860px]">
          <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th class="py-2.5 px-3">供应商企业名称</th>
              <th class="py-2.5 px-3">地区</th>
              <th class="py-2.5 px-3 text-right">起订量 (MOQ)</th>
              <th class="py-2.5 px-3 text-right">参考采购价</th>
              <th class="py-2.5 px-3 text-center">产品匹配度</th>
              <th class="py-2.5 px-3 text-center">综合评分</th>
              <th class="py-2.5 px-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 bg-slate-900/60">
            <tr
              v-for="sup in product.matchedSuppliers"
              :key="sup.id"
              class="hover:bg-slate-800/40 transition cursor-pointer group"
              @click="openSupplier(sup)"
            >
              <td class="py-3.5 px-3">
                <div class="font-bold text-white group-hover:text-indigo-300 transition">{{ sup.name }}</div>
                <div class="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{{ sup.factorySize }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-400"></span>
                  <span>交期: {{ sup.leadTime }}</span>
                </div>
              </td>
              <td class="py-3.5 px-3 text-slate-300">{{ sup.province }}</td>
              <td class="py-3.5 px-3 font-mono font-bold text-white text-right">{{ sup.moq }} 件</td>
              <td class="py-3.5 px-3 font-mono font-bold text-emerald-400 text-right whitespace-nowrap">
                {{ fmtPrice(sup.unitPrice) }}
              </td>
              <td class="py-3.5 px-3 text-center">
                <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">{{ sup.matchRate }}%</span>
              </td>
              <td class="py-3.5 px-3 text-center">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">{{ sup.rating }} 分</span>
              </td>
              <td class="py-3.5 px-3 text-right">
                <button
                  class="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-medium transition cursor-pointer whitespace-nowrap"
                  @click.stop="openSupplier(sup)"
                >
                  企业画像 &gt;
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
        暂无匹配供应商数据
      </div>
    </div>

    <!-- 模拟检索成功的粒子反馈（替代原型 canvas-confetti） -->
    <EcomConfettiLayer :trigger="confettiOn" @done="confettiOn = false" />
  </section>
</template>
