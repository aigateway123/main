<!-- 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/settings/SettingsView.tsx -->
<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2, Cpu, DollarSign, Globe, RotateCcw, Settings } from 'lucide-vue-next'
import type { Currency, TargetMarket } from '@/data/ecomIntelData'

defineProps<{
  market: TargetMarket
  currency: Currency
}>()

const emit = defineEmits<{
  (e: 'change-market', market: TargetMarket): void
  (e: 'change-currency', currency: Currency): void
  (e: 'go-home'): void
}>()

// 站点下拉标签（原型文案：市场 + 平台后缀）
const marketOptions: { value: TargetMarket; label: string }[] = [
  { value: '美国', label: '美国 (Amazon US)' },
  { value: '加拿大', label: '加拿大 (Amazon CA)' },
  { value: '英国', label: '英国 (Amazon UK)' },
  { value: '德国', label: '德国 (Amazon DE)' },
  { value: '澳大利亚', label: '澳大利亚 (Amazon AU)' },
  { value: '日本', label: '日本 (Amazon JP)' },
  { value: '新加坡', label: '新加坡 (Shopee SG)' },
]

// ---- 本地偏好设置（原型局部 state，仅保存提示、不上抛） ----
const minMarginFilter = ref(35)
const aiModelMode = ref<'fast' | 'deep' | 'expert'>('deep')
const savedSuccess = ref(false)

const aiModelModes: { value: 'fast' | 'deep' | 'expert'; label: string; desc: string }[] = [
  { value: 'fast', label: '快速模式', desc: '响应快，适合日常批量选品' },
  { value: 'deep', label: '深度模式 (默认)', desc: '多模型交叉验证，结论更稳健' },
  { value: 'expert', label: '专家模式', desc: '最高精度，耗时最长' },
]

const handleMarketChange = (e: Event) => {
  emit('change-market', (e.target as HTMLSelectElement).value as TargetMarket)
}

const handleCurrencyChange = (e: Event) => {
  emit('change-currency', (e.target as HTMLSelectElement).value as Currency)
}

const handleSave = () => {
  savedSuccess.value = true
  window.setTimeout(() => {
    savedSuccess.value = false
  }, 2000)
}

const goHome = () => emit('go-home')
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8 min-h-full">
    <div class="pb-4 border-b border-slate-800">
      <h1 class="text-2xl font-extrabold text-white">系统与智能引擎偏好设置 (Settings)</h1>
      <p class="text-xs text-slate-400 mt-1">
        配置默认调研站点、货币单位、选品机会门槛与 AI 推理模型精度
      </p>
    </div>

    <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
      <!-- Market & Currency -->
      <div class="space-y-4 pb-6 border-b border-slate-800">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <Globe class="w-4 h-4 text-indigo-400" />
          <span>默认跨境目标市场与货币</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-xs text-slate-300">默认调研站点</label>
            <select
              :value="market"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              @change="handleMarketChange"
            >
              <option v-for="opt in marketOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs text-slate-300 flex items-center gap-1">
              <DollarSign class="w-3.5 h-3.5 text-emerald-400" />
              <span>财务结算显示币种</span>
            </label>
            <select
              :value="currency"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              @change="handleCurrencyChange"
            >
              <option value="USD">美元 USD ($)</option>
              <option value="CNY">人民币 CNY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- AI Selection Thresholds -->
      <div class="space-y-4 pb-6 border-b border-slate-800">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <Cpu class="w-4 h-4 text-emerald-400" />
          <span>AI 选品模型筛选门槛</span>
        </h2>

        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-slate-300">最低毛利率硬性过滤门槛</span>
            <span class="font-mono font-bold text-emerald-400 text-sm">≥ {{ minMarginFilter }}%</span>
          </div>
          <input
            v-model.number="minMarginFilter"
            type="range"
            min="20"
            max="60"
            step="5"
            class="w-full accent-indigo-500 h-2 bg-slate-950 rounded cursor-pointer"
          />
          <p class="text-[11px] text-slate-400">
            低于此毛利率预测的产品将自动从「重点推荐」池中降权，确保卖家启动安全边际。
          </p>
        </div>
      </div>

      <!-- AI Inference Precision Mode -->
      <div class="space-y-4 pb-6 border-b border-slate-800">
        <h2 class="text-sm font-bold text-white flex items-center gap-2">
          <Settings class="w-4 h-4 text-amber-400" />
          <span>AI 推理模型精度</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            v-for="mode in aiModelModes"
            :key="mode.value"
            type="button"
            class="p-3 rounded-lg border text-left transition cursor-pointer"
            :class="
              aiModelMode === mode.value
                ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            "
            @click="aiModelMode = mode.value"
          >
            <div class="font-bold flex items-center gap-1.5">
              <CheckCircle2
                v-if="aiModelMode === mode.value"
                class="w-3.5 h-3.5 text-indigo-400"
              />
              {{ mode.label }}
            </div>
            <div class="text-[11px] text-slate-400 mt-1 leading-relaxed">{{ mode.desc }}</div>
          </button>
        </div>
      </div>

      <!-- Save & Back Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div class="text-xs text-slate-400" v-if="!savedSuccess">
          当前选择将在本地保存并即时作用于后续选品任务
        </div>
        <span v-else class="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
          <CheckCircle2 class="w-4 h-4" />
          设置已成功保存并实时生效
        </span>

        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            @click="goHome"
          >
            <RotateCcw class="w-3.5 h-3.5 text-slate-400" />
            <span>返回首页</span>
          </button>
          <button
            type="button"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            @click="handleSave"
          >
            保存偏好配置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
