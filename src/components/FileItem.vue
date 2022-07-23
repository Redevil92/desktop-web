<template>
  <div class="file-item" @dblclick="doubleClickHandler" @click.stop="clickHandler" @click.right="rightClickHandler">
    <div @click="isEditingText = false">
      <img
        :class="isSelected ? 'file-item-selected' : 'invisible-border'"
        v-if="isFolder(fileItem.name)"
        height="60"
        :src="require('/src/assets/fileIcons/folder.svg')"
        alt=""
      />
      <div v-else>
        <div>
          <img
            :class="isSelected ? 'file-item-selected' : 'invisible-border'"
            height="60"
            :src="require('/src/assets/fileIcons/' + fileExtension + '.svg')"
            alt=""
          />
        </div>
      </div>
    </div>

    <div :class="isSelected ? 'file-text-selected' : ''" class="file-text">
      <!-- @click.stop=""
        @keyup.enter="changeFileName"
        @blur="changeFileName"
        @keyup.esc="isEditingSelectedValue = false" -->
      <textarea
        ref="fileNameInputRef"
        @click="setIsEditingText"
        @keyup.enter="changeFileName"
        @blur="changeFileName"
        :disabled="!isEditingText && !isSelected"
        rows="2"
        class="no-outline file-text"
        v-model="fileName"
      />
      <!-- {{ getFileNameFromPath(fileItem.name) }} -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

import DesktopItem from "@/models/DesktopItem";

import store from "@/store";
import {
  DESKTOP_PATH,
  getFileExtensionFromName,
  getFileNameFromPath,
  isDir,
  renameFile,
} from "@/context/fileSystemController";

export default defineComponent({
  props: {
    fileItem: { type: Object as PropType<DesktopItem>, required: true },
    isSelected: { type: Boolean, default: false },
  },
  components: {},
  emits: ["onClick", "onRightClick"],
  setup(props, context) {
    const fileName = ref(getFileNameFromPath(props.fileItem.name));
    const isEditingText = ref(false);

    const fileExtension = computed(function () {
      return getFileExtensionFromName(props.fileItem.name);
    });

    const isFolder = (filePath: string) => {
      return isDir(filePath);
    };

    const setIsEditingText = () => {
      if (props.isSelected) {
        isEditingText.value = true;
      }
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

    const changeFileName = () => {
      const newName = DESKTOP_PATH + "/" + fileName.value;
      if (newName !== props.fileItem.name) {
        renameFile(newName, props.fileItem.name);
        store.dispatch("fileSystem/FETCH_DESKTOP_FILES", {});
      }
    };

    return {
      doubleClickHandler,
      isFolder,
      getFileNameFromPath,
      clickHandler,
      rightClickHandler,
      fileExtension,
      fileName,
      changeFileName,
      setIsEditingText,
    };
  },
});
</script>

<style scoped>
.file-text {
  font-size: var(--small-font-size);
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
  font-family: inherit;
  text-align: center;
  width: 100%;
}

.file-item {
  height: 120px;
  width: 100px;
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
  padding: 3px;
}

.file-item-selected {
  border: 3px solid rgb(195, 195, 195);
  border-radius: 3px;
  padding: 3px;
  background-color: rgba(214, 214, 214, 0.553);
}

.file-text-selected {
  background-color: rgba(214, 214, 214, 0.553);
  border-radius: 3px;
  background-color: var(--selected-color);
}

.no-outline {
  background-color: rgba(255, 255, 255, 0);
}

.no-outline:focus {
  outline: none;
}
</style>
