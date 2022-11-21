<template>
  <div @click.right="openActionMenu($event, true)" class="droppable" :id="itemDialog.path">
    <div class="folder-item-container" @mousedown="deselectItem" :style="`height:${height - 5}px`">
      <div class="folder-actions">
        <span v-for="(path, index) in filePathSplitted" :key="'path-' + index + '-' + path">
          <span class="path-item" @click="updateItemDialogPath(buildPath(filePathSplitted, index))">{{ path }}</span
          >{{ filePathSplitted.length > index + 1 ? " > " : "" }}
        </span>
      </div>

      <DropExternalFileZone :dropPath="itemDialog.path">
        <div
          @mouseover="isMouseOver = true"
          @mouseleave="isMouseOver = false"
          @drop="dropFilehandler"
          class="folder-item-list"
          :class="{ 'folder-item-list-drag-over': isDraggingItem && isMouseOver }"
          :style="`height:${height - 35}px`"
          ref="folderContentRef"
        >
          <span class="input-placeholder" ref="fileNameToChangeSpanRef">{{
            getFileNameFromPath(fileNameToChange)
          }}</span>

          <div
            id="drop_zone"
            class="folder-item"
            :class="{
              'folder-item-even': index % 2 === 1,
              'selected-item': item === selectedItem,
              'cut-item': isCutFile(item),
            }"
            v-for="(item, index) in itemDialog.filesPath"
            :key="`item-${index}-${item}`"
            @dblclick="doubleClickHandler(item)"
            @mousedown.stop="itemClickHandler(item)"
            @click.right="openActionMenu($event, false, item)"
          >
            <div class="flex-align-center" draggable="true" @dragstart="setFilesToMove([selectedItem])">
              <FileIcon :noStyle="true" :height="16" :filePath="item" />
              <div>
                <span v-if="item === selectedItem && isEditingSelectedValue">
                  <input
                    ref="fileNameInputRef"
                    class="file-text no-outline"
                    v-model="fileNameToChange"
                    @keyup.enter="changeFileName"
                    @blur="changeFileName"
                    @keyup.esc="isEditingSelectedValue = false"
                    type="text"
                    :style="`width:${fileFocusedWidth}px`"
                  />
                </span>
                <span v-else class="file-text noselect">{{ getFileNameFromPath(item) }}</span>
              </div>
            </div>
          </div>
        </div>
      </DropExternalFileZone>
    </div>
  </div>
</template>

<script lang="ts">
import { deleteFile, isDir, renameFile } from "@/context/fileSystemController";
import { computed, defineComponent, nextTick, onDeactivated, onMounted, PropType, ref, watch } from "vue";

import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";
import FileIcon from "@/components/shared/FileIcon.vue";
import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import { useFileSystemStore } from "@/stores/fileSystemStore";

import DesktopItem from "@/models/DesktopItem";
import ActionMenu from "@/models/ActionMenu";
import ItemDialog from "@/models/ItemDialog";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { DropExternalFileZone, FileIcon },
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();

    const folderContentRef = ref<HTMLElement | null>(null);
    const isMouseOver = ref(false as boolean);

    const { moveFilesInFolder, setFilesToMove } = useMoveFiles();

    const isDraggingItem = computed(function () {
      return fileSystemStore.dragginPath !== "";
    });

    const doubleClickHandler = async (fileName: string) => {
      const isDirectory = await isDir(fileName);
      if (isDirectory && !isEditingSelectedValue.value) {
        updateItemDialogPath(fileName);
      } else {
        const newItemDialog = {
          path: fileName,
          coordinates: { x: 0, y: 0 },

          isSelected: true,
        } as DesktopItem;
        fileSystemStore.createItemDialog(newItemDialog);
      }
    };

    const openActionMenu = (event: any, isOpenedFolder = false, customPath?: string) => {
      event.preventDefault();
      event.stopPropagation();
      const pointerEvent = event as PointerEvent;

      fileSystemStore.setActionMenu({
        show: true,
        paths: customPath ? [customPath] : [props.itemDialog?.path],
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        isOpenedFolder: isOpenedFolder,
      } as ActionMenu);
    };

    const dropFilehandler = async (event: Event) => {
      moveFilesInFolder(event, props.itemDialog?.path || "");
    };

    const updateItemDialogPath = (fileName: string) => {
      fileSystemStore.updateItemDialogName({ newPath: fileName, itemDialog: props.itemDialog as ItemDialog });
    };

    // *** ITEM SELECTION AND CHANGE NAME
    const selectedItem = ref("");
    const isEditingSelectedValue = ref(false);
    const fileNameToChange = ref("");
    const fileNameInputRef = ref(null);
    const fileNameToChangeSpanRef = ref(null);

    const fileFocusedWidth = ref(200);

    const isCutFile = (itemName: string) => {
      const filesToCut = fileSystemStore.filePathsToCut;
      if (filesToCut.includes(itemName)) {
        return true;
      }
      return false;
    };

    watch(fileNameToChange, async function (_2: any, _3: any) {
      await nextTick();
      if (!fileNameToChangeSpanRef.value) {
        fileFocusedWidth.value = 300;
      }
      fileFocusedWidth.value = Math.min(
        (fileNameToChangeSpanRef.value as unknown as HTMLElement).getBoundingClientRect().width,
        props.itemDialog ? props.itemDialog?.dimension.width - 30 : 200
      );
    });

    const itemClickHandler = async (fileName: string) => {
      if (!props.itemDialog?.isFocused) {
        fileSystemStore.setFocusedItemDialog(props.itemDialog as ItemDialog);
      }
      if (fileName === selectedItem.value) {
        if (!isEditingSelectedValue.value) {
          fileNameToChange.value = getFileNameFromPath(fileName);
          setTimeout(async () => {
            isEditingSelectedValue.value = !isEditingSelectedValue.value;
            await selectInputText();
          }, 600);
        }
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
      const newName = props.itemDialog?.path + "/" + fileNameToChange.value;
      if (newName !== selectedItem.value) {
        renameFile(newName, selectedItem.value);
        refreshFileSystemFiles();
      }
    };

    const refreshFileSystemFiles = () => {
      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();
    };

    // *** UTILITIES METHODS
    const filePathSplitted = computed(function () {
      return props.itemDialog?.path.split("/");
    });

    const buildPath = (fullPathSplitted: string[], index: number) => {
      let newPath = "";
      for (let i = 0; i <= index; i++) {
        if (i !== 0) {
          newPath += "/";
        }
        newPath += fullPathSplitted[i];
      }

      return newPath;
    };

    const keyDownHandler = (event: { code: string }) => {
      if (props.itemDialog?.isFocused && selectedItem.value) {
        if (event.code === "Delete" && props.itemDialog?.isFocused && selectedItem.value) {
          // delete item
          deleteFile(selectedItem.value);
          refreshFileSystemFiles();
        } else if (event.code === "ArrowDown") {
          const index = props.itemDialog.filesPath.findIndex((filePath) => filePath === selectedItem.value);
          if (index !== -1 && props.itemDialog.filesPath.length > index + 1) {
            selectedItem.value = props.itemDialog.filesPath[index + 1];
          }
        } else if (event.code === "ArrowUp") {
          const index = props.itemDialog.filesPath.findIndex((filePath) => filePath === selectedItem.value);
          if (index > 0) {
            selectedItem.value = props.itemDialog.filesPath[index - 1];
          }
        }
        //  else if (event.code === "ArrowRight") {
        //   doubleClickHandler(selectedItem.value);
        // }
      }
    };

    const checkMouseOver = (event: any) => {
      if (isDraggingItem.value) {
        const boundingRect = folderContentRef.value?.getBoundingClientRect();
        if (
          boundingRect &&
          event.clientX < boundingRect.x + boundingRect.width &&
          event.clientX > boundingRect.x &&
          event.clientY < boundingRect.y + boundingRect.height &&
          event.clientY > boundingRect.y
        ) {
          isMouseOver.value = true;
        } else {
          isMouseOver.value = false;
        }
      }
    };

    onMounted(() => {
      window.addEventListener("mousemove", checkMouseOver);

      window.addEventListener("keydown", keyDownHandler);
    });

    onDeactivated(() => {
      window.removeEventListener("keydown", keyDownHandler);

      window.removeEventListener("mousemove", checkMouseOver);
    });

    return {
      folderContentRef,
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
      openActionMenu,
      isCutFile,
      dropFilehandler,
      setFilesToMove,
      isDraggingItem,
      isMouseOver,
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
  height: 22px;
  margin: 0px 10px;
  border-radius: 7px;
  color: rgb(239, 238, 238);
  font-size: var(--medium-font-size);
  text-align: left;
  padding-left: 10px;
  padding-top: 3px;
}

.flex-align-center {
  align-content: center;
  cursor: pointer;
  display: flex;
}

.input-placeholder {
  font-size: var(--medium-font-size);
  visibility: hidden;
  position: absolute;
}

.folder-item-even {
  background-color: #86848463;
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

.extension-icon {
  font-size: 16px;
}

.cut-item {
  opacity: 0.5;
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
  border: 2px solid rgba(255, 255, 255, 0);
}

.folder-item-list-drag-over {
  border-radius: var(--border-radius);
  border: 2px solid var(--selected-color);
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
