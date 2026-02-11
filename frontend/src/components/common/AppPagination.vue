<script setup lang="ts">
interface Props {
  total: number
  page: number
  limit: number
  pageSizes?: number[]
  layout?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
})

const emit = defineEmits<{
  'update:page': [value: number]
  'update:limit': [value: number]
  change: [page: number, limit: number]
}>()

function handleCurrentChange(page: number): void {
  emit('update:page', page)
  emit('change', page, props.limit)
}

function handleSizeChange(size: number): void {
  emit('update:limit', size)
  emit('update:page', 1)
  emit('change', 1, size)
}
</script>

<template>
  <div class="app-pagination">
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style scoped lang="scss">
.app-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
