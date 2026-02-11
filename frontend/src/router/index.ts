import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/users',
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/users/UserList.vue'),
      },
      {
        path: 'videos',
        name: 'AdminVideos',
        component: () => import('@/views/admin/videos/VideoList.vue'),
      },
      {
        path: 'videos/create',
        name: 'AdminVideoCreate',
        component: () => import('@/views/admin/videos/VideoForm.vue'),
      },
      {
        path: 'videos/:id/edit',
        name: 'AdminVideoEdit',
        component: () => import('@/views/admin/videos/VideoForm.vue'),
      },
      {
        path: 'images',
        name: 'AdminImages',
        component: () => import('@/views/admin/images/ImageList.vue'),
      },
      {
        path: 'images/create',
        name: 'AdminImageCreate',
        component: () => import('@/views/admin/images/ImageForm.vue'),
      },
      {
        path: 'images/:id/edit',
        name: 'AdminImageEdit',
        component: () => import('@/views/admin/images/ImageForm.vue'),
      },
      {
        path: 'tags',
        name: 'AdminTags',
        component: () => import('@/views/admin/tags/TagList.vue'),
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/categories/CategoryList.vue'),
      },
    ],
  },
  {
    path: '/member',
    component: () => import('@/layouts/MemberLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/member/videos',
      },
      {
        path: 'videos',
        name: 'MemberVideos',
        component: () => import('@/views/member/videos/VideoList.vue'),
      },
      {
        path: 'videos/:id',
        name: 'MemberVideoDetail',
        component: () => import('@/views/member/videos/VideoDetail.vue'),
      },
      {
        path: 'images',
        name: 'MemberImages',
        component: () => import('@/views/member/images/ImageList.vue'),
        meta: { requiresVipLevel: 5 },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 檢查是否需要認證
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // 已登入用戶訪問登入頁，根據身份導向
  if (to.path === '/login' && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/member')
    }
    return
  }

  // 檢查是否需要管理員權限
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/member')
    return
  }

  // 檢查 VIP 等級
  if (to.meta.requiresVipLevel) {
    const requiredLevel = to.meta.requiresVipLevel as number
    if (authStore.vipLevel < requiredLevel) {
      next('/member/videos')
      return
    }
  }

  next()
})

export default router
