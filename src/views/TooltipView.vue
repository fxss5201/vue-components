<template>
  <ResizeCard class="resize-box" :default-height="250">
    <div class="list-box">
      <div class="list-item" v-for="item in list" :key="item.id">
        <div class="item-left">
          <el-tooltip
            effect="dark"
            :content="item.title"
            placement="top-start"
            :disabled="tooltipDisabled"
          >
            <div class="item-title" @mouseenter="mouseenterFn" @mouseleave="mouseleaveFn">
              {{ item.title }}
            </div>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="item.content"
            placement="top-start"
            :disabled="tooltipDisabled"
          >
            <div class="item-content" @mouseenter="mouseenterFn" @mouseleave="mouseleaveFn">
              {{ item.content }}
            </div>
          </el-tooltip>
        </div>
        <div class="item-right">
          <div class="item-tag">{{ item.tag }}</div>
        </div>
      </div>
    </div>
  </ResizeCard>
  <ResizeCard class="resize-box" @reisze="handleResize" :autoWatchScroll="false" :is-scroll="resizeCardIsScroll" style="margin-top: 16px;">
    <div class="list-box" ref="listBox" style="height: 100%;overflow-y: auto;">
      <div class="list-item" v-for="item in list" :key="item.id">
        <div class="item-left">
          <el-tooltip
            effect="dark"
            :content="item.title"
            placement="top-start"
            :disabled="tooltipDisabled"
          >
            <div class="item-title" @mouseenter="mouseenterFn" @mouseleave="mouseleaveFn">
              {{ item.title }}
            </div>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="item.content"
            placement="top-start"
            :disabled="tooltipDisabled"
          >
            <div class="item-content" @mouseenter="mouseenterFn" @mouseleave="mouseleaveFn">
              {{ item.content }}
            </div>
          </el-tooltip>
        </div>
        <div class="item-right">
          <div class="item-tag">{{ item.tag }}</div>
        </div>
      </div>
    </div>
  </ResizeCard>
</template>

<script lang="ts" setup>
import ResizeCard from '@/components/ResizeCard.vue'
import { nextTick, onMounted, ref } from 'vue'
import { elementIsEllipsis } from '@/utils/elementIsEllipsis'
import { elementIsScrollY } from '@/utils/elementIsScroll'

const list = ref([
  {
    id: 1,
    title: '这是测试标题1',
    content: '这是测试内容1这是测试内容1',
    tag: 'aaa'
  },
  {
    id: 2,
    title: '这是测试标题2这是测试标题2这是测试标题2这是测试标题2',
    content:
      '这是测试内容2这是测试内容2这是测试内容2这是测试内容2这是测试内容2这是测试内容2这是测试内容2',
    tag: 'bbb'
  },
  {
    id: 3,
    title: '这是测试标题3这是测试标题3这是测试标题3',
    content: '这是测试内容3这是测试内容3这是测试内容3这是测试内容3',
    tag: 'bbb'
  }
])
const tooltipDisabled = ref(true)
function mouseenterFn (e: MouseEvent) {
  const curDiv = e.target as HTMLElement
  tooltipDisabled.value = !elementIsEllipsis(curDiv)
}
function mouseleaveFn() {
  tooltipDisabled.value = false
}

const resizeCardIsScroll = ref(false)
const listBox = ref<HTMLDivElement>()
function handleResize(value: { width: number; height: number }) {
  console.log(value)
  resizeCardIsScroll.value = elementIsScrollY(listBox.value as HTMLDivElement)
}
onMounted(() => {
  nextTick(() => {
    resizeCardIsScroll.value = elementIsScrollY(listBox.value as HTMLDivElement)
  })
})
</script>

<style lang="scss" scoped>
.resize-box {
  border: 1px solid var(--el-menu-border-color);
}
.list-box {
  padding: 16px;
  .list-item {
    background-color: #e8effa;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    &:nth-child(2) {
      .item-left {
        .item-title {
          padding: 0 12px;
        }
        .item-content {
          padding: 0 24px;
        }
      }
    }
    .item-left {
      flex: auto;
      overflow: hidden;
      .item-title {
        font-size: 16px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-content {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .item-right {
      flex: 0 0 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      .item-tag {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .list-item + .list-item {
    margin-top: 16px;
  }
}
</style>
