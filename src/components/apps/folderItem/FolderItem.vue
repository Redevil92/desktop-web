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
          :style="`height:${height - 29}px`"
          ref="folderContentRef"
        >
          <FolderItemsList
            :itemsList="itemDialog.filesPath"
            :canRename="true"
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
    const isMouseOver = ref(false as boolean);

    const { moveFilesInFolder, setFilesToMove } = useMoveFiles();

    const isDraggingItem = computed(function () {
      return fileSystemStore.dragginPath !== "";
    });

    const doubleClickHandler = async (fileName: string) => {
      const isDirectory = await isDir(fileName);
      if (isDirectory) {
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

    const dropFilehandler = async (event: Event) => {
      moveFilesInFolder(event, props.itemDialog?.path || "");
    };

    const updateItemDialogPath = (fileName: string) => {
      fileSystemStore.updateItemDialogName({ newPath: fileName, itemDialog: props.itemDialog as ItemDialog });
    };

    const renameFileHandler = (fileNameToUpdate: { newName: string; oldName: string }) => {
      fileSystemStore.renameFile(fileNameToUpdate.newName, fileNameToUpdate.oldName);
      refreshFileSystemFiles();
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
      folderContentRef,
      filePathSplitted,
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

.folder-item-list {
  overflow-y: auto;
  border: 2px solid rgba(255, 255, 255, 0);
}

.folder-item-list-drag-over {
  border-radius: var(--border-radius);
  border: 2px solid var(--selected-color);
}
</style>
