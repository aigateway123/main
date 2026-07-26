<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  subtitle?: string
  size?: 'md' | 'lg' | 'xl'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const sizeClasses: Record<string, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div
        :class="[
          'bg-white w-full rounded-lg border border-border shadow-xl p-6 space-y-5 animate-in zoom-in-95 duration-150',
          sizeClasses[size ?? 'md'],
        ]"
      >
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-border pb-3">
          <div>
            <h3 class="text-xl font-bold text-text-primary">{{ title }}</h3>
            <p v-if="subtitle" class="text-xs text-text-secondary mt-0.5">{{ subtitle }}</p>
          </div>
          <button
            class="text-text-secondary hover:text-text-primary p-1 rounded transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Content -->
        <slot />
      </div>
    </div>
  </Teleport>
</template>
