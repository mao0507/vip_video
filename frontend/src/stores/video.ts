import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Video, CreateVideoDto, UpdateVideoDto, VideoListParams } from '@/types'
import { videoApi } from '@/api/video.api'
import { ElMessage } from 'element-plus'

export const useVideoStore = defineStore('video', () => {
  // State
  const videos = ref<Video[]>([])
  const currentVideo = ref<Video | null>(null)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(12)
  const loading = ref(false)

  // Actions
  async function fetchVideos(params?: VideoListParams): Promise<void> {
    loading.value = true
    try {
      const response = await videoApi.getVideos(params)
      videos.value = response.items
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
    } catch (error) {
      console.error('取得影片列表失敗:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchVideo(id: string): Promise<Video | null> {
    loading.value = true
    try {
      const video = await videoApi.getVideo(id)
      currentVideo.value = video
      return video
    } catch (error) {
      console.error('取得影片失敗:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createVideo(dto: CreateVideoDto): Promise<Video | null> {
    try {
      const video = await videoApi.createVideo(dto)
      ElMessage.success('新增影片成功')
      return video
    } catch (error) {
      console.error('新增影片失敗:', error)
      return null
    }
  }

  async function updateVideo(id: string, dto: UpdateVideoDto): Promise<Video | null> {
    try {
      const video = await videoApi.updateVideo(id, dto)
      ElMessage.success('更新影片成功')
      return video
    } catch (error) {
      console.error('更新影片失敗:', error)
      return null
    }
  }

  async function deleteVideo(id: string): Promise<boolean> {
    try {
      await videoApi.deleteVideo(id)
      videos.value = videos.value.filter((v) => v.id !== id)
      ElMessage.success('刪除影片成功')
      return true
    } catch (error) {
      console.error('刪除影片失敗:', error)
      return false
    }
  }

  function clearCurrentVideo(): void {
    currentVideo.value = null
  }

  return {
    // State
    videos,
    currentVideo,
    total,
    page,
    limit,
    loading,
    // Actions
    fetchVideos,
    fetchVideo,
    createVideo,
    updateVideo,
    deleteVideo,
    clearCurrentVideo,
  }
})
