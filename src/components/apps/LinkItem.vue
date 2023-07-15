<template><div></div></template>

<script lang="ts" setup>
import ItemDialog from "@/models/ItemDialog";
import { onBeforeMount, PropType } from "vue";
import fileSystem from "@/context/fileSystemController";

import LinkData from "@/models/LinkData";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import DesktopItem from "@/models/DesktopItem";

const fileSystemStore = useFileSystemStore();

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true },
});

onBeforeMount(async () => {
  const linkData: LinkData = JSON.parse(await fileSystem.readFile(props.itemDialog.path));

  const appToOpen: DesktopItem = {
    path: linkData.filePath || linkData.fileTypeToOpen || "",
    applicationExtension: linkData.fileTypeToOpen,
    coordinates: { x: 0, y: 0 },
    isSelected: true,
  };
  fileSystemStore.closeItemDialog(props.itemDialog.guid);
  await fileSystemStore.createItemDialog(appToOpen);
});
</script>
