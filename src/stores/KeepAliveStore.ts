import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useKeepAliveStore = defineStore('keepAlive', () => {
  const componentNames = ref<string[]>([])
  
  function addComponentName(name: string) {
    if (componentNames.value.includes(name)) {
      return
    }
    componentNames.value.push(name)
  }

  function removeComponentName(name: string) {
    componentNames.value = componentNames.value.filter((item) => {
      return item !== name
    })
  }

  return { componentNames, addComponentName, removeComponentName }
})
