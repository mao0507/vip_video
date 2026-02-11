import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermission() {
  const authStore = useAuthStore()

  // 是否可觀看完整影片 (VIP 3+)
  const canWatchFullVideo = computed(() => authStore.vipLevel >= 3)

  // 是否只能試看 (VIP 1-2)
  const canOnlyPreview = computed(
    () => authStore.vipLevel >= 1 && authStore.vipLevel <= 2
  )

  // 是否可存取圖片 (VIP 5+)
  const canAccessImages = computed(() => authStore.vipLevel >= 5)

  // 是否為管理員
  const isAdmin = computed(() => authStore.isAdmin)

  // 檢查特定 VIP 等級
  function hasVipLevel(level: number): boolean {
    return authStore.vipLevel >= level
  }

  // 取得影片權限資訊
  function getVideoPermissions() {
    const vipLevel = authStore.vipLevel

    if (vipLevel >= 3) {
      return {
        canWatch: true,
        previewOnly: false,
        previewDuration: 0,
      }
    }

    return {
      canWatch: false,
      previewOnly: true,
      previewDuration: 10,
    }
  }

  return {
    canWatchFullVideo,
    canOnlyPreview,
    canAccessImages,
    isAdmin,
    hasVipLevel,
    getVideoPermissions,
  }
}
