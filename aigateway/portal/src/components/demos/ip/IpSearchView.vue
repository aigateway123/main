<script setup lang="ts">
// 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/PatentSearchView.tsx
// 数据适配：专利库改用 MOCK_PATENTS_DATABASE（108 条精选）；
// 筛选维度（客户端过滤）为技术领域 / 法律状态 / 风险等级 / 国家，并按相关度排序
import { computed, ref, watch } from 'vue'
import { Search, Sparkles, ChevronRight, ArrowUpDown } from 'lucide-vue-next'
import type { Patent } from '@/data/ipIntelData'
import { MOCK_PATENTS_DATABASE } from '@/data/ipMockData'
import IpPatentDetailModal from './IpPatentDetailModal.vue'

// ---- 检索与筛选状态 ----
const searchKeyword = ref('液冷储能系统')
const selectedField = ref('all')
const selectedStatus = ref('all')
const selectedRisk = ref('all')
const selectedCountry = ref('all')
const sortDesc = ref(true) // 相关度排序方向（默认降序，与原型数据次序一致）
const page = ref(1)
const pageSize = 12 // 每页条数照原型

const selectedPatent = ref<Patent | null>(null)
const resultRef = ref<HTMLElement | null>(null)

// 真实语义语料命中总数（原型演示文案，超出本地精选库条数）
const totalResults = 1286

// ---- 下拉候选 ----
const countryOptions: { value: string; label: string }[] = [
  { value: 'all', label: '不限国家 (全球文献)' },
  { value: 'CN', label: '中国 CNIPA' },
  { value: 'US', label: '美国 USPTO' },
  { value: 'EP', label: '欧洲 EPO' },
  { value: 'JP', label: '日本 JPO' },
  { value: 'WO', label: 'WIPO (PCT国际)' },
]

const riskOptions: { value: string; label: string }[] = [
  { value: 'all', label: '全部等级' },
  { value: 'high', label: '🔴 高风险 (重合度≥80%)' },
  { value: 'medium', label: '🟠 中风险 (重合度50%-79%)' },
  { value: 'low', label: '🟢 低风险 (公知或外围)' },
]

// 技术领域 / 法律状态从专利库去重提取，保证每个选项在数据中真实存在
const uniqValues = (list: Patent[], pick: (p: Patent) => string): string[] => [
  ...new Set(list.map(pick)),
]

const fieldOptions = computed(() => [
  { value: 'all', label: '全部领域' },
  ...uniqValues(MOCK_PATENTS_DATABASE, (p) => p.technicalField).map((v) => ({
    value: v,
    label: v,
  })),
])

const statusOptions = computed(() => [
  { value: 'all', label: '全部状态' },
  ...uniqValues(MOCK_PATENTS_DATABASE, (p) => p.legalStatus).map((v) => ({
    value: v,
    label: v,
  })),
])

// ---- 客户端过滤 + 相关度排序 ----
const filteredPatents = computed<Patent[]>(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  const list = MOCK_PATENTS_DATABASE.filter((p) => {
    // 关键词匹配标题 / 专利号 / 申请人 / 技术领域
    const matchesKeyword =
      !kw ||
      [p.title, p.patentNumber, p.applicant, p.technicalField].some((t) =>
        t.toLowerCase().includes(kw),
      )
    const matchesField = selectedField.value === 'all' || p.technicalField === selectedField.value
    const matchesStatus = selectedStatus.value === 'all' || p.legalStatus === selectedStatus.value
    const matchesRisk = selectedRisk.value === 'all' || p.riskLevel === selectedRisk.value
    const matchesCountry = selectedCountry.value === 'all' || p.country === selectedCountry.value
    return matchesKeyword && matchesField && matchesStatus && matchesRisk && matchesCountry
  })
  // 相关度排序（默认降序）
  return [...list].sort((a, b) =>
    sortDesc.value ? b.relevanceScore - a.relevanceScore : a.relevanceScore - b.relevanceScore,
  )
})

const totalCount = computed(() => filteredPatents.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))
const displayedPatents = computed(() =>
  filteredPatents.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)
const displayStart = computed(() => (totalCount.value === 0 ? 0 : (page.value - 1) * pageSize + 1))
const displayEnd = computed(() => Math.min(page.value * pageSize, totalCount.value))

// 任一筛选条件变化时回到第一页
watch([searchKeyword, selectedField, selectedStatus, selectedRisk, selectedCountry, sortDesc], () => {
  page.value = 1
})

// 「开始AI检索」：回到第一页并把结果区滚入视野
const startSearch = () => {
  page.value = 1
  resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 相关度排序方向切换
const toggleSort = () => {
  sortDesc.value = !sortDesc.value
}

// 风险等级徽章（表格单元格：高 / 中 / 低）
const riskLabel = (level: Patent['riskLevel']): string => {
  if (level === 'high') return '高'
  if (level === 'medium') return '中'
  return '低'
}

const riskCls = (level: Patent['riskLevel']): string => {
  if (level === 'high') return 'bg-rose-100 text-rose-700 border border-rose-200'
  if (level === 'medium') return 'bg-amber-100 text-amber-700 border border-amber-200'
  return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
}

// 行点击 → 打开专利详情弹窗
const openDetail = (patent: Patent) => {
  selectedPatent.value = patent
}
</script>

<template>
  <div class="p-4 sm:p-6 space-y-4">
    <!-- Header & Title -->
    <div>
      <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
        <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
        <span>AI专利智能检索</span>
        <span
          class="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
        >
          多源语义增强
        </span>
      </h2>
      <p class="text-[11px] text-slate-500 mt-0.5">
        跨语言语义与IPC分类号联合检索，自动提取独立权利要求特征并判定侵权风险
      </p>
    </div>

    <!-- 检索输入控制台 -->
    <div class="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-3">
      <!-- 主关键词输入 + 检索按钮 -->
      <div class="flex flex-col sm:flex-row items-stretch gap-2">
        <div class="relative flex-1">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="输入技术关键词、专利号或技术问题（如：多通道铝制液冷板、BMS热失控预测）"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="startSearch"
          />
        </div>

        <button
          type="button"
          class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          @click="startSearch"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>开始AI检索</span>
        </button>
      </div>

      <!-- 筛选条：技术领域 / 法律状态 / 风险等级 / 国家 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div>
          <label class="text-[10px] font-semibold text-slate-400 block mb-1">技术领域</label>
          <select
            v-model="selectedField"
            class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option v-for="opt in fieldOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-semibold text-slate-400 block mb-1">法律状态</label>
          <select
            v-model="selectedStatus"
            class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-semibold text-slate-400 block mb-1">潜在风险等级</label>
          <select
            v-model="selectedRisk"
            class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option v-for="opt in riskOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-[10px] font-semibold text-slate-400 block mb-1">目标国家 / 局</label>
          <select
            v-model="selectedCountry"
            class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option v-for="opt in countryOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 结果统计 + 相关度排序 + 页码 -->
    <div ref="resultRef" class="flex flex-wrap items-center justify-between gap-2 text-xs">
      <div class="text-slate-600">
        检索完成：相关专利
        <strong class="text-slate-900 font-mono font-bold">{{ totalResults.toLocaleString() }}</strong>
        件
        （当前列表精选命中 <span class="font-mono font-bold text-blue-600">{{ totalCount }}</span> 件）
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          title="按相关度排序"
          class="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold text-[11px] text-slate-600 cursor-pointer"
          @click="toggleSort"
        >
          <ArrowUpDown class="w-3 h-3 text-blue-600" />
          <span>相关度 {{ sortDesc ? '降序' : '升序' }}</span>
        </button>
        <span class="text-slate-400 text-[11px] font-medium font-mono">
          第 {{ page }} / {{ totalPages }} 页
        </span>
      </div>
    </div>

    <!-- 检索结果表格 -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
              <th class="py-2.5 px-3 w-72">专利名称 / 专利号</th>
              <th class="py-2.5 px-3 w-40">申请人</th>
              <th class="py-2.5 px-3 w-16 text-center">国家</th>
              <th class="py-2.5 px-3 w-28">技术方向</th>
              <th class="py-2.5 px-3 w-20 text-center">相关度</th>
              <th class="py-2.5 px-3 w-20 text-center">风险</th>
              <th class="py-2.5 px-3 w-20 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <!-- 空状态 -->
            <tr v-if="displayedPatents.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400 text-xs">
                未找到匹配专利，请调整关键词或筛选条件
              </td>
            </tr>

            <tr
              v-for="patent in displayedPatents"
              :key="patent.id"
              class="hover:bg-blue-50/40 cursor-pointer transition-colors group"
              @click="openDetail(patent)"
            >
              <!-- 标题 + 专利号 + 申请日 -->
              <td class="py-2.5 px-3">
                <span
                  class="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors text-xs leading-snug"
                >
                  {{ patent.title }}
                </span>
                <span class="font-mono text-slate-400 text-[10px] block mt-0.5">
                  {{ patent.patentNumber }} · {{ patent.applicationDate }}
                </span>
              </td>

              <!-- 申请人 -->
              <td class="py-2.5 px-3 text-slate-800 font-medium truncate max-w-[160px] text-xs">
                {{ patent.applicant }}
              </td>

              <!-- 国家 -->
              <td class="py-2.5 px-3 text-center">
                <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                  {{ patent.country }}
                </span>
              </td>

              <!-- 技术方向 -->
              <td class="py-2.5 px-3">
                <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px]">
                  {{ patent.technicalField }}
                </span>
              </td>

              <!-- 相关度 -->
              <td class="py-2.5 px-3 text-center font-mono font-bold text-xs">
                <span :class="patent.relevanceScore >= 90 ? 'text-blue-600' : 'text-slate-600'">
                  {{ patent.relevanceScore }}%
                </span>
              </td>

              <!-- 风险徽章 -->
              <td class="py-2.5 px-3 text-center">
                <span
                  class="inline-block px-1.5 py-0.5 rounded font-bold text-[10px]"
                  :class="riskCls(patent.riskLevel)"
                >
                  {{ riskLabel(patent.riskLevel) }}
                </span>
              </td>

              <!-- 操作：查看特征 -->
              <td class="py-2.5 px-3 text-right">
                <button
                  type="button"
                  class="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                  @click.stop="openDetail(patent)"
                >
                  <span>特征</span>
                  <ChevronRight class="w-3 h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控制 -->
      <div
        class="p-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500"
      >
        <span class="text-[11px]">
          显示第 {{ displayStart }} 至 {{ displayEnd }} 项，共 {{ totalCount }} 项
        </span>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-[11px] font-semibold cursor-pointer"
            :disabled="page <= 1"
            @click="page = Math.max(1, page - 1)"
          >
            上一页
          </button>
          <span class="font-mono text-[11px] px-1.5">{{ page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-[11px] font-semibold cursor-pointer"
            :disabled="page >= totalPages"
            @click="page = Math.min(totalPages, page + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 专利详情弹窗（本地状态控制显隐） -->
    <IpPatentDetailModal
      v-if="selectedPatent"
      :patent="selectedPatent"
      @close="selectedPatent = null"
    />
  </div>
</template>
