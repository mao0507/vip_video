// 使用者介面
export interface User {
  id: string
  username: string
  phone: string | null
  vipLevel: number
  isAdmin: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

// 新增使用者 DTO
export interface CreateUserDto {
  username: string
  password: string
  phone?: string
  vipLevel?: number
  isAdmin?: boolean
}

// 更新使用者 DTO
export interface UpdateUserDto {
  username?: string
  password?: string
  phone?: string
  isActive?: boolean
}

// 更新 VIP 等級 DTO
export interface UpdateVipLevelDto {
  vipLevel: number
}
