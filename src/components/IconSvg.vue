<template>
  <svg class="icon" aria-hidden="true" :style="{ width: size, height: size }">
    <use :xlink:href="`#${props.icon}`"></use>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon: string
    size?: string
  }>(),
  {
    size: '14px'
  }
)
</script>
