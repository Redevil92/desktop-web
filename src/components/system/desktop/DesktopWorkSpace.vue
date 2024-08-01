<template>
  <DropExternalFileZone :dropPath="DESKTOP_PATH">
    <SelectionBoxZone
      :isEnabled="isSelectionBoxEnabled"
      itemsToSelectClass="desktop-item"
      @onSelectingItems="selectItemsWithSelectionBox"
    >
      <div
        @mousedown="selectFile([])"
        @drop="dropFilehandler($event, DESKTOP_PATH)"
        @dragover.prevent
        @dragenter.prevent
        ref="desktopRef"
      >
        <div v-for="item in desktopFiles" :key="`desktop-item-${item.path}`">
          <DesktopFileItem :ref="item.path + 'FileRef'" :fileItem="item" />
        </div>
        <div
          style="
            height: 100vh;
            width: 100vw;
            z-index: -1;
            pointer-events: none;
            user-select: none;
          "
        >
          <img
            style="height: inherit; background-size: cover"
            :src="`${desktopImage}`"
            alt=""
          />
        </div>
      </div>
    </SelectionBoxZone>
  </DropExternalFileZone>
</template>

<script lang="ts" setup>
import { PropType, onMounted, ref, computed, watch } from "vue";
import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import DesktopFileItem from "@/components/system/desktop/DesktopFileItem.vue";
import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";
import SelectionBoxZone from "@/components/shared/SelectionBoxZone.vue";
import DesktopItem from "@/models/DesktopItem";
import { DESKTOP_PATH } from "@/constants";
import fileSystem from "@/context/fileSystemController";

import { useSettingsStore } from "@/stores/settingsStore";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";

const props = defineProps({
  msg: String,
  items: Array as PropType<DesktopItem[]>,
});

const fileSystemStore = useFileSystemStore();
const settingsStore = useSettingsStore();

const { moveFilesInFolder } = useMoveFiles();
useKeyboardShortcut();

const desktopRef = ref(null as unknown as HTMLElement);
const desktopImage = ref("");

watch(
  () => settingsStore.desktopImagePath,
  () => {
    setDesktopImage();
  }
);

const setDesktopImage = async () => {
  const file = await fileSystem.readFile(settingsStore.desktopImagePath);
  desktopImage.value = file.toString();
};

// const desktopImageUrl = computed((): string => {
//   return new URL(`/src/assets/desktopImages/${settingsStore.desktopImage}`, import.meta.url).href
// })

const isSelectionBoxEnabled = computed((): boolean => {
  return fileSystemStore.isSelectionBoxEnabled;
});

const dropFilehandler = async (event: any, dropDestinationFileName = "") => {
  let isFolder = false;
  if (dropDestinationFileName) {
    isFolder = await fileSystem.isDir(dropDestinationFileName);
  }
  await moveFilesInFolder(event, dropDestinationFileName);
};

const selectFile = (filesSelected: DesktopItem[]) => {
  fileSystemStore.setSelectedDesktopFiles(filesSelected);
  fileSystemStore.setFocusedItemDialog(null);
};

const selectItemsWithSelectionBox = (selectedElements: Element[]) => {
  const elementsSelectedNames = [].slice
    .call(selectedElements)
    .map((element: Element) => {
      const clientRect = element.getBoundingClientRect();

      return {
        path: DESKTOP_PATH + "/" + element.textContent,
        coordinates: { x: clientRect.x, y: clientRect.y },
      } as DesktopItem;
    });
  fileSystemStore.setSelectedDesktopFiles(elementsSelectedNames);
};

const desktopFiles = computed(function (): DesktopItem[] {
  return fileSystemStore.desktopItems;
});

const refreshFiles = async () => {
  await fileSystemStore.refreshAllItemDialogFiles();
  await fileSystemStore.fetchDesktopItems();
};

onMounted(async () => {
  refreshFiles();
  setDesktopImage();
});
</script>

<style scoped>
.actions-dialog {
  border: 1px solid red;
  position: absolute;
  top: 160px;
  left: 600px;
  z-index: 1;
}

.action-button {
  cursor: pointer;
}

.desktop-container {
  height: 100vh;
  width: 100vw;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
