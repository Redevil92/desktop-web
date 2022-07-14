<template>
  <drop-zone @onFilesDropped="filesDroppedHandler">
    <div @click="selectFile({})" id="drop_zone">
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
          <FileItem
            :ref="item.name + 'FileRef'"
            :fileItem="item"
            @onClick="selectFile"
            :isSelected="selectedFile && selectedFile.name === item.name"
          />
        </grid-item>
      </grid-layout>
    </div>
  </drop-zone>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, reactive, computed } from "vue";

import { GridItem, GridLayout } from "vue3-grid-layout";
import FileItem from "@/components/FileItem.vue";
import DropZone from "@/components/shared/DropZone.vue";

import DesktopItem from "@/models/DesktopItem";
import { useStore } from "vuex";
import { createFile } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<DesktopItem[]>,
  },
  components: { GridLayout, GridItem, FileItem, DropZone },
  emits: ["onFileItemPositionChange"],
  setup(props, context) {
    const store = useStore();

    store.dispatch("fileSystem/FETCH_DESKTOP_FILES");

    const itemWidth = 0.7;
    const itemHeight = 2.2;

    const columnsNumber = ref(0);
    const rowHeight = ref(0);

    const selectedFile = ref({} as DesktopFile);

    const selectFile = (newFileSelected: DesktopFile) => {
      selectedFile.value = newFileSelected;

      console.log("Selecting", selectedFile.value.name);
    };

    const desktopFiles = computed(function (): DesktopFile[] {
      const desktopStringFiles = reactive(store.getters["fileSystem/GET_DESKTOP_FILES"]);
      if (desktopStringFiles && desktopStringFiles.length > 0) {
        return desktopStringFiles.map((fileName: string, index: number) => {
          return {
            x: index * 5,
            y: index * 5,
            w: 0.7,
            h: 2.2,
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
      // const newCoordinates = { x: newX, y: newY } as Coordinates;
      // const fileItemToUpdate: DesktopItem | undefined = props.items?.find((item: DesktopItem) => {
      //   if (item.name === itemName) {
      //     return item;
      //   }
      // });
      // console.log(fileItemToUpdate, newCoordinates);
      // context.emit("onFileItemPositionChange", fileItemToUpdate, newCoordinates);
    };

    const filesDroppedHandler = (files: any) => {
      console.log(files);

      const file = files[0];

      const reader = new FileReader();

      reader.onload = function () {
        console.log(reader);
        createFile("my PC/Desktop/new.png", reader.result?.toString());
        store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
      };

      reader.readAsDataURL(file);
    };

    onMounted(() => {
      columnsNumber.value = window.innerWidth / 85;
      rowHeight.value = 22;
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
      filesDroppedHandler,
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
  background-image: url("/src/assets/desktopImages/mountain.jpg");
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
