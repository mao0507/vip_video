<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useImageStore } from '@/stores/image'
import { usePermission } from '@/composables/usePermission'
import type { Image } from '@/types'
import { ElMessage } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const imageStore = useImageStore()
const { canAccessImages } = usePermission()

// 搜尋
const searchKeyword = ref('')

// 載入圖片列表
async function loadImages(page = 1): Promise<void> {
  if (!canAccessImages.value) return

  await imageStore.fetchImages({
    page,
    limit: imageStore.limit,
    keyword: searchKeyword.value || undefined,
  })
}

// 搜尋（防抖）
const debouncedSearch = useDebounceFn(() => {
  loadImages(1)
}, 500)

function handleSearch(): void {
  debouncedSearch()
}

// 清除篩選
function handleClearFilter(): void {
  searchKeyword.value = ''
  loadImages(1)
}

// 分頁變更
function handlePageChange(page: number): void {
  loadImages(page)
}

// 點擊圖片
function handleImageClick(image: Image): void {
  if (!canAccessImages.value) {
    ElMessage.warning('需要 VIP 5 或以上等級才能查看圖片詳情')
    return
  }

  window.open(image.imageUrl, '_blank')
}

onMounted(async () => {
  if (canAccessImages.value) {
    await loadImages()
  }
})
</script>

<template>
  <div class="image-list-page">
    <!-- 權限不足提示 -->
    <template v-if="!canAccessImages">
      <div class="permission-denied">
        <el-empty description="權限不足">
          <template #image>
            <el-icon class="lock-icon"><Lock /></el-icon>
          </template>
          <p class="denied-text">需要 VIP 5 或以上等級才能存取圖片資訊</p>
          <p class="denied-hint">請聯繫客服升級您的會員等級</p>
        </el-empty>
      </div>
    </template>

    <template v-else>
      <!-- 頁面標題和搜尋 -->
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">圖片資訊</h2>
          <el-tag type="danger" class="vip-badge">VIP 5+</el-tag>
        </div>
        <div class="header-right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜尋圖片"
            clearable
            style="width: 300px"
            @input="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button @click="handleClearFilter">重置</el-button>
        </div>
      </div>

      <!-- 圖片網格 -->
      <div v-loading="imageStore.loading" class="image-grid">
        <el-card
          v-for="image in imageStore.images"
          :key="image.id"
          class="image-card"
          :body-style="{ padding: '0' }"
          shadow="hover"
          @click="handleImageClick(image)"
        >
          <div class="image-preview">
            <el-image
              :src="image.thumbnailUrl || image.imageUrl"
              fit="cover"
              style="width: 100%; height: 200px"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="vip-badge-overlay">
              VIP {{ image.requiredVipLevel }}
            </div>
          </div>
          <div class="image-info">
            <h4 class="image-title">{{ image.title }}</h4>
            <p class="image-description">
              {{ image.description || '暫無描述' }}
            </p>
          </div>
        </el-card>
      </div>

      <!-- 空狀態 -->
      <el-empty
        v-if="!imageStore.loading && imageStore.images.length === 0"
        description="暫無圖片"
      />

      <!-- 分頁 -->
      <div v-if="imageStore.total > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="imageStore.page"
          :page-size="imageStore.limit"
          :total="imageStore.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.image-list-page {
  .permission-denied {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;

    .lock-icon {
      font-size: 80px;
      color: #909399;
    }

    .denied-text {
      font-size: 16px;
      color: #606266;
      margin: 16px 0 8px;
    }

    .denied-hint {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .page-title {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
      }

      .vip-badge {
        font-weight: 600;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1000px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .image-card {
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .image-preview {
      position: relative;

      .image-error {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #909399;

        .el-icon {
          font-size: 48px;
        }
      }

      .vip-badge-overlay {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .image-info {
      padding: 12px;

      .image-title {
        font-size: 15px;
        font-weight: 500;
        margin: 0 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .image-description {
        font-size: 13px;
        color: #909399;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
        height: 39px;
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
