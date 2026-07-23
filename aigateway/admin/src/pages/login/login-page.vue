<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const auth = useAuthStore()

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const nickname = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (isRegister.value) {
      await auth.register({ email: email.value, password: password.value, nickname: nickname.value || email.value.split('@')[0] })
    } else {
      await auth.login({ email: email.value, password: password.value })
    }
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? '操作失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">Nova AI Gateway</h1>
      <p class="subtitle">{{ isRegister ? '创建账号' : '登录管理后台' }}</p>

      <form @submit.prevent="handleSubmit" class="form">
        <div v-if="isRegister" class="field">
          <label>Nickname</label>
          <input v-model="nickname" type="text" placeholder="昵称（可选）" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="you@example.com" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="至少 6 位" required minlength="6" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? '处理中...' : isRegister ? '注册' : '登录' }}
        </button>
      </form>

      <p class="switch">
        {{ isRegister ? '已有账号？' : '没有账号？' }}
        <button class="link-btn" @click="isRegister = !isRegister">
          {{ isRegister ? '去登录' : '去注册' }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #1e293b;
  border-radius: 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
}

.subtitle {
  color: #94a3b8;
  margin: 0 0 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  color: #cbd5e1;
}

.field input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 15px;
}

.field input:focus {
  outline: none;
  border-color: #2563eb;
}

.error {
  color: #ef4444;
  font-size: 14px;
  margin: 0;
}

.btn-primary {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch {
  margin-top: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.link-btn {
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}
</style>
