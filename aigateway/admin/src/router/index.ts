import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

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
    meta: { requiresAuth: true, permission: 'admin:model:manage' },
  },
  {
    path: '/usage',
    name: 'usage',
    component: () => import('@/pages/usage/usage-page.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('@/pages/students/students-page.vue'),
    meta: { requiresAuth: true, permission: 'admin:user:list' },
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@/pages/roles/roles-page.vue'),
    meta: { requiresAuth: true, permission: 'admin:role:manage' },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('@/pages/pricing/pricing-page.vue'),
    meta: { requiresAuth: true, permission: 'admin:pricing:manage' },
  },
  {
    path: '/billing',
    name: 'billing',
    component: () => import('@/pages/billing/billing-page.vue'),
    meta: { requiresAuth: true, permission: 'admin:billing:view' },
  },
  {
    path: '/billing-report',
    name: 'billing-report',
    component: () => import('@/pages/billing-report/billing-report-page.vue'),
    meta: { requiresAuth: true, permission: 'admin:billing:report' },
  },
  {
    path: '/my-usage',
    name: 'my-usage',
    component: () => import('@/pages/my-usage/my-usage-page.vue'),
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
  } else if (to.meta.requiresAuth && token && to.meta.permission) {
    const auth = useAuthStore()
    if (auth.userProfile && !auth.hasPermission(to.meta.permission as string)) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
