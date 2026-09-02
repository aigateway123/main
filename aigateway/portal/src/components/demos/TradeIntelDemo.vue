<script setup lang="ts">
// ============================================================================
// 传统商贸 · AI 贸易情报员 工作台 Demo 容器（亮色全量移植）
// 对照原型 App.tsx 整体结构：Sidebar → Header → 3 分钟路演向导条 → 9 视图 → 两个业务 Modal + 路演 Modal
// 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/App.tsx
// ============================================================================
import { computed, ref } from 'vue'
import { CheckCircle2, X } from 'lucide-vue-next'
import type { TradeView, CompanyLead } from '@/data/tradeIntelData'
import { mockCustomerLeads } from '@/data/tradeLeads'
import TradeSidebar from './tradeIntel/TradeSidebar.vue'
import TradeHeader from './tradeIntel/TradeHeader.vue'
import TradeHomeView from './tradeIntel/TradeHomeView.vue'
import TradeProgressView from './tradeIntel/TradeProgressView.vue'
import TradeCustomersView from './tradeIntel/TradeCustomersView.vue'
import TradeSuppliersView from './tradeIntel/TradeSuppliersView.vue'
import TradeMarketView from './tradeIntel/TradeMarketView.vue'
import TradeCompetitorsView from './tradeIntel/TradeCompetitorsView.vue'
import TradeRadarView from './tradeIntel/TradeRadarView.vue'
import TradeTasksView from './tradeIntel/TradeTasksView.vue'
import TradeSettingsView from './tradeIntel/TradeSettingsView.vue'
import TradeCustomerDetailModal from './tradeIntel/TradeCustomerDetailModal.vue'
import TradeEmailGeneratorModal from './tradeIntel/TradeEmailGeneratorModal.vue'
import TradePitchGuideModal from './tradeIntel/TradePitchGuideModal.vue'

// 节点定位：打开工作台时直接进入对应视图（SolutionDetailPage 按 pipeline 节点传入）
const props = withDefaults(
  defineProps<{
    initialView?: TradeView
  }>(),
  { initialView: 'home' },
)

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ---- 共享状态中枢（照原型 App.tsx） ----
const activeTab = ref<TradeView>(props.initialView)
// 客户线索做深拷贝副本：星标可本地变更，不污染 tradeLeads.ts 源数据
const leads = ref<CompanyLead[]>(JSON.parse(JSON.stringify(mockCustomerLeads)) as CompanyLead[])
const favoriteCount = computed(() => leads.value.filter((l) => l.isStarred).length)

const bannerVisible = ref(true)
const pitchOpen = ref(false)
const exportToast = ref(false)
const detailLead = ref<CompanyLead | null>(null)
const emailLead = ref<CompanyLead | null>(null)

// 当前演示行业场景（preset 联动，照原型）
const presets: Record<string, { product: string; market: string }> = {
  aluminum_windows: { product: '铝合金门窗', market: '美国、加拿大' },
  solar_brackets: { product: '智能光伏支架与跟踪系统', market: '德国、西班牙、法国' },
  injection_molds: { product: '精密注塑模具与机械零部件', market: '越南、泰国、印尼' },
}
const currentProduct = ref('铝合金门窗')
const currentMarket = ref('美国、加拿大')

const navigate = (view: TradeView) => {
  activeTab.value = view
}

// 弹窗统一展示容器内响应式副本，保证星标/画像状态与 Sidebar 收藏计数实时联动
const resolveLead = (lead: CompanyLead): CompanyLead => leads.value.find((l) => l.id === lead.id) ?? lead

const openDetail = (lead: CompanyLead) => {
  detailLead.value = resolveLead(lead)
}

const openEmail = (lead: CompanyLead) => {
  emailLead.value = resolveLead(lead)
}

const toggleStar = (leadId: string) => {
  const target = leads.value.find((l) => l.id === leadId)
  if (target) target.isStarred = !target.isStarred
}

const changePreset = (value: string) => {
  const p = presets[value]
  if (p) {
    currentProduct.value = p.product
    currentMarket.value = p.market
  }
}

const startCrawl = (payload: { product: string; market: string }) => {
  currentProduct.value = payload.product
  currentMarket.value = payload.market
  activeTab.value = 'progress'
}

const rerunTask = (product: string, market: string) => {
  currentProduct.value = product
  currentMarket.value = market
  activeTab.value = 'progress'
}

const exportAll = () => {
  exportToast.value = true
  setTimeout(() => (exportToast.value = false), 3000)
}

const openNewTask = () => {
  activeTab.value = 'home'
}
</script>

<template>
  <div class="flex h-full min-h-[540px] bg-[#F8FAFC] text-slate-900 overflow-hidden">
    <!-- 1. Sidebar 深色左导航 -->
    <TradeSidebar
      :active-view="activeTab"
      :favorite-count="favoriteCount"
      @select-view="navigate"
      @open-new-task="openNewTask"
      @open-pitch-guide="pitchOpen = true"
    />

    <!-- 2. 主内容区 -->
    <div class="flex-1 flex flex-col h-full min-w-0">
      <!-- 顶部 Header -->
      <TradeHeader
        :current-product="currentProduct"
        @open-new-task="openNewTask"
        @open-pitch-guide="pitchOpen = true"
        @change-preset="changePreset"
        @export-all="exportAll"
      />

      <!-- 3. 3-Minute Interactive Demo Tour Guide Bar -->
      <div
        v-if="bannerVisible"
        class="bg-blue-50/70 border-b border-blue-200/80 px-6 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0"
      >
        <div class="flex items-center gap-2 overflow-x-auto py-0.5">
          <span class="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase shrink-0 shadow-sm">
            3分钟路演向导
          </span>
          <span class="font-medium text-slate-700 whitespace-nowrap">
            推荐演示流程：
            <button
              @click="navigate('home')"
              class="hover:underline cursor-pointer ml-1"
              :class="activeTab === 'home' ? 'text-blue-700 font-bold' : 'text-slate-600'"
            >
              ① 输入需求
            </button>
            <span class="text-slate-400 mx-1">→</span>
            <button
              @click="navigate('progress')"
              class="hover:underline cursor-pointer"
              :class="activeTab === 'progress' ? 'text-blue-700 font-bold' : 'text-slate-600'"
            >
              ② AI智能采集清洗
            </button>
            <span class="text-slate-400 mx-1">→</span>
            <button
              @click="navigate('customers')"
              class="hover:underline cursor-pointer"
              :class="activeTab === 'customers' ? 'text-blue-700 font-bold' : 'text-slate-600'"
            >
              ③ 客户情报矩阵
            </button>
            <span class="text-slate-400 mx-1">→</span>
            <button
              v-if="leads.length"
              @click="openDetail(leads[0])"
              class="hover:underline text-blue-700 font-bold cursor-pointer"
            >
              ④ 企业画像与五维评分
            </button>
            <span v-if="leads.length" class="text-slate-400 mx-1">→</span>
            <button
              v-if="leads.length"
              @click="openEmail(leads[0])"
              class="hover:underline text-emerald-700 font-bold cursor-pointer"
            >
              ⑤ AI定制开发信
            </button>
          </span>
        </div>

        <div class="flex items-center gap-3 shrink-0 ml-2">
          <button
            @click="pitchOpen = true"
            class="text-[11px] text-blue-700 hover:text-blue-800 underline font-semibold cursor-pointer"
          >
            查看路演话术
          </button>
          <button
            @click="bannerVisible = false"
            class="text-slate-400 hover:text-slate-700 cursor-pointer"
            title="关闭向导条"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- 4. Main Scrollable View Router -->
      <main class="flex-1 overflow-y-auto min-h-0 bg-[#F8FAFC]">
        <TradeHomeView
          v-if="activeTab === 'home'"
          @start-crawl="startCrawl"
          @view-recent-task="navigate('tasks')"
          @direct-view-results="navigate('customers')"
        />
        <TradeProgressView
          v-else-if="activeTab === 'progress'"
          :product="currentProduct"
          :market="currentMarket"
          @complete="navigate('customers')"
        />
        <TradeCustomersView
          v-else-if="activeTab === 'customers'"
          :leads="leads"
          @select-lead="openDetail"
          @generate-email="openEmail"
          @toggle-star="toggleStar"
          @open-new-task="openNewTask"
        />
        <TradeSuppliersView v-else-if="activeTab === 'suppliers'" />
        <TradeMarketView v-else-if="activeTab === 'market'" />
        <TradeCompetitorsView v-else-if="activeTab === 'competitors'" />
        <TradeRadarView
          v-else-if="activeTab === 'radar'"
          @select-lead="openDetail"
          @generate-email="openEmail"
        />
        <TradeTasksView
          v-else-if="activeTab === 'tasks'"
          @select-lead="openDetail"
          @rerun-task="rerunTask"
        />
        <TradeSettingsView v-else-if="activeTab === 'settings'" @go-home="openNewTask" />
      </main>
    </div>

    <!-- Floating Task Status Overlay（原型底部采集悬浮卡） -->
    <div
      class="fixed bottom-4 right-8 bg-white/80 backdrop-blur-md border border-blue-200 rounded-full px-5 py-2.5 shadow-lg flex items-center gap-3.5 border-l-4 border-l-blue-600 z-40 hidden sm:flex"
    >
      <div class="flex -space-x-1.5">
        <div class="w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
        <div class="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"></div>
        <div class="w-5 h-5 rounded-full bg-amber-500 border-2 border-white"></div>
      </div>
      <div class="text-xs font-medium text-slate-700">
        <span class="text-blue-700 font-bold">实时采集网络</span> · 全球已识别
        <span class="font-mono font-bold text-slate-900">823/1,286</span> 家公司
      </div>
      <div class="h-3.5 w-[1px] bg-slate-200"></div>
      <button @click="navigate('progress')" class="text-xs text-blue-600 font-bold hover:text-blue-800 cursor-pointer">
        查看实时进程
      </button>
    </div>

    <!-- 完成演示，返回解决方案（复用 env 悬浮钮思路，sky 渐变，放左下避免与采集卡重叠） -->
    <button
      class="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-xs font-bold text-white px-4 py-2.5 shadow-lg shadow-sky-600/30 cursor-pointer transition-all"
      @click="emit('handoff')"
    >
      <CheckCircle2 class="w-4 h-4" />
      完成演示，返回解决方案
    </button>
  </div>

  <!-- 5. 客户画像弹窗（保留打开状态，便于从开发信返回） -->
  <TradeCustomerDetailModal
    v-if="detailLead"
    :lead="detailLead"
    @close="detailLead = null"
    @generate-email="openEmail"
    @toggle-star="toggleStar"
  />

  <!-- 6. AI 开发信弹窗 -->
  <TradeEmailGeneratorModal
    v-if="emailLead"
    :lead="emailLead"
    @close="emailLead = null"
  />

  <!-- 7. 3 分钟路演话术 Modal -->
  <TradePitchGuideModal :open="pitchOpen" @close="pitchOpen = false" />

  <!-- 8. 导出 Toast -->
  <Teleport to="body">
    <div
      v-if="exportToast"
      class="fixed bottom-6 right-6 z-[70] bg-emerald-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs animate-bounce"
    >
      <CheckCircle2 class="w-5 h-5 text-emerald-300 shrink-0" />
      <div>
        <div class="font-bold text-white">情报数据简报导出成功</div>
        <div class="text-[11px] text-emerald-200">已生成《2026铝合金门窗北美市场AI情报深度分析报告.xlsx》</div>
      </div>
    </div>
  </Teleport>
</template>
