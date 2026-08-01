<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Cpu, Terminal, Menu, X, ChevronRight } from 'lucide-vue-next'

defineProps<{
  adminUrl: string
}>()

const emit = defineEmits<{
  'open-console': []
}>()

const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: '首页', to: '/' },
  { name: '模型广场', to: '/models' },
  { name: '文档中心', to: '/docs' },
]

let scrollHandler: (() => void) | null = null

onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', scrollHandler)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3'
        : 'bg-white/60 backdrop-blur-sm border-b border-slate-200/40 py-4'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/15 group-hover:scale-105 transition-transform">
          <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <Cpu class="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="text-lg font-bold tracking-tight text-slate-900 font-sans">
              Nova <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Gateway</span>
            </span>
            <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">v2.5</span>
          </div>
          <span class="text-[11px] text-slate-500 font-normal">企业级 API 网关平台</span>
        </div>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
        <router-link
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          :class="[
            'px-4 py-1.5 text-xs font-semibold rounded-full transition-all',
            route.path === link.to
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          ]"
        >
          {{ link.name }}
        </router-link>
      </nav>

      <!-- Action Buttons -->
      <div class="hidden sm:flex items-center gap-3">
        <button
          @click="emit('open-console')"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Terminal class="w-3.5 h-3.5 text-blue-400" />
          <span>登录控制台</span>
          <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <!-- Mobile menu trigger -->
      <div class="flex items-center gap-2 lg:hidden">
        <button
          @click="emit('open-console')"
          class="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow-sm"
        >
          控制台
        </button>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200"
          aria-label="Toggle menu"
        >
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200 shadow-xl"
    >
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.to"
        @click="mobileMenuOpen = false"
        :class="[
          'block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
          route.path === link.to
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
        ]"
      >
        {{ link.name }}
      </router-link>
    </div>
  </header>
</template>
