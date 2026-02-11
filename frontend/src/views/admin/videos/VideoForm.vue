<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { useTagStore } from '@/stores/tag'
import { useCategoryStore } from '@/stores/category'
import { EmbedTypeOptions } from '@/types/enums'
import type { CreateVideoDto, UpdateVideoDto, EmbedType } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const videoStore = useVideoStore()
const tagStore = useTagStore()
const categoryStore = useCategoryStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const pageLoading = ref(false)

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEditMode.value ? '編輯影片' : '新增影片'))

const form = reactive<CreateVideoDto & { id?: string }>({
  title: '',
  description: '',
  embedCode: '',
  embedType: 'youtube' as EmbedType,
  thumbnailUrl: '',
  durationSeconds: undefined,
  tagIds: [],
  categoryIds: [],
})

const rules: FormRules = {
  title: [
    { required: true, message: '請輸入標題', trigger: 'blur' },
    { max: 200, message: '標題最多 200 個字符', trigger: 'blur' },
  ],
  embedCode: [
    { required: true, message: '請輸入嵌入代碼', trigger: 'blur' },
  ],
  embedType: [
    { required: true, message: '請選擇嵌入類型', trigger: 'change' },
  ],
}

// 載入影片資料（編輯模式）
async function loadVideo(): Promise<void> {
  if (!isEditMode.value) return

  pageLoading.value = true
  try {
    const video = await videoStore.fetchVideo(route.params.id as string)
    if (video) {
      form.id = video.id
      form.title = video.title
      form.description = video.description || ''
      form.embedCode = video.embedCode
      form.embedType = video.embedType
      form.thumbnailUrl = video.thumbnailUrl || ''
      form.durationSeconds = video.durationSeconds || undefined
      form.tagIds = video.tags?.map((t) => t.id) || []
      form.categoryIds = video.categories?.map((c) => c.id) || []
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
        const updateDto: UpdateVideoDto = {
          title: form.title,
          description: form.description || undefined,
          embedCode: form.embedCode,
          embedType: form.embedType,
          thumbnailUrl: form.thumbnailUrl || undefined,
          durationSeconds: form.durationSeconds,
          tagIds: form.tagIds,
          categoryIds: form.categoryIds,
        }
        await videoStore.updateVideo(form.id!, updateDto)
      } else {
        await videoStore.createVideo({
          title: form.title,
          description: form.description || undefined,
          embedCode: form.embedCode,
          embedType: form.embedType,
          thumbnailUrl: form.thumbnailUrl || undefined,
          durationSeconds: form.durationSeconds,
          tagIds: form.tagIds,
          categoryIds: form.categoryIds,
        })
      }
      router.push('/admin/videos')
    } finally {
      loading.value = false
    }
  })
}

// 取消
function handleCancel(): void {
  router.push('/admin/videos')
}

onMounted(async () => {
  await Promise.all([
    tagStore.fetchTags(),
    categoryStore.fetchCategories(),
    loadVideo(),
  ])
})
</script>

<template>
  <div v-loading="pageLoading" class="video-form-page">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="標題" prop="title">
          <el-input v-model="form.title" placeholder="請輸入影片標題" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="請輸入影片描述"
          />
        </el-form-item>

        <el-form-item label="嵌入類型" prop="embedType">
          <el-select v-model="form.embedType" style="width: 200px">
            <el-option
              v-for="option in EmbedTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="嵌入代碼" prop="embedCode">
          <el-input
            v-model="form.embedCode"
            type="textarea"
            :rows="3"
            placeholder="請輸入嵌入代碼或影片 ID"
          />
        </el-form-item>

        <el-form-item label="縮圖 URL">
          <el-input v-model="form.thumbnailUrl" placeholder="請輸入縮圖 URL" />
        </el-form-item>

        <el-form-item label="影片時長（秒）">
          <el-input-number
            v-model="form.durationSeconds"
            :min="0"
            :max="86400"
            placeholder="請輸入影片時長"
          />
        </el-form-item>

        <el-form-item label="標籤">
          <el-select
            v-model="form.tagIds"
            multiple
            filterable
            placeholder="選擇標籤"
            style="width: 100%"
          >
            <el-option
              v-for="tag in tagStore.tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="分類">
          <el-select
            v-model="form.categoryIds"
            multiple
            filterable
            placeholder="選擇分類"
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

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEditMode ? '更新' : '新增' }}
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.video-form-page {
  .page-header {
    margin-bottom: 24px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  .form-card {
    max-width: 800px;
  }
}
</style>
