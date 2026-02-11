<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageStore } from '@/stores/image'
import type { Image } from '@/types'
import { ElMessageBox } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const router = useRouter()
const imageStore = useImageStore()

// 搜尋
const searchKeyword = ref('')

// 載入圖片列表
async function loadImages(page = 1): Promise<void> {
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

// 重置篩選
function handleResetFilter(): void {
  searchKeyword.value = ''
  loadImages(1)
}

// 分頁變更
function handlePageChange(page: number): void {
  loadImages(page)
}

// 新增圖片
function handleCreate(): void {
  router.push('/admin/images/create')
}

// 編輯圖片
function handleEdit(image: Image): void {
  router.push(`/admin/images/${image.id}/edit`)
}

// 刪除圖片
async function handleDelete(image: Image): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `確定要刪除圖片「${image.title}」嗎？此操作無法復原。`,
      '刪除確認',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await imageStore.deleteImage(image.id)
    loadImages(imageStore.page)
  } catch {
    // 用戶取消
  }
}

// 取得 VIP 等級標籤類型
function getVipTagType(level: number): 'success' | 'warning' | 'danger' | 'info' {
  if (level >= 5) return 'danger'
  if (level >= 3) return 'warning'
  return 'success'
}

onMounted(async () => {
  await loadImages()
})
</script>

<template>
  <div class="image-list-page">
    <!-- 頂部工具列 -->
    <div class="page-header">
      <h2 class="page-title">圖片資訊管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增圖片
      </el-button>
    </div>

    <!-- 篩選區域 -->
    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜尋標題或描述"
        clearable
        style="width: 300px"
        @input="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button @click="handleResetFilter">重置</el-button>
    </div>

    <!-- 圖片網格 -->
    <div v-loading="imageStore.loading" class="image-grid">
      <el-card
        v-for="image in imageStore.images"
        :key="image.id"
        class="image-card"
        :body-style="{ padding: '0' }"
      >
        <div class="image-preview">
          <el-image
            :src="image.thumbnailUrl || image.imageUrl"
            fit="cover"
            style="width: 100%; height: 160px"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <span>載入失敗</span>
              </div>
            </template>
          </el-image>
          <div class="vip-badge">
            VIP {{ image.requiredVipLevel }}
          </div>
          <el-tag
            v-if="!image.isActive"
            class="status-tag"
            type="info"
            size="small"
          >
            已停用
          </el-tag>
        </div>
        <div class="image-info">
          <h4 class="image-title">{{ image.title }}</h4>
          <div class="image-meta">
            <el-tag :type="getVipTagType(image.requiredVipLevel)" size="small">
              需要 VIP {{ image.requiredVipLevel }}
            </el-tag>
          </div>
          <div class="image-actions">
            <el-button type="primary" text size="small" @click="handleEdit(image)">
              編輯
            </el-button>
            <el-button type="danger" text size="small" @click="handleDelete(image)">
              刪除
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空狀態 -->
    <el-empty v-if="!imageStore.loading && imageStore.images.length === 0" description="暫無圖片資料" />

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
  </div>
</template>

<style scoped lang="scss">
.image-list-page {
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

  .image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .image-card {
    border-radius: 8px;
    overflow: hidden;

    .image-preview {
      position: relative;

      .image-error {
        width: 100%;
        height: 160px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        color: #909399;

        .el-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
      }

      .vip-badge {
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

      .status-tag {
        position: absolute;
        top: 8px;
        left: 8px;
      }
    }

    .image-info {
      padding: 12px;

      .image-title {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .image-meta {
        margin-bottom: 8px;
      }

      .image-actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
