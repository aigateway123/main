<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/components/HomeView.tsx -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  XCircle,
} from 'lucide-vue-next'
import { mockTaskHistory } from '@/data/tradeIntelData'

const emit = defineEmits<{
  (e: 'start-crawl', payload: { product: string; market: string; targetClients: string; extraRequirements: string; advancedFilters: Record<string, unknown> }): void
  (e: 'view-recent-task', taskId: string): void
  (e: 'direct-view-results'): void
}>()

const product = ref('铝合金门窗')
const market = ref('美国、加拿大')
const targetClients = ref('建材批发商、门窗经销商、建筑材料进口商')
const extraRequirements = ref(
  '优先寻找有进口业务、有门窗产品销售业务、并且可能与中国供应商合作的企业。重点关注符合加州Title 24和北美节能标准的买家。',
)

const showAdvanced = ref(false)

// Advanced filters state
const minScale = ref('50人以上')
const minYear = ref('成立5年以上')
const hasImport = ref(true)
const hasWebsite = ref(true)
const hasDecisionMaker = ref(true)
const minScore = ref(80)
const minMatch = ref(85)

const quickProductTags = ['铝合金断桥窗', '超窄边全景推拉门', 'Low-E节能中空窗', '商业铝合金幕墙']
const quickMarketTags = ['美国、加拿大', '美国加州与德州', '澳大利亚全境', '德国与西欧']
const quickClientTags = ['建材连锁批发商', '门窗系统专业经销商', '住宅建筑工程总包', '门窗组装厂 (Fabricators)']

const handleSubmit = () => {
  emit('start-crawl', {
    product: product.value,
    market: market.value,
    targetClients: targetClients.value,
    extraRequirements: extraRequirements.value,
    advancedFilters: {
      minScale: minScale.value,
      minYear: minYear.value,
      hasImport: hasImport.value,
      hasWebsite: hasWebsite.value,
      hasDecisionMaker: hasDecisionMaker.value,
      minScore: minScore.value,
      minMatch: minMatch.value,
    },
  })
}

const handlePresetFill = (type: 'default' | 'luxury' | 'project') => {
  if (type === 'default') {
    product.value = '铝合金门窗'
    market.value = '美国、加拿大'
    targetClients.value = '建材批发商、门窗经销商、建筑材料进口商'
    extraRequirements.value = '优先寻找有进口业务、有门窗产品销售业务、并且可能与中国供应商合作的企业。'
  } else if (type === 'luxury') {
    product.value = '极窄边框全景推拉门与豪宅定制系统窗'
    market.value = '美国加州、佛罗里达州、英国伦敦'
    targetClients.value = '高端建筑设计院、定制门窗展厅、豪宅承建商'
    extraRequirements.value = '寻找主营高端私宅翻新、需要极简细边框设计及高隔音高气密性的买家。'
  } else {
    product.value = '单元式建筑铝合金幕墙'
    market.value = '加拿大温哥华、多伦多、澳洲悉尼'
    targetClients.value = '商业地产总包商 (General Contractors)、幕墙安装工程商'
    extraRequirements.value = '需具备工程招投标经验，年采购预算超500万美元的大型承建集团。'
  }
}

const appendQuickClientTag = (tag: string) => {
  targetClients.value = targetClients.value ? `${targetClients.value}、${tag}` : tag
}
</script>

<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- 1. Value Proposition Banner (High Density refined) -->
    <div class="rounded-xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2.5 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles class="w-3.5 h-3.5 text-blue-600" />
            <span>专为传统贸易与制造企业打造的商业情报引擎</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            让AI替你的业务员寻找全球生意机会
          </h1>
          <p class="text-xs md:text-sm text-slate-600 leading-relaxed">
            从全球企业信息采集，到客户筛选、企业画像、商机判断与开发邮件生成，<span class="text-blue-600 font-semibold">全链路一次完成</span>。
          </p>
        </div>

        <div class="flex flex-wrap md:flex-col gap-2.5 shrink-0">
          <button
            @click="emit('direct-view-results')"
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FileCheck class="w-4 h-4 text-blue-200" />
            <span>直接查看已生成情报 (237家)</span>
          </button>
          <div class="text-[11px] text-slate-500 text-center font-mono">
            ⚡ 已就绪：30+深度分析海外买家画像
          </div>
        </div>
      </div>

      <!-- 2. Value Contrast: Traditional Way vs AI Way -->
      <div class="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Traditional Way -->
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <XCircle class="w-3.5 h-3.5 text-rose-500" />
              传统人工开发方式 (耗时3-5小时/天)
            </span>
            <span class="text-[10px] text-slate-400 font-mono">效率低 · 误判多 · 易遗漏</span>
          </div>
          <div class="flex items-center gap-1 text-[11px] text-slate-500 overflow-x-auto py-1 font-mono">
            <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 whitespace-nowrap">1. 搜索引擎盲搜</span>
            <span>→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 whitespace-nowrap">2. 逐个打开官网</span>
            <span>→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 whitespace-nowrap">3. 复制整理Excel</span>
            <span>→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 whitespace-nowrap">4. 猜测采购需求</span>
            <span>→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 whitespace-nowrap">5. 翻找邮箱写信</span>
          </div>
        </div>

        <!-- AI Way -->
        <div class="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-blue-600" />
              XX AI 智能情报员 (只需30秒输入)
            </span>
            <span class="text-[10px] text-emerald-700 font-semibold font-mono">全自动 · 深度画像 · 精准破局</span>
          </div>
          <div class="flex items-center gap-1 text-[11px] text-blue-900 overflow-x-auto py-1 font-mono">
            <span class="px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800 font-semibold whitespace-nowrap">1. 输入业务需求</span>
            <span class="text-blue-500 font-bold">→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800 font-semibold whitespace-nowrap">2. 全球多源采集</span>
            <span class="text-blue-500 font-bold">→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800 font-semibold whitespace-nowrap">3. 企业画像清洗</span>
            <span class="text-blue-500 font-bold">→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800 font-semibold whitespace-nowrap">4. 潜力评分判断</span>
            <span class="text-blue-500 font-bold">→</span>
            <span class="px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800 font-semibold whitespace-nowrap">5. 自动生成开发信</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Main Task Input Console -->
    <div class="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search class="w-5 h-5 text-blue-600" />
            <span>「告诉AI，你想找什么」</span>
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            只需输入您的核心产品与目标市场，AI情报员将自动扫描全球公开海关提单、商业注册、行业展会及企业官网。
          </p>
        </div>

        <!-- Quick preset pills -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-slate-500">行业范例:</span>
          <button
            type="button"
            @click="handlePresetFill('default')"
            class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 transition-colors cursor-pointer font-medium"
          >
            铝合金门窗 (默认)
          </button>
          <button
            type="button"
            @click="handlePresetFill('luxury')"
            class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 transition-colors cursor-pointer font-medium"
          >
            高端全景推拉门
          </button>
          <button
            type="button"
            @click="handlePresetFill('project')"
            class="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 transition-colors cursor-pointer font-medium"
          >
            商业建筑幕墙工程
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-5">
        <!-- Row 1: Product & Market -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Product / Business -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>1. 产品 / 主营业务</span>
              <span class="text-[11px] text-blue-600 font-normal">支持具体品类或核心技术</span>
            </label>
            <div class="relative">
              <input
                v-model="product"
                type="text"
                placeholder="例如: 铝合金门窗、断桥铝系统窗..."
                class="w-full px-4 py-2.5 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <!-- Quick tags -->
            <div class="flex items-center gap-1.5 flex-wrap pt-1">
              <span class="text-[10px] text-slate-400">热门参考:</span>
              <button
                v-for="tag in quickProductTags"
                :key="tag"
                type="button"
                @click="product = tag"
                class="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                + {{ tag }}
              </button>
            </div>
          </div>

          <!-- Target Market -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>2. 目标市场 / 国家地区</span>
              <span class="text-[11px] text-blue-600 font-normal">支持多国家或特定州郡</span>
            </label>
            <div class="relative">
              <input
                v-model="market"
                type="text"
                placeholder="例如: 美国、加拿大、澳大利亚..."
                class="w-full px-4 py-2.5 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <!-- Quick tags -->
            <div class="flex items-center gap-1.5 flex-wrap pt-1">
              <span class="text-[10px] text-slate-400">推荐区域:</span>
              <button
                v-for="tag in quickMarketTags"
                :key="tag"
                type="button"
                @click="market = tag"
                class="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                + {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Row 2: Target Clients -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>3. 目标客户类型</span>
            <span class="text-[11px] text-slate-500">批发商、经销商、进口商、工程总包、零售商等</span>
          </label>
          <input
            v-model="targetClients"
            type="text"
            placeholder="例如: 建材批发商、门窗经销商、建筑材料进口商、建筑工程公司..."
            class="w-full px-4 py-2.5 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            required
          />
          <div class="flex items-center gap-1.5 flex-wrap pt-1">
            <span class="text-[10px] text-slate-400">买家类型:</span>
            <button
              v-for="tag in quickClientTags"
              :key="tag"
              type="button"
              @click="appendQuickClientTag(tag)"
              class="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              + {{ tag }}
            </button>
          </div>
        </div>

        <!-- Row 3: Extra Requirements -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>4. 额外智能筛选与偏好要求 (自然语言输入)</span>
            <span class="text-[11px] text-blue-600 font-normal">AI将按此逻辑深度识别买家合作契合度</span>
          </label>
          <textarea
            v-model="extraRequirements"
            rows="3"
            placeholder="例如: 优先寻找有进口业务、有门窗产品销售业务、并且可能与中国供应商合作的企业..."
            class="w-full px-4 py-2.5 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
          />
        </div>

        <!-- Advanced Filters Accordion -->
        <div class="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
          <button
            type="button"
            @click="showAdvanced = !showAdvanced"
            class="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer bg-slate-50"
          >
            <div class="flex items-center gap-2">
              <SlidersHorizontal class="w-4 h-4 text-blue-600" />
              <span>高级精准过滤条件 (企业规模、成立时间、海关记录、联系方式校验)</span>
            </div>
            <div class="flex items-center gap-1 text-blue-600 text-xs font-bold">
              <span>{{ showAdvanced ? '收起设置' : '展开设置' }}</span>
              <ChevronUp v-if="showAdvanced" class="w-4 h-4" />
              <ChevronDown v-else class="w-4 h-4" />
            </div>
          </button>

          <div v-if="showAdvanced" class="p-5 border-t border-slate-200 space-y-4 text-xs bg-white">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Enterprise Scale -->
              <div>
                <label class="block text-slate-600 mb-1.5 font-medium">企业规模</label>
                <select
                  v-model="minScale"
                  class="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
                >
                  <option value="不限规模">不限规模</option>
                  <option value="20人以上">20人以上 (中型零售/经销)</option>
                  <option value="50人以上">50人以上 (区域批发商)</option>
                  <option value="100人以上">100人以上 (大型建材连锁)</option>
                </select>
              </div>

              <!-- Founding Year -->
              <div>
                <label class="block text-slate-600 mb-1.5 font-medium">成立时间</label>
                <select
                  v-model="minYear"
                  class="w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 text-xs cursor-pointer"
                >
                  <option value="不限年份">不限年份</option>
                  <option value="成立3年以上">成立3年以上 (业务稳定)</option>
                  <option value="成立5年以上">成立5年以上 (渠道成熟)</option>
                  <option value="成立10年以上">成立10年以上 (老牌信誉)</option>
                </select>
              </div>

              <!-- Min Score Threshold -->
              <div>
                <label class="block text-slate-600 mb-1.5 font-medium">
                  AI潜力评分阈值: <span class="text-blue-600 font-bold">{{ minScore }}分</span>
                </label>
                <input
                  v-model.number="minScore"
                  type="range"
                  min="60"
                  max="95"
                  class="w-full accent-blue-600 cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>60分 (普通)</span>
                  <span>80分 (高潜)</span>
                  <span>90+分 (重点)</span>
                </div>
              </div>

              <!-- Min Product Match -->
              <div>
                <label class="block text-slate-600 mb-1.5 font-medium">
                  产品匹配度最低: <span class="text-blue-600 font-bold">{{ minMatch }}%</span>
                </label>
                <input
                  v-model.number="minMatch"
                  type="range"
                  min="60"
                  max="95"
                  class="w-full accent-blue-600 cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>60%</span>
                  <span>85%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>

            <!-- Checklist toggles -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs">
              <label class="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-900">
                <input
                  v-model="hasImport"
                  type="checkbox"
                  class="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                <span>必须有海关进口记录 (US Customs / Panjiva 提单已验证)</span>
              </label>

              <label class="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-900">
                <input
                  v-model="hasWebsite"
                  type="checkbox"
                  class="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                <span>企业官网必须在营且已解析产品类目</span>
              </label>

              <label class="flex items-center gap-2 text-slate-700 cursor-pointer hover:text-slate-900">
                <input
                  v-model="hasDecisionMaker"
                  type="checkbox"
                  class="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                />
                <span>已锁定关键决策人 (采购主管 / VP / 总工 / 负责人邮箱)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Action Row -->
        <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            <span>智能采集已集成全球 12 种公开商业渠道与交叉语义验证</span>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              @click="handlePresetFill('default')"
              class="px-4 py-2.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-sm"
            >
              <RotateCcw class="w-3.5 h-3.5 text-slate-500" />
              <span>重置为默认演示</span>
            </button>

            <button
              type="submit"
              class="flex-1 sm:flex-none px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles class="w-4 h-4 text-blue-200" />
              <span>开始 AI 全球情报采集</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- 4. Recent Tasks Card Section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Clock class="w-4 h-4 text-slate-500" />
          <h3 class="text-sm font-bold text-slate-900">最近情报采集任务</h3>
        </div>
        <span class="text-xs text-slate-500">历史任务均支持一键回溯与实时数据刷新</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="task in mockTaskHistory"
          :key="task.id"
          @click="emit('view-recent-task', task.id)"
          class="group p-4 rounded-xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-sm flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 class="w-3 h-3" />
                已完成
              </span>
              <span class="text-[11px] text-slate-400 font-mono">{{ task.date }}</span>
            </div>

            <div>
              <h4 class="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {{ task.title }}
              </h4>
              <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {{ task.product }} · {{ task.market }}
              </p>
            </div>
          </div>

          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span class="text-slate-500">潜在客户: </span>
              <span class="text-blue-600 font-bold font-mono">{{ task.qualifiedCount }} 家</span>
            </div>
            <div class="flex items-center gap-1 text-slate-500 group-hover:text-blue-600 text-[11px] font-medium">
              <span>查看详情</span>
              <ArrowRight class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
