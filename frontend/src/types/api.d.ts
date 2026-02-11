// API 回應格式
export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

// 分頁回應
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 登入請求
export interface LoginDto {
  username: string
  password: string
}

// 登入回應
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    phone: string | null
    vipLevel: number
    isAdmin: boolean
  }
}

// 刷新 Token 回應
export interface RefreshTokenResponse {
  accessToken: string
}

// 分頁查詢參數
export interface PaginationParams {
  page?: number
  limit?: number
}

// 搜尋參數
export interface SearchParams extends PaginationParams {
  keyword?: string
  tagIds?: string[]
  categoryIds?: string[]
}
