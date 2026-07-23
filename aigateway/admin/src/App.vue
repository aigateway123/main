<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '@/components/common/app-shell.vue'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const auth = useAuthStore()

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
