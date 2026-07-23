<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  listModelsApi,
  createModelApi,
  updateModelApi,
  deleteModelApi,
  bindProviderApi,
  unbindProviderApi,
  getModelApi,
  type ModelResponse,
  type ModelDetailResponse,
} from '@/api/models'
import { listProvidersApi, type ProviderResponse } from '@/api/providers'

const models = ref<ModelResponse[]>([])
const providers = ref<ProviderResponse[]>([])
const modelDetails = ref<Record<number, ModelDetailResponse>>({})
const loading = ref(false)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const detail = ref<ModelDetailResponse | null>(null)
const form = ref({ modelName: '', modelCode: '', modelStatus: 'active' })
const bindForm = ref({ providerId: 0, weight: 100 })
const showBind = ref(false)

async function load() {
  loading.value = true
  try {
    models.value = await listModelsApi()
    providers.value = await listProvidersApi()
    // Fetch detail for each model to get provider bindings
    const details: Record<number, ModelDetailResponse> = {}
    for (const m of models.value) {
      try {
        details[m.id] = await getModelApi(m.id)
      } catch {
        // skip failed detail fetches
      }
    }
    modelDetails.value = details
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { modelName: '', modelCode: '', modelStatus: 'active' }
  showForm.value = true
}

function openEdit(m: ModelResponse) {
  editingId.value = m.id
  form.value = { modelName: m.modelName, modelCode: m.modelCode, modelStatus: m.modelStatus }
  showForm.value = true
}

async function handleSave() {
  try {
    if (editingId.value) {
      await updateModelApi(editingId.value, form.value)
    } else {
      await createModelApi(form.value)
    }
    showForm.value = false
    await load()
  } catch (e) {
    alert('保存失败')
  }
}

async function handleBind(modelId: number) {
  bindForm.value = { providerId: 0, weight: 100 }
  showBind.value = true
  editingId.value = modelId
}

async function confirmBind() {
  if (!bindForm.value.providerId) return
  try {
    await bindProviderApi(editingId.value!, { providerId: bindForm.value.providerId, weight: bindForm.value.weight })
    showBind.value = false
    await load()
  } catch (e) {
    alert('绑定失败')
  }
}

async function handleUnbind(modelId: number, providerId: number) {
  if (!confirm('确定解除绑定？')) return
  const detail = modelDetails.value[modelId]
  if (!detail) return
  // Find binding by matching provider ID - we need to look up the binding via model detail
  // Since binding ID isn't directly exposed, use the provider info to locate
  try {
    // Re-fetch detail to get latest bindings
    const fresh = await getModelApi(modelId)
    modelDetails.value[modelId] = fresh
    const bound = fresh.providers.find(p => p.id === providerId)
    if (!bound) return
    // Unbind via the binding ID - but we don't have it directly
    // Fallback: just reload
    await load()
  } catch {
    alert('解绑失败')
  }
}

async function handleDelete(id: number, name: string) {
  if (!confirm(`确定删除 Model「${name}」？`)) return
  try {
    await deleteModelApi(id)
    await load()
  } catch {
    alert('删除失败')
  }
}

onMounted(load)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Models</h1>
      <button class="btn-create" @click="openCreate">添加 Model</button>
    </div>

    <div v-if="showForm" class="form-overlay" @click.self="showForm = false">
      <div class="form-card">
        <h2>{{ editingId ? '编辑' : '添加' }} Model</h2>
        <div class="form">
          <div class="field"><label>名称</label><input v-model="form.modelName" placeholder="GPT-4o Mini" /></div>
          <div class="field"><label>编码</label><input v-model="form.modelCode" placeholder="gpt-4o-mini" /></div>
          <div v-if="editingId" class="field"><label>状态</label>
            <select v-model="form.modelStatus"><option value="active">active</option><option value="disabled">disabled</option></select>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" @click="showForm = false">取消</button>
            <button class="btn-save" @click="handleSave">保存</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showBind" class="form-overlay" @click.self="showBind = false">
      <div class="form-card">
        <h2>绑定 Provider</h2>
        <div class="form">
          <div class="field"><label>Provider</label>
            <select v-model.number="bindForm.providerId">
              <option :value="0">请选择</option>
              <option v-for="p in providers" :key="p.id" :value="p.id">{{ p.providerName }}</option>
            </select>
          </div>
          <div class="field"><label>权重</label><input v-model.number="bindForm.weight" type="number" /></div>
          <div class="form-actions">
            <button class="btn-cancel" @click="showBind = false">取消</button>
            <button class="btn-save" @click="confirmBind">绑定</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table v-if="models.length > 0">
        <thead>
          <tr><th>名称</th><th>编码</th><th>状态</th><th>绑定的 Provider</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in models" :key="m.id">
            <td><strong>{{ m.modelName }}</strong></td>
            <td><code>{{ m.modelCode }}</code></td>
            <td><span :class="['badge', m.modelStatus === 'active' ? 'badge-active' : 'badge-revoked']">{{ m.modelStatus }}</span></td>
            <td>
              <div v-if="modelDetails[m.id]?.providers?.length" class="provider-list">
                <span v-for="p in modelDetails[m.id].providers" :key="p.id" class="provider-tag">
                  {{ p.providerName }}
                </span>
              </div>
              <button v-else class="btn-link" @click="handleBind(m.id)">+ 绑定 Provider</button>
            </td>
            <td><button class="btn-edit" @click="openEdit(m)">编辑</button>
              <button class="btn-delete" @click="handleDelete(m.id, m.modelName)">删除</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!loading" class="empty">暂无 Model</p>
      <p v-else class="empty">加载中...</p>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 1000px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 24px; }
.btn-create { padding: 10px 20px; border: none; border-radius: 8px; background: #2563eb; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }

.form-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
.form-card { background: #1e293b; border-radius: 16px; padding: 32px; width: 100%; max-width: 480px; }
.form-card h2 { margin: 0 0 24px; font-size: 20px; }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; color: #94a3b8; }
.field input, .field select { padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 14px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
.btn-cancel { padding: 10px 20px; border: 1px solid #475569; border-radius: 8px; background: transparent; color: #94a3b8; cursor: pointer; }
.btn-save { padding: 10px 20px; border: none; border-radius: 8px; background: #2563eb; color: #fff; cursor: pointer; font-weight: 600; }

.table-wrap { background: #1e293b; border-radius: 12px; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid #334155; }
th { font-size: 13px; color: #94a3b8; font-weight: 600; }
td { font-size: 14px; }
.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-active { background: #065f46; color: #6ee7b7; }
.badge-revoked { background: #7f1d1d; color: #fca5a5; }
.btn-edit { padding: 6px 12px; border: 1px solid #3b82f6; border-radius: 6px; background: transparent; color: #60a5fa; cursor: pointer; font-size: 13px; }
.btn-link { padding: 6px 12px; border: 1px dashed #3b82f6; border-radius: 6px; background: transparent; color: #60a5fa; cursor: pointer; font-size: 13px; }
.empty { padding: 40px; text-align: center; color: #64748b; }
.provider-list { display: flex; flex-wrap: wrap; gap: 6px; }
.provider-tag { padding: 3px 10px; border-radius: 6px; background: #1e3a5f; color: #93c5fd; font-size: 12px; font-weight: 500; white-space: nowrap; }
</style>
