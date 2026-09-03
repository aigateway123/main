<!-- ============================================================================
     AI 法务员工 · 工作台顶栏（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/layout/Header.tsx
     左侧：品牌徽标 + 企业主体切换下拉（MOCK_ENTERPRISE_PROFILES 10 家 + 风险徽章）
     右侧：全局搜索（回车按关键词路由）/ AI 实时待命指示 / 通知中心（4 条）/ 新建法务任务 CTA
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Building2, ChevronDown, Plus, Search, Sparkles } from 'lucide-vue-next'
import type { EnterpriseProfile, LegalView } from '@/data/legalIntelData'
import { MOCK_ENTERPRISE_PROFILES } from '@/data/legalMockData'

const props = defineProps<{
  currentEnterprise: EnterpriseProfile
}>()

const emit = defineEmits<{
  (e: 'open-new-task'): void
  (e: 'navigate', view: LegalView): void
  (e: 'select-enterprise', p: EnterpriseProfile): void
}>()

// 企业下拉 / 通知下拉 / 搜索词（本地状态，照原型 Header）
const companyDropdownOpen = ref(false)
const notifOpen = ref(false)
const searchQuery = ref('')

// 全局搜索路由（照原型 App.tsx handleGlobalSearch 关键词规则）
const submitSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return
  if (q.includes('法') || q.includes('规') || q.includes('赔偿') || q.includes('限制')) {
    emit('navigate', 'regulation-search')
  } else if (q.includes('合规') || q.includes('排查')) {
    emit('navigate', 'enterprise-compliance')
  } else {
    emit('navigate', 'contract-management')
  }
}

// 切换演示企业主体
const pickEnterprise = (ent: EnterpriseProfile) => {
  emit('select-enterprise', ent)
  companyDropdownOpen.value = false
}

// 企业风险等级徽章配色（高 rose / 中等 amber / 低 emerald）
const riskBadgeClass = (level: EnterpriseProfile['riskLevel']): string => {
  if (level === '高') return 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
  if (level === '中等') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
  return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
}
</script>

<template>
  <header
    class="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0"
  >
    <!-- 左侧：平台标题与当前企业主体 -->
    <div class="flex items-center gap-3 min-w-0">
      <div class="flex items-center gap-2 shrink-0">
        <div
          class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold italic text-sm"
        >
          XX
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-white text-sm tracking-tight">AI法务员工</span>
            <span
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-600/15 text-blue-400 border border-blue-500/25"
            >
              <Sparkles class="w-3 h-3 text-blue-400" />
              企业法律风险智能管理平台
            </span>
          </div>
        </div>
      </div>

      <div class="hidden lg:block h-4 w-px bg-slate-800 mx-2 shrink-0" />

      <!-- 当前企业选择器（10 家演示企业库） -->
      <div class="relative hidden md:block">
        <button
          type="button"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          @click="companyDropdownOpen = !companyDropdownOpen"
        >
          <Building2 class="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span class="max-w-[180px] truncate">{{ currentEnterprise.name }}</span>
          <span
            class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30"
          >
            风险: {{ currentEnterprise.riskScore }}分
          </span>
          <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        <div
          v-if="companyDropdownOpen"
          class="absolute top-full left-0 mt-1.5 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div class="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            切换演示企业主体 (10家企业库)
          </div>
          <div class="max-h-64 overflow-y-auto divide-y divide-slate-800">
            <button
              v-for="ent in MOCK_ENTERPRISE_PROFILES"
              :key="ent.id"
              type="button"
              class="w-full text-left px-3 py-2.5 hover:bg-slate-800 transition-colors flex items-start justify-between gap-2 cursor-pointer"
              :class="ent.id === currentEnterprise.id ? 'bg-blue-600/20 font-semibold text-white' : 'text-slate-200'"
              @click="pickEnterprise(ent)"
            >
              <div class="min-w-0">
                <div class="text-xs font-medium line-clamp-1">{{ ent.name }}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  {{ ent.industry }} · {{ ent.employees }}人
                </div>
              </div>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                :class="riskBadgeClass(ent.riskLevel)"
              >
                {{ ent.riskLevel }}风险
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：搜索 / AI 状态 / 通知 / 新建任务 -->
    <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">
      <!-- 全局搜索输入（回车触发路由跳转） -->
      <form class="relative hidden sm:block" @submit.prevent="submitSearch">
        <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索合同、条款、法规、风险..."
          class="w-48 md:w-64 pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-slate-900 transition-all"
        />
      </form>

      <!-- AI 实时待命指示 -->
      <div
        class="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>AI 实时待命审查中</span>
      </div>

      <!-- 通知中心下拉（法务风险与监控提醒，照原型 4 条文案） -->
      <div class="relative">
        <button
          type="button"
          class="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="通知中心"
          @click="notifOpen = !notifOpen"
        >
          <Bell class="w-4 h-4" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900"></span>
        </button>

        <div
          v-if="notifOpen"
          class="absolute right-0 top-full mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div class="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
            <div class="font-semibold text-xs text-slate-200">法务风险与监控提醒 (4条)</div>
            <span class="text-[10px] text-blue-400 font-medium cursor-pointer hover:underline">
              全部标为已读
            </span>
          </div>
          <div class="divide-y divide-slate-800 max-h-72 overflow-y-auto">
            <div class="px-4 py-2.5 hover:bg-slate-800/60 transition-colors">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                高风险合同待复核
              </div>
              <div class="text-[11px] text-slate-300 mt-1">
                《设备采购合同》发现3项P0级高风险（预付款70%且无保函）。
              </div>
              <div class="text-[10px] text-slate-500 mt-1">10分钟前 · AI初审出具</div>
            </div>

            <div class="px-4 py-2.5 hover:bg-slate-800/60 transition-colors">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                合同即将到期预警
              </div>
              <div class="text-[11px] text-slate-300 mt-1">
                《二期厂房租赁合同》仅剩27天届满，需提前出具续租通知。
              </div>
              <div class="text-[10px] text-slate-500 mt-1">1小时前 · 履约监控</div>
            </div>

            <div class="px-4 py-2.5 hover:bg-slate-800/60 transition-colors">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                海外新规情报入库
              </div>
              <div class="text-[11px] text-slate-300 mt-1">
                欧盟新电池法碳足迹核查指南已收录入企业法务知识库。
              </div>
              <div class="text-[10px] text-slate-500 mt-1">4小时前 · 法规同步</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA: 新建法务任务 -->
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide shadow-sm transition-all active:scale-95 cursor-pointer"
        @click="emit('open-new-task')"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>新建法务任务</span>
      </button>
    </div>
  </header>
</template>
