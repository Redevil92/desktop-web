<template>
  <SelectedFolderDialog
    v-if="showSaveAsDialog"
    @onFolderSelected="saveTextFileHandler"
    @closeDialog="showSaveAsDialog = false"
    to="textFileItem"
    :showSaveAsInput="true"
  ></SelectedFolderDialog>
  <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 5" />
  <div id="textFileItem" :style="`height: ${height - 5}px; width: calc(100% -4px);`">
    <editor
      v-if="isLoaded"
      class="mce-editor"
      api-key=""
      :init="{
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

<script lang="ts" setup>
import { onBeforeMount, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import SelectedFolderDialog from "@/components/shared/SelectedFolderDialog.vue";
import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import Editor from "@tinymce/tinymce-vue";
import { readFile } from "@/context/fileSystemController";
import PathAndContent from "@/models/PathAndContent";
import { getFileNameFromPath } from "@/context/fileSystemUtils";
import { useLayoutStore } from "@/stores/layoutStore";
import { SEVERITY } from "@/constants";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import useBase64Handler from "@/hooks/useBase64Handler";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: {
    type: Number,
    required: true,
  },
});

const layoutStore = useLayoutStore();
const fileSystemStore = useFileSystemStore();
const { isBase64, b64ToText, utf8ToB64 } = useBase64Handler();

const fileText = ref("");
const isLoaded = ref(false);
const showSaveAsDialog = ref(false);
const fileContent = ref("");

const saveFile = (content: any, _html: any, _body: any) => {
  if (props.itemDialog?.path) {
    fileSystemStore.updateFile({
      path: props.itemDialog?.path,
      content: utf8ToB64(content.content),
    } as PathAndContent);
  } else {
    fileContent.value = content.content;
    showSaveAsDialog.value = true;
  }
};

const saveTextFileHandler = async (destinationPath: string) => {
  const destinationPathToSave = destinationPath + ".txt";

  await fileSystemStore.createFile({ path: destinationPathToSave, content: utf8ToB64(fileContent.value) });
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
    console.log(fileData, 1, isBase64(fileData));

    fileText.value = b64ToText(fileData, true);

    isLoaded.value = true;
  } else {
    fileText.value = "";
    isLoaded.value = true;
  }
});
</script>

<style scoped></style>
