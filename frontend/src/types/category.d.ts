// 分類介面
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  parent?: Category | null
  children?: Category[]
  createdAt: string
}

// 新增分類 DTO
export interface CreateCategoryDto {
  name: string
  description?: string
  parentId?: string
}

// 更新分類 DTO
export interface UpdateCategoryDto {
  name?: string
  description?: string
  parentId?: string
}
