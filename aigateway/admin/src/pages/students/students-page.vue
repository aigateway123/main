<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listStudents, createStudent, updateStudentStatus, getStudentQuota, setStudentQuota, getStudentModels, setStudentModels, type StudentResponse, type ModelAccessResponse } from '@/api/admin'

const students = ref<StudentResponse[]>([])
const total = ref(0)
const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)

const showCreate = ref(false)
const createEmail = ref('')
const createPassword = ref('')
const createNickname = ref('')
const creating = ref(false)

const showDetail = ref(false)
const detailStudent = ref<StudentResponse | null>(null)
const detailQuota = ref(0)
const detailModels = ref<ModelAccessResponse[]>([])
const newQuota = ref(0)
const selectedModelIds = ref<number[]>([])
const updating = ref(false)

async function loadStudents() {
  loading.value = true
  try {
    const result = await listStudents({ keyword: keyword.value, page: page.value, pageSize: pageSize.value })
    students.value = result.items
    total.value = result.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  loadStudents()
}

async function handleCreate() {
  if (!createEmail.value || !createPassword.value) { alert('请填写邮箱和密码'); return }
  creating.value = true
  try {
    await createStudent({ email: createEmail.value, password: createPassword.value, nickname: createNickname.value || createEmail.value.split('@')[0] })
    showCreate.value = false
    createEmail.value = ''
    createPassword.value = ''
    createNickname.value = ''
    await loadStudents()
  } catch (e: any) {
    alert(e?.response?.data?.message ?? '创建失败')
  } finally {
    creating.value = false
  }
}

async function openDetail(student: StudentResponse) {
  detailStudent.value = student
  showDetail.value = true
  detailQuota.value = student.quotaBalance
  newQuota.value = student.quotaBalance
  updating.value = true
  try {
    const [quotaRes, models] = await Promise.all([getStudentQuota(student.userId), getStudentModels(student.userId)])
    detailQuota.value = quotaRes.quotaBalance
    newQuota.value = quotaRes.quotaBalance
    detailModels.value = models
    selectedModelIds.value = models.filter(m => m.enabled).map(m => m.modelId)
  } catch {
    alert('获取详情失败')
  } finally {
    updating.value = false
  }
}

async function handleSetQuota() {
  if (!detailStudent.value) return
  updating.value = true
  try {
    await setStudentQuota(detailStudent.value.userId, newQuota.value)
    alert('额度已更新')
    await loadStudents()
    detailQuota.value = newQuota.value
  } catch (e: any) {
    alert(e?.response?.data?.message ?? '设置额度失败')
  } finally {
    updating.value = false
  }
}

async function handleSetModels() {
  if (!detailStudent.value) return
  updating.value = true
  try {
    await setStudentModels(detailStudent.value.userId, selectedModelIds.value)
    alert('模型权限已更新')
    await loadStudents()
  } catch (e: any) {
    alert(e?.response?.data?.message ?? '设置模型失败')
  } finally {
    updating.value = false
  }
}

async function handleToggleStatus(student: StudentResponse) {
  const newStatus = student.status === 'active' ? 'disabled' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'
  if (!confirm(`确定要${action}该账号吗？`)) return
  try {
    await updateStudentStatus(student.userId, newStatus)
    await loadStudents()
  } catch {
    alert('操作失败')
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.slice(0, 19).replace('T', ' ')
}

onMounted(loadStudents)
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Search + Create -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-border">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索邮箱或昵称..."
            class="w-full h-8 pl-8 pr-3 text-xs bg-[#f8f9fa] border border-border rounded text-text-primary focus:outline-none focus:bg-white focus:border-primary"
            @keyup.enter="handleSearch"
          />
        </div>
        <button
          class="h-8 px-3 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-btn transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          @click="handleSearch"
        >
          搜索
        </button>
      </div>
      <button
        class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        @click="showCreate = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        创建账号
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">邮箱</th><th class="px-4 py-2">昵称</th><th class="px-4 py-2">状态</th>
              <th class="px-4 py-2">额度余额</th><th class="px-4 py-2">创建时间</th><th class="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && students.length > 0" class="divide-y divide-border">
            <tr
              v-for="(s, index) in students"
              :key="s.userId"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-medium text-text-primary">{{ s.email }}</td>
              <td class="px-4 py-2 font-medium text-text-primary">{{ s.nickname }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    s.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/60',
                  ]"
                >
                  {{ s.status === 'active' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-2 font-mono font-bold text-text-primary">¥{{ s.quotaBalance.toFixed(2) }}</td>
              <td class="px-4 py-2 text-text-secondary font-mono text-[11px]">{{ formatDate(s.createdAt) }}</td>
              <td class="px-4 py-2 text-right space-x-2">
                <button
                  class="px-2.5 py-1 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="openDetail(s)"
                >
                  详情
                </button>
                <button
                  v-if="s.status === 'active'"
                  class="px-2.5 py-1 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleToggleStatus(s)"
                >
                  禁用
                </button>
                <button
                  v-else
                  class="px-2.5 py-1 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleToggleStatus(s)"
                >
                  启用
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="students.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无账号数据</div>
      </div>

      <!-- Pagination -->
      <div v-if="total > pageSize" class="flex items-center gap-3 text-xs text-text-secondary mt-4">
        <span>共 {{ total }} 条</span>
        <button class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
          :disabled="page <= 1" @click="page--; loadStudents()">上一页</button>
        <span>第 {{ page }} / {{ Math.ceil(total / pageSize) }} 页</span>
        <button class="h-8 px-3 border border-[#cbd5e1] rounded text-text-btn bg-white hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
          :disabled="page * pageSize >= total" @click="page++; loadStudents()">下一页</button>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreate" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showCreate = false">
        <div class="bg-white w-full max-w-md rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">创建账号</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showCreate = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">账号邮箱</label>
              <input v-model="createEmail" type="email" placeholder="user@example.com"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">初始化密码</label>
              <input v-model="createPassword" type="password" placeholder="请设置该账号的初始密码"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">昵称 (可选)</label>
              <input v-model="createNickname" type="text" placeholder="如：张三 (清华人工智能实验室)"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button" class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showCreate = false">取消</button>
              <button type="submit" class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                :disabled="creating">{{ creating ? '创建中...' : '确定创建' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="showDetail && detailStudent" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showDetail = false">
        <div class="bg-white w-full max-w-lg rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">账号详情及配额设置</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showDetail = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Info -->
          <div class="p-3 bg-[#f8f9fa] rounded border border-border space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-text-primary">{{ detailStudent.email }}</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[11px] font-medium border',
                  detailStudent.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border-rose-200/60',
                ]"
              >
                {{ detailStudent.status === 'active' ? '启用中' : '已禁用' }}
              </span>
            </div>
            <div class="text-xs text-text-secondary">
              昵称: <span class="font-medium text-text-primary">{{ detailStudent.nickname }}</span> | 注册时间: {{ formatDate(detailStudent.createdAt) }}
            </div>
          </div>

          <div v-if="!updating" class="space-y-4">
            <!-- Quota -->
            <div class="p-4 border border-border rounded-lg space-y-3">
              <h4 class="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                额度管理
              </h4>
              <div class="flex items-center gap-3">
                <div class="text-xs text-text-secondary">
                  当前额度: <span class="font-mono font-bold text-text-primary">¥{{ detailQuota.toFixed(2) }}</span>
                </div>
                <input v-model.number="newQuota" type="number" step="10"
                  class="w-28 h-8 px-2.5 text-xs font-mono bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                <button
                  class="h-8 px-3 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-btn transition-colors cursor-pointer"
                  @click="handleSetQuota">
                  设置额度
                </button>
              </div>
            </div>

            <!-- Model Permissions -->
            <div class="p-4 border border-border rounded-lg space-y-3">
              <h4 class="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                模型权限 (勾选即授权)
              </h4>
              <div v-if="detailModels.length > 0" class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                <label
                  v-for="m in detailModels"
                  :key="m.modelId"
                  class="flex items-center gap-2 p-2 rounded border border-border bg-[#f8f9fa] hover:bg-white cursor-pointer transition-colors text-xs"
                >
                  <input type="checkbox" :value="m.modelId" v-model="selectedModelIds"
                    class="rounded text-primary focus:ring-primary" />
                  <div class="truncate">
                    <div class="font-medium text-text-primary truncate">{{ m.modelName }}</div>
                    <div class="font-mono text-[10px] text-text-secondary truncate">{{ m.modelCode }}</div>
                  </div>
                </label>
              </div>
              <button
                class="w-full h-8 bg-primary hover:bg-blue-700 text-white text-xs font-medium rounded-btn transition-colors cursor-pointer"
                @click="handleSetModels">
                保存模型权限
              </button>
            </div>
          </div>
          <div v-else class="py-10 text-center text-text-secondary text-xs">加载中...</div>

          <div class="pt-2 border-t border-border flex justify-end">
            <button type="button"
              class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
              @click="showDetail = false">关闭</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
