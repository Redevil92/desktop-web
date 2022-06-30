<template>
  <div>
    <div class="folder-item-container">
      <div class="flex folder-actions"></div>

      <div
        :class="index % 2 === 0 ? 'folder-item folder-item-odd' : 'folder-item'"
        v-for="(item, index) in items"
        :key="`item-${index}-${item}`"
        @click="doubleClickHandler"
      >
        {{ index % 1 }}
        {{ getFileNameFromPath(item) }}
      </div>
    </div>

    <!-- GET ALL ELEMENTS -->
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import { getFileNameFromPath } from "@/context/fileSystemController";
import { defineComponent, PropType } from "vue";

import store from "@/store";

export default defineComponent({
  props: {
    items: Array as PropType<string[]>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const doubleClickHandler = (fileName: string) => {
      // check if file is dir
      // if dir update current item dialog
      // else open a new one
      store.dispatch("fileSystem/ADD_ITEM_DIALOG", fileName);
    };

    return { getFileNameFromPath, doubleClickHandler };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.folder-item {
  background-color: rgb(96, 96, 96);
  height: 20px;
  margin: 0px 10px;
  border-radius: 7px;
  color: rgb(239, 238, 238);
  font-size: var(--medium-font-size);
}

.folder-item-odd {
  background-color: rgb(170, 170, 170) !important;
}

.folder-item-container {
  /* background-color: rgb(33, 33, 33);
  height: -webkit-fill-available; */
}

.action-icon:hover {
  background-color: rgb(33, 33, 33);
  color: white;
}

.footer {
  position: absolute;
  height: 20px;

  background-color: rgb(25, 25, 25);
  bottom: 0px;
  width: inherit;
  text-align: start;
  width: -webkit-fill-available;
}

.footer-text {
  color: white;
  font-size: var(--small-font-size);
  text-align: start;
  margin-left: 5px;
}
</style>
