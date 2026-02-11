import { ref, computed } from 'vue'

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialLimit = 10 } = options

  // State
  const page = ref(initialPage)
  const limit = ref(initialLimit)
  const total = ref(0)

  // Getters
  const totalPages = computed(() => Math.ceil(total.value / limit.value))
  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPrevPage = computed(() => page.value > 1)

  // Methods
  function setPage(newPage: number): void {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
    }
  }

  function setLimit(newLimit: number): void {
    limit.value = newLimit
    page.value = 1 // 重置到第一頁
  }

  function setTotal(newTotal: number): void {
    total.value = newTotal
  }

  function nextPage(): void {
    if (hasNextPage.value) {
      page.value++
    }
  }

  function prevPage(): void {
    if (hasPrevPage.value) {
      page.value--
    }
  }

  function reset(): void {
    page.value = initialPage
    limit.value = initialLimit
    total.value = 0
  }

  return {
    // State
    page,
    limit,
    total,
    // Getters
    totalPages,
    hasNextPage,
    hasPrevPage,
    // Methods
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    reset,
  }
}
