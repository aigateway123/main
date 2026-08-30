export interface DocSection {
  id: string
  title: string
  icon: string
  /** 文档分组：business 业务产品 / developer 开发者文档（Nova AI Gateway 网关） */
  group: 'business' | 'developer'
  children: DocItem[]
}

export interface DocItem {
  id: string
  title: string
  /** HTML content string, empty for skeleton */
  content: string
}

export interface DocContent {
  sections: DocSection[]
  defaultItemId: string
}
