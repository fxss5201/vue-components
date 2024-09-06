<template>
  <div>
    <video
      ref="videoRef"
      crossorigin="anonymous"
      controls
      @click="playing = !playing"
    ></video>
    <button @click="playing = !playing">
      Play / Pause
    </button>
    <pre style="background-color: darkturquoise;">{{ text }}</pre>
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
    type: 'video/webm',
  }
})

const {
  playing
} = controls

const text = reactive(controls)
</script>
