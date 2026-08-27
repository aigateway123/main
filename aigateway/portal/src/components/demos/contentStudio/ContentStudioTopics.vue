<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { Lightbulb, Sliders, Bookmark, Copy, PenTool, CheckCircle2 } from 'lucide-vue-next'
import type { TopicIdea, StudioAssetType } from '@/data/contentStudioData'
import { PRESET_TOPICS } from '@/data/contentStudioData'

const emit = defineEmits<{
  (e: 'saveToAssets', title: string, content: string, category: string, type: StudioAssetType): void
  (e: 'selectTopicForGeneration', title: string, industry: string): void
}>()

const industry = ref('美妆护肤')
const keyword = ref('抗衰密集修护')
const targetAudience = ref('25+熬夜打工党')
const loading = ref(false)
const topics = ref<TopicIdea[]>([])
const copiedIndex = ref<number | null>(null)
const favorites = ref<Record<number, boolean>>({})
let timer: ReturnType<typeof setTimeout> | null = null
let copyTimer: ReturnType<typeof setTimeout> | null = null

const handleGenerate = () => {
  if (!industry.value || !keyword.value || !targetAudience.value || loading.value) return
  loading.value = true
  if (timer) clearTimeout(timer)
  // 模拟选题生成请求
  timer = setTimeout(() => {
    loading.value = false
    topics.value = PRESET_TOPICS
    favorites.value = {}
  }, 1400)
}

const handleCopy = (topic: TopicIdea, idx: number) => {
  const text = `【爆款选题】: ${topic.title}\n【切入角度】: ${topic.angle}\n【黄金开头句】: ${topic.hook}`
  navigator.clipboard.writeText(text)
  copiedIndex.value = idx
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copiedIndex.value = null), 2000)
}

const toggleFavorite = (topic: TopicIdea, idx: number) => {
  const isFav = favorites.value[idx]
  if (!isFav) {
    const body = `【选题角度】: ${topic.angle}\n【黄金痛点开头】: ${topic.hook}\n【爆款指数】: ${topic.explosiveIndex}%\n【竞争难度】: ${topic.competitionRate}%`
    emit('saveToAssets', topic.title, body, industry.value, 'topic')
  }
  favorites.value = { ...favorites.value, [idx]: !isFav }
}

const handleGeneratePost = (topic: TopicIdea) => {
  emit('selectTopicForGeneration', topic.title, industry.value)
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题区 -->
    <div>
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <Lightbulb class="w-5 h-5 text-pink-500" />
        AI 选题智造工厂
      </h2>
      <p class="text-xs text-zinc-400 mt-1">基于全网热点算法大盘，为您的特定受众一键快速挖掘 100+ 起号级爆款选题切入点与钩子开头。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- 左：参数表单 -->
      <div class="lg:col-span-1 rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-bold font-mono text-pink-500">01</span>
          <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Sliders class="w-3.5 h-3.5 text-pink-500" />
            爆款参数设定 (Target Settings)
          </h4>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">选择行业/大类</label>
          <input
            v-model="industry"
            type="text"
            id="topic-industry"
            placeholder="例如: 美妆护肤, 穿搭, 搞钱, 母婴..."
            class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">核心爆点关键词</label>
          <input
            v-model="keyword"
            type="text"
            id="topic-keyword"
            placeholder="例如: 精简护肤, 早C晚A, 大码显瘦..."
            class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">精准定位客群</label>
          <input
            v-model="targetAudience"
            type="text"
            id="topic-audience"
            placeholder="例如: 25岁熬夜打工白领, 考研党..."
            class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
          />
        </div>

        <button
          class="w-full py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white cursor-pointer transition-all disabled:opacity-60"
          :disabled="loading"
          @click="handleGenerate"
        >
          {{ loading ? '算法演练生成中...' : '开始批量生产选题' }}
        </button>

        <p v-if="loading" class="text-[10px] text-zinc-500 leading-relaxed font-mono">
          正在深度扫描 [{{ industry }}] 赛道下含有 [{{ keyword }}] 契合 [{{ targetAudience }}] 的流量池数据...
        </p>
      </div>

      <!-- 右：选题结果 -->
      <div class="lg:col-span-2 space-y-4">
        <!-- 成功横幅 -->
        <div v-if="topics.length" class="px-4 py-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
          <p class="text-xs font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4" />
            成功筛选到 5 组特等优质高转化选题切入点
          </p>
          <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800 font-mono">高推荐潜力</span>
        </div>

        <!-- 加载 -->
        <div v-if="loading" class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          <p class="mt-4 text-[11px] text-zinc-500">正在驱动爆款因子引擎算法...</p>
        </div>

        <!-- 空态 -->
        <div v-else-if="!topics.length" class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
          <Lightbulb class="w-8 h-8 text-zinc-700" />
          <p class="mt-4 text-sm font-bold text-zinc-300">尚未激活选题大纲</p>
          <p class="mt-1.5 text-[11px] text-zinc-500 max-w-sm">请在左侧侧边栏设置匹配您业务线的关键词及定位圈层，开始驱动爆款因子引擎算法。</p>
        </div>

        <!-- 选题卡片 -->
        <div v-else class="space-y-4">
          <div
            v-for="(topic, idx) in topics"
            :key="topic.title"
            class="rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 transition-all hover:border-zinc-700"
            :class="favorites[idx] ? 'border-pink-500/50' : ''"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="text-[13px] font-bold text-zinc-100 leading-snug">{{ topic.title }}</h4>
                <div class="mt-2 flex items-center gap-2 flex-wrap">
                  <span class="text-[9px] px-2 py-0.5 rounded-full bg-pink-950/30 text-pink-400 border border-pink-900/40 font-mono font-bold">爆款值: {{ topic.explosiveIndex }}%</span>
                  <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 font-mono font-bold">竞争: {{ topic.competitionRate }}%</span>
                  <span class="text-[9px] px-2 py-0.5 rounded-full bg-blue-950/30 text-blue-400 border border-blue-900/40 font-mono font-bold">转化星级: {{ topic.conversionPotential }}%</span>
                </div>
              </div>
              <button
                :class="favorites[idx] ? 'bg-pink-500 text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-pink-400'"
                class="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                @click="toggleFavorite(topic, idx)"
              >
                <Bookmark class="w-3 h-3" :class="favorites[idx] ? 'fill-current' : ''" />
                {{ favorites[idx] ? '已收藏' : '加入收藏' }}
              </button>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
                <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">切入核心痛点/叙事视角:</p>
                <p class="mt-1.5 text-[10px] text-zinc-400 leading-relaxed font-mono">{{ topic.angle }}</p>
              </div>
              <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
                <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">黄金前3秒文案示范:</p>
                <p class="mt-1.5 text-[11px] text-pink-400 italic leading-relaxed">"{{ topic.hook }}"</p>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-end gap-2">
              <button
                class="px-3 py-1.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:border-zinc-600"
                @click="handleCopy(topic, idx)"
              >
                <Copy class="w-3 h-3" />
                {{ copiedIndex === idx ? '复制成功!' : '复制选题' }}
              </button>
              <button
                class="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer transition-all"
                @click="handleGeneratePost(topic)"
              >
                <PenTool class="w-3 h-3" />
                一键生成推文
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
