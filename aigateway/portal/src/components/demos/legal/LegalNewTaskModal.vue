<!-- ============================================================================
     AI 法务员工 · 新建法务任务弹窗（四类任务选一启动）
     转译自：docs/仓库/xx-ai-·-ai法务员工/src/components/common/NewTaskModal.tsx
     合同AI初审 → contract-review（可选范本，REVIEW_PRESETS 4 项带入）
     企业合规扫描 → enterprise-compliance / 法规智能检索 → regulation-search
     法务知识库问答 → knowledge-base
     每次打开重置 taskType=review（对应原型组件随 isOpen 卸载重挂行为）
     移植日期：2026-09-03
     ============================================================================ -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-vue-next'
import type { LegalView } from '@/data/legalIntelData'
import { REVIEW_PRESETS } from '@/data/legalIntelData'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select-action', view: LegalView, preset?: string): void
}>()

type TaskType = 'review' | 'compliance' | 'regulation' | 'knowledge'

const taskType = ref<TaskType>('review')
const contractName = ref('设备采购合同.pdf')

// 打开弹窗时重置为默认合同初审（照原型 React 卸载重挂行为）
watch(
  () => props.open,
  (v) => {
    if (v) {
      taskType.value = 'review'
      contractName.value = '设备采购合同.pdf'
    }
  },
)

// 立即启动：按任务类型映射目标视图；review 附带范本文件名
const handleStart = () => {
  emit('close')
  if (taskType.value === 'review') {
    emit('select-action', 'contract-review', contractName.value)
  } else if (taskType.value === 'compliance') {
    emit('select-action', 'enterprise-compliance')
  } else if (taskType.value === 'regulation') {
    emit('select-action', 'regulation-search')
  } else {
    emit('select-action', 'knowledge-base')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-200"
      @click.self="emit('close')"
    >
      <div
        class="bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-200"
      >
        <!-- 弹窗头部 -->
        <div
          class="px-6 py-4 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between"
        >
          <div>
            <h2 class="text-base font-semibold tracking-wide">新建法务任务</h2>
            <p class="text-xs text-slate-400 mt-0.5">选择AI辅助作业模式，快速启动法务工作流</p>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 内容 -->
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              任务类型
            </label>
            <div class="grid grid-cols-2 gap-3">
              <!-- 合同 AI 初审 -->
              <button
                type="button"
                class="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer"
                :class="
                  taskType === 'review'
                    ? 'border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/20'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                "
                @click="taskType = 'review'"
              >
                <div
                  class="p-2 rounded-lg"
                  :class="taskType === 'review' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'"
                >
                  <FileText class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-white">合同AI初审</div>
                  <div class="text-xs text-slate-400 mt-0.5">提取关键条款并识别法律风险</div>
                </div>
              </button>

              <!-- 企业合规扫描 -->
              <button
                type="button"
                class="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer"
                :class="
                  taskType === 'compliance'
                    ? 'border-indigo-500 bg-indigo-600/10 ring-2 ring-indigo-500/20'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                "
                @click="taskType = 'compliance'"
              >
                <div
                  class="p-2 rounded-lg"
                  :class="taskType === 'compliance' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'"
                >
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-white">企业合规扫描</div>
                  <div class="text-xs text-slate-400 mt-0.5">多业务维度风险排查与整改</div>
                </div>
              </button>

              <!-- 法规智能检索 -->
              <button
                type="button"
                class="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer"
                :class="
                  taskType === 'regulation'
                    ? 'border-cyan-500 bg-cyan-600/10 ring-2 ring-cyan-500/20'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                "
                @click="taskType = 'regulation'"
              >
                <div
                  class="p-2 rounded-lg"
                  :class="taskType === 'regulation' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'"
                >
                  <Search class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-white">法规智能检索</div>
                  <div class="text-xs text-slate-400 mt-0.5">多国法条研判与业务通俗解析</div>
                </div>
              </button>

              <!-- 法务知识库问答 -->
              <button
                type="button"
                class="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer"
                :class="
                  taskType === 'knowledge'
                    ? 'border-emerald-500 bg-emerald-600/10 ring-2 ring-emerald-500/20'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                "
                @click="taskType = 'knowledge'"
              >
                <div
                  class="p-2 rounded-lg"
                  :class="taskType === 'knowledge' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'"
                >
                  <BookOpen class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-sm font-semibold text-white">法务知识库问答</div>
                  <div class="text-xs text-slate-400 mt-0.5">企业既往合同与制度智能检索</div>
                </div>
              </button>
            </div>
          </div>

          <!-- 合同初审：演示范本快速选择（REVIEW_PRESETS 4 项） -->
          <div v-if="taskType === 'review'" class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <label class="block text-xs font-medium text-slate-300">
              演示合同范本快速选择：
            </label>
            <select
              v-model="contractName"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option v-for="preset in REVIEW_PRESETS" :key="preset.name" :value="preset.name">
                {{ preset.name }}{{ preset.badge === '核心演示' ? '（核心演示）' : '' }}
              </option>
            </select>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UploadCloud class="w-3.5 h-3.5 text-slate-500" />
              <span>也可在进入页面后直接拖拽本地任意合同文件</span>
            </div>
          </div>
        </div>

        <!-- 弹窗底部 -->
        <div class="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
            @click="emit('close')"
          >
            取消
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
            @click="handleStart"
          >
            <span>立即启动任务</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
