import { ref } from 'vue'

// 模块级共享状态：商务咨询浮层（ContactFloat）的开关全局共享，
// 任意组件（如「联系企业顾问」按钮）都能直接打开该浮层。
const isOpen = ref(false)

export function useContactFloat() {
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  return { isOpen, open, close, toggle }
}
