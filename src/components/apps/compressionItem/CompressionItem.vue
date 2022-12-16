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
import { isDir, readFile } from "@/context/fileSystemController";
import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import PathAndContent from "@/models/PathAndContent";
import { TEMP_PATH } from "@/constants";
import DesktopItem from "@/models/DesktopItem";

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

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        let compressed = await readFile(props.itemDialog?.path);
        let buf = Buffer.from(removeDataUri(compressed), "base64");
        const decompressedFiles = fflate.unzipSync(buf);

        const decompressedFilesName = Object.keys(decompressedFiles);
        console.log(decompressedFilesName);
        decompressedFilesName.forEach(async (fileName) => {
          console.log("HEI", decompressedFiles[fileName]);
          const base64File = uint8ArrayToBase64(decompressedFiles[fileName]);
          // TODO: add data URI base on the file extension
          const filePath = `${TEMP_PATH}/${fileName}`;
          console.log(filePath, base64File);
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
