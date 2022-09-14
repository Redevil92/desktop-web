<template>
  {{ isEnabled }}{{ isMouseDown }}
  <div ref="selectionRectArea">
    <div ref="selectionRectRef" class="selection-rect" :style="`z-index: ${zIndex}`"></div>
    <slot> </slot>
  </div>
</template>

<script lang="ts">
import Coordinates from "@/models/Coordinates";
import { defineComponent, onDeactivated, onMounted, ref, watch } from "vue";

export default defineComponent({
  props: {
    zIndex: { type: Number, default: 1 },
    isEnabled: { type: Boolean, default: true },
    itemsToSelectClass: { type: String, required: true },
  },
  components: {},

  setup(props, context) {
    const minimumRectangleDimension = ref(5);

    const isMouseDown = ref(false);
    const selectionRectRef = ref(null as unknown as HTMLElement);
    const selectionRectArea = ref(null as unknown as HTMLElement);
    const selectionRectangle = ref({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as any);

    const selectionRectangleOrigin = ref({ x: 0, y: 0 } as Coordinates);

    const hideSelectionRectangle = () => {
      selectionRectRef.value.style.opacity = "0";
    };

    watch(
      () => props.isEnabled,
      function () {
        resetSelectionBox();
      }
    );

    const resetSelectionBox = () => {
      selectionRectangle.value = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      };
      isMouseDown.value = false;
    };

    const onMouseDown = (e: any) => {
      if (!props.isEnabled) {
        return;
      }

      isMouseDown.value = true;
      //deselectBoxes();
      selectionRectangle.value.left = e.clientX;
      selectionRectangle.value.top = e.clientY;

      const originPosition = { x: e.clientX, y: e.clientY } as Coordinates;
      selectionRectangleOrigin.value = originPosition;
    };

    const onMouseMove = (e: any) => {
      if (!isMouseDown.value || !props.isEnabled) {
        isMouseDown.value = false;
        return;
      }

      const newMousePosition = { x: e.clientX, y: e.clientY } as Coordinates;
      showSelectionRectangle(newMousePosition);

      const elements = selectionRectArea.value.getElementsByClassName(props.itemsToSelectClass);
      let elementToSelect = [];

      const selRect = selectionRectRef.value.getBoundingClientRect();

      for (const element of elements) {
        const elementBoudingClientRect = element.getBoundingClientRect();

        if (
          ((elementBoudingClientRect.left > selRect.left &&
            elementBoudingClientRect.left < selRect.left + selRect.width) ||
            (elementBoudingClientRect.left + elementBoudingClientRect.width > selRect.left &&
              elementBoudingClientRect.left + elementBoudingClientRect.width < selRect.left + selRect.width)) &&
          ((elementBoudingClientRect.top > selRect.top &&
            elementBoudingClientRect.top < selRect.top + selRect.height) ||
            (elementBoudingClientRect.top + elementBoudingClientRect.height > selRect.top &&
              elementBoudingClientRect.top + elementBoudingClientRect.height < selRect.top + selRect.height))
        ) {
          elementToSelect.push(element);
        }
      }

      if (
        selectionRectangle.value.right - selectionRectangle.value.left > minimumRectangleDimension.value &&
        selectionRectangle.value.bottom - selectionRectangle.value.top > minimumRectangleDimension.value
      ) {
        context.emit("onSelectingItems", elementToSelect);
      }
    };

    const showSelectionRectangle = (newMousePosition: Coordinates) => {
      selectionRectangle.value.right = newMousePosition.x;
      selectionRectangle.value.bottom = newMousePosition.y;

      selectionRectRef.value.style.left = `${Math.min(selectionRectangleOrigin.value.x, newMousePosition.x)}px`;
      selectionRectRef.value.style.top = `${Math.min(selectionRectangleOrigin.value.y, newMousePosition.y)}px`;
      selectionRectRef.value.style.width = `${Math.abs(newMousePosition.x - selectionRectangleOrigin.value.x)}px`;
      selectionRectRef.value.style.height = `${Math.abs(newMousePosition.y - selectionRectangleOrigin.value.y)}px`;
      selectionRectRef.value.style.opacity = "0.5";
    };

    const onMouseUp = (e: any) => {
      isMouseDown.value = false;
      //selectBoxes(selectionRectangle);
      hideSelectionRectangle();
      selectionRectangle.value = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      };
    };

    const initEventHandlers = () => {
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const removeEventHandlers = () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    onMounted(() => {
      initEventHandlers();
    });

    onDeactivated(() => {
      removeEventHandlers();
    });

    return {
      selectionRectRef,
      selectionRectArea,
      isMouseDown,
    };
  },
});
</script>

<style scoped>
.boxes {
  display: flex;
}
.column {
  display: flex;
  flex-direction: column;
}
.box {
  display: inline-block;
  background: red;
  margin: 4px;
}
.selected.box {
  background: green;
}
.tiny.box {
  width: 20px;
  height: 20px;
}
.small.box {
  width: 50px;
  height: 50px;
}
.normal.box {
  width: 100px;
  height: 100px;
}
.big.box {
  width: 150px;
  height: 150px;
}
.huge.box {
  width: 200px;
  height: 150px;
}
.overlay {
  position: relative;
}
.selection-rect {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.416);
  border: 2px solid white;
  opacity: 0;
  pointer-events: none;
}
</style>
