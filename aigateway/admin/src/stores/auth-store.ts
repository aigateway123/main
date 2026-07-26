import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loginApi, registerApi, getProfileApi, type LoginRequest, type RegisterRequest } from '@/api/auth'

const TOKEN_KEY = 'admin_access_token'

export interface UserProfile {
  userId: number
  email: string
  nickname: string
  role: string
  quotaBalance: number
  permissions: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem(TOKEN_KEY) ?? '')
  const userProfile = ref<UserProfile | null>(null)

  const isLoggedIn = computed(() => !!accessToken.value)
  const currentUser = computed(() => userProfile.value)
  const isAdmin = computed(() => userProfile.value?.role === 'Admin')

  function setToken(token: string) {
    accessToken.value = token
    localStorage.setItem(TOKEN_KEY, token)
  }

  function clearToken() {
    accessToken.value = ''
    userProfile.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  function hasPermission(code: string): boolean {
    if (!userProfile.value) return false
    return userProfile.value.permissions.includes(code)
  }

  async function fetchProfile() {
    const profile = await getProfileApi()
    userProfile.value = {
      userId: profile.userId,
      email: profile.email,
      nickname: profile.nickname,
      role: profile.role ?? '',
      quotaBalance: profile.quotaBalance ?? 0,
      permissions: profile.permissions ?? [],
    }
    return profile
  }

  async function login(data: LoginRequest) {
    const result = await loginApi(data)
    setToken(result.accessToken)
    userProfile.value = {
      userId: result.userId,
      email: result.email,
      nickname: result.nickname,
      role: result.role ?? '',
      quotaBalance: result.quotaBalance ?? 0,
      permissions: [],
    }
    // 登录后立即拉取完整 profile（含权限列表）
    try {
      const profile = await getProfileApi()
      userProfile.value = {
        userId: profile.userId,
        email: profile.email,
        nickname: profile.nickname,
        role: profile.role ?? '',
        quotaBalance: profile.quotaBalance ?? 0,
        permissions: profile.permissions ?? [],
      }
    } catch {
      // 静默失败，使用登录返回的基本信息
    }
    return result
  }

  async function register(data: RegisterRequest) {
    const result = await registerApi(data)
    setToken(result.accessToken)
    userProfile.value = {
      userId: result.userId,
      email: result.email,
      nickname: result.nickname,
      role: result.role ?? '',
      quotaBalance: result.quotaBalance ?? 0,
      permissions: [],
    }
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
    isAdmin,
    login,
    register,
    logout,
    setToken,
    clearToken,
    hasPermission,
    fetchProfile,
  }
})
