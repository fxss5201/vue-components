<template>
  <div class="aside-box">
    <el-scrollbar height="100%">
      <el-menu
        :router="true"
        :default-active="route.path"
        :collapse="menuCollapse"
        class="el-menu-vertical-aside"
      >
        <template v-for="item in routesMenu" :key="item.path">
          <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
            <template #title>
              <el-icon v-if="item.meta?.icon || item.meta?.iconfont">
                <component v-if="item.meta?.icon" :is="item.meta?.icon" />
                <IconSvg v-else-if="item.meta?.iconfont" :icon="(item.meta?.iconfont as string)" size="18px"></IconSvg>
              </el-icon>
              <span>{{ item.meta?.title }}</span>
            </template>
            <el-menu-item v-for="itemRoute in item.children" :key="itemRoute.path" :index="itemRoute.path">
              <el-icon v-if="itemRoute.meta?.icon || itemRoute.meta?.iconfont">
                <component v-if="itemRoute.meta?.icon" :is="itemRoute.meta?.icon" />
                <IconSvg v-else-if="itemRoute.meta?.iconfont" :icon="itemRoute.meta?.iconfont as string" size="18px"></IconSvg>
              </el-icon>
              <span>{{ itemRoute.meta?.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon v-if="item.meta?.icon || item.meta?.iconfont">
              <component v-if="item.meta?.icon" :is="item.meta?.icon" />
              <IconSvg v-else-if="item.meta?.iconfont" :icon="(item.meta?.iconfont as string)" size="18px"></IconSvg>
            </el-icon>
            <span>{{ item.meta?.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { routes } from '@/router/index'
import { useMenuCollapseStore } from '@/stores/menuCollapse'
import { storeToRefs } from 'pinia'
import IconSvg from '@/components/IconSvg.vue'

const route = useRoute()
const routesMenu = routes.filter(x => x.meta?.hideInAside !== true)
const { menuCollapse } = storeToRefs(useMenuCollapseStore())
</script>

<style scoped lang="scss">
.aside-box {
  height: 100%;
}
.el-menu-vertical-aside {
  height: calc(100vh - 60px);
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>
