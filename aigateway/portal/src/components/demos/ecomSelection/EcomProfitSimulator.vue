<script setup lang="ts">
// 共享「利润测算器」：产品详情利润 Tab 与独立利润测算页共用一套
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/profit/StandaloneProfitCalcView.tsx
// 通过 seed 传入产品真实经济参数作为默认值（缺省时回落原型默认宠物随行杯参数）
import { computed, ref, watch } from 'vue'
import { DollarSign, Percent, TrendingUp, ShieldCheck, Calculator } from 'lucide-vue-next'

interface ProfitSeed {
  sellingPrice?: number
  sourcingCost?: number
  shippingCost?: number
  platformFee?: number
  adCost?: number
  otherCost?: number
}

const props = withDefaults(
  defineProps<{
    seed?: ProfitSeed
  }>(),
  {},
)

const DEFAULTS = {
  sellingPrice: 19.99,
  sourcingCost: 4.8,
  shippingCost: 3.2,
  platformFee: 3.5,
  adCost: 1.8,
  otherCost: 0.7,
}

const sellingPrice = ref(DEFAULTS.sellingPrice)
const sourcingCost = ref(DEFAULTS.sourcingCost)
const shippingCost = ref(DEFAULTS.shippingCost)
const platformFee = ref(DEFAULTS.platformFee)
const adCost = ref(DEFAULTS.adCost)
const otherCost = ref(DEFAULTS.otherCost)
const returnRate = ref(3.0)
const monthlyVolume = ref(1000)

// seed 变化（切换产品）时重置默认值
watch(
  () => props.seed,
  (s) => {
    if (!s) return
    sellingPrice.value = s.sellingPrice ?? DEFAULTS.sellingPrice
    sourcingCost.value = s.sourcingCost ?? DEFAULTS.sourcingCost
    shippingCost.value = s.shippingCost ?? DEFAULTS.shippingCost
    platformFee.value = s.platformFee ?? DEFAULTS.platformFee
    adCost.value = s.adCost ?? DEFAULTS.adCost
    otherCost.value = s.otherCost ?? DEFAULTS.otherCost
    returnRate.value = 3.0
    monthlyVolume.value = 1000
  },
  { immediate: true },
)

const totalCost = computed(
  () =>
    sourcingCost.value +
    shippingCost.value +
    platformFee.value +
    adCost.value +
    otherCost.value +
    (sellingPrice.value * returnRate.value) / 100,
)
const unitProfit = computed(() => Math.max(0, sellingPrice.value - totalCost.value))
const grossMargin = computed(() => (sellingPrice.value > 0 ? (unitProfit.value / sellingPrice.value) * 100 : 0))
const monthlyRevenue = computed(() => sellingPrice.value * monthlyVolume.value)
const monthlyProfit = computed(() => unitProfit.value * monthlyVolume.value)
const roi = computed(() => (totalCost.value > 0 ? (unitProfit.value / totalCost.value) * 100 : 0))
const returnLoss = computed(() => otherCost.value + (sellingPrice.value * returnRate.value) / 100)

const reset = () => {
  sellingPrice.value = props.seed?.sellingPrice ?? DEFAULTS.sellingPrice
  sourcingCost.value = props.seed?.sourcingCost ?? DEFAULTS.sourcingCost
  shippingCost.value = props.seed?.shippingCost ?? DEFAULTS.shippingCost
  platformFee.value = props.seed?.platformFee ?? DEFAULTS.platformFee
  adCost.value = props.seed?.adCost ?? DEFAULTS.adCost
  otherCost.value = props.seed?.otherCost ?? DEFAULTS.otherCost
  returnRate.value = 3.0
  monthlyVolume.value = 1000
}

const sliders = [
  {
    key: 'sellingPrice' as const,
    label: '产品建议售价 (Listing Price)',
    min: 10,
    max: 50,
    step: 0.5,
    accent: 'accent-indigo-500',
  },
  {
    key: 'sourcingCost' as const,
    label: '工厂采购成本 (FOB)',
    min: 1,
    max: 20,
    step: 0.2,
    accent: 'accent-indigo-500',
  },
  {
    key: 'shippingCost' as const,
    label: '头程国际物流 (海运/空运摊销)',
    min: 0.5,
    max: 15,
    step: 0.2,
    accent: 'accent-indigo-500',
  },
  {
    key: 'platformFee' as const,
    label: '平台佣金 (15%) + FBA 配送操作费',
    min: 1,
    max: 12,
    step: 0.2,
    accent: 'accent-indigo-500',
  },
  {
    key: 'adCost' as const,
    label: '预估 PPC 广告摊销 / 件',
    min: 0,
    max: 10,
    step: 0.2,
    accent: 'accent-indigo-500',
  },
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Left Inputs -->
    <div class="lg:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <DollarSign class="w-4 h-4 text-emerald-400" />
          单件核心财务变量输入
        </h2>
        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold cursor-pointer"
          @click="reset"
        >
          <span>重置默认参数</span>
        </button>
      </div>

      <div class="space-y-3.5">
        <div v-for="s in sliders" :key="s.key" class="space-y-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-medium">{{ s.label }}</span>
            <span class="font-mono font-bold text-slate-100 text-sm">
              ${{ (s.key === 'sellingPrice' ? sellingPrice : s.key === 'sourcingCost' ? sourcingCost : s.key === 'shippingCost' ? shippingCost : s.key === 'platformFee' ? platformFee : adCost).toFixed(2) }}
              <span v-if="s.key === 'sourcingCost'" class="text-slate-400 font-normal text-xs">
                (约¥{{ ((s.key === 'sourcingCost' ? sourcingCost : 0) * 7.2).toFixed(1) }})
              </span>
            </span>
          </div>
          <input
            type="range"
            :min="s.min"
            :max="s.max"
            :step="s.step"
            :value="s.key === 'sellingPrice' ? sellingPrice : s.key === 'sourcingCost' ? sourcingCost : s.key === 'shippingCost' ? shippingCost : s.key === 'platformFee' ? platformFee : adCost"
            class="w-full h-2 bg-slate-950 rounded cursor-pointer"
            :class="s.accent"
            @input="
              (e) => {
                const v = Number((e.target as HTMLInputElement).value)
                if (s.key === 'sellingPrice') sellingPrice = v
                else if (s.key === 'sourcingCost') sourcingCost = v
                else if (s.key === 'shippingCost') shippingCost = v
                else if (s.key === 'platformFee') platformFee = v
                else adCost = v
              }
            "
          />
        </div>

        <!-- Return Rate -->
        <div class="space-y-1.5">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300 font-medium">预估退货率 (Return Rate)</span>
            <span class="font-mono font-bold text-amber-400 text-sm">{{ returnRate.toFixed(1) }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            v-model.number="returnRate"
            class="w-full accent-amber-500 h-2 bg-slate-950 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>

    <!-- Right Output -->
    <div class="lg:col-span-5 space-y-5">
      <!-- Unit Profit Card -->
      <div class="bg-gradient-to-br from-indigo-950/80 to-slate-900 p-5 rounded-2xl border border-indigo-500/40 space-y-3.5 shadow-xl">
        <div class="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <Calculator class="w-3.5 h-3.5" />
          单件利润与盈亏拆解
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between text-slate-300">
            <span>销售价格:</span>
            <span class="font-mono font-bold text-white">${{ sellingPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>- 采购成本:</span>
            <span class="font-mono">${{ sourcingCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>- 物流成本:</span>
            <span class="font-mono">${{ shippingCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>- 平台费用:</span>
            <span class="font-mono">${{ platformFee.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>- 广告成本:</span>
            <span class="font-mono">${{ adCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>- 退货及杂项损耗:</span>
            <span class="font-mono">${{ returnLoss.toFixed(2) }}</span>
          </div>

          <div class="border-t border-slate-800 pt-2.5 flex justify-between items-baseline">
            <span class="font-bold text-white text-sm">单件净利润:</span>
            <span class="font-mono font-black text-2xl text-emerald-400">${{ unitProfit.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between items-baseline">
            <span class="font-bold text-slate-300 text-xs">预计毛利率 (Gross Margin):</span>
            <span class="font-mono font-bold text-lg text-cyan-400">{{ grossMargin.toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <!-- Volume Scale Simulator -->
      <div class="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <TrendingUp class="w-3.5 h-3.5 text-indigo-400" />
          月度销量收益模拟
        </div>

        <div class="grid grid-cols-4 gap-1.5">
          <button
            v-for="vol in [500, 1000, 3000, 5000]"
            :key="vol"
            type="button"
            class="py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer"
            :class="monthlyVolume === vol ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'"
            @click="monthlyVolume = vol"
          >
            {{ vol }} 件
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div class="text-[10px] text-slate-400">月预估销售额</div>
            <div class="text-sm font-mono font-bold text-white mt-0.5">${{ Math.round(monthlyRevenue).toLocaleString() }}</div>
          </div>
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div class="text-[10px] text-slate-400">月预估净利润</div>
            <div class="text-sm font-mono font-bold text-emerald-400 mt-0.5">${{ Math.round(monthlyProfit).toLocaleString() }}</div>
          </div>
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div class="text-[10px] text-slate-400">资金年化 ROI</div>
            <div class="text-sm font-mono font-bold text-cyan-400 mt-0.5">{{ roi.toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <!-- 达标提示 -->
      <div
        class="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs border"
        :class="grossMargin >= 35 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'"
      >
        <ShieldCheck class="w-4 h-4 shrink-0" />
        <span>
          当前毛利率 <b>{{ grossMargin.toFixed(1) }}%</b>
          {{ grossMargin >= 35 ? '≥ 目标毛利 35%，模型判定该定价方案可行' : '未达目标毛利 35%，建议上调售价或压缩采购/广告成本' }}
        </span>
        <Percent class="w-3.5 h-3.5 shrink-0 ml-auto opacity-70" />
      </div>
    </div>
  </div>
</template>
