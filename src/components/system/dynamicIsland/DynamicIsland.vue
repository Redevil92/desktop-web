<template>
  <div
    v-if="showDynamicIsland && dynamicItems.length > 0"
    class="dynamic-island"
    ref="dynamicIslandRef"
    :style="`left: calc(50% - ${dynamicIslandWidth / 2}px)`"
  >
    <!-- <component
      v-if="showDynamicIsland && selectedDynamicItem"
      :is="asyncComponent"
      :audioElement="(selectedDynamicItem as DynamicIslandAudioItem).audioElement"
      :height="30"
    ></component> -->
  </div>
</template>

<script lang="ts" setup>
import { useDynamicIslandStore } from '@/stores/dynamicIslandStore'
import { computed, defineAsyncComponent, defineComponent, ref, watch } from 'vue'

import LoadingComponent from '@/components/shared/LoadingComponent.vue'
import ErrorComponent from '@/components/shared/ErrorComponent.vue'
import { DynamicIslandAudioItem } from '@/models/DynamicIslandItem'

const dynamicIslandStore = useDynamicIslandStore()

const asyncComponent = ref({} as any)

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

// watch(dynamicItems.value, function () {
//   if (dynamicItems.value.length > 0) {
//     loadAndSetAsyncComponent(dynamicItems.value[dynamicItemIndexSelected.value].componentPath)
//   }
// })

const dynamicIslandRef = ref<HTMLElement | null>(null)

// const loadAndSetAsyncComponent = (componentName: string) => {
//   asyncComponent.value = defineAsyncComponent({
//     loader: () => import(/* @vite-ignore */ '@/components/apps/' + componentName),
//     loadingComponent: LoadingComponent,
//     delay: 200,
//     errorComponent: ErrorComponent,
//     timeout: 3000
//   })
//   dynamicIslandStore.setShowDynamicIsland(true)
// }

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
