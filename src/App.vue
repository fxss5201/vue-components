<template>
  <LayoutComponent></LayoutComponent>
</template>

<script setup lang="ts">
import LayoutComponent from '@/layout/LayoutComponent.vue'
</script>

<style lang="scss">
.splitpanes {
  .splitpanes__pane {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .splitpanes__splitter {
    background-color: var(--el-menu-border-color);
    position: relative;
  }
  &.splitpanes--vertical {
    .splitpanes__splitter {
      width: 1px;
      padding: 0 1px;
      &:before {
        width: 3px;
      }
    }
  }
  &.splitpanes--horizontal {
    .splitpanes__splitter {
      height: 1px;
      padding: 1px 0;
      &:hover {
        height: 3px;
      }
    }
  }
  .splitpanes__splitter:hover {
    background-color: blue;
  }
}
</style>
