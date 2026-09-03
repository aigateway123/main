<!-- ============================================================================
     AI 法务员工 · 法务任务与待处理合同（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/tasks/MyTasksView.tsx
     props：initialTab（'tasks' | 'pending'，默认 'tasks'，容器按菜单 my-tasks/pending-contracts 传值）
     emits：start-review-contract（name: string，任务行/待审合同行点击「直达AI审查/立即启动审查」）
     数据：待办任务照原型硬编码 t-01..t-05；待审核清单过滤 '@/data/legalMockData' 的
           MOCK_ALL_CONTRACTS（status==='pending' || riskLevel==='high'）
     图标映射：CheckCircle2/FileCheck2/AlertTriangle/ListTodo/Filter/Plus 原型未渲染，未引入；
           lucide-vue-next 0.577 仅用到 Clock / ArrowRight
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Clock } from 'lucide-vue-next'
import { MOCK_ALL_CONTRACTS } from '@/data/legalMockData'
import type { RiskLevel } from '@/data/legalIntelData'

const props = withDefaults(
  defineProps<{ initialTab?: 'tasks' | 'pending' }>(),
  { initialTab: 'tasks' }
)
const emit = defineEmits<{ (e: 'start-review-contract', name: string): void }>()

const activeTab = ref<'tasks' | 'pending'>(props.initialTab)
const completedTaskIds = ref<Set<string>>(new Set())

// 法务待办任务（照原型硬编码）
const TASKS: { id: string; title: string; priority: string; ddl: string; contract: string; desc: string }[] = [
  { id: 't-01', title: '《设备采购合同》P0级高风险条款复核', priority: 'P0 紧急', ddl: '今日 18:00', contract: '设备采购合同.pdf', desc: '预付款70%且缺乏保函，建议根据AI示范条款出具修改版' },
  { id: 't-02', title: '大储供货协议到期续约条款与保质期评估', priority: 'P0 紧急', ddl: '明日 12:00', contract: '大储供货合作框架协议.docx', desc: '对方提出单边免责及排他限制，需法务起草答复备忘录' },
  { id: 't-03', title: '二期厂房租赁合同到期前书面确认函', priority: 'P1 重要', ddl: '2天后', contract: '二期厂房租赁合同.pdf', desc: '距离租赁期满27天，依据合同第14.2条需在30日前书面通知' },
  { id: 't-04', title: '核心研发高管竞业限制协议签署审查', priority: 'P1 重要', ddl: '本周五', contract: '高级人才竞业限制协议.pdf', desc: '核定离职补偿金标准与竞业主体清单' },
  { id: 't-05', title: '欧盟新电池法碳足迹合规要求内部宣导', priority: 'P2 提示', ddl: '下周一', contract: '出海合规指引.pdf', desc: '同步研发中心与涉外供应链采购规范' },
]

// 待审核与高风险合同清单（与原型一致的过滤条件）
const pendingContracts = computed(() =>
  MOCK_ALL_CONTRACTS.filter((c) => c.status === 'pending' || c.riskLevel === 'high')
)

const activeTaskCount = computed(() => TASKS.length - completedTaskIds.value.size)

const toggleComplete = (id: string) => {
  const next = new Set(completedTaskIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  completedTaskIds.value = next
}

const isTaskDone = (id: string) => completedTaskIds.value.has(id)

// 优先级徽章：P0→rose / P1→amber / P2→blue（照原型）
const priorityCls = (priority: string) =>
  priority.includes('P0')
    ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
    : priority.includes('P1')
      ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
      : 'bg-blue-950/60 text-blue-300 border-blue-800/50'

// 风险等级徽章：文本照原型，颜色按等级分级着色（高→rose / 中→amber / 低→blue）
const riskLabel = (level: RiskLevel) =>
  level === 'high' ? '高风险' : level === 'medium' ? '中风险' : '低风险'
const riskCls = (level: RiskLevel) =>
  level === 'high'
    ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
    : level === 'medium'
      ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
      : 'bg-blue-950/60 text-blue-300 border-blue-800/50'
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500" />
          <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            日常工作流管理
          </span>
        </div>
        <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
          法务任务与待处理合同
        </h1>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
      <button
        type="button"
        @click="activeTab = 'tasks'"
        class="pb-3 border-b-2 transition-all cursor-pointer"
        :class="activeTab === 'tasks' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        法务待办工作任务 ({{ activeTaskCount }})
      </button>
      <button
        type="button"
        @click="activeTab = 'pending'"
        class="pb-3 border-b-2 transition-all cursor-pointer"
        :class="activeTab === 'pending' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        待审核与高风险合同清单 ({{ pendingContracts.length }})
      </button>
    </div>

    <!-- 待办任务 Tab -->
    <div v-if="activeTab === 'tasks'" class="space-y-3">
      <div
        v-for="task in TASKS"
        :key="task.id"
        class="bg-slate-900 rounded-xl border p-4 shadow-sm transition-all flex items-start justify-between gap-4"
        :class="isTaskDone(task.id) ? 'border-slate-800/80 bg-slate-950/40 opacity-60' : 'border-slate-800 hover:border-slate-700'"
      >
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            :checked="isTaskDone(task.id)"
            @change="toggleComplete(task.id)"
            class="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-950 cursor-pointer"
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] px-2 py-0.5 rounded font-bold border" :class="priorityCls(task.priority)">
                {{ task.priority }}
              </span>
              <h3 class="text-xs sm:text-sm font-bold" :class="isTaskDone(task.id) ? 'line-through text-slate-500' : 'text-slate-100'">
                {{ task.title }}
              </h3>
            </div>
            <p class="text-xs text-slate-400 mt-1">{{ task.desc }}</p>
            <div class="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-1.5">
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3 text-slate-400" />
                <span>截止时间：{{ task.ddl }}</span>
              </span>
              <span>关联合同：{{ task.contract }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="emit('start-review-contract', task.contract)"
          class="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white font-semibold px-3 py-1.5 rounded bg-blue-950/80 border border-blue-800/60 hover:bg-blue-900 shrink-0 cursor-pointer"
        >
          <span>直达AI审查</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- 待审核与高风险合同清单 Tab -->
    <div v-else class="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            <th class="px-4 py-3">待处理合同</th>
            <th class="px-4 py-3">签约相对方</th>
            <th class="px-4 py-3">标的金额</th>
            <th class="px-4 py-3">风险等级</th>
            <th class="px-4 py-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/80">
          <tr v-for="c in pendingContracts" :key="c.id" class="hover:bg-slate-800/50 transition-colors">
            <td class="px-4 py-3 font-bold text-slate-200">{{ c.title }}</td>
            <td class="px-4 py-3 text-slate-400">{{ c.partyB }}</td>
            <td class="px-4 py-3 font-mono font-bold text-slate-200">{{ c.amount }}</td>
            <td class="px-4 py-3">
              <span class="text-[10px] px-2 py-0.5 rounded border font-bold" :class="riskCls(c.riskLevel)">
                {{ riskLabel(c.riskLevel) }} ({{ c.riskScore }}分)
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                @click="emit('start-review-contract', c.title)"
                class="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
              >
                立即启动审查
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
