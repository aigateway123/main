<script setup lang="ts">
// ============================================================================
// 知识产权 · AI 知识产权顾问 —— 知识产权风险地图视图
// 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/RiskAnalysisView.tsx
// 数据：MOCK_RISK_ITEMS（20 项）
// 交互：高/中/低风险总览卡（点击切换筛选）、等级分段 + 技术领域下拉 +
//       关键词搜索、风险明细表行点击 → 打开 IpRiskDetailModal 白盒比对
// ============================================================================
import { computed, ref } from 'vue'
import { ChevronRight, Search } from 'lucide-vue-next'
import { MOCK_RISK_ITEMS } from '@/data/ipMockData'
import { IP_TECHNICAL_FIELDS } from '@/data/ipIntelData'
import type { RiskItem, RiskLevel } from '@/data/ipIntelData'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'
import IpRiskDetailModal from './IpRiskDetailModal.vue'

type LevelFilter = 'all' | RiskLevel

// ---- 筛选与搜索状态 ----
const filterLevel = ref<LevelFilter>('all')
const filterField = ref<string>('all')
const searchQuery = ref('')
// 当前选中风险（打开弹窗）
const selectedRisk = ref<RiskItem | null>(null)

// ---- 风险等级计数（由数据派生，总览卡/分段按钮共用） ----
const riskCounts = computed(() => {
  const high = MOCK_RISK_ITEMS.filter((i) => i.riskLevel === 'high').length
  const medium = MOCK_RISK_ITEMS.filter((i) => i.riskLevel === 'medium').length
  const low = MOCK_RISK_ITEMS.filter((i) => i.riskLevel === 'low').length
  return { total: MOCK_RISK_ITEMS.length, high, medium, low }
})

// ---- 风险等级主题（pill/圆点/进度配色：high=rose、medium=amber、low=emerald） ----
const riskMeta: Record<RiskLevel, { dot: string; pill: string; scoreText: string; label: string }> = {
  high: { dot: 'bg-rose-600', pill: 'bg-rose-100 text-rose-700 border border-rose-200', scoreText: 'text-rose-600', label: '高' },
  medium: { dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700 border border-amber-200', scoreText: 'text-amber-600', label: '中' },
  low: { dot: 'bg-emerald-500', pill: 'bg-emerald-100 text-emerald-700 border border-emerald-200', scoreText: 'text-slate-600', label: '低' },
}

// 总览卡选中态主题
const tierTheme: Record<RiskLevel, { bar: string; selected: string; dot: string; title: string; badge: string; count: string }> = {
  high: {
    bar: 'border-l-red-500',
    selected: 'ring-1 ring-rose-500 border-rose-300 bg-rose-50/50',
    dot: 'bg-rose-600 animate-ping',
    title: 'text-rose-950',
    badge: 'bg-rose-100 text-rose-800',
    count: 'text-rose-700',
  },
  medium: {
    bar: 'border-l-amber-500',
    selected: 'ring-1 ring-amber-500 border-amber-300 bg-amber-50/50',
    dot: 'bg-amber-500',
    title: 'text-amber-950',
    badge: 'bg-amber-100 text-amber-800',
    count: 'text-amber-700',
  },
  low: {
    bar: 'border-l-emerald-500',
    selected: 'ring-1 ring-emerald-500 border-emerald-300 bg-emerald-50/50',
    dot: 'bg-emerald-500',
    title: 'text-emerald-950',
    badge: 'bg-emerald-100 text-emerald-800',
    count: 'text-emerald-700',
  },
}

// 3 张风险等级总览卡（结构照原型，数值走 riskCounts）
const tierCards: { key: RiskLevel; title: string; badgeText: string; desc: string }[] = [
  {
    key: 'high',
    title: '🔴 高风险',
    badgeText: '需紧急规避',
    desc: '核心专利权利要求字面或等同重合度≥80%，主管路等程分流与底部导热结构。',
  },
  {
    key: 'medium',
    title: '🟠 中风险',
    badgeText: '进一步检索',
    desc: '涉及BMS极差温差自适应算法、冷凝水收集槽与水冷升压舱控制。',
  },
  {
    key: 'low',
    title: '🟢 低风险',
    badgeText: '持续监控',
    desc: '通用公知技术或市场成熟采购标准件，已有充分现有技术抗辩证据。',
  },
]

// ---- 风险列表筛选 ----
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return MOCK_RISK_ITEMS.filter((item) => {
    const matchesLevel = filterLevel.value === 'all' || item.riskLevel === filterLevel.value
    const matchesField = filterField.value === 'all' || item.technicalField === filterField.value
    const matchesSearch =
      q === '' ||
      item.title.toLowerCase().includes(q) ||
      item.relatedPatentId.toLowerCase().includes(q) ||
      item.patentApplicant.toLowerCase().includes(q) ||
      item.technicalField.toLowerCase().includes(q)
    return matchesLevel && matchesField && matchesSearch
  })
})

// 总览卡点击 → 切换该等级筛选（再次点击恢复全部）
const toggleLevelFilter = (level: RiskLevel) => {
  filterLevel.value = filterLevel.value === level ? 'all' : level
}

const setLevelFilter = (level: LevelFilter) => {
  filterLevel.value = level
}

const openRisk = (item: RiskItem) => {
  selectedRisk.value = item
}

const closeRisk = () => {
  selectedRisk.value = null
}
</script>

<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 标题与总览 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span class="w-1 h-4 bg-red-600 rounded-full"></span>
          <span>AI风险分析</span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            共排查 {{ riskCounts.total }} 项潜在风险
          </span>
        </h2>
        <p class="text-[11px] text-slate-500 mt-0.5">
          基于多通道液冷储能系统技术架构，对标CATL、BYD、Tesla授权及在审专利权利要求
        </p>
      </div>
    </div>

    <!-- 风险等级总览卡 (High / Medium / Low) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div
        v-for="card in tierCards"
        :key="card.key"
        class="p-3 rounded-lg border transition-all cursor-pointer border-l-4 shadow-sm"
        :class="[
          tierTheme[card.key].bar,
          filterLevel === card.key ? tierTheme[card.key].selected : 'border-slate-200 bg-white hover:border-slate-300',
        ]"
        @click="toggleLevelFilter(card.key)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" :class="tierTheme[card.key].dot"></span>
            <h3 class="font-bold text-xs" :class="tierTheme[card.key].title">{{ card.title }}</h3>
          </div>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" :class="tierTheme[card.key].badge">
            {{ card.badgeText }}
          </span>
        </div>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl font-extrabold font-mono" :class="tierTheme[card.key].count">
            {{ riskCounts[card.key] }}
          </span>
          <span class="text-[11px] text-slate-500 font-medium">项</span>
        </div>
        <p class="text-[10px] text-slate-500 mt-1 leading-snug">
          {{ card.desc }}
        </p>
      </div>
    </div>

    <!-- 搜索 & 筛选栏 -->
    <div class="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5">
      <div class="relative w-full md:w-72">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索风险事项、专利号、申请人..."
          class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <!-- 风险等级分段 -->
        <div class="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterLevel === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'"
            @click="setLevelFilter('all')"
          >
            全部
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterLevel === 'high' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'"
            @click="setLevelFilter('high')"
          >
            高风险 ({{ riskCounts.high }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterLevel === 'medium' ? 'bg-amber-500 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'"
            @click="setLevelFilter('medium')"
          >
            中风险
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterLevel === 'low' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'"
            @click="setLevelFilter('low')"
          >
            低风险
          </button>
        </div>

        <!-- 技术领域下拉 -->
        <select
          v-model="filterField"
          class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="all">全技术领域</option>
          <option v-for="f in IP_TECHNICAL_FIELDS" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>
    </div>

    <!-- 风险明细表 -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
              <th class="py-2.5 px-3 w-64">风险事项</th>
              <th class="py-2.5 px-3 w-24">技术领域</th>
              <th class="py-2.5 px-3 w-20 text-center">风险等级</th>
              <th class="py-2.5 px-3 w-20 text-center">风险评分</th>
              <th class="py-2.5 px-3 w-52">相关涉案专利</th>
              <th class="py-2.5 px-3">AI处理建议</th>
              <th class="py-2.5 px-3 w-20 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="hover:bg-blue-50/40 cursor-pointer transition-colors group"
              @click="openRisk(item)"
            >
              <!-- 风险事项标题 -->
              <td class="py-2.5 px-3 font-semibold text-slate-900">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full shrink-0" :class="riskMeta[item.riskLevel].dot"></span>
                  <span class="truncate group-hover:text-blue-600 transition-colors text-xs">
                    {{ item.title }}
                  </span>
                </div>
              </td>

              <!-- 技术领域 -->
              <td class="py-2.5 px-3 text-slate-600">
                <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                  {{ item.technicalField }}
                </span>
              </td>

              <!-- 风险等级 pill -->
              <td class="py-2.5 px-3 text-center">
                <span class="inline-block px-2 py-0.5 rounded font-bold text-[10px]" :class="riskMeta[item.riskLevel].pill">
                  {{ riskMeta[item.riskLevel].label }}
                </span>
              </td>

              <!-- 风险评分 -->
              <td class="py-2.5 px-3 text-center font-mono font-bold text-xs">
                <span :class="riskMeta[item.riskLevel].scoreText">
                  {{ item.riskScore }}
                </span>
              </td>

              <!-- 相关涉案专利 -->
              <td class="py-2.5 px-3">
                <div class="leading-tight">
                  <span class="font-mono font-bold text-blue-600 hover:underline text-[11px]">
                    {{ item.relatedPatentId }}
                  </span>
                  <p class="text-[10px] text-slate-400 truncate mt-0.5" :title="item.relatedPatentTitle">
                    {{ item.patentApplicant }}
                  </p>
                </div>
              </td>

              <!-- AI 处理建议 -->
              <td class="py-2.5 px-3 text-slate-700 text-xs">
                <span class="font-medium">{{ item.recommendation }}</span>
              </td>

              <!-- 操作：比对 -->
              <td class="py-2.5 px-3 text-right">
                <button
                  type="button"
                  class="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                  @click.stop="openRisk(item)"
                >
                  <span>比对</span>
                  <ChevronRight class="w-3 h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredItems.length === 0" class="py-8 text-center text-slate-400 text-xs">
        未检索到匹配的风险事项，可更换关键词或重置筛选条件。
      </div>
    </div>

    <!-- 风险白盒比对弹窗 -->
    <IpRiskDetailModal v-if="selectedRisk" :risk="selectedRisk" @close="closeRisk" />
  </div>
</template>
