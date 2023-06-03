<template><div></div></template>

<script lang="ts" setup>
import { onMounted, PropType } from "vue";
import fileSystem from "@/context/fileSystemController";

import ItemDialog from "@/models/ItemDialog";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

onMounted(async () => {
  if (props.itemDialog) {
    const flashData = await fileSystem.readFile(props.itemDialog?.path);
  }
});
</script>
