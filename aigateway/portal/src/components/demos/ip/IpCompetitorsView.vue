<script setup lang="ts">
// ============================================================================
// 知识产权 · AI 知识产权顾问 —— 竞争对手专利情报视图
// 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/CompetitorAnalysisView.tsx
// 数据：MOCK_COMPETITORS（8 家）+ IP_TECHNICAL_FIELDS（8 大技术分支）
// 可视化：左侧 2D SVG 气泡矩阵（横轴 8 大技术分支 × 纵轴专利强度）+ tooltip 浮层
// ============================================================================
import { ref } from 'vue'
import { BarChart2, Info, Sparkles } from 'lucide-vue-next'
import { MOCK_COMPETITORS } from '@/data/ipMockData'
import { IP_TECHNICAL_FIELDS } from '@/data/ipIntelData'
import type { Competitor } from '@/data/ipIntelData'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'

// ---- SVG 二维矩阵尺寸（坐标/数值照原型） ----
const matrixWidth = 800
const matrixHeight = 360
const paddingLeft = 70
const paddingRight = 40
const paddingTop = 30
const paddingBottom = 60
const chartWidth = matrixWidth - paddingLeft - paddingRight
const chartHeight = matrixHeight - paddingTop - paddingBottom

// 横轴：按技术分支索引均分列中心 X
const getFieldX = (fieldIndex: number) => {
  return paddingLeft + (fieldIndex + 0.5) * (chartWidth / IP_TECHNICAL_FIELDS.length)
}

// 纵轴：专利布局强度 (0-100) 映射 Y（100 在顶部）
const getIntensityY = (intensity: number) => {
  return paddingTop + (1 - intensity / 100) * chartHeight
}

// ---- 交互状态 ----
// 当前选中企业（默认 CATL）
const selectedCompetitor = ref<Competitor>(MOCK_COMPETITORS[0])
// 图例/气泡 hover 高亮企业 id（null = 全部点亮）
const highlightedCompetitorId = ref<string | null>(null)
// 悬浮气泡 tooltip（含 SVG 用户坐标）
const hoveredBubble = ref<{ company: string; field: string; intensity: number; x: number; y: number } | null>(null)

type MatrixPos = Competitor['matrixPosition'][number]

const isHighlighted = (comp: Competitor) => {
  return !highlightedCompetitorId.value || highlightedCompetitorId.value === comp.id
}

const isSelectedComp = (comp: Competitor) => {
  return selectedCompetitor.value.id === comp.id
}

// 点击气泡 → 切换选定企业
const selectCompetitor = (comp: Competitor) => {
  selectedCompetitor.value = comp
}

// 图例 pill：点击 → 选定并高亮；hover → 仅高亮
const pickFromLegend = (comp: Competitor) => {
  selectedCompetitor.value = comp
  highlightedCompetitorId.value = comp.id
}

const clearHighlight = () => {
  highlightedCompetitorId.value = null
}

// 气泡 hover：高亮该企业并记录 tooltip 坐标
const onBubbleEnter = (comp: Competitor, pos: MatrixPos) => {
  highlightedCompetitorId.value = comp.id
  const fieldIndex = IP_TECHNICAL_FIELDS.indexOf(pos.field)
  if (fieldIndex === -1) return
  hoveredBubble.value = {
    company: comp.name,
    field: pos.field,
    intensity: pos.intensity,
    x: getFieldX(fieldIndex),
    y: getIntensityY(pos.intensity),
  }
}

const onBubbleLeave = () => {
  highlightedCompetitorId.value = null
  hoveredBubble.value = null
}

// 企业画像卡顶部的切换企业下拉
const onSwitchCompany = (e: Event) => {
  const found = MOCK_COMPETITORS.find((c) => c.id === (e.target as HTMLSelectElement).value)
  if (found) selectedCompetitor.value = found
}
</script>

<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 标题与简介 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
          <span>AI竞争对手专利情报</span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            覆盖 23 家竞争主体 · 重点深潜 8 家
          </span>
        </h2>
        <p class="text-[11px] text-slate-500 mt-0.5">
          横向对比全球头部储能与电池巨头专利储备、海外布局纵深与技术攻防重镇
        </p>
      </div>
    </div>

    <!-- 竞争对手专利地图 (2D Matrix Bubble Chart) -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div>
          <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart2 class="w-3.5 h-3.5 text-blue-600" />
            <span>竞争对手专利地图 (二维技术-强度矩阵)</span>
          </h3>
          <p class="text-[10px] text-slate-400 mt-0.5">
            横轴：8大核心技术领域 | 纵轴：专利布局强度 (0-100) | 气泡大小：专利密度与被引加权
          </p>
        </div>

        <!-- 交互图例 pills -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="comp in MOCK_COMPETITORS.slice(0, 5)"
            :key="comp.id"
            type="button"
            class="px-2 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 border cursor-pointer"
            :class="
              isSelectedComp(comp)
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            "
            @click="pickFromLegend(comp)"
            @mouseenter="highlightedCompetitorId = comp.id"
            @mouseleave="clearHighlight"
          >
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: comp.logoColor }"></span>
            <span>{{ comp.name.split(' ')[0] }}</span>
          </button>
        </div>
      </div>

      <!-- 2D SVG 气泡矩阵 -->
      <div class="relative overflow-x-auto select-none bg-slate-50/50 rounded-lg p-2 border border-slate-100">
        <svg
          viewBox="0 0 800 360"
          class="w-full min-w-[700px] h-auto overflow-visible font-sans"
        >
          <!-- 网格线与 Y 轴刻度 -->
          <g v-for="level in [0, 25, 50, 75, 100]" :key="level">
            <line
              :x1="paddingLeft"
              :y1="getIntensityY(level)"
              :x2="matrixWidth - paddingRight"
              :y2="getIntensityY(level)"
              stroke="#E2E8F0"
              :stroke-dasharray="level === 0 || level === 100 ? 'none' : '3 3'"
            />
            <text
              :x="paddingLeft - 10"
              :y="getIntensityY(level) + 3"
              text-anchor="end"
              class="text-[9px] fill-slate-400 font-mono font-medium"
            >
              {{ level }}
            </text>
          </g>

          <!-- Y 轴标签 -->
          <text
            transform="rotate(-90)"
            :x="-(matrixHeight / 2)"
            y="22"
            text-anchor="middle"
            class="text-[10px] fill-slate-500 font-semibold"
          >
            专利布局强度 (0 - 100)
          </text>

          <!-- 纵向分隔线 & X 轴技术分支标签 -->
          <g v-for="(field, idx) in IP_TECHNICAL_FIELDS" :key="field">
            <line
              :x1="getFieldX(idx)"
              y1="30"
              :x2="getFieldX(idx)"
              :y2="matrixHeight - paddingBottom"
              stroke="#F1F5F9"
            />
            <rect
              :x="getFieldX(idx) - 34"
              :y="matrixHeight - paddingBottom + 10"
              width="68"
              height="22"
              rx="4"
              class="fill-white stroke-slate-200"
            />
            <text
              :x="getFieldX(idx)"
              :y="matrixHeight - paddingBottom + 25"
              text-anchor="middle"
              class="text-[11px] fill-slate-800 font-bold"
            >
              {{ field }}
            </text>
          </g>

          <!-- 各企业气泡 -->
          <template v-for="comp in MOCK_COMPETITORS" :key="comp.id">
            <g
              v-for="pos in comp.matrixPosition"
              :key="`${comp.id}-${pos.field}`"
              class="cursor-pointer"
              @click="selectCompetitor(comp)"
              @mouseenter="onBubbleEnter(comp, pos)"
              @mouseleave="onBubbleLeave"
            >
              <circle
                :cx="getFieldX(IP_TECHNICAL_FIELDS.indexOf(pos.field))"
                :cy="getIntensityY(pos.intensity)"
                :r="isSelectedComp(comp) ? pos.bubbleSize + 2 : pos.bubbleSize"
                :fill="comp.logoColor"
                :fill-opacity="isHighlighted(comp) ? (isSelectedComp(comp) ? 0.85 : 0.65) : 0.15"
                :stroke="isSelectedComp(comp) ? '#0F172A' : comp.logoColor"
                :stroke-width="isSelectedComp(comp) ? 2 : 1"
              />
              <text
                v-if="isHighlighted(comp)"
                :x="getFieldX(IP_TECHNICAL_FIELDS.indexOf(pos.field))"
                :y="getIntensityY(pos.intensity) + 3"
                text-anchor="middle"
                class="text-[8px] font-bold fill-white pointer-events-none select-none"
              >
                {{ comp.name.slice(0, 2) }}
              </text>
            </g>
          </template>
        </svg>

        <!-- Hover Tooltip 浮层（HTML 绝对定位，非 SVG text） -->
        <div
          v-if="hoveredBubble"
          class="absolute z-10 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none border border-slate-700"
          :style="{ left: hoveredBubble.x + 10 + 'px', top: hoveredBubble.y - 40 + 'px' }"
        >
          <div class="font-bold text-[11px]">{{ hoveredBubble.company }}</div>
          <div class="text-slate-300 text-[10px]">
            {{ hoveredBubble.field }} · 强度：{{ hoveredBubble.intensity }} / 100
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
        <span class="flex items-center gap-1">
          <Info class="w-3 h-3 text-blue-600" />
          <span>点击气泡或图例快速切换选定企业查看深度画像</span>
        </span>
        <span class="font-mono text-slate-400 text-[10px]">更新时间：今日 00:00</span>
      </div>
    </div>

    <!-- 竞争对手详情企业画像 (Selected Competitor Profile) -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <!-- 画像头部 -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0"
            :style="{ backgroundColor: selectedCompetitor.logoColor }"
          >
            {{ selectedCompetitor.name.slice(0, 2) }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-900 tracking-tight">
                {{ selectedCompetitor.name }} 专利画像
              </h3>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {{ selectedCompetitor.headquarters }}
              </span>
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                份额：{{ selectedCompetitor.marketShare }}
              </span>
            </div>
            <p class="text-[10px] text-slate-400 font-mono mt-0.5">
              {{ selectedCompetitor.englishName }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <select
            :value="selectedCompetitor.id"
            class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
            @change="onSwitchCompany"
          >
            <option v-for="c in MOCK_COMPETITORS" :key="c.id" :value="c.id">
              切换企业：{{ c.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- 4 项关键指标卡 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span class="text-[10px] font-semibold text-slate-400 block">专利总量</span>
          <span class="text-xl font-bold text-slate-900 font-mono mt-0.5 block">
            {{ selectedCompetitor.totalPatents.toLocaleString() }}
          </span>
          <span class="text-[10px] text-slate-400 block mt-0.5">全球公开文献</span>
        </div>

        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span class="text-[10px] font-semibold text-slate-400 block">核心高价值专利</span>
          <span class="text-xl font-bold text-blue-600 font-mono mt-0.5 block">
            {{ selectedCompetitor.corePatentsCount.toLocaleString() }}
          </span>
          <span class="text-[10px] text-slate-400 block mt-0.5">被引频次≥20次</span>
        </div>

        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span class="text-[10px] font-semibold text-slate-400 block">近5年新增专利</span>
          <span class="text-xl font-bold text-indigo-600 font-mono mt-0.5 block">
            {{ selectedCompetitor.recentFiveYearsAdded.toLocaleString() }}
          </span>
          <span class="text-[10px] text-slate-400 block mt-0.5">高增长爆发期</span>
        </div>

        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span class="text-[10px] font-semibold text-slate-400 block">海外专利占比</span>
          <span class="text-xl font-bold text-emerald-600 font-mono mt-0.5 block">
            {{ selectedCompetitor.overseasPatentRatio }}%
          </span>
          <span class="text-[10px] text-slate-400 block mt-0.5">欧美PCT保护网</span>
        </div>
      </div>

      <!-- 核心技术方向布局强度（进度条） -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span>核心技术方向专利布局强度</span>
          <span class="text-[10px] text-slate-400 font-normal">按分支申请量与壁垒深度评估</span>
        </h4>

        <div class="space-y-2">
          <div v-for="area in selectedCompetitor.focusAreas" :key="area.field" class="space-y-1">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-semibold text-slate-800 w-24">{{ area.field }}</span>
              <div class="flex items-center gap-3">
                <span class="text-slate-500 font-mono">{{ area.patentCount }} 件</span>
                <span class="font-bold text-slate-900 font-mono w-10 text-right">{{ area.intensity }}%</span>
              </div>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{
                  width: area.intensity + '%',
                  backgroundColor: selectedCompetitor.logoColor,
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- AI 研判卡 -->
      <div class="p-3.5 rounded-lg bg-slate-900 text-slate-200 space-y-1.5 border border-slate-800">
        <div class="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
          <Sparkles class="w-3.5 h-3.5" />
          <span>AI顾问深度分析研判</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
          {{ selectedCompetitor.aiAdvice }}
        </p>
        <p class="text-[10px] text-slate-400 pt-0.5">
          企业研判：{{ selectedCompetitor.summary }}
        </p>
      </div>
    </div>
  </div>
</template>
