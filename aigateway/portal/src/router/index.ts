import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/models',
      name: 'models',
      component: () => import('@/pages/ModelsPage.vue'),
    },
    {
      path: '/solutions',
      name: 'solutions',
      component: () => import('@/pages/SolutionsPage.vue'),
    },
    {
      path: '/solutions/:slug',
      name: 'solution-detail',
      component: () => import('@/pages/SolutionDetailPage.vue'),
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/pages/DocsPage.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      redirect: '/',
    },
  ],
})

export default router
