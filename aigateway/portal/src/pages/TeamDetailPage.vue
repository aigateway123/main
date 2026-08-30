<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import { getTeamBySlug } from '@/data/expertTeams'
import { skills } from '@/data/skills'
import { teamIconMap, teamCommonIcons } from '@/utils/teamIcons'
import { skillIconMap } from '@/utils/skillIcons'
import MarkdownOutput from '@/components/MarkdownOutput.vue'
import { ChevronDown, Check, Users, GitBranch, Play, Download } from 'lucide-vue-next'
import type { TeamFlowNode } from '@/types'

const route = useRoute()
const router = useRouter()
const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const slug = computed(() => String(route.params.slug || ''))
const team = computed(() => getTeamBySlug(slug.value))

const skillOf = (skillSlug: string) => skills.find((s) => s.slug === skillSlug)

/** 将 flow 中连续的 parallel 节点合并为一行 */
const flowRows = computed<TeamFlowNode[][]>(() => {
  if (!team.value) return []
  const rows: TeamFlowNode[][] = []
  for (const node of team.value.flow) {
    const last = rows[rows.length - 1]
    if (node.mode === 'parallel' && last && last.length > 0 && last[0].mode === 'parallel' && last.length < 2) {
      last.push(node)
    } else {
      rows.push([node])
    }
  }
  return rows
})

const selectedPlan = ref<string | null>(null)
const purchaseModalOpen = ref(false)
const openFaq = ref<string | null>(null)
const toastVisible = ref(false)
const toastText = ref('')

const selectPlan = (id: string) => {
  selectedPlan.value = id
}

const openPurchase = (planId?: string) => {
  if (planId) selectedPlan.value = planId
  else if (!selectedPlan.value && team.value) selectedPlan.value = team.value.plans.find((p) => p.isPopular)?.id || team.value.plans[0].id
  purchaseModalOpen.value = true
}

const confirmPurchase = () => {
  const plan = team.value?.plans.find((p) => p.id === selectedPlan.value)
  purchaseModalOpen.value = false
  toastText.value = `已提交订单：${team.value?.name} · ${plan?.name}（${plan?.price}）——支付功能将在 B1 迭代上线`
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), 4000)
}

const goUse = () => {
  router.push(`/teams/${slug.value}/use`)
}

const modeLabel = (mode: string) => {
  const map: Record<string, string> = { plan: '拆解', parallel: '并行', sequential: '串行', merge: '汇总' }
  return map[mode] || mode
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <div class="pt-20" />

    <main v-if="team">
      <!-- Breadcrumb -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <router-link to="/skills?tab=team" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <component :is="teamCommonIcons.ArrowRight" class="w-3.5 h-3.5 rotate-180" />
          返回能力市场 · 专家团
        </router-link>
      </div>

      <!-- Hero -->
      <section class="relative py-8 overflow-hidden bg-white border-b border-slate-200/80">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[280px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="flex flex-col lg:flex-row gap-8 items-start">
            <!-- Identity -->
            <div class="lg:w-3/5 space-y-4">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
                  <component :is="teamIconMap[team.icon] || teamCommonIcons.Users" class="w-6 h-6" />
                </div>
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-indigo-600">{{ team.industry }}</span>
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {{ team.badge }}
                    </span>
                  </div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{{ team.name }}</h1>
                </div>
              </div>

              <p class="text-sm font-semibold text-indigo-600">{{ team.tagline }}</p>
              <p class="text-sm text-slate-600 leading-relaxed">{{ team.description }}</p>

              <!-- Members -->
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">团队构成</h3>
                <div class="flex flex-wrap gap-2">
                  <router-link
                    v-for="m in team.members"
                    :key="m.skillSlug"
                    :to="`/skills/${m.skillSlug}`"
                    class="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <span class="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 flex items-center justify-center text-white shrink-0">
                      <component :is="skillIconMap[skillOf(m.skillSlug)?.icon || ''] || teamCommonIcons.Zap" class="w-3.5 h-3.5" />
                    </span>
                    <span class="flex flex-col">
                      <span class="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{{ m.role }}</span>
                      <span class="text-[10px] text-slate-400">{{ m.responsibility }}</span>
                    </span>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Pricing card -->
            <div class="lg:w-2/5 w-full">
              <div class="rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                <div class="p-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-700">选择版本</span>
                    <span class="text-[10px] text-slate-400">含全部成员 Skill 能力</span>
                  </div>

                  <!-- Plan selector -->
                  <div class="space-y-2.5">
                    <button
                      v-for="plan in team.plans"
                      :key="plan.id"
                      @click="selectPlan(plan.id)"
                      :class="[
                        'w-full text-left p-3.5 rounded-xl border-2 transition-all relative',
                        selectedPlan === plan.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-500/5'
                          : 'border-slate-200 hover:border-indigo-300'
                      ]"
                    >
                      <div v-if="plan.isPopular" class="absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                        推荐
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-sm font-bold text-slate-900">{{ plan.name }}</span>
                        <div class="flex items-baseline gap-1">
                          <span class="text-lg font-extrabold text-slate-900 font-mono">{{ plan.price }}</span>
                          <span class="text-[10px] text-slate-400">{{ plan.period }}</span>
                        </div>
                      </div>
                      <p class="text-xs text-slate-500 mt-1">{{ plan.description }}</p>
                    </button>
                  </div>

                  <!-- Actions -->
                  <div class="space-y-2.5 pt-1">
                    <button
                      @click="openPurchase()"
                      class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
                    >
                      立即购买
                    </button>
                    <button
                      @click="goUse"
                      class="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 hover:shadow transition-all"
                    >
                      免费在线协作
                    </button>
                  </div>
                </div>

                <!-- Included -->
                <div class="px-5 pb-5">
                  <div class="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">协作流程概览</p>
                    <div
                      v-for="n in team.flow"
                      :key="n.step"
                      class="flex items-center gap-1.5 text-[11px] text-slate-600"
                    >
                      <GitBranch class="w-3 h-3 text-indigo-500 shrink-0" />
                      <span class="font-semibold text-slate-800">{{ n.role }}</span>
                      <span class="text-slate-300">·</span>
                      <span>{{ n.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 协作流程图（核心） -->
      <section class="py-10 bg-slate-50/60">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8 space-y-2.5">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold uppercase tracking-wider">
              <component :is="teamCommonIcons.Sparkles" class="w-3 h-3 text-indigo-600" />
              协作流程 · Workflow
            </div>
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">专家如何分工接力</h2>
            <p class="text-sm text-slate-500">一个任务，多位专家依次 / 并行协作，最终汇总交付</p>
          </div>

          <!-- Flow diagram -->
          <div class="space-y-0">
            <!-- 起点：用户任务 -->
            <div class="flex justify-center mb-0">
              <div class="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg flex items-center gap-2">
                <component :is="teamCommonIcons.Users" class="w-4 h-4 text-indigo-400" />
                你下达任务
              </div>
            </div>
            <div class="flex justify-center py-2">
              <span class="w-px h-6 bg-slate-300" />
            </div>

            <!-- Flow rows -->
            <div v-for="(row, idx) in flowRows" :key="idx" class="space-y-0">
              <div
                :class="[
                  'grid gap-3',
                  row.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
                  row.length > 1 ? 'max-w-2xl mx-auto' : 'max-w-md mx-auto'
                ]"
              >
                <div
                  v-for="node in row"
                  :key="node.step"
                  class="relative rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-300 transition-all"
                >
                  <div class="px-4 py-3 flex items-start gap-3">
                    <span
                      :class="[
                        'w-8 h-8 rounded-lg p-1.5 flex items-center justify-center text-white shrink-0 mt-0.5',
                        node.mode === 'plan' || node.mode === 'merge'
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                          : 'bg-gradient-to-tr from-slate-700 to-slate-900'
                      ]"
                    >
                      <component :is="skillIconMap[skillOf(node.skillSlug)?.icon || ''] || teamCommonIcons.Zap" class="w-4 h-4" />
                    </span>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-extrabold text-slate-900">{{ node.role }}</span>
                        <span
                          :class="[
                            'text-[9px] font-bold px-1.5 py-px rounded',
                            node.mode === 'parallel' ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : node.mode === 'merge' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-blue-50 text-blue-600 border border-blue-200'
                          ]"
                        >
                          {{ modeLabel(node.mode) }}
                        </span>
                      </div>
                      <p class="text-xs font-semibold text-slate-700 mt-1">{{ node.title }}</p>
                      <p class="text-[11px] text-slate-500 leading-relaxed mt-1">{{ node.description }}</p>
                      <div class="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 space-y-0.5">
                        <p>输入：{{ node.input }}</p>
                        <p>输出：{{ node.output }}</p>
                        <p class="text-indigo-500 font-medium">耗时 {{ node.duration }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- connector（除最后一行） -->
              <div v-if="idx < flowRows.length - 1" class="flex justify-center py-2">
                <span class="w-px h-6 bg-slate-300" />
              </div>
            </div>

            <!-- 终点：交付 -->
            <div class="flex justify-center py-2">
              <span class="w-px h-6 bg-slate-300" />
            </div>
            <div class="flex justify-center">
              <div class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg flex items-center gap-2">
                <Download class="w-4 h-4" />
                交付成果
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Highlights + Demo -->
      <section class="py-10 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Highlights -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            <div
              v-for="h in team.highlights"
              :key="h"
              class="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200"
            >
              <Check class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span class="text-sm text-slate-700 leading-snug">{{ h }}</span>
            </div>
          </div>

          <!-- Demo：输入 → 交付物 -->
          <div class="text-center mb-8 space-y-2.5">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold uppercase tracking-wider">
              <component :is="teamCommonIcons.Sparkles" class="w-3 h-3 text-blue-600" />
              成果预览 · Demo
            </div>
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">一个任务，一份完整交付</h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <!-- 任务输入 -->
            <div class="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div class="px-4 py-2.5 bg-slate-900 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Play class="w-3 h-3 text-emerald-400" />
                  任务输入
                </span>
                <span class="text-[10px] text-slate-500 font-mono">task</span>
              </div>
              <div class="p-4">
                <p class="text-xs text-slate-600 leading-relaxed">{{ team.sampleTask }}</p>
              </div>
            </div>

            <!-- 交付物 -->
            <div class="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div class="px-4 py-2.5 bg-indigo-600 flex items-center justify-between">
                <span class="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Download class="w-3 h-3" />
                  交付成果
                </span>
                <span class="text-[10px] text-indigo-200 font-mono">deliverable</span>
              </div>
              <div class="p-4">
                <MarkdownOutput :content="team.sampleDeliverable" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="py-10 bg-slate-50/60">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-7">
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">常见问题</h2>
          </div>
          <div class="space-y-2.5">
            <div
              v-for="faq in team.faq"
              :key="faq.id"
              :class="[
                'rounded-xl border bg-white transition-all',
                openFaq === faq.id ? 'border-indigo-400 shadow-md ring-1 ring-indigo-500/10' : 'border-slate-200'
              ]"
            >
              <button
                @click="openFaq = openFaq === faq.id ? null : faq.id"
                class="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left"
              >
                <span class="text-sm font-bold text-slate-900">{{ faq.question }}</span>
                <ChevronDown
                  class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                  :class="openFaq === faq.id ? 'rotate-180 text-indigo-600' : ''"
                />
              </button>
              <div v-if="openFaq === faq.id" class="px-4 pb-4">
                <p class="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-600 pl-3.5">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-10 bg-slate-50/60 pt-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 sm:p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-600/15">
            <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-base font-extrabold tracking-tight">需要更贴合企业场景？</h3>
                <p class="text-blue-100 text-xs leading-relaxed max-w-xl">
                  「{{ team.name }}」可升级为企业 AI 员工 —— 接入您的历史资料与知识库，专属定制、私有化部署。
                </p>
              </div>
              <button
                @click="handleOpenConsole"
                class="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs shadow-lg hover:shadow-xl transition-all"
              >
                咨询企业定制
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Not found -->
    <main v-else class="py-32 text-center">
      <h2 class="text-2xl font-extrabold text-slate-900 mb-4">专家团不存在</h2>
      <router-link
        to="/skills?tab=team"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl"
      >
        返回能力市场
      </router-link>
    </main>

    <FooterSection />
    <ContactFloat />

    <!-- Purchase Modal -->
    <Transition name="modal-fade">
      <div
        v-if="purchaseModalOpen && team"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="purchaseModalOpen = false" />
        <div class="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
          <div class="p-7">
            <h3 class="text-lg font-extrabold text-slate-900">确认订单</h3>
            <p class="text-xs text-slate-500 mt-1">请确认以下订单信息</p>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 flex items-center justify-center text-white">
                    <component :is="teamIconMap[team.icon] || teamCommonIcons.Users" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ team.name }}</p>
                    <p class="text-[11px] text-slate-500">{{ team.plans.find((p) => p.id === selectedPlan)?.name }} · {{ team.members.length }} 位专家</p>
                  </div>
                </div>
                <span class="text-lg font-extrabold text-slate-900 font-mono">
                  {{ team.plans.find((p) => p.id === selectedPlan)?.price }}
                </span>
              </div>
              <div class="text-[11px] text-slate-400 leading-relaxed">
                支付功能将在平台 B1 迭代上线。当前为演示流程，提交后将进入企业顾问对接。
              </div>
            </div>
          </div>

          <div class="px-7 pb-7 flex gap-3">
            <button
              @click="purchaseModalOpen = false"
              class="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
            >
              取消
            </button>
            <button
              @click="confirmPurchase"
              class="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              确认提交
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="modal-fade">
      <div
        v-if="toastVisible"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-sm shadow-2xl max-w-lg text-center"
      >
        {{ toastText }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
