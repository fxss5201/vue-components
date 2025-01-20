import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileViewLayoutStore = defineStore('fileViewLayoutStore', () => {
  const fileViewContentHeight = ref<number>(0)
  function setFileViewContentHeight(val: number) {
    fileViewContentHeight.value = val
  }

  const fileReaderHeight = computed(() => {
    return fileViewContentHeight.value
  })

  return {
    fileViewContentHeight,
    setFileViewContentHeight,
    fileReaderHeight
  }
})
