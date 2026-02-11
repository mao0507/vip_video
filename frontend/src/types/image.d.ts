// 圖片介面
export interface Image {
  id: string
  title: string
  description: string | null
  imageUrl: string
  thumbnailUrl: string | null
  requiredVipLevel: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 圖片權限資訊（前端計算用）
export interface ImagePermissions {
  canView: boolean
}

// 新增圖片 DTO
export interface CreateImageDto {
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  requiredVipLevel?: number
  isActive?: boolean
}

// 更新圖片 DTO
export interface UpdateImageDto {
  title?: string
  description?: string
  imageUrl?: string
  thumbnailUrl?: string
  requiredVipLevel?: number
  isActive?: boolean
}

// 圖片列表查詢參數
export interface ImageListParams {
  page?: number
  limit?: number
  keyword?: string
}
