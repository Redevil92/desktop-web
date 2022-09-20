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

        <div>{{ desktopFiles.length }}</div>
        <div
          v-for="(item, index) in desktopFilesWithPosition"
          :key="`${item.i}-${index}`"
          draggable="true"
          class="desktop-item"
          :style="`top: ${item.coordinates.y}px; left: ${item.coordinates.x}px`"
          @mousedown.stop="
            {
              selectFile(item);
              startMoveItem($event);
            }
          "
          @click.right="openActionMenu($event, item)"
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
import ActionMenu from "@/models/ActionMenu";
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

    const saveNewFileItemPosition = async (file: DesktopItem) => {
      const retrievedObject = localStorage.getItem("desktopItemsPositions");
      let desktopItemsPositions = {} as any;
      if (retrievedObject) {
        desktopItemsPositions = JSON.parse(retrievedObject);
      }
      // desktopItemsPositions[itemName] = { x: event.clientX, y: event.clientY } as Coordinates;
      desktopItemsPositions[file.name] = file.coordinates;
      localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));
    };

    const selectFile = (newFileSelected: DesktopItem) => {
      console.log("selecting", newFileSelected);

      //TODO, if the file is already selected maybe we shoudl start to drag it with the other selected
      //TODO, maybe create a hook for all these actions (selection, drag, etc)
      store.dispatch("fileSystem/SET_SELECTED_DESKTOP_FILE_PATHS", [newFileSelected.name]);
    };

    const startMoveItem = (e: any) => {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:

      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:

      document.onmousemove = elementDrag;
    };

    async function closeDragElement() {
      for (const fileName of selectedItemPaths.value) {
        //TODO get desktopfile from fileName and save the coordinates
        const fileToUpdatePosition = desktopFilesWithPosition.value.find((file) => file.name === fileName);
        if (fileToUpdatePosition) {
          saveNewFileItemPosition(fileToUpdatePosition);
        }
      }
      await refreshFiles();

      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();

      const newX = e.clientX;
      const newY = e.clientY;

      const newPosition = { x: newX, y: newY } as Coordinates;

      //TODO selectedItemPaths.value -> chnage the position of these elements, we should take the dekstopItems from desktopFilesWithPosition
      selectedItemPaths.value.forEach((itemPath: string) => {
        const fileToUpdateCoordinate = desktopFilesWithPosition.value.find((item) => item.name === itemPath);
        if (fileToUpdateCoordinate) {
          fileToUpdateCoordinate.coordinates = newPosition;
        }
      });

      //saveNewFileItemPosition(newPosition);
    }

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

    const openActionMenu = (event: any, item: DesktopItem) => {
      event.preventDefault();
      event.stopPropagation();
      const pointerEvent = event as PointerEvent;
      selectFile(item);
      store.dispatch("fileSystem/SET_ACTION_MENU", {
        show: true,
        path: item.name,
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        isOpenedFolder: false,
      } as ActionMenu);
    };

    // TODO, look at this one
    const desktopFiles = computed(function (): DesktopItem[] {
      const desktopStringFiles = reactive(store.getters["fileSystem/GET_DESKTOP_FILES"]);

      let desktopFileItems = [];

      // get from local storage (through the store) the desktop file positions
      // if no position put it in 0,0
      const retrievedObject = localStorage.getItem("desktopItemsPositions");
      let desktopItemsPositions = {} as any;
      if (retrievedObject) {
        desktopItemsPositions = JSON.parse(retrievedObject);
      }
      if (desktopStringFiles && desktopStringFiles.length > 0) {
        desktopFileItems = desktopStringFiles.map((fileName: string, index: number) => {
          let coordinates = { x: 0, y: 0 } as Coordinates;
          if (desktopItemsPositions && desktopItemsPositions[fileName]) {
            coordinates = desktopItemsPositions[fileName];
          }
          return {
            coordinates,
            name: fileName,
          } as DesktopItem;
        });
      }

      desktopFilesWithPosition.value = desktopFileItems;
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
      openActionMenu,
      isItemSelected,
      dropFilehandler,
      setFilesToMove,
      DESKTOP_PATH,
      selectItemsWithSelectionBox,
      isSelectionBoxEnabled,
      startMoveItem,
      desktopFilesWithPosition,
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

.desktop-item {
  position: absolute;
}
</style>
