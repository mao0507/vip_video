<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { useTagStore } from '@/stores/tag'
import { useCategoryStore } from '@/stores/category'
import { usePermission } from '@/composables/usePermission'
import type { Video } from '@/types'
import { useDebounceFn } from '@vueuse/core'

const router = useRouter()
const videoStore = useVideoStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()
const { canWatchFullVideo, canOnlyPreview } = usePermission()

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

// 清除篩選
function handleClearFilter(): void {
  searchKeyword.value = ''
  selectedTagIds.value = []
  selectedCategoryIds.value = []
  loadVideos(1)
}

// 分頁變更
function handlePageChange(page: number): void {
  loadVideos(page)
}

// 點擊影片卡片
function handleVideoClick(video: Video): void {
  router.push(`/member/videos/${video.id}`)
}

// 取得權限標籤
function getPermissionTag(_video: Video) {
  if (canWatchFullVideo.value) {
    return { text: '完整觀看', type: 'success' as const }
  }
  if (canOnlyPreview.value) {
    return { text: '試看 10 秒', type: 'warning' as const }
  }
  return { text: '無法觀看', type: 'danger' as const }
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
    <!-- 頁面標題和搜尋 -->
    <div class="page-header">
      <h2 class="page-title">影片專區</h2>
      <el-input
        v-model="searchKeyword"
        placeholder="搜尋影片"
        clearable
        style="width: 300px"
        @input="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-row :gutter="24">
      <!-- 篩選側邊欄 -->
      <el-col :span="5">
        <el-card class="filter-card">
          <template #header>
            <div class="filter-header">
              <span>篩選</span>
              <el-button type="primary" text size="small" @click="handleClearFilter">
                清除
              </el-button>
            </div>
          </template>

          <div class="filter-section">
            <h4 class="filter-title">標籤</h4>
            <el-checkbox-group v-model="selectedTagIds" @change="handleFilterChange">
              <el-checkbox
                v-for="tag in tagStore.tags"
                :key="tag.id"
                :value="tag.id"
                class="filter-checkbox"
              >
                {{ tag.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <el-divider />

          <div class="filter-section">
            <h4 class="filter-title">分類</h4>
            <el-checkbox-group v-model="selectedCategoryIds" @change="handleFilterChange">
              <el-checkbox
                v-for="category in categoryStore.categories"
                :key="category.id"
                :value="category.id"
                class="filter-checkbox"
              >
                {{ category.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-col>

      <!-- 影片網格 -->
      <el-col :span="19">
        <div v-loading="videoStore.loading" class="video-grid">
          <el-card
            v-for="video in videoStore.videos"
            :key="video.id"
            class="video-card"
            :body-style="{ padding: '0' }"
            shadow="hover"
            @click="handleVideoClick(video)"
          >
            <div class="video-thumbnail">
              <el-image
                v-if="video.thumbnailUrl"
                :src="video.thumbnailUrl"
                fit="cover"
                style="width: 100%; height: 140px"
              />
              <div v-else class="no-thumbnail">
                <el-icon><VideoCamera /></el-icon>
              </div>
              <el-tag
                :type="getPermissionTag(video).type"
                class="permission-tag"
                size="small"
              >
                {{ getPermissionTag(video).text }}
              </el-tag>
            </div>
            <div class="video-info">
              <h4 class="video-title">{{ video.title }}</h4>
              <p class="video-description">
                {{ video.description || '暫無描述' }}
              </p>
              <div class="video-meta">
                <span class="view-count">
                  <el-icon><View /></el-icon>
                  {{ video.viewCount }}
                </span>
                <div class="video-tags">
                  <el-tag
                    v-for="tag in video.tags?.slice(0, 2)"
                    :key="tag.id"
                    size="small"
                    type="info"
                  >
                    {{ tag.name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 空狀態 -->
        <el-empty
          v-if="!videoStore.loading && videoStore.videos.length === 0"
          description="暫無影片"
        />

        <!-- 分頁 -->
        <div v-if="videoStore.total > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="videoStore.page"
            :page-size="videoStore.limit"
            :total="videoStore.total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-col>
    </el-row>
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
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
  }

  .filter-card {
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filter-section {
      .filter-title {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 12px;
        color: #303133;
      }

      .filter-checkbox {
        display: block;
        margin: 0 0 8px;
      }
    }
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .video-card {
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .video-thumbnail {
      position: relative;

      .no-thumbnail {
        width: 100%;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #909399;

        .el-icon {
          font-size: 48px;
        }
      }

      .permission-tag {
        position: absolute;
        top: 8px;
        right: 8px;
      }
    }

    .video-info {
      padding: 12px;

      .video-title {
        font-size: 15px;
        font-weight: 500;
        margin: 0 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .video-description {
        font-size: 13px;
        color: #909399;
        margin: 0 0 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
        height: 39px;
      }

      .video-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .view-count {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #909399;
        }

        .video-tags {
          display: flex;
          gap: 4px;
        }
      }
    }
  }

  .pagination-wrapper {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
}
</style>
