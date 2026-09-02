<script setup lang="ts">
// 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/CustomerLeadsView.tsx
import { computed, ref } from 'vue'
import {
  Search,
  Download,
  Sparkles,
  Star,
  Mail,
  CheckCircle2,
  Building2,
  Zap,
  Eye,
} from 'lucide-vue-next'
import type { CompanyLead, LeadTier } from '@/data/tradeIntelData'

const props = defineProps<{
  leads: CompanyLead[]
}>()

const emit = defineEmits<{
  (e: 'select-lead', lead: CompanyLead): void
  (e: 'generate-email', lead: CompanyLead): void
  (e: 'toggle-star', leadId: string): void
  (e: 'open-new-task'): void
}>()

const searchTerm = ref('')
const selectedCountry = ref('All')
const selectedType = ref('All')
const selectedTier = ref<string>('All')
const minMatch = ref(0)
const onlyStarred = ref(false)
const sortBy = ref<string>('score')
const selectedLeadIds = ref<string[]>([])
const showExportSuccess = ref(false)

const companyTypeOptions = ['All', '批发商', '经销商', '进口商', '工程']

const filteredLeads = computed(() =>
  props.leads
    .filter((lead) => {
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        const matchName = lead.name.toLowerCase().includes(term)
        const matchCity = lead.city.toLowerCase().includes(term)
        const matchCountry = lead.country.toLowerCase().includes(term)
        const matchSummary = lead.summary.toLowerCase().includes(term)
        if (!matchName && !matchCity && !matchCountry && !matchSummary) return false
      }

      if (selectedCountry.value !== 'All' && lead.country !== selectedCountry.value) return false
      if (selectedTier.value !== 'All' && lead.tier !== selectedTier.value) return false
      if (onlyStarred.value && !lead.isStarred) return false
      if (lead.productMatch < minMatch.value) return false

      if (selectedType.value !== 'All') {
        if (!lead.companyType.includes(selectedType.value)) return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy.value === 'score') return b.overallScore - a.overallScore
      if (sortBy.value === 'match') return b.productMatch - a.productMatch
      return b.purchasePotential - a.purchasePotential
    }),
)

const selectLead = (lead: CompanyLead) => emit('select-lead', lead)
const generateEmail = (lead: CompanyLead) => emit('generate-email', lead)
const toggleStar = (leadId: string) => emit('toggle-star', leadId)
const openNewTask = () => emit('open-new-task')

const toggleSelectAll = () => {
  if (selectedLeadIds.value.length === filteredLeads.value.length) {
    selectedLeadIds.value = []
  } else {
    selectedLeadIds.value = filteredLeads.value.map((l) => l.id)
  }
}

const toggleSelectLead = (id: string) => {
  selectedLeadIds.value = selectedLeadIds.value.includes(id)
    ? selectedLeadIds.value.filter((item) => item !== id)
    : [...selectedLeadIds.value, id]
}

const handleExport = () => {
  showExportSuccess.value = true
  setTimeout(() => {
    showExportSuccess.value = false
  }, 3000)
}

const countryLabel = (country: string): string => {
  if (country === 'United States') return '🇺🇸 美国'
  if (country === 'Canada') return '🇨🇦 加拿大'
  if (country === 'United Kingdom') return '🇬🇧 英国'
  if (country === 'Australia') return '🇦🇺 澳大利亚'
  if (country === 'Germany') return '🇩🇪 德国'
  return '🇸🇬 新加坡'
}

const tierBadgeClass = (tier: LeadTier): string => {
  if (tier === 'A') return 'bg-green-100 text-green-700 border border-green-200'
  if (tier === 'B') return 'bg-amber-100 text-amber-700 border border-amber-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}

const tierLabel = (tier: LeadTier): string => {
  if (tier === 'A') return 'A级高潜'
  if (tier === 'B') return '一般潜力'
  return '观察库'
}

const actionBadgeClass = (action: string): string => {
  if (action === '立即开发') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (action === '重点跟进') return 'bg-blue-50 text-blue-700 border border-blue-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}

const hasImportBadge = (lead: CompanyLead): boolean => !!lead.importData?.hasImportHistory

const resetFilters = () => {
  searchTerm.value = ''
  selectedCountry.value = 'All'
  selectedType.value = 'All'
  selectedTier.value = 'All'
  onlyStarred.value = false
}
</script>

<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- 1. Header & Summary Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">全球潜在客户情报矩阵</h2>
          <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            共筛选出 {{ leads.length }} 家目标企业
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          基于「铝合金门窗 · 北美及全球市场」多重公海海关、官网与行业协会交叉验证生成
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          @click="handleExport"
          class="px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Download class="w-3.5 h-3.5 text-slate-500" />
          <span>导出客户明细 (Excel/CSV)</span>
        </button>

        <button
          type="button"
          @click="openNewTask"
          class="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles class="w-3.5 h-3.5 text-blue-200" />
          <span>重新定制采集</span>
        </button>
      </div>
    </div>

    <!-- Export Toast Notification -->
    <div
      v-if="showExportSuccess"
      class="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-600" />
        <span>已成功生成并导出「2026海外铝合金门窗高潜客户情报明细表.xlsx」，含海关提单与采购负责人联系方式。</span>
      </div>
      <span class="text-[10px] text-emerald-700 font-mono font-bold">EXPORT COMPLETED</span>
    </div>

    <!-- 2. Top 5 High Density Metrics Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
        <span class="text-slate-500 text-xs font-medium">采集企业总库</span>
        <div class="mt-1 text-2xl font-extrabold text-slate-900 font-mono">1,286</div>
        <span class="text-[10px] text-slate-400 mt-1">覆盖142个海关口岸</span>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
        <span class="text-slate-500 text-xs font-medium">有效识别企业</span>
        <div class="mt-1 text-2xl font-extrabold text-blue-600 font-mono">823</div>
        <span class="text-[10px] text-slate-400 mt-1">官网与税号已核实</span>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
        <span class="text-slate-500 text-xs font-medium">匹配潜在客户</span>
        <div class="mt-1 text-2xl font-extrabold text-blue-700 font-mono">237</div>
        <span class="text-[10px] text-slate-400 mt-1">吻合目标品类与渠道</span>
      </div>

      <div
        class="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between shadow-sm bg-gradient-to-b from-white to-emerald-50/30"
      >
        <span class="text-emerald-700 text-xs font-semibold">A级高潜客户</span>
        <div class="mt-1 text-2xl font-extrabold text-emerald-600 font-mono">38</div>
        <span class="text-[10px] text-emerald-600/90 mt-1">具备明确进口与换供意向</span>
      </div>

      <div
        class="p-4 rounded-xl bg-white border border-amber-200 flex flex-col justify-between shadow-sm bg-gradient-to-b from-white to-amber-50/30 col-span-2 sm:col-span-1"
      >
        <span class="text-amber-700 text-xs font-semibold">重点攻坚客户</span>
        <div class="mt-1 text-2xl font-extrabold text-amber-600 font-mono">12</div>
        <span class="text-[10px] text-amber-600/90 mt-1">建议由资深业务员直推</span>
      </div>
    </div>

    <!-- 3. Multi-Filter Toolbar -->
    <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <!-- Search Box -->
        <div class="relative flex-1">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="搜索企业名称、所在城市、主营产品或业务特征..."
            class="w-full pl-9 pr-4 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          <button
            v-if="searchTerm"
            type="button"
            @click="searchTerm = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <!-- Quick Select Filters -->
        <div class="flex items-center gap-2 flex-wrap text-xs">
          <!-- Country Selector -->
          <select
            v-model="selectedCountry"
            class="px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
          >
            <option value="All">所有国家 (全部)</option>
            <option value="United States">🇺🇸 美国 (United States)</option>
            <option value="Canada">🇨🇦 加拿大 (Canada)</option>
            <option value="United Kingdom">🇬🇧 英国 (United Kingdom)</option>
            <option value="Germany">🇩🇪 德国 (Germany)</option>
            <option value="Australia">🇦🇺 澳大利亚 (Australia)</option>
            <option value="Singapore">🇸🇬 新加坡 (Singapore)</option>
          </select>

          <!-- Customer Tier -->
          <select
            v-model="selectedTier"
            class="px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
          >
            <option value="All">所有等级</option>
            <option value="A">⭐ A级 · 高潜客户 (评分≥85)</option>
            <option value="B">⚡ B级 · 一般潜力 (评分75-84)</option>
            <option value="C">🌱 C级 · 观察客户</option>
          </select>

          <!-- Sort Dropdown -->
          <select
            v-model="sortBy"
            class="px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
          >
            <option value="score">综合评分最高 (降序)</option>
            <option value="match">产品匹配度最高</option>
            <option value="potential">采购潜力最高</option>
          </select>

          <!-- Star Filter -->
          <button
            type="button"
            @click="onlyStarred = !onlyStarred"
            :class="[
              'px-3 py-2 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium',
              onlyStarred
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
            ]"
          >
            <Star
              class="w-3.5 h-3.5"
              :class="onlyStarred ? 'fill-amber-500 text-amber-500' : 'text-slate-400'"
            />
            <span>已收藏</span>
          </button>
        </div>
      </div>

      <!-- Bottom Filter Tags -->
      <div class="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-medium text-slate-600">企业业态过滤:</span>
          <template v-for="type in companyTypeOptions" :key="type">
            <button
              type="button"
              @click="selectedType = type"
              :class="[
                'px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer',
                selectedType === type
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200',
              ]"
            >
              {{ type === 'All' ? '全部类型' : type }}
            </button>
          </template>
        </div>

        <div class="text-[11px] text-slate-500 font-mono">
          显示 <span class="font-bold text-slate-800">{{ filteredLeads.length }}</span> / {{ leads.length }} 家企业
        </div>
      </div>
    </div>

    <!-- 4. Professional High Density Intelligence Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              class="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]"
            >
              <th class="p-3.5 w-10">
                <input
                  type="checkbox"
                  :checked="selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length"
                  @change="toggleSelectAll"
                  class="rounded accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th class="p-3.5">企业名称与地区</th>
              <th class="p-3.5">企业类型 &amp; 规模</th>
              <th class="p-3.5 text-center">产品匹配度</th>
              <th class="p-3.5 text-center">采购潜力</th>
              <th class="p-3.5 text-center">等级 / 综合评分</th>
              <th class="p-3.5">AI 推荐动作</th>
              <th class="p-3.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="lead in filteredLeads"
              :key="lead.id"
              :class="[
                'hover:bg-slate-50/80 transition-colors group cursor-pointer',
                selectedLeadIds.includes(lead.id) ? 'bg-blue-50/50' : '',
              ]"
              @click="selectLead(lead)"
            >
              <!-- Checkbox & Star -->
              <td class="p-3.5" @click.stop>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="selectedLeadIds.includes(lead.id)"
                    @change="toggleSelectLead(lead.id)"
                    class="rounded accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                  />
                  <button
                    type="button"
                    @click="toggleStar(lead.id)"
                    class="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <Star
                      class="w-3.5 h-3.5"
                      :class="lead.isStarred ? 'fill-amber-400 text-amber-400' : ''"
                    />
                  </button>
                </div>
              </td>

              <!-- Company Name & Location -->
              <td class="p-3.5">
                <div class="flex items-start gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0"
                  >
                    {{ lead.logoInitial }}
                  </div>
                  <div>
                    <div
                      class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2"
                    >
                      <span>{{ lead.name }}</span>
                      <span
                        v-if="hasImportBadge(lead)"
                        class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                      >
                        提单已核
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>
                        {{ countryLabel(lead.country) }} · {{ lead.city }}, {{ lead.region }}
                      </span>
                      <span class="text-slate-300">·</span>
                      <span class="text-slate-400 font-mono">成立{{ lead.establishedYear }}年</span>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-md">
                      {{ lead.summary }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Type & Scale -->
              <td class="p-3.5">
                <div class="space-y-1">
                  <span
                    class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 inline-block"
                  >
                    {{ lead.companyType.split('/')[0].trim() }}
                  </span>
                  <div class="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                    <span>{{ lead.employeeScale }}</span>
                    <span class="text-slate-300">|</span>
                    <span class="text-slate-700 font-semibold">{{ lead.annualRevenue }}</span>
                  </div>
                </div>
              </td>

              <!-- Product Match -->
              <td class="p-3.5 text-center">
                <div class="inline-flex flex-col items-center gap-1">
                  <span class="font-extrabold text-blue-600 text-sm font-mono">
                    {{ lead.productMatch }}%
                  </span>
                  <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-blue-600 rounded-full"
                      :style="{ width: lead.productMatch + '%' }"
                    ></div>
                  </div>
                </div>
              </td>

              <!-- Purchase Potential -->
              <td class="p-3.5 text-center">
                <div class="inline-flex flex-col items-center gap-1">
                  <span class="font-extrabold text-slate-800 text-sm font-mono">
                    {{ lead.purchasePotential }}
                  </span>
                  <span class="text-[10px] text-slate-400">分/100</span>
                </div>
              </td>

              <!-- Tier & Score -->
              <td class="p-3.5 text-center">
                <div class="inline-flex flex-col items-center gap-1">
                  <span
                    class="px-2.5 py-0.5 rounded text-xs font-bold font-mono shadow-sm"
                    :class="tierBadgeClass(lead.tier)"
                  >
                    {{ lead.tier }}级 · {{ lead.overallScore }}分
                  </span>
                  <span class="text-[10px] text-slate-500 font-medium">
                    {{ tierLabel(lead.tier) }}
                  </span>
                </div>
              </td>

              <!-- Recommended Action -->
              <td class="p-3.5">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold"
                  :class="actionBadgeClass(lead.recommendedAction)"
                >
                  <Zap class="w-3 h-3 text-blue-600" />
                  <span>{{ lead.recommendedAction }}</span>
                </span>
              </td>

              <!-- Actions -->
              <td class="p-3.5 text-right" @click.stop>
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    @click="generateEmail(lead)"
                    class="px-2.5 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="生成该客户定制AI开发信"
                  >
                    <Mail class="w-3 h-3 text-blue-600" />
                    <span>开发信</span>
                  </button>

                  <button
                    type="button"
                    @click="selectLead(lead)"
                    class="px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 shadow-sm"
                    title="查看完整企业画像及5维评分"
                  >
                    <Eye class="w-3 h-3 text-slate-500" />
                    <span>画像</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredLeads.length === 0" class="py-16 text-center space-y-3">
        <Building2 class="w-10 h-10 text-slate-400 mx-auto" />
        <div class="text-sm font-bold text-slate-800">未找到符合当前过滤条件的客户</div>
        <p class="text-xs text-slate-500">请尝试放宽筛选条件或重置搜索关键词</p>
        <button
          type="button"
          @click="resetFilters"
          class="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
        >
          重置所有筛选
        </button>
      </div>
    </div>
  </div>
</template>
