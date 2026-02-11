import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types'
import { categoryApi } from '@/api/category.api'
import { ElMessage } from 'element-plus'

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)

  // Actions
  async function fetchCategories(): Promise<void> {
    loading.value = true
    try {
      categories.value = await categoryApi.getCategories()
    } catch (error) {
      console.error('取得分類列表失敗:', error)
    } finally {
      loading.value = false
    }
  }

  async function createCategory(dto: CreateCategoryDto): Promise<Category | null> {
    try {
      const category = await categoryApi.createCategory(dto)
      await fetchCategories() // 重新載入以獲取正確的階層結構
      ElMessage.success('新增分類成功')
      return category
    } catch (error) {
      console.error('新增分類失敗:', error)
      return null
    }
  }

  async function updateCategory(
    id: string,
    dto: UpdateCategoryDto
  ): Promise<Category | null> {
    try {
      const category = await categoryApi.updateCategory(id, dto)
      await fetchCategories() // 重新載入以獲取正確的階層結構
      ElMessage.success('更新分類成功')
      return category
    } catch (error) {
      console.error('更新分類失敗:', error)
      return null
    }
  }

  async function deleteCategory(id: string): Promise<boolean> {
    try {
      await categoryApi.deleteCategory(id)
      await fetchCategories() // 重新載入以獲取正確的階層結構
      ElMessage.success('刪除分類成功')
      return true
    } catch (error) {
      console.error('刪除分類失敗:', error)
      return false
    }
  }

  return {
    // State
    categories,
    loading,
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
