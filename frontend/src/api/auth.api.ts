import api from './axios'
import type { LoginDto, LoginResponse, RefreshTokenResponse } from '@/types'

export const authApi = {
  // 登入
  async login(dto: LoginDto): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', dto)
    return response.data
  },

  // 登出
  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  // 刷新 Token
  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  },
}
