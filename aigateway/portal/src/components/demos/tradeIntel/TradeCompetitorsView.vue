<script setup lang="ts">
// AI 竞争对手与市场格局情报 —— 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/CompetitorIntelligenceView.tsx
import { ref } from 'vue'
import { Swords, Sparkles, ArrowRight } from 'lucide-vue-next'
import { mockCompetitors } from '@/data/tradeIntelData'
import type { CompetitorItem } from '@/data/tradeIntelData'

const selectedCompetitor = ref<CompetitorItem>(mockCompetitors[0])

const strategicRecommendations = [
  {
    title: '1. 突显 35%-45% 的源头制造成本与渠道利润优势',
    desc: '北美头部品牌渠道加价率普遍高达 60%-100%，中国高品质系统门窗能为当地经销商提供翻倍的毛利空间。',
    action: '在开发信中直接提供典型户型窗型价格对比清单。',
  },
  {
    title: '2. 击穿北美本土 12-16 周的超长交货周期痛点',
    desc: '北美本地供应链因产能短缺交期居高不下。以 25-30 天敏捷排产+海运快线，有效抢占中短期工程急单。',
    action: '承诺急单生产专线与违约赔付协议。',
  },
  {
    title: '3. 极窄边框现代全景极简设计的差异化定制',
    desc: '欧美传统品牌多以厚重塑钢或标准木铝为主，中国在 20mm 极窄全景推拉门工艺上更具前沿美学设计优势。',
    action: '发送极窄系统实景高端豪宅工程案例视频。',
  },
  {
    title: '4. 完备的 NFRC / AAMA / Title 24 权威认证背书',
    desc: '打消海外买家对中国产品质量的顾虑，提前准备好第三方实验室抗风压、水密性与U-Value测试报告。',
    action: '在材料包中附上可在线查验的官方证书编号。',
  },
  {
    title: '5. 灵活的最小起订量 (Low MOQ) 与打样支持',
    desc: '欧美大厂对定制产品起订量苛刻，提供 1 套起样与免费实物切角样块，大幅降低客户首次试单心理门槛。',
    action: '4个工作日内免费空运实物切角样箱至客户办公室。',
  },
]
</script>

<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- 1. Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">AI 竞争对手与市场格局情报</h2>
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            市场竞争格局分析
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          深度剖析北美及欧洲核心门窗巨头（Andersen, Pella, Schüco）的定价、渠道布局与交付短板
        </p>
      </div>

      <div class="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2 shadow-xs">
        <Swords class="w-4 h-4 text-blue-600" />
        <span>已追踪 {{ mockCompetitors.length }} 家核心主导品牌</span>
      </div>
    </div>

    <!-- 2. Competitors Comparison Matrix Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
          北美市场核心主流品牌多维对比矩阵
        </h3>
        <span class="text-[10px] text-slate-400">点击行可高亮查看</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
              <th class="p-3.5">竞争品牌</th>
              <th class="p-3.5">主要市场</th>
              <th class="p-3.5">价格定位</th>
              <th class="p-3.5">市场份额</th>
              <th class="p-3.5">核心优势</th>
              <th class="p-3.5 text-amber-800">交付短板 / 买家痛点</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="comp in mockCompetitors"
              :key="comp.id"
              @click="selectedCompetitor = comp"
              class="hover:bg-slate-50 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50/60': comp.id === selectedCompetitor.id }"
            >
              <td class="p-3.5">
                <div class="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{{ comp.name }}</span>
                  <span v-if="comp.id === selectedCompetitor.id" class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ comp.country }}</div>
              </td>

              <td class="p-3.5 text-slate-700">{{ comp.country }}</td>

              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                  {{ comp.priceRange }}
                </span>
              </td>

              <td class="p-3.5 font-mono font-bold text-blue-600">{{ comp.marketShare }}</td>

              <td class="p-3.5 text-slate-600 max-w-xs">
                <ul class="list-disc pl-3 space-y-0.5 text-[11px]">
                  <li v-for="(adv, ai) in comp.coreAdvantages.slice(0, 2)" :key="ai">{{ adv }}</li>
                </ul>
              </td>

              <td class="p-3.5 text-amber-900 font-medium max-w-xs">
                <ul class="list-disc pl-3 space-y-0.5 text-[11px]">
                  <li v-for="(wk, wi) in comp.weaknesses" :key="wi">{{ wk }}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. AI Strategic Breakthrough Advice -->
    <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-200">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-blue-600" />
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
            AI 推荐：针对海外竞争格局的 5 大突围策略 (破局方案)
          </h3>
        </div>
        <span class="text-[10px] text-blue-600 font-mono font-bold tracking-wider">WINNING STRATEGIES</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(rec, idx) in strategicRecommendations"
          :key="idx"
          class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
        >
          <div class="space-y-1">
            <h4 class="text-xs font-bold text-slate-900 leading-snug">
              {{ rec.title }}
            </h4>
            <p class="text-[11px] text-slate-600 leading-relaxed">
              {{ rec.desc }}
            </p>
          </div>

          <div class="pt-2 border-t border-slate-200 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
            <ArrowRight class="w-3 h-3 text-emerald-600 shrink-0" />
            <span>建议行动：{{ rec.action }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
