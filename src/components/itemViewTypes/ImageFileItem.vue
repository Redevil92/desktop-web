<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <img :src="imageFile" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const imageFile = ref("");

    if (props.itemDialog?.name) {
      imageFile.value = readFile(props.itemDialog?.name);
      console.log(imageFile.value);
    }

    return { imageFile };
  },
});
</script>

<style scoped></style>
