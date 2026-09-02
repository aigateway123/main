<script setup lang="ts">
// AI 危废管理助手 —— 转译自原型 HazardousWasteAgent.tsx
// 台账表、超期批次、处置比价均按 React 源内联数据照抄为 script 常量
import { ref, computed } from 'vue'
import {
  Flame, Warehouse, FileSpreadsheet, Sparkles, Download,
  ShieldCheck, Clock, TrendingDown, HelpCircle,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  WASTE_CASES, envAgentMetaOf, type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('waste')
const tone = ENV_TONES.amber

const selectedCaseId = ref<string>(WASTE_CASES[0].id)
const isExecuting = ref(false)
const activeTab = ref<'inventory' | 'compatibility' | 'deadline' | 'disposal'>('inventory')
const showExportModal = ref(false)

const activeCase = computed(
  () => WASTE_CASES.find((c) => c.id === selectedCaseId.value) || WASTE_CASES[0],
)

const EXECUTION_STEPS: EnvExecutionStep[] = [
  {
    id: 1,
    title: '穿透匹配《国家危险废物名录(2021年版)》',
    description: '对全厂 12 类固废进行 8 位代码精准定性 (HW08 废矿物油、HW12 染料涂料废物、HW49 废活性炭/包装物)。',
    status: 'completed',
    detailLogs: ['HW08 (900-249-08): 机械切削乳化废液 12.5 吨', 'HW49 (900-039-49): 废活性炭 18.6 吨'],
  },
  {
    id: 2,
    title: '危废暂存库分区相容性与防渗安全扫描',
    description: '依据 GB 18597-2023 贮存污染控制标准，扫描易燃溶剂、强酸强碱混存禁忌风险。',
    status: 'completed',
    rulesMatched: ['《危险废物贮存污染控制标准》(GB 18597-2023)', '《中华人民共和国固体废物污染环境防治法》'],
  },
  {
    id: 3,
    title: '365天超期贮存红线倒计时与电子联单核销',
    description: '排查出 1 批废有机溶剂（入库已 310 天，距 365 天超期法定红线仅剩 55 天），自动触发紧急清运流程。',
    status: 'completed',
    detailLogs: ['危废暂存库总库容负荷率：78.5% (处于中高位警戒)', '全流程扫码标签一物一码追溯率：100%'],
  },
  {
    id: 4,
    title: '匹配合法资质处置单位与跨省转移方案',
    description: '比对长三角 4 家持证处置单位核准经营范围、剩余接收额度与处置单价。',
    status: 'completed',
    detailLogs: ['推荐方案预计为企业节约危废委外焚烧处置费 28.5 万元'],
  },
]

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}

// ---- Tab 1: 危废动态台账（照抄 React 源内联 3 行）----
const INVENTORY_ROWS = [
  {
    category: 'HW08', code: '900-249-08', name: '机械加工切削乳化废液',
    hazard: 'T (毒性)', stock: '12.50 吨', stockClass: 'text-emerald-400',
    form: 'IBC吨桶 / 防渗托盘', status: '合规受控', statusClass: 'text-emerald-400',
  },
  {
    category: 'HW12', code: '900-252-12', name: '涂装车间废油漆渣',
    hazard: 'T, I (毒性/易燃)', stock: '8.20 吨', stockClass: 'text-emerald-400',
    form: '200L密封铁桶', status: '合规受控', statusClass: 'text-emerald-400',
  },
  {
    category: 'HW49', code: '900-039-49', name: 'VOCs治理吸附饱和废活性炭',
    hazard: 'T (毒性)', stock: '18.60 吨', stockClass: 'text-amber-300',
    form: '防静电防潮吨袋', status: '临近预警', statusClass: 'text-amber-300',
  },
]

// ---- Tab 3: 365 天超期倒计时批次（紧急批次触发红色动效）----
const DEADLINE_BATCHES = [
  { name: 'HW49 废活性炭 (批次 20250115)', inDate: '2025-01-15', storedDays: 310, leftDays: 55, status: '紧急催办', color: 'border-rose-500/50 bg-rose-950/20' },
  { name: 'HW08 切削乳化液 (批次 20250420)', inDate: '2025-04-20', storedDays: 215, leftDays: 150, status: '正常受控', color: 'border-slate-800 bg-slate-950/80' },
  { name: 'HW12 废漆渣 (批次 20250702)', inDate: '2025-07-02', storedDays: 142, leftDays: 223, status: '正常受控', color: 'border-slate-800 bg-slate-950/80' },
]

// ---- Tab 4: 处置成本比价 ----
const DISPOSAL_VENDORS = [
  { vendor: '南通市某资源再生处置中心', distance: '65 km', permitCap: '剩余核准配额 3,200 吨', price: '¥ 3,200 / 吨', advantage: '综合报价最低，且具备跨省电子联单绿色通道，推荐首选' },
  { vendor: '常州市固体废弃物焚烧有限公司', distance: '120 km', permitCap: '剩余核准配额 850 吨', price: '¥ 4,100 / 吨', advantage: '本地处置无需跨省审批，但焚烧单价偏高' },
  { vendor: '苏州工业园区环保科技中心', distance: '85 km', permitCap: '配额紧张 (需排队2个月)', price: '¥ 3,800 / 吨', advantage: '排队周期过长，无法满足 55 天内清运的超期红线要求' },
]
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="amber"
      :icon="Flame"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 企业危废智能管理与合规转运"
      :desc="`${meta.tagline}。严格对标 GB 18597-2023 新规，AI 自动判定 8 位危废代码、扫描暂存库相容性禁忌、监控 365 天超期红线、核验处置单位资质并优化处置成本。`"
      :stat-items="[
        { label: '核算排查从 1 天 → 30 秒全景把控', accent: true },
        { label: '100% 杜绝超期贮存与违规混存刑事行政风险' },
      ]"
      stat-label="危废规范化管理合规率"
      stat-value="100% 合规"
      stat-note="一物一码 · 电子联单全闭环"
    />

    <!-- 2. Preset Cases & Input Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Case Selector & Storage Profile -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Warehouse class="w-4 h-4 text-amber-400" />
            <span>选择危废管理场景</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">WASTE PROFILE</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in WASTE_CASES"
            :key="item.id"
            @click="selectedCaseId = item.id"
            :class="[
              'w-full p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedCaseId === item.id
                ? 'bg-amber-500/10 border-amber-500 text-slate-100 ring-1 ring-amber-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60',
            ]"
          >
            <div class="text-xs font-bold text-slate-200">{{ item.companyName }}</div>
            <div class="text-[11px] text-amber-400/90 mt-0.5">{{ item.industry }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">暂存库关键运行指标：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div v-if="activeCase.inputParams.storageCapacity">• 暂存库容：{{ String(activeCase.inputParams.storageCapacity) }}</div>
            <div v-if="activeCase.inputParams.annualGeneration">• 年产生量：{{ String(activeCase.inputParams.annualGeneration) }}</div>
            <div v-if="activeCase.inputParams.electronicTagRatio">• 扫码标签：{{ String(activeCase.inputParams.electronicTagRatio) }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Uploaded Waste Ledger & AI Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileSpreadsheet class="w-4 h-4 text-amber-400" />
              <span>已接入危废动态出入库台账与电子联单系统</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ activeCase.uploadedFiles.length }} 份管理台账</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                <FileSpreadsheet class="w-4 h-4" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-semibold text-slate-200 truncate">{{ file.name }}</div>
                <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span class="font-mono">{{ file.size }}</span>
                  <span>•</span>
                  <span>{{ file.type }}</span>
                </div>
                <div class="text-[10px] text-slate-400 mt-1 line-clamp-1">{{ file.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Trigger -->
        <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles class="w-4 h-4 text-amber-400" />
            <span>AI 扫描 8位危废代码、GB 18597 禁忌混存与 365天超期风险</span>
          </div>

          <button
            id="run-waste-btn"
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在执行相容性校验与超期扫描...' : '开始危废智能合规体检' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. AI Execution Pipeline Workflow -->
    <EnvExecutionFlow
      :steps="EXECUTION_STEPS"
      :is-executing="isExecuting"
      :agent-name="meta.name"
      @execute-again="handleRunExecution"
    />

    <!-- 4. Structured Results Dashboard -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Result Top Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
              GB 18597-2023 规范化管理
            </span>
            <span class="text-xs text-slate-400">暂存库总存量 39.3 吨 (负荷率 78.5%) · 扫码率 100%</span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            {{ activeCase.companyName }} · 危险废物规范化环境管理体检报告
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeTab = 'inventory'"
              :class="activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              危废动态台账
            </button>
            <button
              @click="activeTab = 'compatibility'"
              :class="activeTab === 'compatibility' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              相容性排查 (GB18597)
            </button>
            <button
              @click="activeTab = 'deadline'"
              :class="activeTab === 'deadline' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              365天超期倒计时
            </button>
            <button
              @click="activeTab = 'disposal'"
              :class="activeTab === 'disposal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              处置成本优化
            </button>
          </div>

          <button
            @click="showExportModal = true"
            class="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>导出台账自查表</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: 危废动态台账 -->
      <div v-if="activeTab === 'inventory'" class="space-y-4">
        <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          全厂危险废物定性分类、8位代码与实时库存明细
        </h3>

        <div class="overflow-x-auto rounded-xl border border-slate-800">
          <table class="w-full text-xs text-left text-slate-300">
            <thead class="bg-slate-950 text-slate-400 text-[11px] uppercase font-mono">
              <tr>
                <th class="px-3 py-2.5">危废大类</th>
                <th class="px-3 py-2.5">8位危废代码</th>
                <th class="px-3 py-2.5">危废名称</th>
                <th class="px-3 py-2.5">危险特性</th>
                <th class="px-3 py-2.5">当前库量</th>
                <th class="px-3 py-2.5">贮存形式</th>
                <th class="px-3 py-2.5">状态</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono text-[11px]">
              <tr v-for="row in INVENTORY_ROWS" :key="row.code" class="hover:bg-slate-900/50">
                <td class="px-3 py-2.5 font-bold text-amber-400">{{ row.category }}</td>
                <td class="px-3 py-2.5 text-slate-300">{{ row.code }}</td>
                <td class="px-3 py-2.5 font-sans text-slate-200">{{ row.name }}</td>
                <td class="px-3 py-2.5 text-rose-400">{{ row.hazard }}</td>
                <td class="px-3 py-2.5 font-bold" :class="row.stockClass">{{ row.stock }}</td>
                <td class="px-3 py-2.5 font-sans text-slate-400">{{ row.form }}</td>
                <td class="px-3 py-2.5 font-sans" :class="row.statusClass">{{ row.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: 相容性排查 (GB18597) -->
      <div v-else-if="activeTab === 'compatibility'" class="space-y-4">
        <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <ShieldCheck class="w-4 h-4" />
          <span>暂存库相容性分区与安全硬件核查 (对标 GB 18597-2023)</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">物理隔离与间距</div>
            <div class="text-sm font-bold text-emerald-400">满足 1.2m 检查通道</div>
            <p class="text-[11px] text-slate-400">
              易燃性漆渣与废矿物油之间设置有耐火防爆实体墙物理分隔，符合相容性贮存规范。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">渗滤液收集与导流槽</div>
            <div class="text-sm font-bold text-emerald-400">环形导流沟完好</div>
            <p class="text-[11px] text-slate-400">
              库内设有 2m³ 应急集液池，防渗层环氧地坪厚度 2.0mm，渗透系数 ≤ 10⁻¹⁰ cm/s。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">废气收集与 VOCs 浓度</div>
            <div class="text-sm font-bold text-emerald-400">微负压收集在线联动</div>
            <p class="text-[11px] text-slate-400">
              库房换气次数保持 8 次/小时，废气接入总厂活性炭吸附装置，库界 VOCs 无异味。
            </p>
          </div>
        </div>
      </div>

      <!-- Tab 3: 365 天超期倒计时 -->
      <div v-else-if="activeTab === 'deadline'" class="space-y-4">
        <h3 class="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Clock class="w-4 h-4" />
          <span>365 天法定贮存期限倒计时与清运催办</span>
        </h3>

        <div class="space-y-3">
          <div
            v-for="item in DEADLINE_BATCHES"
            :key="item.name"
            :class="['p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs', item.color]"
          >
            <div class="space-y-1">
              <div class="font-bold text-slate-200">{{ item.name }}</div>
              <div class="text-[11px] text-slate-400 font-mono">入库日期：{{ item.inDate }} · 已贮存：{{ item.storedDays }} 天</div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right font-mono">
                <div class="text-[11px] text-slate-400">距 365 天红线</div>
                <div :class="['text-base font-bold', item.leftDays < 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400']">
                  仅剩 {{ item.leftDays }} 天
                </div>
              </div>
              <span :class="['px-2.5 py-1 rounded font-bold text-xs', item.leftDays < 60 ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-400']">
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: 处置成本优化 -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <TrendingDown class="w-4 h-4" />
          <span>长三角持证处置单位比价与转运成本优化方案 (预计节省 28.5 万元)</span>
        </h3>

        <div class="space-y-2">
          <div
            v-for="v in DISPOSAL_VENDORS"
            :key="v.vendor"
            class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div class="space-y-1 max-w-xl">
              <div class="font-bold text-slate-200">{{ v.vendor }}</div>
              <div class="text-[11px] text-slate-400 font-mono">运输距离：{{ v.distance }} · {{ v.permitCap }}</div>
              <p class="text-[11px] text-emerald-400">{{ v.advantage }}</p>
            </div>
            <div class="text-right font-mono">
              <div class="text-xs text-slate-400">处置含税单价</div>
              <div class="text-sm font-bold text-amber-400">{{ v.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Professional Disclaimer Footer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p>
        <strong>危废管理合规提示：</strong>
        危废跨省转移与转移联单须在全国固体废物化学品管理信息系统中进行正式申请与电子核销。AI 助手为您提供智能预警与合规辅助。
      </p>
    </div>

    <!-- 6. Export Modal -->
    <EnvExportModal
      :is-open="showExportModal"
      report-title="常州新材料有限公司 危险废物规范化管理自查与转运计划"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      summary-text="已完成 HW08、HW12、HW49 等 8 位危废代码精准核对，排查 1 处 55 天超期贮存风险，输出 GB 18597 相容性达标清单与南通处置中心降本方案。"
      @close="showExportModal = false"
    />
  </div>
</template>
