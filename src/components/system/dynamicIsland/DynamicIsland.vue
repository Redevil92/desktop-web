<template>
  <div class="dynamic-island" ref="dynamicIslandRef" :style="`left: calc(50% - ${dynamicIslandWidth / 2}px)`">
    <div>{{ dynamicItems.length }}</div>
  </div>
</template>

<script lang="ts">
import { useDynamicIslandStore } from "@/stores/dynamicIslandStore";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {},
  components: {},
  setup() {
    const dynamicIslandStore = useDynamicIslandStore();

    const dynamicItems = computed(() => {
      return dynamicIslandStore.items;
    });

    const dynamicIslandRef = ref<HTMLElement | null>(null);

    const dynamicIslandWidth = computed(() => {
      if (dynamicIslandRef.value) {
        return dynamicIslandRef.value.clientWidth;
      }
      return 200;
    });

    return { dynamicIslandWidth, dynamicItems };
  },
});
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
