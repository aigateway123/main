import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/login-page.vue'),
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/dashboard-page.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/api-keys',
    name: 'api-keys',
    component: () => import('@/pages/api-keys/api-keys-page.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/providers',
    name: 'providers',
    component: () => import('@/pages/providers/providers-page.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/models',
    name: 'models',
    component: () => import('@/pages/models/models-page.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/usage',
    name: 'usage',
    component: () => import('@/pages/usage/usage-page.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_access_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
