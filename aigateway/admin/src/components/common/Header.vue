<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const PAGE_INFO: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: '仪表盘', subtitle: '网关全局请求量、Token 消耗、延迟及成本实时监控' },
  'api-keys': { title: 'API Key 管理', subtitle: '客户端密钥生成、作用域隔离与安全撤销控制' },
  providers: { title: 'Provider 管理', subtitle: '大模型供应商节点、优先级调度与负载权重配置' },
  models: { title: '模型管理', subtitle: '统一模型标识命名与多 Provider 实例路由绑定' },
  pricing: { title: '定价管理', subtitle: '阶梯定价、统一定价与高峰期分时段策略配置' },
  billing: { title: '账单明细', subtitle: '按用户/模型维度的 Token 消费明细与多条件筛选' },
  'billing-report': { title: '账单报表', subtitle: '经营总览、收入趋势、模型消费排行与 CSV 导出' },
  'my-usage': { title: '用量明细', subtitle: '个人消费总览、消费趋势与消费明细查询' },
  usage: { title: '请求日志', subtitle: '秒级实时网关转发日志、延迟响应与异常报错排查' },
  students: { title: '学生管理', subtitle: '高校/机构学生账号额度授权与模型细粒度访问控制' },
  roles: { title: '角色管理', subtitle: '系统角色定义与基于 RBAC 的底层权限列表映射' },
}

const currentInfo = computed(() => {
  const name = route.name as string
  return PAGE_INFO[name] ?? { title: 'Nova AI Gateway', subtitle: 'AI 网关统一管理后台' }
})
</script>

<template>
  <header class="h-16 px-6 bg-white border-b border-border flex items-center justify-between shrink-0 z-10">
    <!-- Title section -->
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-lg font-bold text-text-primary leading-tight">{{ currentInfo.title }}</h1>
        <p class="text-xs text-text-secondary font-normal">{{ currentInfo.subtitle }}</p>
      </div>
    </div>

    <!-- Right controls -->
    <div class="flex items-center gap-3">
      <!-- System Status -->
      <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Gateway: 正常运行</span>
      </div>

      <!-- Notification -->
      <button
        title="系统通知"
        class="p-1.5 text-text-secondary hover:text-text-primary hover:bg-[#f8f9fa] rounded-btn transition-colors relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </button>

      <!-- Help -->
      <button
        title="使用文档"
        class="p-1.5 text-text-secondary hover:text-text-primary hover:bg-[#f8f9fa] rounded-btn transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>
    </div>
  </header>
</template>
