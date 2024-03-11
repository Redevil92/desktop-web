<template>
  <SelectedFolderDialog
    v-if="showSaveAsDialog"
    @onFolderSelected="saveTextFileHandler"
    @closeDialog="showSaveAsDialog = false"
    to="mdFileItem"
    :showSaveAsInput="true"
  ></SelectedFolderDialog>
  <div id="mdFileItem" @click.stop :style="`height: ${height - 5}px; width: calc(100% -4px); `">
    <MdEditor
      class="border-bottom-radius"
      @onSave="saveFile"
      @onUploadImg="uploadImageHandler"
      codeTheme="github"
      language="en-US"
      style="height: 100%"
      v-model="mdText"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, onUnmounted, PropType } from 'vue';
import ItemDialog from '@/models/ItemDialog';
import SelectedFolderDialog from '@/components/shared/SelectedFolderDialog.vue';

import fileSystem from '@/context/fileSystemController';

import useBase64Handler from '@/hooks/useBase64Handler';
import { useFileSystemStore } from '@/stores/fileSystemStore';
import PathAndContent from '@/models/PathAndContent';

import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { getFileNameFromPath } from '@/context/utils/fileSystemUtils';
import { useLayoutStore } from '@/stores/layoutStore';
import { SEVERITY } from '@/constants';

//TODO: implement create new md file on save (like text file)

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true }
});

const layoutStore = useLayoutStore();

const fileSystemStore = useFileSystemStore();
const { b64ToText, utf8ToB64, fileToBase64 } = useBase64Handler();

const showSaveAsDialog = ref(false);
const mdText = ref('');

const saveFile = () => {
  if (props.itemDialog?.path) {
    fileSystemStore.updateFile({
      path: props.itemDialog?.path,
      content: utf8ToB64(mdText.value)
    } as PathAndContent);
  } else {
    showSaveAsDialog.value = true;
  }
};

const saveTextFileHandler = async (destinationPath: string) => {
  const destinationPathToSave = destinationPath + '.md';

  await fileSystemStore.createFile({
    path: destinationPathToSave,
    content: utf8ToB64(mdText.value)
  });
  showSaveAsDialog.value = false;

  const itemDialogToUpdate = { ...props.itemDialog };
  itemDialogToUpdate.name = getFileNameFromPath(destinationPathToSave);
  itemDialogToUpdate.path = destinationPathToSave;
  fileSystemStore.updateItemDialog(itemDialogToUpdate);

  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();

  layoutStore.setSnackBar({
    show: true,
    text: `"${getFileNameFromPath(destinationPathToSave)}" created.`,
    severity: SEVERITY.information
  });
};

const uploadImageHandler = async (files: File[], callback: any) => {
  // save file in base 64 inside the md file itself
  const file = files[0];

  const base64String = await fileToBase64(file);
  mdText.value += `\n![${file.name}](${base64String})\n`;
  console.log(base64String);
};

const keyDownHandler = async (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 's' && props.itemDialog.isFocused) {
    event.preventDefault();
    saveFile();
  }
};

onBeforeMount(async () => {
  if (props.itemDialog?.path) {
    let codeBase64 = await fileSystem.readFile(props.itemDialog?.path);

    mdText.value = b64ToText(codeBase64, true);
  }
});

onMounted(() => {
  window.addEventListener('keydown', keyDownHandler);
});

onUnmounted(() => {
  window.removeEventListener('keydown', keyDownHandler);
});
</script>
<style scoped>
.border-bottom-radius {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style>
