<template>
  <div>
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
        <FileItem :ref="item.name + 'FileRef'" :fileItem="item" @onRightClick="rightClickHandler(item)" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, reactive } from "vue";

import { GridItem, GridLayout } from "vue3-grid-layout";
import FileItem from "@/components/FileItem.vue";

import DesktopItem from "@/models/DesktopItem";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<DesktopItem[]>,
  },
  components: { GridLayout, GridItem, FileItem },
  emits: ["onFileItemPositionChange"],
  setup(props, context) {
    const store = useStore();

    store.dispatch("fileSystem/FETCH_DESKTOP_FILES");

    const itemWidth = 0.7;
    const itemHeight = 2.2;

    const columnsNumber = ref(0);
    const rowHeight = ref(0);

    // const desktopStringFiles = getFiles("/my PC/Desktop");
    const desktopStringFiles = reactive(store.getters["fileSystem/GET_DESKTOP_FILES"]);

    let desktopFiles: any[] = [];
    if (desktopStringFiles && desktopStringFiles.length > 0) {
      desktopFiles = desktopStringFiles.map((fileName: string, index: number) => {
        const mimeType = ".txt";
        return {
          x: index * 10,
          y: index * 10,
          w: 0.7,
          h: 2.2,
          i: fileName,
          name: fileName,
          static: false,
          mimeType: mimeType,
        };
      });
    }

    console.log(desktopFiles);

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

    const rightClickHandler = (item: DesktopItem) => {
      console.log("RIGH");
    };

    onMounted(() => {
      columnsNumber.value = window.innerWidth / 85;
      rowHeight.value = 22;
    });

    return {
      desktopFiles,

      rightClickHandler,
      fileItemMovedHandler,
      itemWidth,
      itemHeight,
      columnsNumber,
      rowHeight,
    };
  },
});
</script>

<style scoped>
.vue-grid-layout {
  background: #eee;
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
