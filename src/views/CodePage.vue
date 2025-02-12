<template>
  <div class="code-page">
    <CodeCard v-model="code" lang="vue"></CodeCard>
    <CodeCard v-model="code2" lang="ts" :isEditor="true"></CodeCard>
  </div>
</template>

<script lang="ts" setup>
import CodeCard from '@/components/CodeCard.vue'
import { ref } from 'vue'

const code = ref(`<template><h1>This is an about page</h1><h1>This is an about page</h1><h1>This is an about page</h1></template>
`)
const code2 = ref(`import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'import zhCn from 'element-plus/es/locale/lang/zh-cn'import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router/index'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})

app.mount('#app')
`)
</script>

<style lang="scss" scoped>
</style>
