<template>
  <div class="aside-box">
    <el-menu
      :router="true"
      :default-active="route.path"
      :collapse="menuCollapse"
      class="el-menu-vertical-aside"
    >
      <el-menu-item v-for="item in routes" :key="item.path" :index="item.path">
        <el-icon>
          <component v-if="item.meta?.icon" :is="item.meta?.icon" />
          <IconSvg
            v-else-if="item.meta?.iconfont"
            :icon="item.meta?.iconfont as string"
            size="18px"
          ></IconSvg>
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { routes } from '@/router/index'
import { useMenuCollapseStore } from '@/stores/menuCollapse'
import { storeToRefs } from 'pinia'
import IconSvg from '@/components/IconSvg.vue'

const route = useRoute()
const { menuCollapse } = storeToRefs(useMenuCollapseStore())
</script>

<style scoped lang="scss">
.aside-box {
  height: 100%;
}
.el-menu-vertical-aside {
  height: 100%;
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>
