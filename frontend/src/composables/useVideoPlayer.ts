import { ref, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { usePermission } from './usePermission'

export function useVideoPlayer() {
  const { canWatchFullVideo, getVideoPermissions } = usePermission()

  // State
  const currentTime = ref(0)
  const isPreviewEnded = ref(false)
  const previewTimer = ref<ReturnType<typeof setInterval> | null>(null)
  const isPlaying = ref(false)

  // 開始 10 秒計時
  function startPreviewTimer(): void {
    if (canWatchFullVideo.value) {
      return
    }

    const permissions = getVideoPermissions()
    if (!permissions.previewOnly) {
      return
    }

    isPreviewEnded.value = false
    currentTime.value = 0

    previewTimer.value = setInterval(() => {
      currentTime.value += 1

      if (currentTime.value >= permissions.previewDuration) {
        stopPreviewTimer()
        showPreviewEndDialog()
      }
    }, 1000)
  }

  // 停止計時器
  function stopPreviewTimer(): void {
    if (previewTimer.value) {
      clearInterval(previewTimer.value)
      previewTimer.value = null
    }
  }

  // 顯示權限不足彈窗
  async function showPreviewEndDialog(): Promise<void> {
    isPreviewEnded.value = true
    isPlaying.value = false

    await ElMessageBox.alert(
      '您的 VIP 等級僅能試看前 10 秒，如需觀看完整影片，請聯繫客服升級會員等級',
      '試看結束',
      {
        confirmButtonText: '我知道了',
        type: 'warning',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false,
      }
    )
  }

  // 清除計時器
  function clearPreviewTimer(): void {
    stopPreviewTimer()
    currentTime.value = 0
    isPreviewEnded.value = false
  }

  // 處理播放事件
  function onPlay(): void {
    isPlaying.value = true
    if (!canWatchFullVideo.value && !isPreviewEnded.value) {
      startPreviewTimer()
    }
  }

  // 處理暫停事件
  function onPause(): void {
    isPlaying.value = false
    stopPreviewTimer()
  }

  // 重置狀態
  function reset(): void {
    clearPreviewTimer()
    isPlaying.value = false
  }

  // 組件卸載時清除計時器
  onUnmounted(() => {
    clearPreviewTimer()
  })

  return {
    // State
    currentTime,
    isPreviewEnded,
    isPlaying,
    // Methods
    startPreviewTimer,
    stopPreviewTimer,
    showPreviewEndDialog,
    clearPreviewTimer,
    onPlay,
    onPause,
    reset,
  }
}
