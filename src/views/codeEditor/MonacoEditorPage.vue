<template>
  <div class="page-no-top-padding">
    <h1>monaco-editor</h1>
    <MonacoEditor v-model="code" height="600px" language="javascript"></MonacoEditor>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MonacoEditor from '@/components/MonacoEditor.vue'

const code = ref(`import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

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

watch(() => code.value, (newValue) => {
  console.log(newValue) 
})
</script>

<style lang="scss" scoped>
</style>
