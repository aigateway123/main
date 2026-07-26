<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function showAlert(msg: string) {
  alert(msg)
}

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-full w-full bg-page flex items-center justify-center p-6">
    <div class="w-full max-w-[420px] bg-white rounded-lg border border-border shadow-sm p-8 space-y-6">
      <!-- Brand Logo & Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white shadow-md mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-text-primary tracking-tight">Nova AI Gateway</h2>
        <p class="text-xs text-text-secondary">企业级 AI 大模型统一控制台与网关管理系统</p>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium text-center"
      >
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1.5 text-left">
          <label class="text-xs font-semibold text-text-primary flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            管理员邮箱
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="请输入管理员邮箱"
            class="w-full h-10 px-3 text-sm bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            required
          />
        </div>

        <div class="space-y-1.5 text-left">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              密码
            </label>
            <a
              href="#forgot"
              class="text-[11px] text-primary hover:underline"
              @click.prevent="showAlert('请联系系统高级管理员重置安全密钥')"
            >
              忘记密码？
            </a>
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="请输入登录密码"
            class="w-full h-10 px-3 text-sm bg-white border border-border rounded text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            required
            minlength="6"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full h-10 bg-primary hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-btn transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-70 mt-2 cursor-pointer"
        >
          <template v-if="loading">
            <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            安全验证中...
          </template>
          <template v-else>
            <span>登 录</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </template>
        </button>
      </form>

      <!-- Security Badge -->
      <div class="pt-2 border-t border-border flex items-center justify-center gap-2 text-[11px] text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>受系统高级鉴权策略保护 (B2B Multi-Tenant Safety)</span>
      </div>
    </div>
  </div>
</template>
