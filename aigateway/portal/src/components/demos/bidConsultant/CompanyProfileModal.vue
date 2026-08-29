<script setup lang="ts">
import { computed } from 'vue'
import { X, Building2, Check } from 'lucide-vue-next'
import type { CompanyProfile } from '@/data/bidConsultantData'
import { SAMPLE_COMPANY_PROFILES } from '@/data/bidConsultantData'

interface Props {
  isOpen: boolean
  activeCompany: CompanyProfile
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select-company', company: CompanyProfile): void
}>()

const companyList = computed(() => Object.values(SAMPLE_COMPANY_PROFILES))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Close -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Title -->
        <div class="mb-6">
          <div class="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Building2 class="w-4 h-4" />
            <span>企业能力与资质库管理</span>
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">
            选择或配置投标主体企业画像
          </h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            系统将根据选定企业的资质、人员、同类业绩及财务状况，实时执行能力匹配与资格比对。
          </p>
        </div>

        <!-- Preset Profiles Selection -->
        <div class="space-y-3.5 overflow-y-auto flex-1 pr-1">
          <div class="text-xs font-bold text-slate-400 uppercase">
            可选示范企业画像（点击切换）：
          </div>

          <div
            v-for="company in companyList"
            :key="company.companyName"
            @click="emit('select-company', company); emit('close')"
            class="p-5 rounded-2xl border cursor-pointer transition-all"
            :class="activeCompany.companyName === company.companyName
              ? 'bg-indigo-600/15 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800'"
          >
            <div class="flex items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                  {{ company.companyName.slice(0, 2) }}
                </div>
                <div>
                  <h4 class="font-bold text-slate-100 text-sm">{{ company.companyName }}</h4>
                  <span class="text-[11px] text-slate-400">{{ company.industry }} • 注册资本 {{ company.registeredCapital }}</span>
                </div>
              </div>

              <span
                v-if="activeCompany.companyName === company.companyName"
                class="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1"
              >
                <Check class="w-3.5 h-3.5" />
                当前选用
              </span>
            </div>

            <!-- Tags -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <span class="text-slate-500 block text-[10px]">核心资质与认证：</span>
                <span class="line-clamp-1">{{ company.certifications.join('、') }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <span class="text-slate-500 block text-[10px]">人员配置：</span>
                <span class="line-clamp-1">{{ company.personnel.map((p) => `${p.name}(${p.role})`).join('、') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-4 border-t border-slate-800 flex items-center justify-end mt-4">
          <button
            @click="emit('close')"
            class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
