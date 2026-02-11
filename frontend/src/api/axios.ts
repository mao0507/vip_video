import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

// 建立 Axios 實例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 是否正在刷新 Token
let isRefreshing = false
// 等待刷新 Token 的請求佇列
let refreshSubscribers: ((token: string) => void)[] = []

// 將請求加入等待佇列
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback)
}

// 執行等待佇列中的請求
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// 請求攔截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // 處理 401 錯誤（Token 過期）
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新 Token，將請求加入佇列
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const authStore = useAuthStore()
      const newToken = await authStore.refreshAccessToken()

      isRefreshing = false

      if (newToken) {
        onTokenRefreshed(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }

      return Promise.reject(error)
    }

    // 處理 403 錯誤（權限不足）
    if (error.response?.status === 403) {
      ElMessage.error('權限不足，無法執行此操作')
    }

    // 處理 404 錯誤（資源不存在）
    if (error.response?.status === 404) {
      ElMessage.error('請求的資源不存在')
    }

    // 處理 500 錯誤（伺服器錯誤）
    if (error.response?.status === 500) {
      ElMessage.error('伺服器發生錯誤，請稍後再試')
    }

    // 處理其他錯誤
    if (error.response?.status && error.response.status >= 400) {
      const data = error.response.data as { message?: string | string[] }
      const message = Array.isArray(data.message)
        ? data.message[0]
        : data.message || '發生錯誤'
      ElMessage.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
