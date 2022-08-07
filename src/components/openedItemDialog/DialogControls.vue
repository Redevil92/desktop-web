<template>
  <div class="flex action-group">
    <div class="mdi mdi-minus-thick action-icon" style="background-color: #e5d83c" @click="minimizeFolderDialog"></div>
    <div
      class="mdi mdi-crop-square action-icon"
      style="background-color: #36d936"
      @click="setFolderDialogFullScreen"
    ></div>
    <div class="mdi mdi-close-thick action-icon" style="background-color: #d64242" @click="closeFolderDialog"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";
import store from "@/store";

export default defineComponent({
  props: {
    itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  },
  components: {},
  emits: [],
  setup(props, _) {
    function closeFolderDialog() {
      store.dispatch("fileSystem/CLOSE_ITEM_DIALOG", props.itemDialog.guid);
    }

    function minimizeFolderDialog() {
      store.dispatch("fileSystem/MINIMIZE_ITEM_DIALOG", props.itemDialog.guid);
    }

    return {
      closeFolderDialog,
      minimizeFolderDialog,
    };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.action-icon {
  background-color: yellow;
  border-radius: 50px;
  width: 13px;
  height: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 5px;
}

.action-icon:hover {
  font-size: 12px;
  font-weight: 600;
  color: rgb(120, 120, 120);
}

.action-group {
  font-size: 0px;
  margin-right: 10px;
}

.action-group:hover {
  font-size: 12px;
  font-weight: 600;
  color: rgb(83, 83, 83);
}
</style>
