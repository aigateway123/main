<script setup lang="ts">
import { Sparkles, PenTool, ArrowRight, Flame, Award, FileText, TrendingUp } from 'lucide-vue-next'
import type { StudioView } from '@/data/contentStudioData'
import { DASHBOARD_STATS, HOT_INDUSTRIES, HOT_KEYWORDS, TREND_DAYS, TREND_VIRAL, TREND_INDEX, OUTPUT_EFFICIENCY } from '@/data/contentStudioData'

defineProps<{}>()
const emit = defineEmits<{ (e: 'navigate', view: StudioView): void }>()

const iconMap: Record<string, any> = { flame: Flame, award: Award, file: FileText, trend: TrendingUp }

// SVG 双曲线：viral 值域 0-400、index 值域 0-100，均映射到 170→20
const PAD = { l: 30, r: 30, t: 25, b: 40 }
const W = 560
const H = 200
const xAt = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (TREND_DAYS.length - 1)
const yViral = (v: number) => PAD.t + 145 * (1 - v / 400)
const yIndex = (v: number) => PAD.t + 145 * (1 - v / 100)

const viralPts = TREND_VIRAL.map((v, i) => `${xAt(i).toFixed(1)},${yViral(v).toFixed(1)}`).join(' ')
const indexPts = TREND_INDEX.map((v, i) => `${xAt(i).toFixed(1)},${yIndex(v).toFixed(1)}`).join(' ')
// 渐变填充区域（曲线闭合到底部）
const viralArea = `${viralPts} ${xAt(TREND_VIRAL.length - 1).toFixed(1)},170 ${xAt(0).toFixed(1)},170`
const indexArea = `${indexPts} ${xAt(TREND_INDEX.length - 1).toFixed(1)},170 ${xAt(0).toFixed(1)},170`
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 欢迎横幅 -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#121217] border border-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-[9px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">SaaS Dashboard V1.0</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[9px] text-zinc-500 font-mono">2026-06-07 08:05:23 UTC</span>
        </div>
        <h2 class="mt-3 text-2xl font-bold text-white flex items-center gap-2">
          爆款增长控制台 <span class="text-orange-500">⚙️</span>
        </h2>
        <p class="mt-1 text-xs text-zinc-400">欢迎回来，陈立明。今日全网流量大盘数据已就绪，已为您锁定 5 个潜在起号风口。</p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <button
          class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-all"
          @click="emit('navigate', 'dissect')"
        >
          <Sparkles class="w-3.5 h-3.5 text-orange-500" />
          快速拆爆文
        </button>
        <button
          class="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-[11px] font-bold text-black flex items-center gap-1.5 cursor-pointer transition-all"
          @click="emit('navigate', 'generation')"
        >
          <PenTool class="w-3.5 h-3.5" />
          一键写内容
        </button>
      </div>
    </div>

    <!-- 4 指标卡 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="s in DASHBOARD_STATS"
        :key="s.title"
        class="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-900 hover:border-zinc-800 transition-all"
      >
        <div class="flex items-center justify-between">
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{{ s.title }}</p>
          <component :is="iconMap[s.icon]" class="w-4 h-4" :class="s.icon === 'flame' ? 'text-orange-500' : s.icon === 'award' ? 'text-amber-500' : s.icon === 'file' ? 'text-blue-500' : 'text-emerald-500'" />
        </div>
        <p class="mt-2 text-2xl font-extrabold text-white font-mono">{{ s.value }}</p>
        <div class="mt-2 flex items-center justify-between">
          <span class="text-[9px] text-emerald-400 font-mono font-bold">{{ s.change }}</span>
          <span class="text-[9px] text-zinc-600 font-mono">相比昨日均值持续跑赢</span>
        </div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 流量趋势 SVG -->
      <div class="lg:col-span-2 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900">
        <div class="flex items-center justify-between pb-3">
          <h4 class="text-xs font-bold text-zinc-200">流量盘整：全网爆文增长趋势</h4>
          <div class="flex items-center gap-4 text-[9px] font-mono text-zinc-500">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-500"></span>爆文数量</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span>大盘热点指数</span>
          </div>
        </div>
        <p class="text-[10px] text-zinc-500 -mt-2 mb-2">过去 7 天内热点起号爆文数与流量大盘水位</p>
        <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-52">
          <defs>
            <linearGradient id="studioViralFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F27D26" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#F27D26" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="studioIndexFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
            </linearGradient>
          </defs>
          <!-- 网格线 -->
          <line v-for="g in 4" :key="g" :x1="PAD.l" :x2="W - PAD.r" :y1="PAD.t + (g - 1) * 48" :y2="PAD.t + (g - 1) * 48" stroke="#1f1f1f" stroke-width="1" stroke-dasharray="4 4" />
          <!-- 面积 + 折线 -->
          <polygon :points="indexArea" fill="url(#studioIndexFill)" />
          <polyline :points="indexPts" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3 3" />
          <polygon :points="viralArea" fill="url(#studioViralFill)" />
          <polyline :points="viralPts" fill="none" stroke="#F27D26" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <!-- 发光锚点 -->
          <circle :cx="xAt(3)" :cy="yViral(TREND_VIRAL[3])" r="5" fill="#F27D26" stroke="#fff" stroke-width="1.5" />
          <circle :cx="xAt(6)" :cy="yViral(TREND_VIRAL[6])" r="5" fill="#F27D26" stroke="#fff" stroke-width="1.5" />
          <!-- HUD 提示框 -->
          <g transform="translate(224,58)">
            <rect x="0" y="0" width="132" height="44" rx="8" fill="#111" stroke="#F27D26" stroke-width="1" />
            <text x="10" y="16" fill="#F27D26" font-size="10" font-weight="bold">6月4日 节点风口</text>
            <text x="10" y="34" fill="#fff" font-size="11" font-family="monospace" font-weight="bold">爆文释放: +224 篇</text>
          </g>
          <!-- X 轴标签 -->
          <text v-for="(d, i) in TREND_DAYS" :key="d" :x="xAt(i)" y="190" text-anchor="middle" fill="#52525b" font-size="9" :font-weight="i === 6 ? 'bold' : 'normal'">{{ d }}</text>
        </svg>
      </div>

      <!-- 产出效率 -->
      <div class="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900">
        <h4 class="text-xs font-bold text-zinc-200">生成中心产出效率 (按类别)</h4>
        <p class="text-[10px] text-zinc-500 mt-1 mb-4">本阶段各类AI创意内容的生产转化总量</p>
        <div class="space-y-4">
          <div v-for="item in OUTPUT_EFFICIENCY" :key="item.label">
            <div class="flex items-center justify-between text-[10px] mb-1">
              <span class="text-zinc-400">{{ item.label }}</span>
              <span class="text-zinc-300 font-mono font-bold">{{ item.value }}</span>
            </div>
            <div class="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="item.color" :style="{ width: item.width + '%' }"></div>
            </div>
          </div>
        </div>
        <button
          class="mt-5 w-full py-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-[10px] font-bold text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          @click="emit('navigate', 'generation')"
        >
          进入内容生成中心 <ArrowRight class="w-3 h-3 text-orange-500" />
        </button>
      </div>
    </div>

    <!-- 排行区 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热门行业 -->
      <div class="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900">
        <div class="flex items-center justify-between pb-3">
          <h4 class="text-xs font-bold text-zinc-200">热门增长行业排行 (24h 追踪)</h4>
          <span class="text-[9px] text-zinc-600 font-mono">热度源自 Xiaohongshu API</span>
        </div>
        <div class="space-y-2">
          <div v-for="h in HOT_INDUSTRIES" :key="h.rank" class="flex items-center gap-3 py-2 border-b border-zinc-950 last:border-0">
            <span class="w-5 h-5 rounded-md bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[10px] font-bold font-mono text-zinc-400">{{ h.rank }}</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-zinc-200">{{ h.name }}</span>
                <span class="text-[9px] text-emerald-400 font-mono">起号阻力极小</span>
              </div>
              <div class="mt-1 flex items-center gap-2">
                <div class="flex-1 h-1 bg-zinc-950 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-500/80 rounded-full" :style="{ width: h.heat + '%' }"></div>
                </div>
                <span class="text-[9px] text-zinc-500 font-mono">{{ h.heat }}% 热度值</span>
              </div>
              <p class="text-[9px] text-zinc-600 mt-1 font-mono">{{ h.keyword }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门关键词 -->
      <div class="p-5 rounded-xl bg-[#0c0c0e] border border-zinc-900">
        <div class="flex items-center justify-between pb-3">
          <h4 class="text-xs font-bold text-zinc-200">热门风口关键词 (高推荐权重)</h4>
          <button class="text-[10px] font-bold text-orange-500 hover:text-orange-400 cursor-pointer" @click="emit('navigate', 'radar')">爆款雷达 →</button>
        </div>
        <div class="space-y-2">
          <div v-for="k in HOT_KEYWORDS" :key="k.name" class="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-bold text-zinc-200 truncate">{{ k.name }}</span>
                <span class="text-[8px] px-1 py-0.5 rounded bg-zinc-900 text-zinc-500 font-mono border border-zinc-800 shrink-0">{{ k.tag }}</span>
              </div>
              <p class="text-[9px] text-zinc-600 mt-0.5 font-mono">全网周浏览量: {{ k.volume }}</p>
            </div>
            <div class="text-right shrink-0">
              <span class="text-[9px] font-mono font-bold" :class="k.level === '极高' ? 'text-orange-400' : k.level === '高' ? 'text-amber-400' : 'text-emerald-400'">{{ k.level }}竞争度</span>
              <p class="text-[9px] text-zinc-600 font-mono mt-0.5">点击率预估 11.4%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
