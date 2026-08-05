<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth-store'
import Header from './Header.vue'

const auth = useAuthStore()

interface NavItem {
  label: string
  path: string
  perm: string
  icon: string
}

interface NavGroup {
  groupName: string
  items: NavItem[]
}

const navGroups = computed<NavGroup[]>(() => [
  {
    groupName: '总览',
    items: [
      { label: '仪表盘', path: '/dashboard', perm: 'dashboard:view', icon: 'dashboard' },
    ],
  },
  {
    groupName: '管理',
    items: [
      { label: 'API Key', path: '/api-keys', perm: 'api_key:manage', icon: 'key' },
      ...(auth.isAdmin ? [
        { label: 'Provider 管理', path: '/providers', perm: 'admin:provider:manage', icon: 'server' },
        { label: '模型管理', path: '/models', perm: 'admin:model:manage', icon: 'cpu' },
      ] : []),
    ],
  },
  {
    groupName: '计费',
    items: [
      ...(auth.isAdmin ? [
        { label: '定价管理', path: '/pricing', perm: 'admin:pricing:manage', icon: 'dollar' },
        { label: '账单报表', path: '/billing-report', perm: 'admin:billing:report', icon: 'chart' },
        { label: '账单明细', path: '/billing', perm: 'admin:billing:view', icon: 'list' },
      ] : []),
      { label: '用量明细', path: '/my-usage', perm: 'billing:view_self', icon: 'dollar' },
      { label: '请求日志', path: '/usage', perm: 'billing:view_self', icon: 'log' },
    ],
  },
  ...(auth.isAdmin ? [
    {
      groupName: '权限管理',
      items: [
        { label: '账号管理', path: '/students', perm: 'admin:user:list', icon: 'users' },
        { label: '角色管理', path: '/roles', perm: 'admin:role:manage', icon: 'shield' },
      ],
    },
  ] : []),
])

function filterItems(items: NavItem[]): NavItem[] {
  return items.filter(item => auth.hasPermission(item.perm))
}

function getIconSvg(icon: string): string {
  const icons: Record<string, string> = {
    dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
    server: 'M22 12h-4l-3 9L9 3l-3 9H2',
    cpu: 'M9 3h6v2H9zm3 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 9h2v6H3zm16 0h2v6h-2zM9 21h6v2H9zM9 1h6v2H9z',
    dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    chart: 'M18 20V10M12 20V4M6 20v-6',
    log: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    users: 'M17 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1m8-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm9-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-1.2 0-2.27.39-3.16 1.04',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  }
  return icons[icon] ?? ''
}
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-page text-text-primary font-sans antialiased">
    <!-- Sidebar -->
    <aside class="w-[240px] shrink-0 bg-white border-r border-border flex flex-col h-full justify-between select-none">
      <!-- Brand Header -->
      <div>
        <div class="h-16 px-5 border-b border-border flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div class="font-bold text-text-primary text-base leading-snug tracking-tight">Nova AI Gateway</div>
            <div class="text-[11px] text-text-secondary font-medium tracking-wide uppercase">Management Portal</div>
          </div>
        </div>

        <!-- Navigation Groups -->
        <div class="py-4 px-2 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          <div v-for="(group, gIdx) in navGroups" :key="gIdx" class="space-y-1">
            <div class="px-3 text-[11px] font-semibold text-text-secondary tracking-wider uppercase mb-1.5">
              {{ group.groupName }}
            </div>
            <RouterLink
              v-for="item in filterItems(group.items)"
              :key="item.path"
              :to="item.path"
              v-slot="{ isActive, navigate }"
              custom
            >
              <button
                @click="navigate"
                :class="[
                  'w-full h-10 px-3 flex items-center gap-3 text-sm font-medium transition-all duration-150 rounded-md',
                  isActive
                    ? 'text-primary bg-blue-50 font-medium border-l-[3px] border-primary'
                    : 'text-text-primary hover:bg-gray-50',
                ]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :class="['w-4 h-4 shrink-0 transition-colors', isActive ? 'text-primary' : 'text-text-secondary']"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path :d="getIconSvg(item.icon)" />
                </svg>
                <span class="truncate">{{ item.label }}</span>
              </button>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- User Profile & Logout -->
      <div class="p-3 border-t border-border bg-white">
        <div class="flex items-center justify-between p-2 rounded-lg bg-[#f8f9fa] border border-border">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
              {{ (auth.currentUser?.nickname ?? auth.currentUser?.email ?? 'A').charAt(0).toUpperCase() }}
            </div>
            <div class="truncate text-left">
              <div class="text-xs font-semibold text-text-primary truncate">
                {{ auth.currentUser?.nickname ?? '系统管理员' }}
              </div>
              <div class="text-[11px] text-text-secondary truncate">
                {{ auth.currentUser?.email }}
              </div>
            </div>
          </div>
          <button
            title="退出登录"
            class="p-1.5 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-btn transition-colors shrink-0"
            @click="auth.logout()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <Header />
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
