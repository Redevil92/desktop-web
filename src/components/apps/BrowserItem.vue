<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">BROWSER</div>
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  emits: [],
  setup(props, _) {
    return {};
  },
});
</script>

<style scoped></style>
