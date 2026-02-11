<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  message: string
  type?: 'warning' | 'danger' | 'info'
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '確認',
  type: 'warning',
  confirmText: '確定',
  cancelText: '取消',
  loading: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

function handleConfirm(): void {
  emit('confirm')
}

function handleCancel(): void {
  emit('update:visible', false)
  emit('cancel')
}

function handleClose(): void {
  emit('update:visible', false)
}

const buttonType = {
  warning: 'warning',
  danger: 'danger',
  info: 'primary',
} as const
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="420px"
    :close-on-click-modal="false"
    @update:model-value="handleClose"
  >
    <div class="confirm-content">
      <el-icon :class="['confirm-icon', type]">
        <WarningFilled v-if="type === 'warning'" />
        <CircleCloseFilled v-else-if="type === 'danger'" />
        <InfoFilled v-else />
      </el-icon>
      <span class="confirm-message">{{ message }}</span>
    </div>
    <template #footer>
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button
        :type="buttonType[type]"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.confirm-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  .confirm-icon {
    font-size: 24px;
    flex-shrink: 0;

    &.warning {
      color: #e6a23c;
    }

    &.danger {
      color: #f56c6c;
    }

    &.info {
      color: #909399;
    }
  }

  .confirm-message {
    font-size: 14px;
    color: #606266;
    line-height: 1.6;
  }
}
</style>
