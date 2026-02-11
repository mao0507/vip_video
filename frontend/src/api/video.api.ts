import api from './axios'
import type {
  Video,
  CreateVideoDto,
  UpdateVideoDto,
  VideoListParams,
  PaginatedResponse,
} from '@/types'

export const videoApi = {
  // 取得影片列表
  async getVideos(params?: VideoListParams): Promise<PaginatedResponse<Video>> {
    const response = await api.get<PaginatedResponse<Video>>('/videos', {
      params: {
        ...params,
        tagIds: params?.tagIds?.join(','),
        categoryIds: params?.categoryIds?.join(','),
      },
    })
    return response.data
  },

  // 取得單一影片
  async getVideo(id: string): Promise<Video> {
    const response = await api.get<Video>(`/videos/${id}`)
    return response.data
  },

  // 新增影片
  async createVideo(dto: CreateVideoDto): Promise<Video> {
    const response = await api.post<Video>('/videos', dto)
    return response.data
  },

  // 更新影片
  async updateVideo(id: string, dto: UpdateVideoDto): Promise<Video> {
    const response = await api.patch<Video>(`/videos/${id}`, dto)
    return response.data
  },

  // 刪除影片
  async deleteVideo(id: string): Promise<void> {
    await api.delete(`/videos/${id}`)
  },
}
