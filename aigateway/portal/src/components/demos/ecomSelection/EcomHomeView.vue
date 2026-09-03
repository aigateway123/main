<!-- 转译自：docs/仓库/xx-ai-·-ai跨境电商选品情报员/src/components/home/HomeView.tsx -->
<!-- 补充：近期任务区块（原型在任务中心呈现历史，Home 增加最近任务入口 emit view-recent-task） -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Component } from 'vue'
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  Cpu,
  DollarSign,
  Factory,
  Layers,
  Play,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import type {
  PlatformType,
  SellerType,
  TargetMarket,
  TaskInput,
} from '@/data/ecomIntelData'
import { ECOM_TASK_LOGS, PLATFORMS, SELLER_TYPES, TARGET_MARKETS } from '@/data/ecomIntelData'

const props = defineProps<{
  taskParams: TaskInput
}>()

const emit = defineEmits<{
  (e: 'start-task', input: TaskInput): void
  (e: 'view-recent-task'): void
  (e: 'view-results'): void
}>()

// ---- 表单状态：以 props.taskParams 初始化，容器更新（如新任务弹窗提交）时 watch 同步 ----
const targetMarket = ref<TargetMarket>(props.taskParams.targetMarket)
const platform = ref<PlatformType>(props.taskParams.platform)
const category = ref<string>(props.taskParams.category)
const budget = ref<number>(props.taskParams.budget)
const targetMargin = ref<number>(props.taskParams.targetMargin)
const sellerType = ref<SellerType>(props.taskParams.sellerType ?? '贸易型卖家')
const requirements = ref<string>(
  props.taskParams.additionalRequirements ?? props.taskParams.requirements ?? '',
)
const customKeyword = ref<string>(props.taskParams.customKeyword ?? '宠物随行水杯 / 旅行饮水碗')

watch(
  () => props.taskParams,
  (v) => {
    targetMarket.value = v.targetMarket
    platform.value = v.platform
    category.value = v.category
    budget.value = v.budget
    targetMargin.value = v.targetMargin
    if (v.sellerType) sellerType.value = v.sellerType
    if (v.additionalRequirements !== undefined) requirements.value = v.additionalRequirements
    else if (v.requirements !== undefined) requirements.value = v.requirements
    if (v.customKeyword) customKeyword.value = v.customKeyword
  },
  { deep: true },
)

// ---- 4 个预设任务卡（原型快速场景，点击同时填充品类 + 细分方向） ----
const presetCategories: { label: string; cat: string; keyword: string }[] = [
  { label: '🐶 宠物用品 (默认Demo)', cat: '宠物用品', keyword: '宠物随行水杯 / 旅行饮水碗' },
  { label: '🏕️ 户外露营装备', cat: '户外与运动', keyword: '超轻折叠椅 / 战术钛水壶' },
  { label: '🍳 家居与厨房小件', cat: '家居与厨房', keyword: '磁吸保鲜膜盒 / 咖啡量勺' },
  { label: '👶 母婴与幼童玩具', cat: '母婴玩具', keyword: '防胀气慢喂奶瓶 / 早教布书' },
]

const categoryQuickTags = ['宠物用品', '户外与运动', '家居与厨房', '母婴玩具', '电子数码']

const applyPreset = (preset: { cat: string; keyword: string }) => {
  category.value = preset.cat
  customKeyword.value = preset.keyword
}

const submitTask = () => {
  const payload: TaskInput = {
    targetMarket: targetMarket.value,
    platform: platform.value,
    category: category.value,
    budget: budget.value,
    targetMargin: targetMargin.value,
    sellerType: sellerType.value,
    requirements: requirements.value,
    customKeyword: customKeyword.value,
  }
  emit('start-task', payload)
}

// ---- AI 标准分析流水线 6 步卡 ----
interface FlowStep {
  step: string
  title: string
  desc: string
  icon: Component
}

const flowSteps: FlowStep[] = [
  { step: '01', title: '大盘趋势挖掘', desc: '12个月搜索走势与Google Trends', icon: TrendingUp },
  { step: '02', title: '买家痛点提炼', desc: '深度挖掘12,800+条真实差评', icon: Users },
  { step: '03', title: '竞品格局扫描', desc: 'BSR畅销榜与头尾部垄断度', icon: Swords },
  { step: '04', title: '产品差异化方案', desc: '6大结构改良避开低价内卷', icon: Layers },
  { step: '05', title: '精准利润模型', desc: '头程FBA/广告ROI动态测算', icon: Calculator },
  { step: '06', title: '工厂与Listing', desc: '真实供应商匹配与英文上架文案', icon: Factory },
]

// ---- 近期任务（任务中心最近 3 条，点击前往任务中心） ----
const recentTasks = ECOM_TASK_LOGS.slice(0, 3)

const viewResults = () => emit('view-results')
const viewRecentTask = () => emit('view-recent-task')

const budgetUsdLabel = (): string =>
  `~$${Math.round(budget.value / 7.2).toLocaleString()}`
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-12 min-h-full">
    <!-- Hero Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide"
      >
        <Sparkles class="w-3.5 h-3.5 text-indigo-400" />
        <span>XX AI · 新一代 AI 跨境电商选品情报员</span>
      </div>

      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
        让 AI 替你找到
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400"
        >
          下一个爆款
        </span>
      </h1>

      <p class="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
        从市场趋势、消费者需求到竞品表现、利润测算与供应链，AI 一次完成全链路选品决策。
      </p>

      <!-- Quick Demo CTA Pill -->
      <div class="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/30 transition shadow-sm cursor-pointer"
          @click="viewResults"
        >
          <Play class="w-3.5 h-3.5 fill-current" />
          <span>一键体验推荐方案：美国 Amazon 宠物随行水杯 (92分报告)</span>
        </button>
      </div>
    </div>

    <!-- Main Selection Task Card -->
    <div
      class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
    >
      <!-- Background glow effects -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"
      ></div>

      <div class="relative z-10">
        <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <Target class="w-5 h-5 text-indigo-400" />
              <span>配置 AI 选品情报指令</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              输入您的市场偏好与商业边界，AI Agent 将自动运行 12 步深度洞察流水线
            </p>
          </div>

          <!-- Presets quick tags -->
          <div class="flex items-center gap-2 text-xs flex-wrap">
            <span class="text-slate-400">快速场景:</span>
            <button
              v-for="p in presetCategories"
              :key="p.label"
              type="button"
              class="px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer"
              :class="
                category === p.cat
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-medium'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
              "
              @click="applyPreset(p)"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <form class="mt-6 space-y-6" @submit.prevent="submitTask">
          <!-- Top Grid 3 Columns -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Target Market -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>目标市场</span>
                <span class="text-[11px] text-slate-400 font-normal">默认: 美国</span>
              </label>
              <div class="grid grid-cols-4 gap-1.5">
                <button
                  v-for="m in TARGET_MARKETS"
                  :key="m"
                  type="button"
                  class="py-2 px-1 rounded-lg text-xs font-medium border text-center transition cursor-pointer"
                  :class="
                    targetMarket === m
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                  "
                  @click="targetMarket = m"
                >
                  {{ m }}
                </button>
              </div>
            </div>

            <!-- Platform -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>销售平台</span>
                <span class="text-[11px] text-slate-400 font-normal">默认: Amazon</span>
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="p in PLATFORMS"
                  :key="p"
                  type="button"
                  class="py-2 px-3 rounded-lg text-xs font-medium border text-center transition cursor-pointer"
                  :class="
                    platform === p
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                  "
                  @click="platform = p"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>目标品类</span>
                <span class="text-[11px] text-slate-400 font-normal">默认: 宠物用品</span>
              </label>
              <div>
                <input
                  v-model="category"
                  type="text"
                  placeholder="输入或选择品类，如 宠物用品"
                  class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <button
                    v-for="c in categoryQuickTags"
                    :key="c"
                    type="button"
                    class="text-[11px] px-2 py-0.5 rounded border transition cursor-pointer"
                    :class="
                      category === c
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    "
                    @click="category = c"
                  >
                    {{ c }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Grid 2 Columns: Budget & Gross Margin -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <!-- Budget -->
            <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <DollarSign class="w-3.5 h-3.5 text-emerald-400" />
                  <span>首期启动预算 (CNY)</span>
                </label>
                <span class="text-sm font-mono font-bold text-emerald-400">
                  ¥{{ budget.toLocaleString() }} ({{ budgetUsdLabel() }})
                </span>
              </div>
              <input
                v-model.number="budget"
                type="range"
                min="30000"
                max="500000"
                step="10000"
                class="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div class="flex justify-between text-[11px] text-slate-400">
                <span>¥30,000 (轻试水)</span>
                <span>¥100,000 (标准单品)</span>
                <span>¥500,000 (品牌系列)</span>
              </div>
            </div>

            <!-- Target Margin -->
            <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp class="w-3.5 h-3.5 text-cyan-400" />
                  <span>目标毛利率门槛</span>
                </label>
                <span class="text-sm font-mono font-bold text-cyan-400">≥ {{ targetMargin }}%</span>
              </div>
              <input
                v-model.number="targetMargin"
                type="range"
                min="20"
                max="60"
                step="5"
                class="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div class="flex justify-between text-[11px] text-slate-400">
                <span>≥20% (保周转)</span>
                <span>≥30% (健康线)</span>
                <span>≥50% (高溢价)</span>
              </div>
            </div>
          </div>

          <!-- Seller Type -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>卖家类型</span>
              <span class="text-[11px] text-slate-400 font-normal">默认: 贸易型卖家</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="s in SELLER_TYPES"
                :key="s"
                type="button"
                class="py-2 px-3 rounded-lg text-xs font-medium border text-center transition cursor-pointer"
                :class="
                  sellerType === s
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                "
                @click="sellerType = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Requirements Textarea -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>选品要求与差异化偏好</span>
              <span class="text-[11px] text-indigo-400">AI 将严格依据此条件筛选模型</span>
            </label>
            <textarea
              v-model="requirements"
              rows="3"
              placeholder="例如：竞争不要太激烈、有稳定需求、最好能够做产品差异化与改良..."
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed transition resize-none font-mono"
            />
          </div>

          <!-- Action Buttons Footer -->
          <div class="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              id="start-ai-selection-btn"
              class="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer"
            >
              <Sparkles class="w-4 h-4 text-white animate-spin" :style="{ animationDuration: '4s' }" />
              <span>开始 AI 选品 (自动分析 1,286 款产品)</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <button
              type="button"
              class="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              @click="viewResults"
            >
              <Play class="w-3.5 h-3.5 text-emerald-400" />
              <span>查看默认完整 Demo 报告</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI Agent Execution Flow Showcase Cards -->
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <Cpu class="w-4 h-4 text-indigo-400" />
          <span>AI 选品情报员标准分析流水线 (全闭环)</span>
        </h3>
        <span class="text-xs text-slate-400">取代传统运营 3-5 天的手工市调与竞品调研</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <div
          v-for="item in flowSteps"
          :key="item.step"
          class="bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5 hover:border-slate-700 transition"
        >
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold text-indigo-400">{{ item.step }}</span>
            <component :is="item.icon" class="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div class="font-bold text-slate-200 text-xs">{{ item.title }}</div>
          <div class="text-[11px] text-slate-400 leading-tight">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Tasks Section（点击进入任务中心） -->
    <div class="space-y-4" v-if="recentTasks.length > 0">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <Clock class="w-4 h-4 text-slate-400" />
          <span>近期 AI 调研任务</span>
        </h3>
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
          @click="viewRecentTask"
        >
          <span>前往任务中心查看全部</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="task in recentTasks"
          :key="task.id"
          type="button"
          class="group p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer text-left flex flex-col justify-between gap-3"
          @click="viewRecentTask"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
              >
                <CheckCircle2 class="w-3 h-3" />
                已完成
              </span>
              <span class="text-[10px] text-slate-500 font-mono">{{ task.duration }}</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors leading-relaxed">
                {{ task.taskName }}
              </h4>
              <p class="text-[11px] text-slate-500 mt-1">
                {{ task.targetMarket }} · {{ task.platform }} · {{ task.category }}
              </p>
            </div>
          </div>
          <div class="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500">发现机会</span>
            <span class="text-cyan-400 font-bold font-mono">{{ task.opportunitiesFound }} 个</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Live Market Insights Teaser -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
        <div class="text-slate-400 flex items-center justify-between">
          <span>美国 Amazon 宠物类目大盘</span>
          <span class="text-emerald-400 font-bold">+23.4% YoY</span>
        </div>
        <div class="text-xl font-mono font-extrabold text-white">$4.2B / 年</div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          户外出行 (Travel &amp; Outdoor) 与慢食健康赛道增速达 38.4%，处于供需结构红利期。
        </p>
      </div>

      <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
        <div class="text-slate-400 flex items-center justify-between">
          <span>平均单品毛利预期</span>
          <span class="text-cyan-400 font-bold">健康区间</span>
        </div>
        <div class="text-xl font-mono font-extrabold text-white">38.5% – 45.2%</div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          避开 $12 以下低端拼价格带，切入 $19.99 - $25.99 中高端差异化档位。
        </p>
      </div>

      <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
        <div class="text-slate-400 flex items-center justify-between">
          <span>珠三角/长三角供应链成熟度</span>
          <span class="text-indigo-400 font-bold">极高配合度</span>
        </div>
        <div class="text-xl font-mono font-extrabold text-white">30+ 优质源头工厂</div>
        <p class="text-[11px] text-slate-400 leading-relaxed">
          支持 300-500 件小批量试单，开模打样仅需 3-5 天，食品级 Tritan/LFGB 认证齐全。
        </p>
      </div>
    </div>
  </div>
</template>
