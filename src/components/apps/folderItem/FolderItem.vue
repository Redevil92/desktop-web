<template>
  <div @click.right="openActionMenu($event, true)" class="droppable" :id="itemDialog.path">
    <div @mousedown="deselectItem" :style="`height:${height - 5}px`">
      <div class="folder-actions" @click="showPathAsText = true">
        <div v-show="showPathAsText" class="flex">
          <div class="mdi mdi-folder path-padding"></div>
          <input
            ref="fullPathInputRef"
            class="no-style-input path-input"
            v-model="pathToEdit"
            @keyup.enter="updateItemDialogPath(pathToEdit)"
            @blur="resetPathInput"
            @keyup.esc="resetPathInput"
            type="text"
          />
        </div>
        <div v-show="!showPathAsText" class="flex" @mousedown="setShowPathAsText(true)">
          <span class="mdi mdi-folder path-padding"></span>
          <span class="mdi mdi-chevron-right path-padding"></span>
          <div v-for="(path, index) in filePathSplitted" :key="'path-' + index + '-' + path" class="flex">
            <div
              class="path-item path-padding"
              @mousedown.stop
              @click.stop="updateItemDialogPath(buildPath(filePathSplitted, index))"
            >
              {{ path }}
            </div>
            <span v-if="filePathSplitted.length > index + 1" class="mdi mdi-chevron-right path-padding"></span>
          </div>
        </div>
      </div>

      <DropExternalFileZone :dropPath="itemDialog.path">
        <div
          @mousedown="showPathAsText = false"
          @mouseover="isMouseOver = true"
          @mouseleave="isMouseOver = false"
          @drop="dropFilehandler"
          class="folder-item-list"
          :class="{ 'folder-item-list-drag-over': isDraggingItem && isMouseOver }"
          :style="`height:${height - 29}px`"
          ref="folderContentRef"
        >
          <FolderItemsList
            :itemsList="itemDialog.filesPath"
            :canRename="true"
            :showProperties="true"
            :isFocused="itemDialog.isFocused"
            @onDoubleClick="doubleClickHandler"
            @onRightClick="rightClickItemHandler"
            @renameFileHandler="renameFileHandler"
            @onTryDeleteItem="tryDeleteItem"
          />
        </div>
      </DropExternalFileZone>
    </div>
  </div>
</template>

<script lang="ts">
import { isDir } from "@/context/fileSystemController";
import { computed, defineComponent, nextTick, onDeactivated, onMounted, PropType, ref, watch } from "vue";

import DropExternalFileZone from "@/components/shared/DropExtenalFilesZone.vue";
import FolderItemsList from "@/components/apps/folderItem/FolderItemsList.vue";

import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
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
  components: { DropExternalFileZone, FolderItemsList },
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();

    const folderContentRef = ref<HTMLElement | null>(null);
    const fullPathInputRef = ref<HTMLInputElement | null>(null);
    const isMouseOver = ref(false as boolean);
    const showPathAsText = ref(false);
    const pathToEdit = ref(props.itemDialog?.path);

    const { moveFilesInFolder, setFilesToMove } = useMoveFiles();

    const isDraggingItem = computed(function () {
      return fileSystemStore.dragginPath !== "";
    });

    const doubleClickHandler = async (filePath: string) => {
      const isDirectory = await isDir(filePath);
      if (isDirectory) {
        updateItemDialogPath(filePath);
      } else {
        const newItemDialog = {
          path: filePath,
          coordinates: { x: 0, y: 0 },

          isSelected: true,
        } as DesktopItem;
        fileSystemStore.createItemDialog(newItemDialog);
      }
    };

    const rightClickItemHandler = (eventAndPath: { event: Event; filePath: string }) => {
      openActionMenu(eventAndPath.event, false, eventAndPath.filePath);
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

    const resetPathInput = () => {
      setShowPathAsText(false);
      pathToEdit.value = props.itemDialog?.path;
    };

    const dropFilehandler = async (event: Event) => {
      moveFilesInFolder(event, props.itemDialog?.path || "");
    };

    const updateItemDialogPath = (fileName: string) => {
      fileSystemStore.updateItemDialogPath({ newPath: fileName, itemDialog: props.itemDialog as ItemDialog });
      pathToEdit.value = fileName;
    };

    const renameFileHandler = (fileNameToUpdate: { newName: string; oldName: string }) => {
      fileSystemStore.renameFile(fileNameToUpdate.newName, fileNameToUpdate.oldName);
      refreshFileSystemFiles();
    };

    const setShowPathAsText = async (value: boolean) => {
      if (value && fullPathInputRef.value) {
        setTimeout(() => {
          fullPathInputRef.value?.focus();
          fullPathInputRef.value?.select();
        }, 10);
      }
      showPathAsText.value = value;
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

    const tryDeleteItem = async (filePath: string) => {
      await fileSystemStore.deleteFileSystemItem(filePath);
      refreshFileSystemFiles();
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
    });

    onDeactivated(() => {
      window.removeEventListener("mousemove", checkMouseOver);
    });

    return {
      showPathAsText,
      folderContentRef,
      filePathSplitted,
      isDraggingItem,
      isMouseOver,
      fullPathInputRef,
      pathToEdit,
      resetPathInput,
      setShowPathAsText,
      getFileNameFromPath,
      doubleClickHandler,
      tryDeleteItem,
      isDir,
      getFileExtensionFromName,
      updateItemDialogPath,
      buildPath,
      rightClickItemHandler,
      renameFileHandler,
      openActionMenu,
      dropFilehandler,
      setFilesToMove,
    };
  },
});
</script>

<style scoped>
@import "@/css/input.css";

.flex {
  display: flex;
  align-items: center;
}

.text-path {
  margin-left: 5px;
}

.folder-actions {
  font-size: var(--medium-font-size);
  background-color: rgb(110, 110, 110);
  color: var(--font-color);
  padding: 0px 10px;
  text-align: left;
  white-space: nowrap;
  overflow-x: auto;
  margin: 5px;
}

.path-padding {
  padding: 5px 2px;
}

.path-item {
  cursor: pointer;
}

.path-item:hover {
  text-decoration: none;
  background-color: var(--selected-color);
}

.folder-item-list {
  overflow-y: auto;
  border: 2px solid rgba(255, 255, 255, 0);
}

.folder-item-list-drag-over {
  border-radius: var(--border-radius);
  border: 2px solid var(--selected-color);
}

.path-input {
  color: var(--font-color);
  width: 100%;
}
</style>
