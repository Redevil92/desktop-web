<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <editor
      :init="{
        plugins: 'lists link image table code help wordcount',
      }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";

import Editor from "@tinymce/tinymce-vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { Editor },
  emits: [],
  setup(props, _) {
    return {};
  },
});
</script>

<style scoped></style>
