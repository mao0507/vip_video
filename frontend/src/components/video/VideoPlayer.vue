<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { Video } from '@/types'
import { usePermission } from '@/composables/usePermission'
import { useVideoPlayer } from '@/composables/useVideoPlayer'

interface Props {
  video: Video
}

const props = defineProps<Props>()

const { canWatchFullVideo, canOnlyPreview } = usePermission()
const {
  currentTime,
  isPreviewEnded,
  onPlay,
  reset,
} = useVideoPlayer()

const iframeRef = ref<HTMLIFrameElement | null>(null)

// 根據嵌入類型生成 iframe URL
const embedUrl = computed(() => {
  const { embedCode, embedType } = props.video

  switch (embedType) {
    case 'youtube': {
      const youtubeId = extractYouTubeId(embedCode)
      return `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`
    }
    case 'vimeo': {
      const vimeoId = extractVimeoId(embedCode)
      return `https://player.vimeo.com/video/${vimeoId}`
    }
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

// 處理 iframe 載入
function handleIframeLoad(): void {
  if (canOnlyPreview.value) {
    onPlay()
  }
}

// 監聽預覽結束狀態
watch(isPreviewEnded, (ended) => {
  if (ended && iframeRef.value) {
    // 嘗試暫停 iframe 中的影片
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

onUnmounted(() => {
  reset()
})
</script>

<template>
  <div class="video-player-wrapper">
    <div class="video-player" :class="{ 'is-locked': isPreviewEnded }">
      <iframe
        ref="iframeRef"
        :src="embedUrl"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        @load="handleIframeLoad"
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
</template>

<style scoped lang="scss">
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
</style>
