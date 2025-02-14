<template>
  <div class="page-no-top-padding">
    <MarkdownCard :content="HomeMd" />
  </div>
</template>

<script setup lang="ts">
import MarkdownCard from '@/components/MarkdownCard.vue'
import HomeMd from './../../README.md?raw'
</script>
