import type { SiteInfo } from '@/types'

export const siteInfo: SiteInfo = {
  title: 'Nova AI Gateway',
  description: '企业级 AI 模型统一接入代理与路由网关，兼容原生 OpenAI SDK。提供智能降级、语义缓存与百万级高并发实时转发能力。',
  adminUrl: import.meta.env.VITE_ADMIN_URL || 'http://admin.starnov.cn',
}
