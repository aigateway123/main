<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { PenTool, Sliders, Save, Copy, BookOpen, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import type { GeneratedContent, StudioAssetType } from '@/data/contentStudioData'
import { PRESET_CONTENT, REFERENCE_POSTS } from '@/data/contentStudioData'

const props = defineProps<{ initialTitle?: string; initialIndustry?: string }>()
const emit = defineEmits<{ (e: 'saveToAssets', title: string, content: string, category: string, type: StudioAssetType): void }>()

const CONTENT_TABS = [
  { id: 'copy', label: '爆图文文案' },
  { id: 'script', label: '视频脚本分镜' },
  { id: 'cover', label: '封面文案设计' },
  { id: 'comments', label: '高热回复话术' },
]

const contentType = ref('copy')
const industry = ref(props.initialIndustry || '时尚美妆')
const product = ref(props.initialTitle || '爆汁玻尿酸口红，涂上极度显白提气色')
const style = ref('专业测评、闺蜜倾诉')
const length = ref(400)
const loading = ref(false)
const content = ref<GeneratedContent | null>(null)
const refineQuery = ref('')
const refining = ref(false)
const isReferenceOpen = ref(true)
const copiedText = ref(false)
const copiedTitleIdx = ref<number | null>(null)
const draftSaved = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let copyTimer: ReturnType<typeof setTimeout> | null = null

// 选题工厂 → 生成中心联动
watch(
  () => props.initialTitle,
  (val) => {
    if (val) product.value = val
  }
)
watch(
  () => props.initialIndustry,
  (val) => {
    if (val) industry.value = val
  }
)

const midCol = computed(() => (isReferenceOpen.value ? 'lg:col-span-6' : 'lg:col-span-9'))

const handleCreateContent = () => {
  if (loading.value || refining.value) return
  loading.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    loading.value = false
    content.value = { ...PRESET_CONTENT }
    draftSaved.value = false
  }, 1400)
}

const switchTab = (tab: string) => {
  contentType.value = tab
  content.value = null
}

const handleRefineContent = () => {
  if (!refineQuery.value.trim() || refining.value) return
  refining.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    refining.value = false
    content.value = {
      ...PRESET_CONTENT,
      bodyText: `【已按您的迭代指令优化】「${refineQuery.value}」\n\n${PRESET_CONTENT.bodyText}`,
    }
    refineQuery.value = ''
    draftSaved.value = false
  }, 1400)
}

const handleCopyBody = () => {
  if (!content.value) return
  const text = `${content.value.titleOptions[0]}\n\n${content.value.bodyText}\n\n${content.value.tags.join(' ')}`
  navigator.clipboard.writeText(text)
  copiedText.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copiedText.value = false), 2000)
}

const handleCopyTitle = (text: string, idx: number) => {
  navigator.clipboard.writeText(text)
  copiedTitleIdx.value = idx
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copiedTitleIdx.value = null), 2000)
}

const handleSaveDraft = () => {
  if (!content.value) return
  emit('saveToAssets', content.value.titleOptions[0] || product.value, content.value.bodyText, industry.value, contentType.value as StudioAssetType)
  draftSaved.value = true
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题 + Tab -->
    <div>
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <PenTool class="w-5 h-5 text-pink-500" />
        AI 内容生成控制台
      </h2>
      <p class="text-xs text-zinc-400 mt-1">内置小红书高流量爆款文体微调模型，支持一键将选题延展为高转化图文、镜头脚本、高拉粉评论和优质封面文案。</p>
    </div>

    <div class="flex items-center gap-2 border-b border-[#1f1f1f]">
      <button
        v-for="t in CONTENT_TABS"
        :key="t.id"
        class="px-4 py-2.5 text-[11px] font-bold transition-all cursor-pointer rounded-t-lg"
        :class="contentType === t.id ? 'bg-pink-500 text-white' : 'text-zinc-500 hover:text-zinc-300'"
        @click="switchTab(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
      <!-- 左：参数面板 -->
      <div class="lg:col-span-3 rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 space-y-4 self-start">
        <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <Sliders class="w-3.5 h-3.5 text-pink-500" />
          文图多维微调参数
        </h4>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">首选赛道分类</label>
          <input v-model="industry" type="text" id="gen-industry" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">选题或核心诉求 (可精简填空)</label>
          <textarea v-model="product" id="gen-product" rows="3" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50 resize-none"></textarea>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">创作语言与笔触基调</label>
          <input v-model="style" type="text" id="gen-style" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">预估文案总体字数 ({{ length }} 字)</label>
          <input v-model.number="length" type="range" min="100" max="1500" step="50" class="w-full accent-pink-500" />
        </div>
        <button
          class="w-full py-2.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white cursor-pointer transition-all disabled:opacity-60"
          :disabled="loading || refining"
          @click="handleCreateContent"
        >
          {{ loading ? '正在部署模型算力生成中...' : '一键部署生成内容' }}
        </button>
        <p v-if="loading" class="text-[10px] text-zinc-500 leading-relaxed font-mono">
          AI 创写 Agent 正尝试提取 [{{ style }}] 情感基调及 {{ length }} 字规格进行整篇智能起大纲，建立吸引高互动的配画指示...
        </p>
      </div>

      <!-- 中：结果区 -->
      <div :class="['transition-all duration-300', midCol]">
        <div v-if="loading || refining" class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
          <div class="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          <p class="mt-4 text-[11px] text-zinc-500">{{ refining ? '正在按指令局部迭代润色...' : '正在部署模型算力生成中...' }}</p>
        </div>

        <div v-else-if="content" class="rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 space-y-5">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-zinc-200">AI 自动撰写成果推荐</h4>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                :class="draftSaved ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40' : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-zinc-600'"
                @click="handleSaveDraft"
              >
                <Save class="w-3 h-3" />
                {{ draftSaved ? '已保存作为草稿' : '保存草稿' }}
              </button>
              <button
                class="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer transition-all"
                @click="handleCopyBody"
              >
                <Copy class="w-3 h-3" />
                {{ copiedText ? '正文已完整复制' : '复制全部(含标签)' }}
              </button>
            </div>
          </div>

          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">推荐高效吸睛标题选项:</p>
            <div class="space-y-2">
              <div v-for="(t, i) in content.titleOptions" :key="t" class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-900">
                <span class="text-[11px] text-zinc-300">{{ t }}</span>
                <button class="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-400 cursor-pointer transition-all shrink-0" @click="handleCopyTitle(t, i)">
                  {{ copiedTitleIdx === i ? '已复制' : '复制' }}
                </button>
              </div>
            </div>
          </div>

          <div>
            <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">正文推文文案 (支持 Markdown 与小红书双排版):</p>
            <div class="max-h-96 overflow-y-auto rounded-lg bg-zinc-950 border border-zinc-900 p-4">
              <p class="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">{{ content.bodyText }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <span v-for="tag in content.tags" :key="tag" class="text-[10px] px-2.5 py-1 rounded-full bg-pink-950/30 text-pink-400 border border-pink-900/40 font-mono">{{ tag }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
              <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">视觉封面 Overlay 文字排版建议:</p>
              <p class="mt-1.5 text-[10px] text-zinc-400 leading-relaxed">{{ content.coverText }}</p>
            </div>
            <div class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
              <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">AI 场景画面摄影指示:</p>
              <div class="mt-1.5 space-y-1">
                <p v-for="(img, i) in content.suggestedImages" :key="img" class="text-[10px] text-zinc-400 font-mono">{{ i + 1 }}. {{ img }}</p>
              </div>
            </div>
          </div>

          <!-- 迭代区 -->
          <div class="rounded-lg bg-zinc-950/40 border border-zinc-900 p-4">
            <p class="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5">
              <RefreshCw class="w-3 h-3 text-pink-500" />
              对内容不满意？输入指令让 AI 局部迭代或改润
            </p>
            <div class="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                v-model="refineQuery"
                type="text"
                placeholder="例如: '让语气更傲娇一点', '开头加上一个明显的痛点悬念', '缩短正文到300字'..."
                class="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
                @keyup.enter="handleRefineContent"
              />
              <button class="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-[10px] font-bold text-white cursor-pointer transition-all disabled:opacity-60" :disabled="refining" @click="handleRefineContent">
                优化迭代
              </button>
            </div>
          </div>
        </div>

        <div v-else class="p-12 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
          <PenTool class="w-8 h-8 text-zinc-700" />
          <p class="mt-4 text-sm font-bold text-zinc-300">创作工位空置中</p>
          <p class="mt-1.5 text-[11px] text-zinc-500 max-w-md">调整左侧特定题材与口吻大纲后，点击【一键部署生成内容】按钮，AI 将迅速回传符合高概率点击结构的内容包。</p>
        </div>
      </div>

      <!-- 右：参考抽屉 -->
      <div v-if="isReferenceOpen" class="lg:col-span-3 rounded-xl bg-[#0c0c0e] border border-zinc-900 p-5 self-start">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <BookOpen class="w-3.5 h-3.5 text-pink-500" />
            爆文对标参考馆
          </h4>
          <button class="text-zinc-600 hover:text-zinc-300 cursor-pointer" @click="isReferenceOpen = false">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div class="mt-4 space-y-4">
          <div v-for="r in REFERENCE_POSTS" :key="r.badge" class="rounded-lg bg-zinc-950 border border-zinc-900 p-3">
            <span class="text-[8px] font-bold text-pink-500 bg-pink-950/30 border border-pink-900/40 px-1.5 py-0.5 rounded uppercase">{{ r.badge }}</span>
            <p class="mt-2 text-[11px] font-bold text-zinc-200 leading-snug">{{ r.title }}</p>
            <p class="mt-1.5 text-[10px] text-zinc-500 leading-relaxed">{{ r.summary }}</p>
          </div>
        </div>
      </div>

      <!-- 抽屉收起时的浮动按钮 -->
      <button
        v-if="!isReferenceOpen"
        class="absolute -right-2 top-40 z-10 w-8 h-8 rounded-full bg-[#0c0c0e] border border-zinc-800 text-zinc-400 hover:text-pink-400 flex items-center justify-center cursor-pointer shadow-xl"
        @click="isReferenceOpen = true"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
