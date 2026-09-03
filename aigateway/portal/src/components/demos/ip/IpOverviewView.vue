<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/OverviewView.tsx -->
<script setup lang="ts">
import { AlertOctagon, Building2, ChevronRight, FileCheck, FileText } from 'lucide-vue-next'
import type { AnalysisInput, IpView, RiskLevel } from '@/data/ipIntelData'
import { MOCK_RISK_ITEMS } from '@/data/ipMockData'

defineProps<{ analysisInput: AnalysisInput }>()
const emit = defineEmits<{ (e: 'navigate', view: IpView): void }>()

const navigate = (view: IpView) => {
  emit('navigate', view)
}

// 顶部 6 项高密度指标卡（总览演示快照）
const topMetrics: { label: string; value: string; sub: string; color: string; highlight?: boolean }[] = [
  { label: '检索专利总量', value: '12,846', sub: 'CNIPA / USPTO / EPO', color: 'text-slate-900' },
  { label: '核心相关专利', value: '328', sub: '核心热管理与流道', color: 'text-blue-600' },
  { label: '重点监控企业', value: '23', sub: '头部集中度高', color: 'text-slate-900' },
  { label: '高风险事项', value: '8', sub: '🔴 需重点排查规避', color: 'text-rose-500', highlight: true },
  { label: '专利空白机会', value: '17', sub: '🟢 专利蓝海挖掘点', color: 'text-emerald-600' },
  { label: '实时情报预警', value: '5', sub: '今日监控动态更新', color: 'text-slate-900' },
]

// Top 风险：2 高 + 1 中 + 1 低（照原型配色层级，数据取自 ipMockData）
const topRisks = [
  ...MOCK_RISK_ITEMS.filter((r) => r.riskLevel === 'high').slice(0, 2),
  ...MOCK_RISK_ITEMS.filter((r) => r.riskLevel === 'medium').slice(0, 1),
  ...MOCK_RISK_ITEMS.filter((r) => r.riskLevel === 'low').slice(0, 1),
]

// 风险等级视觉/文案元数据
const riskMeta: Record<RiskLevel, { tag: string; card: string; tagCls: string; idText: string; track: string; bar: string; foot: string; advice: string }> = {
  high: {
    tag: '高风险',
    card: 'bg-rose-50 border border-rose-100 hover:border-rose-300',
    tagCls: 'bg-rose-500',
    idText: 'text-rose-700',
    track: 'bg-rose-200',
    bar: 'bg-rose-500',
    foot: 'text-rose-600',
    advice: '立即回避 / 规避设计',
  },
  medium: {
    tag: '中风险',
    card: 'bg-amber-50 border border-amber-100 hover:border-amber-300',
    tagCls: 'bg-amber-500',
    idText: 'text-amber-700',
    track: 'bg-amber-200',
    bar: 'bg-amber-500',
    foot: 'text-amber-600',
    advice: '持续监控 / 启动拆解',
  },
  low: {
    tag: '低风险',
    card: 'bg-slate-50 border border-slate-200 hover:border-slate-300',
    tagCls: 'bg-slate-400',
    idText: 'text-slate-500',
    track: 'bg-slate-200',
    bar: 'bg-slate-400',
    foot: 'text-slate-500',
    advice: '具备公知抗辩空间',
  },
}

// 申请人简称（优先取括号别名，如 "宁德时代 (CATL)" → CATL）
const applicantAbbr = (applicant: string): string => {
  const paren = applicant.match(/\(([^)]+)\)/)
  if (paren) return paren[1]
  const head = applicant.split(/[（(,·]/)[0].trim()
  return head.length > 10 ? `${head.slice(0, 8)}…` : head
}

// 快捷入口导航
const quickLinks = [
  { view: 'search' as IpView, title: '专利检索库', sub: '1,286件深度技术特征库', icon: FileCheck, iconBox: 'bg-blue-50 text-blue-600' },
  { view: 'competitors' as IpView, title: '竞品情报透视', sub: 'CATL、BYD、Tesla全景对比', icon: Building2, iconBox: 'bg-indigo-50 text-indigo-600' },
  { view: 'risks' as IpView, title: '侵权特征比对', sub: '逐条拆解工程规避方案', icon: AlertOctagon, iconBox: 'bg-rose-50 text-rose-600' },
  { view: 'report' as IpView, title: '完整战略报告', sub: 'P0-P3落地清单与PDF导出', icon: FileText, iconBox: 'bg-emerald-50 text-emerald-600' },
]
</script>

<template>
  <div class="p-4 sm:p-5 space-y-4 pb-8">
    <!-- 顶部 6 项高密度指标卡 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div
        v-for="item in topMetrics"
        :key="item.label"
        :class="[
          'bg-white p-3 rounded-lg border shadow-sm transition-all',
          item.highlight ? 'border-rose-100 border-l-4 border-l-rose-500' : 'border-slate-200',
        ]"
      >
        <div class="text-xs text-slate-500 mb-1">{{ item.label }}</div>
        <div class="text-xl font-bold font-mono" :class="item.color">{{ item.value }}</div>
        <div class="text-[10px] text-slate-400 mt-0.5 truncate">{{ item.sub }}</div>
      </div>
    </div>

    <!-- 主高密度网格（5 列风险分析 + 7 列竞品/布局） -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- 左列：AI 知识产权风险分析 -->
      <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold flex items-center gap-2 text-slate-900">
              <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
              <span>AI 知识产权风险分析</span>
            </h2>
            <button
              type="button"
              @click="navigate('risks')"
              class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>风险地图</span>
              <ChevronRight class="w-3 h-3" />
            </button>
          </div>

          <!-- Top 风险卡（2 高 + 1 中 + 1 低，数据驱动） -->
          <div class="space-y-2.5">
            <div
              v-for="item in topRisks"
              :key="item.id"
              @click="navigate('risks')"
              :class="['p-3 rounded-lg flex items-start gap-3 cursor-pointer transition-colors', riskMeta[item.riskLevel].card]"
            >
              <div
                :class="['px-2 py-1 text-white text-[10px] font-bold rounded shrink-0', riskMeta[item.riskLevel].tagCls]"
              >
                {{ riskMeta[item.riskLevel].tag }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-slate-900">{{ item.title }}</div>
                <div
                  :class="['text-[10px] mt-0.5 font-mono truncate', riskMeta[item.riskLevel].idText]"
                  :title="item.relatedPatentTitle"
                >
                  相关专利: {{ item.relatedPatentId }} ({{ applicantAbbr(item.patentApplicant) }})
                </div>
                <div class="w-full h-1 mt-2 rounded-full overflow-hidden" :class="riskMeta[item.riskLevel].track">
                  <div
                    class="h-full rounded-full"
                    :class="riskMeta[item.riskLevel].bar"
                    :style="{ width: `${Math.min(100, item.riskScore)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between mt-1 text-[9px] font-medium" :class="riskMeta[item.riskLevel].foot">
                  <span>侵权拟合度: {{ item.riskScore }}%</span>
                  <span>建议: {{ riskMeta[item.riskLevel].advice }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高密度法律免责声明 -->
        <div class="mt-3 p-2 bg-slate-900 text-slate-400 text-[10px] rounded italic leading-tight">
          免责声明：AI 分析结果基于公开数据，不构成最终法律意见。重大侵权结论需专业人员审核。
        </div>
      </div>

      <!-- 右列：竞品技术布局矩阵 + AI 布局建议 -->
      <div class="lg:col-span-7 flex flex-col gap-4">
        <!-- 上：竞品技术布局矩阵 -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1">
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-sm font-bold flex items-center gap-2 text-slate-900">
              <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
              <span>竞品技术布局矩阵</span>
            </h2>
            <div class="flex items-center gap-3 text-[10px]">
              <span class="flex items-center gap-1 font-medium text-slate-700">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span> CATL
              </span>
              <span class="flex items-center gap-1 font-medium text-slate-700">
                <span class="w-2 h-2 rounded-full bg-orange-500"></span> BYD
              </span>
              <span class="flex items-center gap-1 font-medium text-slate-700">
                <span class="w-2 h-2 rounded-full bg-slate-500"></span> Tesla
              </span>
              <button
                type="button"
                @click="navigate('competitors')"
                class="text-blue-600 hover:text-blue-800 font-semibold ml-1 cursor-pointer"
              >
                详情 →
              </button>
            </div>
          </div>

          <!-- 2D 坐标气泡矩阵 -->
          <div class="h-40 border-l border-b border-slate-200 relative bg-slate-50/50 rounded-br-lg overflow-hidden">
            <div class="absolute top-2 left-3 px-1.5 py-0.5 bg-slate-200/70 text-[9px] text-slate-600 rounded font-medium">
              专利强度 (Y)
            </div>
            <div class="absolute bottom-2 right-3 px-1.5 py-0.5 bg-slate-200/70 text-[9px] text-slate-600 rounded font-medium">
              技术覆盖 (X)
            </div>

            <!-- 网格线 -->
            <div class="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20 border-t border-r border-slate-300">
              <div class="border-r border-b border-slate-300"></div>
              <div class="border-r border-b border-slate-300"></div>
              <div class="border-r border-b border-slate-300"></div>
              <div class="border-b border-slate-300"></div>
            </div>

            <!-- 竞品气泡 -->
            <div
              @click="navigate('competitors')"
              class="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-blue-500/80 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
              title="CATL: 专利强度极高，深耕热管理"
            >
              CATL
            </div>
            <div
              @click="navigate('competitors')"
              class="absolute top-1/3 left-2/3 w-14 h-14 rounded-full bg-orange-500/80 border-2 border-orange-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm cursor-pointer hover:scale-110 transition-transform"
              title="BYD: 专利数量庞大，主打消防与刀片集成"
            >
              BYD
            </div>
            <div
              @click="navigate('competitors')"
              class="absolute bottom-1/4 right-1/4 w-10 h-10 rounded-full bg-slate-600/80 border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
              title="Tesla: BMS算法与流道拓扑强壁垒"
            >
              Tesla
            </div>
            <div
              @click="navigate('competitors')"
              class="absolute top-2/3 left-1/3 w-9 h-9 rounded-full bg-blue-400/40 border border-blue-500 flex items-center justify-center text-[9px] font-bold text-blue-700 cursor-pointer hover:scale-110 transition-transform"
              title="LG新能源: 软包与模组连接"
            >
              LG
            </div>
          </div>

          <!-- 4 大技术分支高亮卡 -->
          <div class="mt-3 grid grid-cols-4 gap-2 text-[10px]">
            <div class="p-2 bg-slate-50 border border-slate-200/80 rounded text-center">
              <div class="font-bold text-slate-800">液冷热管理</div>
              <div class="text-blue-600 font-semibold mt-0.5">CATL (强)</div>
            </div>
            <div class="p-2 bg-slate-50 border border-slate-200/80 rounded text-center">
              <div class="font-bold text-slate-800">消防安全</div>
              <div class="text-orange-600 font-semibold mt-0.5">BYD (极强)</div>
            </div>
            <div class="p-2 bg-slate-50 border border-slate-200/80 rounded text-center">
              <div class="font-bold text-slate-800">BMS软件</div>
              <div class="text-slate-600 font-semibold mt-0.5">Tesla (极强)</div>
            </div>
            <div class="p-2 bg-slate-50 border border-slate-200/80 rounded text-center">
              <div class="font-bold text-slate-800">电芯封装</div>
              <div class="text-blue-600 font-semibold mt-0.5">LG (中)</div>
            </div>
          </div>
        </div>

        <!-- 下：AI 专利布局建议与空白发现 -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold flex items-center gap-2 text-slate-900">
              <span class="w-1 h-4 bg-emerald-500 rounded-full"></span>
              <span>AI 专利布局建议与空白发现</span>
            </h2>
            <button
              type="button"
              @click="navigate('layout')"
              class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>四层金字塔</span>
              <ChevronRight class="w-3 h-3" />
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- 左：核心布局空白 -->
            <div class="space-y-2">
              <div class="text-[11px] font-bold text-slate-500 border-b border-slate-100 pb-1">
                核心布局空白 (优先布局)
              </div>
              <div
                @click="navigate('layout')"
                class="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-100 rounded-lg cursor-pointer hover:bg-emerald-100/70 transition-colors"
              >
                <span class="text-[11px] font-medium text-slate-900 truncate mr-2">
                  智能液冷流量动态自适应拓扑控制算法
                </span>
                <span class="text-[10px] text-emerald-700 font-bold font-mono uppercase tracking-wider shrink-0">
                  评分 91
                </span>
              </div>
              <div
                @click="navigate('layout')"
                class="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-100 rounded-lg cursor-pointer hover:bg-emerald-100/70 transition-colors"
              >
                <span class="text-[11px] font-medium text-slate-900 truncate mr-2">
                  模块化液冷板免排空带液快速热插拔结构
                </span>
                <span class="text-[10px] text-emerald-700 font-bold font-mono uppercase tracking-wider shrink-0">
                  评分 87
                </span>
              </div>
            </div>

            <!-- 右：战略防御重点 -->
            <div class="space-y-2">
              <div class="text-[11px] font-bold text-slate-500 border-b border-slate-100 pb-1">
                战略防御重点
              </div>
              <div
                @click="navigate('layout')"
                class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] leading-relaxed cursor-pointer hover:border-slate-300 transition-colors"
              >
                <div class="flex justify-between mb-1">
                  <span class="font-bold text-slate-900">P1 优先级 · 防御阵地</span>
                  <span class="text-blue-600 font-semibold font-mono">热管理集成</span>
                </div>
                <p class="text-slate-600 text-[10px] line-clamp-2">
                  建议在电芯级冷板散热不均匀性校正领域加紧布局，快速申请形成外围专利群抵御诉讼。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口导航 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
      <div
        v-for="link in quickLinks"
        :key="link.view"
        @click="navigate(link.view)"
        class="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            :class="['w-7 h-7 rounded flex items-center justify-center shrink-0', link.iconBox]"
          >
            <component :is="link.icon" class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <div class="font-bold text-slate-900 text-xs truncate">{{ link.title }}</div>
            <div class="text-[10px] text-slate-400 truncate">{{ link.sub }}</div>
          </div>
        </div>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </div>
    </div>
  </div>
</template>
