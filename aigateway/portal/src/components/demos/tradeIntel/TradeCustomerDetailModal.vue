<script setup lang="ts">
// 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/CustomerDetailModal.tsx
import { computed, ref } from 'vue'
import {
  Activity,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Linkedin,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Zap,
} from 'lucide-vue-next'
import type { CompanyLead } from '@/data/tradeIntelData'

const props = withDefaults(defineProps<{ lead: CompanyLead | null }>(), { lead: null })

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'generate-email', lead: CompanyLead): void
  (e: 'toggle-star', leadId: string): void
}>()

type TabKey = 'portrait' | 'score' | 'opportunities' | 'contacts' | 'sources'

const activeTab = ref<TabKey>('portrait')
const copiedContact = ref<string | null>(null)
const steps = ref([...(props.lead?.nextSteps ?? [])])
const showExportToast = ref(false)

const firstContact = computed(() => (props.lead ? props.lead.contacts[0] : undefined))

const countryLabel = (country: string): string => {
  if (country === 'United States') return '🇺🇸 美国'
  if (country === 'Canada') return '🇨🇦 加拿大'
  if (country === 'United Kingdom') return '🇬🇧 英国'
  if (country === 'Australia') return '🇦🇺 澳大利亚'
  if (country === 'Germany') return '🇩🇪 德国'
  return '🇸🇬 新加坡'
}

const toggleStep = (stepId: number) => {
  steps.value = steps.value.map((s) =>
    s.id === stepId ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' } : s,
  )
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text)
  copiedContact.value = label
  setTimeout(() => (copiedContact.value = null), 2000)
}

const handleExportDossier = () => {
  showExportToast.value = true
  setTimeout(() => (showExportToast.value = false), 3000)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="lead"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div class="bg-[#F8FAFC] border border-slate-200 rounded-xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <!-- Modal Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {{ lead.logoInitial }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="font-bold text-base text-slate-900 tracking-tight">全球客户详情 · {{ lead.name }}</h1>
                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">
                  {{ lead.tier }}级高潜
                </span>
                <span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-mono font-bold rounded border border-blue-200">
                  综合评分: {{ lead.overallScore }}/100
                </span>
              </div>
              <div class="text-xs text-slate-500 flex items-center gap-2">
                <span>{{ countryLabel(lead.country) }} · {{ lead.city }}</span>
                <span>•</span>
                <span>成立: {{ lead.establishedYear }}年</span>
                <span>•</span>
                <span>规模: {{ lead.employeeScale }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="emit('toggle-star', lead.id)"
              class="p-2 rounded-md border transition-colors cursor-pointer"
              :class="
                lead.isStarred
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
              "
              title="加入收藏/重点跟进"
            >
              <Star class="w-4 h-4" :class="lead.isStarred ? 'fill-amber-500 text-amber-500' : ''" />
            </button>
            <button
              type="button"
              @click="handleExportDossier"
              class="px-3.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
            >
              导出报告
            </button>
            <button
              type="button"
              @click="emit('generate-email', lead)"
              class="px-3.5 py-1.5 text-xs bg-blue-600 text-white rounded-md font-semibold shadow-sm hover:bg-blue-700 cursor-pointer"
            >
              生成开发方案
            </button>
            <button
              type="button"
              @click="emit('close')"
              class="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </header>

        <!-- Export Toast -->
        <div
          v-if="showExportToast"
          class="bg-blue-50 border-b border-blue-200 px-6 py-2 text-xs text-blue-800 flex items-center justify-between"
        >
          <span>已生成《{{ lead.name }} - 企业商业情报与供应链画像报告.pdf》并开始下载。</span>
          <span class="text-[10px] text-blue-600 font-mono font-bold">2.4 MB</span>
        </div>

        <!-- Tab Navigation -->
        <div class="px-6 border-b border-slate-200 bg-white flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            @click="activeTab = 'portrait'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              activeTab === 'portrait'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            "
          >
            <Building2 class="w-3.5 h-3.5" />
            <span>企业画像与匹配分析</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'score'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              activeTab === 'score'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            "
          >
            <Activity class="w-3.5 h-3.5" />
            <span>5维客户潜力评分</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'opportunities'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              activeTab === 'opportunities'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            "
          >
            <Sparkles class="w-3.5 h-3.5 text-blue-600" />
            <span>AI商业机会 &amp; 建议行动</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'contacts'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              activeTab === 'contacts'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            "
          >
            <Briefcase class="w-3.5 h-3.5" />
            <span>决策人联系方式 ({{ lead.contacts.length }})</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'sources'"
            class="py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              activeTab === 'sources'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            "
          >
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
            <span>数据来源与交叉验证 ({{ lead.informationSources.length }})</span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-6 overflow-y-auto flex-1 space-y-6">
          <!-- TAB 1: Enterprise Portrait & Product Match -->
          <div v-if="activeTab === 'portrait'" class="grid grid-cols-12 gap-6">
            <!-- Left Column (8 cols): Company Profile & AI Summary -->
            <div class="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <!-- 1. Company Profile Card -->
              <section class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <div class="text-xl font-bold text-slate-900 mb-1">{{ lead.name }}</div>
                    <div class="text-slate-500 text-xs flex flex-wrap gap-3">
                      <span>📍 {{ lead.country }} · {{ lead.region }}</span>
                      <span>• 成立时间: {{ lead.establishedYear }}年</span>
                      <span>• 员工规模: {{ lead.employeeScale }}</span>
                      <span>• 年营收: {{ lead.annualRevenue }}</span>
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="text-[10px] text-slate-400 uppercase mb-0.5 font-bold">综合评分</div>
                    <div class="text-3xl font-black text-blue-600 font-mono">
                      {{ lead.overallScore }}<span class="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                <!-- AI Business Insights Banner (High Density signature) -->
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div class="flex items-center gap-2 mb-1 text-blue-900 font-bold text-xs">
                    <Sparkles class="w-3.5 h-3.5 text-blue-600" />
                    <span>AI 业务洞察</span>
                  </div>
                  <p class="text-slate-700 text-xs leading-relaxed">
                    {{ lead.businessPortrait.overview }}
                  </p>
                  <div class="mt-2 text-xs font-semibold text-blue-800">
                    <strong>AI 核心判断：</strong>{{ lead.businessPortrait.chinaCooperationPotential }}
                  </div>
                </div>
              </section>

              <!-- 2. Product Matching Visualization -->
              <section class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="font-bold text-slate-900 text-sm mb-4 flex items-center justify-between">
                  <span>产品匹配分析</span>
                  <span class="text-xs font-semibold text-blue-600 font-mono">Matching Accuracy: {{ lead.productMatchDetails.overall }}%</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <div v-for="(cat, idx) in lead.productMatchDetails.categories" :key="idx">
                      <div class="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                        <span>{{ cat.name }}</span>
                        <span class="font-mono text-blue-600">{{ cat.percentage }}%</span>
                      </div>
                      <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          class="bg-blue-600 h-full rounded-full"
                          :style="{ width: cat.percentage + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-slate-50 p-4 rounded-lg flex flex-col justify-center border border-slate-200/60">
                    <div class="text-xs text-slate-700 mb-2 font-bold flex items-center gap-1.5">
                      <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                      <span>匹配结论与准入依据：</span>
                    </div>
                    <ul class="text-xs text-slate-600 space-y-1.5 pl-2">
                      <li v-for="(v, vi) in lead.productMatchDetails.aiVerdict" :key="vi" class="flex gap-1.5 items-start">
                        <span class="text-emerald-600 font-bold">•</span>
                        <span>{{ v }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <!-- 3. Opportunities Feed -->
              <section class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 class="font-bold text-slate-900 text-sm mb-4">AI 挖掘的商机 (Opportunities)</h3>
                <div class="space-y-3">
                  <div
                    v-for="(opp, idx) in lead.aiOpportunities"
                    :key="opp.id"
                    class="flex gap-3 p-3.5 border rounded-lg"
                    :class="idx % 2 === 0 ? 'border-orange-200 bg-orange-50/40' : 'border-blue-200 bg-blue-50/40'"
                  >
                    <div class="w-1 rounded-full shrink-0" :class="idx % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'"></div>
                    <div class="flex-1">
                      <div class="flex justify-between items-center mb-1">
                        <span class="text-xs font-bold" :class="idx % 2 === 0 ? 'text-orange-950' : 'text-blue-950'">
                          {{ opp.tag }}：{{ opp.title }}
                        </span>
                        <span
                          class="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                          :class="idx % 2 === 0 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'"
                        >
                          {{ opp.level === '高' ? 'High confidence' : 'Mid confidence' }}
                        </span>
                      </div>
                      <p class="text-xs text-slate-600 leading-relaxed">{{ opp.description }}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Column (4 cols): Action Panel & Sources -->
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <!-- Score Breakdown Card (High Density dark theme card) -->
              <section class="bg-[#1E293B] text-white rounded-xl p-5 shadow-md">
                <h3 class="text-xs font-bold mb-3 text-slate-400 uppercase tracking-wider">潜力详情评分</h3>
                <div class="space-y-3 mb-5">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400">产品匹配度</span>
                    <span class="font-mono font-bold text-blue-400">{{ lead.scoreBreakdown.productMatch }}/100</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400">市场契合度</span>
                    <span class="font-mono font-bold text-blue-400">{{ lead.scoreBreakdown.marketMatch }}/100</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400">企业规模感</span>
                    <span class="font-mono font-bold text-blue-400">{{ lead.scoreBreakdown.companyScale }}/100</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400">采购潜力与体量</span>
                    <span class="font-mono font-bold text-blue-400">{{ lead.scoreBreakdown.purchasePotential }}/100</span>
                  </div>
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400">合作意向预判</span>
                    <span class="font-mono font-bold text-blue-400">{{ lead.scoreBreakdown.cooperationProbability }}/100</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-green-400 font-bold text-xs bg-green-900/30 p-2.5 rounded-lg border border-green-800/40">
                  <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>AI 研判：★★★★★ 非常值得深度跟进</span>
                </div>
              </section>

              <!-- Key Decision Maker Fast Box -->
              <section class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 class="font-bold text-slate-800 text-xs mb-3 uppercase tracking-tight flex items-center justify-between">
                  <span>关键决策人</span>
                  <button
                    type="button"
                    @click="activeTab = 'contacts'"
                    class="text-blue-600 font-semibold text-[11px] hover:underline"
                  >
                    查看全部
                  </button>
                </h3>
                <div v-if="firstContact" class="p-3 bg-slate-50 rounded-lg border border-slate-200/70 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900">{{ firstContact.name }}</span>
                    <span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium">采购关键人</span>
                  </div>
                  <div class="text-slate-500 text-[11px]">{{ firstContact.title }}</div>
                  <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span class="text-slate-500 font-mono text-[11px]">{{ firstContact.email }}</span>
                    <button
                      type="button"
                      @click="copyToClipboard(firstContact.email, '邮箱')"
                      class="text-blue-600 hover:text-blue-800 text-[11px] font-semibold cursor-pointer"
                    >
                      复制
                    </button>
                  </div>
                </div>
              </section>

              <!-- Intelligence Sources (High Density tags) -->
              <section class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 class="font-bold text-slate-800 text-xs mb-3 uppercase tracking-tight">信息溯源 (Sources)</h3>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(s, idx) in lead.informationSources"
                    :key="idx"
                    class="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-full border border-slate-200/60 font-medium"
                  >
                    {{ s.sourceName }}
                  </span>
                </div>
              </section>
            </div>
          </div>

          <!-- TAB 2: 5-Dimension Score System -->
          <div v-if="activeTab === 'score'" class="space-y-6">
            <!-- Score Highlight Card -->
            <div class="p-6 rounded-xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div class="space-y-2 text-center md:text-left">
                <span class="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  AI 客户综合潜力加权评估模型
                </span>
                <div class="flex items-baseline justify-center md:justify-start gap-2">
                  <span class="text-4xl md:text-5xl font-black text-white font-mono">
                    {{ lead.overallScore }}
                  </span>
                  <span class="text-lg text-slate-400 font-mono">/ 100 分</span>
                </div>
                <div class="flex items-center justify-center md:justify-start gap-1 text-amber-400 text-sm font-semibold">
                  <span>★★★★★</span>
                  <span class="text-slate-200 text-xs ml-1">极高开发价值 (Top 5% 优质买家)</span>
                </div>
              </div>

              <div class="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-xs text-slate-200 space-y-1.5 max-w-md">
                <div class="text-blue-300 font-bold flex items-center gap-1.5">
                  <Zap class="w-3.5 h-3.5 text-amber-400" />
                  <span>AI 评分判定结论:</span>
                </div>
                <p class="text-slate-200 leading-relaxed text-[11px]">
                  该企业具备成熟的B端分销网络、明确的门窗类目销售占比，且在海关有稳定进口记录。目前面临北美本地供应商交付周期延长的核心痛点，是承接中国高品质定制供应链的理想买家。
                </p>
              </div>
            </div>

            <!-- 5-Dimension Breakdown Bars -->
            <div class="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5 维综合加权评估明细 (5-Dimension Weight Breakdown)
              </h3>

              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-700 font-medium">1. 产品匹配度 (Product Match) - 权重 30%</span>
                    <span class="text-blue-600 font-bold font-mono">{{ lead.scoreBreakdown.productMatch }} / 100</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-600 rounded-full" :style="{ width: lead.scoreBreakdown.productMatch + '%' }"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-700 font-medium">2. 企业规模与财力 (Company Scale) - 权重 20%</span>
                    <span class="text-blue-600 font-bold font-mono">{{ lead.scoreBreakdown.companyScale }} / 100</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: lead.scoreBreakdown.companyScale + '%' }"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-700 font-medium">3. 市场契合度 (Market Match) - 权重 20%</span>
                    <span class="text-blue-600 font-bold font-mono">{{ lead.scoreBreakdown.marketMatch }} / 100</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: lead.scoreBreakdown.marketMatch + '%' }"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-700 font-medium">4. 采购潜力与体量 (Purchase Potential) - 权重 15%</span>
                    <span class="text-emerald-600 font-bold font-mono">{{ lead.scoreBreakdown.purchasePotential }} / 100</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" :style="{ width: lead.scoreBreakdown.purchasePotential + '%' }"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-slate-700 font-medium">5. 合作可能性与意愿 (Cooperation Probability) - 权重 15%</span>
                    <span class="text-amber-600 font-bold font-mono">{{ lead.scoreBreakdown.cooperationProbability }} / 100</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-500 rounded-full" :style="{ width: lead.scoreBreakdown.cooperationProbability + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: AI Opportunities & Next Steps -->
          <div v-if="activeTab === 'opportunities'" class="space-y-6">
            <!-- Opportunities List -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles class="w-4 h-4 text-blue-600" />
                  <span>AI 发现的重大商业机会 (Commercial Opportunities)</span>
                </h3>
                <span class="text-xs text-slate-500">结合海关提单、官网动态与政策风向精准计算</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div
                  v-for="(opp, idx) in lead.aiOpportunities"
                  :key="opp.id"
                  class="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 shadow-xs"
                >
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        机会 0{{ idx + 1 }} · {{ opp.tag }}
                      </span>
                      <span
                        class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        :class="opp.level === '高' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                      >
                        等级: {{ opp.level }}
                      </span>
                    </div>
                    <h4 class="text-xs font-bold text-slate-900 leading-snug">
                      {{ opp.title }}
                    </h4>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      {{ opp.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actionable Next Steps -->
            <div class="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap class="w-4 h-4 text-emerald-600" />
                    <span>AI 建议你现在做什么？(Actionable Next Steps)</span>
                  </h3>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    点击复选框可标记跟进进度，业务员可直接按此SOP执行
                  </p>
                </div>

                <button
                  type="button"
                  @click="emit('generate-email', lead)"
                  class="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Mail class="w-3.5 h-3.5" />
                  <span>立即执行：生成开发信</span>
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="step in steps"
                  :key="step.id"
                  @click="toggleStep(step.id)"
                  class="p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors"
                  :class="
                    step.status === 'completed'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  "
                >
                  <div class="flex items-center gap-3">
                    <input
                      type="checkbox"
                      :checked="step.status === 'completed'"
                      @change="() => {}"
                      class="rounded accent-emerald-600 w-4 h-4 cursor-pointer"
                    />
                    <span class="text-xs font-medium" :class="step.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'">
                      {{ step.id }}. {{ step.step }}
                    </span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                    {{ step.recommendedTime }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: Decision Maker Contacts -->
          <div v-if="activeTab === 'contacts'" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase class="w-4 h-4 text-blue-600" />
                  <span>企业关键决策人与采购联系方式 (Verified Contacts)</span>
                </h3>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  已通过企业官网、展会名册及LinkedIn官方企业主页多重交叉核实验证
                </p>
              </div>

              <span v-if="copiedContact" class="text-xs text-emerald-600 font-semibold animate-in fade-in">
                ✔ 已复制 {{ copiedContact }} 到剪贴板
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(contact, idx) in lead.contacts"
                :key="idx"
                class="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 space-y-3 shadow-xs"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-slate-900">{{ contact.name }}</span>
                      <span
                        v-if="contact.isKeyDecisionMaker"
                        class="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        采购关键人
                      </span>
                    </div>
                    <span class="text-xs text-slate-500">{{ contact.title }}</span>
                  </div>

                  <a
                    :href="contact.linkedin"
                    target="_blank"
                    rel="noreferrer"
                    class="p-1.5 rounded-md bg-slate-100 hover:bg-blue-50 text-blue-600"
                    title="打开LinkedIn主页"
                  >
                    <Linkedin class="w-3.5 h-3.5" />
                  </a>
                </div>

                <div class="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1">
                      <Mail class="w-3 h-3 text-slate-400" /> 邮箱:
                    </span>
                    <button
                      type="button"
                      @click="copyToClipboard(contact.email, contact.name + ' 邮箱')"
                      class="text-blue-600 hover:underline font-mono cursor-pointer font-medium"
                    >
                      {{ contact.email }}
                    </button>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1">
                      <Phone class="w-3 h-3 text-slate-400" /> 电话:
                    </span>
                    <button
                      type="button"
                      @click="copyToClipboard(contact.phone, contact.name + ' 电话')"
                      class="text-slate-700 hover:text-slate-900 font-mono cursor-pointer font-medium"
                    >
                      {{ contact.phone }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 5: Information Sources & Verification Trace -->
          <div v-if="activeTab === 'sources'" class="space-y-4">
            <div class="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-emerald-600" />
                <span>AI 正在从多个公开商业信息来源进行信息采集与交叉验证，数据可信度平均 ≥97%</span>
              </div>
              <span class="text-[10px] text-emerald-700 font-mono font-bold">CROSS-VALIDATED</span>
            </div>

            <div class="space-y-3">
              <div
                v-for="(source, sidx) in lead.informationSources"
                :key="sidx"
                class="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {{ source.sourceType }}
                    </span>
                    <span class="text-xs font-bold text-slate-900">{{ source.sourceName }}</span>
                  </div>
                  <div class="text-[11px] text-slate-500 font-mono">
                    索引依据: {{ source.linkTitle }}
                  </div>
                </div>

                <div class="flex items-center gap-4 shrink-0 text-xs">
                  <div class="text-right">
                    <span class="text-slate-400 block text-[10px]">采集时间</span>
                    <span class="text-slate-600 font-mono text-[11px]">{{ source.sourceDate }}</span>
                  </div>

                  <div class="text-right">
                    <span class="text-slate-400 block text-[10px]">可信度</span>
                    <span class="text-emerald-600 font-bold font-mono text-[11px]">{{ source.reliability }}%</span>
                  </div>

                  <span class="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                    <CheckCircle2 class="w-3 h-3" />
                    已核实
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="text-slate-500 flex items-center gap-2">
            <BadgeCheck class="w-4 h-4 text-blue-600" />
            <span>XX AI · 商业情报系统已自动为您生成针对该客户的专属切入方案</span>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              @click="emit('close')"
              class="flex-1 sm:flex-none px-4 py-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-xs"
            >
              返回列表
            </button>
            <button
              type="button"
              @click="emit('generate-email', lead)"
              class="flex-1 sm:flex-none px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Mail class="w-3.5 h-3.5" />
              <span>生成客户定制开发邮件</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
