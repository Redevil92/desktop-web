<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <FolderItemsList
      :itemsList="items"
      :canRename="false"
      :isFocused="itemDialog.isFocused"
      @onDoubleClick="doubleClickHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onDeactivated, onMounted, PropType, ref } from "vue";

import FolderItemsList from "@/components/apps/folderItem/FolderItemsList.vue";

import ItemDialog from "@/models/ItemDialog";
import * as fflate from "fflate";
import { getStat, isDir, readFile } from "@/context/fileSystemController";
import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import PathAndContent from "@/models/PathAndContent";
import { TEMP_PATH } from "@/constants";
import DesktopItem from "@/models/DesktopItem";
import { getFileExtensionFromName, MIME_TYPES } from "@/context/fileSystemUtils";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { FolderItemsList },
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();
    const { removeDataUri, utf8ToB64, uint8ArrayToBase64 } = useBase64Handler();
    const items = ref<string[]>([]);

    const bufferToBlob = (buffer: Uint8Array, type?: string): Blob => {
      return new Blob([buffer], type ? { type } : undefined);
    };

    const typedArrayToBuffer = (array: Uint8Array): ArrayBuffer => {
      return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
    };

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        let compressed = await readFile(props.itemDialog?.path);
        let buf = Buffer.from(removeDataUri(compressed), "base64");
        const decompressedFiles = fflate.unzipSync(buf);

        const decompressedFilesName = Object.keys(decompressedFiles);
        decompressedFilesName.forEach(async (fileName) => {
          const mimeType = MIME_TYPES[getFileExtensionFromName(fileName)];
          const base64File = `data:${mimeType};base64,${uint8ArrayToBase64(decompressedFiles[fileName])}`;
          const filePath = `${TEMP_PATH}/${fileName}`;
          const pathAndContent: PathAndContent = { path: filePath, content: base64File };
          await fileSystemStore.createFile(pathAndContent);
          items.value.push(filePath);
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

    return { items, doubleClickHandler };
  },
});
</script>

<style scoped></style>
