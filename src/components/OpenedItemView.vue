<template>
  <div
    class="folder-dialog"
    ref="draggableElement"
    @click="setItemDialogFocused"
    :style="`top: ${topPosition}px; left: ${leftPosition}px; height: ${itemDialog.dimension.height}px; width: ${itemDialog.dimension.width}px;`"
  >
    <!-- RESIZABLE -->
    <div
      class="resize-element"
      style="width: 100%; height: 6px; top: -3px; left: 0px; cursor: ns-resize"
      @mousedown="dragMouseDown($event, actionTypes.RESIZING_TOP)"
    >
      <!-- Top -->
    </div>
    <div
      class="resize-element"
      style="width: 6px; height: 100%; top: 0px; right: -3px; cursor: ew-resize"
      @mousedown="dragMouseDown($event, actionTypes.RESIZING_LEFT)"
    >
      <!-- Left -->
    </div>
    <div
      class="resize-element"
      style="width: 100%; height: 6px; bottom: -3px; left: 0px; cursor: ns-resize"
      @mousedown="dragMouseDown($event, actionTypes.RESIZING_BOTTOM)"
    >
      <!-- Bottom -->
    </div>
    <div
      class="resize-element"
      style="width: 6px; height: 100%; top: 0px; right: -3px; cursor: ew-resize"
      @mousedown="dragMouseDown($event, [actionTypes.RESIZING_RIGHT])"
    >
      <!-- Right -->
    </div>

    <div
      class="resize-element"
      style="width: 6px; height: 100%; top: 0px; left: -3px; cursor: ew-resize"
      @mousedown="dragMouseDown($event, actionTypes.RESIZING_LEFT, actionTypes.RESIZING_TOP)"
    >
      <!-- TL -->
    </div>

    <div
      class="resize-element"
      style="width: 12px; height: 12px; right: -3px; top: -3px; cursor: nesw-resize"
      @mousedown="dragMouseDown($event, [actionTypes.RESIZING_RIGHT, actionTypes.RESIZING_TOP])"
    >
      <!-- RT -->
    </div>
    <div
      class="resize-element"
      style="width: 12px; height: 12px; right: -3px; bottom: -3px; cursor: nwse-resize"
      @mousedown="dragMouseDown($event, [actionTypes.RESIZING_RIGHT, actionTypes.RESIZING_BOTTOM])"
    >
      <!-- RB -->
    </div>
    <div
      class="resize-element"
      style="width: 12px; height: 12px; left: -3px; bottom: -3px; cursor: nesw-resize"
      @mousedown="dragMouseDown($event, [actionTypes.RESIZING_LEFT, actionTypes.RESIZING_BOTTOM])"
    >
      <!-- LB -->
    </div>

    <div class="flex folder-header" ref="dialogHeader" @mousedown="dragMouseDown($event, actionTypes.MOVING)">
      <div class="mdi mdi-folder-open folder-icon"></div>
      <div class="directory-name">{{ getFileNameFromPath(itemDialog.name) }}</div>
      <div class="flex">
        <div class="mdi mdi-minus action-icon" @click="minimizeFolderDialog"></div>
        <div class="mdi mdi-crop-square action-icon" @click="setFolderDialogFullScreen"></div>
        <div class="mdi mdi-close action-icon" @click="closeFolderDialog"></div>
      </div>
    </div>
    <!-- DIALOG CASE: our prop itemDialog is a FolderDIalog and fetch the items -->

    <folder-item v-if="itemDialog.isFolder" :height="contentHeight" :folderDialog="itemDialog"> </folder-item>
    <div v-else-if="itemDialog.mimeType === MIME_TYPE.pdf">
      <vue-pdf-embed :source="pdfSource"></vue-pdf-embed>

      <!-- <div v-for="(item, index) in items" :key="`opened-folder-${index}`">INDEX::{{ index }}</div> -->
    </div>
  </div>
</template>

<script lang="ts">
import Coordinates from "@/models/Coordinates";
import ItemDialog from "@/models/ItemDialog";
import FolderItem from "@/components/itemViewTypes/FolderItem.vue";
import store from "@/store";
import { computed, defineComponent, PropType, reactive, ref } from "vue";
import Dimension from "@/models/Dimension";

import VuePdfEmbed from "vue-pdf-embed";
import { MIME_TYPE } from "@/constants";
import { getFileNameFromPath, isDir } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    itemDialog: { type: Object as PropType<ItemDialog>, required: true },
    position: Object as PropType<Coordinates>,
  },
  components: { VuePdfEmbed, FolderItem },
  emits: [],
  setup(props, _) {
    const actionTypes = {
      RESIZING_LEFT: "resizing_left",
      RESIZING_RIGHT: "resizing_right",
      RESIZING_TOP: "resizing_top",
      RESIZING_BOTTOM: "resizing_bottom",
      MOVING: "moving",
    };

    const pdfSource = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";

    const minHeight = 80;
    const minWidth = 200;

    const dialogHeader = ref({} as HTMLElement);
    const draggableElement = ref({} as HTMLElement);

    const contentHeight = computed(function () {
      return props.itemDialog.dimension.height - dialogHeader.value.clientHeight;
    });

    const topPosition = computed(function () {
      return props.itemDialog.position ? props.itemDialog.position.x : 0;
    });

    const leftPosition = computed(function () {
      return props.itemDialog.position ? props.itemDialog.position.y : 0;
    });

    const isDirectory = isDir(props.itemDialog.name);

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    function dragMouseDown(e: any, eventType: string | string[]) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      if (eventType === actionTypes.MOVING) {
        document.onmousemove = elementDrag;
      } else {
        document.onmousemove = elementResize.bind(eventType);
      }
    }

    function elementResize(this: any, e: any) {
      const actionsToPerform = this as string[];

      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      let newHeight = props.itemDialog.dimension.height;
      let newWidth = props.itemDialog.dimension.width;

      // set the four actions type
      if (actionsToPerform.includes(actionTypes.RESIZING_LEFT)) {
        newWidth =
          props.itemDialog.dimension.width + pos1 > minWidth ? props.itemDialog.dimension.width + pos1 : minWidth;
        const newPosition = {
          x: props.itemDialog.position.x,
          y: draggableElement.value.offsetLeft - pos1,
        } as Coordinates;

        updateItemPosition(newPosition);
      } else if (actionsToPerform.includes(actionTypes.RESIZING_RIGHT)) {
        console.log("RESIZE RIGHT");
        newWidth =
          props.itemDialog.dimension.width - pos1 > minWidth ? props.itemDialog.dimension.width - pos1 : minWidth;
      }

      if (actionsToPerform.includes(actionTypes.RESIZING_TOP)) {
        newHeight =
          props.itemDialog.dimension.height + pos2 > minHeight ? props.itemDialog.dimension.height + pos2 : minHeight;
        const newPosition = {
          x: draggableElement.value.offsetTop - pos2,
          y: props.itemDialog.position.y,
        } as Coordinates;

        updateItemPosition(newPosition);
      } else if (actionsToPerform.includes(actionTypes.RESIZING_BOTTOM)) {
        newHeight =
          props.itemDialog.dimension.height - pos2 > minHeight ? props.itemDialog.dimension.height - pos2 : minHeight;
      }

      const newDimension = { height: newHeight, width: newWidth } as Dimension;
      store.dispatch("fileSystem/UPDATE_ITEM_DIALOG_DIMENSION", {
        guid: props.itemDialog.guid,
        dimension: newDimension,
      });
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the element's new position:
      const newX = draggableElement.value.offsetTop - pos2;
      const newY = draggableElement.value.offsetLeft - pos1;

      const newPosition = { x: newX, y: newY } as Coordinates;

      updateItemPosition(newPosition);
    }

    function updateItemPosition(newPosition: Coordinates) {
      // TODO if out of screen dont update!!!!
      store.dispatch("fileSystem/UPDATE_ITEM_DIALOG_POSITION", { guid: props.itemDialog.guid, position: newPosition });
    }

    function setItemDialogFocused() {
      store.dispatch("fileSystem/SET_FOCUSED_ITEM_DIALOG", props.itemDialog);
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function closeFolderDialog() {
      store.dispatch("fileSystem/CLOSE_ITEM_DIALOG", props.itemDialog.guid);
    }

    function minimizeFolderDialog() {
      store.dispatch("fileSystem/MINIMIZE_ITEM_DIALOG", props.itemDialog.guid);
    }

    return {
      draggableElement,
      topPosition,
      leftPosition,
      dragMouseDown,
      closeFolderDialog,
      minimizeFolderDialog,
      getFileNameFromPath,
      setItemDialogFocused,
      actionTypes,
      pdfSource,
      MIME_TYPE,
      isDirectory,
      dialogHeader,
      contentHeight,
    };
  },
});
</script>

<style scoped>
.resize-element {
  position: absolute;
  user-select: none;

  z-index: 3;
}

.folder-dialog {
  position: absolute;
  top: 50px;
  left: 200px;
  border: 2px solid #959595;
  border-radius: 10px;
  background-color: rgb(170, 170, 170);
}

.flex {
  display: flex;
  align-items: center;
}

.folder-icon {
  color: #f6d573;
  font-size: 18px;
  margin-left: 5px;
}

.folder-header {
  background-color: rgb(170, 170, 170);
  height: 30px;
}

.folder-actions {
  background-color: rgb(25, 25, 25);
  height: 43px;
}

.directory-name {
  margin-left: 5px;
  color: white;
  font-size: var(--medium-font-size);
  flex-grow: 1;
  text-align: start;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.action-icon {
  width: 40px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-icon:hover {
  background-color: rgb(33, 33, 33);
  color: white;
}

.footer {
  position: absolute;
  height: 20px;
  width: 20px;
  background-color: rgb(25, 25, 25);
  bottom: 0px;
  width: inherit;
  text-align: start;
}

.footer-text {
  color: white;
  font-size: var(--small-font-size);
  text-align: start;
  margin-left: 5px;
}
</style>
