<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { VipLevelOptions } from '@/types/enums'
import type { User, CreateUserDto, UpdateUserDto } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const userStore = useUserStore()

// 搜尋
const searchKeyword = ref('')

// 對話框
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const formLoading = ref(false)

const form = reactive<CreateUserDto & { id?: string }>({
  username: '',
  password: '',
  phone: '',
  vipLevel: 1,
  isAdmin: false,
})

const rules: FormRules = {
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    { min: 2, max: 50, message: '用戶名長度為 2-50 個字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少 6 個字符', trigger: 'blur' },
  ],
}

// 載入使用者列表
async function loadUsers(page = 1): Promise<void> {
  await userStore.fetchUsers({
    page,
    limit: userStore.limit,
    keyword: searchKeyword.value || undefined,
  })
}

// 搜尋（防抖）
const debouncedSearch = useDebounceFn(() => {
  loadUsers(1)
}, 500)

function handleSearch(): void {
  debouncedSearch()
}

// 分頁變更
function handlePageChange(page: number): void {
  loadUsers(page)
}

// 開啟新增對話框
function handleCreate(): void {
  dialogMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 開啟編輯對話框
function handleEdit(user: User): void {
  dialogMode.value = 'edit'
  form.id = user.id
  form.username = user.username
  form.password = ''
  form.phone = user.phone || ''
  form.vipLevel = user.vipLevel
  form.isAdmin = user.isAdmin
  dialogVisible.value = true
}

// 重置表單
function resetForm(): void {
  form.id = undefined
  form.username = ''
  form.password = ''
  form.phone = ''
  form.vipLevel = 1
  form.isAdmin = false
}

// 提交表單
async function handleSubmit(): Promise<void> {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    formLoading.value = true
    try {
      if (dialogMode.value === 'create') {
        await userStore.createUser({
          username: form.username,
          password: form.password,
          phone: form.phone || undefined,
          vipLevel: form.vipLevel,
          isAdmin: form.isAdmin,
        })
      } else {
        const updateDto: UpdateUserDto = {
          username: form.username,
          phone: form.phone || undefined,
        }
        if (form.password) {
          updateDto.password = form.password
        }
        await userStore.updateUser(form.id!, updateDto)
      }
      dialogVisible.value = false
      loadUsers(userStore.page)
    } finally {
      formLoading.value = false
    }
  })
}

// 更新 VIP 等級
async function handleVipLevelChange(user: User, newLevel: number): Promise<void> {
  await userStore.updateVipLevel(user.id, { vipLevel: newLevel })
}

// 刪除使用者
async function handleDelete(user: User): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `確定要刪除使用者「${user.username}」嗎？此操作無法復原。`,
      '刪除確認',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await userStore.deleteUser(user.id)
    loadUsers(userStore.page)
  } catch {
    // 用戶取消
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-list-page">
    <!-- 頂部工具列 -->
    <div class="page-header">
      <h2 class="page-title">使用者管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增使用者
      </el-button>
    </div>

    <!-- 搜尋區域 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜尋用戶名或電話"
        clearable
        style="width: 300px"
        @input="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 使用者表格 -->
    <el-table
      v-loading="userStore.loading"
      :data="userStore.users"
      stripe
      class="user-table"
    >
      <el-table-column prop="username" label="用戶名" min-width="120" />
      <el-table-column prop="phone" label="電話" min-width="120">
        <template #default="{ row }">
          {{ row.phone || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="VIP 等級" width="140">
        <template #default="{ row }">
          <el-select
            :model-value="row.vipLevel"
            size="small"
            :disabled="row.isAdmin"
            @change="(val: number) => handleVipLevelChange(row, val)"
          >
            <el-option
              v-for="option in VipLevelOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="身份" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.isAdmin" type="danger">管理員</el-tag>
          <el-tag v-else type="info">會員</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.isActive" type="success">啟用</el-tag>
          <el-tag v-else type="info">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="建立時間" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString('zh-TW') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" text size="small" @click="handleEdit(row)">
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            size="small"
            :disabled="row.isAdmin"
            @click="handleDelete(row)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="userStore.page"
        :page-size="userStore.limit"
        :total="userStore.total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/編輯對話框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增使用者' : '編輯使用者'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="form.username" placeholder="請輸入用戶名" />
        </el-form-item>
        <el-form-item
          label="密碼"
          prop="password"
          :rules="dialogMode === 'create' ? rules.password : []"
        >
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="dialogMode === 'create' ? '請輸入密碼' : '不修改請留空'"
            show-password
          />
        </el-form-item>
        <el-form-item label="電話">
          <el-input v-model="form.phone" placeholder="請輸入電話" />
        </el-form-item>
        <el-form-item v-if="dialogMode === 'create'" label="VIP 等級">
          <el-select v-model="form.vipLevel" style="width: 100%">
            <el-option
              v-for="option in VipLevelOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogMode === 'create'" label="管理員">
          <el-switch v-model="form.isAdmin" />
        </el-form-item>
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
.user-list-page {
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

  .search-bar {
    margin-bottom: 16px;
  }

  .user-table {
    background: #fff;
    border-radius: 8px;
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
