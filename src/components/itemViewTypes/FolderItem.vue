<template>
  <ActionsDialogBox :path="folderDialog.name" :position="actionDialogPos" :show="showActionsDialog"></ActionsDialogBox>

  <div :ref="`folderRef`">
    <div class="folder-item-container" @click="deselectItem" :style="`height:${height - 5}px`">
      <div class="folder-actions">
        <span v-for="(path, index) in filePathSplitted" :key="'path-' + index + '-' + path">
          <span class="path-item" @click="updateItemDialogPath(buildPath(filePathSplitted, index))">{{ path }}</span
          >{{ filePathSplitted.length > index + 1 ? " > " : "" }}
        </span>
      </div>
      <div class="folder-item-list" :style="`height:${height - 35}px`">
        <span class="input-placeholder" ref="fileNameToChangeSpanRef">{{ getFileNameFromPath(fileNameToChange) }}</span>
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
              @blur="changeFileName"
              @keyup.esc="isEditingSelectedValue = false"
              type="text"
              :style="`width:${fileFocusedWidth}px`"
            />
          </span>
          <span v-else class="file-text">{{ getFileNameFromPath(item) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  deleteFile,
  getFileExtensionFromName,
  getFileNameFromPath,
  isDir,
  renameFile,
} from "@/context/fileSystemController";
import { computed, defineComponent, nextTick, onDeactivated, onMounted, PropType, ref } from "vue";

import ActionsDialogBox from "@/components/ActionsDialogBox.vue";

import store from "@/store";
import { FolderDialog } from "@/models/ItemDialog";
import Coordinates from "@/models/Coordinates";

export default defineComponent({
  props: {
    folderDialog: Object as PropType<FolderDialog>,
    height: Number,
  },
  components: { ActionsDialogBox },
  emits: [],
  setup(props, _) {
    const folderRef = ref({} as HTMLElement);
    const actionDialogPos = ref({ x: 0, y: 0 } as Coordinates);
    const showActionsDialog = ref(false);

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
    const fileNameToChangeSpanRef = ref(null);

    const fileFocusedWidth = computed(function (): number {
      console.log(selectedItem.value, fileNameToChange.value);
      if (!fileNameToChangeSpanRef.value) {
        return 200;
      }
      return Math.min(
        (fileNameToChangeSpanRef.value as HTMLElement).getBoundingClientRect().width,
        props.folderDialog ? props.folderDialog?.dimension.width - 30 : 200
      );
    });

    const itemClickHandler = async (fileName: string) => {
      if (!props.folderDialog?.isFocused) {
        store.dispatch("fileSystem/SET_FOCUSED_ITEM_DIALOG", props.folderDialog);
      }
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
      setTimeout(async () => {
        if (fileNameInputRef.value) {
          console.log("INPUT REF", fileNameInputRef.value);
        }
      }, 2000);
    };

    const changeFileName = () => {
      const newName = props.folderDialog?.name + "/" + fileNameToChange.value;
      if (newName !== selectedItem.value) {
        renameFile(newName, selectedItem.value);
        refreshFileSystemFiles();
      }
    };

    const refreshFileSystemFiles = () => {
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

    const deleteFileHandler = (event: { code: string }) => {
      console.log(event.code);
      if (props.folderDialog?.isFocused && selectedItem.value) {
        if (event.code === "Delete" && props.folderDialog?.isFocused && selectedItem.value) {
          // delete item
          deleteFile(selectedItem.value);
          refreshFileSystemFiles();
        } else if (event.code === "ArrowDown") {
          const index = props.folderDialog.filesPath.findIndex((filePath) => filePath === selectedItem.value);
          if (index !== -1 && props.folderDialog.filesPath.length > index + 1) {
            selectedItem.value = props.folderDialog.filesPath[index + 1];
          }
        } else if (event.code === "ArrowUp") {
          const index = props.folderDialog.filesPath.findIndex((filePath) => filePath === selectedItem.value);
          if (index > 0) {
            selectedItem.value = props.folderDialog.filesPath[index - 1];
          }
        } else if (event.code === "ArrowRight") {
          doubleClickHandler(selectedItem.value);
        }
      }
    };

    const openActionsDialog = (event: Event) => {
      const pointerEvent = event as PointerEvent;
      event.stopPropagation();
      event.preventDefault();

      actionDialogPos.value = { x: pointerEvent.clientX, y: pointerEvent.clientY };
      showActionsDialog.value = true;
    };

    const closeActionDialog = () => {
      showActionsDialog.value = false;
    };

    onMounted(() => {
      console.log(1, folderRef.value);
      folderRef.value.addEventListener("keydown", deleteFileHandler);

      folderRef.value.addEventListener("contextmenu", openActionsDialog);
      folderRef.value.addEventListener("click", closeActionDialog);
    });

    onDeactivated(() => {
      folderRef.value.removeEventListener("keydown", deleteFileHandler);

      folderRef.value.removeEventListener("contextmenu", openActionsDialog);
      folderRef.value.removeEventListener("click", closeActionDialog);
    });

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
      fileNameToChangeSpanRef,
      fileFocusedWidth,
      folderRef,
      actionDialogPos,
      showActionsDialog,
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

.input-placeholder {
  font-size: var(--medium-font-size);
  visibility: hidden;
  position: absolute;
}

.folder-item-odd {
  background-color: var(--dialog-background-color_dark) !important;
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
  text-align: left;
  white-space: nowrap;
  overflow-x: auto;
}

.path-item {
  cursor: pointer;
}

.path-item:hover {
  text-decoration: underline white;
}

.selected-item {
  background-color: var(--selected-color) !important;
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
