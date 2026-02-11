<script setup lang="ts">
import type { Tag, Category } from '@/types'

interface Props {
  tags: Tag[]
  categories: Category[]
  selectedTagIds: string[]
  selectedCategoryIds: string[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:selectedTagIds': [value: string[]]
  'update:selectedCategoryIds': [value: string[]]
  clear: []
}>()

function handleTagChange(ids: (string | number | boolean)[]): void {
  emit('update:selectedTagIds', ids as string[])
}

function handleCategoryChange(ids: (string | number | boolean)[]): void {
  emit('update:selectedCategoryIds', ids as string[])
}

function handleClear(): void {
  emit('update:selectedTagIds', [])
  emit('update:selectedCategoryIds', [])
  emit('clear')
}
</script>

<template>
  <el-card class="video-filter">
    <template #header>
      <div class="filter-header">
        <span>篩選</span>
        <el-button type="primary" text size="small" @click="handleClear">
          清除
        </el-button>
      </div>
    </template>

    <div class="filter-section">
      <h4 class="filter-title">標籤</h4>
      <el-checkbox-group
        :model-value="selectedTagIds"
        @update:model-value="handleTagChange"
      >
        <el-checkbox
          v-for="tag in tags"
          :key="tag.id"
          :value="tag.id"
          class="filter-checkbox"
        >
          {{ tag.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-empty
        v-if="tags.length === 0"
        description="暫無標籤"
        :image-size="60"
      />
    </div>

    <el-divider />

    <div class="filter-section">
      <h4 class="filter-title">分類</h4>
      <el-checkbox-group
        :model-value="selectedCategoryIds"
        @update:model-value="handleCategoryChange"
      >
        <el-checkbox
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
          class="filter-checkbox"
        >
          {{ category.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-empty
        v-if="categories.length === 0"
        description="暫無分類"
        :image-size="60"
      />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.video-filter {
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
</style>
