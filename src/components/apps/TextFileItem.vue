<template>
  <SaveAsDialog
    v-if="showSaveAsDialog"
    @saveItem="saveTextFileHandler"
    @closeDialog="showSaveAsDialog = false"
    to="textFileItem"
  ></SaveAsDialog>
  <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 5" />
  <div id="textFileItem" :style="`height: ${height - 5}px; width: calc(100% -4px);`">
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
import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import Editor from "@tinymce/tinymce-vue";
import { readFile } from "@/context/fileSystemController";
import PathAndContent from "@/models/PathAndContent";
import { getFileNameFromPath } from "@/context/fileSystemUtils";
import { useLayoutStore } from "@/stores/layoutStore";
import { SEVERITY } from "@/constants";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import useBase64Handler from "@/hooks/useBase64Handler";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: {
      type: Number,
      default: 100,
    },
  },
  components: { Editor, SaveAsDialog, IFrameFocuser },
  emits: [],
  setup(props, _) {
    const layoutStore = useLayoutStore();
    const fileSystemStore = useFileSystemStore();
    const { isBase64, b64ToText } = useBase64Handler();

    const fileText = ref("");
    const isLoaded = ref(false);
    const showSaveAsDialog = ref(false);
    const fileContent = ref("");

    const saveFile = (content: any, html: any, body: any) => {
      console.log(content.content);
      if (props.itemDialog?.path) {
        fileSystemStore.updateFile({
          path: props.itemDialog?.path,
          content: content.content,
        } as PathAndContent);
      } else {
        fileContent.value = content.content;
        showSaveAsDialog.value = true;
      }
    };

    const saveTextFileHandler = async (destinationPath: string) => {
      const destinationPathToSave = destinationPath + ".txt";

      await fileSystemStore.createFile({ path: destinationPathToSave, content: fileContent.value });
      showSaveAsDialog.value = false;

      const itemDialogToUpdate = Object.assign({}, props.itemDialog);
      itemDialogToUpdate.name = getFileNameFromPath(destinationPathToSave);
      fileSystemStore.updateItemDialog(itemDialogToUpdate);

      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();

      layoutStore.setSnackBar({
        show: true,
        text: `"${getFileNameFromPath(destinationPathToSave)}" created.`,
        severity: SEVERITY.information,
      });
    };

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        const fileData = await readFile(props.itemDialog?.path);
        console.log("FILE DATA:", fileData);
        if (isBase64(fileData)) {
          console.log("IS BASEEE");
          fileText.value = b64ToText(fileData, true);
        } else {
          fileText.value = fileData;
        }

        console.log(fileText.value);
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
