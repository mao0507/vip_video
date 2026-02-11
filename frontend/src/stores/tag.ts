import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tag, CreateTagDto } from '@/types'
import { tagApi } from '@/api/tag.api'
import { ElMessage } from 'element-plus'

export const useTagStore = defineStore('tag', () => {
  // State
  const tags = ref<Tag[]>([])
  const loading = ref(false)

  // Actions
  async function fetchTags(): Promise<void> {
    loading.value = true
    try {
      tags.value = await tagApi.getTags()
    } catch (error) {
      console.error('取得標籤列表失敗:', error)
    } finally {
      loading.value = false
    }
  }

  async function createTag(dto: CreateTagDto): Promise<Tag | null> {
    try {
      const tag = await tagApi.createTag(dto)
      tags.value.push(tag)
      ElMessage.success('新增標籤成功')
      return tag
    } catch (error) {
      console.error('新增標籤失敗:', error)
      return null
    }
  }

  async function deleteTag(id: string): Promise<boolean> {
    try {
      await tagApi.deleteTag(id)
      tags.value = tags.value.filter((t) => t.id !== id)
      ElMessage.success('刪除標籤成功')
      return true
    } catch (error) {
      console.error('刪除標籤失敗:', error)
      return false
    }
  }

  return {
    // State
    tags,
    loading,
    // Actions
    fetchTags,
    createTag,
    deleteTag,
  }
})
