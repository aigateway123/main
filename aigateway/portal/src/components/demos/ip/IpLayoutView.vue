<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/PatentLayoutView.tsx -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, FileEdit, Layers, Plus, Sparkles } from 'lucide-vue-next'
import { MOCK_OPPORTUNITIES, MOCK_PYRAMID_TIERS } from '@/data/ipMockData'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'

// 当前选中金字塔层级（默认第 4 层：算法专利）与空白度过滤
const selectedTierLevel = ref<number>(4)
const filterWhiteSpace = ref<string>('all')
// 当前选中机会 id（照原型默认展开第一条，行内联展示 targetClaims）
const selectedOpportunityId = ref<string>(MOCK_OPPORTUNITIES[0]?.id ?? '')

// ---- 机会列表过滤：全部 / 明显空白（非常明显）/ 较明显空白 ----
const filteredOpportunities = computed(() => {
  if (filterWhiteSpace.value === 'high') {
    return MOCK_OPPORTUNITIES.filter((op) => op.whiteSpaceDegree === '非常明显')
  }
  if (filterWhiteSpace.value === 'medium') {
    return MOCK_OPPORTUNITIES.filter((op) => op.whiteSpaceDegree === '较明显')
  }
  return MOCK_OPPORTUNITIES
})

// 当前选中层级（含该层重点专利群组明细）
const currentTier = computed(
  () => MOCK_PYRAMID_TIERS.find((t) => t.level === selectedTierLevel.value) || MOCK_PYRAMID_TIERS[0],
)

// 行内展开判定
const isOpportunitySelected = (id: string): boolean => selectedOpportunityId.value === id

// ---- 金字塔叠条：level 4→1 由上至下逐层加宽（72% → 82% → 92% → 100%） ----
const tierWidthClass = (level: number): string => {
  if (level === 4) return 'w-full sm:w-[72%]'
  if (level === 3) return 'w-full sm:w-[82%]'
  if (level === 2) return 'w-full sm:w-[92%]'
  return 'w-full'
}

// 每层配色：选中实底深色、未选中浅色描边（第 4 层紫 / 第 3 层蓝 / 第 2 层青 / 第 1 层石板灰）
const tierBlockClass = (level: number, isSelected: boolean): string => {
  if (level === 4) return isSelected ? 'bg-purple-700 text-white border-purple-700' : 'bg-purple-50/70 text-purple-950 border-purple-200'
  if (level === 3) return isSelected ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-50/70 text-blue-950 border-blue-200'
  if (level === 2) return isSelected ? 'bg-cyan-700 text-white border-cyan-700' : 'bg-cyan-50/70 text-cyan-950 border-cyan-200'
  return isSelected ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
}

// 聚合某层「已有 / 建议增报」件数
const tierTotals = (items: { existingCount: number; recommendedCount: number }[]): { exist: number; rec: number } => {
  let exist = 0
  let rec = 0
  items.forEach((i) => {
    exist += i.existingCount
    rec += i.recommendedCount
  })
  return { exist, rec }
}

// 「加入立项交底清单」演示动作
const handleAddToBacklog = (title: string) => {
  window.alert(`已为「${title}」生成交底书大纲，已同步至企业交底待办中。`)
}
</script>

<template>
  <div class="p-4 sm:p-5 space-y-4 pb-8">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span class="w-1 h-4 bg-emerald-600 rounded-full"></span>
          <span>AI专利布局与空白挖掘</span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            已识别 {{ MOCK_OPPORTUNITIES.length }} 个专利蓝海机会
          </span>
        </h2>
        <p class="text-[11px] text-slate-500 mt-0.5">
          避开巨头高壁垒红海区域，基于四层阶梯式金字塔构建企业自主可控知识产权护城河
        </p>
      </div>
    </div>

    <!-- 区块一：四层阶梯式专利布局路线图（交互金字塔叠条） -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Layers class="w-3.5 h-3.5 text-blue-600" />
            <span>四层阶梯式专利布局路线图 (四层专利金字塔)</span>
          </h3>
          <p class="text-[10px] text-slate-400 mt-0.5">
            由底层硬件物理结构向顶层软件算法与安全预警递进，建立立体防御矩阵
          </p>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">
          建议布局周期：12-18个月
        </span>
      </div>

      <!-- 金字塔图形块（可交互叠条，点击切换层级） -->
      <div class="space-y-2 max-w-2xl mx-auto py-1">
        <div
          v-for="tier in MOCK_PYRAMID_TIERS"
          :key="tier.level"
          class="mx-auto cursor-pointer p-2.5 sm:p-3 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between gap-3"
          :class="[tierWidthClass(tier.level), tierBlockClass(tier.level, selectedTierLevel === tier.level)]"
          @click="selectedTierLevel = tier.level"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span
              class="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold font-mono shrink-0"
              :class="selectedTierLevel === tier.level ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'"
            >
              L{{ tier.level }}
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs truncate">{{ tier.title }}</span>
                <span
                  class="text-[9px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap"
                  :class="selectedTierLevel === tier.level ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-700'"
                >
                  已有 {{ tierTotals(tier.items).exist }} 件 / 建议增报 {{ tierTotals(tier.items).rec }} 件
                </span>
              </div>
              <p class="text-[10px] mt-0.5 truncate" :class="selectedTierLevel === tier.level ? 'text-white/80' : 'text-slate-500'">
                包含：{{ tier.items.map((i) => i.name).join(' · ') }}
              </p>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="text-[10px] font-mono block" :class="selectedTierLevel === tier.level ? 'text-white/90' : 'text-slate-400'">
              {{ tier.category }}
            </span>
            <span class="text-[9px] font-semibold block mt-0.5" :class="selectedTierLevel === tier.level ? 'text-white underline' : 'text-blue-600'">
              规划明细 →
            </span>
          </div>
        </div>
      </div>

      <!-- 选中层级的重点专利群组明细 -->
      <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h4 class="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>当前选定层级：{{ currentTier.title }}</span>
          </h4>
          <span class="text-[10px] text-slate-500">
            共规划 {{ currentTier.items.length }} 个重点专利群组
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div
            v-for="(item, idx) in currentTier.items"
            :key="item.name"
            class="p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-sm flex flex-col justify-between space-y-1.5"
          >
            <div>
              <div class="flex items-center justify-between text-[10px] mb-1">
                <span class="font-mono text-slate-400 font-semibold">GROUP {{ '0' + (idx + 1) }}</span>
                <span
                  class="px-1.5 py-0.5 rounded font-semibold text-[9px]"
                  :class="item.status === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ item.status === 'urgent' ? '急需增补' : '规划中' }}
                </span>
              </div>
              <h5 class="font-bold text-slate-900 text-xs">{{ item.name }}</h5>
              <p class="text-slate-500 mt-0.5 leading-relaxed text-[10px]">{{ item.description }}</p>
            </div>

            <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="text-slate-400">已有: <strong class="text-slate-700">{{ item.existingCount }}</strong></span>
              <span class="text-blue-600 font-bold">建议申请: +{{ item.recommendedCount }} 件</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区块二：潜在专利布局机会列表（AI 技术蓝海发现） -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div>
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
            <span>潜在专利布局机会 (AI技术蓝海发现)</span>
          </h3>
          <p class="text-[10px] text-slate-400 mt-0.5">
            综合考量竞争对手密集度、现有技术公知度与申请授权成功率
          </p>
        </div>

        <!-- 空白度过滤 Tabs -->
        <div class="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterWhiteSpace === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'"
            @click="filterWhiteSpace = 'all'"
          >
            全部 ({{ MOCK_OPPORTUNITIES.length }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterWhiteSpace === 'high' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'"
            @click="filterWhiteSpace = 'high'"
          >
            明显空白
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded font-medium transition-all cursor-pointer"
            :class="filterWhiteSpace === 'medium' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'"
            @click="filterWhiteSpace = 'medium'"
          >
            较明显空白
          </button>
        </div>
      </div>

      <!-- 机会列表（行点击选中并内联展开 Target Claims） -->
      <div class="space-y-2.5">
        <div
          v-for="op in filteredOpportunities"
          :key="op.id"
          class="p-3 rounded-lg border transition-all cursor-pointer"
          :class="
            isOpportunitySelected(op.id)
              ? 'border-blue-500 bg-blue-50/40 shadow-sm'
              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/70'
          "
          @click="selectedOpportunityId = op.id"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div class="space-y-1 min-w-0">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  {{ op.numberCode }}
                </span>
                <h4 class="font-bold text-slate-900 text-xs">{{ op.title }}</h4>
                <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {{ op.technicalField }}
                </span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                  {{ op.potentialValue }}
                </span>
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  :class="
                    op.recommendation === '优先布局'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  "
                >
                  {{ op.recommendation }}
                </span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug">
                {{ op.description }}
              </p>
            </div>

            <!-- 指标徽章：竞争/空白度 + 机会指数 -->
            <div class="flex items-center gap-3 shrink-0 sm:self-center">
              <div class="text-right">
                <span class="text-[9px] text-slate-400 block font-medium">竞争 / 空白度</span>
                <span class="text-[11px] font-semibold text-slate-700">
                  {{ op.competitionIntensity }} /
                  <strong class="text-emerald-600 ml-1">{{ op.whiteSpaceDegree }}</strong>
                </span>
              </div>
              <div class="text-right">
                <span class="text-[9px] text-slate-400 block font-medium">机会指数</span>
                <span class="text-xs font-extrabold font-mono text-blue-600">{{ op.opportunityScore }}</span>
              </div>
              <ChevronRight
                class="w-3.5 h-3.5 transition-transform"
                :class="isOpportunitySelected(op.id) ? 'text-blue-600 rotate-90' : 'text-slate-300'"
              />
            </div>
          </div>

          <!-- 选中行内展开：AI 交底书权利要求建议切入点 (Target Claims) -->
          <div v-if="isOpportunitySelected(op.id)" class="mt-3 pt-3 border-t border-blue-200/70 space-y-2.5 animate-in fade-in">
            <div class="p-3 bg-white rounded-lg border border-blue-200 text-xs space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                  <FileEdit class="w-3 h-3 text-blue-600" />
                  <span>AI交底书权利要求建议切入点 (Target Claims)</span>
                </span>
                <span class="text-[10px] text-slate-400 font-mono text-right">
                  建议申报窗口：{{ op.suggestedFilingWindow }}
                </span>
              </div>

              <div class="space-y-1 pt-0.5">
                <div
                  v-for="(claim, cIdx) in op.targetClaims"
                  :key="cIdx"
                  class="flex items-start gap-1.5 text-slate-700 text-[11px]"
                >
                  <span class="font-mono text-blue-600 font-bold shrink-0">Claim {{ cIdx + 1 }}:</span>
                  <span>{{ claim }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2 text-[11px]">
              <span class="text-slate-500">
                建议申请形式：<strong class="text-slate-700">发明专利 + 实用新型同日申请 (双跨策略)</strong>
              </span>
              <button
                type="button"
                class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                @click.stop="handleAddToBacklog(op.title)"
              >
                <Plus class="w-3 h-3" />
                <span>加入立项交底清单</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
