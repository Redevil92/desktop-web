<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <div>
      <vue-pdf-embed :height="height - 14" :source="pdfSource"></vue-pdf-embed>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref } from "vue";

import VuePdfEmbed from "vue-pdf-embed";

import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { VuePdfEmbed },
  emits: [],
  setup(props, _) {
    const pdfSource = ref("");

    onBeforeMount(async () => {
      if (props.itemDialog?.name) {
        const file = await readFile(props.itemDialog?.name);
        pdfSource.value = file.toString();
      }
    });

    return { pdfSource };
  },
});
</script>

<style scoped></style>
