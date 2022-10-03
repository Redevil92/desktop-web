<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <div class="system-header-container"></div>
    <hr />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    return {};
  },
});
</script>

<style scoped>
.system-header-container {
  height: 150px;
  padding: var(--margin);
}
</style>
