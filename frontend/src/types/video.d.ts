import type { Tag } from './tag'
import type { Category } from './category'

// 影片介面
export interface Video {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number
  previewDuration: number
  requiredVipLevel: number
  viewCount: number
  isActive: boolean
  categoryId: string | null
  category?: Category | null
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

// 影片權限資訊（前端計算用）
export interface VideoPermissions {
  canWatch: boolean
  previewOnly: boolean
  previewDuration: number
}

// 新增影片 DTO
export interface CreateVideoDto {
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  previewDuration?: number
  requiredVipLevel?: number
  categoryId?: string
  tagIds?: string[]
  isActive?: boolean
}

// 更新影片 DTO
export interface UpdateVideoDto {
  title?: string
  description?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  previewDuration?: number
  requiredVipLevel?: number
  categoryId?: string
  tagIds?: string[]
  isActive?: boolean
}

// 影片列表查詢參數
export interface VideoListParams {
  page?: number
  limit?: number
  keyword?: string
  tagIds?: string[]
  categoryId?: string
}
