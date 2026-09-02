<script setup lang="ts">
// AI 环保投标经理 —— 转译自原型 BidManagerAgent.tsx
import { ref, computed } from 'vue'
import {
  Trophy, Upload, Download, Sparkles, Building2, FileText, CheckCircle2,
  ShieldAlert, AlertTriangle, Calendar, Cpu, HelpCircle,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  BID_CASES,
  envAgentMetaOf,
  type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('bid')
const tone = ENV_TONES.blue

const selectedCaseId = ref<string>(BID_CASES[0].id)
const isExecuting = ref(false)
const activeReportTab = ref<'strategy' | 'scoring' | 'redlines' | 'techScheme' | 'gantt'>('strategy')
const showExportModal = ref(false)

const activeCase = computed(
  () => BID_CASES.find((c) => c.id === selectedCaseId.value) || BID_CASES[0],
)

const executionSteps: EnvExecutionStep[] = [
  {
    id: 1,
    title: '穿透解析 218 页招标文件与资格条件',
    description: '提取投标人须知前附表、废标条款、技术规格书与商务资信强制要求。',
    status: 'completed',
    detailLogs: ['标的额：6,800 万元 (EPC总承包)', '资格门槛：环保工程专业承包一级 + 专项设计甲级 (我方满足)'],
  },
  {
    id: 2,
    title: '评分细则深度拆解与我方胜率测算',
    description: '价格分 30 分、技术方案 45 分、商务资信 25 分。匹配我方专利与类似业绩，预测得分 92.4 分。',
    status: 'completed',
    rulesMatched: ['《中华人民共和国招标投标法实施条例》', '住建部环保工程专业承包资质标准'],
  },
  {
    id: 3,
    title: '扫描 4 项“一票否决”废标红线',
    description: '重点核查类似业绩时间截点、拟派项目经理社保证明、联合体协议与投标保证金形式。',
    status: 'completed',
    detailLogs: ['项目经理近6个月社保已验证齐全', '同类4万吨工业废水业绩合同及竣工验收证明齐全'],
  },
  {
    id: 4,
    title: '生成技术工艺方案框架与协同作战甘特图',
    description: '定制“水解酸化+多级AO+高效磁微滤”技术路线，倒排商务、技术、采购各岗位任务表。',
    status: 'completed',
    detailLogs: ['已输出《投标作战报告与技术方案初稿》'],
  },
]

const scoringRows = [
  { module: '商务资信 (25分)', item: '同类项目业绩 (10分)', standard: '近3年承担过单项合同额≥4000万或规模≥3万m³/d工业废水EPC业绩，每提供1个得5分，满分10分', myStatus: '提供 3 份竣工验收业绩合同', score: '10.0 / 10' },
  { module: '商务资信 (25分)', item: '企业资质与认证 (8分)', standard: '环保工程专业承包一级(4分)、设计甲级(2分)、AAA信用等级(2分)', myStatus: '证书均在有效期内且可查', score: '8.0 / 8' },
  { module: '技术方案 (45分)', item: '工艺技术路线合理性 (15分)', standard: '针对高盐高COD工业废水提标至准IV类工艺设计的先进性、可靠性与抗冲击能力', myStatus: '水解酸化+多级AO+磁微滤方案', score: '14.5 / 15' },
  { module: '技术方案 (45分)', item: '关键设备选型与电耗指标 (10分)', standard: '主要设备品牌（水泵/风机/膜组件）选用一线主流品牌，吨水电耗≤0.65 kWh/m³', myStatus: '选型格兰富/西门子/苏伊士', score: '9.5 / 10' },
  { module: '价格部分 (30分)', item: '投标报价综合得分 (30分)', standard: '采用复合基准价法，报价等于评标基准价得满分，每偏离 1% 扣 0.5 分', myStatus: '预测报价 6,320 万元', score: '28.4 / 30' },
]

const redlineItems = [
  { title: '项目经理社保证明时效性红线', clause: '招标文件第 3.2.1 条', desc: '要求提供投标截止日前连续 6 个月社保证明。AI 已核对拟派项目经理（陈总工）2025年6-11月常州市社保缴纳记录，完全合规。', status: '已闭环' },
  { title: '业绩竣工验收证明时间截点红线', clause: '招标文件第 3.2.4 条', desc: '业绩以竣工验收证明时间（2022年10月至今）为准，而非合同签订时间。AI 已剔除 1 份 2021 年竣工的项目，锁定 3 份有效业绩。', status: '已闭环' },
  { title: '投标保证金形式与递交时间', clause: '招标文件第 3.4.1 条', desc: '必须采用银行保函或电子保函（金额 80 万元）。财务部已锁定中国建设银行直开电子保函，截标前 2 天上传。', status: '已排期' },
  { title: '禁止联合体与违法分包承诺书', clause: '招标文件第 1.4.2 条', desc: '本项目不接受联合体。AI 已在投标文件编制目录中自动生成标准的《独立投标及不违法分包承诺函》。', status: '已生成' },
]

const ganttTasks = [
  { task: '完成商务标编制、资质业绩盖章及法定代表人授权书签署', dept: '商务部 (王经理)', deadline: '截标前 5 天', status: '进行中' },
  { task: '完成技术方案施工组织设计、三维BIM图纸及设备清单定稿', dept: '技术部 (李总工)', deadline: '截标前 4 天', status: '待审核' },
  { task: '完成主要进口设备（水泵、风机、电磁流量计）询价与锁价', dept: '采购部 (刘主管)', deadline: '截标前 3 天', status: '进行中' },
  { task: '开具 80 万元建设银行电子投标保函并回传系统', dept: '财务部 (张会计)', deadline: '截标前 2 天', status: '已完成' },
  { task: '组织内部红蓝军封标模拟评审，执行一票否决红线终审', dept: '投标决策委员会', deadline: '截标前 1 天', status: '已排期' },
]

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="blue"
      :icon="Trophy"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 环保项目智能投标与作战指挥"
      :desc="`${meta.tagline}。穿透式解析200+页招标文件，精准拆解评分点，严密扫描废标红线，快速匹配企业资质与同类业绩，生成技术方案框架与作战清单。`"
      :stat-items="[
        { label: '标书解析从 2-3 天 → 3 分钟拆解', accent: true },
        { label: '赢标率预测 82.5% · 废标红线 100% 穿透排查' },
      ]"
      stat-label="投标预测综合得分"
      stat-value="92.4 / 100"
      stat-note="第一中标候选人梯队"
    />

    <!-- 2. Cases & Input -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Tender Project Case Selector & Bid Overview -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4" :class="tone.icon" />
            <span>选择投标攻坚项目</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">TENDER PROJECT</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in BID_CASES"
            :key="item.id"
            @click="selectedCaseId = item.id"
            :class="[
              'w-full p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedCaseId === item.id
                ? [tone.caseActive, 'text-slate-100']
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60',
            ]"
          >
            <div class="text-xs font-bold text-slate-200">{{ item.title }}</div>
            <div class="text-[11px] text-blue-400/90 mt-0.5">{{ item.industry }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <!-- Bid Overview Box -->
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">标的与投标概况：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>• 控制价：<span class="text-blue-300 font-semibold">{{ String(activeCase.inputParams.projectBudget) }}</span></div>
            <div>• 标书规模：{{ String(activeCase.inputParams.tenderFilePages) }}</div>
            <div>• 我方资质：{{ String(activeCase.inputParams.myQualification) }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Uploaded Tender Package & AI Trigger -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Upload class="w-4 h-4" :class="tone.icon" />
              <span>已挂载招标文件与本企业资质业绩库</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{{ activeCase.uploadedFiles.length }} 份核心标讯文档</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, idx) in activeCase.uploadedFiles"
              :key="idx"
              class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 hover:border-slate-700 transition-all"
            >
              <div class="p-2 rounded-lg flex-shrink-0" :class="tone.fileIconBox">
                <FileText class="w-4 h-4" />
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

        <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles class="w-4 h-4" :class="tone.icon" />
            <span>AI 自动扫描 218 页标书中的 16 项废标暗坑与评分细则</span>
          </div>

          <button
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在解析标书与测算胜率...' : '一键生成投标作战报告与方案框架' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. AI Execution Pipeline Workflow -->
    <EnvExecutionFlow
      :steps="executionSteps"
      :is-executing="isExecuting"
      :agent-name="meta.name"
      @execute-again="handleRunExecution"
    />

    <!-- 4. Structured Bidding Results Dashboard -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Results Nav Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-xs font-bold font-mono" :class="tone.codePill">
              投标作战大盘 (标的额: 6,800 万元)
            </span>
            <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>资质符合度 100% · 预测综合得分 92.4 分</span>
            </span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            合肥循环经济园 40,000 m³/d 工业污水提标 EPC 投标作战指令书
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeReportTab = 'strategy'"
              :class="activeReportTab === 'strategy' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              作战大盘
            </button>
            <button
              @click="activeReportTab = 'scoring'"
              :class="activeReportTab === 'scoring' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              评分点拆解
            </button>
            <button
              @click="activeReportTab = 'redlines'"
              :class="activeReportTab === 'redlines' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              废标红线扫描 (4项)
            </button>
            <button
              @click="activeReportTab = 'techScheme'"
              :class="activeReportTab === 'techScheme' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              技术方案框架
            </button>
            <button
              @click="activeReportTab = 'gantt'"
              :class="activeReportTab === 'gantt' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              倒排任务清单
            </button>
          </div>

          <button
            @click="showExportModal = true"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-blue-500/30',
              tone.codePill,
            ]"
          >
            <Download class="w-4 h-4" />
            <span>导出作战手册</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: Strategy Overview -->
      <div v-if="activeReportTab === 'strategy'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">投标报价策略</div>
            <div class="text-xl font-bold text-blue-300 font-mono">¥ 6,320 万元</div>
            <p class="text-[11px] text-slate-400">
              较 6,800 万控制价下浮 7.05%，处于价格分最佳得分区间（基准价浮动 +0.5% 内）。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">技术方案胜算点</div>
            <div class="text-xl font-bold text-emerald-400 font-mono">42.5 / 45 分</div>
            <p class="text-[11px] text-slate-400">
              突出“高盐难降解COD水解酸化强化”专利与 3 项已投运 4 万吨类似业绩，技术分稳居第一。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">商务与资信得分</div>
            <div class="text-xl font-bold text-teal-400 font-mono">25.0 / 25 分 (满分)</div>
            <p class="text-[11px] text-slate-400">
              环保一级专包 + 专项设计甲级 + 3A信用 + ISO三体系认证全部拿满。
            </p>
          </div>
        </div>
      </div>

      <!-- Tab 2: Scoring Points Breakdown -->
      <div v-else-if="activeReportTab === 'scoring'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono" :class="tone.chipText">
          招标文件综合评分细则逐项拆解与预测得分
        </h3>

        <div class="space-y-2.5">
          <div
            v-for="(row, idx) in scoringRows"
            :key="idx"
            class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div class="space-y-1 max-w-xl">
              <div class="flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[10px]">
                  {{ row.module }}
                </span>
                <span class="font-bold text-slate-200">{{ row.item }}</span>
              </div>
              <p class="text-[11px] text-slate-400">{{ row.standard }}</p>
              <div class="text-[11px] text-emerald-400 font-medium">我方响应：{{ row.myStatus }}</div>
            </div>

            <div class="text-right">
              <div class="text-xs text-slate-400">预测得分</div>
              <div class="text-sm font-bold text-blue-400 font-mono">{{ row.score }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Red Lines Scan -->
      <div v-else-if="activeReportTab === 'redlines'" class="space-y-4">
        <h3 class="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <ShieldAlert class="w-4 h-4" />
          <span>4 大“一票否决”废标红线扫描与合规闭环</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(item, idx) in redlineItems"
            :key="idx"
            class="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-100 flex items-center gap-1.5">
                <AlertTriangle class="w-3.5 h-3.5 text-rose-400" />
                <span>{{ item.title }}</span>
              </span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                {{ item.status }}
              </span>
            </div>
            <div class="text-[10px] text-slate-400 font-mono">{{ item.clause }}</div>
            <p class="text-[11px] text-slate-300 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Tab 4: Tech Scheme Framework -->
      <div v-else-if="activeReportTab === 'techScheme'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" :class="tone.chipText">
          <Cpu class="w-4 h-4" />
          <span>AI 定制化推荐：40,000 m³/d 工业污水提标改造核心工艺路线</span>
        </h3>

        <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
          <div class="font-bold text-blue-300 text-sm">
            工艺流程拓扑：进水提升泵房 → 复合水解酸化池（提B/C比） → 改良型多级A/O生化池（脱氮除磷） → 高效磁微滤沉淀池（深度除TP） → 臭氧催化氧化接触池（破环降解残余COD） → 活性炭滤池 → 达标外排 (地表水准IV类)
          </div>
          <p>
            <strong>技术亮点：</strong>
            针对园区精细化工废水难生物降解特性，前置水解酸化池结合微动力脉冲搅拌，将进水 B/C 从 0.20 提升至 0.38 以上；生化段采用分段进水与多点回流，反硝化脱氮效率提升 25%；末端磁微滤沉淀池水力停留时间仅需 15 分钟，出水 TP 稳定在 0.2 mg/L 以下，节省占地 40%。
          </p>
        </div>
      </div>

      <!-- Tab 5: Countdown Gantt Tasks -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" :class="tone.chipText">
          <Calendar class="w-4 h-4" />
          <span>投标倒计时任务分解与责任部门分配 (距截标还有 7 天)</span>
        </h3>

        <div class="space-y-2">
          <div
            v-for="(t, idx) in ganttTasks"
            :key="idx"
            class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
          >
            <div class="space-y-0.5">
              <span class="font-semibold text-slate-200">{{ t.task }}</span>
              <div class="text-[11px] text-slate-400">责任人：{{ t.dept }}</div>
            </div>
            <div class="text-right font-mono">
              <div class="text-amber-400 font-medium">{{ t.deadline }}</div>
              <span class="text-[10px] text-slate-500">{{ t.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Professional Disclaimer Footer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 flex-shrink-0 mt-0.5" :class="tone.icon" />
      <p>
        <strong>投标决策辅助提示：</strong>
        AI 投标经理提供的标书解析、废标风险排查与技术方案框架供企业投标委员会决策参考。最终投标文件在封标上传前，请严格按照招标文件规定进行人工清标与签字盖章。
      </p>
    </div>

    <!-- Export Modal -->
    <EnvExportModal
      :is-open="showExportModal"
      :report-title="'合肥工业污水处理厂 4万吨/天 EPC 投标作战指挥手册'"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      :summary-text="'已解析 218 页招标文件，完成价格/商务/技术评分拆解（预测 92.4 分，胜率 82.5%），排查 4 项废标红线，生成水解酸化+多级AO+磁微滤技术框架及倒排任务表。'"
      @close="showExportModal = false"
    />
  </div>
</template>
