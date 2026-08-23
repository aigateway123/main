<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import {
  BookOpen, Rocket, Terminal, HelpCircle, Wrench,
  ChevronDown, FileText, ChevronLeft, ChevronRight, ListTree, X, AlertCircle,
} from 'lucide-vue-next'
import docContent from '@/data/docs'
import type { DocSection, DocItem } from '@/types/docs'

const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const expandedSections = ref<string[]>(docContent.sections.map((s) => s.id))
const activeItemId = ref(docContent.defaultItemId)
const mobileTreeOpen = ref(false)
const contentEl = ref<HTMLElement | null>(null)
const tocItems = ref<{ id: string; text: string }[]>([])

const iconMap: Record<string, any> = {
  BookOpen, Rocket, Terminal, HelpCircle, Wrench,
}

const toggleSection = (id: string) => {
  const idx = expandedSections.value.indexOf(id)
  if (idx >= 0) {
    expandedSections.value.splice(idx, 1)
  } else {
    expandedSections.value.push(id)
  }
}

const selectItem = (item: DocItem) => {
  activeItemId.value = item.id
  history.replaceState(null, '', `#${item.id}`)
  mobileTreeOpen.value = false
  window.scrollTo({ top: 0 })
}

const activeItem = computed(() => {
  for (const section of docContent.sections) {
    const found = section.children.find((c) => c.id === activeItemId.value)
    if (found) return { section, item: found }
  }
  return null
})

// Flatten all items in order for prev/next navigation
const flatItems = computed(() => {
  const items: { section: DocSection; item: DocItem }[] = []
  for (const section of docContent.sections) {
    for (const child of section.children) {
      items.push({ section, item: child })
    }
  }
  return items
})

const currentIndex = computed(() => {
  return flatItems.value.findIndex((x) => x.item.id === activeItemId.value)
})

const prevItem = computed(() => {
  const i = currentIndex.value
  return i > 0 ? flatItems.value[i - 1] : null
})

const nextItem = computed(() => {
  const i = currentIndex.value
  return i >= 0 && i < flatItems.value.length - 1 ? flatItems.value[i + 1] : null
})

// Build in-page TOC from h2 headings of the rendered content
const buildToc = () => {
  tocItems.value = []
  const el = contentEl.value
  if (!el) return
  const heads = el.querySelectorAll('h2')
  heads.forEach((h, i) => {
    const id = `doc-h2-${i}`
    h.id = id
    const text = (h.textContent || '').trim()
    if (text) tocItems.value.push({ id, text })
  })
}

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

watch(activeItem, () => {
  nextTick(buildToc)
})

onMounted(() => {
  // Deep-link support: /docs#core-features
  const hash = window.location.hash.replace(/^#/, '')
  if (hash && !hash.startsWith('doc-h2-')) {
    const valid = docContent.sections.some((s) => s.children.some((c) => c.id === hash))
    if (valid) {
      activeItemId.value = hash
    }
  }
  nextTick(buildToc)
})
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <!-- Offset for fixed header -->
    <div class="pt-20" />

    <div class="flex">
      <!-- Left Sidebar: Doc Tree (desktop) -->
      <aside class="hidden lg:block w-[280px] shrink-0 border-r border-slate-200 bg-slate-50/50 sticky top-20 self-start h-[calc(100vh-80px)] overflow-y-auto">
        <div class="p-5">
          <div class="flex items-center gap-2 mb-6">
            <BookOpen class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-bold text-slate-900">文档目录</span>
          </div>

          <nav class="space-y-1">
            <div v-for="section in docContent.sections" :key="section.id">
              <!-- Section Header -->
              <button
                @click="toggleSection(section.id)"
                class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <component :is="iconMap[section.icon] || FileText" class="w-4 h-4 text-slate-500" />
                  <span>{{ section.title }}</span>
                </div>
                <ChevronDown
                  class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                  :class="expandedSections.includes(section.id) ? 'rotate-0' : '-rotate-90'"
                />
              </button>

              <!-- Children -->
              <div v-if="expandedSections.includes(section.id)" class="ml-2 mt-0.5 space-y-0.5 border-l border-slate-200">
                <button
                  v-for="child in section.children"
                  :key="child.id"
                  @click="selectItem(child)"
                  class="flex items-center gap-2 w-full pl-7 pr-3 py-2 text-xs rounded-r-lg transition-all text-left"
                  :class="[
                    activeItemId === child.id
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 -ml-px'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent -ml-px'
                  ]"
                >
                  <FileText class="w-3.5 h-3.5 shrink-0" :class="activeItemId === child.id ? 'text-blue-600' : 'text-slate-400'" />
                  <span class="truncate">{{ child.title }}</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <!-- Right Side: Content -->
      <main class="flex-1 min-h-[calc(100vh-80px)]">
        <div v-if="activeItem" class="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-10 flex gap-12">
          <div class="flex-1 min-w-0">
            <!-- Mobile: open tree drawer -->
            <button
              @click="mobileTreeOpen = true"
              class="lg:hidden mb-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ListTree class="w-4 h-4" />
              文档目录
            </button>

            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <span>文档中心</span>
              <span class="text-slate-300">/</span>
              <span class="text-slate-600 font-medium">{{ activeItem.section.title }}</span>
              <span class="text-slate-300">/</span>
              <span class="text-blue-600 font-medium">{{ activeItem.item.title }}</span>
            </div>

            <!-- Title -->
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
              {{ activeItem.item.title }}
            </h1>

            <!-- Content Area -->
            <div
              v-if="activeItem.item.content"
              ref="contentEl"
              class="prose prose-slate max-w-none"
              v-html="activeItem.item.content"
            />

            <!-- Empty Skeleton Placeholder -->
            <div v-else class="mt-8">
              <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
                <AlertCircle class="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p class="text-sm font-semibold text-slate-500 mb-1">内容待补充</p>
                <p class="text-xs text-slate-400">该文档页面正在撰写中，敬请期待。</p>
              </div>

              <!-- Simulated Content Skeleton -->
              <div class="mt-8 space-y-4 animate-pulse">
                <div class="h-4 bg-slate-200 rounded w-3/4" />
                <div class="h-4 bg-slate-200 rounded w-1/2" />
                <div class="h-4 bg-slate-200 rounded w-5/6" />
                <div class="h-4 bg-slate-200 rounded w-2/3" />
                <div class="h-20 bg-slate-200 rounded w-full mt-6" />
                <div class="h-4 bg-slate-200 rounded w-4/5" />
                <div class="h-4 bg-slate-200 rounded w-3/5" />
              </div>
            </div>

            <!-- Prev / Next Navigation -->
            <div v-if="prevItem || nextItem" class="mt-14 pt-8 border-t border-slate-200 flex items-stretch gap-4">
              <button
                v-if="prevItem"
                @click="selectItem(prevItem.item)"
                class="flex-1 text-left p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
              >
                <div class="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5">
                  <ChevronLeft class="w-3.5 h-3.5" />
                  <span>{{ prevItem.section.title }}</span>
                </div>
                <div class="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{{ prevItem.item.title }}</div>
              </button>
              <div v-else class="flex-1" />

              <button
                v-if="nextItem"
                @click="selectItem(nextItem.item)"
                class="flex-1 text-right p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
              >
                <div class="flex items-center justify-end gap-1 text-[11px] text-slate-400 mb-1.5">
                  <span>{{ nextItem.section.title }}</span>
                  <ChevronRight class="w-3.5 h-3.5" />
                </div>
                <div class="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{{ nextItem.item.title }}</div>
              </button>
              <div v-else class="flex-1" />
            </div>
          </div>

          <!-- Right TOC (desktop, xl+) -->
          <aside v-if="tocItems.length > 2" class="hidden xl:block w-52 shrink-0">
            <div class="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">本篇目录</p>
              <nav class="space-y-1 border-l border-slate-200">
                <button
                  v-for="toc in tocItems"
                  :key="toc.id"
                  @click="scrollToHeading(toc.id)"
                  class="block w-full text-left pl-4 -ml-px py-1 text-xs text-slate-500 border-l border-transparent hover:text-blue-600 hover:border-blue-500 transition-colors leading-relaxed"
                >
                  {{ toc.text }}
                </button>
              </nav>
            </div>
          </aside>
        </div>
      </main>
    </div>

    <!-- Mobile Doc Tree Drawer -->
    <div v-if="mobileTreeOpen" class="fixed inset-0 z-[60] lg:hidden">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="mobileTreeOpen = false" />
      <div class="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl overflow-y-auto p-5 animate-in slide-in-from-left duration-200">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <BookOpen class="w-4 h-4 text-blue-600" />
            <span class="text-sm font-bold text-slate-900">文档目录</span>
          </div>
          <button @click="mobileTreeOpen = false" class="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900">
            <X class="w-4 h-4" />
          </button>
        </div>

        <nav class="space-y-1">
          <div v-for="section in docContent.sections" :key="section.id">
            <button
              @click="toggleSection(section.id)"
              class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div class="flex items-center gap-2">
                <component :is="iconMap[section.icon] || FileText" class="w-4 h-4 text-slate-500" />
                <span>{{ section.title }}</span>
              </div>
              <ChevronDown
                class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                :class="expandedSections.includes(section.id) ? 'rotate-0' : '-rotate-90'"
              />
            </button>

            <div v-if="expandedSections.includes(section.id)" class="ml-2 mt-0.5 space-y-0.5 border-l border-slate-200">
              <button
                v-for="child in section.children"
                :key="child.id"
                @click="selectItem(child)"
                class="flex items-center gap-2 w-full pl-7 pr-3 py-2.5 text-xs rounded-r-lg transition-all text-left"
                :class="[
                  activeItemId === child.id
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 -ml-px'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent -ml-px'
                ]"
              >
                <FileText class="w-3.5 h-3.5 shrink-0" :class="activeItemId === child.id ? 'text-blue-600' : 'text-slate-400'" />
                <span class="truncate">{{ child.title }}</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <FooterSection />
    <ContactFloat />
  </div>
</template>

<style>
/* 文档内容行内代码 — 经典浅灰胶囊（v-html 注入内容不受 scoped 影响，故用非 scoped 样式） */
.prose :where(code):not(:where([class~="not-prose"] *, pre *)) {
  background-color: #f1f5f9;
  color: #0f172a;
  font-weight: 600;
  padding: 0.18em 0.5em;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 0.85em;
}
.prose :where(code):not(:where([class~="not-prose"] *, pre *))::before,
.prose :where(code):not(:where([class~="not-prose"] *, pre *))::after {
  content: none;
}

/* 文档表格：zebra 条纹 + 更紧凑 */
.prose table {
  font-size: 0.85em;
}
.prose thead th {
  background-color: #f8fafc;
}
.prose tbody tr:nth-child(even) {
  background-color: #f8fafc;
}
</style>
