<template>
  <div class="page-no-top-padding">
    <MarkdownCard :content="TabsScrollMd" />
    <el-form :inline="true">
      <el-form-item>
        <el-button @click="addFn">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addAndSetFn">新增并设置为当前项</el-button>
      </el-form-item>
      <el-form-item label="滚动速度">
        <el-input-number v-model="scrollSpeed" :min="1" :max="50" />
      </el-form-item>
    </el-form>
    <ResizeCard :defaultHeight="100" :minHeight="80" :maxHeight="120">
      <TabsScroll v-model="tabActive" :tabs="tabs" :scrollSpeed="scrollSpeed" @tab-close="tabCloseFn"></TabsScroll>
    </ResizeCard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TabsScroll from '@/components/TabsScroll.vue'
import type { Tab } from '@/types/TabsScrollType'
import MarkdownCard from '@/components/MarkdownCard.vue'
import TabsScrollMd from '@/md/TabsScroll.md?raw'
import ResizeCard from '@/components/ResizeCard.vue'

const scrollSpeed = ref(18)

const tabs = ref<Tab[]>([
  {
    name: 'Tab1',
    key: '1'
  },
  {
    name: 'Tab2',
    key: '2'
  },
  {
    name: 'Tab3',
    key: '3'
  },
  {
    name: 'Tab4',
    key: '4'
  },
  {
    name: 'Tab5',
    key: '5'
  },
  {
    name: 'Tab6',
    key: '6'
  },
  {
    name: 'Tab7',
    key: '7'
  },
  {
    name: 'Tab8',
    key: '8'
  },
  {
    name: 'Tab9',
    key: '9'
  },
  {
    name: 'Tab10',
    key: '10'
  }
])
const tabActive = ref(tabs.value[0].key)
function addFn () {
  const lastTab = tabs.value[tabs.value.length - 1]
  const curIndex = Number(lastTab.key) + 1
  tabs.value.push({
    name: `Tab${curIndex}`,
    key: `${curIndex}`
  })
}

function addAndSetFn () {
  addFn()
  tabActive.value = tabs.value[tabs.value.length - 1].key
}

function tabCloseFn (value: Tab) {
  const idx = tabs.value.findIndex((item) => item.key === value.key)
  tabs.value.splice(idx, 1)
}
</script>

<style lang="scss" scoped></style>
