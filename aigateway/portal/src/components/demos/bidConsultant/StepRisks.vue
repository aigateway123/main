<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileWarning,
  Lightbulb,
  Quote,
  ShieldAlert
} from 'lucide-vue-next'
import type { DisqualificationRiskItem } from '@/data/bidConsultantData'
import { copyToClipboard } from '@/data/bidConsultantData'

interface Props {
  risks: DisqualificationRiskItem[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

type RiskTab = 'all' | 'high' | 'medium' | 'low'

const copiedId = ref<string | null>(null)
const activeRiskTab = ref<RiskTab>('all')

const highRisks = computed(() => props.risks.filter((r) => r.riskLevel === 'high'))
const mediumRisks = computed(() => props.risks.filter((r) => r.riskLevel === 'medium'))
const lowRisks = computed(() => props.risks.filter((r) => r.riskLevel === 'low'))

const isHigh = (risk: DisqualificationRiskItem) => risk.riskLevel === 'high'
const isMedium = (risk: DisqualificationRiskItem) => risk.riskLevel === 'medium'

const formatRiskText = (risk: DisqualificationRiskItem) =>
  `【${risk.title}】\n原文要求：${risk.originalQuote}\n风险解释：${risk.riskExplanation}\n建议动作：${risk.suggestedAction}`

const handleCopy = (id: string, text: string) => {
  copyToClipboard(text).then((ok) => {
    if (ok) {
      copiedId.value = id
      setTimeout(() => (copiedId.value = null), 2000)
    }
  })
}

const displayRisks = computed(() => {
  if (activeRiskTab.value === 'all') return props.risks
  return props.risks.filter((r) => r.riskLevel === activeRiskTab.value)
})
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Header Bento Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-red-50/70 border border-red-200 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldAlert class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                第三步：⚠️ 废标风险清单（一票否决项）
              </h2>
              <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold border border-red-200">
                最高警戒
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">
              按风险等级严格分类。不满足高风险项将直接导致【无效投标/废标】。每项均含「原文要求 + 风险解释 + 建议动作」。
            </p>
          </div>
        </div>

        <!-- Quick counts -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="activeRiskTab = 'high'"
            :class="activeRiskTab === 'high' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            🔴 高风险 ({{ highRisks.length }})
          </button>
          <button
            @click="activeRiskTab = 'medium'"
            :class="activeRiskTab === 'medium' ? 'bg-amber-500 text-white font-extrabold shadow-sm' : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            🟡 中风险 ({{ mediumRisks.length }})
          </button>
          <button
            @click="activeRiskTab = 'low'"
            :class="activeRiskTab === 'low' ? 'bg-emerald-600 text-white font-extrabold shadow-sm' : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            🟢 低风险 ({{ lowRisks.length }})
          </button>
          <button
            v-if="activeRiskTab !== 'all'"
            @click="activeRiskTab = 'all'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
          >
            查看全部
          </button>
        </div>
      </div>
    </div>

    <!-- Risk Items Cards List -->
    <div class="space-y-4">
      <div
        v-for="risk in displayRisks"
        :key="risk.id"
        :class="isHigh(risk) ? 'bg-white border-red-300 ring-1 ring-red-100' : isMedium(risk) ? 'bg-white border-amber-300' : 'bg-white border-slate-200'"
        class="rounded-2xl border p-5 sm:p-6 transition-all relative shadow-sm"
      >
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-2.5">
            <span
              :class="isHigh(risk) ? 'bg-red-50 text-red-700 border border-red-200' : isMedium(risk) ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
              class="px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5"
            >
              {{ isHigh(risk) ? '🔴 废标高风险' : isMedium(risk) ? '🟡 中度扣分风险' : '🟢 优化建议' }}
            </span>

            <span class="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              {{ risk.category }}
            </span>
          </div>

          <button
            @click="handleCopy(risk.id, formatRiskText(risk))"
            class="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="复制该项风险条目供团队沟通"
          >
            <template v-if="copiedId === risk.id">
              <Check class="w-3.5 h-3.5 text-emerald-600" />
              <span class="text-emerald-700 font-bold">已复制</span>
            </template>
            <template v-else>
              <Copy class="w-3.5 h-3.5 text-slate-500" />
              <span class="font-semibold">复制风险</span>
            </template>
          </button>
        </div>

        <!-- Title -->
        <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-4">
          {{ risk.title }}
        </h3>

        <!-- 3-Section Breakdown (Mandatory prompt format: 原文要求 + 风险解释 + 建议动作) -->
        <div class="grid grid-cols-1 gap-3 sm:gap-3.5 text-xs sm:text-sm">
          <!-- 1. 原文要求 -->
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1">
              <Quote class="w-3.5 h-3.5" />
              <span>【招标文件原文要求】：</span>
            </div>
            <p class="text-slate-800 leading-relaxed font-mono text-xs pl-2 border-l-2 border-blue-500">
              {{ risk.originalQuote }}
            </p>
          </div>

          <!-- 2. 风险解释 -->
          <div class="p-3.5 rounded-xl bg-red-50/60 border border-red-200">
            <div class="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-1">
              <FileWarning class="w-3.5 h-3.5" />
              <span>【潜在风险深度解释】：</span>
            </div>
            <p class="text-slate-800 leading-relaxed pl-2 border-l-2 border-red-500 font-medium">
              {{ risk.riskExplanation }}
            </p>
          </div>

          <!-- 3. 建议动作 -->
          <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
              <Lightbulb class="w-3.5 h-3.5" />
              <span>【顾问建议动作 &amp; 防御措施】：</span>
            </div>
            <p class="text-emerald-900 font-semibold leading-relaxed pl-2 border-l-2 border-emerald-600">
              {{ risk.suggestedAction }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between pt-2">
      <button
        @click="$emit('prev-step')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>返回：资格审查</span>
      </button>

      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>下一步：评标规则拆解</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
