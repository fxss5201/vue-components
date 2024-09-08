import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuCollapseStore = defineStore('menuCollapse', () => {
  const menuCollapse = ref(false)
  function toggleMenuCollapse() {
    menuCollapse.value = !menuCollapse.value
  }

  return { menuCollapse, toggleMenuCollapse }
})
