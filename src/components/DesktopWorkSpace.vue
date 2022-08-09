<template>
  <drop-zone :dropPath="'my PC/Desktop'">
    <div @click="selectFile({})">
      <grid-layout
        class="grid-layout-dimension"
        :layout="desktopFiles"
        :col-num="columnsNumber"
        :row-height="rowHeight"
        :is-draggable="true"
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
          @moved="fileItemMovedHandler"
        >
          <div @click.right="openActionMenu($event, item)">
            <FileItem
              :ref="item.name + 'FileRef'"
              :fileItem="item"
              @onClick="selectFile"
              :isSelected="selectedFile && selectedFile.name === item.name"
            />
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </drop-zone>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, reactive, computed, onDeactivated } from "vue";

import { GridItem, GridLayout } from "vue3-grid-layout";
import FileItem from "@/components/FileItem.vue";
import DropZone from "@/components/shared/DropZone.vue";

import DesktopItem from "@/models/DesktopItem";
import { useStore } from "vuex";
import ActionMenu from "@/models/ActionMenu";
import { DESKTOP_FILE_DIMENSION } from "@/constants";
import Coordinates from "@/models/Coordinates";

export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<DesktopItem[]>,
  },
  components: { GridLayout, GridItem, FileItem, DropZone },
  emits: ["onFileItemPositionChange"],
  setup() {
    const store = useStore();

    const itemWidth = 0.7;
    const itemHeight = 2.2;

    const columnsNumber = ref(0);
    const rowHeight = ref(0);

    const selectedFile = ref({} as DesktopFile);

    const selectFile = (newFileSelected: DesktopFile) => {
      selectedFile.value = newFileSelected;
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

    const fileItemMovedHandler = (itemName: string, newX: number, newY: number) => {
      console.log(itemName, newX, newY);

      const retrievedObject = localStorage.getItem("desktopItemsPositions");
      let desktopItemsPositions = {} as any;
      if (retrievedObject) {
        desktopItemsPositions = JSON.parse(retrievedObject);
        desktopItemsPositions[itemName] = { x: newX, y: newY } as Coordinates;
      } else {
        desktopItemsPositions = {};
        desktopItemsPositions[itemName] = { x: newX, y: newY } as Coordinates;
      }
      localStorage.setItem("desktopItemsPositions", JSON.stringify(desktopItemsPositions));

      // change the file item position in the local storage (through the store)

      // const newCoordinates = { x: newX, y: newY } as Coordinates;
      // const fileItemToUpdate: DesktopItem | undefined = props.items?.find((item: DesktopItem) => {
      //   if (item.name === itemName) {
      //     return item;
      //   }
      // });
      // console.log(fileItemToUpdate, newCoordinates);
      // context.emit("onFileItemPositionChange", fileItemToUpdate, newCoordinates);
    };

    const setGridColumnsAndRows = () => {
      columnsNumber.value = window.innerWidth;
      rowHeight.value = 5;
    };

    onMounted(async () => {
      window.addEventListener("resize", setGridColumnsAndRows);

      setGridColumnsAndRows();
      await store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
    });

    onDeactivated(() => {
      window.removeEventListener("resize", setGridColumnsAndRows);
    });

    return {
      desktopFiles,
      fileItemMovedHandler,
      itemWidth,
      itemHeight,
      columnsNumber,
      rowHeight,
      selectFile,
      selectedFile,
      openActionMenu,
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
