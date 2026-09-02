<script setup lang="ts">
// AI 全球市场情报分析 —— 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/MarketIntelligenceView.tsx
import { ref, computed } from 'vue'
import { MapPin, BarChart3, Sparkles, ShieldCheck } from 'lucide-vue-next'
import { mockMarketOpportunities } from '@/data/tradeIntelData'
import type { MarketOpportunity } from '@/data/tradeIntelData'

const selectedRegionId = ref('mkt-01')
const productQuery = ref('铝合金门窗')
const marketQuery = ref('美国')

const selectedRegion = computed<MarketOpportunity>(
  () => mockMarketOpportunities.find((m) => m.id === selectedRegionId.value) || mockMarketOpportunities[0],
)

const productTrends = [
  { name: '断桥铝节能系统窗 (Thermal Break)', share: '38%', growth: '+12.4%', demand: '极高 (节能补贴催化)' },
  { name: '超窄边全景推拉门 (Slimline Panoramic)', share: '24%', growth: '+18.5%', demand: '高 (现代建筑极简风)' },
  { name: 'Low-E中空钢化玻璃门窗 (Double/Triple Low-E)', share: '21%', growth: '+9.2%', demand: '高 (加州Title 24标配)' },
  { name: '防飓风抗冲击门窗 (Impact-Resistant)', share: '12%', growth: '+15.1%', demand: '极高 (佛州沿海法律强制)' },
  { name: '商业建筑铝合金幕墙 (Commercial Curtain Wall)', share: '5%', growth: '+6.0%', demand: '稳定 (公建地产)' },
]
</script>

<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- 1. Header & Dynamic Query Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">AI 全球市场情报分析</h2>
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            实时宏观与区域洞察
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          聚合北美、澳洲、欧洲及东南亚的进口关税、能效建筑法案、需求增长率与热销品类动向
        </p>
      </div>

      <!-- Input Bar -->
      <div class="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-md text-xs shadow-xs">
        <span class="text-slate-500 pl-2">分析品类:</span>
        <input
          v-model="productQuery"
          type="text"
          class="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500"
        />
        <span class="text-slate-500">目标市场:</span>
        <input
          v-model="marketQuery"
          type="text"
          class="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500"
        />
        <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs">
          <Sparkles class="w-3 h-3" />
          <span>刷新分析</span>
        </button>
      </div>
    </div>

    <!-- 2. Top Big Metrics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
        <span class="text-slate-500 text-xs font-medium">目标市场总体规模</span>
        <div class="mt-2 text-2xl font-extrabold text-slate-900 font-mono">$18.4 Billion</div>
        <span class="text-[10px] text-emerald-600 mt-1 font-semibold">↑ 年复合增长率 +7.8%</span>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
        <span class="text-slate-500 text-xs font-medium">海外供应链进口依赖度</span>
        <div class="mt-2 text-2xl font-extrabold text-blue-600 font-mono">42.5%</div>
        <span class="text-[10px] text-slate-400 mt-1">本地产能缺口持续扩大</span>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
        <span class="text-slate-500 text-xs font-medium">主要需求聚集区</span>
        <div class="mt-2 text-lg font-bold text-slate-800 truncate">加州 / 德州 / 佛州</div>
        <span class="text-[10px] text-slate-400 mt-1">占全美总需求量 64%</span>
      </div>

      <div class="p-4 rounded-xl bg-white border border-blue-200 bg-blue-50/20 flex flex-col justify-between shadow-xs">
        <span class="text-blue-800 text-xs font-semibold">综合市场机会指数</span>
        <div class="mt-2 text-2xl font-black text-blue-600 font-mono">86 <span class="text-xs text-slate-400 font-normal">/ 100</span></div>
        <span class="text-[10px] text-emerald-700 mt-1 font-semibold">极高准入与扩张潜力</span>
      </div>
    </div>

    <!-- 3. Regional Opportunities Grid & Detailed Deep Dive -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Regional Selector Cards (Left 5 cols) -->
      <div class="lg:col-span-5 space-y-3">
        <div class="flex items-center justify-between pb-1">
          <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin class="w-4 h-4 text-blue-600" />
            <span>核心目标区域机会指数排行</span>
          </h3>
          <span class="text-[10px] text-slate-400">点击切换分析详情</span>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="mkt in mockMarketOpportunities"
            :key="mkt.id"
            @click="selectedRegionId = mkt.id"
            class="p-4 rounded-xl border transition-all cursor-pointer"
            :class="
              mkt.id === selectedRegionId
                ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            "
          >
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-xs font-bold" :class="mkt.id === selectedRegionId ? 'text-blue-900' : 'text-slate-800'">
                  {{ mkt.region }}
                </h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  市场规模: {{ mkt.marketSize }} · 增速 {{ mkt.growthRate }}
                </p>
              </div>

              <div class="text-right shrink-0">
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200">
                  指数 {{ mkt.opportunityIndex }}
                </span>
              </div>
            </div>

            <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span
                v-for="(r, i) in mkt.mainDemandRegions.slice(0, 3)"
                :key="i"
                class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
              >
                {{ r }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Region Detailed Dossier (Right 7 cols) -->
      <div class="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span class="text-[10px] text-blue-600 font-semibold font-mono tracking-wider">SELECTED MARKET DOSSIER</span>
            <h3 class="text-base font-bold text-slate-900 mt-0.5">{{ selectedRegion.region }}</h3>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-400 block">机会指数</span>
            <span class="text-2xl font-black text-blue-600 font-mono">{{ selectedRegion.opportunityIndex }} / 100</span>
          </div>
        </div>

        <!-- Policy & Regulations -->
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            <span>政策风向与准入规范 (Regulations & Standards)</span>
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            {{ selectedRegion.policySummary }}
          </p>
          <div class="pt-2 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
            <strong>准入壁垒提醒：</strong>{{ selectedRegion.entryBarrier }}
          </div>
        </div>

        <!-- Key Customer Types -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
            主要买家渠道群体
          </h4>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div
              v-for="(cust, i) in selectedRegion.keyCustomerTypes"
              :key="i"
              class="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>{{ cust }}</span>
            </div>
          </div>
        </div>

        <!-- AI Strategic Recommendation -->
        <div class="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1 text-xs">
          <div class="font-bold text-blue-900 flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-blue-600" />
            <span>AI 市场开拓落地建议:</span>
          </div>
          <p class="text-slate-700 leading-relaxed">
            {{ selectedRegion.aiRecommendation }}
          </p>
        </div>
      </div>
    </div>

    <!-- 4. Product Category Trends Breakdown -->
    <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 class="w-4 h-4 text-blue-600" />
            <span>北美及国际市场铝合金门窗细分产品需求趋势</span>
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            基于海关进口HS 7610大类与各州新房开工报批图纸统计
          </p>
        </div>
      </div>

      <div class="space-y-2.5">
        <div
          v-for="(trend, idx) in productTrends"
          :key="idx"
          class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        >
          <div class="space-y-0.5 md:w-1/3">
            <div class="font-bold text-slate-800">{{ trend.name }}</div>
            <div class="text-[11px] text-slate-500">市场份额占比: <strong class="text-slate-800">{{ trend.share }}</strong></div>
          </div>

          <div class="md:w-1/4">
            <span class="text-slate-500 text-[11px] block">年需求增速</span>
            <span class="text-emerald-600 font-bold font-mono text-sm">{{ trend.growth }}</span>
          </div>

          <div class="md:w-1/3">
            <span class="text-slate-500 text-[11px] block">驱动因素</span>
            <span class="text-blue-700 text-xs font-medium">{{ trend.demand }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
