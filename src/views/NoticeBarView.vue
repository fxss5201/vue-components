<template>
  <div class="page-no-top-padding">
    <MarkdownCard :content="NoticeBarMd" />
    <NoticeBar
      @leftClick="leftClickFn"
      @rightClick="rightClickFn"
      @scrollStart="scrollStartFn"
      @scrollEnd="scrollEndFn"
      @canScrollChange="canScrollChangeFn"
      rightText="更多"
      :rightIcon="ArrowRight">
      <div class="notice-list">
        <div v-for="item in list" :key="item.id" @click="itemClickFn(item)" class="notice-item">
          <div class="notice-item-dot"></div>
          <div class="notice-item-text">{{ item.name }}</div>
        </div>
      </div>
      <!-- <template #right>
        <div class="notice-right-text">更多</div>
        <el-icon><ArrowRight /></el-icon>
      </template> -->
    </NoticeBar>
  </div>
</template>

<script lang="ts" setup>
import NoticeBar from '@/components/NoticeBar.vue'
import { ref } from 'vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import NoticeBarMd from '@/md/NoticeBar.md?raw'
import { ArrowRight } from '@element-plus/icons-vue'

const list = ref([
  {
    id: 1,
    name: '公告1内容公告1内容公告1内容公告1内容公告1内容公告1内容'
  },
  {
    id: 2,
    name: '公告2内容公告2内容公告2内容公告2内容'
  },
  {
    id: 3,
    name: '公告3内容公告3内容公告3内容公告3内容公告3内容公告3内容'
  },
  {
    id: 4,
    name: '公告4内容公告4内容公告4内容公告4内容公告4内容公告4内容公告4内容公告4内容'
  },
  {
    id: 5,
    name: '公告5内容公告5内容公告5内容公告5内容公告5内容'
  }
])
function leftClickFn(e: Event) {
  console.log('左侧点击', e.target)
}
function rightClickFn(e: Event) {
  console.log('右侧点击', e.target)
}
function scrollStartFn() {
  console.log('滚动开始')
}
function scrollEndFn() {
  console.log('滚动结束')
}
function canScrollChangeFn(val: boolean) {
  console.log('是否可以滚动：', val ? '可以滚动' : '不可以滚动')
}
function itemClickFn(item: any) {
  console.log('点击了：', item)
}
</script>

<style scoped lang="scss">
.notice-list {
  display: flex;
  align-items: center;

  .notice-item {
    display: flex;
    align-items: center;
    padding: 6px 0;
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }

    .notice-item-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ff5722;
      margin-right: 8px;
    }
  }

  .notice-item + .notice-item {
    margin-left: 12px;
  }
}
</style>
