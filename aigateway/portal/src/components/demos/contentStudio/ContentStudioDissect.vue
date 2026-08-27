<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { Sparkles, Link, Cpu, Award, Bookmark, Printer, Copy } from 'lucide-vue-next'
import type { DissectReport, StudioAssetType } from '@/data/contentStudioData'
import { PRESET_DISSECT_REPORT, DISSECT_SAMPLES } from '@/data/contentStudioData'

const props = defineProps<{ initialUrl?: string }>()
const emit = defineEmits<{ (e: 'saveToAssets', title: string, content: string, category: string, type: StudioAssetType): void }>()

const url = ref(props.initialUrl || '')
const loading = ref(false)
const report = ref<DissectReport | null>(null)
const error = ref(false)
const saved = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
const handlePrintReport = () => window.print()

// 雷达 URL → 自动触发拆解
watch(
  () => props.initialUrl,
  (val) => {
    if (val) {
      url.value = val
      triggerDissection(val)
    }
  },
  { immediate: true }
)

const triggerDissection = (targetUrl: string) => {
  if (!targetUrl.trim() || loading.value) return
  loading.value = true
  error.value = false
  if (timer) clearTimeout(timer)
  // 模拟 AI 拆解请求（1.4s）
  timer = setTimeout(() => {
    loading.value = false
    report.value = PRESET_DISSECT_REPORT
    saved.value = false
  }, 1400)
}

const loadSample = (sampleUrl: string) => {
  url.value = sampleUrl
  triggerDissection(sampleUrl)
}

const handleSaveAsset = () => {
  if (!report.value) return
  const r = report.value
  const body = [
    '【原爆款标题】: ' + r.title,
    '【原爆款内容】: ' + r.content,
    '【大图标题拆解】: ' + r.analysis.titleStructure,
    '【黄金前三秒拆解】: ' + r.analysis.hookStructure,
    '【正文信息逻辑拆解】: ' + r.analysis.bodyStructure,
    '【情感心智调配】: ' + r.analysis.emotionTriggers,
    '【评论区诱钩布局】: ' + r.analysis.commentTactics,
    '【全链路漏斗转化】: ' + r.analysis.conversionDrivers,
  ].join('\n\n')
  emit('saveToAssets', r.title, body, '爆款拆解报告', 'copy')
  saved.value = true
}

const ANALYSIS_SECTIONS = [
  { key: 'titleStructure' as const, label: '1. 标题结构解析 (Title Structure)', color: 'bg-orange-500' },
  { key: 'hookStructure' as const, label: '2. 黄金前3s开头布局 (Hook Structure)', color: 'bg-indigo-500' },
  { key: 'bodyStructure' as const, label: '3. 正文逻辑层级 (Body Pattern)', color: 'bg-emerald-500' },
  { key: 'emotionTriggers' as const, label: '4. 情绪与心智钩子 (Emotion Triggers)', color: 'bg-amber-500' },
  { key: 'commentTactics' as const, label: '5. 评论区水军引导策略 (Comment Section Guide)', color: 'bg-blue-500' },
  { key: 'conversionDrivers' as const, label: '6. 后置获客转化设计 (Conversion Drivers)', color: 'bg-rose-500' },
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
        <Sparkles class="w-5 h-5 text-pink-500" />
        全链条爆文结构拆解
      </h2>
      <p class="text-xs text-zinc-400 mt-1">粘贴小红书笔记链接，AI 增长专家将立即拆解其标题、钩子、配画、情感驱动、评论诱引和高价值转化链路。</p>
    </div>

    <!-- URL 输入面板 -->
    <div class="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <Link class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input
            v-model="url"
            type="text"
            placeholder="在此粘贴小红书笔记链接或关键词 (例如: https://www.xiaohongshu.com/discovery/item/...)"
            class="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
            @keyup.enter="triggerDissection(url)"
          />
        </div>
        <button
          class="px-5 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-60"
          :disabled="loading"
          @click="triggerDissection(url)"
        >
          <Cpu class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
          {{ loading ? '正在深度拆解系统模型...' : '一键 AI 拆解' }}
        </button>
      </div>
      <div class="mt-3 flex items-center gap-2 flex-wrap">
        <span class="text-[10px] text-zinc-500">推荐推荐样例:</span>
        <button
          v-for="s in DISSECT_SAMPLES"
          :key="s.url"
          class="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 hover:border-pink-500/50 text-[10px] text-zinc-400 hover:text-pink-400 cursor-pointer transition-all"
          @click="loadSample(s.url)"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <!-- 加载态 -->
    <div v-if="loading" class="p-10 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
      <Cpu class="w-8 h-8 text-pink-500 animate-spin-slow" />
      <p class="mt-4 text-xs font-bold text-zinc-200">正在调用爆款工厂 AI 拆解 Agent</p>
      <p class="mt-1.5 text-[11px] text-zinc-500 max-w-md">后台正利用 Gemini API 读取模拟页面，深度结构化提取标题层级、黄金前3秒文案逻辑和评论福利链路，请稍候...</p>
    </div>

    <!-- 错误态 -->
    <div v-else-if="error" class="p-10 rounded-xl bg-rose-950/10 border border-rose-900/40 text-center">
      <p class="text-sm font-bold text-rose-400">服务器或 API 配置错误</p>
      <p class="mt-1 text-[11px] text-rose-500/70">服务发生网络错误，请在系统设置中核对 API Key 是否就绪。</p>
    </div>

    <!-- 结果区 -->
    <div v-else-if="report" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- 原文预览 -->
      <div class="lg:col-span-5 rounded-xl bg-[#0c0c0e] border border-zinc-900 overflow-hidden">
        <div class="p-4 border-b border-zinc-900 flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-[10px]">RED</div>
          <div>
            <p class="text-xs font-bold text-zinc-200">爆款分析样本原文</p>
            <p class="text-[9px] text-zinc-600 font-mono">XIAOHONGSHU POST PREVIEW</p>
          </div>
        </div>
        <div class="p-5 space-y-3">
          <p class="text-sm font-bold text-orange-500">{{ report.title }}</p>
          <p class="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">{{ report.content }}</p>
          <div class="pt-3 border-t border-zinc-900 flex items-center justify-between">
            <span class="text-[10px] text-zinc-500 font-mono">监测字数: {{ report.content.length }} 字</span>
            <span class="text-[10px] text-emerald-400 font-mono font-bold">高点击权重</span>
          </div>
        </div>
      </div>

      <!-- 拆解报告 -->
      <div class="lg:col-span-7 rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Award class="w-4 h-4 text-orange-500" />
            爆款心智剖析报告 (AI Deep Dissection)
          </h4>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
              :class="saved ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-pink-500/50 hover:text-pink-400'"
              @click="handleSaveAsset"
            >
              <Bookmark class="w-3 h-3" :class="saved ? 'fill-current' : ''" />
              {{ saved ? '已存入内容资产库' : '存入资产库' }}
            </button>
            <button
              class="px-3 py-1.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:border-zinc-600"
              @click="handlePrintReport"
            >
              <Printer class="w-3 h-3" />
              导出 PDF 报告
            </button>
          </div>
        </div>

        <div class="mt-5 space-y-4">
          <div v-for="sec in ANALYSIS_SECTIONS" :key="sec.key" class="flex gap-3">
            <div class="w-1.5 h-full rounded-full shrink-0 mt-1" :class="sec.color"></div>
            <div>
              <p class="text-[11px] font-bold text-zinc-200">{{ sec.label }}</p>
              <p class="mt-1 text-[10px] text-zinc-500 leading-relaxed font-mono">{{ report.analysis[sec.key] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空态 -->
    <div v-else class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
      <Copy class="w-8 h-8 text-zinc-700" />
      <p class="mt-4 text-sm font-bold text-zinc-300">等待爆文链接</p>
      <p class="mt-1.5 text-[11px] text-zinc-500 max-w-md">粘贴小红书笔记链接或点击上方样例，AI 拆解 Agent 将立即返回六段式结构剖析。</p>
    </div>
  </div>
</template>
