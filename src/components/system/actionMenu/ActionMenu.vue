<template>
  <div
    v-if="actionMenuParams && actionMenuParams.show && actionMenuParams.position && isFolder !== undefined"
    :style="`top: ${actionMenuParams.position.y}px; left: ${actionMenuParams.position.x}px;`"
    class="actions-dialog padding"
  >
    <div v-if="(isFolder && actionMenuParams.isOpenedFolder) || isDesktop">
      <div class="action-button" @click="createFile">New file</div>
      <div class="action-button" @click="createFile($event, true)">New folder</div>
      <div :class="{ 'disabled-action-button': !canPasteFiles, 'action-button': canPasteFiles }" @click="pasteFiles">
        Paste
      </div>
      <div v-if="isDesktop">
        <hr class="" />
        <div class="action-button" @click="openDesktopSettingPage">Change desktop image</div>
      </div>
    </div>

    <div v-if="!isFolder">
      <div class="action-button" @click="openFile">Open</div>
      <!-- <div class="action-button">Open with</div> -->
      <hr class="" />
      <div class="action-button" @click="cutFiles">Cut</div>
      <div class="action-button" @click="copyFiles">Copy</div>
    </div>

    <div v-if="!actionMenuParams.isOpenedFolder && !isDesktop">
      <div class="action-button" @click="deleteFileSystemItems">Delete</div>
      <div class="action-button" @click="addNewFolder">Rename</div>
      <!-- <div class="action-button" @click="addNewFolder">Create shortcut</div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { DESKTOP_PATH } from "@/constants";
import { isDir } from "@/context/fileSystemController";
import { generateUniqueName } from "@/context/fileSystemUtils";
import Coordinates from "@/models/Coordinates";
import DesktopItem from "@/models/DesktopItem";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { defineComponent, ref, computed, watch, onMounted, onDeactivated } from "vue";

export default defineComponent({
  components: {},
  emits: ["onAddNewFile", "onAddNewFolder"],
  setup(_, context) {
    const fileSystemStore = useFileSystemStore();

    const isFolder = ref<boolean | undefined>();

    // props -> path
    const actionMenuParams = computed(function () {
      return fileSystemStore.actionMenu;
    });

    watch(actionMenuParams, async function (_2, _3) {
      if (actionMenuParams.value.paths) {
        if (actionMenuParams.value.paths.length === 1) {
          isFolder.value = await isDir(actionMenuParams.value.paths[0] || "");
        } else {
          isFolder.value = false;
        }
      }
    });

    const canPasteFiles = computed(() => {
      const filePathsToCopy: string[] = fileSystemStore.filePathsToCopy;
      const filePathsToCut: string[] = fileSystemStore.filePathsToCut;

      if (filePathsToCut.length > 0 || filePathsToCopy.length > 0) {
        return true;
      }
      return false;
    });

    const createFile = async (_1: Event, createFolder: false) => {
      const currentFolderFiles: string[] = isDesktop.value
        ? fileSystemStore.getDesktopFilesPath
        : fileSystemStore.getFocusedItemDialog?.filesPath || [];

      if (!createFolder) {
        const newUniquePath = generateUniqueName(
          actionMenuParams.value.paths[0] + "/" + "new file",
          currentFolderFiles
        );
        await fileSystemStore.createFile({
          path: newUniquePath + ".txt",
          content: "",
        });
      } else {
        const newUniquePath = generateUniqueName(
          actionMenuParams.value.paths[0] + "/" + "new folder",
          currentFolderFiles
        );
        await fileSystemStore.createFolder(newUniquePath);
      }

      refreshFiles();
    };

    const refreshFiles = () => {
      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();
    };

    const deleteFileSystemItems = async () => {
      for (const path of actionMenuParams.value.paths) {
        await fileSystemStore.deleteFileSystemItem(path);
      }
      refreshFiles();
    };

    const copyFiles = () => {
      fileSystemStore.setFilePathsToCopy(actionMenuParams.value.paths);
    };

    const cutFiles = () => {
      fileSystemStore.setFilePathsToCut(actionMenuParams.value.paths);
      refreshFiles();
    };

    const pasteFiles = async (event: Event) => {
      if (!canPasteFiles.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      for (const path of actionMenuParams.value.paths) {
        await fileSystemStore.pasteFiles(path);
      }
      refreshFiles();
    };

    const isDesktop = computed(function () {
      return actionMenuParams.value.paths.length === 1 && actionMenuParams.value.paths[0] === DESKTOP_PATH;
    });

    const showActionsDialog = ref(false);
    const actionsDialogRef = ref(null);

    const openFile = () => {
      for (const path of actionMenuParams.value.paths) {
        const appToOpen: DesktopItem = {
          path: path,
          coordinates: { x: 0, y: 0 },
          isSelected: true,
        };
        fileSystemStore.createItemDialog(appToOpen);
      }
    };

    const addNewFile = (event: PointerEvent) => {
      const coordinates = { x: event.x, y: event.y } as Coordinates;
      context.emit("onAddNewFile", coordinates);
    };

    const addNewFolder = (event: PointerEvent) => {
      const coordinates = { x: event.x, y: event.y } as Coordinates;
      context.emit("onAddNewFolder", coordinates);
    };

    const openDesktopSettingPage = () => {
      const settingsApp: DesktopItem = {
        path: "",
        coordinates: { x: 0, y: 0 },
        applicationExtension: "settings",
        isSelected: true,
      };
      fileSystemStore.createItemDialog(settingsApp);
    };

    const closeActionDialog = () => {
      fileSystemStore.closeActionMenu();
    };

    onMounted(() => {
      window.addEventListener("click", closeActionDialog);
    });

    onDeactivated(() => {
      window.removeEventListener("click", closeActionDialog);
    });

    return {
      addNewFile,
      addNewFolder,
      showActionsDialog,
      actionsDialogRef,
      isFolder,
      isDesktop,
      createFile,
      actionMenuParams,
      deleteFileSystemItems,
      canPasteFiles,
      openFile,
      pasteFiles,
      copyFiles,
      cutFiles,
      openDesktopSettingPage,
    };
  },
});
</script>

<style scoped>
.actions-dialog {
  border: 1px solid #aaaaaab3;
  outline: 1px solid #575757;
  color: white;
  border-radius: var(--border-radius);
  position: absolute;
  background-color: #616161d6;
  top: 160px;
  left: 600px;
  z-index: 999;
  text-align: left;
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
  -webkit-box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
}

.padding {
  padding: 5px 5px;
}

.action-button {
  padding: 2px 5px;
  border-radius: 5px;
  width: 100% !important;
  cursor: pointer;
  width: max-content;
}

.disabled-action-button {
  padding: 0px 7px;
  border-radius: 5px;
  width: 100% !important;
  cursor: pointer;
  width: max-content;
  opacity: 0.5;
}

.action-button:hover {
  background-color: var(--selected-color);
}

hr {
  margin: 5px 0px;
}
</style>
