<template>
  <div class="resize-box" contenteditable></div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.resize-box {
  resize: both;
  width: 600px;
  height: 500px;
  min-width: 200px;
  min-height: 100px;
  border: 1px solid var(--el-menu-border-color);
}
</style>