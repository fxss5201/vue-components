<template>
  <MarkdownCard :content="ResizeCardMd" />
  <div style="height: 10000px;">
    <ResizeCard
      :isResize="form.isResize"
      @resize="resizeFn">
      <div style="padding: 16px;">
        <el-form :model="form" label-width="auto">
          <el-form-item label="是否可改变大小" prop="length">
            <el-checkbox v-model="form.isResize" />
          </el-form-item>
        </el-form>
      </div>
    </ResizeCard>
  </div>
</template>

<script lang="ts" setup>
import ResizeCard from '@/components/ResizeCard.vue'
import { ref } from 'vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import ResizeCardMd from '@/md/ResizeCard.md?raw'

const form = ref({
  isResize: true
})

function resizeFn (value: { width: number; height: number }) {
  console.log('resizeFn', value)
}
</script>
