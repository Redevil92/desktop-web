<template>
  <div>
    <div ref="selectionRectRef" class="selection-rect" :style="`z-index: ${zIndex}`"></div>
    <slot> </slot>
  </div>
</template>

<script lang="ts">
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

    // function rectangleSelect(inputElements, selectionRectangle) {
    //   var elements = [];
    //   inputElements.forEach(function(element) {
    //     var box = element.getBoundingClientRect();

    //     if (
    //       selectionRectangle.left <= box.left &&
    //       selectionRectangle.top <= box.top &&
    //       selectionRectangle.right >= box.right &&
    //       selectionRectangle.bottom >= box.bottom
    //     ) {
    //       elements.push(element);
    //     }
    //   });
    //   return elements;
    // }

    const showSelectionRectangle = () => {
      selectionRectRef.value.style.left = `${selectionRectangle.value.left}px`;
      selectionRectRef.value.style.top = `${selectionRectangle.value.top + window.scrollY}px`;
      selectionRectRef.value.style.width = `${selectionRectangle.value.right - selectionRectangle.value.left}px`;
      selectionRectRef.value.style.height = `${selectionRectangle.value.bottom - selectionRectangle.value.top}px`;
      selectionRectRef.value.style.opacity = "0.5";
    };

    const hideSelectionRectangle = () => {
      selectionRectRef.value.style.opacity = "0";
    };

    // function selectBoxes(selection) {
    //   deselectBoxes();
    //   rectangleSelect(getBoxes(), selection).forEach(function(box) {
    //     box.classList.add("selected");
    //   });
    // }

    // function deselectBoxes() {
    //   getBoxes().forEach(function(box) {
    //     box.classList.remove("selected");
    //   });
    // }

    // function getBoxes() {
    //   return [...document.querySelectorAll(".box")];
    // }

    // function initEventHandlers() {
    //   var isMouseDown = false;
    //   var selectionRectangle = {
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0
    //   };

    const onMouseDown = (e: any) => {
      isMouseDown.value = true;
      //deselectBoxes();
      selectionRectangle.value.left = e.clientX;
      selectionRectangle.value.top = e.clientY;
    };

    const onMouseMove = (e: any) => {
      if (!isMouseDown.value) {
        return;
      }

      selectionRectangle.value.right = e.clientX;
      selectionRectangle.value.bottom = e.clientY;
      showSelectionRectangle();
      //selectBoxes(selectionRectangle);
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

    // function initBoxes() {
    //   // Helpers for generating random boxes on screen
    //   function generateColumn(boxesPerColumn) {
    //     var node = document.createElement("div");
    //     node.className = "column";
    //     while (boxesPerColumn--) {
    //       var box = document.createElement("div");
    //       var sizeClassName = ["tiny", "small", "normal", "big", "huge"][
    //         Math.floor(Math.random() * 5)
    //       ];
    //       box.className = "box " + sizeClassName;
    //       node.appendChild(box);
    //     }
    //     return node;
    //   }
    //   function generateBoxes(parent, cols, boxesPerColumn) {
    //     while (cols--) {
    //       parent.appendChild(generateColumn(boxesPerColumn));
    //     }
    //   }

    //   generateBoxes(document.querySelector(".boxes"), 10, 10);
    // }

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
