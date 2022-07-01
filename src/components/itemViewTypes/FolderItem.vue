<template>
  <div>
    <div class="folder-item-container">
      <div class="flex folder-actions"></div>

      <div
        :class="index % 2 === 0 ? 'folder-item folder-item-odd' : 'folder-item'"
        v-for="(item, index) in folderDialog.filesPath"
        :key="`item-${index}-${item}`"
        @dblclick="doubleClickHandler(item)"
      >
        <span class="mdi mdi-folder extension-icon" v-if="isDir(item)"></span>
        <span
          class="mdi mdi-file-word extension-icon"
          style="color: #01014a"
          v-else-if="getFileExtensionFromName(item)"
        ></span>
        <span class="mdi mdi-file-quesion extension-icon" style="color: #01014a" v-else></span>
        <span class="file-text">{{ getFileNameFromPath(item) }}</span>
      </div>
    </div>

    <!-- GET ALL ELEMENTS -->
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import { getFileExtensionFromName, getFileNameFromPath, isDir } from "@/context/fileSystemController";
import { defineComponent, PropType } from "vue";

import store from "@/store";
import { FolderDialog } from "@/models/ItemDialog";

export default defineComponent({
  props: {
    folderDialog: Object as PropType<FolderDialog>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const doubleClickHandler = (fileName: string) => {
      console.log("double clk", fileName);
      // check if file is dir
      const isFolder = isDir(fileName);
      if (isFolder) {
      }
      // if dir update current item dialog
      // else open a new one
      store.dispatch("fileSystem/UPDATE_ITEM_DIALOG_NAME", { newPath: fileName, itemDialog: props.folderDialog });
    };

    return { getFileNameFromPath, doubleClickHandler, isDir, getFileExtensionFromName };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.folder-item {
  background-color: rgb(112, 112, 112);
  height: 22px;
  margin: 0px 10px;
  border-radius: 7px;
  color: rgb(239, 238, 238);
  font-size: var(--medium-font-size);
  text-align: left;
  padding-left: 10px;
  align-content: center;
  cursor: pointer;
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

.file-icon {
  height: 12px;
  width: 12px;
  margin-right: 7px;
}

.extension-icon {
  font-size: 16px;
}

.file-text {
  margin-left: 10px;
}
</style>
