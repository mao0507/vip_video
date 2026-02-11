import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

export interface UseSearchOptions {
  delay?: number
  onSearch?: (keyword: string) => void | Promise<void>
}

export function useSearch(options: UseSearchOptions = {}) {
  const { delay = 500, onSearch } = options

  // State
  const keyword = ref('')
  const isSearching = ref(false)

  // 防抖搜尋處理
  const debouncedSearch = useDebounceFn(async (value: string) => {
    if (onSearch) {
      isSearching.value = true
      try {
        await onSearch(value)
      } finally {
        isSearching.value = false
      }
    }
  }, delay)

  // 處理搜尋輸入
  function handleSearch(value: string): void {
    keyword.value = value
    debouncedSearch(value)
  }

  // 清除搜尋
  function clearSearch(): void {
    keyword.value = ''
    if (onSearch) {
      onSearch('')
    }
  }

  return {
    // State
    keyword,
    isSearching,
    // Methods
    handleSearch,
    clearSearch,
  }
}
