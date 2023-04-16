<template><div></div></template>

<script lang="ts" setup>
import { onMounted, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

onMounted(async () => {
  if (props.itemDialog) {
    const flashData = await readFile(props.itemDialog?.path);
  }
});
</script>
