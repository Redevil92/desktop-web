<template>
  <div :style="` width: calc(100% -4px); height:${height - 5}px`">
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

<script lang="ts">
import { defineComponent, onBeforeMount, onDeactivated, onMounted, PropType, ref } from "vue";
import FolderItemsList from "@/components/apps/folderItem/FolderItemsList.vue";
import ItemDialog from "@/models/ItemDialog";
import { isDir, readFile } from "@/context/fileSystemController";
import { useFileSystemStore } from "@/stores/fileSystemStore";

import DesktopItem from "@/models/DesktopItem";
import ActionMenu, { ActionItem } from "@/models/ActionMenu";
import useCompression from "@/hooks/useCompression";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: { type: Number, default: 200 },
  },
  components: { FolderItemsList },
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();
    const { decompressFile, getContentsFromDecompressedFile } = useCompression();
    const items = ref<string[]>([]);

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        let compressed = await readFile(props.itemDialog?.path);
        const decompressedFiles = decompressFile(compressed);

        const files = getContentsFromDecompressedFile(decompressedFiles);
        files.forEach(async (file) => {
          await fileSystemStore.createFile(file);
          items.value.push(file.path);
        });
      }
    });

    onDeactivated(async () => {
      items.value.forEach((filePath) => {
        fileSystemStore.deleteFileSystemItem(filePath);
      });
    });

    const doubleClickHandler = async (filePath: string) => {
      const isDirectory = await isDir(filePath);
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

    const rightClickItemHandler = (eventAndPath: { event: Event; filePath: string }) => {
      openActionMenu(eventAndPath.event, false, eventAndPath.filePath);
    };

    const openActionMenu = (event: any, isOpenedFolder = false, customPath?: string) => {
      event.preventDefault();
      event.stopPropagation();
      const pointerEvent = event as PointerEvent;

      fileSystemStore.setActionMenu({
        show: true,
        paths: customPath ? [customPath] : [props.itemDialog?.path],
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        customLayout: {},
      } as ActionMenu);
    };

    return { items, doubleClickHandler, rightClickItemHandler };
  },
});
</script>

<style scoped></style>
