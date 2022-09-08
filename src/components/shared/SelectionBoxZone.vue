<template>
  <div>
    <div ref="selectionRectRef" class="selection-rect" :style="`z-index: ${zIndex}`"></div>
    <slot> </slot>
  </div>
</template>

<script lang="ts">
import Coordinates from "@/models/Coordinates";
import { defineComponent, onDeactivated, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    zIndex: { type: Number, default: 1 },
  },
  components: {},

  setup(props, context) {
    const isMouseDown = ref(false);
    const selectionRectRef = ref(null as unknown as HTMLElement);
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

    const onMouseDown = (e: any) => {
      isMouseDown.value = true;
      //deselectBoxes();
      selectionRectangle.value.left = e.clientX;
      selectionRectangle.value.top = e.clientY;

      const originPosition = { x: e.clientX, y: e.clientY } as Coordinates;
      selectionRectangleOrigin.value = originPosition;
    };

    const onMouseMove = (e: any) => {
      if (!isMouseDown.value) {
        return;
      }

      const newMousePosition = { x: e.clientX, y: e.clientY } as Coordinates;
      showSelectionRectangle(newMousePosition);

      //selectBoxes(selectionRectangle);
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
  background: yellow;
  opacity: 0;
  pointer-events: none;
}
</style>
