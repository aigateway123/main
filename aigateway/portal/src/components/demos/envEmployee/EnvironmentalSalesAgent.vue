<script setup lang="ts">
// AI 环保销售员 —— 转译自原型 EnvironmentalSalesAgent.tsx
import { ref, computed } from 'vue'
import {
  Briefcase, Download, Sparkles, Building2, MessageSquare, HelpCircle,
} from 'lucide-vue-next'
import { ENV_TONES } from '@/data/envTone'
import {
  SALES_CASES,
  envAgentMetaOf,
  type EnvExecutionStep,
} from '@/data/envAgentData'
import EnvAgentBanner from './EnvAgentBanner.vue'
import EnvExecutionFlow from './EnvExecutionFlow.vue'
import EnvExportModal from './EnvExportModal.vue'

const meta = envAgentMetaOf('sales')
const tone = ENV_TONES.indigo

const selectedCaseId = ref<string>(SALES_CASES[0].id)
const customInputText = ref<string>(
  '某化工厂每天产生5000吨工业废水，进水COD高、含盐量大，现有生化池负荷过高常年超标，面临环保局挂牌督办，预算大约1800万，希望3个月内完成改造，要保证达标接管。',
)
const isExecuting = ref(false)
const activeReportTab = ref<'profile' | 'bant' | 'techCompare' | 'scripts' | 'followup'>('profile')
const showExportModal = ref(false)

const activeCase = computed(
  () => SALES_CASES.find((c) => c.id === selectedCaseId.value) || SALES_CASES[0],
)

const executionSteps: EnvExecutionStep[] = [
  {
    id: 1,
    title: '客户工况需求与非结构化语义解析',
    description: '解析水量 (5000 m³/d)、高盐高 COD (5,500 mg/L)、合规督办风险、预算 (1,800万) 与工期诉求 (3个月)。',
    status: 'completed',
    detailLogs: ['识别核心工艺痛点：盐度 4.5% 导致传统生化活性污泥盐中毒失活', '工期紧迫度：极高 (面临地方环保督办)'],
  },
  {
    id: 2,
    title: '构建立体客户画像与 BANT 商机评分',
    description: '根据预算充足度、决策权归属、痛点刚性与改造时限，计算商机评分为 92 分 (A+级重点突破项目)。',
    status: 'completed',
    rulesMatched: ['BANT 销售机会评估模型', '工业高盐废水治理技术规范'],
  },
  {
    id: 3,
    title: '智能匹配最优工艺路线与投资测算',
    description: '对比传统稀释生化 vs “高级氧化破环 + MVR脱盐 + 耐盐强化生化”，测算投资与吨水运行成本。',
    status: 'completed',
    detailLogs: ['吨水处理电耗对比：传统 2.8 元/吨 vs 推荐方案 1.65 元/吨', '预计节约占地 35%'],
  },
  {
    id: 4,
    title: '生成对客专业销售话术与 7 天跟进清单',
    description: '定制 3 分钟破冰话术、客户关键疑虑解答（破除技术担忧）与竞争对手攻防锦囊。',
    status: 'completed',
    detailLogs: ['已生成定制化方案建议 PPT 提纲与销售话术'],
  },
]

const bantItems = [
  { letter: 'B', name: 'Budget 预算', score: '24 / 25', status: '充足明确', desc: '客户已专项预留 1,800 万元技改专项资金，付款节点按工程进度 3-3-3-1。' },
  { letter: 'A', name: 'Authority 决策权', score: '23 / 25', status: '关键人对接', desc: '已对接分管副总，已安排下周二直接向董事长汇报技术方案。' },
  { letter: 'N', name: 'Need 核心需求', score: '25 / 25', status: '刚性急迫', desc: '面临环保督办与停产红线，属于不可拖延的生死合规需求。' },
  { letter: 'T', name: 'Timeline 工期', score: '20 / 25', status: '3个月工期', desc: '要求 90 天内完成土建改造与设备通水，需采用集成式模块化装备。' },
]

const techCompareRows = [
  { dim: '工艺路线', traditional: '自来水稀释3倍 + 普通水解酸化 + 活性污泥法', recommended: '铁碳微电解芬顿破环 + 耐高盐复合菌剂 + 高通量 MBR', recommendedClass: 'text-emerald-300 font-semibold' },
  { dim: '出水水质稳定性', traditional: '盐度波动时污泥极易膨胀死亡，COD经常反弹', recommended: '出水 COD 稳定在 80mg/L 以下，达标率 99.8%', recommendedClass: 'text-emerald-300 font-semibold', traditionalClass: 'text-rose-400' },
  { dim: '工程投资额', traditional: '约 2,100 万元 (需新建大型生化池)', recommended: '约 1,680 万元 (原池改造+撬装设备，节省420万)', recommendedClass: 'text-emerald-300 font-bold' },
  { dim: '吨水运行成本', traditional: '3.8 元 / 吨废水', recommended: '2.1 元 / 吨 (年节约运行电耗与药剂费 310 万元)', recommendedClass: 'text-emerald-300 font-bold' },
  { dim: '实施周期', traditional: '6-8 个月 (无法满足环保督办要求)', recommended: '65 天 (模块化预制安装，停产时间 ≤ 3天)', recommendedClass: 'text-emerald-300 font-bold', traditionalClass: 'text-rose-400' },
]

const scriptItems = [
  {
    title: '开场 3 分钟破冰话术（直击董事长痛点）',
    script: '“张总，我们非常理解您现在面临的环保督办压力。高盐有机废水超标，根本原因不是你们污水站工人不负责，而是传统生化菌种在 4.5% 盐度下会发生细胞渗透压脱水死亡。如果继续在老池子里加水稀释，不仅浪费巨额水费，还会被环保局以‘稀释排污’加重处罚。我们这次带来的‘高级氧化+耐盐 MBR’方案，直接在现有调节池旁布置撬装模块，不用大拆大建，65天内就能通水验收，彻底帮您摘掉环保挂牌督办的帽子！”',
  },
  {
    title: '客户提出疑虑：“65天真能通水？会不会影响我们车间生产？”',
    script: '“王总您放心，我们采用的是工厂标准化预制的集成撬装模块，80% 的管道和反应器在车间已完成焊接组装。现场施工只涉及老池子接管，可以在周末或者车间检修的 2 天时间内完成碰头切换，绝对不耽误您现有订单的生产交付！”',
  },
  {
    title: '竞争对手攻防要点（对标本地传统工程商）',
    script: '“张总，本地工程公司给您报的传统方案虽然看似便宜，但他们没算隐形成本：第一，传统大池子占地要多占 8 亩地；第二，他们每天要加几千吨自来水稀释，一年的水费电费就要多出 300 多万。选我们的方案，光节省的运行费用 2 年就能把设备投资赚回来！”',
  },
]

const followUpItems = [
  { day: 'Day 1 (今日)', action: '将 AI 生成的《5000t/d 废水提标改造技术建议书(精简版)》发送分管生产副总微信，预约周二拜访。' },
  { day: 'Day 2 (周二)', action: '销售总监带队技术工程师赴客户现场，取水样带回实验室进行铁碳芬顿脱盐小试（拍视频给客户看）。' },
  { day: 'Day 4 (周四)', action: '出具小试脱色降 COD 视频及化验单（证明 COD 从 5500 降至 60 mg/L），向董事长做技术答辩。' },
  { day: 'Day 7 (下周一)', action: '邀请客户董事长及技术总工参观我方在泰兴的同类型 5000 吨运行业绩现场，签署技术协议意向书。' },
]

const handleRunExecution = () => {
  if (isExecuting.value) return
  isExecuting.value = true
  setTimeout(() => {
    isExecuting.value = false
  }, 1200)
}

const handleSelectCase = (id: string) => {
  selectedCaseId.value = id
  const c = SALES_CASES.find((item) => item.id === id)
  if (c && typeof c.inputParams.clientQueryText === 'string') {
    customInputText.value = c.inputParams.clientQueryText
  }
}
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- 1. Header Banner -->
    <EnvAgentBanner
      tone="indigo"
      :icon="Briefcase"
      :code="meta.code"
      :role-name="meta.roleName"
      :agent-name="meta.name"
      headline-phrase="· 环保项目智能销售与商机挖掘"
      :desc="`${meta.tagline}。销售只需输入客户一段话口语化需求，AI 秒级输出客户画像、商机 BANT 评分、推荐工艺方案、对客破冰销售话术与跟进计划。`"
      :stat-items="[
        { label: '方案初稿由 1-2 天 → 45 秒实时推演', accent: true },
        { label: '把每个销售武装成拥有 10 年经验的技术总工' },
      ]"
      stat-label="商机综合评分"
      stat-value="92 分 · A+ 级"
      stat-note="特急高价值重点商机"
    />

    <!-- 2. Customer Demand Input Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Preset Opportunity Case Badges & Basic Indicators -->
      <div class="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Building2 class="w-4 h-4" :class="tone.icon" />
            <span>选择演示商机场景</span>
          </h3>
          <span class="text-[10px] text-slate-500 font-mono">OPPORTUNITY CASE</span>
        </div>

        <div class="space-y-2">
          <button
            v-for="item in SALES_CASES"
            :key="item.id"
            @click="handleSelectCase(item.id)"
            :class="[
              'w-full p-3 rounded-xl border text-left transition-all cursor-pointer',
              selectedCaseId === item.id
                ? [tone.caseActive, 'text-slate-100']
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60',
            ]"
          >
            <div class="text-xs font-bold text-slate-200">{{ item.title }}</div>
            <div class="text-[11px] text-indigo-400/90 mt-0.5">{{ item.industry }}</div>
            <div class="text-[10px] text-slate-500 mt-1 line-clamp-2">{{ item.summary }}</div>
          </button>
        </div>

        <!-- Opportunity Basic Indicators Box -->
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div class="font-semibold text-slate-300">商机基本盘指标：</div>
          <div class="space-y-1.5 text-slate-400 text-[11px]">
            <div>• 客户预算：<span class="text-indigo-300 font-bold">{{ String(activeCase.inputParams.budgetEstimate) }}</span></div>
            <div>• 废水规模：{{ String(activeCase.inputParams.waterVolume) }}</div>
            <div>• 紧迫程度：{{ String(activeCase.inputParams.urgencyLevel) }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Natural Language Input Textarea -->
      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MessageSquare class="w-4 h-4" :class="tone.icon" />
              <span>销售现场沟通记录 / 客户一段话碎片化需求 (可随意修改)</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">NLP NATURAL LANGUAGE</span>
          </div>

          <div class="relative">
            <textarea
              v-model="customInputText"
              rows="4"
              class="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed resize-none"
              placeholder="例如：客户每天产生3000吨酸洗废水，含铁离子高，现在污泥脱水困难，希望做资源化回收，预算1200万..."
            />
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles class="w-4 h-4" :class="tone.icon" />
            <span>AI 将自动推演客户画像、BANT评分、工艺优劣与破冰话术</span>
          </div>

          <button
            @click="handleRunExecution"
            :disabled="isExecuting"
            :class="[
              'px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-950 cursor-pointer disabled:opacity-50',
              tone.btnGradient,
            ]"
          >
            <div v-if="isExecuting" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>{{ isExecuting ? '正在推演销售作战方案...' : 'AI 智能推演销售方案' }}</span>
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

    <!-- 4. Structured Results Dashboard -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
      <!-- Results Nav Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded text-xs font-bold font-mono" :class="tone.codePill">
              A+ 级商机 · 预算约 1,800 万元
            </span>
            <span class="text-xs text-slate-400">
              痛点紧迫度极高 · 赢单概率预估 88%
            </span>
          </div>
          <h2 class="text-lg font-bold text-slate-100 mt-1.5">
            {{ activeCase.companyName }} · 销售攻坚作战方案与破冰指引
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              @click="activeReportTab = 'profile'"
              :class="activeReportTab === 'profile' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              客户画像
            </button>
            <button
              @click="activeReportTab = 'bant'"
              :class="activeReportTab === 'bant' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              BANT商机评估
            </button>
            <button
              @click="activeReportTab = 'techCompare'"
              :class="activeReportTab === 'techCompare' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              推荐工艺方案
            </button>
            <button
              @click="activeReportTab = 'scripts'"
              :class="activeReportTab === 'scripts' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              销售破冰话术
            </button>
            <button
              @click="activeReportTab = 'followup'"
              :class="activeReportTab === 'followup' ? [tone.tabActive, 'text-slate-950 font-bold'] : 'text-slate-400 hover:text-white'"
              class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              7天跟进计划
            </button>
          </div>

          <button
            @click="showExportModal = true"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-indigo-500/30',
              tone.codePill,
            ]"
          >
            <Download class="w-4 h-4" />
            <span>导出方案建议书</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: Customer Profile -->
      <div v-if="activeReportTab === 'profile'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono" :class="tone.chipText">
          客户立体画像与决策链条
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">客户属性与痛感</div>
            <div class="text-sm font-bold text-slate-200">精细化工企业 · 痛感极其强烈</div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              因高盐有机废水常年超标，已被属地生态环境分局约谈并列入挂牌督办，若 3 个月内无实质性整改将面临停产限产，董事长亲自抓该项目。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">核心决策人偏好</div>
            <div class="text-sm font-bold text-slate-200">董事长（决策）+ 生产副总（工期）</div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              董事长关注“100%稳定达标不被罚款”与“投资性价比”；生产副总关注“不影响现有车间连续生产、3个月内通水调试”。
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div class="text-xs text-slate-400">竞争对手态势</div>
            <div class="text-sm font-bold text-slate-200">已有 2 家本地小型工程商接触</div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              竞品采用传统加水稀释+常规曝气方案，被客户质疑占地过大且抗高盐冲击能力差，我方技术路线处于绝对领先优势。
            </p>
          </div>
        </div>
      </div>

      <!-- Tab 2: BANT Evaluation -->
      <div v-else-if="activeReportTab === 'bant'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono" :class="tone.chipText">
          BANT 商机成熟度模型量化评分 (综合得分 92 / 100)
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(item, idx) in bantItems"
            :key="idx"
            class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="w-6 h-6 rounded bg-indigo-500/20 text-indigo-300 font-bold font-mono flex items-center justify-center">
                {{ item.letter }}
              </span>
              <span class="font-mono text-indigo-400 font-bold">{{ item.score }}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-200">{{ item.name }}</h4>
            <div class="text-[11px] text-emerald-400 font-semibold">{{ item.status }}</div>
            <p class="text-[11px] text-slate-400 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Tab 3: Tech Comparison Table -->
      <div v-else-if="activeReportTab === 'techCompare'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono" :class="tone.chipText">
          传统方案 vs XX AI 推荐方案 对比表（对客展示杀手锏）
        </h3>

        <div class="overflow-x-auto rounded-xl border border-slate-800">
          <table class="w-full text-xs text-left text-slate-300">
            <thead class="bg-slate-950 text-slate-400 text-[11px] uppercase font-mono">
              <tr>
                <th class="px-3 py-2.5">比较维度</th>
                <th class="px-3 py-2.5 text-slate-400">传统工艺 (加水稀释+传统生化)</th>
                <th class="px-3 py-2.5 text-indigo-300 font-bold bg-indigo-950/40">XX AI 推荐方案 (高级氧化+强化耐盐MBR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="(row, idx) in techCompareRows" :key="idx" class="hover:bg-slate-900/50">
                <td class="px-3 py-2.5 font-bold text-slate-200">{{ row.dim }}</td>
                <td :class="['px-3 py-2.5 text-slate-400', row.traditionalClass || '']">{{ row.traditional }}</td>
                <td :class="['px-3 py-2.5 bg-indigo-950/20', row.recommendedClass]">{{ row.recommended }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 4: Sales Ice-breaking Scripts -->
      <div v-else-if="activeReportTab === 'scripts'" class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" :class="tone.chipText">
          <MessageSquare class="w-4 h-4" />
          <span>销售实战对客锦囊与破冰话术（直接照着念）</span>
        </h3>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in scriptItems"
            :key="idx"
            class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
          >
            <div class="text-xs font-bold text-indigo-300">{{ item.title }}</div>
            <div class="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed font-sans">
              {{ item.script }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 5: 7-day Follow-up Plan -->
      <div v-else class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider font-mono" :class="tone.chipText">
          商机攻坚 7 天行动计划
        </h3>

        <div class="space-y-2">
          <div
            v-for="(item, idx) in followUpItems"
            :key="idx"
            class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
          >
            <span class="font-mono text-indigo-400 font-bold min-w-[120px]">{{ item.day }}</span>
            <span class="text-slate-300 flex-1 ml-4">{{ item.action }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Professional Disclaimer Footer -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
      <HelpCircle class="w-4 h-4 flex-shrink-0 mt-0.5" :class="tone.icon" />
      <p>
        <strong>销售方案辅助提示：</strong>
        AI 销售员推荐的技术方案与运行成本测算基于行业典型工况大数据。正式对外签署 EPC 合同前，需取样进行实验室小试复核并由工艺总工程师确认最终施工图。
      </p>
    </div>

    <!-- Export Modal -->
    <EnvExportModal
      :is-open="showExportModal"
      :report-title="'泰州精细化工 5,000t/d 工业废水提标改造销售方案建议书'"
      :agent-name="meta.name"
      :company-name="activeCase.companyName"
      :summary-text="'已完成客户画像与 BANT 评分 (92分 A+级)，推荐芬顿高级氧化+耐盐强化MBR方案 (预算1,680万，工期65天)，配套输出对客破冰销售话术与7天攻坚计划。'"
      @close="showExportModal = false"
    />
  </div>
</template>
