<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import type { Category, CreateCategoryDto } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'

const categoryStore = useCategoryStore()

// 對話框
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const formLoading = ref(false)

const form = reactive<CreateCategoryDto>({
  name: '',
  description: '',
  parentId: undefined,
})

const rules: FormRules = {
  name: [
    { required: true, message: '請輸入分類名稱', trigger: 'blur' },
    { max: 50, message: '分類名稱最多 50 個字符', trigger: 'blur' },
  ],
}

// 開啟新增對話框
function handleCreate(): void {
  form.name = ''
  form.description = ''
  form.parentId = undefined
  dialogVisible.value = true
}

// 提交表單
async function handleSubmit(): Promise<void> {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    formLoading.value = true
    try {
      await categoryStore.createCategory({
        name: form.name,
        description: form.description || undefined,
        parentId: form.parentId || undefined,
      })
      dialogVisible.value = false
    } finally {
      formLoading.value = false
    }
  })
}

// 刪除分類
async function handleDelete(category: Category): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `確定要刪除分類「${category.name}」嗎？此操作無法復原。`,
      '刪除確認',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await categoryStore.deleteCategory(category.id)
  } catch {
    // 用戶取消
  }
}

onMounted(() => {
  categoryStore.fetchCategories()
})
</script>

<template>
  <div class="category-list-page">
    <!-- 頂部工具列 -->
    <div class="page-header">
      <h2 class="page-title">分類管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增分類
      </el-button>
    </div>

    <!-- 分類表格 -->
    <el-table
      v-loading="categoryStore.loading"
      :data="categoryStore.categories"
      stripe
      row-key="id"
      default-expand-all
      class="category-table"
    >
      <el-table-column prop="name" label="名稱" min-width="200" />
      <el-table-column prop="slug" label="Slug" min-width="150" />
      <el-table-column prop="description" label="描述" min-width="200">
        <template #default="{ row }">
          {{ row.description || '-' }}
        </template>
      </el-table-column>
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
    <el-empty
      v-if="!categoryStore.loading && categoryStore.categories.length === 0"
      description="暫無分類"
    />

    <!-- 新增對話框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增分類"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="名稱" prop="name">
          <el-input v-model="form.name" placeholder="請輸入分類名稱" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="請輸入分類描述"
          />
        </el-form-item>
        <el-form-item label="父分類">
          <el-select
            v-model="form.parentId"
            placeholder="選擇父分類（可選）"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
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
.category-list-page {
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

  .category-table {
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
