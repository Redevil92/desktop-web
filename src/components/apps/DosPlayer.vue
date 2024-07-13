<template>
  <div :style="`height: ${height - 5}px; width: calc(100% -4px); `">
    <div class="dos-container" id="jsdos" ref="rootRef"></div>
  </div>
</template>

<script lang="ts" setup>
import ItemDialog from '@/models/ItemDialog';

import { onMounted, PropType, ref } from 'vue';
import { DosPlayer as Instance, DosPlayerFactoryType } from 'js-dos';

declare const Dos: DosPlayerFactoryType;

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true }
});

const rootRef = ref<HTMLDivElement | null>(null);
const dos = ref<Instance | null>(null);

onMounted(async () => {
  if (!rootRef.value) {
    return;
  }
  const instance = Dos(rootRef.value);
  dos.value = instance;

  const gameUrl = `/Program Files/js-dos/games/${props.itemDialog.name}.jsdos`;
  setTimeout(async () => {
    if (dos.value) await dos.value.run(gameUrl);
  }, 1000);
});
</script>

<style scoped>
.dos-container {
  height: 100%;
  width: 100%;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style>
