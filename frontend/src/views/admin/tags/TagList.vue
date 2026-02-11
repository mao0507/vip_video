<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useTagStore } from '@/stores/tag'
import type { Tag, CreateTagDto } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'

const tagStore = useTagStore()

// 對話框
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const formLoading = ref(false)

const form = reactive<CreateTagDto>({
  name: '',
})

const rules: FormRules = {
  name: [
    { required: true, message: '請輸入標籤名稱', trigger: 'blur' },
    { max: 50, message: '標籤名稱最多 50 個字符', trigger: 'blur' },
  ],
}

// 開啟新增對話框
function handleCreate(): void {
  form.name = ''
  dialogVisible.value = true
}

// 提交表單
async function handleSubmit(): Promise<void> {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    formLoading.value = true
    try {
      await tagStore.createTag({ name: form.name })
      dialogVisible.value = false
    } finally {
      formLoading.value = false
    }
  })
}

// 刪除標籤
async function handleDelete(tag: Tag): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `確定要刪除標籤「${tag.name}」嗎？此操作無法復原。`,
      '刪除確認',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await tagStore.deleteTag(tag.id)
  } catch {
    // 用戶取消
  }
}

onMounted(() => {
  tagStore.fetchTags()
})
</script>

<template>
  <div class="tag-list-page">
    <!-- 頂部工具列 -->
    <div class="page-header">
      <h2 class="page-title">標籤管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增標籤
      </el-button>
    </div>

    <!-- 標籤表格 -->
    <el-table
      v-loading="tagStore.loading"
      :data="tagStore.tags"
      stripe
      class="tag-table"
    >
      <el-table-column prop="name" label="名稱" min-width="150" />
      <el-table-column prop="slug" label="Slug" min-width="150" />
      <el-table-column prop="createdAt" label="建立時間" width="200">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString('zh-TW') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" text size="small" @click="handleDelete(row)">
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空狀態 -->
    <el-empty v-if="!tagStore.loading && tagStore.tags.length === 0" description="暫無標籤" />

    <!-- 新增對話框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增標籤"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名稱" prop="name">
          <el-input v-model="form.name" placeholder="請輸入標籤名稱" />
        </el-form-item>
        <p class="form-hint">Slug 將由系統自動生成</p>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleSubmit">
          確定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.tag-list-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  .tag-table {
    background: #fff;
    border-radius: 8px;
  }

  .form-hint {
    font-size: 12px;
    color: #909399;
    margin: 0;
    padding-left: 80px;
  }
}
</style>
