<template>
  <div>
    <!-- share state with the scoped slot -->

    <div class="boxes"></div>
    <div class="selection-rect"></div>

    <slot> </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    dropPath: String,
  },
  components: {},

  setup(props, context) {
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

    // function getSelectionRectNode() {
    //   return document.querySelector(".selection-rect");
    // }

    // function showSelectionRectangle(selection) {
    //   var rect = getSelectionRectNode();
    //   rect.style.left = `${selection.left}px`;
    //   rect.style.top = `${selection.top + window.scrollY}px`;
    //   rect.style.width = `${selection.right - selection.left}px`;
    //   rect.style.height = `${selection.bottom - selection.top}px`;
    //   rect.style.opacity = 0.5;
    // }

    // function hideSelectionRectangle() {
    //   var rect = getSelectionRectNode();
    //   rect.style.opacity = 0;
    // }

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

    //   function onMouseDown(e) {
    //     isMouseDown = true;
    //     deselectBoxes();
    //     selectionRectangle.left = e.clientX;
    //     selectionRectangle.top = e.clientY;
    //   }

    //   function onMouseMove(e) {
    //     if (!isMouseDown) {
    //       return;
    //     }
    //     selectionRectangle.right = e.clientX;
    //     selectionRectangle.bottom = e.clientY;
    //     showSelectionRectangle(selectionRectangle);
    //     selectBoxes(selectionRectangle);
    //   }

    //   function onMouseUp(e) {
    //     isMouseDown = false;
    //     selectBoxes(selectionRectangle);
    //     hideSelectionRectangle();
    //     selectionRectangle = {
    //       top: 0,
    //       left: 0,
    //       right: 0,
    //       bottom: 0
    //     };
    //   }

    //   document.addEventListener("mousedown", onMouseDown);
    //   document.addEventListener("mousemove", onMouseMove);
    //   document.addEventListener("mouseup", onMouseUp);
    // }

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

    // function init() {
    //   initEventHandlers();
    //   initBoxes();
    // }

    // init();

    return {};
  },
});
</script>

<style scoped>
* {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}
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
