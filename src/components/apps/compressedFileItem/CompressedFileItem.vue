<template>
  <div :style="` width: calc(100% -4px); height:${height - 5}px`">
    <SelectedFolderDialog
      v-if="showExtractHereDialog"
      @onFolderSelected="decompressFileAndSave"
      @closeDialog="showExtractHereDialog = false"
      :showSaveAsInput="false"
      actionButtonText="Extract"
    ></SelectedFolderDialog>

    <FolderItemsList
      :height="height - 10"
      :itemsList="items"
      :canRename="false"
      :isFocused="itemDialog?.isFocused"
      @onDoubleClick="doubleClickHandler"
      @onRightClick="rightClickItemHandler"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onUnmounted, PropType, ref } from "vue";

import SelectedFolderDialog from "@/components/shared/SelectedFolderDialog.vue";
import FolderItemsList from "@/components/apps/folderItem/FolderItemsList.vue";

import ItemDialog from "@/models/ItemDialog";
import fileSystem from "@/context/fileSystemController";
import { useFileSystemStore } from "@/stores/fileSystemStore";

import DesktopItem from "@/models/DesktopItem";
import ActionMenu from "@/models/ActionMenu/ActionMenu";
import useCompression from "@/hooks/useCompression";
import { TEMP_PATH } from "@/constants";
import { copyAction, openFileAction } from "@/components/system/actionMenu/actionsList";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, default: 200 },
});

const fileSystemStore = useFileSystemStore();
const { decompressFile, saveDecompressedFilesToDestination } = useCompression();
const items = ref<string[]>([]);
const showExtractHereDialog = ref<boolean>(false);

onBeforeMount(async () => {
  await decompressFileAndSave(TEMP_PATH);
  if (props.itemDialog?.additionalOptions?.showExtractHereDialog) {
    showExtractHereDialog.value = props.itemDialog.additionalOptions?.showExtractHereDialog;
  }
});

onUnmounted(async () => {
  for (const filePath of items.value) {
    await fileSystemStore.deleteFileSystemItem(filePath);
  }
});

const doubleClickHandler = async (filePath: string) => {
  const isDirectory = await fileSystem.isDir(filePath);
  if (isDirectory) {
    return;
  } else {
    const newItemDialog = {
      path: filePath,
      coordinates: { x: 0, y: 0 },
      isSelected: true,
    } as DesktopItem;

    await fileSystemStore.createItemDialog(newItemDialog);
  }
};

const decompressFileAndSave = async (destinationFile: string) => {
  if (props.itemDialog?.path) {
    let compressed = await fileSystem.readFile(props.itemDialog?.path);

    const decompressedFiles = decompressFile(compressed);

    //TODO: From the decompressed files delete the part of the path common to all the files
    // After that create the file structure, folders and paths. At the moment we have a flat structure

    const allCompressedFiles = await saveDecompressedFilesToDestination(decompressedFiles, destinationFile);
    //items.value = await getFiles(destinationFile); // TODO: this would be nice, now we have all the items flat in the directory
    items.value = allCompressedFiles;

    await fileSystemStore.refreshAllItemDialogFiles();
    await fileSystemStore.fetchDesktopItems();
    showExtractHereDialog.value = false;
  }
};

const rightClickItemHandler = (eventAndPath: { event: Event; filePath: string }) => {
  openActionMenu(eventAndPath.event, false, eventAndPath.filePath);
};

const openActionMenu = async (event: any, isOpenedFolder = false, customPath: string) => {
  event.preventDefault();
  event.stopPropagation();
  const pointerEvent = event as PointerEvent;

  const customActions = [copyAction([customPath], false, false), await openFileAction([customPath])];

  fileSystemStore.setActionMenu({
    show: true,
    paths: customPath ? [customPath] : [props.itemDialog?.path],
    position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
    customLayout: customActions,
  } as ActionMenu);
};
</script>

<style scoped></style>
