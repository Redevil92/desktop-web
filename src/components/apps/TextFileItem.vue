<template>
  <SaveAsDialog></SaveAsDialog>

  <div :style="`height: ${height - 5}px; width: ${itemDialog.dimension.width - 4}px; `">
    <editor
      v-if="isLoaded"
      class="mce-editor"
      api-key=""
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
import { defineComponent, onBeforeMount, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import SaveAsDialog from "@/components/shared/SaveAsDialog.vue";

import Editor from "@tinymce/tinymce-vue";
import { readFile } from "@/context/fileSystemController";
import store from "@/store";
import PathAndContent from "@/models/PathAndContent";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: {
      type: Number,
      default: 100,
    },
  },
  components: { Editor, SaveAsDialog },
  emits: [],
  setup(props, _) {
    const fileText = ref("");
    const isLoaded = ref(false);

    const saveFile = (content: any, html: any, body: any) => {
      if (props.itemDialog?.path) {
        store.dispatch("fileSystem/UPDATE_FILE", {
          path: props.itemDialog?.path,
          content: content.content,
        } as PathAndContent);
        //createFile(props.itemDialog?.path, content.content);
      } else {
        alert("This functionalitz should be implemented, TextFileItem.vue");
        // new file, to save in some places
        // open a dialog to save the file
        // update the item dialog with the path
      }
    };

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        fileText.value = await readFile(props.itemDialog?.path);
        isLoaded.value = true;
      } else {
        fileText.value = "";
        isLoaded.value = true;
      }
    });

    return { fileText, saveFile, isLoaded };
  },
});
</script>

<style scoped></style>
