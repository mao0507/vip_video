import api from './axios'
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateVipLevelDto,
  PaginatedResponse,
  PaginationParams,
} from '@/types'

export interface UserListParams extends PaginationParams {
  keyword?: string
}

export const userApi = {
  // 取得使用者列表
  async getUsers(params?: UserListParams): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params,
    })
    return response.data
  },

  // 取得單一使用者
  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  // 新增使用者
  async createUser(dto: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/users', dto)
    return response.data
  },

  // 更新使用者
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, dto)
    return response.data
  },

  // 更新 VIP 等級
  async updateVipLevel(id: string, dto: UpdateVipLevelDto): Promise<User> {
    const response = await api.patch<User>(`/users/${id}/vip-level`, dto)
    return response.data
  },

  // 刪除使用者
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
