<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <!-- <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 4" />
    <iframe
      class="frame"
      :height="height - 4"
      :width="itemDialog.dimension.width - 4"
      title="dos-player"
      :src="gameLink"
    /> -->
    <div style="height: 100%; width: 100%" ref="rootRef"></div>
  </div>
</template>

<script lang="ts" setup>
import ItemDialog from "@/models/ItemDialog";

import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import { onMounted, PropType, ref } from "vue";
import { dosGameLinks } from "@/components/apps/dosItem/DosGames";

import { DosPlayer as Instance, DosPlayerFactoryType } from "js-dos";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true },
});

const rootRef = ref<HTMLDivElement | null>(null);

const gameLink = ref("");

onMounted(() => {
  // if (props.itemDialog?.name) {
  //   props.itemDialog.isFocused;
  //   gameLink.value = dosGameLinks[props.itemDialog.name];
  // }
});
</script>

<style scoped>
.frame {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style>
