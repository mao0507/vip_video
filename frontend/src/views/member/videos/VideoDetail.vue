<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { usePermission } from '@/composables/usePermission'
import { useVideoPlayer } from '@/composables/useVideoPlayer'

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()
const { canWatchFullVideo, canOnlyPreview } = usePermission()
const {
  currentTime,
  isPreviewEnded,
  onPlay,
  reset,
} = useVideoPlayer()

const loading = ref(true)
const iframeRef = ref<HTMLIFrameElement | null>(null)

const video = computed(() => videoStore.currentVideo)

// 根據嵌入類型生成 iframe URL
const embedUrl = computed(() => {
  if (!video.value) return ''

  const { embedCode, embedType } = video.value

  switch (embedType) {
    case 'youtube':
      // 支援 YouTube ID 或完整 URL
      const youtubeId = extractYouTubeId(embedCode)
      return `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`
    case 'vimeo':
      const vimeoId = extractVimeoId(embedCode)
      return `https://player.vimeo.com/video/${vimeoId}`
    case 'google_drive':
      return `https://drive.google.com/file/d/${embedCode}/preview`
    default:
      return embedCode
  }
})

// 提取 YouTube 影片 ID
function extractYouTubeId(input: string): string {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = input.match(regex)
  return match?.[1] ?? input
}

// 提取 Vimeo 影片 ID
function extractVimeoId(input: string): string {
  const regex = /(?:vimeo\.com\/)(\d+)/
  const match = input.match(regex)
  return match?.[1] ?? input
}

// 載入影片
async function loadVideo(): Promise<void> {
  loading.value = true
  try {
    await videoStore.fetchVideo(route.params.id as string)
    if (!video.value) {
      router.push('/member/videos')
    }
  } finally {
    loading.value = false
  }
}

// 處理標籤點擊
function handleTagClick(tagId: string): void {
  router.push({
    path: '/member/videos',
    query: { tagIds: tagId },
  })
}

// 處理分類點擊
function handleCategoryClick(categoryId: string): void {
  router.push({
    path: '/member/videos',
    query: { categoryIds: categoryId },
  })
}

// 格式化日期
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 監聽預覽狀態
watch(isPreviewEnded, (ended) => {
  if (ended && iframeRef.value) {
    // 嘗試暫停 iframe 中的影片（YouTube API）
    try {
      iframeRef.value.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      )
    } catch {
      // 忽略跨域錯誤
    }
  }
})

onMounted(() => {
  loadVideo()
})

onUnmounted(() => {
  reset()
  videoStore.clearCurrentVideo()
})
</script>

<template>
  <div v-loading="loading" class="video-detail-page">
    <template v-if="video">
      <!-- 返回按鈕 -->
      <div class="back-nav">
        <el-button text @click="router.push('/member/videos')">
          <el-icon><ArrowLeft /></el-icon>
          返回影片列表
        </el-button>
      </div>

      <el-row :gutter="24">
        <!-- 影片播放區 -->
        <el-col :span="16">
          <div class="video-player-wrapper">
            <div class="video-player" :class="{ 'is-locked': isPreviewEnded }">
              <iframe
                ref="iframeRef"
                :src="embedUrl"
                frameborder="0"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                @load="canOnlyPreview && onPlay()"
              />

              <!-- 遮罩層（試看結束時顯示） -->
              <div v-if="isPreviewEnded" class="preview-overlay">
                <el-icon class="lock-icon"><Lock /></el-icon>
                <p class="overlay-text">試看結束</p>
              </div>
            </div>

            <!-- 試看倒計時提示 -->
            <div v-if="canOnlyPreview && !isPreviewEnded" class="preview-timer">
              <el-tag type="warning">
                試看剩餘：{{ Math.max(0, 10 - currentTime) }} 秒
              </el-tag>
            </div>

            <!-- 權限提示 -->
            <div class="permission-notice">
              <el-alert
                v-if="canOnlyPreview"
                title="您目前為 VIP 1-2 等級，僅能試看前 10 秒"
                type="warning"
                :closable="false"
                show-icon
              />
              <el-alert
                v-else-if="canWatchFullVideo"
                title="您可以觀看完整影片"
                type="success"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </el-col>

        <!-- 影片資訊區 -->
        <el-col :span="8">
          <el-card class="video-info-card">
            <h1 class="video-title">{{ video.title }}</h1>

            <div class="video-meta">
              <span class="meta-item">
                <el-icon><View /></el-icon>
                {{ video.viewCount }} 次觀看
              </span>
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(video.createdAt) }}
              </span>
            </div>

            <el-divider />

            <!-- 標籤 -->
            <div v-if="video.tags?.length" class="info-section">
              <h4 class="section-title">標籤</h4>
              <div class="tags-list">
                <el-tag
                  v-for="tag in video.tags"
                  :key="tag.id"
                  type="info"
                  class="tag-item"
                  @click="handleTagClick(tag.id)"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </div>

            <!-- 分類 -->
            <div v-if="video.categories?.length" class="info-section">
              <h4 class="section-title">分類</h4>
              <div class="categories-list">
                <el-tag
                  v-for="category in video.categories"
                  :key="category.id"
                  class="category-item"
                  @click="handleCategoryClick(category.id)"
                >
                  {{ category.name }}
                </el-tag>
              </div>
            </div>

            <el-divider />

            <!-- 描述 -->
            <div class="info-section">
              <h4 class="section-title">描述</h4>
              <p class="video-description">
                {{ video.description || '暫無描述' }}
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<style scoped lang="scss">
.video-detail-page {
  .back-nav {
    margin-bottom: 16px;
  }

  .video-player-wrapper {
    .video-player {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%; // 16:9 比例
      background: #000;
      border-radius: 8px;
      overflow: hidden;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      &.is-locked {
        iframe {
          pointer-events: none;
        }
      }

      .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        z-index: 10;

        .lock-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .overlay-text {
          font-size: 18px;
          margin: 0;
        }
      }
    }

    .preview-timer {
      margin-top: 12px;
      text-align: center;
    }

    .permission-notice {
      margin-top: 16px;
    }
  }

  .video-info-card {
    .video-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 16px;
      line-height: 1.4;
    }

    .video-meta {
      display: flex;
      gap: 16px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: #909399;
      }
    }

    .info-section {
      margin-bottom: 16px;

      .section-title {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 8px;
        color: #606266;
      }

      .tags-list,
      .categories-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .tag-item,
        .category-item {
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }
        }
      }

      .video-description {
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
        margin: 0;
        white-space: pre-wrap;
      }
    }
  }
}
</style>
