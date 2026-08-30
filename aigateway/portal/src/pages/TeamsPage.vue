<script setup lang="ts">
import { ref, computed } from 'vue'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import TeamCard from '@/components/TeamCard.vue'
import { expertTeams, teamIndustries } from '@/data/expertTeams'
import { teamCommonIcons } from '@/utils/teamIcons'

const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const activeIndustry = ref<string>('all')
const keyword = ref('')

const filteredTeams = computed(() => {
  return expertTeams.filter((t) => {
    const matchIndustry = activeIndustry.value === 'all' || t.industry === activeIndustry.value
    const kw = keyword.value.trim().toLowerCase()
    const matchKeyword =
      !kw || t.name.toLowerCase().includes(kw) || t.tagline.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw)
    return matchIndustry && matchKeyword
  })
})
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
                <component :is="teamCommonIcons.Sparkles" class="w-3 h-3 text-blue-600" />
                专家团 · AI Expert Team
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                一支 <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI 团队</span>，协作完成一件事
              </h1>
              <p class="text-slate-600 text-sm leading-relaxed">
                多个专家分工接力，从任务到交付一站式完成。
              </p>
            </div>

            <!-- Search -->
            <div class="relative w-56 sm:w-72 shrink-0 hidden sm:block">
              <component :is="teamCommonIcons.Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="keyword"
                type="text"
                placeholder="搜索专家团…"
                class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <!-- Industry tabs -->
          <div class="flex flex-wrap items-center gap-1.5 mt-5">
            <button
              v-for="cat in teamIndustries"
              :key="cat.value"
              @click="activeIndustry = cat.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                activeIndustry === cat.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm shadow-blue-600/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- Teams -->
      <section class="py-8 bg-slate-50/60 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- 移动端搜索 -->
          <div class="relative sm:hidden mb-5">
            <component :is="teamCommonIcons.Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索专家团…"
              class="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>

          <!-- Team grid（紧凑 4 列卡片） -->
          <div v-if="filteredTeams.length" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            <TeamCard v-for="t in filteredTeams" :key="t.slug" :team="t" />
          </div>

          <!-- Empty state -->
          <div v-else class="py-16 text-center">
            <p class="text-slate-400 text-sm">没有找到匹配的专家团，换个关键词试试。</p>
          </div>

          <!-- CTA -->
          <div class="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 sm:p-6 text-white relative overflow-hidden shadow-lg shadow-blue-600/15">
            <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-base font-extrabold tracking-tight">标准团队不够用？</h3>
                <p class="text-blue-100 text-xs leading-relaxed max-w-xl">
                  我们可以把专家团升级为「AI 员工」，接入您的企业资料与知识库，专属定制。
                </p>
              </div>
              <button
                @click="handleOpenConsole"
                class="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs shadow-lg hover:shadow-xl transition-all"
              >
                <component :is="teamCommonIcons.Terminal" class="w-3.5 h-3.5" />
                咨询企业定制
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
