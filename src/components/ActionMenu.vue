<template>
  <div
    v-if="actionMenuParams && actionMenuParams.show && actionMenuParams.position"
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
        <div class="action-button" @click="addNewFolder">Change desktop image</div>
      </div>
    </div>

    <div v-if="!isFolder">
      <div class="action-button">Open</div>
      <div class="action-button">Open with</div>
      <hr class="" />
      <div class="action-button" @click="cutFiles">Cut</div>
      <div class="action-button" @click="copyFiles">Copy</div>
    </div>

    <div v-if="!actionMenuParams.isOpenedFolder">
      <div class="action-button" @click="deleteFile">Delete</div>
      <div class="action-button" @click="addNewFolder">Rename</div>
      <div class="action-button" @click="addNewFolder">Create shortcut</div>
    </div>
  </div>
</template>

<script lang="ts">
import { DESKTOP_PATH } from "@/constants";
import { isDir } from "@/context/fileSystemController";
import { generateUniqueName } from "@/context/fileSystemUtils";
import Coordinates from "@/models/Coordinates";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { defineComponent, ref, computed, watch, onMounted, onDeactivated } from "vue";

export default defineComponent({
  components: {},
  emits: ["onAddNewFile", "onAddNewFolder"],
  setup(_, context) {
    const fileSystemStore = useFileSystemStore();

    const isFolder = ref(false);

    // props -> path
    const actionMenuParams = computed(function () {
      return fileSystemStore.actionMenu;
    });

    watch(actionMenuParams, async function (_2, _3) {
      if (actionMenuParams.value.path) {
        isFolder.value = await isDir(actionMenuParams.value.path || "");
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
        const newUniquePath = generateUniqueName(actionMenuParams.value.path + "/" + "new file", currentFolderFiles);
        await fileSystemStore.createFile({
          path: newUniquePath + ".txt",
          content: "",
        });
      } else {
        const newUniquePath = generateUniqueName(actionMenuParams.value.path + "/" + "new folder", currentFolderFiles);
        await fileSystemStore.createFolder(newUniquePath);
      }

      refreshFiles();
    };

    const refreshFiles = () => {
      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();
    };

    const deleteFile = async () => {
      // TODO delete selected files
      await fileSystemStore.deleteFile(actionMenuParams.value.path);
      refreshFiles();
    };

    const copyFiles = () => {
      // TODO copy selected files
      fileSystemStore.setFilePathsToCopy([actionMenuParams.value.path]);
    };

    const cutFiles = () => {
      // TODO cut selected files
      fileSystemStore.setFilePathsToCut([actionMenuParams.value.path]);
      refreshFiles();
    };

    const pasteFiles = async (event: Event) => {
      if (!canPasteFiles.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      fileSystemStore.pasteFiles(actionMenuParams.value.path);
      refreshFiles();
    };

    const isDesktop = computed(function () {
      return actionMenuParams.value.path === DESKTOP_PATH;
    });

    const showActionsDialog = ref(false);
    const actionsDialogRef = ref(null);

    const addNewFile = (event: PointerEvent) => {
      const coordinates = { x: event.x, y: event.y } as Coordinates;
      context.emit("onAddNewFile", coordinates);
    };

    const addNewFolder = (event: PointerEvent) => {
      const coordinates = { x: event.x, y: event.y } as Coordinates;
      context.emit("onAddNewFolder", coordinates);
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
      deleteFile,
      canPasteFiles,
      pasteFiles,
      copyFiles,
      cutFiles,
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
  padding: 3px 5px;
}

.action-button {
  padding: 0px 5px;
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
