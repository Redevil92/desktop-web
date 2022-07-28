<template>
  <div
    v-if="actionMenuParams.show && actionMenuParams.position"
    :style="`top: ${actionMenuParams.position.y}px; left: ${actionMenuParams.position.x}px;`"
    class="actions-dialog padding"
  >
    <div v-if="(isFolder && actionMenuParams.isOpenedFolder) || isDesktop">
      <div class="action-button" @click="createFile">New file</div>
      <div class="action-button" @click="createFile($event, true)">New folder</div>
      <div :class="{ 'disabled-action-button': !canPasteFiles, 'action-button': canPasteFile }" @click="pasteFiles">
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
      <div class="action-button">Cut</div>
      <div class="action-button">Copy</div>
    </div>

    <div v-if="!actionMenuParams.isOpenedFolder">
      <div class="action-button" @click="deleteFile">Delete</div>
      <div class="action-button" @click="addNewFolder">Rename</div>
      <div class="action-button" @click="addNewFolder">Create shortcut</div>
    </div>
  </div>
</template>

<script lang="ts">
import { DESKTOP_PATH, getFileNameWithoutExtension, isDir } from "@/context/fileSystemController";
import ActionMenu from "@/models/ActionMenu";
import Coordinates from "@/models/Coordinates";
import { FolderDialog } from "@/models/ItemDialog";
import PathAndContent from "@/models/PathAndContent";
import store from "@/store";
import { defineComponent, ref, reactive, computed, watch, PropType, onMounted, onUnmounted, onDeactivated } from "vue";

export default defineComponent({
  components: {},
  emits: ["onAddNewFile", "onAddNewFolder"],
  setup(_, context) {
    // props -> path
    const actionMenuParams = computed(function () {
      return store.getters["fileSystem/GET_ACTION_MENU"] as ActionMenu;
    });

    const canPasteFiles = computed(() => {
      const filePathsToCopy: string[] = store.getters["fileSystem/GET_FILE_PATHS_TO_COPY"];
      const filePathsToCut: string[] = store.getters["fileSystem/GET_FILE_PATHS_TO_CUT"];

      if (filePathsToCut.length > 0 || filePathsToCopy.length > 0) {
        return true;
      }
      return false;
    });

    const createFile = async (_1: Event, createFolder: false) => {
      const currentFolderFiles: string[] = isDesktop.value
        ? store.getters["fileSystem/GET_DESKTOP_FILES"]
        : (store.getters["fileSystem/GET_FOCUSED_ITEM_DIALOG"] as FolderDialog).filesPath;

      if (!createFolder) {
        const newUniquePath = generateUniqueName(actionMenuParams.value.path + "/" + "new file", currentFolderFiles);
        await store.dispatch("fileSystem/CREATE_FILE", {
          path: newUniquePath + ".txt",
          content: "",
        } as PathAndContent);
      } else {
        const newUniquePath = generateUniqueName(actionMenuParams.value.path + "/" + "new folder", currentFolderFiles);
        await store.dispatch("fileSystem/CREATE_FOLDER", newUniquePath);
      }

      refreshFiles();
    };

    const refreshFiles = () => {
      store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
    };

    const deleteFile = async () => {
      await store.dispatch("fileSystem/DELETE_FILE", actionMenuParams.value.path);
      refreshFiles();
    };

    const pasteFiles = async (event: Event) => {
      if (canPasteFiles) {
        event.preventDefault();
        event.stopPropagation();

        return;
      }
      console.log("Implement paste");
    };

    const generateUniqueName = (name: string, nameList: string[]) => {
      console.log(name, nameList);
      let myName = name;
      let currentIndex = 0;
      let isUnique = false;
      while (!isUnique && currentIndex < 100) {
        isUnique = nameList.findIndex((name) => getFileNameWithoutExtension(name) === myName) === -1;
        console.log(isUnique);
        if (!isUnique) {
          currentIndex++;
          myName = `${name} (${currentIndex})`;
        }
      }
      return myName;
    };

    const isFolder = computed(function () {
      console.log(actionMenuParams.value.path);
      return isDir(actionMenuParams.value.path || "");
    });

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
      store.dispatch("fileSystem/CLOSE_ACTION_MENU");
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
    };
  },
});
</script>

<style scoped>
.actions-dialog {
  border: 1px solid #aaaaaab3;
  outline: 1px solid #575757;
  color: white;
  border-radius: 7px;
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
  padding: 3px 10px;
}

.action-button {
  padding: 0px 7px;
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
