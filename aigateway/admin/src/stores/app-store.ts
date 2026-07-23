import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const appName = ref('Nova AI Gateway Admin')
  const isBootstrapped = ref(true)

  const headerTitle = computed(() => appName.value)

  return {
    appName,
    headerTitle,
    isBootstrapped,
  }
})
