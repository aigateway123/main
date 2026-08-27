<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { TrendingUp, Sliders, Award, ShieldAlert, CheckCircle, Activity, Bookmark, Cpu } from 'lucide-vue-next'
import type { DiagnosticsResult, StudioAssetType } from '@/data/contentStudioData'
import { PRESET_DIAGNOSTICS } from '@/data/contentStudioData'

const emit = defineEmits<{ (e: 'saveToAssets', title: string, content: string, category: string, type: StudioAssetType): void }>()

const views = ref(62000)
const clicks = ref(2500)
const interactions = ref(210)
const conversions = ref(15)
const notes = ref(
  '这是一个关于小红书新起时尚穿搭类别的新账号。目前发了3篇图文笔记。感觉曝光量还可以，但是点击率和私信转化似乎特别卡顿，急需专业诊断建议！'
)
const loading = ref(false)
const result = ref<DiagnosticsResult | null>(null)
const saved = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const handleDiagnose = () => {
  if (loading.value) return
  loading.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    loading.value = false
    result.value = PRESET_DIAGNOSTICS
    saved.value = false
  }, 1500)
}

const handleSaveReport = () => {
  if (!result.value) return
  const r = result.value
  const body = [
    '【账号诊断周期】: 2026-06-07 诊断大报告',
    `【输入数据】: 曝光 ${views.value} / 点击 ${clicks.value} / 互动 ${interactions.value} / 私信 ${conversions.value}`,
    `【算法率值换算】: CTR ${r.metrics.ctr}% (正常区间 8%-12%) / 互动率 ${r.metrics.engagementRate}% (均值8%) / 私信率 ${r.metrics.conversionRate}%`,
    '【总评评估报告】: ' + r.evaluation,
    '【排阻致命缺陷】' + r.issues.map((i, idx) => `致命阻碍${idx + 1}. ${i}`).join('\n'),
    '【优化改善实战策略】' + r.suggestions.map((s, idx) => `调优指教${idx + 1}. ${s}`).join('\n'),
    '【十五天精细涨粉周密排程】' + r.growthPlan.map((g) => `${g.phase} -> ${g.action}`).join('\n'),
  ].join('\n\n')
  emit('saveToAssets', '【AI 账号体检总报告】时尚穿搭大组', body, '行业诊断报告', 'preset')
  saved.value = true
}

const metricsCards = (m: DiagnosticsResult['metrics']) => [
  { label: '笔记展示点击率 (CTR)', value: m.ctr, unit: '%', avg: '/行业均8%', good: m.ctr >= 8, goodText: '健康', badText: '偏低', bar: Math.min(m.ctr * 8, 100), color: m.ctr >= 8 ? 'bg-emerald-500' : 'bg-pink-500' },
  { label: '点击后互动率 (ENGAGE)', value: m.engagementRate, unit: '%', avg: '/均值8%', good: m.engagementRate >= 7, goodText: '极佳', badText: '常规', bar: Math.min(m.engagementRate * 8, 100), color: 'bg-violet-500' },
  { label: '私信获取率 (CONV)', value: m.conversionRate, unit: '%', avg: '/均值2%', good: m.conversionRate >= 1.5, goodText: '优良', badText: '干涸', bar: Math.min(m.conversionRate * 12, 100), color: 'bg-blue-500' },
]

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题区 -->
    <div>
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-pink-500" />
        全息数位数据诊断中心
      </h2>
      <p class="text-xs text-zinc-400 mt-1">智能录入或一键导入 Xiaohongshu 创作者后台大盘参数。AI 将自动计算折损率、CTR 指标，诊断当前账号权重健康度，输出调优步骤。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- 左：录入表单 -->
      <div class="lg:col-span-4 rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 space-y-4 self-start">
        <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <Sliders class="w-3.5 h-3.5 text-pink-500" />
          录入创作者数据漏斗
        </h4>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">曝光总量 (Views)</label>
            <input v-model.number="views" type="number" id="diag-views" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">展示点击数 (Clicks)</label>
            <input v-model.number="clicks" type="number" id="diag-clicks" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">用户互动量</label>
            <input v-model.number="interactions" type="number" id="diag-ints" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">成交/求私信量</label>
            <input v-model.number="conversions" type="number" id="diag-convs" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">矩阵运营备注或运营卡点</label>
          <textarea v-model="notes" id="diag-notes" rows="4" placeholder="在此描述目前遭遇的细化痛点..." class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50 resize-none"></textarea>
        </div>
        <button
          class="w-full py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-60"
          :disabled="loading"
          @click="handleDiagnose"
        >
          <Cpu class="w-3.5 h-3.5" :class="loading ? 'animate-spin-slow' : ''" />
          {{ loading ? '体检诊断大盘算力调拨中...' : '启动 AI 数据全科体检' }}
        </button>
        <p v-if="loading" class="text-[10px] text-zinc-500 leading-relaxed font-mono">
          深度数据审计中：AI 诊断 Agent 正在换算 CTR% 与互动转置率，整合小红书最新大盘分界系数推荐模型...
        </p>
      </div>

      <!-- 右：结果区 -->
      <div class="lg:col-span-8 space-y-4">
        <div v-if="loading" class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          <p class="mt-4 text-[11px] text-zinc-500">正在执行全链路数据审计...</p>
        </div>

        <template v-else-if="result">
          <!-- 3 指标卡 -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="card in metricsCards(result.metrics)" :key="card.label" class="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-900">
              <div class="flex items-center justify-between">
                <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{{ card.label }}</p>
                <span class="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold border" :class="card.good ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40' : 'bg-pink-950/30 text-pink-400 border-pink-900/40'">
                  {{ card.good ? card.goodText : card.badText }}
                </span>
              </div>
              <p class="mt-2 text-2xl font-extrabold text-white font-mono">{{ card.value.toFixed(2) }}<span class="text-sm text-zinc-500">{{ card.unit }}</span></p>
              <p class="text-[9px] text-zinc-600 font-mono">{{ card.avg }}</p>
              <div class="mt-3 h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :class="card.color" :style="{ width: card.bar + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- 总评 -->
          <div class="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Award class="w-4 h-4 text-pink-500" />
                AI 数据审计分析总评
              </h4>
              <button
                class="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                :class="saved ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-emerald-600/50 hover:text-emerald-400'"
                @click="handleSaveReport"
              >
                <Bookmark class="w-3 h-3" :class="saved ? 'fill-current' : ''" />
                {{ saved ? '体检报告已归档' : '一键保存到归档资产' }}
              </button>
            </div>
            <p class="mt-3 text-[11px] text-zinc-400 leading-relaxed">{{ result.evaluation }}</p>

            <div class="mt-5 space-y-5">
              <div>
                <p class="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5">
                  <ShieldAlert class="w-3.5 h-3.5 text-rose-500" />
                  致命算法降权/阻卡卡点:
                </p>
                <div class="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div v-for="(issue, i) in result.issues" :key="i" class="rounded-lg bg-rose-950/10 border border-rose-900/30 p-3">
                    <span class="text-[8px] font-bold text-rose-400 font-mono">排阻缺陷.{{ i + 1 }}</span>
                    <p class="mt-1 text-[10px] text-zinc-400 leading-relaxed">{{ issue }}</p>
                  </div>
                </div>
              </div>

              <div>
                <p class="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle class="w-3.5 h-3.5 text-emerald-500" />
                  精修实操性改善策略:
                </p>
                <div class="mt-2 space-y-1.5">
                  <p v-for="(s, i) in result.suggestions" :key="i" class="text-[10px] text-zinc-400 leading-relaxed font-mono border-l-2 border-emerald-600/50 pl-2">调优措施 {{ i + 1 }}: {{ s }}</p>
                </div>
              </div>

              <div>
                <p class="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5">
                  <Activity class="w-3.5 h-3.5 text-blue-500" />
                  周密起号涨粉增长规划:
                </p>
                <div class="mt-2 space-y-2">
                  <div v-for="(g, i) in result.growthPlan" :key="i" class="flex items-center gap-3 rounded-lg bg-zinc-950 border border-zinc-900 p-2.5">
                    <span class="text-[8px] font-bold text-blue-400 bg-blue-950/30 border border-blue-900/40 px-1.5 py-0.5 rounded font-mono shrink-0">{{ g.phase }}</span>
                    <p class="text-[10px] text-zinc-400">{{ g.action }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 空态 -->
        <div v-else class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
          <TrendingUp class="w-8 h-8 text-zinc-700" />
          <p class="mt-4 text-sm font-bold text-zinc-300">大盘分析舱待命</p>
          <p class="mt-1.5 text-[11px] text-zinc-500 max-w-sm">录入创作者数据并点击【启动 AI 诊断】，AI 专家将立即拆卸流量全链路卡脖阻碍，生成针对性改善方案。</p>
        </div>
      </div>
    </div>
  </div>
</template>
