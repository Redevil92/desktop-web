<template>
  <div :style="`height: ${height - 5}px; width: ${itemDialog.dimension.width - 4}px; `">
    <editor
      class="mce-editor"
      v-if="height"
      api-key="yxb2ealwgpgr85gcgcl311khnyuz4abs13akcuyqscr4y6fr"
      :init="{
        plugins: 'lists link image table code help wordcount',
        height: '100%',
        resize: false,
      }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

import ItemDialog from "@/models/ItemDialog";

import Editor from "@tinymce/tinymce-vue";

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
    return {};
  },
});
</script>

<style scoped>
.mce-editor + div {
  border: 5px solid red;
}

.mce-editor div div {
  border: 5px solid red;
}
</style>
