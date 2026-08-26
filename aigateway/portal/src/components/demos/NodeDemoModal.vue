<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  open: boolean
  title: string
  subtitle: string
  icon?: Component
}>()

const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <div
              v-if="icon"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0"
            >
              <component :is="icon" class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-extrabold text-slate-900 truncate">{{ title }}</h3>
              <p class="text-xs text-slate-500 font-mono truncate">{{ subtitle }}</p>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
