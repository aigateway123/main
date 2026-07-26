<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listRoles, createRole, getRole, updateRolePermissions, deleteRole, listPermissions, type RoleResponse, type PermissionResponse } from '@/api/roles'

const roles = ref<RoleResponse[]>([])
const loading = ref(false)

const showCreate = ref(false)
const createName = ref('')
const createDesc = ref('')
const creating = ref(false)

const showDetail = ref(false)
const detailRole = ref<(RoleResponse & { permissions: PermissionResponse[] }) | null>(null)
const allPermissions = ref<PermissionResponse[]>([])
const selectedPermissionIds = ref<number[]>([])
const saving = ref(false)

async function loadRoles() {
  loading.value = true
  try {
    roles.value = await listRoles()
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  if (!createName.value) { alert('请填写角色名称'); return }
  creating.value = true
  try {
    await createRole({ name: createName.value, description: createDesc.value })
    showCreate.value = false
    createName.value = ''
    createDesc.value = ''
    await loadRoles()
  } catch (e: any) {
    alert(e?.response?.data?.message ?? '创建失败')
  } finally {
    creating.value = false
  }
}

async function openDetail(role: RoleResponse) {
  showDetail.value = true
  selectedPermissionIds.value = []
  saving.value = true
  try {
    const [detail, perms] = await Promise.all([getRole(role.id), listPermissions()])
    detailRole.value = detail
    allPermissions.value = perms
    selectedPermissionIds.value = detail.permissions.map(p => p.id)
  } catch {
    alert('获取角色详情失败')
  } finally {
    saving.value = false
  }
}

async function handleSavePermissions() {
  if (!detailRole.value) return
  saving.value = true
  try {
    await updateRolePermissions(detailRole.value.id, selectedPermissionIds.value)
    alert('权限已更新')
    await loadRoles()
  } catch (e: any) {
    alert(e?.response?.data?.message ?? '保存权限失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(role: RoleResponse) {
  if (role.isSystem) { alert('系统角色不能删除'); return }
  if (!confirm(`确定要删除角色"${role.name}"吗？`)) return
  try {
    await deleteRole(role.id)
    await loadRoles()
  } catch {
    alert('删除失败')
  }
}

function togglePermission(permId: number) {
  const idx = selectedPermissionIds.value.indexOf(permId)
  if (idx >= 0) {
    selectedPermissionIds.value.splice(idx, 1)
  } else {
    selectedPermissionIds.value.push(permId)
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return dateStr.slice(0, 19).replace('T', ' ')
}

onMounted(loadRoles)
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
      <div>
        <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          系统角色与 RBAC 权限管理
        </h2>
        <p class="text-xs text-text-secondary mt-0.5">配置系统运维、财务审计及管理员角色，精细化进行节点与 API 鉴权控制</p>
      </div>
      <button
        class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        @click="showCreate = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        创建角色
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">角色名称</th>
              <th class="px-4 py-2">描述</th>
              <th class="px-4 py-2">权限数</th>
              <th class="px-4 py-2">用户数</th>
              <th class="px-4 py-2">创建时间</th>
              <th class="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && roles.length > 0" class="divide-y divide-border">
            <tr
              v-for="(role, index) in roles"
              :key="role.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-bold text-text-primary flex items-center gap-2">
                <span>{{ role.name }}</span>
                <span
                  v-if="role.isSystem"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60"
                >
                  系统
                </span>
              </td>
              <td class="px-4 py-2 text-text-secondary max-w-xs truncate" :title="role.description">{{ role.description || '-' }}</td>
              <td class="px-4 py-2 font-mono font-bold text-text-primary">{{ role.permissionCount ?? 0 }}</td>
              <td class="px-4 py-2 font-mono text-text-secondary">{{ role.userCount ?? 0 }}人</td>
              <td class="px-4 py-2 text-text-secondary font-mono text-[11px]">{{ formatDate(role.createdAt) }}</td>
              <td class="px-4 py-2 text-right space-x-2">
                <button
                  class="px-2.5 py-1 text-primary hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="openDetail(role)"
                >
                  编辑权限
                </button>
                <button
                  v-if="!role.isSystem"
                  class="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleDelete(role)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="roles.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无角色数据</div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div
        v-if="showCreate"
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="showCreate = false"
      >
        <div class="bg-white w-full max-w-md rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">创建新角色</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showCreate = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">角色名称</label>
              <input v-model="createName" type="text" placeholder="如：值班运维专员 / 安全合规审核员"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">角色描述</label>
              <textarea v-model="createDesc" placeholder="描述该角色的职能与权限管控边界..."
                class="w-full p-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" rows="3" />
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button"
                class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showCreate = false">取消</button>
              <button type="submit"
                class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                :disabled="creating">{{ creating ? '创建中...' : '创建角色' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div
        v-if="showDetail && detailRole"
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        @click.self="showDetail = false"
      >
        <div class="bg-white w-full max-w-lg rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <div>
              <h3 class="text-xl font-bold text-text-primary">配置角色权限 - {{ detailRole.name }}</h3>
              <p class="text-xs text-text-secondary mt-0.5">{{ detailRole.description }}</p>
            </div>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showDetail = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div v-if="!saving" class="space-y-4">
            <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
              <label class="text-xs font-bold text-text-primary">系统 RBAC 权限勾选矩阵:</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  v-for="perm in allPermissions"
                  :key="perm.id"
                  class="flex items-start gap-2.5 p-2.5 rounded border border-border bg-[#f8f9fa] hover:bg-white cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    :checked="selectedPermissionIds.includes(perm.id)"
                    class="mt-0.5 rounded text-primary focus:ring-primary"
                    @change="togglePermission(perm.id)"
                  />
                  <div class="text-xs space-y-0.5">
                    <div class="font-semibold text-text-primary">{{ perm.name }}</div>
                    <div class="font-mono text-[10px] text-primary">code: {{ perm.code }}</div>
                  </div>
                </label>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button"
                class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showDetail = false">取消</button>
              <button type="button"
                class="h-9 px-5 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                @click="handleSavePermissions">保存权限</button>
            </div>
          </div>
          <div v-else class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
