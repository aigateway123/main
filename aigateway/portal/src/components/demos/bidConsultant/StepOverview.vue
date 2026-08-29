<script setup lang="ts">
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  Flame,
  Scale,
  Sparkles,
  Target
} from 'lucide-vue-next'
import type { ProjectOverview } from '@/data/bidConsultantData'

interface Props {
  overview: ProjectOverview
}

defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
}>()
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Bento Top Header & Core Summary Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles class="w-3.5 h-3.5" />
            <span>项目核心概览与作战画像</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {{ overview.projectName }}
          </h2>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
            预算: {{ overview.budget }}
          </span>
          <span class="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
            {{ overview.evaluationMethod }}
          </span>
        </div>
      </div>

      <!-- 4-Column Bento Metric Tiles -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-4">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">招标人 / 采购单位</p>
          <p class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">{{ overview.tenderer }}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">项目类型</p>
          <p class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{{ overview.projectType }}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">评标方式</p>
          <p class="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">{{ overview.evaluationMethod }}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">投标保证金</p>
          <p class="text-xs sm:text-sm font-bold text-amber-600 mt-0.5">{{ overview.bidBond }}</p>
        </div>
      </div>

      <!-- The Bento Core Summary Quote Block -->
      <div class="p-4 rounded-xl bg-blue-50/80 border-l-4 border-blue-500">
        <span class="text-xs font-bold text-blue-900 block mb-1">
          【项目画像 &amp; 核心竞争要点洞察】：
        </span>
        <p class="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
          &quot;{{ overview.coreSummary }}&quot;
        </p>
      </div>

      <!-- Quick Deadline Badges -->
      <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
        <div class="flex items-center gap-1.5 text-slate-600">
          <Clock class="w-3.5 h-3.5 text-red-500" />
          <span class="font-semibold text-slate-800">截标时间:</span>
          <span class="font-mono text-red-600 font-bold">{{ overview.submissionDeadline }}</span>
        </div>
        <span class="text-slate-300">•</span>
        <div class="flex items-center gap-1.5 text-slate-600">
          <Calendar class="w-3.5 h-3.5 text-emerald-600" />
          <span class="font-semibold text-slate-800">服务周期:</span>
          <span>{{ overview.deliveryPeriod }}</span>
        </div>
        <span class="text-slate-300">•</span>
        <div class="flex items-center gap-1.5 text-slate-600 font-mono">
          <span>编号: {{ overview.projectCode }}</span>
        </div>
      </div>
    </div>

    <!-- Main Project Metadata Table Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FileCheck class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900">招标文件要素提取明细</h3>
            <p class="text-xs text-slate-500">严格从招标文件精准提取，无任何虚构</p>
          </div>
        </div>

        <div
          v-if="overview.sourceFile"
          class="text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 hidden sm:flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>数据源: {{ overview.sourceFile }}</span>
        </div>
      </div>

      <!-- Structured Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
              <th class="py-3 px-4 w-1/4">项目要素</th>
              <th class="py-3 px-4 w-3/4">招标文件提取内容</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Target class="w-4 h-4 text-blue-600" />
                项目名称
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-900">{{ overview.projectName }}</td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Building2 class="w-4 h-4 text-indigo-600" />
                招标人 / 采购单位
              </td>
              <td class="py-3.5 px-4 text-slate-800">{{ overview.tenderer }}</td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 font-mono">
                # 项目编号
              </td>
              <td class="py-3.5 px-4 font-mono text-blue-700 bg-blue-50/60 rounded inline-block my-1 px-2.5 py-0.5 border border-blue-100">
                {{ overview.projectCode }}
              </td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700">
                项目类型
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                  {{ overview.projectType }}
                </span>
              </td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Coins class="w-4 h-4 text-amber-600" />
                项目预算 / 控制价
              </td>
              <td class="py-3.5 px-4 font-bold text-blue-700 text-base">
                {{ overview.budget }}
              </td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Clock class="w-4 h-4 text-red-600" />
                投标截止时间
              </td>
              <td class="py-3.5 px-4 font-bold text-red-600 font-mono">
                {{ overview.submissionDeadline }}
              </td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-emerald-600" />
                开标时间及地点
              </td>
              <td class="py-3.5 px-4 text-slate-800">{{ overview.bidOpeningTime }}</td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700">
                服务 / 交付周期
              </td>
              <td class="py-3.5 px-4 text-slate-800">{{ overview.deliveryPeriod }}</td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Flame class="w-4 h-4 text-amber-500" />
                投标保证金
              </td>
              <td class="py-3.5 px-4 text-amber-700 font-semibold">
                {{ overview.bidBond }}
              </td>
            </tr>
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-700 flex items-center gap-2">
                <Scale class="w-4 h-4 text-blue-600" />
                评标方式
              </td>
              <td class="py-3.5 px-4 text-blue-700 font-semibold">{{ overview.evaluationMethod }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="overview.fileIntegrityNote"
        class="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2"
      >
        <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>{{ overview.fileIntegrityNote }}</span>
      </div>
    </div>

    <!-- Footer Next Button -->
    <div class="flex justify-end pt-2">
      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>下一步：投标资格审查</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
