import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Image, CreateImageDto, UpdateImageDto, ImageListParams } from '@/types'
import { imageApi } from '@/api/image.api'
import { ElMessage } from 'element-plus'

export const useImageStore = defineStore('image', () => {
  // State
  const images = ref<Image[]>([])
  const currentImage = ref<Image | null>(null)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(12)
  const loading = ref(false)

  // Actions
  async function fetchImages(params?: ImageListParams): Promise<void> {
    loading.value = true
    try {
      const response = await imageApi.getImages(params)
      images.value = response.items
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
    } catch (error) {
      console.error('取得圖片列表失敗:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchImage(id: string): Promise<Image | null> {
    loading.value = true
    try {
      const image = await imageApi.getImage(id)
      currentImage.value = image
      return image
    } catch (error) {
      console.error('取得圖片失敗:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createImage(dto: CreateImageDto): Promise<Image | null> {
    try {
      const image = await imageApi.createImage(dto)
      ElMessage.success('新增圖片成功')
      return image
    } catch (error) {
      console.error('新增圖片失敗:', error)
      return null
    }
  }

  async function updateImage(id: string, dto: UpdateImageDto): Promise<Image | null> {
    try {
      const image = await imageApi.updateImage(id, dto)
      ElMessage.success('更新圖片成功')
      return image
    } catch (error) {
      console.error('更新圖片失敗:', error)
      return null
    }
  }

  async function deleteImage(id: string): Promise<boolean> {
    try {
      await imageApi.deleteImage(id)
      images.value = images.value.filter((i) => i.id !== id)
      ElMessage.success('刪除圖片成功')
      return true
    } catch (error) {
      console.error('刪除圖片失敗:', error)
      return false
    }
  }

  function clearCurrentImage(): void {
    currentImage.value = null
  }

  return {
    // State
    images,
    currentImage,
    total,
    page,
    limit,
    loading,
    // Actions
    fetchImages,
    fetchImage,
    createImage,
    updateImage,
    deleteImage,
    clearCurrentImage,
  }
})
