<template>
  <div :style="`height: ${height - 5}px; width: ${itemDialog.dimension.width - 4}px; `">
    <editor
      class="mce-editor"
      api-key="yxb2ealwgpgr85gcgcl311khnyuz4abs13akcuyqscr4y6fr"
      :init="{
        plugins: 'lists link image table code help wordcount',
        height: '100%',
        resize: false,
      }"
      :initial-value="fileText"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

import ItemDialog from "@/models/ItemDialog";

import Editor from "@tinymce/tinymce-vue";
import { readFile } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: {
      type: Number,
      default: 100,
    },
  },
  components: { Editor },
  emits: [],
  setup(props, _) {
    const fileText = ref("");

    if (props.itemDialog?.name) {
      fileText.value = readFile(props.itemDialog?.name);
    }

    return { fileText };
  },
});
</script>

<style scoped></style>
