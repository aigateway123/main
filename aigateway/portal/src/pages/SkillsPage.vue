<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import TeamCard from '@/components/TeamCard.vue'
import { skills, skillCategories } from '@/data/skills'
import { expertTeams, teamIndustries } from '@/data/expertTeams'
import { skillIconMap, skillCommonIcons } from '@/utils/skillIcons'
import type { ExpertTeam } from '@/types'

const route = useRoute()
const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

type TabType = 'all' | 'skill' | 'team'
const activeTab = ref<TabType>('all')
const activeCategory = ref('all')
const keyword = ref('')

/** 支持 /teams → /skills?tab=team 等外部跳转定位 */
watch(
  () => route.query.tab,
  (v) => {
    if (v === 'team') activeTab.value = 'team'
    else if (v === 'skill') activeTab.value = 'skill'
    else if (v === 'all') activeTab.value = 'all'
  },
  { immediate: true },
)

const typeTabs: { value: TabType; name: string }[] = [
  { value: 'all', name: '全部' },
  { value: 'skill', name: '技能·专家' },
  { value: 'team', name: '专家团' },
]

/** 场景 Tab 随类型联动：技能分类 vs 团队场景 */
const sceneTabs = computed(() => {
  if (activeTab.value === 'team') return teamIndustries
  return skillCategories
})

/** 场景 Tab 切换时重置选中 */
const switchTab = (tab: TabType) => {
  activeTab.value = tab
  activeCategory.value = 'all'
}

interface CardItem {
  type: 'skill' | 'team'
  skill?: (typeof skills)[number]
  team?: ExpertTeam
}

/** 混合卡片（技能 + 专家团）按类型与场景过滤 */
const filteredCards = computed<CardItem[]>(() => {
  const kw = keyword.value.trim().toLowerCase()
  const matchKw = (text: string) => !kw || text.toLowerCase().includes(kw)
  const cards: CardItem[] = []

  if (activeTab.value === 'all' || activeTab.value === 'skill') {
    for (const s of skills) {
      const matchCategory = activeCategory.value === 'all' || s.category === activeCategory.value
      if (matchCategory && matchKw(`${s.name} ${s.tagline} ${s.description}`)) {
        cards.push({ type: 'skill', skill: s })
      }
    }
  }

  if (activeTab.value === 'all' || activeTab.value === 'team') {
    for (const t of expertTeams) {
      const matchCategory = activeCategory.value === 'all' || t.industry === activeCategory.value
      if (matchCategory && matchKw(`${t.name} ${t.tagline} ${t.description}`)) {
        cards.push({ type: 'team', team: t })
      }
    }
  }

  return cards
})

const cardKey = (c: CardItem) => `${c.type}:${c.skill?.slug ?? c.team?.slug}`

/* ---------- 分页 ---------- */
const pageSize = 8
const currentPage = ref(1)
const gridRef = ref<HTMLElement | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCards.value.length / pageSize)))

const pagedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})

/** 切换类型 / 场景 / 关键词时回到第一页 */
watch([activeTab, activeCategory, keyword], () => {
  currentPage.value = 1
})

/** 过滤结果变少时，页码越界自动回退 */
watch(totalPages, (tp) => {
  if (currentPage.value > tp) currentPage.value = tp
})

const goPage = (p: number) => {
  if (p < 1 || p > totalPages.value || p === currentPage.value) return
  currentPage.value = p
  gridRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <!-- Page header offset -->
    <div class="pt-20" />

    <main>
      <!-- Header（紧凑） -->
      <section class="relative py-10 overflow-hidden bg-white border-b border-slate-200/80">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[280px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="flex items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold uppercase tracking-wider">
                <component :is="skillCommonIcons.Sparkles" class="w-3 h-3 text-blue-600" />
                Skill · 专家 · 专家团
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                不用招人，也能组建一支 <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI 团队</span>
              </h1>
              <p class="text-slate-600 text-sm leading-relaxed">
                AI 专家即买即用，专家团跨岗协同，把活干完、干好。
              </p>
            </div>

            <!-- Search -->
            <div class="relative w-56 sm:w-72 shrink-0 hidden sm:block">
              <component :is="skillCommonIcons.Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="keyword"
                type="text"
                placeholder="搜索专家或专家团…"
                class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <!-- 类型 Tab -->
          <div class="flex items-center gap-1 mt-5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 w-fit">
            <button
              v-for="t in typeTabs"
              :key="t.value"
              @click="switchTab(t.value)"
              :class="[
                'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeTab === t.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              {{ t.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- Marketplace -->
      <section class="py-8 bg-slate-50/60 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- 移动端搜索 -->
          <div class="relative sm:hidden mb-5">
            <component :is="skillCommonIcons.Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索专家或专家团…"
              class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>

          <!-- 场景 Tab -->
          <div class="flex flex-wrap items-center gap-1.5 mb-5">
            <button
              v-for="cat in sceneTabs"
              :key="cat.value"
              @click="activeCategory = cat.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                activeCategory === cat.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm shadow-blue-600/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- 卡片网格（技能 + 专家团混排，紧凑 4 列） -->
          <div ref="gridRef" v-if="pagedCards.length" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            <template v-for="c in pagedCards" :key="cardKey(c)">
              <TeamCard v-if="c.type === 'team'" :team="c.team!" />
              <router-link
                v-else
                :to="`/skills/${c.skill!.slug}`"
              class="group relative flex flex-col p-4 rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 overflow-hidden"
            >
              <!-- Header -->
              <div class="flex items-start justify-between gap-2 mb-3">
                <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
                  <component :is="skillIconMap[c.skill!.icon] || skillCommonIcons.Zap" class="w-4 h-4" />
                </div>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {{ c.skill!.badge }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">{{ c.skill!.name }}</h3>
              <p class="text-[11px] font-semibold text-blue-600 mt-0.5">{{ c.skill!.tagline }}</p>

              <!-- Description -->
              <p class="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">{{ c.skill!.description }}</p>

              <!-- Highlights -->
              <div class="flex flex-wrap gap-1 mt-2.5">
                <span
                  v-for="h in c.skill!.highlights.slice(0, 2)"
                  :key="h"
                  class="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100"
                >
                  <component :is="skillCommonIcons.CheckCircle2" class="w-2.5 h-2.5 text-emerald-500" />
                  {{ h }}
                </span>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-end mt-3.5 pt-3 border-t border-slate-100">
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:gap-1.5 transition-all">
                  使用
                  <component :is="skillCommonIcons.ArrowRight" class="w-3 h-3" />
                </span>
              </div>
            </router-link>
            </template>
          </div>

          <!-- Empty state -->
          <div v-else class="py-16 text-center">
            <p class="text-slate-400 text-sm">没有找到匹配的内容，换个关键词试试。</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredCards.length" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-xs text-slate-400">共 {{ filteredCards.length }} 个能力</p>
            <div v-if="totalPages > 1" class="flex items-center gap-1">
              <button
                @click="goPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="currentPage <= 1 ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'"
              >
                上一页
              </button>
              <button
                v-for="p in totalPages"
                :key="p"
                @click="goPage(p)"
                :class="[
                  'w-8 h-8 rounded-lg text-xs font-bold transition-all',
                  p === currentPage
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                ]"
              >
                {{ p }}
              </button>
              <button
                @click="goPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="currentPage >= totalPages ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'"
              >
                下一页
              </button>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 sm:p-6 text-white relative overflow-hidden shadow-lg shadow-blue-600/15">
            <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-base font-extrabold tracking-tight">标准能力不够用？</h3>
                <p class="text-blue-100 text-xs leading-relaxed max-w-xl">
                  我们可以把专家或专家团升级为「AI 员工」，接入您的企业资料与知识库，专属定制。
                </p>
              </div>
              <button
                @click="handleOpenConsole"
                class="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs shadow-lg hover:shadow-xl transition-all"
              >
                <component :is="skillCommonIcons.Terminal" class="w-3.5 h-3.5" />
                联系企业顾问
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <FooterSection />
    <ContactFloat />
  </div>
</template>
