<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/App.tsx（内联 settings 区块，约第 250-290 行） -->
<script setup lang="ts">
import { DATA_CHANNELS } from '@/data/tradeIntelData'

const emit = defineEmits<{
  (e: 'go-home'): void
}>()

const goHome = () => emit('go-home')
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">系统与智能采集规则设置</h2>
      <p class="text-xs text-slate-500 mt-1">配置数据采集源接入权限、数据清洗阈值及模型偏好</p>
    </div>

    <div class="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-slate-800">数据接入通道状态</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div
            v-for="channel in DATA_CHANNELS"
            :key="channel.name"
            class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
          >
            <span class="text-slate-700">{{ channel.name }}</span>
            <span class="text-emerald-600 font-bold font-mono">{{ channel.status }}</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200 flex justify-end">
        <button
          class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer shadow-sm"
          @click="goHome"
        >
          返回新建任务
        </button>
      </div>
    </div>
  </div>
</template>
