export interface DocSection {
  id: string
  title: string
  icon: string
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
