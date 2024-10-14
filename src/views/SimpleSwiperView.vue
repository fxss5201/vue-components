<template>
  <ResizeCard>
    <div style="padding: 16px;">
      <el-form :model="form" label-width="auto" style="margin-bottom: 12px;">
        <el-form-item label="子项数目" prop="length">
          <el-input-number v-model="form.length" :min="1" @change="handleChange" />
        </el-form-item>
        <el-form-item label="子项宽度" prop="itemWidth">
          <el-input-number v-model="form.itemWidth" :min="80" :step="10" />
          <span style="margin-left: 6px;">px</span>
        </el-form-item>
        <el-form-item label="子项滚动耗时" prop="itemDuration">
          <el-input-number v-model="form.itemDuration" :min="80" :step="10" />
          <span style="margin-left: 6px;">ms</span>
        </el-form-item>
        <el-form-item>
          拖动外框，也可以自适应
        </el-form-item>
      </el-form>

      <SimpleSwiper class="simple-swiper-box" :length="form.length" :item-width="form.itemWidth" :item-duration="form.itemDuration">
        <div class="simple-swiper-item" v-for="item in list" :key="item" :style="{ flex: `0 0 ${form.itemWidth}px`, width: `${form.itemWidth}px`, height: `${form.itemWidth}px` }">
          <div class="item-title">{{ item }}</div>
        </div>
      </SimpleSwiper>
    </div>
  </ResizeCard>
</template>

<script lang="ts" setup>
import ResizeCard from '@/components/ResizeCard.vue'
import SimpleSwiper from '@/components/SimpleSwiper.vue'
import { ref } from 'vue';

const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const form = ref({
  length: list.value.length,
  itemWidth: 100,
  itemDuration: 180
})
function handleChange () {
  list.value = Array.from({ length: form.value.length }, (_, index) => index + 1)
}
</script>

<style lang="scss" scoped>
.simple-swiper-box {
  height: 100px;
  .simple-swiper-item {
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
