<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  listProvidersApi,
  createProviderApi,
  updateProviderApi,
  deleteProviderApi,
  type ProviderResponse,
} from '@/api/providers'

const providers = ref<ProviderResponse[]>([])
const loading = ref(false)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ providerName: '', baseUrl: '', apiKeyRef: '', apiPath: '/v1/chat/completions', priority: 100, weight: 100, isEnabledFlag: true })

async function load() {
  loading.value = true
  try {
    providers.value = await listProvidersApi()
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { providerName: '', baseUrl: '', apiKeyRef: '', apiPath: '/v1/chat/completions', priority: 100, weight: 100, isEnabledFlag: true }
  showForm.value = true
}

function openEdit(p: ProviderResponse) {
  editingId.value = p.id
  form.value = {
    providerName: p.providerName,
    baseUrl: p.baseUrl,
    apiKeyRef: p.apiKeyRef ?? '',
    apiPath: p.apiPath ?? '/v1/chat/completions',
    priority: p.priority,
    weight: p.weight,
    isEnabledFlag: p.isEnabledFlag,
  }
  showForm.value = true
}

async function handleSave() {
  try {
    if (editingId.value) {
      await updateProviderApi(editingId.value, form.value)
    } else {
      await createProviderApi(form.value)
    }
    showForm.value = false
    await load()
  } catch (e) {
    alert('保存失败')
  }
}

async function handleDelete(id: number, name: string) {
  if (!confirm(`确定删除 Provider「${name}」？`)) return
  try {
    await deleteProviderApi(id)
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
      <h1>Providers</h1>
      <button class="btn-create" @click="openCreate">添加 Provider</button>
    </div>

    <div v-if="showForm" class="form-overlay" @click.self="showForm = false">
      <div class="form-card">
        <h2>{{ editingId ? '编辑' : '添加' }} Provider</h2>
        <div class="form">
          <div class="field"><label>名称</label><input v-model="form.providerName" placeholder="openai" /></div>
          <div class="field"><label>Base URL</label><input v-model="form.baseUrl" placeholder="https://api.openai.com" /></div>
          <div class="field"><label>API 路径</label><input v-model="form.apiPath" placeholder="/v1/chat/completions" /></div>
          <div class="field"><label>API Key 引用</label><input v-model="form.apiKeyRef" placeholder="OPENAI_API_KEY" /></div>
          <div class="field-row">
            <div class="field"><label>优先级</label><input v-model.number="form.priority" type="number" /></div>
            <div class="field"><label>权重</label><input v-model.number="form.weight" type="number" /></div>
          </div>
          <div class="field-checkbox">
            <label><input v-model="form.isEnabledFlag" type="checkbox" /> 启用</label>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" @click="showForm = false">取消</button>
            <button class="btn-save" @click="handleSave">保存</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table v-if="providers.length > 0">
        <thead>
          <tr>
            <th>名称</th><th>Base URL</th><th>优先级</th><th>权重</th><th>状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in providers" :key="p.id">
            <td><strong>{{ p.providerName }}</strong></td>
            <td class="url-cell">{{ p.baseUrl }}</td>
            <td>{{ p.priority }}</td>
            <td>{{ p.weight }}</td>
            <td><span :class="['badge', p.isEnabledFlag ? 'badge-active' : 'badge-revoked']">{{ p.isEnabledFlag ? '启用' : '禁用' }}</span></td>
            <td><button class="btn-edit" @click="openEdit(p)">编辑</button>
              <button class="btn-delete" @click="handleDelete(p.id, p.providerName)">删除</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!loading" class="empty">暂无 Provider</p>
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
.field { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.field label { font-size: 13px; color: #94a3b8; }
.field input, .field select { padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 14px; }
.field-row { display: flex; gap: 12px; }
.field-checkbox label { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
.btn-cancel { padding: 10px 20px; border: 1px solid #475569; border-radius: 8px; background: transparent; color: #94a3b8; cursor: pointer; }
.btn-save { padding: 10px 20px; border: none; border-radius: 8px; background: #2563eb; color: #fff; cursor: pointer; font-weight: 600; }

.table-wrap { background: #1e293b; border-radius: 12px; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid #334155; }
th { font-size: 13px; color: #94a3b8; font-weight: 600; }
td { font-size: 14px; }
.url-cell { max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-active { background: #065f46; color: #6ee7b7; }
.badge-revoked { background: #7f1d1d; color: #fca5a5; }
.btn-edit { padding: 6px 12px; border: 1px solid #3b82f6; border-radius: 6px; background: transparent; color: #60a5fa; cursor: pointer; font-size: 13px; }
.btn-edit + .btn-delete { margin-left: 8px; }
.btn-delete { padding: 6px 12px; border: 1px solid #ef4444; border-radius: 6px; background: transparent; color: #f87171; cursor: pointer; font-size: 13px; }
.empty { padding: 40px; text-align: center; color: #64748b; }
</style>
