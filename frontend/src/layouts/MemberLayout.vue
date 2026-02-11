<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'
import { VipLevelLabels } from '@/types/enums'
import { VideoCamera, Picture, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { canAccessImages } = usePermission()

const menuItems = computed(() => [
  {
    index: '/member/videos',
    title: '影片專區',
    icon: VideoCamera,
    disabled: false,
  },
  {
    index: '/member/images',
    title: '圖片資訊',
    icon: canAccessImages.value ? Picture : Lock,
    disabled: !canAccessImages.value,
  },
])

const activeMenu = computed(() => {
  const path = route.path
  for (const item of menuItems.value) {
    if (path.startsWith(item.index)) {
      return item.index
    }
  }
  return path
})

const vipLevelLabel = computed(() => VipLevelLabels[authStore.vipLevel] || 'VIP')

function handleSelect(index: string): void {
  const item = menuItems.value.find((m) => m.index === index)
  if (item?.disabled) {
    return
  }
  router.push(index)
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
}
</script>

<template>
  <el-container class="member-layout">
    <!-- 頂部 Header -->
    <el-header class="member-header">
      <div class="header-left">
        <h1 class="logo">VIP 會員平台</h1>
      </div>

      <!-- 水平導航選單 -->
      <el-menu
        :default-active="activeMenu"
        class="header-menu"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
          :disabled="item.disabled"
          :class="{ 'is-locked': item.disabled }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
          <el-tag v-if="item.disabled" size="small" type="info" class="lock-tag">
            VIP 5+
          </el-tag>
        </el-menu-item>
      </el-menu>

      <div class="header-right">
        <el-tag :type="getVipTagType(authStore.vipLevel)" class="vip-tag">
          {{ vipLevelLabel }}
        </el-tag>
        <span class="username">{{ authStore.user?.username }}</span>
        <el-button type="danger" text @click="handleLogout">
          登出
        </el-button>
      </div>
    </el-header>

    <!-- 內容區 -->
    <el-main class="member-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
function getVipTagType(level: number): 'info' | 'success' | 'primary' | 'warning' | 'danger' {
  if (level <= 1) return 'info'
  if (level <= 2) return 'success'
  if (level <= 3) return 'primary'
  if (level <= 4) return 'warning'
  return 'danger'
}
</script>

<style scoped lang="scss">
.member-layout {
  height: 100vh;
  flex-direction: column;
}

.member-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  height: 60px;

  .header-left {
    .logo {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0;
      margin-right: 32px;
    }
  }

  .header-menu {
    flex: 1;
    border-bottom: none;

    :deep(.el-menu-item) {
      &.is-locked {
        cursor: not-allowed;
        opacity: 0.6;

        .lock-tag {
          margin-left: 8px;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .vip-tag {
      font-weight: 600;
    }

    .username {
      font-size: 14px;
      color: #606266;
    }
  }
}

.member-main {
  background-color: #f5f7fa;
  padding: 24px;
  overflow-y: auto;
}
</style>
