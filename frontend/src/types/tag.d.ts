// 標籤介面
export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
}

// 新增標籤 DTO
export interface CreateTagDto {
  name: string
}
