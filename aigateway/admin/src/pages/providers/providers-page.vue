<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  listProvidersApi,
  createProviderApi,
  updateProviderApi,
  deleteProviderApi,
  type ProviderResponse,
} from '@/api/providers'

interface ProviderForm {
  providerName: string
  baseUrl: string
  apiPath: string
  apiKeyRef: string
  anthropicBaseUrl: string
  anthropicApiPath: string
  anthropicApiKeyRef: string
  anthropicAuthType: string
  priority: number
  weight: number
  isEnabledFlag: boolean
}

function emptyForm(): ProviderForm {
  return {
    providerName: '',
    baseUrl: '',
    apiPath: '/v1/chat/completions',
    apiKeyRef: '',
    anthropicBaseUrl: '',
    anthropicApiPath: '/v1/messages',
    anthropicApiKeyRef: '',
    anthropicAuthType: 'api_key',
    priority: 100,
    weight: 100,
    isEnabledFlag: true,
  }
}

const providers = ref<ProviderResponse[]>([])
const loading = ref(false)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref<ProviderForm>(emptyForm())

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
  form.value = emptyForm()
  showForm.value = true
}

function openEdit(p: ProviderResponse) {
  editingId.value = p.id
  form.value = {
    providerName: p.providerName,
    baseUrl: p.baseUrl ?? '',
    apiPath: p.apiPath || '/v1/chat/completions',
    apiKeyRef: p.apiKeyRef ?? '',
    anthropicBaseUrl: p.anthropicBaseUrl ?? '',
    anthropicApiPath: p.anthropicApiPath || '/v1/messages',
    anthropicApiKeyRef: p.anthropicApiKeyRef ?? '',
    anthropicAuthType: p.anthropicAuthType || 'api_key',
    priority: p.priority,
    weight: p.weight,
    isEnabledFlag: p.isEnabledFlag,
  }
  showForm.value = true
}

async function handleSave() {
  if (!form.value.baseUrl.trim() && !form.value.anthropicBaseUrl.trim()) {
    alert('请至少配置一种协议的端点（OpenAI 或 Anthropic）')
    return
  }
  // 未配置的协议不提交端点细节，避免写入无意义的路径/Key
  const payload = { ...form.value }
  if (!payload.baseUrl.trim()) {
    payload.baseUrl = ''
    payload.apiPath = ''
    payload.apiKeyRef = ''
  }
  if (!payload.anthropicBaseUrl.trim()) {
    payload.anthropicBaseUrl = ''
    payload.anthropicApiPath = ''
    payload.anthropicApiKeyRef = ''
  }
  try {
    if (editingId.value) {
      await updateProviderApi(editingId.value, payload)
    } else {
      await createProviderApi(payload)
    }
    showForm.value = false
    await load()
  } catch {
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
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
      <div>
        <h2 class="text-base font-bold text-text-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          Provider 管理
        </h2>
        <p class="text-xs text-text-secondary mt-0.5">管理 AI 供应商连接配置</p>
      </div>
      <button
        class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        @click="openCreate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        添加 Provider
      </button>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">{{ editingId ? '编辑' : '添加' }} Provider</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showForm = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-text-primary">名称</label>
              <input v-model="form.providerName" type="text" placeholder="openai"
                class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
            </div>

            <!-- OpenAI 端点 -->
            <div class="space-y-3 rounded border border-border p-3">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-sky-50 text-sky-700 border-sky-200/60">OpenAI</span>
                <span class="text-[11px] text-text-secondary">/v1/chat/completions 入站走此端点，留空表示不启用</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-text-primary">Base URL</label>
                  <input v-model="form.baseUrl" type="text" placeholder="https://api.openai.com"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-text-primary">API 路径</label>
                  <input v-model="form.apiPath" type="text" placeholder="/v1/chat/completions"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-text-primary">API Key 引用</label>
                <input v-model="form.apiKeyRef" type="text" placeholder="OPENAI_API_KEY"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
            </div>

            <!-- Anthropic 端点 -->
            <div class="space-y-3 rounded border border-border p-3">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-violet-50 text-violet-700 border-violet-200/60">Anthropic</span>
                <span class="text-[11px] text-text-secondary">/v1/messages 入站走此端点，留空表示不启用</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-text-primary">Base URL</label>
                  <input v-model="form.anthropicBaseUrl" type="text" placeholder="https://api.anthropic.com"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-text-primary">API 路径</label>
                  <input v-model="form.anthropicApiPath" type="text" placeholder="/v1/messages"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-text-primary">API Key 引用</label>
                  <input v-model="form.anthropicApiKeyRef" type="text" placeholder="ANTHROPIC_API_KEY"
                    class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-text-primary">认证方式</label>
                  <select v-model="form.anthropicAuthType"
                    class="w-full h-9 px-2 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary">
                    <option value="api_key">x-api-key</option>
                    <option value="bearer">Bearer</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-text-primary">优先级</label>
                <input v-model.number="form.priority" type="number"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-text-primary">权重</label>
                <input v-model.number="form.weight" type="number"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="form.isEnabledFlag" type="checkbox" id="enableFlag"
                class="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <label for="enableFlag" class="text-xs font-medium text-text-primary cursor-pointer">启用</label>
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

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">名称</th>
              <th class="px-4 py-2">协议</th>
              <th class="px-4 py-2">端点</th>
              <th class="px-4 py-2">优先级</th>
              <th class="px-4 py-2">权重</th>
              <th class="px-4 py-2">状态</th>
              <th class="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && providers.length > 0" class="divide-y divide-border">
            <tr
              v-for="(p, index) in providers"
              :key="p.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-bold text-text-primary">{{ p.providerName }}</td>
              <td class="px-4 py-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-if="p.baseUrl"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-sky-50 text-sky-700 border-sky-200/60"
                  >OpenAI</span>
                  <span
                    v-if="p.anthropicBaseUrl"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-violet-50 text-violet-700 border-violet-200/60"
                  >Anthropic</span>
                  <span
                    v-if="!p.baseUrl && !p.anthropicBaseUrl"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-rose-50 text-rose-700 border-rose-200/60"
                  >未配置</span>
                </div>
              </td>
              <td class="px-4 py-2 space-y-1">
                <div v-if="p.baseUrl" class="flex items-center gap-1.5">
                  <span class="w-14 shrink-0 text-[10px] text-text-secondary">OpenAI</span>
                  <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px] max-w-[240px] truncate">{{ p.baseUrl }}{{ p.apiPath || '/v1/chat/completions' }}</code>
                </div>
                <div v-if="p.anthropicBaseUrl" class="flex items-center gap-1.5">
                  <span class="w-14 shrink-0 text-[10px] text-text-secondary">Anthropic</span>
                  <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px] max-w-[240px] truncate">{{ p.anthropicBaseUrl }}{{ p.anthropicApiPath || '/v1/messages' }}</code>
                </div>
              </td>
              <td class="px-4 py-2">{{ p.priority }}</td>
              <td class="px-4 py-2">{{ p.weight }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    p.isEnabledFlag
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/60',
                  ]"
                >
                  {{ p.isEnabledFlag ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-2 space-x-2">
                <button
                  class="px-2 py-1 text-primary hover:bg-blue-50 border border-blue-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="openEdit(p)">编辑</button>
                <button
                  class="px-2 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleDelete(p.id, p.providerName)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="providers.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无 Provider</div>
      </div>
    </div>
  </div>
</template>
