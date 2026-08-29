<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ShieldAlert,
  FileText,
  Bot,
  Building2,
  UploadCloud,
  Printer,
  Layers,
  ChevronDown
} from 'lucide-vue-next'
import type { TenderAnalysisResult, CompanyProfile } from '@/data/bidConsultantData'

interface Props {
  currentTender: TenderAnalysisResult
  allTenders: Record<string, TenderAnalysisResult>
  activeCompany: CompanyProfile
  isChatOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select-tender', id: string): void
  (e: 'open-upload-modal'): void
  (e: 'open-company-modal'): void
  (e: 'toggle-chat'): void
}>()

const dropdownOpen = ref(false)

const tenderList = computed(() => Object.values(props.allTenders))

const printReport = () => window.print()
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- Brand Logo & Name -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 rounded-xl bg-blue-600 shadow-sm flex items-center justify-center text-white shrink-0">
          <ShieldAlert class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-base tracking-tight text-slate-900">
              AI 投标作战指挥中心
            </span>
            <span class="px-2 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              Tender Copilot Pro
            </span>
          </div>
          <p class="text-xs text-slate-500 font-medium hidden sm:block">
            中小企业招投标全流程实战决策与控险平台
          </p>
        </div>
      </div>

      <!-- Project Selector & Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Active Tender Selector -->
        <div class="relative">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium transition-all max-w-[200px] sm:max-w-[280px] shadow-sm"
          >
            <FileText class="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span class="truncate text-left font-semibold text-slate-900">
              {{ currentTender?.overview?.projectName || '当前项目' }}
            </span>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          <template v-if="dropdownOpen">
            <div class="fixed inset-0 z-40" @click="dropdownOpen = false" />
            <div class="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div class="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                切换招投标示范案例
              </div>
              <button
                v-for="t in tenderList"
                :key="t.id"
                @click="emit('select-tender', t.id); dropdownOpen = false"
                class="w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5"
                :class="t.id === currentTender?.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                  : 'hover:bg-slate-50 text-slate-700'"
              >
                <Layers class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div class="font-bold text-slate-900 line-clamp-1">{{ t?.overview?.projectName || '示范项目' }}</div>
                  <div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span class="text-emerald-600 font-semibold">{{ t?.overview?.budget || '预算待定' }}</span>
                    <span>•</span>
                    <span>{{ t?.overview?.projectType || '综合采购' }}</span>
                  </div>
                </div>
              </button>
              <div class="border-t border-slate-100 mt-2 pt-2">
                <button
                  @click="dropdownOpen = false; emit('open-upload-modal')"
                  class="w-full py-2 px-3 text-xs font-bold text-center text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
                >
                  <UploadCloud class="w-3.5 h-3.5" />
                  上传解析全新招标文件...
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Upload Button -->
        <button
          @click="emit('open-upload-modal')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          title="上传新标书进行解析"
        >
          <UploadCloud class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">导入标书</span>
        </button>

        <!-- Company Profile Button -->
        <button
          @click="emit('open-company-modal')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
          title="查看或修改当前企业资质库"
        >
          <Building2 class="w-3.5 h-3.5 text-indigo-600" />
          <span class="hidden md:inline truncate max-w-[120px]">
            {{ activeCompany.companyName }}
          </span>
        </button>

        <!-- Print Report -->
        <button
          @click="printReport"
          class="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors hidden sm:flex shadow-sm"
          title="打印或导出作战报告"
        >
          <Printer class="w-4 h-4" />
        </button>

        <!-- AI Consultant Chat Toggle -->
        <button
          @click="emit('toggle-chat')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          :class="isChatOpen
            ? 'bg-blue-600 text-white shadow-blue-500/20'
            : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800'"
        >
          <Bot class="w-3.5 h-3.5 text-blue-600" />
          <span>AI 顾问问答</span>
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
        </button>
      </div>
    </div>
  </header>
</template>
