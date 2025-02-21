<template>
  <template v-if="route.meta?.noLayout">
    <div class="full-page"
      :style="{
        backgroundColor: (route.meta?.backgroundColor as string) ?? '#fff',
        padding: (route.meta?.noPadding as boolean) ? '0' : '18px'
      }">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <KeepAlive :include="componentNames">
            <Suspense>
              <component :is="Component"></component>

              <template #fallback>
                正在加载...
              </template>
            </Suspense>
          </KeepAlive>
        </template>
      </RouterView>
    </div>
  </template>
  <LayoutComponent v-else></LayoutComponent>
</template>

<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import LayoutComponent from '@/layout/LayoutComponent.vue'
import { useKeepAliveStore } from '@/stores/KeepAliveStore'
import { storeToRefs } from 'pinia'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import 'nprogress/nprogress.css'

const route = useRoute()
const router = useRouter()
const keepAliveStore = useKeepAliveStore()
const { addComponentName } = keepAliveStore
const { componentNames } = storeToRefs(keepAliveStore)

const { start: startNProgress, done: doneNProgress } = useNProgress()
router.beforeEach((to, from, next) => {
  if (to.meta?.keepAlive) {
    addComponentName(to.name as string)
  }
  startNProgress()
  next()
})
router.afterEach((to, from) => {
  document.title = `${to.meta.title as string} | vue-components`
  doneNProgress()
})
</script>

<style lang="scss">
.full-page {
  min-height: 100vh;
}

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
    & > .splitpanes__splitter {
      width: 1px;
      padding: 0 1px;
      &:before {
        width: 3px;
      }
    }
  }
  &.splitpanes--horizontal {
    & > .splitpanes__splitter {
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
