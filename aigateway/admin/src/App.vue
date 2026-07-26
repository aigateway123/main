<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '@/components/common/app-shell.vue'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const auth = useAuthStore()

// 应用初始化时，如果已有 token 则拉取用户完整信息（含权限列表）
onMounted(async () => {
  if (auth.isLoggedIn) {
    try {
      await auth.fetchProfile()
    } catch {
      // token 过期或无效，清除登录状态
      auth.logout()
    }
  }
})

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (!loggedIn) {
      router.push('/login')
    }
  },
)
</script>

<template>
  <RouterView v-if="!auth.isLoggedIn" />
  <AppShell v-else />
</template>
