<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  User,
  VideoCamera,
  Picture,
  PriceTag,
  Menu as MenuIcon,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  {
    index: '/admin/users',
    title: '使用者管理',
    icon: User,
  },
  {
    index: '/admin/videos',
    title: '影片管理',
    icon: VideoCamera,
  },
  {
    index: '/admin/images',
    title: '圖片管理',
    icon: Picture,
  },
  {
    index: '/admin/tags',
    title: '標籤管理',
    icon: PriceTag,
  },
  {
    index: '/admin/categories',
    title: '分類管理',
    icon: MenuIcon,
  },
]

const activeMenu = computed(() => {
  const path = route.path
  // 處理子路由情況
  for (const item of menuItems) {
    if (path.startsWith(item.index)) {
      return item.index
    }
  }
  return path
})

function handleSelect(index: string): void {
  router.push(index)
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
}
</script>

<template>
  <el-container class="admin-layout">
    <!-- 側邊欄 -->
    <el-aside width="220px" class="admin-sidebar">
      <div class="sidebar-header">
        <h1 class="logo">VIP 管理後台</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409eff"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主要內容區 -->
    <el-container>
      <!-- 頂部 Header -->
      <el-header class="admin-header">
        <div class="header-left">
          <span class="welcome-text">
            歡迎，{{ authStore.user?.username }}
          </span>
        </div>
        <div class="header-right">
          <el-button type="danger" text @click="handleLogout">
            登出
          </el-button>
        </div>
      </el-header>

      <!-- 內容區 -->
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.admin-layout {
  height: 100vh;
}

.admin-sidebar {
  background-color: #001529;
  overflow: hidden;

  .sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo {
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }

  .sidebar-menu {
    border-right: none;
    height: calc(100% - 64px);
  }
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 24px;

  .header-left {
    .welcome-text {
      font-size: 14px;
      color: #606266;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.admin-main {
  background-color: #f5f7fa;
  padding: 24px;
  overflow-y: auto;
}
</style>
