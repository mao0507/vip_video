import api from './axios'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types'

export const categoryApi = {
  // 取得分類列表
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  // 取得單一分類
  async getCategory(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },

  // 取得子分類
  async getChildren(id: string): Promise<Category[]> {
    const response = await api.get<Category[]>(`/categories/${id}/children`)
    return response.data
  },

  // 新增分類
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>('/categories', dto)
    return response.data
  },

  // 更新分類
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, dto)
    return response.data
  },

  // 刪除分類
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
