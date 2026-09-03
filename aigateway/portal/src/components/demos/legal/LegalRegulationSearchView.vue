<!-- ============================================================================
     AI 法务员工 · 法规检索与商业合规咨询（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/regulations/RegulationSearchView.tsx
     数据：MOCK_REGULATION_QUERIES（legalMockData，3 条法规情报逐条忠实渲染）
     v4→v3 映射：shadow-xs→shadow-sm、focus:outline-hidden→focus:outline-none
     图标映射：CheckCircle2→CircleCheck（lucide-vue-next 0.577 新命名）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { BookOpen, Check, CircleCheck, Copy, Search, Sparkles } from 'lucide-vue-next'
import { MOCK_REGULATION_QUERIES } from '@/data/legalMockData'
import type { RegulationQueryItem } from '@/data/legalIntelData'

// 高频场景推荐（照原型逐字）
const HOT_PRESET_QUERIES = [
  '新能源储能设备出口合规与法律风险',
  '企业高管离职竞业限制与劳动用工',
  '海外商标侵权与知识产权诉讼抗辩',
  '数据跨境传输合规与个人信息保护',
  '广告法极限词与产品宣传合规',
  '新电池法碳足迹合规要求',
]

// 适用司法管辖区筛选（照原型固定四档）
const MARKETS: string[] = ['all', '中国', '美国', '欧盟']

const searchQuery = ref('')
const selectedMarket = ref<string>('all')
const copiedId = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const filteredQueries = computed<RegulationQueryItem[]>(() => {
  return MOCK_REGULATION_QUERIES.filter((item) => {
    const matchesMarket =
      selectedMarket.value === 'all' ||
      item.targetMarkets.some((m) => m.includes(selectedMarket.value))
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !searchQuery.value ||
      item.query.toLowerCase().includes(q) ||
      item.businessScenario.toLowerCase().includes(q) ||
      item.legalIssues.some((issue) => issue.toLowerCase().includes(q)) ||
      item.relevantRegulations.some((r) => r.name.toLowerCase().includes(q))
    return matchesMarket && matchesSearch
  })
})

// 复制整份研判文本（照原型拼接格式）
const handleCopy = (item: RegulationQueryItem) => {
  const text = `【AI法规研判与合规方案】\n业务场景：${item.businessScenario}\n核心法规：${item.relevantRegulations.map((r) => r.name).join('；')}\nAI通俗解读：${item.aiPlainExplanation}\n建议应对步骤：\n${item.recommendedSteps.join('\n')}`
  navigator.clipboard.writeText(text)
  copiedId.value = item.id
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

// AI 智能检索按钮：照原型为空实现（接入真实检索服务后启用）
const handleAiSearch = () => {}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          企业级法规情报与智能研判
        </span>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
        法律法规检索与商业合规咨询
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        支持自然语言场景化提问，AI法务自动关联适用法律条款、合规要点及通俗业务解读
      </p>
    </div>

    <!-- Natural Language Search Box -->
    <div class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
      <div class="relative flex items-center">
        <Search class="w-5 h-5 absolute left-4 text-blue-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="输入企业日常涉法问题（如：向美国出口储能设备需防范哪些产品责任和出口管制法规？）..."
          class="w-full pl-12 pr-28 py-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        />
        <button
          type="button"
          @click="handleAiSearch"
          class="absolute right-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          AI智能检索
        </button>
      </div>

      <!-- Hot queries -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="text-slate-400 font-medium">高频场景推荐：</span>
        <button
          v-for="preset in HOT_PRESET_QUERIES"
          :key="preset"
          type="button"
          @click="searchQuery = preset"
          class="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 hover:text-blue-300 text-slate-300 text-xs transition-colors cursor-pointer border border-slate-700/60"
        >
          {{ preset }}
        </button>
      </div>
    </div>

    <!-- Target Market Filter -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <span class="text-slate-400 font-medium whitespace-nowrap">适用司法管辖区：</span>
      <button
        v-for="market in MARKETS"
        :key="market"
        type="button"
        @click="selectedMarket = market"
        class="px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer"
        :class="
          selectedMarket === market
            ? 'bg-blue-600 text-white'
            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
        "
      >
        {{ market === 'all' ? '全部法域' : market }}
      </button>
    </div>

    <!-- Search Results List -->
    <div class="space-y-6">
      <div
        v-for="item in filteredQueries"
        :key="item.id"
        class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm hover:border-slate-700 transition-all space-y-5"
      >
        <!-- Question Bar -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 text-[11px] font-bold border border-blue-800/60">
                {{ item.businessScenario }}
              </span>
              <span
                v-for="m in item.targetMarkets"
                :key="m"
                class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
              >
                {{ m }}
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-100 leading-snug">
              {{ item.query }}
            </h3>
          </div>

          <button
            type="button"
            @click="handleCopy(item)"
            class="self-start inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white font-medium px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <template v-if="copiedId === item.id">
              <Check class="w-3.5 h-3.5 text-emerald-400" />
              <span class="text-emerald-400">已复制研判</span>
            </template>
            <template v-else>
              <Copy class="w-3.5 h-3.5 text-slate-400" />
              <span>复制研判</span>
            </template>
          </button>
        </div>

        <!-- AI Plain Language Explanation -->
        <div class="p-4 rounded-xl bg-blue-950/25 border border-blue-800/40 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-blue-300">
            <Sparkles class="w-4 h-4 text-blue-400" />
            <span>AI 法务通俗化业务解读（大白话释法）</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {{ item.aiPlainExplanation }}
          </p>
        </div>

        <!-- Relevant Laws & Articles -->
        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <BookOpen class="w-3.5 h-3.5 text-slate-400" />
            <span>关联合同法条与监管标准 ({{ item.relevantRegulations.length }} 项)</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(reg, idx) in item.relevantRegulations"
              :key="idx"
              class="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-200 line-clamp-1">{{ reg.name }}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                  {{ reg.category }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                <strong class="text-slate-300">重点法条：</strong>{{ reg.keyArticles }}
              </p>
              <div class="text-[11px] text-emerald-400 pt-1 border-t border-slate-800/80 flex items-start gap-1">
                <CircleCheck class="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                <span>合规要点：{{ reg.compliancePoints }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Steps -->
        <div class="pt-3 border-t border-slate-800">
          <div class="text-xs font-bold text-slate-200 mb-2">企业实务建议应对路径：</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="(step, idx) in item.recommendedSteps"
              :key="idx"
              class="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg"
            >
              <span class="w-4 h-4 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                {{ idx + 1 }}
              </span>
              <span>{{ step }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空态（当前法域/关键词无匹配情报） -->
      <div
        v-if="filteredQueries.length === 0"
        class="bg-slate-900/60 rounded-2xl border border-slate-800 p-10 text-center text-sm text-slate-400"
      >
        当前筛选条件下暂无匹配的法规研判情报，请调整「适用司法管辖区」或更换检索关键词。
      </div>
    </div>
  </div>
</template>
