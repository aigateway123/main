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

    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (e) {
    alert('创建失败')
  }
}

async function handleRevoke(id: number) {
  if (!confirm('确定要撤销这个 API Key 吗？')) return
  try {
    await revokeApiKeyApi(id)
    await loadKeys()
  } catch (e) {
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
  <div class="page">
    <div class="page-header">
      <h1>API Keys</h1>
      <button class="btn-create" @click="handleCreate">创建 Key</button>
    </div>

    <div v-if="newKey" class="new-key-banner">
      <p class="banner-title">Key 创建成功！请立即复制保存，关闭后将无法再次查看。</p>
      <div class="key-display">
        <code>{{ newKey }}</code>
        <button class="btn-copy" @click="copyToClipboard">{{ copySuccess ? '已复制' : '复制' }}</button>
      </div>
    </div>

    <div class="table-wrap">
      <table v-if="keys.length > 0">
        <thead>
          <tr>
            <th>前缀</th>
            <th>权限范围</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in keys" :key="key.id">
            <td><code>{{ key.keyPrefix }}...</code></td>
            <td>{{ key.permissionScope }}</td>
            <td>
              <span :class="['badge', key.keyStatus === 'active' ? 'badge-active' : 'badge-revoked']">
                {{ key.keyStatus }}
              </span>
            </td>
            <td>{{ key.createdAt }}</td>
            <td>
              <button
                v-if="key.keyStatus === 'active'"
                class="btn-revoke"
                @click="handleRevoke(key.id)"
              >
                撤销
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!loading" class="empty">暂无 API Key</p>
      <p v-else class="empty">加载中...</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.btn-create {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.new-key-banner {
  background: #1e3a5f;
  border: 1px solid #3b82f6;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.banner-title {
  margin: 0 0 12px;
  color: #93c5fd;
  font-size: 14px;
}

.key-display {
  display: flex;
  gap: 12px;
  align-items: center;
}

.key-display code {
  flex: 1;
  padding: 10px;
  background: #0f172a;
  border-radius: 6px;
  font-size: 13px;
  word-break: break-all;
  color: #e2e8f0;
}

.btn-copy {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  background: transparent;
  color: #60a5fa;
  cursor: pointer;
  font-size: 13px;
}

.table-wrap {
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #334155;
}

th {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
}

td {
  font-size: 14px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-active {
  background: #065f46;
  color: #6ee7b7;
}

.badge-revoked {
  background: #7f1d1d;
  color: #fca5a5;
}

.btn-revoke {
  padding: 6px 12px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  font-size: 13px;
}

.empty {
  padding: 40px;
  text-align: center;
  color: #64748b;
}
</style>
