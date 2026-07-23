<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store'

const auth = useAuthStore()

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'API Keys', path: '/api-keys' },
  { label: 'Providers', path: '/providers' },
  { label: 'Models', path: '/models' },
  { label: 'Usage', path: '/usage' },
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">Nova AI Gateway</div>
      <nav class="nav-list">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <span class="user-name">{{ auth.currentUser?.nickname ?? auth.currentUser?.email }}</span>
        </div>
        <button class="btn-logout" @click="auth.logout()">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: #0f172a;
  color: #e2e8f0;
}

.sidebar {
  padding: 24px;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  background: #111827;
  display: flex;
  flex-direction: column;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.nav-link {
  color: #cbd5e1;
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.8);
}

.nav-link.router-link-active {
  color: #ffffff;
  background: #2563eb;
}

.sidebar-footer {
  border-top: 1px solid #334155;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-info {
  font-size: 13px;
  color: #94a3b8;
}

.user-name {
  color: #cbd5e1;
  font-weight: 500;
}

.btn-logout {
  padding: 8px 12px;
  border: 1px solid #475569;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font-size: 13px;
}

.btn-logout:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.content {
  padding: 32px;
}
</style>
