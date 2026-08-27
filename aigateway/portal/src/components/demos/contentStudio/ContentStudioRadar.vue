<script setup lang="ts">
import { ref, computed } from 'vue'
import { Zap, Search, Calendar, Sparkles, Heart, Bookmark, MessageCircle, ExternalLink } from 'lucide-vue-next'
import type { StudioView, RadarPost } from '@/data/contentStudioData'
import { RADAR_POSTS } from '@/data/contentStudioData'

const emit = defineEmits<{ (e: 'navigate', view: StudioView): void; (e: 'analyzeUrl', url: string): void }>()

const activeTab = ref('hot')
const selectedTimeframe = ref('24h')
const searchQuery = ref('')
const activeNiche = ref('全部')
const selectedPost = ref<RadarPost | null>(null)

const TABS = [
  { id: 'hot', label: '爆击热点榜' },
  { id: 'viral', label: '起号爆文榜' },
  { id: 'keywords', label: '风口关键词榜' },
  { id: 'industries', label: '蓝海行业榜' },
]
const NICHES = ['全部', '减肥', '穿搭', '护肤', '母婴', 'AI', '美食', '情感']
const TIMEFRAMES = ['24小时', '7天', '30天']

const filtered = computed(() => {
  return RADAR_POSTS.filter((p) => {
    const okNiche = activeNiche.value === '全部' || p.category === activeNiche.value
    const q = searchQuery.value.trim().toLowerCase()
    const okSearch = !q || p.title.toLowerCase().includes(q) || p.category.includes(q)
    return okNiche && okSearch
  })
})

const fmtK = (n: number) => (n / 1000).toFixed(1) + 'k'
const coverEmoji = (cover: string) => cover.split(' ')[0]
const coverText = (cover: string) => cover.split(' ').slice(1).join(' ')

const handleDeepDissect = (post: RadarPost) => {
  selectedPost.value = null
  emit('analyzeUrl', post.url)
}

const openOriginal = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题 + 筛选 -->
    <div class="p-6 rounded-2xl bg-[#111] border border-zinc-900">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <Zap class="w-5 h-5 text-orange-500" />
            爆款雷达 Trending Radar
          </h2>
          <p class="text-xs text-zinc-400 mt-1">全网高流量节点智能探针，实时挖掘高点击、高互动的小红书爆文数据。</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-for="t in TIMEFRAMES"
            :key="t"
            :class="selectedTimeframe === t ? 'bg-orange-500 text-black' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'"
            class="px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
            @click="selectedTimeframe = t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <div class="mt-5 flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索爆文关键词，如: '减肥', '穿搭', '护肤', '母婴'..."
            class="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="n in NICHES"
            :key="n"
            :class="activeNiche === n ? 'bg-[#1a1a1a] text-orange-500 border-orange-500/30' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'"
            class="px-3 py-1.5 rounded-full text-[10px] font-semibold border cursor-pointer transition-all"
            @click="activeNiche = n"
          >
            {{ n }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="flex items-center gap-1 border-b border-[#1f1f1f]">
      <button
        v-for="t in TABS"
        :key="t.id"
        class="px-4 py-2.5 text-[11px] font-bold transition-all cursor-pointer"
        :class="activeTab === t.id ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'"
        @click="activeTab = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- 帖子卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="post in filtered"
        :key="post.id"
        class="rounded-xl bg-[#0c0c0e] border border-zinc-900 hover:border-zinc-700 overflow-hidden transition-all cursor-pointer group"
        @click="selectedPost = post"
      >
        <!-- cover -->
        <div class="h-44 bg-gradient-to-br from-[#151517] to-[#0a0a0c] relative flex flex-col items-center justify-center p-4 border-b border-zinc-900">
          <span class="absolute top-2.5 left-2.5 text-[8px] font-bold bg-[#111] text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-full">{{ post.category }}</span>
          <span class="text-4xl">{{ coverEmoji(post.cover) }}</span>
          <p class="mt-2 text-[10px] text-zinc-400 text-center leading-relaxed">{{ coverText(post.cover) }}</p>
          <div class="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[8px] text-zinc-600 font-mono">
            <Calendar class="w-3 h-3" /> {{ post.date }} · 双列流推荐位
          </div>
        </div>
        <!-- body -->
        <div class="p-3.5 space-y-3">
          <p class="text-[11px] font-semibold text-zinc-200 leading-relaxed line-clamp-2 group-hover:text-orange-400 transition-colors">{{ post.title }}</p>
          <div class="flex items-center gap-3 text-[10px] font-mono">
            <span class="flex items-center gap-1 text-orange-500 font-bold"><Heart class="w-3 h-3" /> {{ fmtK(post.likes) }}</span>
            <span class="flex items-center gap-1 text-amber-500 font-bold"><Bookmark class="w-3 h-3" /> {{ fmtK(post.collects) }}</span>
            <span class="flex items-center gap-1 text-blue-500 font-bold"><MessageCircle class="w-3 h-3" /> {{ post.comments }}</span>
            <Sparkles class="w-3 h-3 text-zinc-700 ml-auto" />
          </div>
        </div>
      </div>
    </div>

    <!-- 详情 Modal -->
    <Teleport to="body">
      <div
        v-if="selectedPost"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="selectedPost = null"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 animate-fade-in">
          <span class="inline-block text-[9px] font-bold text-orange-500 border border-orange-500/40 px-2 py-1 rounded-full uppercase tracking-wider">爆款雷达监测 · 起号风口</span>
          <h3 class="mt-3 text-lg font-bold text-white leading-snug">{{ selectedPost.title }}</h3>

          <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="rounded-xl bg-[#111] border border-zinc-900 p-4 flex flex-col items-center justify-center text-center">
              <span class="text-5xl">{{ coverEmoji(selectedPost.cover) }}</span>
              <p class="mt-3 text-[11px] text-zinc-400">{{ coverText(selectedPost.cover) }}</p>
              <p class="mt-2 text-[9px] text-zinc-600 font-mono">ID: {{ selectedPost.id }}</p>
            </div>
            <div class="space-y-3">
              <p class="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Core Metrics 核心数据监测</p>
              <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3 flex items-center justify-between">
                <span class="text-[11px] text-zinc-400">获赞量 (Likes)</span>
                <span class="text-sm font-extrabold text-white font-mono">{{ selectedPost.likes.toLocaleString() }}</span>
              </div>
              <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3 flex items-center justify-between">
                <span class="text-[11px] text-zinc-400">收藏量 (Collects)</span>
                <span class="text-sm font-extrabold text-white font-mono">{{ selectedPost.collects.toLocaleString() }}</span>
              </div>
              <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3 flex items-center justify-between">
                <span class="text-[11px] text-zinc-400">算法推荐权重</span>
                <span class="text-[11px] font-bold text-emerald-400">极优 98.4%</span>
              </div>
              <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3 flex items-center justify-between">
                <span class="text-[11px] text-zinc-400">转评收藏系数</span>
                <span class="text-[11px] font-bold text-emerald-400">1.2x (超标)</span>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              @click="openOriginal(selectedPost.url)"
            >
              <ExternalLink class="w-3.5 h-3.5" /> 访问小红书原文
            </button>
            <button
              class="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-[11px] font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              @click="handleDeepDissect(selectedPost)"
            >
              <Sparkles class="w-3.5 h-3.5" /> 深度一键 AI 拆解
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
