<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Cpu, Terminal, Activity, Play, Sliders, Database, Server, CheckCircle } from 'lucide-vue-next'
import type { StudioAgent } from '@/data/contentStudioData'
import { STUDIO_AGENTS, AGENT_LOG_POOL, INITIAL_TERMINAL_LOGS } from '@/data/contentStudioData'

const agents = ref<StudioAgent[]>(JSON.parse(JSON.stringify(STUDIO_AGENTS)))
const terminalLogs = ref<string[]>([...INITIAL_TERMINAL_LOGS])
const activeWorkflow = ref<string | null>(null)
let rollInterval: ReturnType<typeof setInterval> | null = null
let workflowTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  rollInterval = setInterval(() => {
    const randomLog = AGENT_LOG_POOL[Math.floor(Math.random() * AGENT_LOG_POOL.length)]
    const utcTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
    terminalLogs.value = [...terminalLogs.value, `[${utcTime}] ${randomLog}`].slice(-50)
  }, 4000)
})

onBeforeUnmount(() => {
  if (rollInterval) clearInterval(rollInterval)
  if (workflowTimer) clearTimeout(workflowTimer)
})

const logColor = (log: string) => {
  if (log.includes('[SYSTEM INFO]')) return 'text-emerald-400'
  if (log.includes('[ORCHESTRATOR]')) return 'text-pink-400 font-medium'
  if (log.includes('[USER TRIGGER]')) return 'text-amber-400 font-bold'
  if (log.includes('[DB LOG]')) return 'text-blue-400'
  return 'text-zinc-400'
}

const handleTriggerAgentWorkflow = (agentId: string) => {
  if (activeWorkflow.value) return
  activeWorkflow.value = agentId
  const target = agents.value.find((a) => a.id === agentId)
  const utcTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
  terminalLogs.value = [
    ...terminalLogs.value,
    `[${utcTime}] [USER TRIGGER] 用户手动诱导激活了 [${target?.name}] 主动推演任务...`,
    `[${utcTime}] [ORCHESTRATOR] 正在打包 Drizzle ORM，并调拨 Milvus 向量相关数据集...`,
  ]
  workflowTimer = setTimeout(() => {
    terminalLogs.value = [
      ...terminalLogs.value,
      `[${utcTime}] [ORCHESTRATOR] [${target?.name}] 结束对练。状态已变回 online。累计执行 +1`,
    ]
    agents.value = agents.value.map((a) => (a.id === agentId ? { ...a, tasksExecuted: a.tasksExecuted + 1, status: 'active' } : a))
    activeWorkflow.value = null
  }, 2000)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题区 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <Cpu class="w-5 h-5 text-pink-500 animate-spin-slow" />
          AI Agent 协同编排中心
        </h2>
        <p class="text-xs text-zinc-400 mt-1">统筹管理 6 大自主 Agent 节点，各 Agent 基于小红书特定的爆款因果链，承接从热点抓取、心智拆解、选题繁衍到闭环成交的数据对连。</p>
      </div>
      <div class="flex items-center gap-3 bg-[#0c0c0e] px-4 py-2 rounded-lg border border-zinc-900 text-xs text-zinc-300 font-mono shrink-0">
        <Activity class="w-4 h-4 text-emerald-400" />
        <span>全局并发Agent数: <span class="text-emerald-400 font-bold">{{ agents.filter((a) => a.status === 'active').length }}/{{ agents.length }} 在线</span></span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Agent 卡片 -->
      <div class="lg:col-span-7 space-y-4">
        <div class="flex items-center gap-2 text-zinc-200 font-bold text-xs pb-2 border-b border-zinc-900">
          <Sliders class="w-4 h-4 text-pink-500" />
          <h4>自主互咬 Agent 列阵 (Swarm Hierarchy)</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="agent in agents"
            :key="agent.id"
            class="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col justify-between h-56"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold font-mono text-zinc-400 truncate max-w-[170px]">{{ agent.name }}</span>
                <span
                  class="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border shrink-0"
                  :class="agent.status === 'active' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40' : 'bg-zinc-900 text-zinc-500 border-zinc-800'"
                >
                  {{ agent.status === 'active' ? '运行中' : '就绪' }}
                </span>
              </div>
              <p class="text-[11px] text-zinc-500 leading-relaxed min-h-[36px]">{{ agent.role }}</p>
              <div class="pt-2 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                <div class="bg-zinc-950 px-2 py-1.5 rounded border border-zinc-900">
                  <p class="text-zinc-600">累计调用任务</p>
                  <p class="text-xs font-bold text-white mt-0.5">{{ agent.tasksExecuted }} 次</p>
                </div>
                <div class="bg-zinc-950 px-2 py-1.5 rounded border border-zinc-900">
                  <p class="text-zinc-600">指令成功率</p>
                  <p class="text-xs font-bold text-emerald-400 mt-0.5">{{ agent.successRate }}</p>
                </div>
              </div>
            </div>
            <div class="pt-3 flex">
              <button
                class="w-full text-center py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 hover:text-pink-400 border border-zinc-900 text-[10px] font-bold text-zinc-400 flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                :disabled="activeWorkflow !== null"
                @click="handleTriggerAgentWorkflow(agent.id)"
              >
                <Play class="w-3 h-3 text-pink-500" />
                {{ activeWorkflow === agent.id ? '推演编排中...' : '手动诱起推理' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 终端日志 -->
      <div class="lg:col-span-5 p-4 rounded-xl bg-[#030304] border border-zinc-800 border-l-2 border-l-pink-500 flex flex-col h-[560px] justify-between relative">
        <div class="space-y-3 flex flex-col flex-1 overflow-hidden">
          <div class="flex items-center justify-between pb-2 border-b border-zinc-900">
            <div class="flex items-center gap-2">
              <Terminal class="w-4 h-4 text-pink-500" />
              <h4 class="text-xs font-bold text-zinc-300 font-mono tracking-wider">爆款云大脑编排日志 (Agent Swarm Terminal)</h4>
            </div>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-950"></span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[10px] text-zinc-400 leading-relaxed">
            <div v-for="(log, idx) in terminalLogs" :key="idx" class="whitespace-pre-wrap select-text font-mono border-l border-zinc-900 pl-2" :class="logColor(log)">
              {{ log }}
            </div>
          </div>
        </div>
        <div class="pt-3 mt-2 border-t border-zinc-900 flex items-center justify-between font-mono text-[9px] text-zinc-600">
          <span class="flex items-center gap-1"><Database class="w-3 h-3 text-blue-500" /> drizzle-pg-connector: OK</span>
          <span class="flex items-center gap-1"><Server class="w-3 h-3 text-pink-500" /> gemini-统一模型·路由: Active</span>
        </div>
      </div>
    </div>
  </div>
</template>
