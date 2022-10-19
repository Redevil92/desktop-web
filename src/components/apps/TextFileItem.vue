<template>
  <SaveAsDialog
    v-if="showSaveAsDialog"
    @saveItem="saveTextFileHandler"
    @closeDialog="showSaveAsDialog = false"
    to="textFileItem"
  ></SaveAsDialog>

  <div id="textFileItem" :style="`height: ${height - 5}px; width: ${itemDialog.dimension.width - 4}px; `">
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
import { defineComponent, onBeforeMount, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import SaveAsDialog from "@/components/shared/SaveAsDialog.vue";

import Editor from "@tinymce/tinymce-vue";
import { readFile } from "@/context/fileSystemController";
import store from "@/store";
import PathAndContent from "@/models/PathAndContent";
import NameAndDestinationPath from "@/models/NameAndDestinationPath";

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
    const showSaveAsDialog = ref(false);
    const fileContent = ref("");

    const saveFile = (content: any, html: any, body: any) => {
      if (props.itemDialog?.path) {
        store.dispatch("fileSystem/UPDATE_FILE", {
          path: props.itemDialog?.path,
          content: content.content,
        } as PathAndContent);
      } else {
        fileContent.value = content.content;
        showSaveAsDialog.value = true;
      }
    };

    const saveTextFileHandler = async (destinationPath: string) => {
      await store.dispatch("fileSystem/CREATE_FILE", { path: destinationPath + ".txt", content: fileContent.value });
      showSaveAsDialog.value = false;
      // TODO, show snackbar
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

    return { fileText, saveFile, isLoaded, showSaveAsDialog, saveTextFileHandler };
  },
});
</script>

<style scoped></style>
