<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createApiKeyApi, listApiKeysApi, revokeApiKeyApi, type ApiKeyResponse } from '@/api/api-keys'

const keys = ref<ApiKeyResponse[]>([])
const loading = ref(false)
const newKey = ref<string | null>(null)
const copySuccess = ref(false)

async function loadKeys() {
  loading.value = true
  try {
    keys.value = await listApiKeysApi()
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  try {
    const result = await createApiKeyApi()
    newKey.value = result.fullKey ?? ''
    await loadKeys()
    setTimeout(() => { copySuccess.value = false }, 3000)
  } catch {
    alert('创建失败')
  }
}

async function handleRevoke(id: number) {
  if (!confirm('确定要撤销这个 API Key 吗？')) return
  try {
    await revokeApiKeyApi(id)
    await loadKeys()
  } catch {
    alert('撤销失败')
  }
}

function copyToClipboard() {
  if (newKey.value) {
    navigator.clipboard.writeText(newKey.value)
    copySuccess.value = true
  }
}

onMounted(loadKeys)
</script>

<template>
  <div class="p-6 space-y-6 bg-page min-h-full">
    <!-- Header -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-border">
      <div>
        <h2 class="text-base font-bold text-text-primary">API Key 管理</h2>
        <p class="text-xs text-text-secondary mt-0.5">客户端密钥生成、作用域隔离与安全撤销控制</p>
      </div>
      <button
        class="h-9 px-4 bg-primary hover:bg-blue-700 text-white font-medium text-xs rounded-btn transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        @click="handleCreate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        创建 Key
      </button>
    </div>

    <!-- New Key Banner -->
    <div
      v-if="newKey"
      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <p class="text-xs font-medium text-blue-700 mb-2">Key 创建成功！请立即复制保存，关闭后将无法再次查看。</p>
      <div class="flex gap-3 items-center">
        <code class="flex-1 px-3 py-2 bg-white border border-blue-200 rounded text-xs font-mono text-text-primary break-all">{{ newKey }}</code>
        <button
          class="h-8 px-3 text-xs font-medium text-primary hover:bg-blue-100 border border-blue-200 rounded-btn transition-colors cursor-pointer shrink-0"
          @click="copyToClipboard"
        >
          {{ copySuccess ? '已复制' : '复制' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg border border-border p-5 space-y-4">
      <div class="overflow-x-auto rounded border border-border">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#f8f9fa] border-b border-border text-text-secondary font-semibold h-10">
              <th class="px-4 py-2">前缀</th>
              <th class="px-4 py-2">权限范围</th>
              <th class="px-4 py-2">状态</th>
              <th class="px-4 py-2">创建时间</th>
              <th class="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody v-if="!loading && keys.length > 0" class="divide-y divide-border">
            <tr
              v-for="(key, index) in keys"
              :key="key.id"
              :class="['h-12 transition-colors hover:bg-[#eff6ff]/60', index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]']"
            >
              <td class="px-4 py-2">
                <code class="bg-[#f8f9fa] px-1.5 py-0.5 rounded text-[11px]">{{ key.keyPrefix }}...</code>
              </td>
              <td class="px-4 py-2 text-text-primary">{{ key.permissionScope }}</td>
              <td class="px-4 py-2">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                    key.keyStatus === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border-rose-200/60',
                  ]"
                >
                  {{ key.keyStatus }}
                </span>
              </td>
              <td class="px-4 py-2 text-text-secondary text-[11px] font-mono">{{ key.createdAt }}</td>
              <td class="px-4 py-2">
                <button
                  v-if="key.keyStatus === 'active'"
                  class="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  @click="handleRevoke(key.id)"
                >
                  撤销
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="py-10 text-center text-text-secondary text-xs">加载中...</div>
        <div v-else-if="keys.length === 0" class="py-10 text-center text-text-secondary text-xs">暂无 API Key</div>
      </div>
    </div>
  </div>
</template>
