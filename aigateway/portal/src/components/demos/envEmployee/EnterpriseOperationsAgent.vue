<script setup lang="ts">
// AI 环保企业经营助手 —— 转译自原型 EnterpriseOperationsAgent.tsx
// 财务/项目损益/人效数据取自 portal 数据层；应收催收 3 行照抄 React 源内联文案
import { ref, computed } from 'vue'
import {
  BarChart2, Building2, FileSpreadsheet, Sparkles, Download,
  Clock, HelpCircle,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  OPERATIONS_CASES, OPERATIONS_FINANCE_METRICS, PROJECT_PL_DATA,
  EMPLOYEE_EFFICIENCY_DATA, envAgentMetaOf, type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('operations')
const tone = ENV_TONES.violet

const selectedCaseId = ref<string>(OPERATIONS_CASES[0].id)
const isExecuting = ref(false)
const activeTab = ref<'financial' | 'projects' | 'staff' | 'receivables'>('financial')
const showExportModal = ref(false)

const activeCase = computed(
  () => OPERATIONS_CASES.find((c) => c.id === selectedCaseId.value) || OPERATIONS_CASES[0],
)

// 4 步执行流水（照抄 React 源 executionSteps）
const EXECUTION_STEPS: EnvExecutionStep[] = [
  {
    id: 1,
    title: '穿透式清洗合同台账、工时与财务流水',
    description: '汇聚 48 个在建/已完工环保项目、52 名员工工时日志与 8,400 万元收付款现金流。',
    status: 'completed',
    detailLogs: ['年度总营收：6,850 万元', '已回款：4,920 万元 (回款率 71.8%)', '应收账款总额：1,930 万元'],
  },
  {
    id: 2,
    title: '多维项目毛利率与损益健康度诊断',
    description: '按咨询、工程、运维分类核算全口径毛利，识别出 2 个负毛利/超预算工程项目。',
    status: 'completed',
    rulesMatched: ['企业会计准则第14号——收入 (建造合同模式)', '环保工程项目全过程造价控制标准'],
  },
  {
    id: 3,
    title: '全员人效量化画像与 AI 赋能替代评估',
    description: '计算人均年产值 131.7 万元，识别 AI 员工在报告撰写、标书拆解与合规审查环节可提效 350%。',
    status: 'completed',
    detailLogs: ['高毛利环保咨询业务人均创收达 165 万元/年', '传统招投标文案编制耗费 35% 工程师非核心工时'],
  },
  {
    id: 4,
    title: '输出老板经营驾驶舱与现金流催收清单',
    description: '生成针对逾期 180 天以上大额质保金/进度款的催收策略，制定下季度资源倾斜建议。',
    status: 'completed',
    detailLogs: ['已生成《环保企业年度经营体检与人效优化决策专报》'],
  },
]

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}

// ---- Tab 4: 应收账款催收（照抄 React 源内联 3 行）----
const RECEIVABLE_ITEMS = [
  { client: '江苏某大型电镀工业园区管委会', amount: '¥ 240 万元', overdueDays: '逾期 210 天', reason: '项目已完成竣工验收，但管委会财政预算审批流程滞后', action: '建议由总经理携带第三方水质达标报告拜访主管副主任，锁定 12 月底财政专项资金拨付。' },
  { client: '无锡某印染纺织印染有限公司', amount: '¥ 160 万元', overdueDays: '逾期 240 天', reason: '客户车间处于换线改造期，声称设备存在小毛病拖延尾款', action: '派售后工程师 1 天内完成现场消缺并签署《运维验收确认单》，同步发送法务律师催告函。' },
  { client: '常州某精细化工股份有限公司', amount: '¥ 80 万元', overdueDays: '逾期 190 天', reason: '10% 质保金到期，经办人员离职交接断档', action: '商务主管重新对接财务总监补齐质保期满无质量纠纷证明。' },
]

// ---- 三态配色助手（changeType / 毛利率 / 损益评级）----
const changeClass = (t: string) =>
  t === 'positive' ? 'text-emerald-400' : t === 'warning' ? 'text-amber-400' : 'text-rose-400'
const marginClass = (m: string) => (parseFloat(m) < 20 ? 'text-rose-400' : 'text-emerald-400')
const healthClass = (s: string) =>
  s === '健康'
    ? 'bg-emerald-500/20 text-emerald-400'
    : s === '预警'
      ? 'bg-amber-500/20 text-amber-300'
      : 'bg-rose-500/20 text-rose-400'
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="violet"
      :icon="BarChart2"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 环保企业经营驾驶舱与人效洞察"
      :desc="`${meta.tagline}。专为环保公司老总打造的经营智囊。一键穿透合同、项目损益、应收账款与人效卡点，精准识别亏损项目与死账隐患，赋能科学经营决策。`"
      :stat-items="[
        { label: '经营体检由 1 周 → 30 秒全景穿透', accent: true },
        { label: '精准把控项目毛利与应收账款风险 · 提升人效 40%+' },
      ]"
      stat-label="年度全口径平均毛利率"
      stat-value="31.8%"
      stat-note="人均产值 ¥ 131.7 万 / 年"
    />

    <!-- 2. Preset Cases & Input Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Case Selector & Business Profile -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4 text-purple-400" />
            <span>选择企业经营样本</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">ENTERPRISE</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in OPERATIONS_CASES"
            :key="item.id"
            @click="selectedCaseId = item.id"
            :class="[
              'w-full p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedCaseId === item.id
                ? 'bg-purple-500/10 border-purple-500 text-slate-100 ring-1 ring-purple-500/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60',
            ]"
          >
            <div class="text-xs font-bold text-slate-200">{{ item.companyName }}</div>
            <div class="text-[11px] text-purple-400/90 mt-0.5">{{ item.industry }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">企业经营体量基本盘：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>
              • 年度营收：
              <span class="text-purple-300 font-bold">{{ String(activeCase.inputParams.annualRevenue) }}</span>
            </div>
            <div>• 团队规模：{{ String(activeCase.inputParams.headcount) }}</div>
            <div>• 在建项目：{{ String(activeCase.inputParams.activeProjects) }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Uploaded Financials & AI Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileSpreadsheet class="w-4 h-4 text-purple-400" />
              <span>已汇聚 ERP 合同台账、项目成本表与银行流水</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ activeCase.uploadedFiles.length }} 份业务财务台账</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg bg-purple-500/10 text-purple-400 flex-shrink-0">
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
            <Sparkles class="w-4 h-4 text-purple-400" />
            <span>AI 自动核算毛利率、项目成本偏差、人效画像与回款风险</span>
          </div>

          <button
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在穿透项目损益与人效画像...' : '生成企业经营体检专报' }}</span>
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

    <!-- 4. Structured Operations Dashboard -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Results Nav Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono">
              企业经营驾驶舱 (年度总结算)
            </span>
            <span class="text-xs text-slate-400">涉及 48 个在建项目 · 52 名技术与业务人员</span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            {{ activeCase.companyName }} · 企业年度经营体检与人效诊断驾驶舱
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeTab = 'financial'"
              :class="activeTab === 'financial' ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              财务总览
            </button>
            <button
              @click="activeTab = 'projects'"
              :class="activeTab === 'projects' ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              项目盈亏透视 (48个)
            </button>
            <button
              @click="activeTab = 'staff'"
              :class="activeTab === 'staff' ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              部门与人效画像
            </button>
            <button
              @click="activeTab = 'receivables'"
              :class="activeTab === 'receivables' ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              应收账款催收
            </button>
          </div>

          <button
            @click="showExportModal = true"
            class="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>导出老总决策专报</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: Financial Overview KPI Cards -->
      <div v-if="activeTab === 'financial'" class="space-y-4">
        <h3 class="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
          年度核心经营与财务指标大盘
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(kpi, idx) in OPERATIONS_FINANCE_METRICS.kpis"
            :key="idx"
            class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
          >
            <div class="text-xs text-slate-400">{{ kpi.title }}</div>
            <div class="text-2xl font-bold text-purple-300 font-mono">{{ kpi.value }}</div>
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
              <span class="text-slate-400">{{ kpi.subtext }}</span>
              <span class="font-mono font-bold" :class="changeClass(kpi.changeType)">
                {{ kpi.change }}
              </span>
            </div>
          </div>
        </div>

        <!-- Business Breakdown Ratio -->
        <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-200">三大业务板块营收与毛利构成：</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div class="text-purple-300 font-semibold">1. 环保工程 EPC 板块</div>
              <div class="text-slate-300">营收：¥ 4,200 万元 (占比 61.3%)</div>
              <div class="text-slate-400">平均毛利率：<strong class="text-emerald-400">26.5%</strong></div>
            </div>
            <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div class="text-purple-300 font-semibold">2. 环评/排污咨询板块</div>
              <div class="text-slate-300">营收：¥ 1,850 万元 (占比 27.0%)</div>
              <div class="text-slate-400">平均毛利率：<strong class="text-emerald-400">48.2% (高毛利现金奶牛)</strong></div>
            </div>
            <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div class="text-purple-300 font-semibold">3. 环保设施运维板块</div>
              <div class="text-slate-300">营收：¥ 800 万元 (占比 11.7%)</div>
              <div class="text-slate-400">平均毛利率：<strong class="text-emerald-400">32.0% (稳定年费现金流)</strong></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Project P&L -->
      <div v-else-if="activeTab === 'projects'" class="space-y-4">
        <h3 class="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
          在建重点项目全口径成本核算与毛利率异常排查
        </h3>

        <div class="overflow-x-auto rounded-xl border border-slate-800">
          <table class="w-full text-xs text-left text-slate-300">
            <thead class="bg-slate-950 text-slate-400 text-[11px] uppercase font-mono">
              <tr>
                <th class="px-3 py-2.5">项目名称</th>
                <th class="px-3 py-2.5">业务类别</th>
                <th class="px-3 py-2.5">合同额</th>
                <th class="px-3 py-2.5">实际发生成本</th>
                <th class="px-3 py-2.5">毛利率</th>
                <th class="px-3 py-2.5">回款进度</th>
                <th class="px-3 py-2.5">AI 损益评级</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono text-[11px]">
              <tr v-for="p in PROJECT_PL_DATA" :key="p.name" class="hover:bg-slate-900/50">
                <td class="px-3 py-2.5 font-bold font-sans text-slate-200">{{ p.name }}</td>
                <td class="px-3 py-2.5 font-sans text-slate-400">{{ p.type }}</td>
                <td class="px-3 py-2.5 text-slate-300">{{ p.contract }}</td>
                <td class="px-3 py-2.5 text-slate-400">{{ p.cost }}</td>
                <td class="px-3 py-2.5 font-bold" :class="marginClass(p.margin)">{{ p.margin }}</td>
                <td class="px-3 py-2.5 text-cyan-300">{{ p.paymentProgress }}</td>
                <td class="px-3 py-2.5 font-sans">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="healthClass(p.healthStatus)">
                    {{ p.healthStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: Department & Staff Efficiency -->
      <div v-else-if="activeTab === 'staff'" class="space-y-4">
        <h3 class="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
          部门人效画像与 AI 员工赋能替代潜力评估
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(dept, idx) in EMPLOYEE_EFFICIENCY_DATA"
            :key="idx"
            class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-100 text-xs">{{ dept.deptName }}</span>
              <span class="text-[11px] text-slate-400 font-mono">{{ dept.headcount }} 人</span>
            </div>
            <div class="text-lg font-bold text-purple-300 font-mono">{{ dept.revenuePerHead }}</div>
            <div class="text-xs text-slate-400">
              核心业务产出：<span class="text-slate-200 font-medium">{{ dept.coreOutput }}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300 leading-relaxed">
              <strong>AI 提效空间：</strong>
              {{ dept.aiPotential }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 4: Receivables & Debt Collection -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Clock class="w-4 h-4" />
          <span>逾期 180 天以上应收账款与大额质保金催收作战表 (共计 480 万元)</span>
        </h3>

        <div class="space-y-2">
          <div
            v-for="(item, idx) in RECEIVABLE_ITEMS"
            :key="idx"
            class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div class="space-y-1 max-w-xl">
              <div class="font-bold text-slate-200">{{ item.client }}</div>
              <div class="text-[11px] text-slate-400">拖欠根因：{{ item.reason }}</div>
              <p class="text-[11px] text-emerald-400">{{ item.action }}</p>
            </div>
            <div class="text-right font-mono">
              <div class="text-sm font-bold text-rose-400">{{ item.amount }}</div>
              <span class="text-[11px] text-amber-400">{{ item.overdueDays }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Professional Disclaimer Footer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
      <p>
        <strong>经营决策辅助提示：</strong>
        企业经营驾驶舱基于合同与财务台账进行多维量化核算。在进行重大财务拨款或人事组织架构调整前，请结合企业年度战略规划与股东会决议综合研判。
      </p>
    </div>

    <!-- 6. Export Modal -->
    <EnvExportModal
      :is-open="showExportModal"
      report-title="江苏绿清环保科技股份有限公司 年度经营体检与人效优化专报"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      summary-text="已完成 48 个项目盈亏全景穿透、52 名员工人效测算与 480 万逾期应收账款催收策略，制定 AI 员工赋能替代 80% 基础案头工作实施路径。"
      @close="showExportModal = false"
    />
  </div>
</template>
