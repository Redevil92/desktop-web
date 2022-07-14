<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <img
      :src="`${imageFile}`"
      :height="height - 15"
      :width="itemDialog.dimension.width - 6"
      alt=""
      class="file-image"
    />
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
      imageFile.value = readFile(props.itemDialog?.name).toString();
      console.log(imageFile.value);
    }

    return { imageFile };
  },
});
</script>

<style scoped>
.file-image {
  object-fit: cover;
}
</style>
