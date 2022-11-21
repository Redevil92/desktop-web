<template>
  <div class="dynamic-island" ref="dynamicIslandRef" :style="`left: calc(50% - ${dynamicIslandWidth / 2}px)`">
    <div>{{ dynamicItems.length }}</div>
    <component v-if="showDynamic" :is="asyncComponent" :height="30"></component>
  </div>
</template>

<script lang="ts">
import { useDynamicIslandStore } from "@/stores/dynamicIslandStore";
import { computed, defineAsyncComponent, defineComponent, onMounted, ref, watch } from "vue";

import LoadingComponent from "@/components/shared/LoadingComponent.vue";
import ErrorComponent from "@/components/shared/ErrorComponent.vue";

export default defineComponent({
  props: {},
  components: {},
  setup() {
    const dynamicIslandStore = useDynamicIslandStore();

    const asyncComponent = ref({} as any);

    const showDynamic = ref(false);

    const dynamicItems = computed(() => {
      return dynamicIslandStore.items;
    });

    watch(dynamicItems.value, function () {
      console.log("HERE");
      if (dynamicItems.value.length > 0) {
        loadAndSetAsyncComponent(dynamicItems.value[0].componentPath);
      }
    });

    const dynamicIslandRef = ref<HTMLElement | null>(null);

    const loadAndSetAsyncComponent = (componentName: string) => {
      asyncComponent.value = defineAsyncComponent({
        loader: () => import("@/components/apps/" + componentName),
        loadingComponent: LoadingComponent,
        delay: 200,
        errorComponent: ErrorComponent,
        timeout: 3000,
      });
      showDynamic.value = true;
    };

    const dynamicIslandWidth = computed(() => {
      if (dynamicIslandRef.value) {
        return dynamicIslandRef.value.clientWidth;
      }
      return 200;
    });

    return { dynamicIslandWidth, dynamicItems, asyncComponent, showDynamic };
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
