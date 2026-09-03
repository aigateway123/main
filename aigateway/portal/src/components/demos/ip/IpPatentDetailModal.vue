<script setup lang="ts">
// 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/PatentDetailModal.tsx
import { computed } from 'vue'
import { X, Sparkles, CheckCircle2 } from 'lucide-vue-next'
import type { Patent } from '@/data/ipIntelData'

const props = defineProps<{ patent: Patent }>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 国家代码 → 受理局名称（emoji + 简称，与原型一致）
const getCountryFlag = (country: string): string => {
  switch (country) {
    case 'CN':
      return '🇨🇳 中国 (CNIPA)'
    case 'US':
      return '🇺🇸 美国 (USPTO)'
    case 'EP':
      return '🇪🇺 欧洲 (EPO)'
    case 'JP':
      return '🇯🇵 日本 (JPO)'
    case 'WO':
      return '🌐 PCT国际 (WIPO)'
    default:
      return country
  }
}

// 风险等级 → 徽章配色 + 文案（高侵权风险 / 中度风险 / 低风险）
const riskBadge = (level: Patent['riskLevel']): { cls: string; label: string } => {
  if (level === 'high') {
    return { cls: 'bg-rose-100 text-rose-700 border border-rose-200', label: '高侵权风险' }
  }
  if (level === 'medium') {
    return { cls: 'bg-amber-100 text-amber-700 border border-amber-200', label: '中度风险' }
  }
  return { cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', label: '低风险' }
}

const riskMeta = computed(() => riskBadge(props.patent.riskLevel))

// 加入重点监控（Demo：仅弹提示）
const handleWatch = () => {
  alert(`已将专利 ${props.patent.patentNumber} 加入重点监控清单`)
}
</script>

<template>
  <Teleport to="body">
    <!-- 固定遮罩：点击遮罩空白处关闭 -->
    <div
      class="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto"
      >
        <!-- Header：专利号 / 国家 / 风险 + 标题 + 关闭按钮 -->
        <div
          class="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50/80 rounded-t-2xl shrink-0"
        >
          <div class="space-y-1.5 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {{ patent.patentNumber }}
              </span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {{ getCountryFlag(patent.country) }}
              </span>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full" :class="riskMeta.cls">
                {{ riskMeta.label }}
              </span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight break-words">
              {{ patent.title }}
            </h2>
          </div>

          <button
            type="button"
            title="关闭"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content：内部滚动区 -->
        <div class="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          <!-- 基础元数据条目 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">申请人</span>
              <span class="font-bold text-slate-800 mt-0.5 block truncate" :title="patent.applicant">
                {{ patent.applicant }}
              </span>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">申请日期</span>
              <span class="font-bold text-slate-800 font-mono mt-0.5 block">
                {{ patent.applicationDate }}
              </span>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">公开/授权日</span>
              <span class="font-bold text-slate-800 font-mono mt-0.5 block">
                {{ patent.publicationDate }}
              </span>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block font-medium">法律状态</span>
              <span class="font-bold text-emerald-700 mt-0.5 block">
                {{ patent.legalStatus }}
              </span>
            </div>
          </div>

          <!-- AI专利摘要 -->
          <div class="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
            <h3 class="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-blue-600" />
              <span>AI专利摘要</span>
            </h3>
            <p class="text-xs text-slate-800 leading-relaxed font-medium">
              {{ patent.aiSummary }}
            </p>
            <p class="text-[11px] text-slate-500 pt-1 border-t border-blue-200/50">
              <strong>专利公开摘要：</strong>{{ patent.abstract }}
            </p>
          </div>

          <!-- AI技术特征提取与权利要求要素 -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>AI技术特征提取与权利要求要素</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(feat, idx) in patent.technicalFeatures"
                :key="idx"
                class="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-2.5"
              >
                <span
                  class="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-xs"
                >
                  {{ String(idx + 1).padStart(2, '0') }}
                </span>
                <div class="min-w-0">
                  <span class="text-[11px] font-semibold text-slate-400 block">技术特征 {{ idx + 1 }}</span>
                  <span class="text-xs font-bold text-slate-800 mt-0.5 block break-words">
                    {{ feat }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 权利要求价值条 -->
          <div
            class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
          >
            <span class="text-slate-500">
              独立权利要求数：<strong>{{ patent.claimCount }} 项</strong>
            </span>
            <span class="text-slate-500">
              被引证频次：<strong class="font-mono">{{ patent.citedCount }} 次</strong>
            </span>
            <span class="text-slate-500">
              核心技术权重：<strong class="text-blue-600">{{ patent.isCorePatent ? '核心专利族' : '常规外围专利' }}</strong>
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-3 border-t border-slate-200 bg-slate-50/80 rounded-b-2xl flex items-center justify-between gap-3 shrink-0"
        >
          <span class="text-[11px] text-slate-400">
            Demo数据 · 仅用于产品演示与技术比对
          </span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              @click="emit('close')"
            >
              关闭
            </button>
            <button
              type="button"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              @click="handleWatch"
            >
              加入监控
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
