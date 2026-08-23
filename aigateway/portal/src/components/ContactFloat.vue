<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { MessageCircle, X, MessageSquare, Mail, Phone } from 'lucide-vue-next'
import { useContactFloat } from '@/composables/useContactFloat'

const { isOpen, toggle, close } = useContactFloat()

const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('#contact-float')) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<template>
  <div id="contact-float" class="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
    <!-- Expanded Contact Options -->
    <Transition name="float">
      <div v-if="isOpen" class="flex flex-col gap-2">
        <!-- WeChat -->
        <div class="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-lg border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <MessageSquare class="w-4.5 h-4.5" stroke-width="1.5" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">微信联系</p>
            <p class="text-[11px] text-slate-500">xncx2026</p>
          </div>
        </div>

        <!-- Email -->
        <a
          href="mailto:xncn@starnovation.cn"
          class="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-lg border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Mail class="w-4.5 h-4.5" stroke-width="1.5" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">邮件联系</p>
            <p class="text-[11px] text-slate-500">xncn@starnovation.cn</p>
          </div>
        </a>

        <!-- Phone -->
        <a
          href="tel:19220422189"
          class="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-lg border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div class="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Phone class="w-4.5 h-4.5" stroke-width="1.5" />
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900">电话咨询</p>
            <p class="text-[11px] text-slate-500">19220422189</p>
          </div>
        </a>
      </div>
    </Transition>

    <!-- Floating Trigger Button -->
    <button
      @click.stop="toggle"
      class="relative flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
    >
      <Transition name="icon-swap" mode="out-in">
        <X v-if="isOpen" key="close" class="w-5 h-5 transition-transform duration-300" />
        <MessageCircle v-else key="chat" class="w-5 h-5 transition-transform duration-300" />
      </Transition>
      <span class="text-xs sm:text-sm font-semibold">{{ isOpen ? '关闭' : '商务咨询' }}</span>
    </button>
  </div>
</template>

<style scoped>
.float-enter-active {
  transition: all 0.25s ease-out;
}
.float-leave-active {
  transition: all 0.2s ease-in;
}
.float-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.float-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.2s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
