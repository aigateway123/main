<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/views/SettingsView.tsx -->
<script setup lang="ts">
import { ref } from 'vue'
import { Check, Database, Save, SlidersHorizontal } from 'lucide-vue-next'
import IpDisclaimerBanner from './IpDisclaimerBanner.vue'

// 高风险告警阈值（技术特征重合度 %）
const similarityThreshold = ref<number>(80)
// FTO (自由实施调查) 比对模式：literal / comprehensive / aggressive
const ftoStrictness = ref<string>('comprehensive')
// 保存成功短暂反馈
const saved = ref(false)
let saveTimer: ReturnType<typeof setTimeout> | null = null

const handleSave = () => {
  saved.value = true
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saved.value = false
  }, 2000)
}

// 数据源连接与法律状态同步 2×2（照原型固定清单）
const dataSources: { name: string; status: string }[] = [
  { name: '中国国家知识产权局 (CNIPA)', status: 'API连接正常 · 延迟 120ms' },
  { name: '美国专利商标局 (USPTO)', status: '全量检索通道就绪 · 延迟 190ms' },
  { name: '欧洲专利局 (EPO / Espacenet)', status: 'EPO DOCDB 镜像已同步' },
  { name: '世界知识产权组织 (WIPO)', status: 'PCT申请周度增量订阅正常' },
]
</script>

<template>
  <div class="p-4 sm:p-5 max-w-3xl mx-auto space-y-4 pb-8">
    <!-- 合规免责横幅 -->
    <IpDisclaimerBanner />

    <!-- 页面头部 + 保存配置 -->
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span class="w-1 h-4 bg-slate-700 rounded-full"></span>
          <span>系统设置与算法配置</span>
        </h2>
        <p class="text-[11px] text-slate-500 mt-0.5">
          配置AI知识产权顾问算法引擎灵敏度、法律风控判定参数与监控频次
        </p>
      </div>

      <button
        type="button"
        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        @click="handleSave"
      >
        <Check v-if="saved" class="w-3.5 h-3.5 text-emerald-300" />
        <Save v-else class="w-3.5 h-3.5" />
        <span>{{ saved ? '配置已保存' : '保存配置' }}</span>
      </button>
    </div>

    <!-- 引擎阈值与算法调控 -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3.5">
      <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
        <SlidersHorizontal class="w-3.5 h-3.5 text-blue-600" />
        <span>侵权风险警报阈值与算法调控</span>
      </h3>

      <div class="space-y-3 text-xs">
        <div>
          <div class="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
            <span>高风险告警阈值（技术特征重合度）</span>
            <span class="font-mono text-rose-600 font-bold">{{ similarityThreshold }}% 及以上标红</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">
            当企业技术特征与竞品独立权利要求的字面或等同重合度超过此数值时，AI将触发高危预警并要求优先比对。
          </p>
          <input
            v-model.number="similarityThreshold"
            type="range"
            min="60"
            max="95"
            class="w-full mt-1.5 accent-blue-600 cursor-pointer"
          />
        </div>

        <!-- FTO 三模式 -->
        <div class="pt-2.5 border-t border-slate-100">
          <label class="font-semibold text-slate-800 block mb-1 text-[11px]">
            FTO (自由实施调查) 比对模式
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
            <button
              type="button"
              class="p-2.5 rounded-lg border text-left transition-all cursor-pointer"
              :class="
                ftoStrictness === 'literal'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              "
              @click="ftoStrictness = 'literal'"
            >
              <div class="font-bold text-xs">全面字面覆盖</div>
              <div class="text-[10px] text-slate-400 mt-0.5 leading-snug">仅排查字面特征完全吻合，漏报率较高，但干扰少。</div>
            </button>

            <button
              type="button"
              class="p-2.5 rounded-lg border text-left transition-all cursor-pointer"
              :class="
                ftoStrictness === 'comprehensive'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-500 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              "
              @click="ftoStrictness = 'comprehensive'"
            >
              <div class="font-bold text-xs flex items-center gap-1">
                <span>字面 + 等同 (推荐)</span>
                <span class="text-[8px] bg-blue-600 text-white px-1 py-0.5 rounded font-mono">DEFAULT</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5 leading-snug">结合手段、功能、效果基本相同综合判定。</div>
            </button>

            <button
              type="button"
              class="p-2.5 rounded-lg border text-left transition-all cursor-pointer"
              :class="
                ftoStrictness === 'aggressive'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              "
              @click="ftoStrictness = 'aggressive'"
            >
              <div class="font-bold text-xs">高灵敏度探针模式</div>
              <div class="text-[10px] text-slate-400 mt-0.5 leading-snug">纳入从属权利要求和说明书潜在分案方向。</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据源连接与法律状态同步 2×2 -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
      <h3 class="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
        <Database class="w-3.5 h-3.5 text-blue-600" />
        <span>数据源连接与法律状态同步状态</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div
          v-for="source in dataSources"
          :key="source.name"
          class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2"
        >
          <div class="min-w-0">
            <span class="font-bold text-slate-800 block text-xs truncate">{{ source.name }}</span>
            <span class="text-[10px] text-emerald-600">{{ source.status }}</span>
          </div>
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
        </div>
      </div>
    </div>
  </div>
</template>
