<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { routes } from '@/router/index'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <template v-for="item in routes" :key="item.path">
          <RouterLink :to="item.path">{{ item.meta?.title }}</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  line-height: 38px;
}

nav a.router-link-exact-active {
  color: var(--el-color-primary);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
