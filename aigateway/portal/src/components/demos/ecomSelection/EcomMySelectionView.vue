<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 我的选品池与立项跟踪
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/my-pool/MySelectionView.tsx
// props: savedProducts —— emits: select-product / remove-from-pool / export
// ============================================================================
import { computed, ref } from 'vue'
import { Bookmark, ExternalLink, FileDown, Trash2 } from 'lucide-vue-next'
import type { ProductOpportunity, ProductStatus } from '@/data/ecomIntelData'
import EcomScoreBadge from './EcomScoreBadge.vue'

const props = defineProps<{
  savedProducts: ProductOpportunity[]
}>()

const emit = defineEmits<{
  (e: 'select-product', p: ProductOpportunity): void
  (e: 'remove-from-pool', id: string): void
  (e: 'export'): void
}>()

// 生命周期状态筛选（与 ecomIntelData.ProductStatus 对齐）
const STATUS_ORDER: ProductStatus[] = ['待验证', '验证中', '供应商询价', '竞品分析', '打样', '寄样', '上架']
const filterStatus = ref<string>('all')

const displayStatus = (p: ProductOpportunity): ProductStatus => p.status ?? '验证中'

const statusCount = (s: ProductStatus): number =>
  props.savedProducts.filter((p) => displayStatus(p) === s).length

const filtered = computed<ProductOpportunity[]>(() => {
  if (filterStatus.value === 'all') return props.savedProducts
  return props.savedProducts.filter((p) => displayStatus(p) === filterStatus.value)
})

const selectProduct = (p: ProductOpportunity) => {
  emit('select-product', p)
}

const removeFromPool = (id: string) => {
  emit('remove-from-pool', id)
}

const exportList = () => {
  emit('export')
}

// 状态徽标配色（完整字面量，按状态取色）
const statusClass = (status: ProductStatus): string => {
  const map: Record<ProductStatus, string> = {
    待验证: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    验证中: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    供应商询价: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    竞品分析: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    打样: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    寄样: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    上架: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  }
  return map[status]
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <Bookmark class="w-3.5 h-3.5" />
          <span>企业级跨境选品项目生命周期管理</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          我的选品池与立项跟踪 (My Product Selection Pool)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          跟踪已立项产品的打样进度、供应商询价、样品寄出与上架生命周期
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          @click="exportList"
        >
          <FileDown class="w-4 h-4 text-indigo-400" />
          <span>导出选品项目总表 (Excel)</span>
        </button>
      </div>
    </div>

    <!-- Status Filter Tabs -->
    <div class="flex items-center gap-2 flex-wrap text-xs">
      <button
        type="button"
        class="px-3.5 py-1.5 rounded-xl font-medium transition cursor-pointer"
        :class="
          filterStatus === 'all'
            ? 'bg-indigo-600 text-white font-bold shadow-sm'
            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
        "
        @click="filterStatus = 'all'"
      >
        全部项目 ({{ props.savedProducts.length }})
      </button>

      <button
        v-for="s in STATUS_ORDER"
        :key="s"
        type="button"
        class="px-3.5 py-1.5 rounded-xl font-medium transition cursor-pointer"
        :class="
          filterStatus === s
            ? 'bg-indigo-600 text-white font-bold shadow-sm'
            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
        "
        @click="filterStatus = s"
      >
        {{ s }} ({{ statusCount(s) }})
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!filtered.length" class="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
      <Bookmark class="w-8 h-8 text-slate-400 mx-auto" />
      <div class="text-sm font-bold text-white">暂无收藏机会</div>
      <p class="text-xs text-slate-400">
        可在选品报告或产品详情页点击“加入我的选品”将心仪的高潜机会沉淀至此
      </p>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in filtered"
        :key="product.id"
        class="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-indigo-500/60 p-6 space-y-4 flex flex-col justify-between transition cursor-pointer shadow-xl hover:shadow-2xl group relative"
        @click="selectProduct(product)"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="space-y-1 min-w-0">
              <span class="text-[10px] font-mono text-indigo-400 font-bold uppercase">
                RANK #{{ product.rank }} · {{ product.subCategory }}
              </span>
              <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                {{ product.nameEn }}
              </h3>
              <div class="text-xs text-slate-400">{{ product.nameCn }}</div>
            </div>

            <button
              type="button"
              title="从选品池移出"
              class="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer shrink-0"
              @click.stop="removeFromPool(product.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <!-- Score & Margin -->
          <div class="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80 items-center">
            <div>
              <span class="text-slate-400 text-[10px]">综合机会分:</span>
              <div class="mt-1">
                <EcomScoreBadge :score="product.score" :show-label="false" />
              </div>
            </div>
            <div>
              <span class="text-slate-400 text-[10px]">预计毛利率:</span>
              <div class="font-mono font-bold text-cyan-400 text-base">
                {{ product.grossMargin.toFixed(1) }}%
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="flex items-center justify-between text-xs pt-1">
            <span class="text-slate-400">立项进度:</span>
            <span class="px-2.5 py-1 rounded-lg font-mono font-bold text-[11px]" :class="statusClass(displayStatus(product))">
              {{ displayStatus(product) }}
            </span>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-semibold">
          <span>查看完整选品报告与供应商</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  </div>
</template>
