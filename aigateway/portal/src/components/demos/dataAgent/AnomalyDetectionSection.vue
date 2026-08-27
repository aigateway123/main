<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-vue-next'
import { ANOMALY_SAMPLES, type AnomalySample } from '@/data/dataAgentData'

const samples = ref<AnomalySample[]>(ANOMALY_SAMPLES.map((s) => ({ ...s })))
const activeFilter = ref<'all' | '高' | '中'>('all')
const toastMessage = ref<string | null>(null)

const filteredSamples = computed(() =>
  activeFilter.value === 'all' ? samples.value : samples.value.filter((s) => s.riskLevel === activeFilter.value),
)

const handleAction = (id: string, newStatus: 'excluded' | 'verified') => {
  const target = samples.value.find((s) => s.id === id)
  samples.value = samples.value.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
  const actionName = newStatus === 'excluded' ? '已标记剔除 (Exclude)' : '已标记保留复核 (Verified)'
  toastMessage.value = `${target?.sampleIndex} ${actionName}`
  setTimeout(() => (toastMessage.value = null), 2500)
}
</script>

<template>
  <section class="bg-[#0f172a] rounded-xl border border-[#1e293b] p-5 sm:p-6 shadow-xl">
    <!-- Toast 通知 -->
    <div v-if="toastMessage"
      class="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-blue-500/60 text-white text-xs font-mono px-4 py-2.5 rounded-xl shadow-2xl shadow-blue-950/80 flex items-center gap-2 animate-in fade-in duration-200">
      <CheckCircle2 class="w-4 h-4 text-emerald-400" />
      <span>{{ toastMessage }}</span>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
      <div>
        <h3 class="text-lg font-bold text-white tracking-tight border-l-2 border-blue-500 pl-3">异常检测 (Anomaly Alerts)</h3>
        <p class="text-xs sm:text-sm text-[#cbd5e1] mt-1 pl-3 font-medium">
          <span class="text-red-400 font-bold">AI发现 3 个值得关注的异常样本。</span>
          <span class="text-[#64748b] font-normal ml-2">（Isolation Forest 孤立森林与 3σ 置信界限双重校验）</span>
        </p>
      </div>

      <div class="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-[#1e293b] self-start sm:self-auto">
        <button
          class="px-2.5 py-1 text-xs rounded transition-colors cursor-pointer"
          :class="activeFilter === 'all' ? 'bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/40' : 'text-[#64748b] hover:text-white'"
          @click="activeFilter = 'all'"
        >全部 (3)</button>
        <button
          class="px-2.5 py-1 text-xs rounded transition-colors cursor-pointer"
          :class="activeFilter === '高' ? 'bg-red-500/20 text-red-400 font-semibold border border-red-500/40' : 'text-[#64748b] hover:text-white'"
          @click="activeFilter = '高'"
        >高风险 (2)</button>
        <button
          class="px-2.5 py-1 text-xs rounded transition-colors cursor-pointer"
          :class="activeFilter === '中' ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/40' : 'text-[#64748b] hover:text-white'"
          @click="activeFilter = '中'"
        >中风险 (1)</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      <div
        v-for="sample in filteredSamples"
        :key="sample.id"
        class="rounded-xl border p-4 flex flex-col justify-between transition-all duration-200"
        :class="sample.status === 'excluded'
          ? 'bg-black/20 border-[#1e293b] opacity-60'
          : sample.riskLevel === '高'
          ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
          : 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40'"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5 font-mono text-xs font-bold text-red-400">
              <AlertTriangle class="w-3.5 h-3.5" />
              <span>{{ sample.sampleIndex }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold" :class="sample.riskLevel === '高' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'">
                {{ sample.riskLevel === '高' ? 'HIGH RISK' : 'MEDIUM' }}
              </span>
              <span class="text-[10px] text-[#64748b] font-mono">Score: {{ sample.score }}</span>
            </div>
          </div>

          <div class="bg-black/40 rounded-lg p-2.5 border border-[#1e293b] mb-2.5 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#94a3b8]">{{ sample.abnormalFeature }}:</span>
              <span class="font-mono font-bold text-white">{{ sample.observedValue }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#64748b]">
              <span>预期正常基线:</span>
              <span class="font-mono">{{ sample.expectedRange }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-red-400 font-mono">
              <span>离群偏离度:</span>
              <span>{{ sample.deviation }}</span>
            </div>
          </div>

          <div class="text-xs text-[#cbd5e1] space-y-1 mb-3">
            <div class="flex items-start gap-1">
              <Info class="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span class="text-[11px] text-[#94a3b8] leading-relaxed">
                <strong class="text-white font-semibold">AI 归因诊断：</strong>{{ sample.cause }}
              </span>
            </div>
            <div class="text-[11px] text-blue-400 pl-4">💡 建议处理：{{ sample.suggestion }}</div>
          </div>
        </div>

        <div class="pt-2.5 border-t border-[#1e293b] flex items-center justify-between gap-2">
          <span class="text-[10px] font-mono text-[#64748b]">
            {{ sample.status === 'excluded' ? '已隔离剔除' : sample.status === 'verified' ? '已确认保留' : '待处置' }}
          </span>
          <div class="flex items-center gap-1.5">
            <button
              class="px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
              :class="sample.status === 'excluded'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-black/40 hover:bg-red-500/20 text-[#94a3b8] hover:text-red-300 border border-[#1e293b]'"
              @click="handleAction(sample.id, 'excluded')"
            >{{ sample.status === 'excluded' ? '已剔除' : '一键剔除' }}</button>
            <button
              class="px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
              :class="sample.status === 'verified'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-black/40 hover:bg-emerald-500/20 text-[#94a3b8] hover:text-emerald-300 border border-[#1e293b]'"
              @click="handleAction(sample.id, 'verified')"
            >{{ sample.status === 'verified' ? '已保留' : '保留复核' }}</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
