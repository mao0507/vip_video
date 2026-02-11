<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTagStore } from '@/stores/tag'
import type { Tag } from '@/types'

interface Props {
  modelValue: string[]
  placeholder?: string
  allowCreate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '選擇標籤',
  allowCreate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const tagStore = useTagStore()
const newTagName = ref('')
const creating = ref(false)

const selectedIds = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

async function handleCreateTag(): Promise<void> {
  if (!newTagName.value.trim() || creating.value) return

  creating.value = true
  try {
    const tag = await tagStore.createTag({ name: newTagName.value.trim() })
    if (tag) {
      selectedIds.value = [...selectedIds.value, tag.id]
      newTagName.value = ''
    }
  } finally {
    creating.value = false
  }
}

function getTagById(id: string): Tag | undefined {
  return tagStore.tags.find((t) => t.id === id)
}

onMounted(() => {
  if (tagStore.tags.length === 0) {
    tagStore.fetchTags()
  }
})
</script>

<template>
  <div class="tag-selector">
    <el-select
      v-model="selectedIds"
      multiple
      filterable
      :placeholder="placeholder"
      style="width: 100%"
    >
      <el-option
        v-for="tag in tagStore.tags"
        :key="tag.id"
        :label="tag.name"
        :value="tag.id"
      />
    </el-select>

    <div v-if="allowCreate" class="create-tag">
      <el-input
        v-model="newTagName"
        placeholder="新增標籤"
        size="small"
        @keyup.enter="handleCreateTag"
      >
        <template #append>
          <el-button
            :loading="creating"
            @click="handleCreateTag"
          >
            <el-icon><Plus /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <div v-if="selectedIds.length > 0" class="selected-tags">
      <el-tag
        v-for="id in selectedIds"
        :key="id"
        size="small"
        closable
        @close="selectedIds = selectedIds.filter((i) => i !== id)"
      >
        {{ getTagById(id)?.name || id }}
      </el-tag>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-selector {
  .create-tag {
    margin-top: 8px;
  }

  .selected-tags {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
