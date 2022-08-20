<template>
  <DropExternalFileZone :dropPath="'my PC/Desktop'">
    <div
      @click="selectFile({})"
      @drop="dropFilehandler($event, '')"
      @dragover.prevent
      @dragenter.prevent
      ref="desktopRef"
    >
      <grid-layout
        class="grid-layout-dimension"
        :layout="desktopFiles"
        :col-num="columnsNumber"
        :row-height="rowHeight"
        :is-draggable="false"
        :is-resizable="false"
        :responsive="false"
        :vertical-compact="false"
        :prevent-collision="true"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="(item, index) in desktopFiles"
          :key="`${item.i}-${index}`"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <!-- Implement draggable files, move in desktop just when drag end! Otherwise move in another folder 
                or do nothing -->
          <div
            draggable
            @mousedown="selectFile(item)"
            @click.right="openActionMenu($event, item)"
            @drop="dropFilehandler($event, item.name)"
            @dragstart="setFilesToMove(selectedItemPaths)"
          >
            <FileItem
              :ref="item.name + 'FileRef'"
              :fileItem="item"
              @onClick="selectFile(item)"
              :isSelected="isItemSelected(item.name)"
            />
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </DropExternalFileZone>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, reactive, computed, onDeactivated } from "vue";

import useMoveFiles from "@/hooks/useMoveFiles";

import { GridItem, GridLayout } from "vue3-grid-layout";
import FileItem from "@/components/FileItem.vue";
import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";

import DesktopItem from "@/models/DesktopItem";
import { useStore } from "vuex";
import ActionMenu from "@/models/ActionMenu";
import { DESKTOP_FILE_DIMENSION } from "@/constants";
import Coordinates from "@/models/Coordinates";
import { isDir } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<DesktopItem[]>,
  },
  components: { GridLayout, GridItem, FileItem, DropExternalFileZone },
  emits: ["onFileItemPositionChange"],
  setup() {
    const store = useStore();
    const { moveFilesInFolder, setFilesToMove } = useMoveFiles();

    const itemWidth = 0.7;
    const itemHeight = 2.2;

    const columnsNumber = ref(0);
    const rowHeight = ref(0);

    const desktopRef = ref(null as unknown as HTMLElement);

    const selectedItemPaths = computed((): string[] => {
      return store.getters["fileSystem/GET_SELECTED_DESKTOP_FILE_PATHS"];
    });

    // TODO: use hook for this methods, drag start, move files etc...

    const dropFilehandler = async (event: any, dropDestinationFileName = "") => {
      let isFolder = false;
      if (dropDestinationFileName) {
        isFolder = await isDir(dropDestinationFileName);
      }
      if (dropDestinationFileName && isFolder) {
        await moveFilesInFolder(event, dropDestinationFileName);
      } else {
        changeFileItemsPosition(event);
        await refreshFiles();
      }
    };

    const changeFileItemsPosition = async (event: any) => {
      selectedItemPaths.value.forEach((itemName) => {
        const retrievedObject = localStorage.getItem("desktopItemsPositions");
        let desktopItemsPositions = {} as any;
        if (retrievedObject) {
          desktopItemsPositions = JSON.parse(retrievedObject);
        }

        // desktopItemsPositions[itemName] = { x: event.clientX, y: event.clientY } as Coordinates;
        desktopItemsPositions[itemName] = { x: event.clientX - 35, y: event.clientY / 11 - 5 } as Coordinates;

        localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));
      });
    };
    const selectFile = (newFileSelected: DesktopFile) => {
      console.log("selecting", newFileSelected);
      store.dispatch("fileSystem/SET_SELECTED_DESKTOP_FILE_PATHS", [newFileSelected.name]);
    };

    const isItemSelected = (fileItem: string) => {
      return selectedItemPaths.value.includes(fileItem);
    };

    const openActionMenu = (event: any, item: DesktopFile) => {
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

    const desktopFiles = computed(function (): DesktopFile[] {
      const desktopStringFiles = reactive(store.getters["fileSystem/GET_DESKTOP_FILES"]);

      // get from local storage (through the store) the desktop file positions
      // if no position put it in 0,0

      const retrievedObject = localStorage.getItem("desktopItemsPositions");
      let desktopItemsPositions = {} as any;
      if (retrievedObject) {
        desktopItemsPositions = JSON.parse(retrievedObject);
      }

      if (desktopStringFiles && desktopStringFiles.length > 0) {
        return desktopStringFiles.map((fileName: string, index: number) => {
          let coordinates = { x: 0, y: 0 } as Coordinates;
          if (desktopItemsPositions && desktopItemsPositions[fileName]) {
            coordinates = desktopItemsPositions[fileName];
          }

          return {
            x: coordinates.x,
            y: coordinates.y,
            w: DESKTOP_FILE_DIMENSION.width,
            h: DESKTOP_FILE_DIMENSION.height,
            i: fileName,
            name: fileName,
            static: false,
          };
        });
      }
      return [];
    });

    const refreshFiles = async () => {
      await store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      await store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
    };

    const setGridColumnsAndRows = () => {
      columnsNumber.value = window.innerWidth;
      rowHeight.value = 1;
    };

    onMounted(async () => {
      window.addEventListener("resize", setGridColumnsAndRows);

      setGridColumnsAndRows();
      refreshFiles();
    });

    onDeactivated(() => {
      window.removeEventListener("resize", setGridColumnsAndRows);
    });

    return {
      desktopRef,
      desktopFiles,
      itemWidth,
      itemHeight,
      columnsNumber,
      rowHeight,
      selectFile,
      selectedItemPaths,
      openActionMenu,
      isItemSelected,
      dropFilehandler,
      setFilesToMove,
    };
  },
});

interface DesktopFile {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  name: string;
  static: boolean;
}
</script>

<style scoped>
.vue-grid-layout {
  background-image: url("/src/assets/desktopImages/mountain.png");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh !important;
}
.vue-grid-item.vue-grid-placeholder {
  background: green !important;
}

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
</style>
