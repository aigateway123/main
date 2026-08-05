<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  listModelsApi, createModelApi, updateModelApi, deleteModelApi,
  bindProviderApi, getModelApi, type ModelResponse, type ModelDetailResponse,
  type UpdateModelRequest,
} from '@/api/models'
import { listProvidersApi, type ProviderResponse } from '@/api/providers'

const models = ref<ModelResponse[]>([])
const providers = ref<ProviderResponse[]>([])
const modelDetails = ref<Record<number, ModelDetailResponse>>({})
const loading = ref(false)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ modelName: '', modelCode: '', modelStatus: 'active', modelType: 'chat', isPublic: true })
const bindForm = ref({ providerId: 0, weight: 100, apiPathOverride: '' })
const showBind = ref(false)

// 模型类型筛选
const filterModelType = ref('')

async function load() {
  loading.value = true
  try {
    models.value = await listModelsApi(filterModelType.value || undefined)
    providers.value = await listProvidersApi()
    const details: Record<number, ModelDetailResponse> = {}
    for (const m of models.value) {
      try { details[m.id] = await getModelApi(m.id) } catch { /* skip */ }
    }
    modelDetails.value = details
  } finally { loading.value = false }
}

function openCreate() {
  editingId.value = null; form.value = { modelName: '', modelCode: '', modelStatus: 'active', modelType: 'chat', isPublic: true }; showForm.value = true
}
function openEdit(m: ModelResponse) {
  editingId.value = m.id; form.value = { modelName: m.modelName, modelCode: m.modelCode, modelStatus: m.modelStatus, modelType: m.modelType, isPublic: m.isPublic ?? true }; showForm.value = true
}
async function handleSave() {
  try {
    if (editingId.value) {
      const payload: UpdateModelRequest = { modelName: form.value.modelName, modelCode: form.value.modelCode, modelStatus: form.value.modelStatus, isPublic: form.value.isPublic }
      await updateModelApi(editingId.value, payload)
    } else {
      await createModelApi({ modelName: form.value.modelName, modelCode: form.value.modelCode, modelType: form.value.modelType, isPublic: form.value.isPublic })
    }
    showForm.value = false; await load()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    alert(err?.response?.data?.message || '保存失败')
  }
}
function handleBind(modelId: number) {
  bindForm.value = { providerId: 0, weight: 100, apiPathOverride: '' }; showBind.value = true; editingId.value = modelId
}
async function confirmBind() {
  if (!bindForm.value.providerId) return
  try {
    await bindProviderApi(editingId.value!, {
      providerId: bindForm.value.providerId,
      weight: bindForm.value.weight,
      ...(bindForm.value.apiPathOverride ? { apiPathOverride: bindForm.value.apiPathOverride } : {}),
    })
    showBind.value = false; await load()
  } catch { alert('绑定失败') }
}
async function handleDelete(id: number, name: string) {
  if (!confirm(`确定删除 Model「${name}」？`)) return
  try { await deleteModelApi(id); await load() } catch { alert('删除失败') }
}

function getModelTypeTag(type?: string) {
  switch (type) {
    case 'image': return { label: '🖼️ 图片', cls: 'bg-purple-50 text-purple-700 border-purple-200/60' }
    case 'embedding': return { label: '🧩 向量', cls: 'bg-amber-50 text-amber-700 border-amber-200/60' }
    default: return { label: '💬 对话', cls: 'bg-blue-50 text-blue-700 border-blue-200/60' }
  }
}

onMounted(load)
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
      <div>
        <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
          </svg>
          模型管理
        </h2>
        <p class="text-xs text-text-secondary mt-0.5">统一模型标识命名与多 Provider 实例路由绑定</p>
      </div>
      <button
        class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        @click="openCreate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        添加 Model
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white rounded-lg border border-border p-4">
      <div class="flex items-center gap-3">
        <label class="text-xs font-semibold text-text-primary">模型类型：</label>
        <select v-model="filterModelType"
          class="h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary w-40"
          @change="load">
          <option value="">全部</option>
          <option value="chat">💬 对话</option>
          <option value="image">🖼️ 图片</option>
          <option value="embedding">🧩 向量</option>
        </select>
      </div>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bg-white w-full max-w-md rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">{{ editingId ? '编辑' : '添加' }} Model</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showForm = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">名称</label>
              <input v-model="form.modelName" type="text" placeholder="GPT-4o Mini"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">编码</label>
              <input v-model="form.modelCode" type="text" placeholder="gpt-4o-mini" :disabled="!!editingId"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:text-text-secondary" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">模型类型</label>
              <select v-model="form.modelType" :disabled="!!editingId"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary disabled:bg-slate-50 disabled:text-text-secondary">
                <option value="chat">💬 文本对话</option>
                <option value="image">🖼️ 图片生成</option>
                <option value="embedding">🧩 向量嵌入</option>
              </select>
              <p v-if="editingId" class="text-[10px] text-text-secondary mt-0.5">创建后不可修改模型类型</p>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">对所有人开放</label>
              <label class="flex items-center gap-2 p-2.5 rounded border border-border bg-[#f8f9fa] cursor-pointer select-none">
                <input type="checkbox" v-model="form.isPublic" class="rounded text-primary focus:ring-primary" />
                <span class="text-xs text-text-primary">{{ form.isPublic ? '开放：所有角色均可获取该模型' : '私有：仅已授权的账号可获取该模型' }}</span>
              </label>
            </div>
            <div v-if="editingId" class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">状态</label>
              <select v-model="form.modelStatus"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary">
                <option value="active">启用</option>
                <option value="disabled">禁用</option>
              </select>
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button"
                class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showForm = false">取消</button>
              <button type="submit"
                class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer">保存</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Bind Modal -->
    <Teleport to="body">
      <div v-if="showBind" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showBind = false">
        <div class="bg-white w-full max-w-md rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">绑定 Provider</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showBind = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">Provider</label>
              <select v-model.number="bindForm.providerId"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary">
                <option :value="0">请选择</option>
                <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.providerName }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">权重</label>
              <input v-model.number="bindForm.weight" type="number"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">API 路径覆盖 <span class="text-text-secondary font-normal">(可选)</span></label>
              <input v-model="bindForm.apiPathOverride" type="text" placeholder="如 /v1/images/generations"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              <p class="text-[10px] text-text-secondary mt-0.5">为空则使用 Provider 默认 API 路径</p>
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button"
                class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showBind = false">取消</button>
              <button type="button"
                class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer"
                @click="confirmBind">绑定</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">名称</th><th class="px-4 py-2">编码</th><th class="px-4 py-2">类型</th><th class="px-4 py-2">状态</th><th class="px-4 py-2">可见性</th><th class="px-4 py-2">绑定的 Provider</th><th class="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && models.length > 0" class="divide-y divide-border">
            <tr
              v-for="(m, index) in models"
              :key="m.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-bold text-text-primary">{{ m.modelName }}</td>
              <td class="px-4 py-2">
                <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px]">{{ m.modelCode }}</code>
              </td>
              <td class="px-4 py-2">
                <span
                  v-if="m.modelType"
                  :class="['inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border', getModelTypeTag(m.modelType).cls]"
                >
                  {{ getModelTypeTag(m.modelType).label }}
                </span>
                <span v-else class="text-text-secondary">—</span>
              </td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    m.modelStatus === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/60',
                  ]"
                >
                  {{ m.modelStatus === 'active' ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    m.isPublic
                      ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                      : 'bg-gray-50 text-gray-600 border-gray-200/60',
                  ]"
                >
                  {{ m.isPublic ? '🌍 所有人' : '🔒 私有' }}
                </span>
              </td>
              <td class="px-4 py-2">
                <div v-if="modelDetails[m.id]?.providers?.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="p in modelDetails[m.id].providers"
                    :key="p.id"
                    class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 text-[11px] font-medium"
                  >
                    {{ p.providerName }}
                  </span>
                </div>
                <button
                  v-else
                  class="px-2 py-1 border border-dashed border-blue-200 text-primary hover:bg-blue-50 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleBind(m.id)"
                >
                  + 绑定 Provider
                </button>
              </td>
              <td class="px-4 py-2 space-x-2">
                <button
                  class="px-2 py-1 text-primary hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="openEdit(m)">编辑</button>
                <button
                  class="px-2 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleDelete(m.id, m.modelName)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="models.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无 Model</div>
      </div>
    </div>
  </div>
</template>
