<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Download,
  Plus,
  Trash2,
  User
} from 'lucide-vue-next'
import type { CombatTaskItem } from '@/data/bidConsultantData'
import { downloadTextAsFile } from '@/data/bidConsultantData'

interface Props {
  tasks: CombatTaskItem[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'next-step'): void
  (e: 'prev-step'): void
}>()

interface NewTaskForm {
  task: string
  owner: string
  deadline: string
  priority: string
  status: string
  note: string
}

const tasks = ref<CombatTaskItem[]>(props.tasks)
const showAddModal = ref(false)
const newTask = ref<NewTaskForm>({
  task: '',
  owner: '商务部',
  deadline: '截标前3天',
  priority: 'high',
  status: 'pending',
  note: ''
})

const handleToggleStatus = (id: string) => {
  tasks.value = tasks.value.map((t) => {
    if (t.id === id) {
      const nextStatus: Record<CombatTaskItem['status'], CombatTaskItem['status']> = {
        pending: 'in_progress',
        in_progress: 'completed',
        completed: 'pending'
      }
      return { ...t, status: nextStatus[t.status] }
    }
    return t
  })
}

const handleDeleteTask = (id: string) => {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

const handleAddTask = () => {
  if (!newTask.value.task?.trim()) return

  const taskItem: CombatTaskItem = {
    id: 'task-' + Date.now(),
    task: newTask.value.task,
    owner: newTask.value.owner || '负责人',
    deadline: newTask.value.deadline || '截标前',
    priority: (newTask.value.priority || 'high') as CombatTaskItem['priority'],
    status: (newTask.value.status || 'pending') as CombatTaskItem['status'],
    note: newTask.value.note || ''
  }

  tasks.value = [taskItem, ...tasks.value]
  showAddModal.value = false
  newTask.value = {
    task: '',
    owner: '商务部',
    deadline: '截标前3天',
    priority: 'high',
    status: 'pending',
    note: ''
  }
}

const exportTasksMarkdown = () => {
  let md = `# 投标项目作战清单\n\n| 任务 | 负责人 | 截止时间 | 优先级 | 状态 | 备注 |\n| --- | --- | --- | --- | --- | --- |\n`
  tasks.value.forEach((t) => {
    const p = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢'
    const s = t.status === 'completed' ? '已完成' : t.status === 'in_progress' ? '进行中' : '待处理'
    md += `| ${t.task} | ${t.owner} | ${t.deadline} | ${p} | ${s} | ${t.note} |\n`
  })
  downloadTextAsFile('投标项目作战清单.md', md)
}

const completedCount = computed(() => tasks.value.filter((t) => t.status === 'completed').length)
const progress = computed(() => Math.round((completedCount.value / (tasks.value.length || 1)) * 100))
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Header Bento Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <CheckSquare class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                第七步：投标项目作战清单（按时序与权重）
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              严密倒排工期，按优先级驱动商务、技术、财务及法务协同作业。
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            @click="showAddModal = true"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>新建作战任务</span>
          </button>

          <button
            @click="exportTasksMarkdown"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-colors"
            title="导出 Markdown / Excel 任务表"
          >
            <Download class="w-3.5 h-3.5" />
            <span>导出清单</span>
          </button>
        </div>
      </div>

      <!-- Progress Tracker -->
      <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>推进进度:</span>
          <span class="text-emerald-600 font-mono font-bold">{{ completedCount }} / {{ tasks.length }} 已完成 ({{ progress }}%)</span>
        </div>
        <div class="w-48 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          <div
            class="h-full bg-emerald-500 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Main Tasks Table -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase">
              <th class="py-3.5 px-4 w-[6%] text-center">状态</th>
              <th class="py-3.5 px-4 w-[34%]">作战任务名称</th>
              <th class="py-3.5 px-4 w-[16%]">责任分工</th>
              <th class="py-3.5 px-4 w-[18%]">节点截止时间</th>
              <th class="py-3.5 px-4 w-[8%] text-center">优先级</th>
              <th class="py-3.5 px-4 w-[18%]">关键要点 / 关联风险</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr
              v-for="task in tasks"
              :key="task.id"
              :class="task.status === 'completed' ? 'bg-slate-50/40 opacity-70' : ''"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <!-- Status Toggle Checkbox -->
              <td class="py-4 px-4 align-middle text-center">
                <button
                  @click="handleToggleStatus(task.id)"
                  :class="task.status === 'completed'
                    ? 'bg-emerald-600 text-white font-bold'
                    : task.status === 'in_progress'
                    ? 'bg-blue-50 text-blue-600 border border-blue-500'
                    : 'border border-slate-300 hover:border-blue-500 text-transparent'"
                  class="w-5 h-5 rounded flex items-center justify-center transition-all"
                  title="点击切换状态 (待处理 -> 进行中 -> 已完成)"
                >
                  <CheckCircle2 v-if="task.status === 'completed'" class="w-4 h-4" />
                  <Clock v-else-if="task.status === 'in_progress'" class="w-3.5 h-3.5" />
                </button>
              </td>

              <!-- Task Title -->
              <td class="py-4 px-4 align-middle">
                <div class="flex items-center gap-2">
                  <span
                    :class="task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'"
                    class="font-semibold text-xs sm:text-sm"
                  >
                    {{ task.task }}
                  </span>
                </div>
              </td>

              <!-- Owner -->
              <td class="py-4 px-4 align-middle">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  <User class="w-3 h-3 text-indigo-600" />
                  {{ task.owner }}
                </span>
              </td>

              <!-- Deadline -->
              <td class="py-4 px-4 align-middle">
                <span class="inline-flex items-center gap-1 text-xs text-amber-800 font-mono font-semibold">
                  <Calendar class="w-3.5 h-3.5 text-amber-600" />
                  {{ task.deadline }}
                </span>
              </td>

              <!-- Priority -->
              <td class="py-4 px-4 align-middle text-center">
                <span v-if="task.priority === 'high'" class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  🔴 高
                </span>
                <span v-else-if="task.priority === 'medium'" class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  🟡 中
                </span>
                <span v-else class="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🟢 低
                </span>
              </td>

              <!-- Note -->
              <td class="py-4 px-4 align-middle">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs text-slate-500 line-clamp-1">{{ task.note || '-' }}</span>
                  <button
                    @click="handleDeleteTask(task.id)"
                    class="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                    title="删除任务"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl animate-in zoom-in-95">
        <h3 class="text-base font-bold text-slate-900 mb-4">新建投标作战任务</h3>
        <form @submit.prevent="handleAddTask" class="space-y-4 text-xs sm:text-sm">
          <div>
            <label class="block text-slate-700 font-semibold mb-1">任务名称 *</label>
            <input
              v-model="newTask.task"
              type="text"
              required
              placeholder="例如：准备项目经理电子注册证书及近6个月社保"
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">责任部门/人</label>
              <input
                v-model="newTask.owner"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">截止时间</label>
              <input
                v-model="newTask.deadline"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-1">优先级</label>
            <select
              v-model="newTask.priority"
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="high">🔴 必须优先完成 (高)</option>
              <option value="medium">🟡 正常推进 (中)</option>
              <option value="low">🟢 辅助项 (低)</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-1">备注说明</label>
            <textarea
              v-model="newTask.note"
              rows="2"
              placeholder="关联风险或具体要求..."
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm"
            >
              确认添加
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between pt-2">
      <button
        @click="$emit('prev-step')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>返回：能力匹配</span>
      </button>

      <button
        @click="$emit('next-step')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
      >
        <span>下一步：生成方案框架</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </div>
</template>
