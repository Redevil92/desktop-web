<template>
  <base-dialog v-if="showDialog">
    <div class="error-message">
      <img height="85" :src="require('/src/assets/icons/error-robot.svg')" alt="" />
      <div>{{ errorMessage }}</div>
      <BaseButton @click="showDialog = false" class="ok-button">OK</BaseButton>
    </div>
  </base-dialog>
  <div
    class="file-item desktop-item"
    ref="fileItemRef"
    :class="{ 'cut-file-item': isCutFile, droppable: isFolder }"
    :id="fileItem.path"
    :style="`top: ${fileItem.coordinates.y}px; left: ${fileItem.coordinates.x}px; z-index: ${zIndex}`"
    @dblclick="doubleClickHandler"
    @mousedown.stop="
      {
        selectFile(fileItem);
        startMoveItem($event);
      }
    "
    @mouseover="isMouseOver = true"
    @mouseleave="isMouseOver = false"
    @click.right="openActionMenu($event, fileItem)"
  >
    <div @click="isEditingText = false">
      <img
        :class="isSelected || (isDraggingItem && isMouseOver && isFolder) ? 'file-item-selected' : 'invisible-border'"
        v-if="isFolder"
        height="60"
        :src="require('/src/assets/fileIcons/folder.svg')"
        alt=""
      />
      <div v-else>
        <div v-if="fileExtension">
          <img
            :class="
              isSelected || (isDraggingItem && isMouseOver && isFolder) ? 'file-item-selected' : 'invisible-border'
            "
            height="60"
            :src="require('/src/assets/fileIcons/' + fileExtension + '.svg')"
            alt=""
          />
        </div>
        <div v-else>
          <img
            :class="
              isSelected || (isDraggingItem && isMouseOver && isFolder) ? 'file-item-selected' : 'invisible-border'
            "
            height="60"
            :src="require('/src/assets/fileIcons/unknow.svg')"
            alt=""
          />
        </div>
      </div>
    </div>
    <div
      :class="isSelected || (isDraggingItem && isMouseOver && isFolder) ? 'file-text-selected' : ''"
      class="file-text"
    >
      <div v-show="!isEditingText" class="file-text" @click="setIsEditingText">
        {{ fileName }}
      </div>
      <textarea
        v-show="isEditingText"
        ref="fileNameInputRef"
        @keyup.enter="changeFileName"
        @blur="changeFileName"
        rows="2"
        class="no-outline file-text"
        v-model="fileName"
      />

      <!-- {{ getFileNameFromPath(fileItem.path) }} -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onDeactivated, onMounted, PropType, ref, watch } from "vue";

import BaseDialog from "@/components/shared/BaseDialog.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import DesktopItem from "@/models/DesktopItem";

import { DESKTOP_PATH } from "@/constants";
import { existsFile, isDir, renameFile } from "@/context/fileSystemController";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import ActionMenu from "@/models/ActionMenu";
import Coordinates from "@/models/Coordinates";

import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import {
  renameDesktopFileInLocalStorage,
  saveSelectedDesktopItemsPositionInLocalStorage,
} from "@/hooks/useLocalStorage";

import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    fileItem: { type: Object as PropType<DesktopItem>, required: true },
    //isSelected: { type: Boolean, default: false },
  },
  components: { BaseDialog, BaseButton },
  emits: ["onClick", "onRightClick"],
  setup(props, context) {
    const fileSystemStore = useFileSystemStore();

    const fileName = ref(getFileNameFromPath(props.fileItem.path));

    const isEditingText = ref(false);
    const fileNameInputRef = ref(null);
    const showDialog = ref(false);
    const errorMessage = ref("");
    const isFolder = ref(false);
    const fileItemRef = ref(null as unknown as HTMLElement);
    const zIndex = ref(null as null | number);

    const isMouseOver = ref(false as boolean);
    const isDraggingItem = computed(function () {
      return fileSystemStore.dragginPath !== "";
    });

    const { moveFilesInFolderFromDesktop } = useMoveFiles();

    const isSelected = computed(function () {
      const index = selectedDesktopItems.value.findIndex(
        (desktopItem: DesktopItem) => desktopItem.path === props.fileItem.path
      );
      return index !== -1;
    });

    const selectedDesktopItems = computed((): DesktopItem[] => {
      return fileSystemStore.getSelectedDesktopFiles;
    });

    watch(
      () => isSelected.value,
      function () {
        isEditingText.value = false;
      }
    );

    const fileExtension = computed(function () {
      return getFileExtensionFromName(props.fileItem.path);
    });

    const isCutFile = computed(function () {
      const filesToCut = fileSystemStore.filePathsToCut;
      if (filesToCut.includes(props.fileItem.path)) {
        return true;
      }
      return false;
    });

    const setIsEditingText = async () => {
      if (isSelected.value) {
        isEditingText.value = true;
        await nextTick();
        (fileNameInputRef.value as unknown as HTMLElement).focus();
      }
    };

    const selectFile = (newFileSelected: DesktopItem) => {
      const index = selectedDesktopItems.value.findIndex((item) => item.path === newFileSelected.path);

      if (index === -1) {
        fileSystemStore.setSelectedDesktopFiles([
          { path: newFileSelected.path, coordinates: newFileSelected.coordinates },
        ] as DesktopItem[]);
      }
    };

    const openActionMenu = (event: any, item: DesktopItem) => {
      event.preventDefault();
      event.stopPropagation();
      const pointerEvent = event as PointerEvent;
      selectFile(item);
      fileSystemStore.setActionMenu({
        show: true,
        path: item.path,
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        isOpenedFolder: false,
      });
    };

    const clickHandler = () => {
      context.emit("onClick", props.fileItem);
    };

    const doubleClickHandler = () => {
      fileSystemStore.createItemDialog(props.fileItem);
    };

    const refreshFileSystemFiles = () => {
      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();
    };

    const changeFileName = async () => {
      fileName.value = fileName.value.replace(/[\n\r]/g, "");
      const newName = DESKTOP_PATH + "/" + fileName.value;

      if (isEditingText.value && newName !== props.fileItem.path) {
        if (await existsFile(newName)) {
          showDialog.value = true;
          errorMessage.value = `The name "${fileName.value}" is already taken. Please find a new one.`;
          isEditingText.value = false;
          fileName.value = getFileNameFromPath(props.fileItem.path);
          return;
        }

        if (newName !== props.fileItem.path && isEditingText.value) {
          const oldName = props.fileItem.path;
          renameFile(newName, oldName);
          refreshFileSystemFiles();
          renameDesktopFileInLocalStorage(oldName, newName);
        }
        isEditingText.value = false;
      }
    };

    let shiftX = 0,
      shiftY = 0;

    const startMoveItem = (e: any) => {
      e = e || window.event;
      e.preventDefault();

      fileSystemStore.setIsSelectionBoxEnabled(false);

      zIndex.value = fileSystemStore.getBigger_z_index + 1;

      shiftX = e.clientX - fileItemRef.value.getBoundingClientRect().left;
      shiftY = e.clientY - fileItemRef.value.getBoundingClientRect().top;

      fileSystemStore.setDragginPath(props.fileItem.path);

      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();

      const newX = e.clientX - shiftX;
      const newY = e.clientY - shiftY;

      const newPosition = { x: newX, y: newY } as Coordinates;

      //**** STORE */
      // var startTime = performance.now();
      // const fileItemToUpdate = Object.assign({}, props.fileItem);
      // fileItemToUpdate.coordinates = newPosition;

      // store.dispatch("fileSystem/CHANGE_DESKTOP_ITEM_POSITION", fileItemToUpdate);
      // var endTime = performance.now();
      // console.log(`METHOD :=> ${endTime - startTime} milliseconds`);

      // fileItemToUpdate.coordinates = newPosition;

      //**** NO STORE */ we are not using the store for performance reason
      var startTime = performance.now();
      const fileItemToUpdate = props.fileItem;
      const oldCoordinates = Object.assign({}, props.fileItem.coordinates) as Coordinates;

      if (selectedDesktopItems.value.length > 1) {
        console.log("Moving the others files");
        for (let i = 0; i < selectedDesktopItems.value.length; i++) {
          const offsetX = selectedDesktopItems.value[i].coordinates.x - oldCoordinates.x;
          const offsetY = selectedDesktopItems.value[i].coordinates.y - oldCoordinates.y;
          const positionWithOffset = { x: newPosition.x + offsetX, y: newPosition.y + offsetY };
          selectedDesktopItems.value[i].coordinates = positionWithOffset;
        }
      }

      fileItemToUpdate.coordinates = newPosition;

      var endTime = performance.now();
      console.log(`METHOD :=> ${endTime - startTime} milliseconds`);
    }

    async function closeDragElement(e: any) {
      zIndex.value = null;

      //let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      fileItemRef.value.hidden = true;

      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const currentDroppable = elementBelow?.closest(".droppable");

      const elementBelowPath = currentDroppable?.id;
      let isElementBelowSelected = false;
      if (elementBelowPath) {
        isElementBelowSelected = selectedDesktopItems.value.findIndex((item) => item.path === elementBelowPath) !== -1;
      }

      // check if element below is not selected, if yes dont drop
      if (elementBelow && currentDroppable && !isElementBelowSelected) {
        // get current droppable id (the id is the path where to drop the files selected)
        await moveFilesInFolderFromDesktop(e, currentDroppable.id);
      } else {
        saveSelectedDesktopItemsPositionInLocalStorage(selectedDesktopItems.value);
      }

      zIndex.value = null;

      fileItemRef.value.hidden = false;

      fileSystemStore.setIsSelectionBoxEnabled(true);
      fileSystemStore.setDragginPath("");
      document.onmouseup = null;
      document.onmousemove = null;
    }

    const checkMouseOver = (event: any) => {
      if (isDraggingItem.value) {
        const boundingRect = fileItemRef.value?.getBoundingClientRect();
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

    onMounted(async () => {
      isFolder.value = await isDir(props.fileItem.path);

      window.addEventListener("mousemove", checkMouseOver);
    });

    onDeactivated(() => {
      window.removeEventListener("mousemove", checkMouseOver);
    });

    return {
      doubleClickHandler,
      isFolder,
      getFileNameFromPath,
      clickHandler,
      fileExtension,
      fileName,
      changeFileName,
      setIsEditingText,
      isEditingText,
      fileNameInputRef,
      showDialog,
      errorMessage,
      isCutFile,
      selectFile,
      openActionMenu,
      startMoveItem,
      fileItemRef,
      zIndex,
      isDraggingItem,
      isMouseOver,
      isSelected,
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

  text-shadow: rgb(0 0 0 / 25%) 0px 0px 1px, rgb(0 0 0 / 20%) 0px 0px 2px, rgb(0 0 0 / 35%) 0px 1px 1px,
    rgb(0 0 0 / 20%) 0px 1px 2px, rgb(0 0 0 / 35%) 0px 2px 1px, rgb(0 0 0 / 20%) 0px 2px 2px;
}

.file-item {
  position: absolute;
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
  resize: none;
  border: 1px solid rgba(255, 255, 255, 0);
}

.no-outline:focus {
  border: 1px solid grey;
  outline: none;
  background-color: rgb(87, 163, 207);
}

.error-message {
  color: white;
  max-width: 400px;
  text-align: center;
}

.ok-button {
  margin-top: 20px;
  width: 100%;
}

.cut-file-item {
  opacity: 0.5;
}
</style>
