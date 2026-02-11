import api from './axios'
import type {
  Image,
  CreateImageDto,
  UpdateImageDto,
  ImageListParams,
  PaginatedResponse,
} from '@/types'

export const imageApi = {
  // 取得圖片列表
  async getImages(params?: ImageListParams): Promise<PaginatedResponse<Image>> {
    const response = await api.get<PaginatedResponse<Image>>('/images', {
      params,
    })
    return response.data
  },

  // 取得單一圖片
  async getImage(id: string): Promise<Image> {
    const response = await api.get<Image>(`/images/${id}`)
    return response.data
  },

  // 新增圖片
  async createImage(dto: CreateImageDto): Promise<Image> {
    const response = await api.post<Image>('/images', dto)
    return response.data
  },

  // 更新圖片
  async updateImage(id: string, dto: UpdateImageDto): Promise<Image> {
    const response = await api.patch<Image>(`/images/${id}`, dto)
    return response.data
  },

  // 刪除圖片
  async deleteImage(id: string): Promise<void> {
    await api.delete(`/images/${id}`)
  },
}
