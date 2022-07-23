<template>
  <!-- THIS COMPONENT SHOULD BE A SINGLETON, WE SHOULD IMPLEMENT A STORE FOR DISPLAYING IT AND 
TO DECIDE WHAT ACTIONS TO DISPLAY -->
  <div v-show="show && position" :style="`top: ${position.y}px; left: ${position.x}px;`" class="actions-dialog padding">
    <div v-if="(isFolder && isOpenedFolder) || isDesktop">
      <div class="action-button" @click="createFile">New file</div>
      <div class="action-button" @click="addNewFolder">New folder</div>
      <div v-if="isDesktop">
        <hr class="" />
        <div class="action-button" @click="addNewFolder">Change desktop image</div>
      </div>
    </div>

    <div v-if="!isFolder">
      <div class="action-button" @click="addNewFolder">Open</div>
      <div class="action-button" @click="addNewFolder">Open with</div>
      <hr class="" />
      <div class="action-button" @click="addNewFolder">Cut</div>
      <div class="action-button" @click="addNewFolder">Copy</div>
    </div>

    <div v-if="!isOpenedFolder">
      <div class="action-button" @click="addNewFolder">Delete</div>
      <div class="action-button" @click="addNewFolder">Rename</div>
      <div class="action-button" @click="addNewFolder">Create shortcut</div>
    </div>
  </div>
</template>

<script lang="ts">
import { DESKTOP_PATH, getFileNameFromPath, getFileNameWithoutExtension, isDir } from "@/context/fileSystemController";
import Coordinates from "@/models/Coordinates";
import ItemDialog, { FolderDialog } from "@/models/ItemDialog";
import PathAndContent from "@/models/PathAndContent";
import store from "@/store";
import { defineComponent, ref, reactive, computed, watch, PropType, onMounted, onUnmounted } from "vue";

export default defineComponent({
  props: {
    path: String,
    show: Boolean,
    position: Object as PropType<Coordinates>,
    isOpenedFolder: { type: Boolean, default: false }, // right click on a not opened folder, you cannot create file
  },
  components: {},
  emits: [],
  setup(props, context) {
    // props -> path
    const createFile = async () => {
      const currentFolderFiles: string[] = isDesktop.value
        ? store.getters["fileSystem/GET_DESKTOP_FILES"]
        : (store.getters["fileSystem/GET_FOCUSED_ITEM_DIALOG"] as FolderDialog).filesPath;

      const newUniquePath = generateUniqueName(props.path + "/" + "new name", currentFolderFiles);

      console.log(666, newUniquePath);
      console.log(newUniquePath + ".txt");
      await store.dispatch("fileSystem/CREATE_FILE", {
        path: newUniquePath + ".txt",
        content: "",
      } as PathAndContent);
      if (isDesktop.value) {
        store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
      } else {
        store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      }
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

    const createDirectory = () => {};

    const isFolder = computed(function () {
      return isDir(props.path || "");
    });

    const isDesktop = computed(function () {
      return props.path === DESKTOP_PATH;
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

    return {
      addNewFile,
      addNewFolder,
      showActionsDialog,
      actionsDialogRef,
      isFolder,
      isDesktop,
      createFile,
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
  z-index: 1;
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
  cursor: pointer;
  width: max-content;
}

.action-button:hover {
  background-color: var(--selected-color);
}

hr {
  margin: 5px 0px;
}
</style>
