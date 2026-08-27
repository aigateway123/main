<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { FolderHeart, Plus, Search, Copy, Trash2, BookOpen } from 'lucide-vue-next'
import type { StudioAsset, StudioAssetType } from '@/data/contentStudioData'

const props = defineProps<{ assets: StudioAsset[] }>()
const emit = defineEmits<{ (e: 'remove', id: string): void; (e: 'add', asset: Omit<StudioAsset, 'id' | 'createdAt'>): void }>()

const activeCategory = ref('all')
const searchQuery = ref('')
const selectedAsset = ref<StudioAsset | null>(null)
const showAddForm = ref(false)
const newTitle = ref('')
const newType = ref<StudioAssetType>('copy')
const newCategory = ref('穿搭')
const newContent = ref('')
const copiedId = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const CATEGORY_TABS = [
  { id: 'all', label: '全部资产' },
  { id: 'copy', label: '爆款图文' },
  { id: 'topic', label: '主题干货' },
  { id: 'script', label: '镜头脚本' },
  { id: 'preset', label: '诊断及预设' },
]

const TYPE_LABEL: Record<string, string> = { copy: '爆款图文', topic: '干货选题', script: '视频脚本', image: '图片素材', preset: '诊断预设' }

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return props.assets.filter((a) => {
    const okCat = activeCategory.value === 'all' || a.type === activeCategory.value
    const okSearch = !q || a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    return okCat && okSearch
  })
})

const handleCreateAssetSubmit = () => {
  if (!newTitle.value || !newContent.value) return
  emit('add', {
    title: newTitle.value,
    type: newType.value,
    category: newCategory.value,
    tags: ['#自定义', `#${newCategory.value}`],
    content: newContent.value,
  })
  newTitle.value = ''
  newContent.value = ''
  showAddForm.value = false
}

const handleCopy = (text: string, id: string) => {
  navigator.clipboard.writeText(text)
  copiedId.value = id
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copiedId.value = null), 2000)
}

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题区 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <FolderHeart class="w-5 h-5 text-pink-500" />
          内容资产管理库 (SaaS Vault)
        </h2>
        <p class="text-xs text-zinc-400 mt-1">存储您从爆文雷达、拆解中心、AI选题智造中心生成的每一份高含金量创意。一站式打通标签查找、共享与复制。</p>
      </div>
      <button
        class="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        @click="showAddForm = true"
      >
        <Plus class="w-3.5 h-3.5" />
        手动收录资产
      </button>
    </div>

    <!-- 筛选条 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="t in CATEGORY_TABS"
          :key="t.id"
          class="px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border"
          :class="activeCategory === t.id ? 'bg-zinc-900 text-pink-400 border-zinc-800' : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300'"
          @click="activeCategory = t.id"
        >
          {{ t.label }}
        </button>
      </div>
      <div class="relative sm:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索资产、行业或特定标签内容..."
          class="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
        />
      </div>
    </div>

    <!-- 资产卡片网格 -->
    <div v-if="filtered.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="asset in filtered" :key="asset.id" class="rounded-xl bg-[#0c0c0e] border border-zinc-900 overflow-hidden hover:border-zinc-700 transition-all h-64 flex flex-col">
        <div class="px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
          <span class="text-[9px] text-zinc-500 font-mono">{{ asset.category }}</span>
          <span class="text-[9px] text-zinc-600 font-mono">{{ asset.createdAt }}</span>
        </div>
        <div class="flex-1 p-4 cursor-pointer overflow-hidden" @click="selectedAsset = asset">
          <h4 class="text-[12px] font-bold text-zinc-200 leading-snug hover:text-pink-400 transition-colors line-clamp-2">{{ asset.title }}</h4>
          <p class="mt-2 text-[10px] text-zinc-500 font-mono leading-relaxed line-clamp-5">{{ asset.content }}</p>
        </div>
        <div class="px-4 py-2.5 border-t border-zinc-900 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 overflow-hidden">
            <span v-for="tag in asset.tags.slice(0, 2)" :key="tag" class="text-[8px] px-1.5 py-0.5 rounded bg-pink-950/30 text-pink-400 border border-pink-900/40 font-mono truncate">{{ tag }}</span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button class="p-1.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-pink-400 cursor-pointer transition-all" :title="'一键复制到剪贴板'" @click="handleCopy(asset.content, asset.id)">
              <Copy class="w-3.5 h-3.5" />
            </button>
            <button class="p-1.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-rose-400 cursor-pointer transition-all" :title="'彻底舍弃该资产'" @click="emit('remove', asset.id)">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空态 -->
    <div v-else class="p-14 rounded-xl bg-[#0c0c0e] border border-zinc-900 flex flex-col items-center text-center">
      <BookOpen class="w-8 h-8 text-zinc-700" />
      <p class="mt-4 text-sm font-bold text-zinc-300">资产空空如也</p>
      <p class="mt-1.5 text-[11px] text-zinc-500 max-w-md">目前未筛查到匹配项。可以在雷达、拆解或写内容区域点击「存入资产库」，将其保存。</p>
    </div>

    <!-- 手动收录 Modal -->
    <Teleport to="body">
      <div v-if="showAddForm" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="showAddForm = false">
        <div class="w-full max-w-lg rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 space-y-4 animate-fade-in">
          <div>
            <h3 class="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Plus class="w-4 h-4 text-pink-500" />
              手动载入数字资产
            </h3>
            <p class="text-[10px] text-zinc-500 mt-1">归纳管理在小红书发过的爆文或日常爆款记录</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">素材/文档主标题</label>
            <input v-model="newTitle" type="text" placeholder="例如: 时尚国潮新中式大纲..." class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">主要类别归属</label>
              <select v-model="newType" class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-pink-500/50">
                <option value="copy">图文文案</option>
                <option value="topic">选题主轴</option>
                <option value="script">脚本视频</option>
                <option value="preset">诊断预设</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">业务线名称</label>
              <input v-model="newCategory" type="text" placeholder="如: 美食, 护肤..." class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">正文/记录大纲内容</label>
            <textarea v-model="newContent" rows="5" placeholder="在此写入完整的文案、脚本台词、大纲或标签..." class="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50 resize-none"></textarea>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button class="px-4 py-2 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 text-[11px] font-bold cursor-pointer transition-all hover:border-zinc-600" @click="showAddForm = false">取消</button>
            <button class="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white cursor-pointer transition-all" @click="handleCreateAssetSubmit">收录归档</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 详情 Modal -->
    <Teleport to="body">
      <div v-if="selectedAsset" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click.self="selectedAsset = null">
        <div class="w-full max-w-2xl rounded-2xl bg-[#0c0c0e] border border-zinc-800 p-6 space-y-4 animate-fade-in">
          <div class="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
            <span class="text-[8px] px-2 py-0.5 rounded bg-pink-950/30 text-pink-400 border border-pink-900/40 font-bold">{{ TYPE_LABEL[selectedAsset.type] || '视频脚本' }}</span>
            <span>归属赛道: {{ selectedAsset.category }}</span>
            <span>•</span>
            <span>存入于: {{ selectedAsset.createdAt }}</span>
          </div>
          <h3 class="text-base font-bold text-zinc-100 leading-snug">{{ selectedAsset.title }}</h3>
          <div class="max-h-96 overflow-y-auto rounded-lg bg-zinc-950 border border-zinc-900 p-4">
            <p class="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">{{ selectedAsset.content }}</p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-zinc-600 font-mono">共计 {{ selectedAsset.content.length }} 字符</span>
            <button class="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-[11px] font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all" @click="handleCopy(selectedAsset.content, 'detail')">
              <Copy class="w-3.5 h-3.5" />
              {{ copiedId === 'detail' ? '已完美复制' : '复制全部' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
