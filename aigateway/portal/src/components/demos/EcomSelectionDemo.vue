<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 工作台 Demo 容器（暗色全量移植）
// 对照原型 App.tsx 整体结构：Sidebar → Header → 13 视图 → 3 个全局弹窗
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/App.tsx
// 视觉：暗色 #0A0C10 + indigo（与环保暗 emerald、商贸亮 sky 形成三档差异）
// ============================================================================
import { computed, ref } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import type {
  EcomView,
  TaskInput,
  TargetMarket,
  Currency,
  ProductOpportunity,
  SupplierItem,
} from '@/data/ecomIntelData'
import { DEFAULT_TASK_INPUT, ECOM_SUPPLIER_DB } from '@/data/ecomIntelData'
import { MOCK_OPPORTUNITIES, PRIMARY_PRODUCT } from '@/data/ecomProducts'
import EcomSidebar from './ecomSelection/EcomSidebar.vue'
import EcomHeader from './ecomSelection/EcomHeader.vue'
import EcomHomeView from './ecomSelection/EcomHomeView.vue'
import EcomAgentExecutionView from './ecomSelection/EcomAgentExecutionView.vue'
import EcomReportOverview from './ecomSelection/EcomReportOverview.vue'
import EcomProductDetailView from './ecomSelection/EcomProductDetailView.vue'
import EcomMarketIntelView from './ecomSelection/EcomMarketIntelView.vue'
import EcomCompetitorAnalysisView from './ecomSelection/EcomCompetitorAnalysisView.vue'
import EcomConsumerInsightsView from './ecomSelection/EcomConsumerInsightsView.vue'
import EcomProfitCalcView from './ecomSelection/EcomProfitCalcView.vue'
import EcomSupplierHubView from './ecomSelection/EcomSupplierHubView.vue'
import EcomStrategyListingView from './ecomSelection/EcomStrategyListingView.vue'
import EcomMySelectionView from './ecomSelection/EcomMySelectionView.vue'
import EcomTaskCenterView from './ecomSelection/EcomTaskCenterView.vue'
import EcomSettingsView from './ecomSelection/EcomSettingsView.vue'
import EcomSupplierDetailModal from './ecomSelection/EcomSupplierDetailModal.vue'
import EcomExportReportModal from './ecomSelection/EcomExportReportModal.vue'
import EcomNewTaskModal from './ecomSelection/EcomNewTaskModal.vue'

// 节点定位：打开工作台时直接进入对应视图（SolutionDetailPage 按 pipeline 节点传入）
const props = withDefaults(
  defineProps<{
    initialView?: EcomView
  }>(),
  { initialView: 'home' },
)

const emit = defineEmits<{ (e: 'handoff'): void }>()

// ---- 共享状态中枢（照原型 App.tsx，收敛默认参数为唯一 DEFAULT_TASK_INPUT） ----
const activeTab = ref<EcomView>(props.initialView)
const currentMarket = ref<TargetMarket>('美国')
const currency = ref<Currency>('USD')
const taskParams = ref<TaskInput>({ ...DEFAULT_TASK_INPUT })

// 数据做深拷贝副本：收藏状态可本地变更，不污染 ecomProducts.ts 源数据
const deepCopy = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T
const products = ref<ProductOpportunity[]>(deepCopy(MOCK_OPPORTUNITIES))
const selectedProduct = ref<ProductOpportunity>(deepCopy(PRIMARY_PRODUCT))
const supplierDb = ECOM_SUPPLIER_DB

// 弹窗状态
const activeSupplier = ref<SupplierItem | null>(null)
const exportOpen = ref(false)
const newTaskOpen = ref(false)

const savedCount = computed(() => products.value.filter((p) => p.isSaved).length)
const savedProducts = computed(() => products.value.filter((p) => p.isSaved))
const marketLabel = computed(() => `${taskParams.value.targetMarket} ${taskParams.value.platform}`)

const navigate = (view: EcomView) => {
  activeTab.value = view
}

const startTask = (input: TaskInput) => {
  taskParams.value = { ...input }
  navigate('agent-executing')
}

const execComplete = () => {
  navigate('selection-report')
}

const selectProduct = (p: ProductOpportunity) => {
  const src = products.value.find((x) => x.id === p.id)
  selectedProduct.value = src ? deepCopy(src) : deepCopy(p)
  navigate('product-detail')
}

const toggleSave = (id: string) => {
  const target = products.value.find((p) => p.id === id)
  if (target) {
    const willSave = !target.isSaved
    target.isSaved = willSave
    target.status = willSave ? target.status || '验证中' : undefined
    if (selectedProduct.value.id === id) {
      selectedProduct.value = { ...selectedProduct.value, isSaved: willSave, status: willSave ? selectedProduct.value.status || '验证中' : undefined }
    }
  } else if (selectedProduct.value.id === id) {
    const willSave = !selectedProduct.value.isSaved
    selectedProduct.value = { ...selectedProduct.value, isSaved: willSave, status: willSave ? selectedProduct.value.status || '验证中' : undefined }
  }
}

const toggleCurrency = () => {
  currency.value = currency.value === 'USD' ? 'CNY' : 'USD'
}

const openSupplier = (sup: SupplierItem) => {
  activeSupplier.value = sup
}

const openExport = () => {
  exportOpen.value = true
}

const openNewTask = () => {
  newTaskOpen.value = true
}
</script>

<template>
  <div class="flex h-full min-h-[540px] bg-[#0A0C10] text-slate-200 overflow-hidden">
    <!-- 1. Sidebar 深色左导航 -->
    <EcomSidebar
      :active-view="activeTab"
      :saved-count="savedCount"
      @select-view="navigate"
      @open-new-task="openNewTask"
    />

    <!-- 2. 主内容区 -->
    <div class="flex-1 flex flex-col h-full min-w-0">
      <!-- 顶部 Header -->
      <EcomHeader
        :market="currentMarket"
        :currency="currency"
        @change-market="(m: TargetMarket) => (currentMarket = m)"
        @toggle-currency="toggleCurrency"
        @export="openExport"
        @new-task="openNewTask"
      />

      <!-- 3. 主视图分发（13 视图） -->
      <main class="flex-1 overflow-y-auto min-h-0 bg-[#0A0C10]">
        <EcomHomeView
          v-if="activeTab === 'home'"
          :task-params="taskParams"
          @start-task="startTask"
          @view-recent-task="navigate('task-center')"
          @view-results="navigate('selection-report')"
        />
        <EcomAgentExecutionView
          v-else-if="activeTab === 'agent-executing'"
          :task-params="taskParams"
          @complete="execComplete"
        />
        <EcomReportOverview
          v-else-if="activeTab === 'selection-report'"
          :products="products"
          :market-label="marketLabel"
          :category-label="taskParams.category"
          @select-product="selectProduct"
          @toggle-save="toggleSave"
          @export="openExport"
        />
        <EcomProductDetailView
          v-else-if="activeTab === 'product-detail'"
          :product="selectedProduct"
          :currency="currency"
          @back="navigate('selection-report')"
          @toggle-save="toggleSave"
          @open-supplier="openSupplier"
          @export="openExport"
        />
        <EcomMarketIntelView v-else-if="activeTab === 'market-intel'" />
        <EcomCompetitorAnalysisView v-else-if="activeTab === 'competitor-analysis'" />
        <EcomConsumerInsightsView v-else-if="activeTab === 'consumer-insights'" />
        <EcomProfitCalcView v-else-if="activeTab === 'profit-calc'" />
        <EcomSupplierHubView
          v-else-if="activeTab === 'supplier-hub'"
          :suppliers="supplierDb"
          @open-supplier="openSupplier"
        />
        <EcomStrategyListingView v-else-if="activeTab === 'strategy-listing'" :products="products" />
        <EcomMySelectionView
          v-else-if="activeTab === 'my-selection'"
          :saved-products="savedProducts"
          @select-product="selectProduct"
          @remove-from-pool="toggleSave"
          @export="openExport"
        />
        <EcomTaskCenterView
          v-else-if="activeTab === 'task-center'"
          @view-report="navigate('selection-report')"
          @open-new-task="openNewTask"
        />
        <EcomSettingsView
          v-else-if="activeTab === 'settings'"
          :market="currentMarket"
          :currency="currency"
          @change-market="(m: TargetMarket) => (currentMarket = m)"
          @change-currency="(c: Currency) => (currency = c)"
          @go-home="navigate('home')"
        />
      </main>
    </div>

    <!-- 完成演示，返回解决方案 -->
    <button
      class="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white px-4 py-2.5 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
      @click="emit('handoff')"
    >
      <CheckCircle2 class="w-4 h-4" />
      完成演示，返回解决方案
    </button>
  </div>

  <!-- 供应商画像弹窗 -->
  <EcomSupplierDetailModal
    v-if="activeSupplier"
    :supplier="activeSupplier"
    @close="activeSupplier = null"
  />

  <!-- 导出报告弹窗 -->
  <EcomExportReportModal
    :open="exportOpen"
    :product-name="selectedProduct.nameEn"
    @close="exportOpen = false"
  />

  <!-- 新建任务弹窗 -->
  <EcomNewTaskModal
    :open="newTaskOpen"
    :default-input="taskParams"
    @close="newTaskOpen = false"
    @submit="startTask"
  />
</template>
