import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDto } from '@/types'
import { authApi } from '@/api/auth.api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(null)

  // 從 localStorage 恢復用戶資訊
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('user')
    }
  }

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin ?? false)
  const vipLevel = computed(() => user.value?.vipLevel ?? 0)

  // Actions
  async function login(dto: LoginDto): Promise<void> {
    const response = await authApi.login(dto)
    setTokens(response.accessToken, response.refreshToken)
    setUser(response.user as User)
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // 即使登出 API 失敗，也要清除本地狀態
    }
    clearAuth()
    router.push('/login')
  }

  async function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) {
      clearAuth()
      return null
    }

    try {
      const response = await authApi.refresh(refreshToken.value)
      accessToken.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)
      return response.accessToken
    } catch {
      clearAuth()
      router.push('/login')
      return null
    }
  }

  function setTokens(access: string, refresh: string): void {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  function setUser(userData: User): void {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function clearAuth(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return {
    // State
    accessToken,
    refreshToken,
    user,
    // Getters
    isAuthenticated,
    isAdmin,
    vipLevel,
    // Actions
    login,
    logout,
    refreshAccessToken,
    setTokens,
    setUser,
    clearAuth,
  }
})
