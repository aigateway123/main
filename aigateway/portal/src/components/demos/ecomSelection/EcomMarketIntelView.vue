<script setup lang="ts">
// ============================================================================
// 全球市场大盘与类目机会探测（转译自选品原型 MarketIntelView.tsx）
//   原型来源：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/market/MarketIntelView.tsx
//   数据契约：GLOBAL_CATEGORY_INTEL / TARGET_MARKETS / PLATFORMS / CategoryIntelligence
//             （见 @/data/ecomIntelData.ts）
// 自包含视图（无 props / 无 emits）：本地维护 国家 × 平台 × 时间范围 筛选状态。
// 移植增强：底部 6 大品类机会情报卡按任务清单补齐 机会指数/需求增长/均价/评分/竞争指数/
//           走势徽标/热卖子类目/highlight（原型底卡只展示了部分字段）。
// ============================================================================
import { computed, ref } from 'vue'
import { Globe2, Minus, ShieldAlert, Sparkles, TrendingUp } from 'lucide-vue-next'
import type { CategoryIntelligence, PlatformType, TargetMarket } from '@/data/ecomIntelData'
import { GLOBAL_CATEGORY_INTEL, PLATFORMS, TARGET_MARKETS } from '@/data/ecomIntelData'

type TimeRange = '30d' | '90d' | '12m'

const timeRanges: { id: TimeRange; label: string }[] = [
  { id: '30d', label: '近30天' },
  { id: '90d', label: '近90天' },
  { id: '12m', label: '近12个月' },
]

// ---- 本地筛选状态（无 props / 无 emits，自包含） ----
const selectedCountry = ref<TargetMarket>('美国')
const selectedPlatform = ref<PlatformType>('Amazon')
const selectedTimeRange = ref<TimeRange>('12m')

// 当前筛选组合存在数据时展示深度透视；无数据回落到全球首条情报（与原型一致）
const activeItem = computed<CategoryIntelligence>(
  () =>
    GLOBAL_CATEGORY_INTEL.find(
      (item) => item.country === selectedCountry.value && item.platform === selectedPlatform.value,
    ) ?? GLOBAL_CATEGORY_INTEL[0],
)

const trendBadgeClass = (trend: CategoryIntelligence['marketShareTrend']): string => {
  if (trend === 'rapidly_growing')
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  if (trend === 'competitive') return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
}

const trendLabel = (trend: CategoryIntelligence['marketShareTrend']): string => {
  if (trend === 'rapidly_growing') return '高速增长'
  if (trend === 'competitive') return '竞争激烈'
  return '平稳发展'
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
    <!-- 页面标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
          <Globe2 class="w-3.5 h-3.5" />
          <span>全球跨境电商宏观市场情报库</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          全球市场大盘与类目机会探测 (Market Intelligence)
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          实时聚合 Amazon、TikTok Shop、Walmart 全球站点的搜索热度与品类供需指数
        </p>
      </div>
    </div>

    <!-- 筛选条：国家 × 平台 × 时间范围 -->
    <div class="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-xs text-slate-400 mr-1 flex items-center gap-1">
          <Globe2 class="w-3.5 h-3.5 text-indigo-400" />
          <span>国家/站点:</span>
        </span>
        <button
          v-for="c in TARGET_MARKETS"
          :key="c"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
          :class="
            selectedCountry === c
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
          "
          @click="selectedCountry = c"
        >
          {{ c }}
        </button>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            v-for="p in PLATFORMS"
            :key="p"
            class="px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
            :class="
              selectedPlatform === p
                ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-white'
            "
            @click="selectedPlatform = p"
          >
            {{ p }}
          </button>
        </div>

        <div class="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs text-slate-300">
          <button
            v-for="t in timeRanges"
            :key="t.id"
            class="px-2 py-1 rounded text-xs cursor-pointer"
            :class="selectedTimeRange === t.id ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'"
            @click="selectedTimeRange = t.id"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 当前筛选组合 · 类目深度透视（Featured） -->
    <div class="bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="text-xs font-mono font-bold text-indigo-400 uppercase">
            {{ activeItem.country }} · {{ activeItem.platform }} · 类目深度透视
          </div>
          <h2 class="text-2xl font-black text-white mt-1">{{ activeItem.category }}</h2>
          <p class="text-xs text-slate-300 mt-1">{{ activeItem.highlight }}</p>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div class="space-y-0.5">
            <div class="text-[10px] text-slate-400">市场机会指数 (Opportunity Index)</div>
            <div class="text-3xl font-black font-mono text-emerald-400">
              {{ activeItem.opportunityIndex }}
              <span class="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 5 项核心指标 -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">需求同比年增速</div>
          <div class="text-xl font-bold font-mono text-emerald-400">{{ activeItem.demandGrowth }}</div>
          <div class="text-[10px] text-slate-400">持续处于高景气周期</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">类目平均售价 (ASP)</div>
          <div class="text-xl font-bold font-mono text-white">${{ activeItem.avgPrice.toFixed(1) }}</div>
          <div class="text-[10px] text-slate-400">最佳定价带 $16 - $28</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">类目平均评分</div>
          <div class="text-xl font-bold font-mono text-amber-400">★ {{ activeItem.avgRating }}</div>
          <div class="text-[10px] text-slate-400">买家容错率良好</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">竞争指数 (越低越好)</div>
          <div class="text-xl font-bold font-mono text-cyan-400">{{ activeItem.competitionIndex }} / 100</div>
          <div class="text-[10px] text-slate-400">头部垄断度可突破</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400">预估年大盘规模</div>
          <div class="text-xl font-bold font-mono text-indigo-400">{{ activeItem.salesVolume }}</div>
          <div class="text-[10px] text-slate-400">大体量高复购</div>
        </div>
      </div>

      <!-- 高增长潜力细分子类目 -->
      <div class="space-y-2">
        <div class="text-xs font-bold text-slate-300">高增长潜力细分子类目 (Top High Growth Subcategories):</div>
        <div v-if="activeItem.topSubcategories.length" class="flex flex-wrap gap-2">
          <span
            v-for="(sub, idx) in activeItem.topSubcategories"
            :key="idx"
            class="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{{ sub }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 6 大品类机会情报卡（全球主要站点类目热度排行对比） -->
    <div class="space-y-4">
      <h3 class="text-base font-bold text-white">全球主要站点类目热度排行对比</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="intel in GLOBAL_CATEGORY_INTEL"
          :key="intel.id"
          class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition"
        >
          <!-- 卡头：站点 + 类目 + 走势徽标 -->
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-[11px] font-mono text-indigo-400 font-semibold">
                {{ intel.country }} · {{ intel.platform }}
              </div>
              <h4 class="text-sm font-bold text-white mt-0.5 leading-snug">{{ intel.category }}</h4>
            </div>

            <div class="flex flex-col items-end gap-1.5 shrink-0">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold whitespace-nowrap"
                :class="trendBadgeClass(intel.marketShareTrend)"
              >
                <TrendingUp v-if="intel.marketShareTrend === 'rapidly_growing'" class="w-3 h-3" />
                <Minus v-else-if="intel.marketShareTrend === 'stable'" class="w-3 h-3" />
                <ShieldAlert v-else class="w-3 h-3" />
                <span>{{ trendLabel(intel.marketShareTrend) }}</span>
              </span>
              <span class="text-xs font-mono font-bold text-emerald-400">{{ intel.demandGrowth }}</span>
              <span class="text-[10px] text-slate-500 -mt-1">需求年增速</span>
            </div>
          </div>

          <!-- 机会指数 + 核心指标 -->
          <div class="bg-slate-950 rounded-xl border border-slate-800/80 p-3 space-y-2.5">
            <div>
              <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>市场机会指数 (Opportunity Index)</span>
                <span class="font-mono font-bold text-emerald-400 text-xs">{{ intel.opportunityIndex }} / 100</span>
              </div>
              <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                  :style="{ width: `${intel.opportunityIndex}%` }"
                ></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-xs pt-0.5">
              <div>
                <span class="text-slate-400 text-[10px] block">类目平均售价</span>
                <span class="font-mono font-bold text-white text-sm">${{ intel.avgPrice.toFixed(1) }}</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block">类目平均评分</span>
                <span class="font-mono font-bold text-amber-400 text-sm">★ {{ intel.avgRating }}</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block">竞争指数 (越低越好)</span>
                <span class="font-mono font-bold text-cyan-400 text-sm">{{ intel.competitionIndex }} / 100</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block">预估年大盘</span>
                <span class="font-mono font-bold text-indigo-400 text-sm">{{ intel.salesVolume }}</span>
              </div>
            </div>
          </div>

          <!-- 热卖子类目 -->
          <div class="space-y-1.5">
            <div class="text-[10px] font-semibold text-slate-400">热卖子类目 (Top Subcategories)</div>
            <div v-if="intel.topSubcategories.length" class="flex flex-wrap gap-1.5">
              <span
                v-for="(sub, idx) in intel.topSubcategories.slice(0, 3)"
                :key="idx"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
              >
                <span class="w-1 h-1 rounded-full bg-emerald-400 shrink-0"></span>
                <span class="truncate max-w-[140px]">{{ sub }}</span>
              </span>
            </div>
          </div>

          <!-- 品类洞察 highlight -->
          <p class="text-[11px] text-slate-300 leading-relaxed flex gap-1.5 items-start">
            <Sparkles class="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
            <span>{{ intel.highlight }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
