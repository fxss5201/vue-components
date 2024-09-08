<template>
  <div>
    <video ref="videoRef" crossorigin="anonymous" controls @click="playing = !playing"></video>
    <div style="margin: 10px 0">
      <ElButton @click="playing = !playing">{{ playing ? '暂停' : '播放' }}</ElButton>
    </div>
    <pre style="background-color: darkturquoise">{{ text }}</pre>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMediaControls } from '@vueuse/core'
import videoSrc from './../assets/video/flower.webm'

const videoRef = ref<HTMLVideoElement>()
const controls = useMediaControls(videoRef, {
  src: {
    src: videoSrc,
    type: 'video/webm'
  }
})

const { playing } = controls

const text = reactive(controls)
</script>
