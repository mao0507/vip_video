<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
  delay?: number
  clearable?: boolean
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '請輸入搜尋關鍵字',
  delay: 500,
  clearable: true,
  width: '300px',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const inputValue = ref(props.modelValue)

// 監聽外部 modelValue 變化
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue
  }
)

// 防抖搜尋
const debouncedSearch = useDebounceFn((value: string) => {
  emit('search', value)
}, props.delay)

function handleInput(value: string): void {
  inputValue.value = value
  emit('update:modelValue', value)
  debouncedSearch(value)
}

function handleClear(): void {
  inputValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <el-input
    :model-value="inputValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :style="{ width }"
    @input="handleInput"
    @clear="handleClear"
  >
    <template #prefix>
      <el-icon><Search /></el-icon>
    </template>
  </el-input>
</template>
