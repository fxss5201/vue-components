<template>
  <ResizeCard>
    <SimpleSwiper class="simple-swiper-box">
      <div class="simple-swiper-item" v-for="item in list" :key="item">
        <div class="item-title">{{ item }}</div>
      </div>
    </SimpleSwiper>
  </ResizeCard>
</template>

<script lang="ts" setup>
import ResizeCard from '@/components/ResizeCard.vue'
import SimpleSwiper from '@/components/SimpleSwiper.vue'
import { ref } from 'vue';

const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
</script>

<style lang="scss" scoped>
.simple-swiper-box {
  height: 100px;
  .simple-swiper-item {
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
    padding: 5px;
  }
  .item-title {
    background-color: #ccc;
    border-radius: 4px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
