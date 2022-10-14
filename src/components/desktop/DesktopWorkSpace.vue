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
        <div v-for="(item, index) in desktopFiles" :key="`${item.i}-${index}`">
          <DesktopFileItem :ref="item.path + 'FileRef'" :fileItem="item" />
        </div>
      </div>
    </SelectionBoxZone>
  </DropExternalFileZone>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, reactive, computed } from "vue";
import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import DesktopFileItem from "@/components/desktop/DesktopFileItem.vue";
import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";
import SelectionBoxZone from "@/components/shared/SelectionBoxZone.vue";
import DesktopItem from "@/models/DesktopItem";
import { useStore } from "vuex";
import { DESKTOP_PATH } from "@/constants";
import { isDir } from "@/context/fileSystemController";

import { useSettingsStore } from "@/stores/settingsStore";

export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<DesktopItem[]>,
  },
  components: { DesktopFileItem, DropExternalFileZone, SelectionBoxZone },
  emits: ["onFileItemPositionChange"],
  setup() {
    const store = useStore();

    const settingsStore = useSettingsStore();

    const { moveFilesInFolder } = useMoveFiles();

    const desktopRef = ref(null as unknown as HTMLElement);

    const desktopImage = computed((): string => {
      return settingsStore.desktopImage;
    });

    const selectedItemPaths = computed((): string[] => {
      return store.getters["fileSystem/"];
    });

    const isSelectionBoxEnabled = computed((): boolean => {
      return store.getters["fileSystem/GET_IS_SELECTION_BOX_ENABLED"];
    });

    const dropFilehandler = async (event: any, dropDestinationFileName = "") => {
      let isFolder = false;
      if (dropDestinationFileName) {
        isFolder = await isDir(dropDestinationFileName);
      }
      await moveFilesInFolder(event, dropDestinationFileName);
    };

    const setIsSelectionBoxEnabled = (isSelectionBoxEnabled: boolean) => {
      store.dispatch("fileSystem/SET_IS_SELECTION_BOX_ENABLED", isSelectionBoxEnabled);
    };

    const selectFile = (filesSelected: DesktopItem[]) => {
      store.dispatch("fileSystem/SET_SELECTED_DESKTOP_FILES", filesSelected);
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

      // const newSelectedDesktopItems = desktopPaths.filter((path) => {
      //   if (elementsSelectedNames.includes(getFileNameFromPath(path))) {
      //     return ;
      //   }
      // });
      // x y

      store.dispatch("fileSystem/SET_SELECTED_DESKTOP_FILES", elementsSelectedNames);
    };

    // TODO, look at this one
    const desktopFiles = computed(function (): DesktopItem[] {
      return store.getters["fileSystem/GET_DESKTOP_FILES"] as DesktopItem[];
    });

    const refreshFiles = async () => {
      await store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      await store.dispatch("fileSystem/FETCH_DESKTOP_ITEMS");
    };

    onMounted(async () => {
      refreshFiles();
    });

    return {
      desktopRef,
      desktopFiles,
      selectFile,
      selectedItemPaths,
      desktopImage,
      dropFilehandler,
      DESKTOP_PATH,
      selectItemsWithSelectionBox,
      isSelectionBoxEnabled,
      setIsSelectionBoxEnabled,
    };
  },
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
