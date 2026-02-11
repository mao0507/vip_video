import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, CreateUserDto, UpdateUserDto, UpdateVipLevelDto } from '@/types'
import { userApi, type UserListParams } from '@/api/user.api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const loading = ref(false)

  // Actions
  async function fetchUsers(params?: UserListParams): Promise<void> {
    loading.value = true
    try {
      const response = await userApi.getUsers(params)
      users.value = response.items
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
    } catch (error) {
      console.error('取得使用者列表失敗:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(id: string): Promise<User | null> {
    loading.value = true
    try {
      const user = await userApi.getUser(id)
      currentUser.value = user
      return user
    } catch (error) {
      console.error('取得使用者失敗:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createUser(dto: CreateUserDto): Promise<User | null> {
    try {
      const user = await userApi.createUser(dto)
      ElMessage.success('新增使用者成功')
      return user
    } catch (error) {
      console.error('新增使用者失敗:', error)
      return null
    }
  }

  async function updateUser(id: string, dto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await userApi.updateUser(id, dto)
      ElMessage.success('更新使用者成功')
      return user
    } catch (error) {
      console.error('更新使用者失敗:', error)
      return null
    }
  }

  async function updateVipLevel(id: string, dto: UpdateVipLevelDto): Promise<User | null> {
    try {
      const user = await userApi.updateVipLevel(id, dto)
      // 更新本地列表中的用戶
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = user
      }
      ElMessage.success('更新 VIP 等級成功')
      return user
    } catch (error) {
      console.error('更新 VIP 等級失敗:', error)
      return null
    }
  }

  async function deleteUser(id: string): Promise<boolean> {
    try {
      await userApi.deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
      ElMessage.success('刪除使用者成功')
      return true
    } catch (error) {
      console.error('刪除使用者失敗:', error)
      return false
    }
  }

  return {
    // State
    users,
    currentUser,
    total,
    page,
    limit,
    loading,
    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    updateVipLevel,
    deleteUser,
  }
})
