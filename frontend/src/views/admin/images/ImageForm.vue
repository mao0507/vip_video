<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useImageStore } from '@/stores/image'
import type { CreateImageDto, UpdateImageDto } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const imageStore = useImageStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const pageLoading = ref(false)

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEditMode.value ? '編輯圖片' : '新增圖片'))

const form = reactive<CreateImageDto & { id?: string }>({
  title: '',
  description: '',
  imageUrl: '',
  thumbnailUrl: '',
  requiredVipLevel: 5,
  isActive: true,
})

const rules: FormRules = {
  title: [
    { required: true, message: '請輸入標題', trigger: 'blur' },
    { max: 200, message: '標題最多 200 個字符', trigger: 'blur' },
  ],
  imageUrl: [
    { required: true, message: '請輸入圖片 URL', trigger: 'blur' },
    { type: 'url', message: '請輸入有效的 URL', trigger: 'blur' },
  ],
  requiredVipLevel: [
    { required: true, message: '請選擇 VIP 等級', trigger: 'change' },
  ],
}

// VIP 等級選項
const vipLevelOptions = [
  { value: 1, label: 'VIP 1' },
  { value: 2, label: 'VIP 2' },
  { value: 3, label: 'VIP 3' },
  { value: 4, label: 'VIP 4' },
  { value: 5, label: 'VIP 5' },
  { value: 6, label: 'VIP 6' },
]

// 載入圖片資料（編輯模式）
async function loadImage(): Promise<void> {
  if (!isEditMode.value) return

  pageLoading.value = true
  try {
    const image = await imageStore.fetchImage(route.params.id as string)
    if (image) {
      form.id = image.id
      form.title = image.title
      form.description = image.description || ''
      form.imageUrl = image.imageUrl
      form.thumbnailUrl = image.thumbnailUrl || ''
      form.requiredVipLevel = image.requiredVipLevel
      form.isActive = image.isActive
    }
  } finally {
    pageLoading.value = false
  }
}

// 提交表單
async function handleSubmit(): Promise<void> {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      if (isEditMode.value) {
        const updateDto: UpdateImageDto = {
          title: form.title,
          description: form.description || undefined,
          imageUrl: form.imageUrl,
          thumbnailUrl: form.thumbnailUrl || undefined,
          requiredVipLevel: form.requiredVipLevel,
          isActive: form.isActive,
        }
        await imageStore.updateImage(form.id!, updateDto)
      } else {
        await imageStore.createImage({
          title: form.title,
          description: form.description || undefined,
          imageUrl: form.imageUrl,
          thumbnailUrl: form.thumbnailUrl || undefined,
          requiredVipLevel: form.requiredVipLevel,
          isActive: form.isActive,
        })
      }
      router.push('/admin/images')
    } finally {
      loading.value = false
    }
  })
}

// 取消
function handleCancel(): void {
  router.push('/admin/images')
}

onMounted(async () => {
  await loadImage()
})
</script>

<template>
  <div v-loading="pageLoading" class="image-form-page">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <el-row :gutter="24">
      <el-col :span="14">
        <el-card class="form-card">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="120px"
            label-position="right"
          >
            <el-form-item label="標題" prop="title">
              <el-input v-model="form.title" placeholder="請輸入圖片標題" />
            </el-form-item>

            <el-form-item label="描述">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="請輸入圖片描述"
              />
            </el-form-item>

            <el-form-item label="圖片 URL" prop="imageUrl">
              <el-input v-model="form.imageUrl" placeholder="請輸入圖片 URL" />
            </el-form-item>

            <el-form-item label="縮圖 URL">
              <el-input v-model="form.thumbnailUrl" placeholder="請輸入縮圖 URL（選填）" />
            </el-form-item>

            <el-form-item label="需要 VIP 等級" prop="requiredVipLevel">
              <el-select v-model="form.requiredVipLevel" style="width: 100%">
                <el-option
                  v-for="option in vipLevelOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="啟用狀態">
              <el-switch v-model="form.isActive" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleSubmit">
                {{ isEditMode ? '更新' : '新增' }}
              </el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="preview-card">
          <template #header>
            <span>圖片預覽</span>
          </template>
          <div class="preview-content">
            <el-image
              v-if="form.imageUrl"
              :src="form.imageUrl"
              fit="contain"
              style="width: 100%; max-height: 300px"
            >
              <template #error>
                <div class="preview-error">
                  <el-icon><Picture /></el-icon>
                  <span>無法載入圖片</span>
                </div>
              </template>
            </el-image>
            <div v-else class="preview-placeholder">
              <el-icon><Picture /></el-icon>
              <span>輸入圖片 URL 後顯示預覽</span>
            </div>
          </div>
        </el-card>

        <el-card v-if="form.thumbnailUrl" class="preview-card" style="margin-top: 16px">
          <template #header>
            <span>縮圖預覽</span>
          </template>
          <div class="preview-content">
            <el-image
              :src="form.thumbnailUrl"
              fit="contain"
              style="width: 100%; max-height: 150px"
            >
              <template #error>
                <div class="preview-error small">
                  <el-icon><Picture /></el-icon>
                  <span>無法載入縮圖</span>
                </div>
              </template>
            </el-image>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.image-form-page {
  .page-header {
    margin-bottom: 24px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  .preview-card {
    .preview-content {
      min-height: 200px;
    }

    .preview-error,
    .preview-placeholder {
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      color: #909399;
      border-radius: 4px;

      .el-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      &.small {
        height: 100px;

        .el-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
