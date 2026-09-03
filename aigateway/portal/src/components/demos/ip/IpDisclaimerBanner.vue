<!-- 转译自：docs/仓库/xx-ai-·-ai知识产权顾问/src/components/DisclaimerBanner.tsx -->
<!-- 琥珀色合规免责横幅：无 props；横幅可本地关闭，「法律细则」打开完整合规声明弹窗 -->
<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, ChevronRight, ShieldCheck, X } from 'lucide-vue-next'

// 本地关闭状态
const isDismissed = ref(false)
// 法律细则完整弹窗
const showFullModal = ref(false)

const dismiss = () => {
  isDismissed.value = true
}
</script>

<template>
  <div
    v-if="!isDismissed"
    id="ip-disclaimer-banner"
    class="bg-amber-50/90 border border-amber-200/80 text-amber-900 rounded-xl p-4 text-sm shadow-sm flex items-start gap-3 transition-all"
  >
    <div class="p-1 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
      <AlertTriangle class="w-4 h-4" />
    </div>

    <div class="flex-1 leading-relaxed min-w-0">
      <div class="font-semibold text-amber-950 flex items-center gap-2">
        <span class="whitespace-nowrap">重要合规与法律免责声明</span>
        <span
          class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 whitespace-nowrap"
        >
          Demo环境 · 辅助决策
        </span>
      </div>
      <p class="mt-1 text-amber-800/90 text-xs leading-relaxed">
        <strong>AI分析结果仅用于知识产权检索、分析和决策辅助，不构成法律意见、侵权结论或专利授权判断。</strong>
        涉及专利申请、无效宣告、专利侵权诉讼及FTO尽调等法律事项，应由具备国家执业资质的专利代理师与知识产权专业律师进一步审核确认。
      </p>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        type="button"
        class="text-xs text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 flex items-center cursor-pointer whitespace-nowrap"
        @click="showFullModal = true"
      >
        <span>法律细则</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        class="text-amber-500 hover:text-amber-800 p-1 rounded-md cursor-pointer"
        title="关闭提醒"
        @click="dismiss"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>

  <!-- 法律细则完整弹窗 -->
  <Teleport to="body">
    <div
      v-if="showFullModal"
      class="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showFullModal = false"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck class="w-5 h-5 text-blue-600" />
            <span>知识产权分析与合规声明准则</span>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            @click="showFullModal = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="py-4 space-y-3 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto">
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <p class="font-semibold text-slate-800 mb-1">1. 非法律意见声明</p>
            <p>
              本系统采用大语言模型与专利大数据算法对企业输入的技术方案进行特征相似度比对、侵权风险推演及专利空白发掘。所有输出数据与评分仅供研发立项、知识产权前置规划和竞争情报监测参考，不具有法律效力。
            </p>
          </div>

          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <p class="font-semibold text-slate-800 mb-1">2. 严禁断言侵权与绝对授权</p>
            <p>
              根据《中华人民共和国专利法》及最高人民法院相关司法解释，专利侵权判定遵循全面覆盖原则与等同原则。本系统严格遵守专业伦理，不宣称“100%确定侵权”或“保证专利授权”，所有风险提示均须通过全面专利权利要求书比对确证。
            </p>
          </div>

          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
            <p class="font-semibold text-slate-800 mb-1">3. Demo模拟数据说明</p>
            <p>
              本演示系统内展示的12,846件检索专利统计、部分未公开技术方案、企业关联图谱及雷达情报均为高质量模拟演示数据，专用于展示AI知识产权顾问产品的核心业务闭环及交互体验。
            </p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            @click="showFullModal = false"
          >
            我已了解并同意
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
