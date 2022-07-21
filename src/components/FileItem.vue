<template>
  <div class="file-item" @dblclick="doubleClickHandler" @click.stop="clickHandler" @click.right="rightClickHandler">
    <div :class="isSelected ? 'file-item-selected' : 'invisible-border'">
      <span v-if="isFolder(fileItem.name)" class="mdi mdi-folder-open folder-icon"></span>
      <div v-else>
        <div>
          <img height="50" :src="require('/src/assets/fileIcons/' + fileExtension + '.svg')" alt="" />
        </div>
        <!-- <span class="mdi mdi-file file-icon"></span> -->
      </div>
    </div>

    <div :class="isSelected ? 'file-text-selected' : ''" class="file-text">
      {{ getFileNameFromPath(fileItem.name) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import DesktopItem from "@/models/DesktopItem";

import store from "@/store";
import { getFileExtensionFromName, isDir } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    fileItem: { type: Object as PropType<DesktopItem>, required: true },
    isSelected: { type: Boolean, default: false },
  },
  components: {},
  emits: ["onClick", "onRightClick"],
  setup(props, context) {
    const fileExtension = computed(function () {
      return getFileExtensionFromName(props.fileItem.name);
    });

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

    return { doubleClickHandler, isFolder, getFileNameFromPath, clickHandler, rightClickHandler, fileExtension };
  },
});
</script>

<style scoped>
.file-text {
  font-size: var(--medium-font-size);
  color: rgb(255, 255, 255);

  font-weight: 600;
  line-height: 1.2;
  margin: 1px 0px;
  padding: 1px 1px;
  margin-top: 2px;

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

.invisible-border {
  border: 3px solid rgba(195, 195, 195, 0);
}

.file-item-selected {
  border: 3px solid rgb(195, 195, 195);
  border-radius: 3px;
  background-color: rgba(214, 214, 214, 0.553);
}

.file-text-selected {
  background-color: rgba(214, 214, 214, 0.553);
  border-radius: 3px;
  background-color: rgb(60, 60, 185);
}
</style>
