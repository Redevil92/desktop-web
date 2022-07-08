<template>
  <div :style="`height: ${height - 5}px; width: ${itemDialog.dimension.width - 4}px; `">
    <editor
      class="mce-editor"
      api-key="yxb2ealwgpgr85gcgcl311khnyuz4abs13akcuyqscr4y6fr"
      :init="{
        plugins: ['lists link image table code help wordcount'],
        height: '100%',
        resize: false,
        selector: 'textarea', // change this value according to your HTML
        plugins: 'save',

        menubar: false,
        toolbar:
          'save | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | \
           bullist numlist outdent indent | removeformat |',
      }"
      :initial-value="fileText"
      @saveContent="saveFile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

import ItemDialog from "@/models/ItemDialog";

import Editor from "@tinymce/tinymce-vue";
import { createFile, readFile } from "@/context/fileSystemController";

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

    const saveFile = (content: any, html: any, body: any) => {
      console.log("SAVING", content.content, html, body);

      if (props.itemDialog?.name) {
        createFile(props.itemDialog?.name, content.content);
      }
    };

    return { fileText, saveFile };
  },
});
</script>

<style scoped></style>
