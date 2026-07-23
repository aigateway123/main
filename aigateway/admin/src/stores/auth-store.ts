import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loginApi, registerApi, type LoginRequest, type RegisterRequest } from '@/api/auth'

const TOKEN_KEY = 'admin_access_token'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem(TOKEN_KEY) ?? '')
  const userProfile = ref<{ userId: number; email: string; nickname: string } | null>(null)

  const isLoggedIn = computed(() => !!accessToken.value)
  const currentUser = computed(() => userProfile.value)

  function setToken(token: string) {
    accessToken.value = token
    localStorage.setItem(TOKEN_KEY, token)
  }

  function clearToken() {
    accessToken.value = ''
    userProfile.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  async function login(data: LoginRequest) {
    const result = await loginApi(data)
    setToken(result.accessToken)
    userProfile.value = { userId: result.userId, email: result.email, nickname: result.nickname }
    return result
  }

  async function register(data: RegisterRequest) {
    const result = await registerApi(data)
    setToken(result.accessToken)
    userProfile.value = { userId: result.userId, email: result.email, nickname: result.nickname }
    return result
  }

  function logout() {
    clearToken()
  }

  return {
    accessToken,
    userProfile,
    isLoggedIn,
    currentUser,
    login,
    register,
    logout,
    setToken,
    clearToken,
  }
})
