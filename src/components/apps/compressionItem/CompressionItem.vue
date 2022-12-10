<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">HI MSN</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    return {};
  },
});
</script>

<style scoped></style>
