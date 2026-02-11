<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { useTagStore } from '@/stores/tag'
import { useCategoryStore } from '@/stores/category'
import type { Video } from '@/types'
import { ElMessageBox } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const router = useRouter()
const videoStore = useVideoStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()

// 搜尋和篩選
const searchKeyword = ref('')
const selectedTagIds = ref<string[]>([])
const selectedCategoryIds = ref<string[]>([])

// 載入影片列表
async function loadVideos(page = 1): Promise<void> {
  await videoStore.fetchVideos({
    page,
    limit: videoStore.limit,
    keyword: searchKeyword.value || undefined,
    tagIds: selectedTagIds.value.length > 0 ? selectedTagIds.value : undefined,
    categoryIds: selectedCategoryIds.value.length > 0 ? selectedCategoryIds.value : undefined,
  })
}

// 搜尋（防抖）
const debouncedSearch = useDebounceFn(() => {
  loadVideos(1)
}, 500)

function handleSearch(): void {
  debouncedSearch()
}

// 篩選變更
function handleFilterChange(): void {
  loadVideos(1)
}

// 重置篩選
function handleResetFilter(): void {
  searchKeyword.value = ''
  selectedTagIds.value = []
  selectedCategoryIds.value = []
  loadVideos(1)
}

// 分頁變更
function handlePageChange(page: number): void {
  loadVideos(page)
}

// 新增影片
function handleCreate(): void {
  router.push('/admin/videos/create')
}

// 編輯影片
function handleEdit(video: Video): void {
  router.push(`/admin/videos/${video.id}/edit`)
}

// 刪除影片
async function handleDelete(video: Video): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `確定要刪除影片「${video.title}」嗎？此操作無法復原。`,
      '刪除確認',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await videoStore.deleteVideo(video.id)
    loadVideos(videoStore.page)
  } catch {
    // 用戶取消
  }
}

// 取得嵌入類型標籤
function getEmbedTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    google_drive: 'Google Drive',
  }
  return labels[type] || type
}

onMounted(async () => {
  await Promise.all([
    loadVideos(),
    tagStore.fetchTags(),
    categoryStore.fetchCategories(),
  ])
})
</script>

<template>
  <div class="video-list-page">
    <!-- 頂部工具列 -->
    <div class="page-header">
      <h2 class="page-title">影片管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增影片
      </el-button>
    </div>

    <!-- 篩選區域 -->
    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜尋標題或描述"
        clearable
        style="width: 250px"
        @input="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="selectedTagIds"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="選擇標籤"
        style="width: 200px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="tag in tagStore.tags"
          :key="tag.id"
          :label="tag.name"
          :value="tag.id"
        />
      </el-select>

      <el-select
        v-model="selectedCategoryIds"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="選擇分類"
        style="width: 200px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="category in categoryStore.categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>

      <el-button @click="handleResetFilter">重置</el-button>
    </div>

    <!-- 影片表格 -->
    <el-table
      v-loading="videoStore.loading"
      :data="videoStore.videos"
      stripe
      class="video-table"
    >
      <el-table-column label="縮圖" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.thumbnailUrl"
            :src="row.thumbnailUrl"
            style="width: 80px; height: 45px"
            fit="cover"
          />
          <span v-else class="no-thumbnail">無縮圖</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="標題" min-width="200" show-overflow-tooltip />
      <el-table-column label="嵌入類型" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ getEmbedTypeLabel(row.embedType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="觀看次數" width="100" />
      <el-table-column label="標籤" min-width="150">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags?.slice(0, 3)"
            :key="tag.id"
            size="small"
            type="info"
            class="tag-item"
          >
            {{ tag.name }}
          </el-tag>
          <span v-if="row.tags?.length > 3" class="more-tags">
            +{{ row.tags.length - 3 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="建立時間" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString('zh-TW') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" text size="small" @click="handleEdit(row)">
            編輯
          </el-button>
          <el-button type="danger" text size="small" @click="handleDelete(row)">
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="videoStore.page"
        :page-size="videoStore.limit"
        :total="videoStore.total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-list-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  .filter-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .video-table {
    background: #fff;
    border-radius: 8px;

    .no-thumbnail {
      color: #909399;
      font-size: 12px;
    }

    .tag-item {
      margin-right: 4px;
      margin-bottom: 4px;
    }

    .more-tags {
      color: #909399;
      font-size: 12px;
    }
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
