<template>
  <div class="file-item" @dblclick="doubleClickHandler" @click="clickHandler" @click.right="rightClickHandler">
    <span v-if="isFolder(fileItem.name)" class="mdi mdi-folder-open folder-icon"></span>
    <div v-else>
      <span class="mdi mdi-file file-icon"></span>
    </div>
    <div class="file-text">{{ getFileNameFromPath(fileItem.name) }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import DesktopItem from "@/models/DesktopItem";

import store from "@/store";
import { isDir } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    fileItem: { type: Object as PropType<DesktopItem>, required: true },
    isSelected: { type: Boolean, default: false },
  },
  components: {},
  emits: ["onClick", "onRightClick"],
  setup(props, context) {
    const getFileNameFromPath = (path: string) => {
      const filesName = path.split("/");
      return filesName[filesName.length - 1];
    };

    const isFolder = (filePath: string) => {
      return isDir(filePath);
    };

    const clickHandler = () => {
      context.emit("onClick", props.fileItem);
    };

    const doubleClickHandler = () => {
      store.dispatch("fileSystem/ADD_ITEM_DIALOG", props.fileItem);
    };

    const rightClickHandler = () => {
      context.emit("onRightClick");
    };

    return { doubleClickHandler, isFolder, getFileNameFromPath, clickHandler, rightClickHandler };
  },
});
</script>

<style scoped>
.file-text {
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

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.file-item {
  height: 70px;
  width: 74px;
  text-align: -webkit-center;
}

.folder-icon {
  color: #f6d573;
  font-size: 45px;
}

.file-icon {
  font-size: 45px;
}
</style>
