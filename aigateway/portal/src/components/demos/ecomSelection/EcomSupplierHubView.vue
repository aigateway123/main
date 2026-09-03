<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— AI 供应商库视图
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/supplier/SupplierHubView.tsx
// props: suppliers —— emits: open-supplier(sup)
// ============================================================================
import { computed, ref } from 'vue'
import { ExternalLink, Factory, MapPin, Search } from 'lucide-vue-next'
import type { SupplierItem } from '@/data/ecomIntelData'

const props = defineProps<{
  suppliers: SupplierItem[]
}>()

const emit = defineEmits<{ (e: 'open-supplier', sup: SupplierItem): void }>()

// 中国省份前缀表：从 "广东东莞" 这类 省+市 写法中安全提取产业带
const CN_PROVINCES = [
  '广东',
  '浙江',
  '江苏',
  '山东',
  '福建',
  '河北',
  '河南',
  '安徽',
  '湖南',
  '湖北',
  '四川',
  '辽宁',
  '吉林',
  '黑龙江',
  '陕西',
  '山西',
  '江西',
  '云南',
  '贵州',
  '海南',
  '甘肃',
  '青海',
  '北京',
  '上海',
  '天津',
  '重庆',
]

const provinceOf = (province: string): string =>
  CN_PROVINCES.find((p) => province.startsWith(p)) ?? province

const selectedRegion = ref<string>('all')
const searchTerm = ref<string>('')

// 产业带 pills：由传入数据动态推导（数据含山东等原型未覆盖省份时同样可用）
const regionOptions = computed<string[]>(() => {
  const set = new Set<string>()
  props.suppliers.forEach((sup) => set.add(provinceOf(sup.province)))
  return ['all', ...Array.from(set)]
})

const regionLabel = (region: string): string =>
  region === 'all' ? '全部产业带' : `${region}省制造基地`

// 按 匹配度 降序 + 地区/关键词安全过滤
const filteredSuppliers = computed<SupplierItem[]>(() => {
  const q = searchTerm.value.trim().toLowerCase()
  const sorted = [...props.suppliers].sort((a, b) => b.matchRate - a.matchRate)
  if (!q && selectedRegion.value === 'all') return sorted
  return sorted.filter((sup) => {
    if (selectedRegion.value !== 'all' && !sup.province.includes(selectedRegion.value)) return false
    if (!q) return true
    return (
      sup.name.toLowerCase().includes(q) ||
      sup.province.toLowerCase().includes(q) ||
      sup.mainProducts.some((p) => p.toLowerCase().includes(q)) ||
      sup.aiMatchReason.toLowerCase().includes(q)
    )
  })
})

const openSupplier = (sup: SupplierItem) => {
  emit('open-supplier', sup)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
          <Factory class="w-3.5 h-3.5" />
          <span>中国源头产业带精选供应链</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI 供应商库与工厂智能画像 (Supplier Sourcing Hub)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          覆盖广东、浙江、江苏等外贸制造基地，提供验厂资质、模具开模支持、起订量与参考采购单价
        </p>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs text-slate-400">制造产业带:</span>
        <button
          v-for="r in regionOptions"
          :key="r"
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
          :class="
            selectedRegion === r
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'
          "
          @click="selectedRegion = r"
        >
          {{ regionLabel(r) }}
        </button>
      </div>

      <div class="relative">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="搜索工厂、产品或模具优势..."
          class="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-56 sm:w-72"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!filteredSuppliers.length"
      class="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3"
    >
      <Factory class="w-8 h-8 text-slate-400 mx-auto" />
      <div class="text-sm font-bold text-white">未找到匹配的供应商</div>
      <p class="text-xs text-slate-400">可尝试更换产业带筛选或清空搜索关键词后重试</p>
    </div>

    <!-- Supplier Grid Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="sup in filteredSuppliers"
        :key="sup.id"
        class="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-indigo-500/60 p-6 space-y-4 flex flex-col justify-between transition cursor-pointer shadow-xl hover:shadow-2xl group"
        @click="openSupplier(sup)"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="text-[11px] font-mono text-indigo-400 font-semibold flex items-center gap-1">
                <MapPin class="w-3 h-3" />
                <span>{{ sup.province }}</span>
              </div>
              <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition mt-0.5">
                {{ sup.name }}
              </h3>
            </div>

            <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40 shrink-0">
              {{ sup.matchRate }}% 匹配
            </span>
          </div>

          <!-- Specs Grid -->
          <div class="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div>
              <span class="text-slate-400 text-[10px]">参考单价:</span>
              <div class="font-mono font-bold text-emerald-400 text-sm">
                ${{ sup.unitPrice.toFixed(2) }}
                <span class="text-[10px] text-slate-400">(¥{{ (sup.unitPrice * 7.2).toFixed(1) }})</span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 text-[10px]">起订量 (MOQ):</span>
              <div class="font-mono font-bold text-white text-sm">{{ sup.moq.toLocaleString() }} 件</div>
            </div>
            <div>
              <span class="text-slate-400 text-[10px]">交货周期:</span>
              <div class="text-slate-200 text-xs font-medium">{{ sup.leadTime }}</div>
            </div>
            <div>
              <span class="text-slate-400 text-[10px]">综合评分:</span>
              <div class="text-amber-400 text-xs font-mono font-bold">★ {{ sup.rating }} 分</div>
            </div>
          </div>

          <!-- Main Products -->
          <div v-if="sup.mainProducts.length" class="space-y-1">
            <div class="text-[10px] text-slate-400">主营优势品类：</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(p, i) in sup.mainProducts"
                :key="i"
                class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
              >
                {{ p }}
              </span>
            </div>
          </div>

          <!-- AI Evaluation -->
          <div class="text-xs text-slate-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/40 leading-relaxed">
            <span class="text-indigo-400 font-bold mr-1">AI 评价:</span>
            {{ sup.aiMatchReason }}
          </div>
        </div>

        <button
          type="button"
          class="w-full py-2 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          @click.stop="openSupplier(sup)"
        >
          <span>查看完整企业画像与打样申请</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
