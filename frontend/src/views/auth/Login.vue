<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少 6 個字符', trigger: 'blur' },
  ],
}

async function handleLogin(): Promise<void> {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await authStore.login(form)

      // 根據身份導向不同頁面
      if (authStore.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/member')
      }
    } catch (error) {
      console.error('登入失敗:', error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">VIP 會員平台</h1>
          <p class="login-subtitle">歡迎回來，請登入您的帳號</p>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="用戶名" prop="username">
            <el-input
              v-model="form.username"
              placeholder="請輸入用戶名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>

          <el-form-item label="密碼" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="請輸入密碼"
              size="large"
              prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="login-button"
              @click="handleLogin"
            >
              {{ loading ? '登入中...' : '登入' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <p class="hint-text">測試帳號</p>
          <p class="hint-account">管理員：admin / admin123</p>
          <p class="hint-account">VIP 會員：vip1user ~ vip6user / test123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-title {
    font-size: 28px;
    font-weight: 700;
    color: #303133;
    margin: 0 0 8px;
  }

  .login-subtitle {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}

.login-form {
  .login-button {
    width: 100%;
    margin-top: 8px;
  }
}

.login-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
  text-align: center;

  .hint-text {
    font-size: 13px;
    color: #909399;
    margin: 0 0 8px;
  }

  .hint-account {
    font-size: 12px;
    color: #c0c4cc;
    margin: 4px 0;
  }
}
</style>
