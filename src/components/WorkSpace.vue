<template>
  <div>
    {{ items.length }}
    <grid-layout
      :layout="itemsToShow"
      :col-num="12"
      :row-height="30"
      :is-draggable="draggable"
      :is-resizable="resizable"
      :responsive="false"
      :vertical-compact="false"
      :prevent-collision="true"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in itemsToShow"
        :key="item.i"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <div class="file-item">
          <div class="file-icon">IMG</div>
          <span class="text">{{ itemTitle(item) }}</span>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch, PropType } from "vue";
import { useStore } from "vuex";

import { GridItem, GridLayout } from "vue3-grid-layout";
import Item from "@/models/old/Item";

export default defineComponent({
  props: {
    msg: String,
    items: Array as PropType<Item[]>,
  },
  components: { GridLayout, GridItem },
  setup(props) {
    const layout: any = reactive([
      { x: 0, y: 0, w: 2, h: 3, i: "a", static: false },
      { x: 0, y: 1, w: 1, h: 3, i: "b", static: false },
    ] as any[]);

    const itemsToShow = computed(function (): any[] {
      if (props.items) {
        const items = props.items.map((item: Item) => {
          return { x: item.coordinates.x, y: item.coordinates.y, w: 1, h: 2.5, i: item.name, static: false };
        });
        // console.log("MY ITEM", items);
        // layout.values = items;
        return items;
      }
      return [];
    });

    const draggable = ref(true as boolean);
    const resizable = ref(false as boolean);
    const index = ref(0 as number);

    const itemTitle = function (item: any) {
      let result = item.i;
      if (item.static) {
        result += " - Static";
      }
      return result;
    };
    return { layout, draggable, resizable, index, itemTitle, itemsToShow };
  },
});
</script>

<style scoped>
.text {
  font-size: var(--small-font-size);
}

.file-item {
  height: 70px;
  width: 74px;
  border: 1px solid black;
}

.file-icon {
  height: 48px;
  width: 48px;
  border: 1px solid black;
}

.vue-grid-layout {
  background: #eee;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: #cce;
}
.vue-grid-item .text {
  font-size: var(--small-font-size);
  color: rgb(255, 255, 255);
  font-size: 12px;
  letter-spacing: -0.1px;
  line-height: 1.2;
  margin: 1px 0px;
  padding: 2px 1px;
  text-shadow: rgb(0 0 0 / 75%) 0px 0px 1px, rgb(0 0 0 / 50%) 0px 0px 2px, rgb(0 0 0 / 75%) 0px 1px 1px,
    rgb(0 0 0 / 50%) 0px 1px 2px, rgb(0 0 0 / 75%) 0px 2px 1px, rgb(0 0 0 / 50%) 0px 2px 2px;
  word-break: break-word;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: var(--small-font-size);
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
