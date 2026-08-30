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
      path: '/skills',
      name: 'skills',
      component: () => import('@/pages/SkillsPage.vue'),
    },
    {
      path: '/skills/:slug',
      name: 'skill-detail',
      component: () => import('@/pages/SkillDetailPage.vue'),
    },
    {
      path: '/skills/:slug/use',
      name: 'skill-use',
      component: () => import('@/pages/SkillUsePage.vue'),
    },
    {
      path: '/teams',
      name: 'teams',
      // 专家团列表已合并进 /skills，保留路由做旧链接重定向
      redirect: { path: '/skills', query: { tab: 'team' } },
    },
    {
      path: '/teams/:slug',
      name: 'team-detail',
      component: () => import('@/pages/TeamDetailPage.vue'),
    },
    {
      path: '/teams/:slug/use',
      name: 'team-use',
      component: () => import('@/pages/TeamUsePage.vue'),
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
