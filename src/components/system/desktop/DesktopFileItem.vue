<template>
  <base-dialog v-if="showDialog">
    <div class="error-message">
      <img height="85" :src="require('/src/assets/icons/error-robot.svg')" alt="" />
      <div>{{ errorMessage }}</div>
      <BaseButton @clicks="showDialog = false" class="ok-button">OK</BaseButton>
    </div>
  </base-dialog>
  <!-- do not remove 'desktop-item' class, because it is used by DesktopWorkSpace to get the selected elements -->
  <div
    class="file-item desktop-item"
    ref="fileItemRef"
    :class="{ 'cut-file-item': isCutFile, droppable: isFolder }"
    :id="fileItem.path"
    :style="`top: ${fileItem.coordinates.y}px; left: ${fileItem.coordinates.x}px; z-index: ${zIndex}`"
    @dblclick="openFileItem"
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
      <FileIcon
        :selected="isSelected || (isDraggingItem && isMouseOver && isFolder)"
        :height="60"
        :filePath="fileItem.path"
      />
    </div>
    <div
      :class="isSelected || (isDraggingItem && isMouseOver && isFolder) ? 'file-text-preview-selected' : ''"
      class="file-text-preview"
    >
      <div v-show="!isEditingText" class="file-text-preview" @click="setIsEditingText">
        {{ fileName }}
      </div>
      <textarea
        v-show="isEditingText"
        ref="fileNameInputRef"
        @keyup.enter="changeFileName"
        @blur="changeFileName"
        rows="2"
        class="no-outline file-text-preview"
        v-model="fileName"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, PropType, ref, watch } from "vue";

import BaseDialog from "@/components/shared/BaseDialog.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import FileIcon from "@/components/shared/FileIcon.vue";
import DesktopItem from "@/models/DesktopItem";

import { DESKTOP_PATH } from "@/constants";
import fileSystem from "@/context/fileSystemController";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/utils/fileSystemUtils";
import Coordinates from "@/models/Coordinates";

import useMoveFiles from "@/hooks/useMoveFilesIntoFolders";
import {
  renameDesktopFileInLocalStorage,
  saveSelectedDesktopItemsPositionInLocalStorage,
} from "@/hooks/useLocalStorage";

import { useFileSystemStore } from "@/stores/fileSystemStore";
import fileTypesConfiguration from "@/models/FilesType";
import { getFileActions } from "../actionMenu/fileActions";
import ActionItem from "@/models/ActionMenu/ActionItem";

const props = defineProps({
  fileItem: { type: Object as PropType<DesktopItem>, required: true },
  //isSelected: { type: Boolean, default: false },
});

const emit = defineEmits(["onClick", "onRightClick"]);

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
  return fileSystemStore.getSelectedDesktopItems;
});

watch(
  () => isSelected.value,
  function () {
    isEditingText.value = false;
  }
);

watch(
  () => props.fileItem.path,
  function () {
    fileName.value = getFileNameFromPath(props.fileItem.path);
  }
);

const fileExtension = computed(function () {
  return getFileExtensionFromName(props.fileItem.path);
});

const isKnownFileExtension = computed(function () {
  const fileTypeConfiguration = fileTypesConfiguration[getFileExtensionFromName(props.fileItem.path)];
  return fileTypeConfiguration && fileTypeConfiguration.icon;
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
  fileSystemStore.setFocusedItemDialog(null);
  const index = selectedDesktopItems.value.findIndex((item) => item.path === newFileSelected.path);

  if (index === -1) {
    fileSystemStore.setSelectedDesktopFiles([
      { path: newFileSelected.path, coordinates: newFileSelected.coordinates },
    ] as DesktopItem[]);
  }
};

const openActionMenu = async (event: any, item: DesktopItem) => {
  event.preventDefault();
  event.stopPropagation();
  const pointerEvent = event as PointerEvent;
  selectFile(item);

  let desktopFileActions = [
    ...((await getFileActions(fileSystemStore.getSelectedDesktopItemsPath, event)).filter(
      (action) => action !== undefined
    ) as ActionItem[]),
  ];

  // TODO: based on the type of the element add new custom actions
  // I should add the custom actions in filesType
  const itemExtension = getFileExtensionFromName(item.path);
  const fileTypeConfiguration = fileTypesConfiguration[itemExtension];

  if (fileTypeConfiguration?.additionalActions) {
    desktopFileActions = desktopFileActions.concat(
      fileTypeConfiguration.additionalActions.map((action) => action(item.path))
    );
  }
  if (desktopFileActions) {
    fileSystemStore.setActionMenu({
      show: true,
      paths: fileSystemStore.getSelectedDesktopItemsPath,
      position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
      customLayout: desktopFileActions,
    });
  }
};

const clickHandler = () => {
  emit("onClick", props.fileItem);
};

const openFileItem = () => {
  for (const desktopItem of fileSystemStore.getSelectedDesktopItems) {
    fileSystemStore.createItemDialog(desktopItem);
  }
};

const refreshFileSystemFiles = () => {
  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();
};

const changeFileName = async () => {
  fileName.value = fileName.value.replace(/[\n\r]/g, "");
  const newName = DESKTOP_PATH + "/" + fileName.value;

  if (isEditingText.value && newName !== props.fileItem.path) {
    if (await fileSystem.existsFile(newName)) {
      showDialog.value = true;
      errorMessage.value = `The name "${fileName.value}" is already taken. Please find a new one.`;
      isEditingText.value = false;
      fileName.value = getFileNameFromPath(props.fileItem.path);
      return;
    }

    if (newName !== props.fileItem.path && isEditingText.value) {
      const oldName = props.fileItem.path;
      fileSystemStore.renameFile(newName, oldName);
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
    for (let i = 0; i < selectedDesktopItems.value.length; i++) {
      const offsetX = selectedDesktopItems.value[i].coordinates.x - oldCoordinates.x;
      const offsetY = selectedDesktopItems.value[i].coordinates.y - oldCoordinates.y;
      const positionWithOffset = { x: newPosition.x + offsetX, y: newPosition.y + offsetY };
      selectedDesktopItems.value[i].coordinates = positionWithOffset;
    }
  }

  fileItemToUpdate.coordinates = newPosition;

  var endTime = performance.now();
  // console.log(`METHOD :=> ${endTime - startTime} milliseconds`);
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
  isFolder.value = await fileSystem.isDir(props.fileItem.path);

  window.addEventListener("mousemove", checkMouseOver);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", checkMouseOver);
});
</script>

<style scoped>
@import "@/css/fileItemPreview.css";

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
