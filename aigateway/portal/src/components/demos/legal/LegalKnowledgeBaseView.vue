<!-- ============================================================================
     AI 法务员工 · 企业法务知识库与智能问答（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/knowledge/KnowledgeBaseView.tsx
     数据：MOCK_KNOWLEDGE_DOCS（8 套知识文档）+ 制度文件清单（照原型硬编码）
     tab1 标准合同范本库：搜索 + 九大分类筛选（KnowledgeDocument.category）+ 文档卡片 + 预览 modal
     tab2 AI 法务制度智能问答：模拟 grounded 回复（关键词分支 + citations，照原型）
     tab3 公司合规与制度文件（照原型静态清单）
     图标映射：CheckCircle2→CircleCheck、FileCheck2→FileCheck（0.577 新命名）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Bot, CircleCheck, Download, FileText, Search, Send, X } from 'lucide-vue-next'
import { MOCK_KNOWLEDGE_DOCS } from '@/data/legalMockData'
import type { KnowledgeDocument } from '@/data/legalIntelData'

type ActiveTab = 'templates' | 'qa' | 'policies'
type ChatSender = 'user' | 'ai'

interface ChatMessage {
  id: string
  sender: ChatSender
  text: string
  citations?: string[]
}

// 知识库九大分类（照 KnowledgeDocument.category 类型定义）
const DOC_CATEGORIES = [
  '全部',
  '合同模板',
  '历史合同',
  '法律制度',
  '企业制度',
  '知识产权',
  '合规文件',
  '历史审查报告',
  '律师意见',
  '历史案例',
] as const

const activeTab = ref<ActiveTab>('templates')
const searchQuery = ref('')
const activeCategory = ref<string>('全部')
const selectedTemplate = ref<KnowledgeDocument | null>(null)

// 每类文档计数（数字全部派生自 MOCK_KNOWLEDGE_DOCS）
const categoryCount = (cat: string): number =>
  cat === '全部' ? MOCK_KNOWLEDGE_DOCS.length : MOCK_KNOWLEDGE_DOCS.filter((d) => d.category === cat).length

const filteredTemplates = computed<KnowledgeDocument[]>(() => {
  return MOCK_KNOWLEDGE_DOCS.filter((t) => {
    const matchCat = activeCategory.value === '全部' || t.category === activeCategory.value
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !searchQuery.value ||
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    return matchCat && matchSearch
  })
})

// ---- AI 制度问答（照原型初始会话 + grounded 关键词应答） ----
const chatInput = ref('')
const chatMessages = ref<ChatMessage[]>([
  {
    id: '1',
    sender: 'ai',
    text: '您好！我是企业法务专属AI员工。我已经通读并掌握了公司所有的历史合同标准范本、员工手册、采购制度及涉外合规指引。您可以随时向我提问关于企业内部法务流程或标准条款的问题。',
  },
  {
    id: '2',
    sender: 'user',
    text: '公司采购单笔超过100万的设备，付款比例的内部法务红线是什么？',
  },
  {
    id: '3',
    sender: 'ai',
    text: '根据《集团重大设备采购管理办法》第4.2条及法务部《采购合同审查标准化指引》：\n\n1. 单笔金额超过100万元的设备采购，【预付款比例最高不得超过30%】；\n2. 若供应商坚持要求40%以上预付款，必须由供应商出具银行见索即付保函，并经法务总监与财务总监双重特批；\n3. 质保金（尾款）保留比例不得低于合同总额的10%，质保期一般要求为终验收合格后至少12个月。',
    citations: ['《集团重大设备采购管理办法》第4.2条', '《采购合同审查标准化指引（2026修订）》'],
  },
])
let aiReplyTimer: ReturnType<typeof setTimeout> | null = null

const handleSendMessage = () => {
  const content = chatInput.value.trim()
  if (!content) return
  chatMessages.value.push({ id: Date.now().toString(), sender: 'user', text: content })
  const currentQ = content
  chatInput.value = ''

  if (aiReplyTimer) clearTimeout(aiReplyTimer)
  aiReplyTimer = setTimeout(() => {
    let aiText = ''
    let citations: string[] = []
    if (currentQ.includes('违约金') || currentQ.includes('滞纳金')) {
      aiText = '依据民法典第585条及公司标准合同范本：公司对外采购合同时，日违约金标准默认应设定为合同总额的万分之五（0.05%），累计上限不超过总额的20%。若相对方提出单边低封顶（如2%），法务审查应予以驳回。'
      citations = ['《企业标准采购示范条款库》第8条']
    } else if (currentQ.includes('竞业') || currentQ.includes('离职')) {
      aiText = '依据公司《高级技术人员竞业限制协议范本》：离职后竞业限制期限最长不超过24个月，竞业补偿金每月按照员工离职前12个月月平均工资的30%至50%发放，按月转入其工资卡账户并保留打款凭证。'
      citations = ['《商业秘密与竞业限制管理制度》', '《劳动合同法》第23条']
    } else {
      aiText = `已在企业法务知识库中检索到关于“${currentQ}”的相关规定：建议在签署前由归口法务审核具体条款细节，确保权利义务对等并符合内部授权审批流程。`
      citations = ['《企业内部法务审查规程》']
    }
    chatMessages.value.push({ id: (Date.now() + 1).toString(), sender: 'ai', text: aiText, citations })
  }, 600)
}

// ---- 制度文件清单（照原型硬编码 5 份） ----
const POLICY_DOCS: { name: string; dept: string; update: string; size: string }[] = [
  { name: '《集团采购合同全生命周期审查标准指引（2026年版）》', dept: '法务部', update: '2026-01-15', size: '2.4 MB' },
  { name: '《商业秘密保护与核心员工竞业限制实施办法》', dept: '法务与人力中心', update: '2025-11-20', size: '1.8 MB' },
  { name: '《对外贸易出海合规与出口管制防范工作手册》', dept: '涉外法务处', update: '2026-02-10', size: '3.6 MB' },
  { name: '《企业印章管理与用印审批风险控制规程》', dept: '总经办/法务部', update: '2025-08-01', size: '920 KB' },
  { name: '《知识产权申请、维护与反侵权救济操作指南》', dept: '知识产权部', update: '2025-10-18', size: '4.1 MB' },
]

const handleDownloadTemplate = (title: string) => {
  window.alert(`已开始下载标准范本：《${title}》`)
}

// 制度文件调阅（照原型 alert 占位）
const handleReadPolicyDoc = (docName: string) => {
  window.alert(`已开始调阅文档：${docName}`)
}

const handleDownloadModalTemplate = () => {
  if (selectedTemplate.value) {
    window.alert(`已下载《${selectedTemplate.value.title}》Word/PDF版本`)
    selectedTemplate.value = null
  }
}

onBeforeUnmount(() => {
  if (aiReplyTimer) clearTimeout(aiReplyTimer)
})
</script>

<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          企业法务专属知识大脑
        </span>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
        企业法务知识库与智能问答
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        沉淀企业内部合同标准范本、规章制度、历史诉讼与法务风控指南，支持AI自然语言语义检索
      </p>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-slate-800 space-x-6 text-sm font-semibold overflow-x-auto">
      <button
        type="button"
        @click="activeTab = 'templates'"
        class="pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap"
        :class="activeTab === 'templates' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        标准合同范本库 (8套)
      </button>
      <button
        type="button"
        @click="activeTab = 'qa'"
        class="pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        :class="activeTab === 'qa' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <Bot class="w-4 h-4 text-blue-400" />
        <span>AI 法务制度智能问答</span>
      </button>
      <button
        type="button"
        @click="activeTab = 'policies'"
        class="pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap"
        :class="activeTab === 'policies' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        公司合规与制度文件 (14份)
      </button>
    </div>

    <!-- Tab 1: 标准合同范本库 -->
    <div v-if="activeTab === 'templates'" class="space-y-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div class="relative flex-1 max-w-md">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索标准合同模板..."
            class="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <span class="text-xs text-slate-400">已通过企业法务部审定认证并加盖电子版本签章</span>
      </div>

      <!-- 分类筛选 chips（计数全部派生自 MOCK_KNOWLEDGE_DOCS） -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <button
          v-for="cat in DOC_CATEGORIES"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          class="px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer border"
          :class="
            activeCategory === cat
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          "
        >
          {{ cat }}
          <span class="ml-1 opacity-70 font-mono">{{ categoryCount(cat) }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          class="bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 font-bold border border-blue-800/60">
                {{ tpl.category }}
              </span>
              <span class="text-[11px] text-slate-400 font-mono">{{ tpl.format }} · {{ tpl.fileSize }}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-100 mb-1.5">{{ tpl.title }}</h3>
            <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {{ tpl.summary }}
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">调用/下载: {{ tpl.usageCount }} 次</span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="selectedTemplate = tpl"
                class="text-xs text-slate-300 hover:text-white font-medium px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                预览范本
              </button>
              <button
                type="button"
                @click="handleDownloadTemplate(tpl.title)"
                class="text-xs text-blue-300 hover:text-white font-semibold px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60 hover:bg-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <Download class="w-3.5 h-3.5" />
                <span>下载</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空态 -->
      <div
        v-if="filteredTemplates.length === 0"
        class="bg-slate-900/60 rounded-xl border border-slate-800 p-10 text-center text-sm text-slate-400"
      >
        「{{ activeCategory }}」分类下暂无匹配文档，请切换分类或调整搜索关键词。
      </div>
    </div>

    <!-- Tab 2: AI 法务制度智能问答 -->
    <div
      v-else-if="activeTab === 'qa'"
      class="bg-slate-900/60 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]"
    >
      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/60 legal-custom-scrollbar">
        <div
          v-for="msg in chatMessages"
          :key="msg.id"
          class="flex gap-3 max-w-2xl"
          :class="msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            :class="msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-900/80 text-blue-300 border border-blue-700/60 shadow-sm'"
          >
            <Bot v-if="msg.sender !== 'user'" class="w-4 h-4" />
            <span v-else>我</span>
          </div>

          <div
            class="p-4 rounded-2xl text-xs sm:text-sm leading-relaxed"
            :class="msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'"
          >
            <div class="whitespace-pre-wrap">{{ msg.text }}</div>

            <div
              v-if="msg.citations && msg.citations.length > 0"
              class="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-1"
            >
              <div class="font-semibold text-slate-300">知识依据：</div>
              <div v-for="(cit, i) in msg.citations" :key="i" class="flex items-center gap-1 text-blue-300">
                <CircleCheck class="w-3 h-3 text-blue-400" />
                <span>{{ cit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <form class="p-4 bg-slate-900 border-t border-slate-800 flex gap-2" @submit.prevent="handleSendMessage">
        <input
          v-model="chatInput"
          type="text"
          placeholder="向AI法务员工提问（例如：公司针对违约金标准的内部上限是多少？高管离职竞业限制如何约定？）..."
          class="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <button
          type="submit"
          class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <span>提问</span>
          <Send class="w-3.5 h-3.5" />
        </button>
      </form>
    </div>

    <!-- Tab 3: 公司合规与制度文件 -->
    <div v-else class="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
      <div class="text-sm font-bold text-slate-100">企业内部合规制度文件清单</div>
      <div class="divide-y divide-slate-800">
        <div
          v-for="(doc, idx) in POLICY_DOCS"
          :key="idx"
          class="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
        >
          <div class="flex items-center gap-3">
            <FileText class="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div class="text-xs font-bold text-slate-200">{{ doc.name }}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">归口部门：{{ doc.dept }} · 最后修订：{{ doc.update }}</div>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-xs font-mono text-slate-400">{{ doc.size }}</span>
            <button
              type="button"
              @click="handleReadPolicyDoc(doc.name)"
              class="text-xs font-semibold text-blue-300 hover:text-white px-3 py-1 rounded bg-blue-950 border border-blue-800/60 hover:bg-blue-900 cursor-pointer"
            >
              调阅
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <div
      v-if="selectedTemplate"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div class="bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-800 max-h-[85vh] flex flex-col overflow-hidden">
        <div class="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 class="text-base font-bold text-slate-100">{{ selectedTemplate.title }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">文件格式：{{ selectedTemplate.format }} · 大小：{{ selectedTemplate.fileSize }} · 分类：{{ selectedTemplate.category }}</p>
          </div>
          <button type="button" @click="selectedTemplate = null" class="text-slate-400 hover:text-white cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-200 bg-slate-950/60 leading-relaxed legal-custom-scrollbar">
          <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <div class="font-bold text-slate-100 mb-1">【范本文档概要】</div>
            <p class="text-slate-300 leading-relaxed">{{ selectedTemplate.summary }}</p>
          </div>
          <div class="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <div class="font-bold text-slate-100 mb-2">【知识库关联标签】</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in selectedTemplate.tags"
                :key="tag"
                class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
          <div class="p-4 bg-blue-950/30 rounded-xl border border-blue-800/40 text-blue-200">
            <div class="font-bold mb-1 text-blue-300">【企业法务审定说明】</div>
            <p class="text-xs text-blue-200/90">
              本范本已根据最新民法典买卖合同编及最高人民法院相关裁判规则完成结构化合规审校，内嵌争议解决示范条款与违约救济机制。
            </p>
          </div>
        </div>

        <div class="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-400">本范本经由法务部合规审核，可根据具体商务谈判调整</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="selectedTemplate = null"
              class="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              关闭
            </button>
            <button
              type="button"
              @click="handleDownloadModalTemplate"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              下载本范本
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
