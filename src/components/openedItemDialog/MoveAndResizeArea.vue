<template>
  <!-- commented animation for folder -->
  <!-- :class="{ 'folder-dialog-animation': animateDialogWhenMoving }" -->
  <div
    class="folder-dialog"
    ref="draggableElement"
    @mousedown="setItemDialogFocused"
    :style="
      !isFullscreen
        ? `top: ${topPosition}px; left: ${leftPosition}px; height: ${itemDialog.dimension.height}px; width: ${itemDialog.dimension.width}px; z-index: ${itemDialog.zIndex}`
        : `top: ${0}px; left: ${0}px; z-index: ${
            itemDialog.zIndex
          }; width: calc(100% - 1px); height: calc(100% - 31px);   `
    "
  >
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
    <div @mousedown.stop="dragMouseDown($event, actionTypes.MOVING)">
      <slot name="header"> </slot>
    </div>

    <slot />
  </div>
</template>

<script lang="ts">
import Coordinates from "@/models/Coordinates";
import ItemDialog from "@/models/ItemDialog";
import store from "@/store";
import { computed, defineComponent, PropType, ref } from "vue";
import Dimension from "@/models/Dimension";

export default defineComponent({
  props: {
    itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  },
  components: {},
  emits: [],
  setup(props, _) {
    const actionTypes = {
      RESIZING_LEFT: "resizing_left",
      RESIZING_RIGHT: "resizing_right",
      RESIZING_TOP: "resizing_top",
      RESIZING_BOTTOM: "resizing_bottom",
      MOVING: "moving",
    };

    const animateDialogWhenMoving = ref(true);

    const isFullscreen = computed(function () {
      return props.itemDialog.isFullscreen;
    });

    const minHeight = computed(function () {
      return props.itemDialog.minDimension?.height || 200;
    });

    const minWidth = computed(function () {
      return props.itemDialog.minDimension?.width || 200;
    });

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

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    function dragMouseDown(e: any, eventType: string | string[]) {
      animateDialogWhenMoving.value = false;
      setItemDialogFocused();

      // if fullscreen no moving and resizing
      if (isFullscreen.value) {
        return;
      }
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
          props.itemDialog.dimension.width + pos1 > minWidth.value
            ? props.itemDialog.dimension.width + pos1
            : minWidth.value;
        const newPosition = {
          x: props.itemDialog.position.x,
          y: draggableElement.value.offsetLeft - pos1,
        } as Coordinates;

        updateItemPosition(newPosition);
      } else if (actionsToPerform.includes(actionTypes.RESIZING_RIGHT)) {
        newWidth =
          props.itemDialog.dimension.width - pos1 > minWidth.value
            ? props.itemDialog.dimension.width - pos1
            : minWidth.value;
      }

      if (actionsToPerform.includes(actionTypes.RESIZING_TOP)) {
        newHeight =
          props.itemDialog.dimension.height + pos2 > minHeight.value
            ? props.itemDialog.dimension.height + pos2
            : minHeight.value;
        const newPosition = {
          x: draggableElement.value.offsetTop - pos2,
          y: props.itemDialog.position.y,
        } as Coordinates;

        updateItemPosition(newPosition);
      } else if (actionsToPerform.includes(actionTypes.RESIZING_BOTTOM)) {
        newHeight =
          props.itemDialog.dimension.height - pos2 > minHeight.value
            ? props.itemDialog.dimension.height - pos2
            : minHeight.value;
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
      animateDialogWhenMoving.value = true;
      document.onmouseup = null;
      document.onmousemove = null;
    }

    return {
      draggableElement,
      topPosition,
      leftPosition,
      dragMouseDown,
      setItemDialogFocused,
      actionTypes,
      dialogHeader,
      contentHeight,
      isFullscreen,
      animateDialogWhenMoving,
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
  border: 2px solid var(--dialog-border-color_dark);
  border-radius: 10px;
  background-color: var(--dialog-background-color_dark);
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
  -webkit-box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
}

.folder-dialog-animation {
  transition: all 0.2s ease-out;
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
  background-color: var(--dialog-header-color_dark);
  height: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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

.file-icon {
  margin-left: 10px;
  margin-top: 3px;
}
</style>
