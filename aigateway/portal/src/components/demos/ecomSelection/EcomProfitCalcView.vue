<script setup lang="ts">
// ============================================================================
// 跨境电商 · AI 跨境电商选品情报员 —— 独立利润测算页包装
// 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/profit/StandaloneProfitCalcView.tsx
// 顶部页眉 + 直接复用共享 EcomProfitSimulator（不传 seed，使用其默认宠物随行杯参数）
// ============================================================================
import { Calculator } from 'lucide-vue-next'
import EcomProfitSimulator from './EcomProfitSimulator.vue'
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
    <!-- Header -->
    <div class="pb-4 border-b border-slate-800">
      <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
        <Calculator class="w-3.5 h-3.5" />
        <span>跨境电商高精度财务与回本测算器</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        AI 利润测算与销量敏感度模拟 (Profit Simulator)
      </h1>
      <p class="text-xs text-slate-400 mt-1">
        动态测算头程、FBA 配送、PPC 广告打通、退货损耗与资金周转回报率
      </p>
    </div>

    <!-- 共享利润测算器（默认参数：便携防漏大容量宠物随行水杯） -->
    <EcomProfitSimulator />
  </div>
</template>
