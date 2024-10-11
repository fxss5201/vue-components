<template>
  <ResizeCard class="resize-box" @reisze="handleResize">
    123456
  </ResizeCard>
</template>

<script lang="ts" setup>
import ResizeCard from '@/components/ResizeCard.vue'

function handleResize (value: { width: number; height: number }) {
  console.log(value)
}
</script>

<style lang="scss" scoped>
.resize-box {
  border: 1px solid var(--el-menu-border-color);
}
</style>