<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types'

interface Props {
  modelValue: string[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '選擇分類',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const categoryStore = useCategoryStore()

const selectedIds = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function getCategoryById(id: string): Category | undefined {
  return categoryStore.categories.find((c) => c.id === id)
}

// 扁平化分類樹，用於顯示階層
function flattenCategories(
  categories: Category[],
  level = 0
): Array<{ category: Category; level: number }> {
  const result: Array<{ category: Category; level: number }> = []

  for (const category of categories) {
    result.push({ category, level })
    if (category.children && category.children.length > 0) {
      result.push(...flattenCategories(category.children, level + 1))
    }
  }

  return result
}

const flatCategories = computed(() => flattenCategories(categoryStore.categories))

onMounted(() => {
  if (categoryStore.categories.length === 0) {
    categoryStore.fetchCategories()
  }
})
</script>

<template>
  <div class="category-selector">
    <el-select
      v-model="selectedIds"
      multiple
      filterable
      :placeholder="placeholder"
      style="width: 100%"
    >
      <el-option
        v-for="{ category, level } in flatCategories"
        :key="category.id"
        :label="category.name"
        :value="category.id"
      >
        <span :style="{ paddingLeft: `${level * 16}px` }">
          {{ category.name }}
        </span>
      </el-option>
    </el-select>

    <div v-if="selectedIds.length > 0" class="selected-categories">
      <el-tag
        v-for="id in selectedIds"
        :key="id"
        size="small"
        type="info"
        closable
        @close="selectedIds = selectedIds.filter((i) => i !== id)"
      >
        {{ getCategoryById(id)?.name || id }}
      </el-tag>
    </div>
  </div>
</template>

<style scoped lang="scss">
.category-selector {
  .selected-categories {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
