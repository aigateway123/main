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
  <div class="min-h-screen w-full flex">
    <!-- Left Column (55%) - Brand Showcase -->
    <div class="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 relative overflow-hidden flex-col justify-between">
      <!-- Background decorative elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] bg-indigo-400/10 rounded-full blur-[80px]" />

      <!-- Center Illustration -->
      <div class="flex-1 flex items-center justify-center p-8">
        <svg class="w-72 h-72" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Central node -->
          <circle cx="150" cy="150" r="32" fill="white" fill-opacity="0.15" stroke="white" stroke-width="1.5" stroke-opacity="0.4" />
          <circle cx="150" cy="150" r="12" fill="white" fill-opacity="0.5" />
          <circle cx="150" cy="150" r="4" fill="white" />

          <!-- Orbiting nodes -->
          <circle cx="150" cy="75" r="10" fill="white" fill-opacity="0.25" stroke="white" stroke-width="1" stroke-opacity="0.3" />
          <circle cx="225" cy="150" r="10" fill="white" fill-opacity="0.25" stroke="white" stroke-width="1" stroke-opacity="0.3" />
          <circle cx="150" cy="225" r="10" fill="white" fill-opacity="0.25" stroke="white" stroke-width="1" stroke-opacity="0.3" />
          <circle cx="75" cy="150" r="10" fill="white" fill-opacity="0.25" stroke="white" stroke-width="1" stroke-opacity="0.3" />

          <!-- Outer nodes -->
          <circle cx="150" cy="40" r="6" fill="white" fill-opacity="0.15" />
          <circle cx="260" cy="110" r="6" fill="white" fill-opacity="0.15" />
          <circle cx="260" cy="190" r="6" fill="white" fill-opacity="0.15" />
          <circle cx="150" cy="260" r="6" fill="white" fill-opacity="0.15" />
          <circle cx="40" cy="190" r="6" fill="white" fill-opacity="0.15" />
          <circle cx="40" cy="110" r="6" fill="white" fill-opacity="0.15" />

          <!-- Connection lines - inner ring -->
          <line x1="150" y1="75" x2="225" y2="150" stroke="white" stroke-width="1" stroke-opacity="0.2" />
          <line x1="225" y1="150" x2="150" y2="225" stroke="white" stroke-width="1" stroke-opacity="0.2" />
          <line x1="150" y1="225" x2="75" y2="150" stroke="white" stroke-width="1" stroke-opacity="0.2" />
          <line x1="75" y1="150" x2="150" y2="75" stroke="white" stroke-width="1" stroke-opacity="0.2" />

          <!-- Connection lines - outer ring -->
          <line x1="150" y1="40" x2="260" y2="110" stroke="white" stroke-width="0.8" stroke-opacity="0.12" />
          <line x1="260" y1="110" x2="260" y2="190" stroke="white" stroke-width="0.8" stroke-opacity="0.12" />
          <line x1="260" y1="190" x2="150" y2="260" stroke="white" stroke-width="0.8" stroke-opacity="0.12" />
          <line x1="150" y1="260" x2="40" y2="190" stroke="white" stroke-width="0.8" stroke-opacity="0.12" />
          <line x1="40" y1="190" x2="40" y2="110" stroke="white" stroke-width="0.8" stroke-opacity="0.12" />
          <line x1="40" y1="110" x2="150" y2="40" stroke="white" stroke-width="0.8" stroke-opacity="0.12" />

          <!-- Gateway indicator bars -->
          <rect x="142" y="130" width="16" height="4" rx="2" fill="white" fill-opacity="0.6" />
          <rect x="142" y="140" width="16" height="4" rx="2" fill="white" fill-opacity="0.3" />
          <rect x="142" y="150" width="16" height="4" rx="2" fill="white" fill-opacity="0.6" />

          <!-- Orbital ring -->
          <ellipse cx="150" cy="150" rx="90" ry="90" stroke="white" stroke-width="0.5" stroke-opacity="0.1" fill="none" stroke-dasharray="6 4" />
          <ellipse cx="150" cy="150" rx="70" ry="70" stroke="white" stroke-width="0.5" stroke-opacity="0.15" fill="none" stroke-dasharray="4 6" />
        </svg>
      </div>

      <!-- Bottom Brand Text -->
      <div class="absolute bottom-0 left-0 p-12 space-y-6">
        <div>
          <h2 class="text-3xl font-bold text-white tracking-tight">Nova AI Gateway</h2>
          <p class="text-white/60 text-sm mt-1">企业级 AI 网关平台</p>
        </div>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
          <span>统一接入</span>
          <span class="text-white/30">·</span>
          <span>智能路由</span>
          <span class="text-white/30">·</span>
          <span>成本优化</span>
          <span class="text-white/30">·</span>
          <span>安全合规</span>
        </div>
      </div>
    </div>

    <!-- Right Column (45%) - Login Form -->
    <div class="w-full lg:w-[45%] bg-white flex items-center justify-center p-8">
      <div class="w-full max-w-sm space-y-6">
        <!-- Logo -->
        <div class="text-center space-y-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/25 mx-auto">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <p class="text-lg font-semibold text-slate-900">Nova</p>
            <p class="text-sm text-slate-400">AI Gateway</p>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-xl font-semibold text-slate-900 tracking-tight text-center">登录到控制台</h1>

        <!-- Error -->
        <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">邮箱</label>
            <input
              v-model="email"
              type="email"
              class="block w-full h-10 px-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-colors duration-150 focus:border-blue-400"
              required
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-slate-700">密码</label>
              <a
                href="#forgot"
                class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                @click.prevent="showAlert('请联系系统管理员重置密码')"
              >忘记密码？</a>
            </div>
            <input
              v-model="password"
              type="password"
              class="block w-full h-10 px-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-colors duration-150 focus:border-blue-400"
              required
              minlength="6"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-medium transition-colors duration-150 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            登录
          </button>
        </form>

        <!-- Footer -->
        <p class="text-xs text-slate-300 text-center pt-4">&copy; Nova AI Gateway 2026</p>
      </div>
    </div>
  </div>
</template>
