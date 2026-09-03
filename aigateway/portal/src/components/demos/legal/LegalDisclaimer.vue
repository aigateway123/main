<!-- ============================================================================
     AI 法务员工 · 免责声明（banner / footer 两态）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/common/LegalDisclaimer.tsx
     文案取自 legalMockData.LEGAL_DISCLAIMER_TEXT（与原型逐字一致）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next'
import { LEGAL_DISCLAIMER_TEXT } from '@/data/legalMockData'

withDefaults(
  defineProps<{
    variant?: 'banner' | 'footer'
  }>(),
  { variant: 'banner' },
)
</script>

<template>
  <!-- footer 形态：视图流末尾全局页脚 -->
  <footer
    v-if="variant === 'footer'"
    class="border-t border-slate-800 bg-slate-900/40 px-6 py-4 text-xs text-slate-400"
  >
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 max-w-7xl mx-auto">
      <div class="flex items-center gap-2">
        <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0" />
        <span class="font-medium text-slate-300">法律合规声明：</span>
        <span>{{ LEGAL_DISCLAIMER_TEXT }}</span>
      </div>
      <div class="text-slate-500 shrink-0">
        XX AI · AI法务员工 v3.2 Enterprise Edition
      </div>
    </div>
  </footer>

  <!-- banner 形态：首页顶部法律提示横幅 -->
  <div
    v-else
    class="flex items-start gap-2.5 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-normal"
  >
    <ShieldAlert class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
    <div>
      <span class="font-semibold text-amber-300 mr-1">【法律提示】</span>
      {{ LEGAL_DISCLAIMER_TEXT }}
    </div>
  </div>
</template>
