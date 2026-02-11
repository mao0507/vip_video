import api from './axios'
import type { Tag, CreateTagDto } from '@/types'

export const tagApi = {
  // 取得標籤列表
  async getTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags')
    return response.data
  },

  // 取得單一標籤
  async getTag(id: string): Promise<Tag> {
    const response = await api.get<Tag>(`/tags/${id}`)
    return response.data
  },

  // 新增標籤
  async createTag(dto: CreateTagDto): Promise<Tag> {
    const response = await api.post<Tag>('/tags', dto)
    return response.data
  },

  // 刪除標籤
  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`)
  },
}
