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
        class="desktop-container"
        :style="{ 'background-image': 'url(' + require('/src/assets/desktopImages/' + desktopImage) + ')' }"
      >
        <div v-for="item in desktopFiles" :key="`desktop-item-${item.path}`">
          <DesktopFileItem :ref="item.path + 'FileRef'" :fileItem="item" />
        </div>
      </div>
    </SelectionBoxZone>
  </DropExternalFileZone>
</template>

<script lang="ts" setup>
import { PropType, onMounted, ref, reactive, computed } from "vue";
import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import DesktopFileItem from "@/components/system/desktop/DesktopFileItem.vue";
import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";
import SelectionBoxZone from "@/components/shared/SelectionBoxZone.vue";
import DesktopItem from "@/models/DesktopItem";
import { DESKTOP_PATH } from "@/constants";
import { isDir } from "@/context/fileSystemController";

import { useSettingsStore } from "@/stores/settingsStore";
import { useFileSystemStore } from "@/stores/fileSystemStore";

const props = defineProps({
  msg: String,
  items: Array as PropType<DesktopItem[]>,
});

const emit = defineEmits(["onFileItemPositionChange"]);

const fileSystemStore = useFileSystemStore();
const settingsStore = useSettingsStore();

const { moveFilesInFolder } = useMoveFiles();

const desktopRef = ref(null as unknown as HTMLElement);

const desktopImage = computed((): string => {
  return settingsStore.desktopImage;
});

const isSelectionBoxEnabled = computed((): boolean => {
  return fileSystemStore.isSelectionBoxEnabled;
});

const dropFilehandler = async (event: any, dropDestinationFileName = "") => {
  let isFolder = false;
  if (dropDestinationFileName) {
    isFolder = await isDir(dropDestinationFileName);
  }
  await moveFilesInFolder(event, dropDestinationFileName);
};

const setIsSelectionBoxEnabled = (isSelectionBoxEnabled: boolean) => {
  fileSystemStore.setIsSelectionBoxEnabled(isSelectionBoxEnabled);
};

const selectFile = (filesSelected: DesktopItem[]) => {
  fileSystemStore.setSelectedDesktopFiles(filesSelected);
};

const selectItemsWithSelectionBox = (selectedElements: Element[]) => {
  //const desktopPaths = store.getters["fileSystem/GET_DESKTOP_FILES"] as string[];

  const elementsSelectedNames = [].slice.call(selectedElements).map((element: Element) => {
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
