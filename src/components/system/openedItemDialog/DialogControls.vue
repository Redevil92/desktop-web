<template>
  <div class="flex action-group">
    <div
      class="mdi mdi-minus-thick action-icon"
      style="background-color: #e5d83c"
      @click.stop="minimizeFolderDialog"
    ></div>
    <div
      v-if="!itemDialog.isFullscreen"
      class="mdi mdi-crop-square action-icon"
      style="background-color: #36d936"
      @click.stop="setFolderDialogFullScreen(true)"
    ></div>
    <div
      v-else
      class="mdi mdi-checkbox-multiple-blank-outline action-icon action-icon-small"
      style="background-color: #36d936"
      @click.stop="setFolderDialogFullScreen(false)"
    ></div>
    <div
      class="mdi mdi-close-thick action-icon"
      style="background-color: #d64242"
      @click.stop="closeFolderDialog"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  },
  components: {},
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();

    const closeFolderDialog = () => {
      fileSystemStore.closeItemDialog(props.itemDialog.guid);
      fileSystemStore.findAndSetNewFocusedItemDialog();
    };

    const minimizeFolderDialog = () => {
      fileSystemStore.minimizeItemDialog(props.itemDialog.guid);
      fileSystemStore.findAndSetNewFocusedItemDialog();
    };

    const setFolderDialogFullScreen = (isFullscreen: boolean) => {
      fileSystemStore.setItemDialogFullScreen({ itemGuid: props.itemDialog.guid, isFullscreen });
    };

    return {
      closeFolderDialog,
      minimizeFolderDialog,
      setFolderDialogFullScreen,
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
  font-size: 11px;
  font-weight: 600;
  color: rgb(120, 120, 120);
}

.action-group {
  font-size: 0px;
  margin-right: 10px;
}

.action-group:hover {
  font-size: 11px;
  font-weight: 600;
  color: rgb(83, 83, 83);
}
</style>
