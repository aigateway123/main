<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listProvidersApi, createProviderApi, updateProviderApi, deleteProviderApi, type ProviderResponse } from '@/api/providers'

const providers = ref<ProviderResponse[]>([])
const loading = ref(false)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({ providerName: '', baseUrl: '', apiKeyRef: '', apiPath: '/v1/chat/completions', priority: 100, weight: 100, isEnabledFlag: true })

async function load() {
  loading.value = true
  try { providers.value = await listProvidersApi() } finally { loading.value = false }
}

function openCreate() {
  editingId.value = null
  form.value = { providerName: '', baseUrl: '', apiKeyRef: '', apiPath: '/v1/chat/completions', priority: 100, weight: 100, isEnabledFlag: true }
  showForm.value = true
}

function openEdit(p: ProviderResponse) {
  editingId.value = p.id
  form.value = { providerName: p.providerName, baseUrl: p.baseUrl, apiKeyRef: p.apiKeyRef ?? '', apiPath: p.apiPath ?? '/v1/chat/completions', priority: p.priority, weight: p.weight, isEnabledFlag: p.isEnabledFlag }
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
  } catch { alert('保存失败') }
}

async function handleDelete(id: number, name: string) {
  if (!confirm(`确定删除 Provider「${name}」？`)) return
  try { await deleteProviderApi(id); await load() } catch { alert('删除失败') }
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
          Provider 供应商管理
        </h2>
        <p class="text-xs text-text-secondary mt-0.5">配置 OpenAI、DeepSeek、Azure 等后端 LLM 接口节点、优先级及分流权重</p>
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

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">供应商名称</th><th class="px-4 py-2">Base URL</th><th class="px-4 py-2">优先级</th>
              <th class="px-4 py-2">权重</th><th class="px-4 py-2">状态</th><th class="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && providers.length > 0" class="divide-y divide-border">
            <tr
              v-for="(p, index) in providers"
              :key="p.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2 font-bold text-text-primary">{{ p.providerName }}</td>
              <td class="px-4 py-2 font-mono text-text-secondary max-w-[200px] truncate" :title="p.baseUrl">{{ p.baseUrl }}</td>
              <td class="px-4 py-2 font-mono font-semibold text-text-primary">{{ p.priority }}</td>
              <td class="px-4 py-2 font-mono font-semibold text-text-primary">{{ p.weight }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    p.isEnabledFlag
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-slate-100 text-slate-600 border-slate-200',
                  ]"
                >
                  {{ p.isEnabledFlag ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-2 text-right space-x-2">
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

    <!-- Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showForm = false">
        <div class="bg-white w-full max-w-xl rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-start justify-between border-b border-border pb-3">
            <h3 class="text-xl font-bold text-text-primary">{{ editingId ? '编辑' : '添加' }} Provider</h3>
            <button class="text-text-secondary hover:text-text-primary p-1 rounded cursor-pointer" @click="showForm = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSave" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">供应商名称</label>
                <input v-model="form.providerName" type="text" placeholder="如：OpenAI Direct"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">Base URL</label>
                <input v-model="form.baseUrl" type="text" placeholder="https://api.openai.com/v1"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" required />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">API 路径</label>
                <input v-model="form.apiPath" type="text" placeholder="/chat/completions"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">API Key 引用</label>
                <input v-model="form.apiKeyRef" type="text" placeholder="env:OPENAI_API_KEY"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">优先级 (数字越小越优先)</label>
                <input v-model.number="form.priority" type="number" min="1" max="100"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-text-primary">权重 (流量分发比例)</label>
                <input v-model.number="form.weight" type="number" min="1" max="1000"
                  class="w-full h-9 px-3 text-xs bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div class="pt-2 flex items-center justify-between border-t border-border">
              <div>
                <div class="text-xs font-semibold text-text-primary">启用此 Provider</div>
                <div class="text-[11px] text-text-secondary">禁用后网关将自动停止向该节点转发流量</div>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0',
                  form.isEnabledFlag ? 'bg-primary' : 'bg-slate-300',
                ]"
                @click="form.isEnabledFlag = !form.isEnabledFlag"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    form.isEnabledFlag ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button type="button"
                class="h-9 px-4 border border-[#cbd5e1] text-text-btn bg-white hover:bg-slate-50 font-medium text-xs rounded-btn transition-colors cursor-pointer"
                @click="showForm = false">取消</button>
              <button type="submit"
                class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn shadow-xs transition-colors cursor-pointer">保存 Provider</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
