<script setup lang="ts">
import { VipLevelLabels } from '@/types/enums'

interface Props {
  requiredLevel: number
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '權限不足',
  description: '',
})

const levelLabel = VipLevelLabels[props.requiredLevel] || `VIP ${props.requiredLevel}`
const defaultDescription = `需要 ${levelLabel} 或以上等級才能存取此內容`
</script>

<template>
  <div class="permission-denied">
    <el-empty>
      <template #image>
        <el-icon class="lock-icon"><Lock /></el-icon>
      </template>
      <template #description>
        <h3 class="denied-title">{{ title }}</h3>
        <p class="denied-description">{{ description || defaultDescription }}</p>
        <p class="denied-hint">請聯繫客服升級您的會員等級</p>
      </template>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.permission-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;

  .lock-icon {
    font-size: 80px;
    color: #909399;
  }

  .denied-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 16px 0 8px;
  }

  .denied-description {
    font-size: 14px;
    color: #606266;
    margin: 0 0 8px;
  }

  .denied-hint {
    font-size: 13px;
    color: #909399;
    margin: 0;
  }
}
</style>
