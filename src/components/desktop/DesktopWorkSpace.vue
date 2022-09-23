<template>
  <DropExternalFileZone :dropPath="DESKTOP_PATH">
    <SelectionBoxZone
      :isEnabled="isSelectionBoxEnabled"
      itemsToSelectClass="desktop-item"
      @onSelectingItems="selectItemsWithSelectionBox"
    >
      <div
        @mousedown="selectFile($event, {})"
        @drop="dropFilehandler($event, DESKTOP_PATH)"
        @dragover.prevent
        @dragenter.prevent
        ref="desktopRef"
        class="desktop-container"
      >
        <!-- Implement draggable files, move in desktop just when drag end! Otherwise move in another folder 
                or do nothing -->

        <div
          v-for="(item, index) in desktopFiles"
          :key="`${item.i}-${index}`"
          draggable="true"
          @drop.stop="dropFilehandler($event, item.name)"
          @dragstart="
            {
              setFilesToMove(selectedItemPaths);
              isSelectionBoxEnabled = false;
            }
          "
          @dragend="isSelectionBoxEnabled = true"
        >
          <DesktopFileItem :ref="item.name + 'FileRef'" :fileItem="item" :isSelected="isItemSelected(item.name)" />
        </div>
      </div>
    </SelectionBoxZone>
  </DropExternalFileZone>
</template>
<script lang="ts">
import { defineComponent, PropType, onMounted, ref, reactive, computed, onDeactivated } from "vue";
import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import { GridItem, GridLayout } from "vue3-grid-layout";
import DesktopFileItem from "@/components/desktop/DesktopFileItem.vue";
import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";
import SelectionBoxZone from "@/components/shared/SelectionBoxZone.vue";
import DesktopItem from "@/models/DesktopItem";
import { useStore } from "vuex";
import { DESKTOP_PATH } from "@/constants";
import Coordinates from "@/models/Coordinates";
import { isDir } from "@/context/fileSystemController";
import { getFileNameFromPath } from "@/context/fileSystemUtils";
export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<DesktopItem[]>,
  },
  components: { GridLayout, GridItem, DesktopFileItem, DropExternalFileZone, SelectionBoxZone },
  emits: ["onFileItemPositionChange"],
  setup() {
    const store = useStore();
    const { moveFilesInFolder, setFilesToMove, isChangingFilePosition } = useMoveFiles();
    const desktopRef = ref(null as unknown as HTMLElement);
    const isSelectionBoxEnabled = ref(true);
    const desktopFilesWithPosition = ref([] as unknown as DesktopItem[]);
    const selectedItemPaths = computed((): string[] => {
      return store.getters["fileSystem/GET_SELECTED_DESKTOP_FILE_PATHS"];
    });
    // TODO: use hook for this methods, drag start, move files etc...
    const dropFilehandler = async (event: any, dropDestinationFileName = "") => {
      let isFolder = false;
      if (dropDestinationFileName) {
        isFolder = await isDir(dropDestinationFileName);
      }
      await moveFilesInFolder(event, dropDestinationFileName);
    };

    const selectFile = (newFileSelected: DesktopItem) => {
      console.log("selecting", newFileSelected);
      //TODO, if the file is already selected maybe we shoudl start to drag it with the other selected
      //TODO, maybe create a hook for all these actions (selection, drag, etc)
      store.dispatch("fileSystem/SET_SELECTED_DESKTOP_FILE_PATHS", [newFileSelected.name]);
    };

    const selectItemsWithSelectionBox = (selectedElements: Element[]) => {
      const desktopPaths = store.getters["fileSystem/GET_DESKTOP_FILES"] as string[];
      const elementsSelectedNames = [].slice.call(selectedElements).map((element: Element) => element.textContent);
      const newSelectedPaths = desktopPaths.filter((path) => {
        if (elementsSelectedNames.includes(getFileNameFromPath(path))) {
          return path;
        }
      });
      store.dispatch("fileSystem/SET_SELECTED_DESKTOP_FILE_PATHS", newSelectedPaths);
    };
    const isItemSelected = (fileItem: string) => {
      return selectedItemPaths.value.includes(fileItem);
    };

    // TODO, look at this one
    const desktopFiles = computed(function (): DesktopItem[] {
      const desktopStringFiles = reactive(store.getters["fileSystem/GET_DESKTOP_FILES"]);
      let desktopFileItems = [];

      // get from local storage (through the store) the desktop file positions
      // if no position put it in 0,0
      const retrievedObject = localStorage.getItem("desktopItemsPositions");

      console.log("HHHH", retrievedObject);

      let desktopItemsPositions = {} as any;
      if (retrievedObject) {
        desktopItemsPositions = JSON.parse(retrievedObject);
      }
      if (desktopStringFiles && desktopStringFiles.length > 0) {
        desktopFileItems = desktopStringFiles.map((fileName: string, index: number) => {
          let coordinates = { x: 0, y: 0 } as Coordinates;
          console.log("HIHI", desktopItemsPositions, fileName);
          if (desktopItemsPositions && desktopItemsPositions[fileName]) {
            coordinates = desktopItemsPositions[fileName];
          }
          return {
            coordinates,
            name: fileName,
          } as DesktopItem;
        });
      }

      return desktopFileItems;
    });
    const refreshFiles = async () => {
      await store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      await store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
    };
    onMounted(async () => {
      refreshFiles();
    });
    return {
      desktopRef,
      desktopFiles,
      selectFile,
      selectedItemPaths,
      isItemSelected,
      dropFilehandler,
      setFilesToMove,
      DESKTOP_PATH,
      selectItemsWithSelectionBox,
      isSelectionBoxEnabled,
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
  background-image: url("/src/assets/desktopImages/mountain.png");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
