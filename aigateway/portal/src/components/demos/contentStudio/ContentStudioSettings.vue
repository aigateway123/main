<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Users, Shield, Cpu, CreditCard, CheckCircle, Plus, Trash2, Lock } from 'lucide-vue-next'
import { INITIAL_MEMBERS } from '@/data/contentStudioData'

const activeTab = ref<'team' | 'models' | 'billing'>('team')
const members = ref([...INITIAL_MEMBERS])
const newMemName = ref('')
const newMemRole = ref('运营经理 (Ops Specialist)')
const newMemEmail = ref('')
const selectedPlan = ref<'standard' | 'pro' | 'enterprise'>('pro')

const TABS = [
  { id: 'team' as const, label: '团队与子账号分配', icon: Users },
  { id: 'models' as const, label: '大语言模型首发路由', icon: Cpu },
  { id: 'billing' as const, label: '订阅套餐与商户支付', icon: CreditCard },
]

const handleAddMember = () => {
  if (!newMemName.value || !newMemEmail.value) return
  members.value = [...members.value, { name: newMemName.value, role: newMemRole.value, email: newMemEmail.value, status: 'Pending' }]
  newMemName.value = ''
  newMemEmail.value = ''
}

const handleRemoveMember = (idx: number) => {
  members.value = members.value.filter((_, i) => i !== idx)
}
const handleUpgrade = () => window.alert('测试环境已模拟：1秒内极速升级成功，感谢支持！')

const PLANS = [
  {
    id: 'standard' as const,
    name: '个人极度体验版',
    price: '免费体验',
    unit: '',
    desc: '包含每日免费爆文雷达 10 次，AI 文案生成 3 篇。无需绑定商户渠道。',
    footer: '随时过期体验',
  },
  {
    id: 'pro' as const,
    name: '机构专业矩阵版',
    price: '￥ 199',
    unit: '/ 月',
    desc: '不配比调用上限。畅享 6 大自主 Agent 编排终端训练、批量起号爆文拆析、50条评论截流文案生成。',
    footer: '正在使用当前席位套餐',
    hot: true,
  },
  {
    id: 'enterprise' as const,
    name: 'MCN尊贵定制版',
    price: '￥ 899',
    unit: '/ 月',
    desc: '支持部署 100+ 子账户，1对1专家运营，专属定制小红书违规卡点自动扫描和API私有代理部署。',
    footer: '高端尊贵定制席位',
  },
]
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- 标题 -->
    <div>
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <Settings class="w-5 h-5 text-pink-500" />
        系统与企业级设置 Settings
      </h2>
      <p class="text-xs text-zinc-400 mt-1">管理机构子账户分配、模型首发配流路由、API 密钥可用状态检验检测，以及企业成长升级付费套餐。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- 左侧 tab -->
      <div class="lg:col-span-3 flex flex-col gap-1.5 p-3 rounded-xl bg-[#0c0c0e] border border-zinc-900">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer"
          :class="activeTab === tab.id ? 'bg-zinc-900 text-pink-400 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-200'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-4 h-4 shrink-0" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- 右侧内容 -->
      <div class="lg:col-span-9 p-5 rounded-xl bg-[#0c0c0e] border border-zinc-800/80 space-y-6">
        <!-- TAB 1: 团队 -->
        <template v-if="activeTab === 'team'">
          <div>
            <h3 class="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Users class="w-4 h-4 text-pink-500" />
              MCN 团队机构子账号管理
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">多子账号协同，支持同时部署十个以上起号矩阵账号</p>
          </div>
          <div class="space-y-2">
            <div v-for="(mem, idx) in members" :key="idx" class="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900 flex items-center justify-between font-mono text-xs">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 font-bold text-[11px]">{{ mem.name[0] }}</div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-zinc-200">{{ mem.name }}</span>
                    <span class="text-[9px] px-1.5 py-0.5 rounded font-semibold border" :class="mem.status === 'Active' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' : 'bg-amber-950/30 text-amber-400 border-amber-900/30'">
                      {{ mem.status === 'Active' ? '激活' : '受邀' }}
                    </span>
                  </div>
                  <p class="text-[10px] text-zinc-500 mt-0.5">{{ mem.email }} • {{ mem.role }}</p>
                </div>
              </div>
              <button class="p-1 px-2.5 rounded bg-zinc-950 hover:bg-rose-950/20 border border-zinc-900 hover:border-rose-900/30 text-[10px] text-zinc-500 hover:text-rose-400 cursor-pointer transition-all flex items-center gap-1" @click="handleRemoveMember(idx)">
                <Trash2 class="w-3.5 h-3.5" />
                <span>移出</span>
              </button>
            </div>
          </div>
          <div class="p-4 rounded-lg bg-zinc-950/30 border border-zinc-900 space-y-3">
            <h4 class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">邀请新运营伙计 (Invite partner)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input v-model="newMemName" type="text" placeholder="成员称呼 (如: 甜甜)" class="px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500" />
              <input v-model="newMemEmail" type="email" placeholder="邮箱地址 (例如: tian@mcn.com)" class="px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500" />
              <select v-model="newMemRole" class="px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-pink-500">
                <option value="运营主理 (Core Ops Manager)">运营主理 (Core Ops Manager)</option>
                <option value="文案创作家 (Copy Writer)">文案创作家 (Copy Writer)</option>
                <option value="电商投放手 (Media Buyer)">电商投放手 (Media Buyer)</option>
              </select>
            </div>
            <div class="pt-1 flex justify-end">
              <button class="px-4 py-1.5 rounded bg-pink-500 hover:bg-pink-600 text-xs font-bold text-white flex items-center gap-1 shadow-lg shadow-pink-500/10 cursor-pointer" @click="handleAddMember">
                <Plus class="w-3.5 h-3.5" />
                <span>添加受邀成员</span>
              </button>
            </div>
          </div>
        </template>

        <!-- TAB 2: 模型 -->
        <template v-else-if="activeTab === 'models'">
          <div>
            <h3 class="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu class="w-4 h-4 text-pink-500" />
              大语言模型及统一云大脑设置
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">管理底层接口路由。系统已针对小红书爆款风格进行多维度专项预调优。</p>
          </div>
          <div class="space-y-3 font-mono text-[11px]">
            <div class="p-4 rounded-lg bg-zinc-950 border border-zinc-900 border-l-2 border-l-emerald-500 flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-zinc-200 text-xs">Google Gemini 3.5-flash (默认)</span>
                  <span class="text-[9px] bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 px-1 rounded font-semibold">首要主选</span>
                </div>
                <p class="text-zinc-500 text-[10px] font-sans">承担快速选题、心智解剖和对话抗阻模组。反应用时 400-800ms。</p>
              </div>
              <CheckCircle class="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <div class="p-4 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-zinc-400 text-xs">DeepSeek V3 (爆款强化)</span>
                  <span class="text-[9px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-1 rounded">可作为热备份</span>
                </div>
                <p class="text-zinc-600 text-[10px] font-sans">由小红书千万级高赞文案语料强效微修。针对特定客群痛点更犀利。</p>
              </div>
              <Lock class="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>
            <div class="p-4 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-zinc-400 text-xs">Claude 3.5 Sonnet (长镜头)</span>
                </div>
                <p class="text-zinc-600 text-[10px] font-sans">专用于长视频多镜框分阶台词和极其复杂的商业大推案。客满并发调用时可用。</p>
              </div>
              <Lock class="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>
          </div>
          <div class="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900 space-y-2">
            <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield class="w-4 h-4 text-pink-500" />
              API 密钥及安全规则声明
            </span>
            <p class="text-[11px] text-zinc-400 leading-relaxed font-sans">爆款工厂采取零侵入、纯密闭的安全机制。系统 API Key 来自平台底层 Secrets 注入。我们承诺不会在浏览器或任何前端明文包内流出、记录您的私密信息。</p>
            <div class="pt-2 text-[10px] font-mono text-pink-400 flex items-center gap-1">
              <span>状态：</span>
              <span class="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30">GEMINI_API_KEY 已于云端秘密预装载 (OK)</span>
            </div>
          </div>
        </template>

        <!-- TAB 3: 套餐 -->
        <template v-else>
          <div>
            <h3 class="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard class="w-4 h-4 text-pink-500" />
              套餐订阅与商户收单系统
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">灵活扩展流量包。支持按单充值以及按月包养模式。</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="plan in PLANS"
              :key="plan.id"
              class="p-4 rounded-xl border flex flex-col justify-between h-64 cursor-pointer transition-all relative"
              :class="selectedPlan === plan.id ? 'bg-zinc-950 border-pink-500 shadow-lg shadow-pink-500/10' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'"
              @click="selectedPlan = plan.id"
            >
              <span v-if="plan.hot" class="absolute top-2.5 right-2.5 text-[9px] bg-pink-500 text-white font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wide scale-90">最热首选</span>
              <div class="space-y-2">
                <p class="text-[10px] font-bold uppercase tracking-wide" :class="selectedPlan === plan.id ? 'text-pink-400' : 'text-zinc-400'">{{ plan.name }}</p>
                <p class="text-xl font-extrabold text-white font-display">{{ plan.price }} <span v-if="plan.unit" class="text-xs text-zinc-500 font-normal">{{ plan.unit }}</span></p>
                <p class="text-[10px] leading-relaxed font-sans" :class="selectedPlan === plan.id ? 'text-zinc-400' : 'text-zinc-500'">{{ plan.desc }}</p>
              </div>
              <span class="text-[10px] font-bold font-mono" :class="selectedPlan === plan.id ? 'text-pink-400' : 'text-zinc-500'">{{ plan.footer }}</span>
            </div>
          </div>
          <div class="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
            <div>
              <h4 class="text-xs font-bold text-zinc-200">升级 / 续订商户支付结算</h4>
              <p class="text-[10px] text-zinc-500 mt-0.5">快捷绑定主流结汇渠道，全自动开具电子增长专票。</p>
            </div>
            <button class="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-xs font-bold text-white shadow-lg shadow-pink-500/10 cursor-pointer" @click="handleUpgrade">
              一键安全结算升级
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
