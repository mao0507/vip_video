<script setup lang="ts">
import type { Image } from '@/types'
import { usePermission } from '@/composables/usePermission'
import { ElMessage } from 'element-plus'

interface Props {
  image: Image
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [image: Image]
}>()

const { canAccessImages } = usePermission()

function handleClick(): void {
  if (!canAccessImages.value) {
    ElMessage.warning('需要 VIP 5 或以上等級才能查看圖片詳情')
    return
  }

  emit('click', props.image)
  window.open(props.image.imageUrl, '_blank')
}
</script>

<template>
  <el-card
    class="image-card"
    :body-style="{ padding: '0' }"
    shadow="hover"
    @click="handleClick"
  >
    <div class="image-preview">
      <el-image
        :src="image.thumbnailUrl || image.imageUrl"
        fit="cover"
        class="preview-image"
      >
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div class="vip-badge">
        VIP {{ image.requiredVipLevel }}
      </div>
      <div v-if="!canAccessImages" class="locked-overlay">
        <el-icon><Lock /></el-icon>
      </div>
    </div>
    <div class="image-info">
      <h4 class="image-title">{{ image.title }}</h4>
      <p class="image-description">
        {{ image.description || '暫無描述' }}
      </p>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
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
    height: 200px;

    .preview-image {
      width: 100%;
      height: 100%;
    }

    .image-error {
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

    .locked-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      .el-icon {
        font-size: 32px;
      }
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
</style>
