<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  FileCheck2,
  FileSearch,
  Filter,
  HelpCircle,
  UserCheck,
  Users,
  Wallet,
  XCircle
} from 'lucide-vue-next'
import type { QualificationCheckItem } from '@/data/bidConsultantData'

interface Props {
  qualifications: QualificationCheckItem[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

type ItemStatus = '已满足' | '待确认' | '不满足'

const qualifications = ref<QualificationCheckItem[]>(props.qualifications)
const filterCategory = ref<string>('all')
const filterStatus = ref<string>('all')

const categories = ['all', '企业资质', '企业业绩', '人员要求', '财务要求', '其他要求']

const getCategoryIcon = (category: string): Component => {
  switch (category) {
    case '企业资质':
      return Building
    case '企业业绩':
      return Briefcase
    case '人员要求':
      return Users
    case '财务要求':
      return Wallet
    default:
      return FileCheck2
  }
}

const handleToggleStatus = (id: string, newStatus: ItemStatus) => {
  qualifications.value = qualifications.value.map((item) => {
    if (item.id === id) {
      let newRisk = item.riskLevel
      if (newStatus === '已满足') newRisk = 'low'
      else if (newStatus === '待确认') newRisk = 'medium'
      else newRisk = 'high'
      return { ...item, status: newStatus, riskLevel: newRisk }
    }
    return item
  })
}

const filteredItems = computed(() =>
  qualifications.value.filter((item) => {
    if (filterCategory.value !== 'all' && item.category !== filterCategory.value) return false
    if (filterStatus.value !== 'all' && item.status !== filterStatus.value) return false
    return true
  })
)

const pendingCount = computed(() => qualifications.value.filter((q) => q.status === '待确认').length)
const satisfiedCount = computed(() => qualifications.value.filter((q) => q.status === '已满足').length)
const unsatisfiedCount = computed(() => qualifications.value.filter((q) => q.status === '不满足').length)
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Top Advisory Bento Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <UserCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-bold text-slate-900">第二步：投标资格审查（硬性准入门槛）</h2>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                实质性准入
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              识别所有“必须满足”的实质性资格条件。未明确满足项均标为「待确认」，绝不盲目假设已满足。
            </p>
          </div>
        </div>

        <!-- Bento KPI tiles -->
        <div class="flex items-center gap-2 self-stretch sm:self-auto">
          <div class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <span class="text-[10px] text-emerald-700 font-bold uppercase block">已满足</span>
            <span class="text-sm font-bold text-emerald-800">{{ satisfiedCount }} 项</span>
          </div>
          <div class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-100 text-center">
            <span class="text-[10px] text-amber-700 font-bold uppercase block">待确认</span>
            <span class="text-sm font-bold text-amber-800">{{ pendingCount }} 项</span>
          </div>
          <div class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-red-50 border border-red-100 text-center">
            <span class="text-[10px] text-red-700 font-bold uppercase block">不满足</span>
            <span class="text-sm font-bold text-red-800">{{ unsatisfiedCount }} 项</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bento Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Filter class="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
        <button
          v-for="cat in categories"
          :key="cat"
          @click="filterCategory = cat"
          :class="filterCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          class="px-3 py-1 rounded-lg text-xs font-bold transition-colors"
        >
          {{ cat === 'all' ? '全部要素' : cat }}
        </button>
      </div>

      <div class="flex items-center gap-1 text-xs">
        <button
          @click="filterStatus = 'all'"
          :class="filterStatus === 'all' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'"
          class="px-2.5 py-1 rounded-lg font-semibold"
        >
          全部状态
        </button>
        <button
          @click="filterStatus = '待确认'"
          :class="filterStatus === '待确认' ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:text-amber-700'"
          class="px-2.5 py-1 rounded-lg font-bold"
        >
          仅待确认
        </button>
      </div>
    </div>

    <!-- Qualification Items Table Card -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
              <th class="py-3.5 px-4 w-[12%]">审查维度</th>
              <th class="py-3.5 px-4 w-[35%]">招标硬性要求</th>
              <th class="py-3.5 px-4 w-[16%]">企业是否满足</th>
              <th class="py-3.5 px-4 w-[10%] text-center">风险等级</th>
              <th class="py-3.5 px-4 w-[27%]">需要补充材料 / 原文依据</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-slate-50/60 transition-colors">
              <!-- Category -->
              <td class="py-4 px-4 align-top">
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <component :is="getCategoryIcon(item.category)" class="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{{ item.category }}</span>
                </div>
              </td>

              <!-- Requirement -->
              <td class="py-4 px-4 align-top">
                <p class="font-semibold text-slate-900 leading-relaxed text-xs sm:text-sm">
                  {{ item.requirement }}
                </p>
              </td>

              <!-- Status with interactive switcher -->
              <td class="py-4 px-4 align-top">
                <div class="inline-flex flex-col gap-1.5">
                  <div class="flex items-center gap-1">
                    <span v-if="item.status === '已满足'" class="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 class="w-3 h-3" />
                      已满足
                    </span>
                    <span v-else-if="item.status === '待确认'" class="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs flex items-center gap-1">
                      <HelpCircle class="w-3 h-3" />
                      待确认
                    </span>
                    <span v-else class="px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 font-bold text-xs flex items-center gap-1">
                      <XCircle class="w-3 h-3" />
                      不满足
                    </span>
                  </div>

                  <!-- Interactive fast switch -->
                  <div class="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>核对:</span>
                    <button
                      @click="handleToggleStatus(item.id, '已满足')"
                      class="hover:text-emerald-600 underline decoration-dotted font-medium"
                    >
                      已足
                    </button>
                    <span>/</span>
                    <button
                      @click="handleToggleStatus(item.id, '待确认')"
                      class="hover:text-amber-600 underline decoration-dotted font-medium"
                    >
                      待查
                    </button>
                    <span>/</span>
                    <button
                      @click="handleToggleStatus(item.id, '不满足')"
                      class="hover:text-red-600 underline decoration-dotted font-medium"
                    >
                      不足
                    </button>
                  </div>
                </div>
              </td>

              <!-- Risk Level Badge -->
              <td class="py-4 px-4 align-top text-center">
                <span v-if="item.riskLevel === 'high'" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  🔴 高
                </span>
                <span v-else-if="item.riskLevel === 'medium'" class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  🟡 中
                </span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🟢 低
                </span>
              </td>

              <!-- Supplement Needed + Source quote -->
              <td class="py-4 px-4 align-top space-y-2">
                <div class="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span class="font-bold text-amber-700 block mb-0.5">
                    【所需材料】：
                  </span>
                  {{ item.supplementNeeded }}
                </div>

                <div
                  v-if="item.sourceQuote"
                  class="text-[11px] text-slate-600 italic bg-blue-50/60 p-2 rounded-lg border border-blue-100 flex items-start gap-1"
                >
                  <FileSearch class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{{ item.sourceQuote }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between pt-2">
      <button
        @click="$emit('prev-step')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>返回：项目概览</span>
      </button>

      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>下一步：废标风险识别</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
