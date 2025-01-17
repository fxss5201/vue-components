<template>
  <div class="layout-box">
    <div class="layout-head">
      <div class="layout-head-left">
        <div class="layout-title">vue-components</div>
        <el-tooltip
          effect="light"
          :content="menuCollapse ? '展开菜单' : '收起菜单'"
          placement="bottom-start"
        >
          <el-button text @click="menuCollapseStore.toggleMenuCollapse">
            <el-icon size="18">
              <Expand v-if="menuCollapse" />
              <Fold v-else />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="layout-head-right">
        <el-link
          href="https://github.com/fxss5201/vue-components"
          target="_blank"
          :underline="false"
        >
          <IconSvg icon="icon-github" size="18px"></IconSvg>
          <span style="margin: 0 6px">Github</span>
          <IconSvg icon="icon-new-link" size="14px"></IconSvg>
        </el-link>
      </div>
    </div>
    <div class="layout-content">
      <div class="layout-saide">
        <AsideComponent></AsideComponent>
      </div>
      <div
        class="layout-main"
        ref="layoutMainRef"
        :style="{ backgroundColor: (route.meta?.backgroundColor as string) ?? '#fff' }"
      >
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Suspense>
              <component :is="Component"></component>

              <template #fallback>
                正在加载...
              </template>
            </Suspense>
          </template>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'
import AsideComponent from '@/layout/AsideComponent.vue'
import IconSvg from '@/components/IconSvg.vue'
import { useMenuCollapseStore } from '@/stores/menuCollapse'
import { storeToRefs } from 'pinia'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import 'nprogress/nprogress.css'

const menuCollapseStore = useMenuCollapseStore()
const { menuCollapse } = storeToRefs(menuCollapseStore)
const route = useRoute()
const router = useRouter()

const { start: startNProgress, done: doneNProgress } = useNProgress()

router.beforeEach((to, from, next) => {
  startNProgress()
  next()
})
const layoutMainRef = ref<HTMLDivElement>()
router.afterEach((to, from) => {
  document.title = `${to.meta.title as string} | vue-components`
  layoutMainRef.value!.scrollTo(0, 0)
  doneNProgress()
})
</script>

<style scoped lang="scss">
.layout-box {
  height: 100vh;
}
.layout-head {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-menu-border-color);
  .layout-head-left {
    display: flex;
    align-items: center;
    .layout-title {
      width: 180px;
      font-size: 18px;
      font-weight: 600;
    }
  }
}
.layout-content {
  height: calc(100vh - 61px);
  display: flex;
  align-items: stretch;
}
.layout-saide {
  flex: 0 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
}
.layout-main {
  flex: auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px;
}
</style>
