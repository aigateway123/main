<!-- 转译自：docs/仓库/xx-ai-·-ai贸易情报员/src/App.tsx（332-404 行 · 3 分钟客户路演话术内联 Modal 区块） -->
<script setup lang="ts">
import { HelpCircle, X } from 'lucide-vue-next'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div class="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <HelpCircle class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">3分钟客户路演标准演示流程与话术向导</h3>
              <p class="text-xs text-slate-500">帮助销售与业务团队向客户清晰传达「AI贸易情报员」的核心价值</p>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 3-Minute Pitch Script Cards -->
        <div class="space-y-4 text-xs">
          <!-- Minute 1 -->
          <div class="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="font-bold text-blue-900 text-sm">第 1 分钟：输入业务需求 &amp; AI自动化采集</span>
              <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">00:00 - 01:00</span>
            </div>
            <p class="text-slate-700 leading-relaxed">
              <strong>演示动作：</strong> 在首页点击默认预设「铝合金门窗 · 北美市场」，点击「启动 AI 采集与情报分析」，展示 10 步实时全网清洗流。
            </p>
            <p class="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
              💬 <strong>话术要点：</strong> “传统业务员每天要在Google、海关数据、B2B平台翻找几百个网页。现在只需输入一句话，AI自动在全网142个口岸提单和海外官网完成抓取清洗，30秒完成业务员3天的工作量。”
            </p>
          </div>

          <!-- Minute 2 -->
          <div class="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="font-bold text-amber-900 text-sm">第 2 分钟：客户筛选、五维评分与深度画像</span>
              <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">01:00 - 02:00</span>
            </div>
            <p class="text-slate-700 leading-relaxed">
              <strong>演示动作：</strong> 进入客户情报矩阵，点击第一家「ABC Building Supply」，展示五维评分雷达图、合作切入点、海关提单真实记录与关键决策人。
            </p>
            <p class="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
              💬 <strong>话术要点：</strong> “AI不仅能找名单，更能进行深度尽调。你看这里：自动识别出这家加州批发商现有本地供应商交期长达14周，而且有从中国进口铝合金的历史，商机分高达92分，这就是最精准的A级目标。”
            </p>
          </div>

          <!-- Minute 3 -->
          <div class="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="font-bold text-emerald-900 text-sm">第 3 分钟：AI 一键生成高转化定制开发信</span>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">02:00 - 03:00</span>
            </div>
            <p class="text-slate-700 leading-relaxed">
              <strong>演示动作：</strong> 在画像弹窗点击「AI生成开发信」，切换「针对痛点型」与「专业合规型」模板，一键复制邮件并展示跟进下一步清单。
            </p>
            <p class="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
              💬 <strong>话术要点：</strong> “告别千篇一律的垃圾群发。AI直接把客户痛点（Title 24合规、4周现货交期）写进邮件，直击决策人邮箱，业务员只需一键发送，真正做到立刻跟进、快速成单！”
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="pt-3 border-t border-slate-200 flex justify-end gap-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer shadow-sm"
          >
            我知道了，开始演示
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
