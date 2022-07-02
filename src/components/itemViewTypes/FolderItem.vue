<template>
  <div>
    <div class="folder-item-container" @click="deselectItem" :style="`height:${height - 5}px`">
      <div class="flex folder-actions">
        <span v-for="(path, index) in filePathSplitted" :key="'path-' + index + '-' + path">
          <span class="path-item" @click="updateItemDialogPath(buildPath(filePathSplitted, index))">{{ path }} </span>
          <span v-if="filePathSplitted.length > index + 1"> > </span>
        </span>
      </div>
      <div class="folder-item-list" :style="`height:${height - 35}px`">
        <div
          class="folder-item"
          :class="{ 'folder-item-odd': index % 2 === 0, 'selected-item': item === selectedItem }"
          v-for="(item, index) in folderDialog.filesPath"
          :key="`item-${index}-${item}`"
          @dblclick="doubleClickHandler(item)"
          @click.stop="itemClickHandler(item)"
        >
          <span class="mdi mdi-folder extension-icon" v-if="isDir(item)"></span>
          <span
            class="mdi mdi-file-word extension-icon"
            style="color: #01014a"
            v-else-if="getFileExtensionFromName(item)"
          ></span>
          <span class="mdi mdi-file-quesion extension-icon" style="color: #01014a" v-else></span>
          <span v-if="item === selectedItem && isEditingSelectedValue">
            <input
              ref="fileNameInputRef"
              class="file-text no-outline"
              v-model="fileNameToChange"
              @click.stop=""
              @keyup.enter="changeFileName"
              @keyup.esc="isEditingSelectedValue = false"
              type="text"
            />
          </span>
          <span v-else class="file-text">{{ getFileNameFromPath(item) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getFileExtensionFromName, getFileNameFromPath, isDir, renameFile } from "@/context/fileSystemController";
import { computed, defineComponent, nextTick, PropType, ref } from "vue";

import store from "@/store";
import { FolderDialog } from "@/models/ItemDialog";

export default defineComponent({
  props: {
    folderDialog: Object as PropType<FolderDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    // *** UPDATE FOLDER DIALOG AND OPEN NEW FILES
    const doubleClickHandler = (fileName: string) => {
      // check if file is dir
      const isFolder = isDir(fileName);
      if (isFolder) {
        updateItemDialogPath(fileName);
      }
      // if dir update current item dialog
      // else open a new one
    };

    const updateItemDialogPath = (fileName: string) => {
      store.dispatch("fileSystem/UPDATE_ITEM_DIALOG_NAME", { newPath: fileName, itemDialog: props.folderDialog });
    };

    // *** ITEM SELECTION AND CHANGE NAME
    const selectedItem = ref("");
    const isEditingSelectedValue = ref(false);
    const fileNameToChange = ref("");
    const fileNameInputRef = ref(null);

    const itemClickHandler = async (fileName: string) => {
      if (fileName === selectedItem.value) {
        fileNameToChange.value = getFileNameFromPath(fileName);
        setTimeout(async () => {
          isEditingSelectedValue.value = !isEditingSelectedValue.value;
          await selectInputText();
        }, 200);

        return;
      }

      selectedItem.value = fileName;
      isEditingSelectedValue.value = false;
    };

    const deselectItem = () => {
      selectedItem.value = "";
      isEditingSelectedValue.value = false;
    };

    const selectInputText = async () => {
      await nextTick();
      if (fileNameInputRef.value) {
        console.log("INPUT REF", fileNameInputRef.value);
      }
    };

    const changeFileName = () => {
      const newName = props.folderDialog?.name + "/" + fileNameToChange.value;
      renameFile(newName, selectedItem.value);
      //isEditingSelectedValue.value = false;

      store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES", {});
      store.dispatch("fileSystem/FETCH_DESKTOP_FILES", {});
    };

    // *** UTILITIES METHODS
    const filePathSplitted = computed(function () {
      return props.folderDialog?.name.split("/");
    });

    const buildPath = (fullPathSplitted: string[], index: number) => {
      let newPath = "";
      for (let i = 0; i <= index; i++) {
        if (i !== 0) {
          newPath += "/";
        }
        newPath += fullPathSplitted[i];
      }
      console.log(newPath);
      return newPath;
    };

    return {
      getFileNameFromPath,
      doubleClickHandler,
      isDir,
      getFileExtensionFromName,
      filePathSplitted,
      updateItemDialogPath,
      buildPath,
      selectedItem,
      itemClickHandler,
      isEditingSelectedValue,
      fileNameToChange,
      deselectItem,
      fileNameInputRef,
      changeFileName,
    };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.folder-item {
  background-color: #868484;
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

.folder-actions {
  font-size: var(--medium-font-size);
  background-color: rgb(110, 110, 110);
  color: white;
  padding: 5px 10px;
  font-weight: 600;
}

.path-item {
  cursor: pointer;
}

.path-item:hover {
  text-decoration: underline white;
}

.selected-item {
  background-color: rgb(60, 60, 185) !important;
}

input {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: none;
  background-color: #5e5e5e;
  color: white;
  outline: 3px solid #5353e8;
  border-radius: 3px;
  text-decoration: none;
}

.no-outline:focus {
  outline: none;
}

.folder-item-list {
  overflow-y: auto;
}
</style>
