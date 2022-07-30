<template>
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
import { defineComponent, onBeforeMount, onMounted, PropType, ref, watch } from "vue";

import ItemDialog from "@/models/ItemDialog";

import Editor from "@tinymce/tinymce-vue";
import { createFile, readFile } from "@/context/fileSystemController";
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
  components: { Editor },
  emits: [],
  setup(props, _) {
    const fileText = ref("");
    const isLoaded = ref(false);

    const saveFile = (content: any, html: any, body: any) => {
      console.log("SAVING", content.content, html, body);

      if (props.itemDialog?.name) {
        store.dispatch("fileSystem/UPDATE_FILE", {
          path: props.itemDialog?.name,
          content: content.content,
        } as PathAndContent);
        //createFile(props.itemDialog?.name, content.content);
      }
    };

    onBeforeMount(async () => {
      if (props.itemDialog?.name) {
        fileText.value = await readFile(props.itemDialog?.name);
        isLoaded.value = true;
      }
    });

    return { fileText, saveFile, isLoaded };
  },
});
</script>

<style scoped></style>
