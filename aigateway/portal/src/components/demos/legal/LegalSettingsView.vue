<!-- ============================================================================
     AI 法务员工 · AI法务员工系统设置与审查策略（深色）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/settings/SettingsView.tsx
     props/emits：无（容器 settings 视图直接渲染）
     数据：策略卡/敏感度/免责提示均为原型硬编码（React 原型即无 mock 依赖）
     图标映射：Sliders 在 lucide-vue-next 0.577 已移除（原型未渲染，未引入）；
           Settings/Bell/Users 原型未渲染，未引入；仅用到 Shield / Save / Check
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ref } from 'vue'
import { Check, Save, Shield } from 'lucide-vue-next'

type ReviewStrategy = 'strict' | 'balanced' | 'business'

const strategy = ref<ReviewStrategy>('strict')
const sensitivity = ref<'high' | 'medium'>('high')
const saved = ref(false)

const STRATEGIES: { key: ReviewStrategy; label: string; desc: string }[] = [
  { key: 'strict', label: '买方严苛风控型（推荐）', desc: '全面侧重保障我方资金安全与违约救济，对预付款、验收及免责条款零容忍' },
  { key: 'balanced', label: '商业对等平衡型', desc: '兼顾签约履约效率与权利对等，适合常规业务合同' },
  { key: 'business', label: '促成签约导向型', desc: '仅拦截极端红线风险，尽可能保障商务快速签单' },
]

const handleSave = () => {
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div class="space-y-6 pb-12 max-w-4xl mx-auto animate-in fade-in duration-200">
    <!-- Header -->
    <div class="border-b border-slate-800 pb-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          平台配置
        </span>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 tracking-tight mt-1">
        AI法务员工系统设置与审查策略
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        定制企业专属审查严谨度、风险阈值与示范条款输出倾向
      </p>
    </div>

    <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
      <!-- 审查风控策略 -->
      <div class="space-y-3">
        <label class="block text-xs font-bold text-slate-200 uppercase tracking-wider">
          AI 审查风控策略模型
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            v-for="item in STRATEGIES"
            :key="item.key"
            type="button"
            @click="strategy = item.key"
            class="p-4 rounded-xl border text-left transition-all cursor-pointer"
            :class="strategy === item.key
              ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/30'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'"
          >
            <div class="text-xs font-bold text-slate-100">{{ item.label }}</div>
            <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">{{ item.desc }}</p>
          </button>
        </div>
      </div>

      <!-- 风险识别敏感度 -->
      <div class="space-y-3 pt-4 border-t border-slate-800">
        <label class="block text-xs font-bold text-slate-200 uppercase tracking-wider">
          风险识别敏感度
        </label>
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="sensitivity"
              type="radio"
              value="high"
              name="sens"
              class="text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-950"
            />
            <span class="font-semibold text-slate-200">高敏感度（发现细微瑕疵，如7天验收即默示合格）</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="sensitivity"
              type="radio"
              value="medium"
              name="sens"
              class="text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-950"
            />
            <span class="text-slate-400">中敏感度（主要关注实质性履约违约与资金风险）</span>
          </label>
        </div>
      </div>

      <!-- 法律免责特别提示常驻机制 -->
      <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
        <div class="font-bold text-slate-200 flex items-center gap-1.5">
          <Shield class="w-4 h-4 text-blue-400" />
          <span>法律免责特别提示常驻机制（已强制开启）</span>
        </div>
        <p class="leading-relaxed text-slate-400">
          根据法律科技合规准则，所有由AI生成之审查结果、示范条款与法规解答，均依法展示《免责声明》以确保符合企业法务内控规范。
        </p>
      </div>

      <div class="flex justify-end pt-2">
        <button
          type="button"
          @click="handleSave"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm cursor-pointer"
        >
          <template v-if="saved">
            <Check class="w-4 h-4 text-white" />
            <span>配置已保存生效</span>
          </template>
          <template v-else>
            <Save class="w-4 h-4" />
            <span>保存策略设置</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
