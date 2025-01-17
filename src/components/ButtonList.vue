<template>
  <div class="button-list">
    <div v-for="item in props.list" :key="item.key"
      @click="handleButtonClick(item)"
      class="button-list-item">{{ item.name }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { ButtonItemProps } from '@/types/ButtonItemProps.ts'

const props = defineProps<{
  list: ButtonItemProps[]
}>()

const emit = defineEmits<{
  click: [item: ButtonItemProps]
}>()

function handleButtonClick(item: ButtonItemProps) {
  emit('click', item)
}
</script>

<style lang="scss" scoped>
.button-list {
  padding: 5px 0;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;

  .button-list-item {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 15px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
