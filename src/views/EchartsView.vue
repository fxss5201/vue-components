<template>
  <ResizeCard>
    <EchartsCard
      :opts="{ renderer: 'canvas' }"
      :options="options"
      :addEvent="true"
      @click="handleClick"
    />
  </ResizeCard>
</template>

<script lang="ts" setup>
import ResizeCard from '@/components/ResizeCard.vue'
import EchartsCard from '@/components/EchartsCard.vue'
import * as echarts from 'echarts'
import { ref } from 'vue'

const options = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient:'vertical',
    left: 'left',
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ]
    }
  ]
})

function handleClick (e: echarts.ECElementEvent) {
  console.log(e)
}
</script>

<style lang="scss" scoped>
  
</style>
