<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 4" />
    <iframe
      class="frame"
      :height="height - 4"
      :width="itemDialog.dimension.width - 4"
      title="dos-player"
      :src="gameLink"
    />
  </div>
</template>

<script lang="ts" setup>
import ItemDialog from "@/models/ItemDialog";

import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import { onMounted, PropType, ref } from "vue";
import { dosGameLinks } from "@/components/apps/dosItem/DosGames";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true },
});

const gameLink = ref("");

onMounted(() => {
  if (props.itemDialog?.name) {
    props.itemDialog.isFocused;
    gameLink.value = dosGameLinks[props.itemDialog.name];
  }
});
</script>

<style scoped>
.frame {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style>

<!-- NEW VERSION WITH DOS EMULATOR -->

<!-- <template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <div style="height: 100%; width: 100%" ref="rootRef"></div>
  </div>
</template>

<script lang="ts" setup>
import ItemDialog from "@/models/ItemDialog";

import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import { onMounted, PropType, ref } from "vue";
import { dosGameLinks } from "@/components/apps/dosItem/DosGames";

import { DosPlayer as Instance, DosPlayerFactoryType } from "js-dos";
declare const Dos: DosPlayerFactoryType;

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true },
});

const rootRef = ref<HTMLDivElement | null>(null);
const dos = ref<Instance | null>(null);
const gameLink = ref("");

onMounted(() => {
  if (!rootRef.value) {
    return;
  }
  gameLink.value = dosGameLinks[props.itemDialog.name];
  const root = rootRef.value;
  const instance = Dos(root);
  dos.value = instance;
  const diggerUrl = `/digger.jsdos`;
  console.log(diggerUrl);
  if (dos.value) dos.value.run(diggerUrl);
});
</script>

<style scoped src="./js-dos.css">
.frame {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style> -->
