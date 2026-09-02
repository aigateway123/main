<script setup lang="ts">
// 环保 AI 员工矩阵 · AI 员工全景驾驶舱 —— 转译自原型 AgentMatrixDashboard.tsx
import {
  ShieldCheck, FileCheck2, FileText, Trophy, Briefcase, Activity, Flame, BarChart3,
  ArrowRight, Presentation, ChevronRight, Cpu, type LucideIcon,
} from 'lucide-vue-next'
import type { EnvEmployeeId } from '@/data/envAgentData'
import { ENV_AGENTS_META } from '@/data/envAgentData'

const emit = defineEmits<{
  (e: 'select-agent', id: EnvEmployeeId): void
  (e: 'open-pitch-guide', id?: EnvEmployeeId): void
}>()

const iconOf = (id: EnvEmployeeId): LucideIcon => {
  switch (id) {
    case 'compliance': return ShieldCheck
    case 'permit': return FileCheck2
    case 'reporter': return FileText
    case 'bid': return Trophy
    case 'sales': return Briefcase
    case 'monitoring': return Activity
    case 'waste': return Flame
    case 'operations': return BarChart3
  }
}

const iconColorOf = (id: EnvEmployeeId): string => {
  switch (id) {
    case 'compliance':
    case 'monitoring': return 'text-emerald-400'
    case 'permit': return 'text-teal-400'
    case 'reporter': return 'text-cyan-400'
    case 'bid': return 'text-blue-400'
    case 'sales': return 'text-indigo-400'
    case 'waste': return 'text-amber-400'
    case 'operations': return 'text-violet-400'
  }
}

const hoverColorOf = (id: EnvEmployeeId): string => {
  switch (id) {
    case 'compliance':
    case 'monitoring': return 'hover:border-emerald-500/50 hover:shadow-emerald-950/40'
    case 'permit': return 'hover:border-teal-500/50 hover:shadow-teal-950/40'
    case 'reporter': return 'hover:border-cyan-500/50 hover:shadow-cyan-950/40'
    case 'bid': return 'hover:border-blue-500/50 hover:shadow-blue-950/40'
    case 'sales': return 'hover:border-indigo-500/50 hover:shadow-indigo-950/40'
    case 'waste': return 'hover:border-amber-500/50 hover:shadow-amber-950/40'
    case 'operations': return 'hover:border-violet-500/50 hover:shadow-violet-950/40'
  }
}

const closedLoopSteps = [
  { step: '01', title: '上传企业资料', desc: '环评/监测/合同/台账' },
  { step: '02', title: 'AI 自动解析', desc: '多源结构化数据提取' },
  { step: '03', title: '调用行业规则', desc: '国标HJ技术规范/法规' },
  { step: '04', title: 'AI 识别问题', desc: '合规/缺口/超标/红线' },
  { step: '05', title: '生成专业结果', desc: '底稿/报告/方案/图谱' },
  { step: '06', title: '给出下一步行动', desc: '工单/整改/催收/申报' },
]

const customerScenes = [
  {
    target: '环保咨询公司',
    pain: '环评、排污许可执行报告编制繁琐，技术人员加班严重',
    agents: ['AI 环保合规官', 'AI 排污许可助手', 'AI 环保报告员'],
    value: '报告出具速度提升 500%，初级工程师产出翻倍',
  },
  {
    target: '环保工程公司',
    pain: '招投标标书 200+ 页反复看，技术方案编制慢，销售拓客缺乏技术支撑',
    agents: ['AI 环保投标经理', 'AI 环保销售员', 'AI 环保企业经营助手'],
    value: '投标响应缩短至 3 分钟，废标率降为 0，销售快速出方案',
  },
  {
    target: '工业企业环保部门',
    pain: '随时面临环保督察，监测数据易超标，危废台账繁琐易踩法律红线',
    agents: ['AI 环保合规官', 'AI 环境监测分析师', 'AI 危废管理助手'],
    value: '提前 6-8 小时超标预警，危废合规率 100%，规避刑事罚单',
  },
  {
    target: '中小型环保企业老总',
    pain: '招人难、养人贵，项目毛利算不清，应收账款回款滞后',
    agents: ['AI 环保企业经营助手', 'AI 环保销售员', 'AI 环保投标经理'],
    value: '人均产值从 80万 提升至 135万，项目盈亏一键穿透',
  },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- 1. Value Proposition Hero Header -->
    <div class="relative overflow-hidden rounded-3xl bg-[#0F1218] border border-slate-800 p-8 lg:p-12 shadow-2xl">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-4xl space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>环保行业专属 AI 员工矩阵</span>
        </div>

        <h1 class="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          让环保企业低成本拥有自己的
          <br class="hidden sm:inline" />
          <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            专业级 AI 员工团队
          </span>
        </h1>

        <p class="text-sm lg:text-base text-slate-300 leading-relaxed max-w-3xl">
          专为环保咨询公司、环保工程公司、工业企业环保部及中小型环保企业量身定制。
          不再是简单聊天框，而是深度嵌入环保垂直业务，自动完成合规诊断、排污申报、报告编制、招投标作战、销售拓客与危废管理。
          <strong class="text-emerald-300 font-semibold ml-1">
            用 1/10 的成本，替员工完成 80% 的基础案头工作。
          </strong>
        </p>

        <div class="flex flex-wrap items-center gap-4 pt-2">
          <button
            @click="emit('select-agent', 'compliance')"
            class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <span>立即体验 8 位 AI 员工</span>
            <ArrowRight class="w-4 h-4" />
          </button>

          <button
            @click="emit('open-pitch-guide')"
            class="px-5 py-3 rounded-xl bg-[#0A0C10] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Presentation class="w-4 h-4 text-emerald-400" />
            <span>打开现场销售对客演练指南</span>
          </button>
        </div>
      </div>

      <!-- 4 Core Value Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800">
        <div class="space-y-1">
          <div class="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">8 位</div>
          <div class="text-xs text-slate-400">环保垂直专属 Agent</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl lg:text-3xl font-black text-cyan-400 font-mono">80%+</div>
          <div class="text-xs text-slate-400">案头工作时间节省</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl lg:text-3xl font-black text-teal-400 font-mono">100%</div>
          <div class="text-xs text-slate-400">生态环境标准与法规库</div>
        </div>
        <div class="space-y-1">
          <div class="text-2xl lg:text-3xl font-black text-amber-400 font-mono">30 秒</div>
          <div class="text-xs text-slate-400">标准技术报告与底稿成文</div>
        </div>
      </div>
    </div>

    <!-- 2. Universal Interaction Workflow Explainer -->
    <div class="bg-[#0F1218] border border-slate-800 rounded-2xl p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Cpu class="w-4 h-4 text-emerald-400" />
          <span>8 位 AI 员工统一核心业务闭环架构</span>
        </h2>
        <span class="text-[10px] text-slate-500 font-mono tracking-wider">END-TO-END PIPELINE</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
        <div v-for="item in closedLoopSteps" :key="item.step" class="p-3 rounded-xl bg-[#0A0C10] border border-slate-800 space-y-1">
          <div class="text-[10px] font-mono text-emerald-400 font-bold">{{ item.step }}</div>
          <div class="font-bold text-slate-200 text-[11px]">{{ item.title }}</div>
          <div class="text-[10px] text-slate-500">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 3. The 8 Agents Grid -->
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold text-white tracking-tight">
            8 位环保 AI 员工矩阵工作台
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            点击任意 AI 员工进入专属工作台，体验完整的业务闭环推演。
          </p>
        </div>
        <div class="text-xs text-slate-500 font-mono uppercase tracking-wider">
          8 AGENTS FULLY OPERATIONAL
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="agent in ENV_AGENTS_META"
          :key="agent.id"
          class="rounded-2xl bg-[#0F1218] border border-slate-800 p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-lg"
          :class="hoverColorOf(agent.id)"
        >
          <div class="space-y-3">
            <!-- Header tag -->
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-mono font-bold">
                {{ agent.code }}
              </span>
              <div class="p-2 rounded-xl bg-[#0A0C10] border border-slate-800">
                <component :is="iconOf(agent.id)" class="w-6 h-6" :class="iconColorOf(agent.id)" />
              </div>
            </div>

            <div>
              <h3 class="text-base font-bold text-white transition-colors">
                {{ agent.name }}
              </h3>
              <div class="text-xs text-slate-400 font-medium mt-0.5">
                {{ agent.roleName }}
              </div>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {{ agent.tagline }}
            </p>

            <!-- Pipeline mini specs -->
            <div class="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
              <div class="text-slate-500">
                <strong class="text-slate-400 font-medium">输入：</strong>{{ agent.inputSummary }}
              </div>
              <div class="text-slate-500">
                <strong class="text-slate-400 font-medium">输出：</strong>{{ agent.outputSummary }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <button
              @click="emit('select-agent', agent.id)"
              class="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>进入工作台</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>

            <button
              @click="emit('open-pitch-guide', agent.id)"
              title="查看对客销售话术"
              class="p-2 rounded-xl bg-[#0A0C10] hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-all cursor-pointer"
            >
              <Presentation class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Target Customers & Business Fit Matrix -->
    <div class="rounded-2xl bg-[#0F1218] border border-slate-800 p-6 lg:p-8 space-y-6">
      <div>
        <h2 class="text-lg font-bold text-white">
          四大目标客户场景与 AI 员工赋能图谱
        </h2>
        <p class="text-xs text-slate-400 mt-1">
          无论是咨询、工程、工业企业还是中小微环保公司，都能精准匹配对应的 AI 劳动力。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="item in customerScenes" :key="item.target" class="p-4 rounded-xl bg-[#0A0C10] border border-slate-800 space-y-3">
          <div class="font-bold text-emerald-400 text-sm">{{ item.target }}</div>
          <div class="text-xs text-slate-400">
            <span class="text-slate-500">痛点：</span>{{ item.pain }}
          </div>
          <div class="space-y-1">
            <div class="text-[11px] text-slate-500">主推 AI 员工：</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(ag, aIdx) in item.agents"
                :key="aIdx"
                class="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800 font-mono"
              >
                {{ ag }}
              </span>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-800 text-[11px] text-teal-300 font-medium">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
