<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { siteInfo } from '@/data/site'
import AppHeader from '@/components/AppHeader.vue'
import FooterSection from '@/components/FooterSection.vue'
import ContactFloat from '@/components/ContactFloat.vue'
import { skills } from '@/data/skills'
import { skillIconMap, skillCommonIcons } from '@/utils/skillIcons'
import MarkdownOutput from '@/components/MarkdownOutput.vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const adminUrl = siteInfo.adminUrl

const handleOpenConsole = () => {
  window.open(`${adminUrl}/login`, '_blank')
}

const slug = computed(() => String(route.params.slug || ''))
const skill = computed(() => skills.find((s) => s.slug === slug.value))

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
  else if (!selectedPlan.value && skill.value) selectedPlan.value = skill.value.plans.find((p) => p.isPopular)?.id || skill.value.plans[0].id
  purchaseModalOpen.value = true
}

const confirmPurchase = () => {
  const plan = skill.value?.plans.find((p) => p.id === selectedPlan.value)
  purchaseModalOpen.value = false
  toastText.value = `已提交订单：${skill.value?.name} · ${plan?.name}（${plan?.price}）——支付功能将在 B1 迭代上线`
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), 4000)
}

const goUse = () => {
  router.push(`/skills/${slug.value}/use`)
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans antialiased">
    <AppHeader :admin-url="adminUrl" @open-console="handleOpenConsole" />

    <div class="pt-20" />

    <main v-if="skill">
      <!-- Breadcrumb -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <router-link to="/skills" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <component :is="skillCommonIcons.ArrowRight" class="w-3.5 h-3.5 rotate-180" />
          返回能力市场
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
                  <component :is="skillIconMap[skill.icon] || skillCommonIcons.Zap" class="w-6 h-6" />
                </div>
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-blue-600">{{ skill.category }}</span>
                    <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {{ skill.badge }}
                    </span>
                  </div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{{ skill.name }}</h1>
                </div>
              </div>

              <p class="text-sm font-semibold text-blue-600">{{ skill.tagline }}</p>
              <p class="text-sm text-slate-600 leading-relaxed">{{ skill.description }}</p>

              <!-- Highlights -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  v-for="h in skill.highlights"
                  :key="h"
                  class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <component :is="skillCommonIcons.CheckCircle2" class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span class="text-xs text-slate-700 leading-snug">{{ h }}</span>
                </div>
              </div>

              <!-- Scenarios -->
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">典型使用场景</h3>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="sc in skill.scenarios"
                    :key="sc"
                    class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {{ sc }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Pricing card -->
            <div class="lg:w-2/5 w-full">
              <div class="rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
                <div class="p-5 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-700">选择版本</span>
                    <span class="text-[10px] text-slate-400">价格含税，支持对公转账</span>
                  </div>

                  <!-- Plan selector -->
                  <div class="space-y-2.5">
                    <button
                      v-for="plan in skill.plans"
                      :key="plan.id"
                      @click="selectPlan(plan.id)"
                      :class="[
                        'w-full text-left p-3.5 rounded-xl border-2 transition-all relative',
                        selectedPlan === plan.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5'
                          : 'border-slate-200 hover:border-blue-300'
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
                      class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
                    >
                      立即购买
                    </button>
                    <button
                      @click="goUse"
                      class="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 hover:shadow transition-all"
                    >
                      免费在线使用
                    </button>
                  </div>
                </div>

                <!-- Included features -->
                <div class="px-5 pb-5">
                  <div class="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">购买后可用能力</p>
                    <div
                      v-for="f in (skill.plans.find((p) => p.id === selectedPlan) || skill.plans[0]).features"
                      :key="f"
                      class="flex items-start gap-1.5"
                    >
                      <Check class="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span class="text-[11px] text-slate-600">{{ f }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Demo example -->
      <section class="py-10 bg-slate-50/60">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-8 space-y-2.5">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold uppercase tracking-wider">
              <component :is="skillCommonIcons.Sparkles" class="w-3 h-3 text-blue-600" />
              成果预览 · Demo
            </div>
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">看看它能为你交付什么</h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <!-- Input -->
            <div class="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div class="px-4 py-2.5 bg-slate-900 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-300">示例输入</span>
                <span class="text-[10px] text-slate-500 font-mono">sample-input</span>
              </div>
              <div class="p-4 space-y-2.5">
                <div
                  v-for="(val, key) in skill.sampleInput"
                  :key="key"
                  class="text-xs text-slate-600 leading-relaxed"
                >
                  <span class="font-bold text-slate-800 block mb-0.5">{{ key }}</span>
                  {{ val }}
                </div>
              </div>
            </div>

            <!-- Output -->
            <div class="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div class="px-4 py-2.5 bg-blue-600 flex items-center justify-between">
                <span class="text-xs font-semibold text-white">交付成果</span>
                <span class="text-[10px] text-blue-200 font-mono">sample-output</span>
              </div>
              <div class="p-4">
                <MarkdownOutput :content="skill.sampleOutput" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="py-10 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-7">
            <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">常见问题</h2>
          </div>
          <div class="space-y-2.5">
            <div
              v-for="faq in skill.faq"
              :key="faq.id"
              :class="[
                'rounded-xl border transition-all',
                openFaq === faq.id ? 'border-blue-400 shadow-md ring-1 ring-blue-500/10' : 'border-slate-200'
              ]"
            >
              <button
                @click="openFaq = openFaq === faq.id ? null : faq.id"
                class="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left"
              >
                <span class="text-sm font-bold text-slate-900">{{ faq.question }}</span>
                <ChevronDown
                  class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                  :class="openFaq === faq.id ? 'rotate-180 text-blue-600' : ''"
                />
              </button>
              <div v-if="openFaq === faq.id" class="px-4 pb-4">
                <p class="text-sm text-slate-600 leading-relaxed border-l-2 border-blue-600 pl-3.5">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="pb-10 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 sm:p-6 text-white relative overflow-hidden shadow-lg shadow-blue-600/15">
            <div class="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-base font-extrabold tracking-tight">需要更贴合企业场景？</h3>
                <p class="text-blue-100 text-xs leading-relaxed max-w-xl">
                  「{{ skill.name }}」可升级为企业 AI 员工 —— 接入您的历史资料与知识库，专属定制、私有化部署。
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
      <h2 class="text-2xl font-extrabold text-slate-900 mb-4">Skill 不存在</h2>
      <p class="text-slate-500 text-sm mb-8">您访问的 Skill 可能已下架或地址有误。</p>
      <router-link
        to="/skills"
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
        v-if="purchaseModalOpen && skill"
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
                    <component :is="skillIconMap[skill.icon] || skillCommonIcons.Zap" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ skill.name }}</p>
                    <p class="text-[11px] text-slate-500">{{ skill.plans.find((p) => p.id === selectedPlan)?.name }}</p>
                  </div>
                </div>
                <span class="text-lg font-extrabold text-slate-900 font-mono">
                  {{ skill.plans.find((p) => p.id === selectedPlan)?.price }}
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
              class="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
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
