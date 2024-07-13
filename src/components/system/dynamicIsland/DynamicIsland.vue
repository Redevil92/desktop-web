<template>
  <div
    v-if="showDynamicIsland && dynamicItems.length > 0"
    class="dynamic-island"
    ref="dynamicIslandRef"
    :style="`left: calc(50% - ${dynamicIslandWidth / 2}px)`"
  >

  </div>
</template>

<script lang="ts" setup>
import { useDynamicIslandStore } from '@/stores/dynamicIslandStore'
import { computed,  ref, } from 'vue'

const dynamicIslandStore = useDynamicIslandStore()



const dynamicItemIndexSelected = ref(0)

const dynamicItems = computed(() => {
  return dynamicIslandStore.items
})

const selectedDynamicItem = computed(() => {
  return dynamicIslandStore.items[dynamicItemIndexSelected.value]
})

const showDynamicIsland = computed(() => {
  return dynamicIslandStore.showDynamicIsland
})



const dynamicIslandRef = ref<HTMLElement | null>(null)



const dynamicIslandWidth = computed(() => {
  if (dynamicIslandRef.value) {
    return dynamicIslandRef.value.clientWidth
  }
  return 200
})
</script>

<style scoped>
.dynamic-island {
  position: fixed;
  top: 10px;
  width: 200px;
  height: 40px;
  border-radius: 20px;
  background-color: black;
}
</style>
