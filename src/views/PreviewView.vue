<template>
  <iframe v-if="serverUrl" :src="serverUrl" style="width: 100%;min-height: 100vh;" frameborder="0"></iframe>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const serverUrl = computed(() => {
  return route.query.serverUrl as string
})
</script>
