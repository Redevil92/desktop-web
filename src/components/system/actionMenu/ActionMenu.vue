<template>
  <div
    v-if="actionMenuParams && actionMenuParams.show && actionMenuParams.position && isFolder !== undefined"
    :style="`top: ${actionMenuParams.position.y}px; left: ${actionMenuParams.position.x}px;`"
    class="actions-dialog padding"
  >
    <div v-if="actionMenuParams.customLayout">
      <div v-for="(group, i) in actionsByGroup" :key="`group-${i}`">
        <div :class="{ 'horizontal-group': group[1][0] }">
          <div v-for="(item, j) in group[1]" @click="item.callback" :key="`group-${j}-action-${i}`">
            <div class="horizontal-action">
              <div v-if="item.icon">
                <img height="20" :src="require(`/src/assets/icons/${item.icon}`)" alt="" />
              </div>
              <div v-if="!item.iconOnly">
                {{ item.actionName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="(isFolder && actionMenuParams.isOpenedFolder) || isDesktop">
        <div class="action-button" @click="createFile($event, false)">New file</div>
        <div class="action-button" @click="createFile($event, true)">New folder</div>
        <div :class="{ 'disabled-action-button': !canPasteFiles, 'action-button': canPasteFiles }" @click="pasteFiles">
          Paste
        </div>
        <div v-if="isDesktop">
          <hr class="" />
          <div class="action-button" @click="openDesktopSettingPage">Change desktop image</div>
        </div>
      </div>

      <div v-if="!isDesktop">
        <div class="action-button" @click="openFile">Open</div>
        <!-- <div class="action-button">Open with</div> -->
        <hr class="" />
        <div class="action-button" @click="cutFiles">Cut</div>
        <div class="action-button" @click="copyFiles">Copy</div>
      </div>

      <div v-if="!actionMenuParams.isOpenedFolder && !isDesktop">
        <div class="action-button" @click="deleteFileSystemItems">Delete</div>
        <div class="action-button">Rename</div>
        <!-- <div class="action-button" @click="addNewFolder">Create shortcut</div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onDeactivated } from "vue";

import { DESKTOP_PATH } from "@/constants";
import { isDir } from "@/context/fileSystemController";
import { generateUniqueName } from "@/context/fileSystemUtils";
import Coordinates from "@/models/Coordinates";
import DesktopItem from "@/models/DesktopItem";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { ActionItem } from "@/models/ActionMenu";

const emit = defineEmits(["onAddNewFile", "onAddNewFolder"]);

const fileSystemStore = useFileSystemStore();

const isFolder = ref<boolean | undefined>();

// props -> path
const actionMenuParams = computed(function () {
  return fileSystemStore.actionMenu;
});

const actionsByGroup = computed(() => {
  const actions: Map<string, ActionItem[]> = new Map();
  if (actionMenuParams.value.customLayout) {
    actionMenuParams.value.customLayout.forEach((action) => {
      console.log("****", action.groupName);
      if (actions.has(action.groupName)) {
        actions.get(action.groupName)?.push(action);
      } else actions.set(action.groupName, [action]);
    });
  }
  return actions;
});

const isCustomLayout = computed(function () {
  return !!(fileSystemStore.actionMenu.customLayout && fileSystemStore.actionMenu.customLayout.length > 0);
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

const createFile = async (_1: Event, createFolder = false) => {
  const currentFolderFiles: string[] = isDesktop.value
    ? fileSystemStore.getDesktopFilesPath
    : fileSystemStore.getFocusedItemDialog?.filesPath || [];

  if (!createFolder) {
    const newUniquePath = generateUniqueName(actionMenuParams.value.paths[0] + "/" + "new file", currentFolderFiles);
    await fileSystemStore.createFile({
      path: newUniquePath + ".txt",
      content: "",
    });
  } else {
    const newUniquePath = generateUniqueName(actionMenuParams.value.paths[0] + "/" + "new folder", currentFolderFiles);
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
  emit("onAddNewFile", coordinates);
};

const addNewFolder = (event: PointerEvent) => {
  const coordinates = { x: event.x, y: event.y } as Coordinates;
  emit("onAddNewFolder", coordinates);
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
</script>

<style scoped>
.horizontal-group {
  display: flex;
}

.horizontal-action {
  padding: 2px 5px;
  margin-right: 3px;
  cursor: pointer;
}

.horizontal-action:hover {
  background-color: var(--selected-color);
}

.actions-dialog {
  /* border: 1px solid #aaaaaab3;
  outline: 1px solid #575757; */
  color: white;
  border-radius: var(--border-radius);
  position: absolute;
  background-color: #616161d6;
  top: 160px;
  left: 600px;
  z-index: 999;
  text-align: left;
  box-shadow: 2px 3px 20px 0px rgba(122, 122, 122, 0.8);
  -webkit-box-shadow: 2px 3px 20px 0px rgba(107, 107, 107, 0.8);
}

.padding {
  padding: 5px 10px;
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
