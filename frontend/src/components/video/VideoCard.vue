<script setup lang="ts">
import type { Video } from '@/types'
import { usePermission } from '@/composables/usePermission'

interface Props {
  video: Video
}

defineProps<Props>()

const emit = defineEmits<{
  click: [video: Video]
}>()

const { canWatchFullVideo, canOnlyPreview } = usePermission()

function getPermissionTag() {
  if (canWatchFullVideo.value) {
    return { text: '完整觀看', type: 'success' as const }
  }
  if (canOnlyPreview.value) {
    return { text: '試看 10 秒', type: 'warning' as const }
  }
  return { text: '無法觀看', type: 'danger' as const }
}

function handleClick(video: Video): void {
  emit('click', video)
}
</script>

<template>
  <el-card
    class="video-card"
    :body-style="{ padding: '0' }"
    shadow="hover"
    @click="handleClick(video)"
  >
    <div class="video-thumbnail">
      <el-image
        v-if="video.thumbnailUrl"
        :src="video.thumbnailUrl"
        fit="cover"
        class="thumbnail-image"
      />
      <div v-else class="no-thumbnail">
        <el-icon><VideoCamera /></el-icon>
      </div>
      <el-tag
        :type="getPermissionTag().type"
        class="permission-tag"
        size="small"
      >
        {{ getPermissionTag().text }}
      </el-tag>
      <div v-if="video.durationSeconds" class="duration-badge">
        {{ formatDuration(video.durationSeconds) }}
      </div>
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
</template>

<script lang="ts">
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
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
    height: 140px;

    .thumbnail-image {
      width: 100%;
      height: 100%;
    }

    .no-thumbnail {
      width: 100%;
      height: 100%;
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

    .duration-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
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
</style>
