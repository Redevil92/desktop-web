<template>
  <div style="color: white">
    <BaseDialog :noPadding="true">
      <div class="flex">
        <FavouritesPanel
          :pathSelected="pathAndFilesList[0] ? pathAndFilesList[0].path : ''"
          @onFavouriteSelect="clickItemFolderHandler($event, -1)"
        ></FavouritesPanel>

        <div class="right-panel">
          <div>
            <div class="input-list">
              <div class="input">
                <div class="label">Save as:</div>
                <BaseInput placeholder="Save as" v-model="saveAs"> </BaseInput>
              </div>
              <div class="input">
                <div class="label">Destination:</div>
                <div class="selected-folder flex">
                  <img height="18" :src="require('/src/assets/fileIcons/folder.svg')" alt="" />
                  <p>{{ selectedFolderNameToShow }}</p>
                </div>
              </div>
            </div>

            <div class="path-and-files-container">
              <div
                v-for="(pathAndFiles, index) in pathAndFilesList"
                :key="'path-files-' + pathAndFiles.path"
                class="path-item"
              >
                <FolderItemsList
                  :itemsList="mapToPathsList(pathAndFiles.files)"
                  :canRename="false"
                  :isFocused="true"
                  :canChangeViewType="false"
                  :keyEventsActive="false"
                  @onItemMouseDown="clickItemFolderHandler($event, index)"
                />
              </div>
            </div>
          </div>
          <div class="buttons-container">
            <BaseButton neutralColor @click="closeDialog">Cancel</BaseButton
            ><BaseButton class="save-button" @click="saveItem">Save</BaseButton>
          </div>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDialog from "@/components/shared/BaseDialog.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import FolderItemsList from "@/components/apps/folderItem/FolderItemsList.vue";
import FavouritesPanel from "@/components/shared/FavouritesPanel.vue";

import { DESKTOP_PATH } from "@/constants";
import { getFiles, isDir } from "@/context/fileSystemController";
import { getFileNameFromPath, getFileNameWithoutExtension } from "@/context/fileSystemUtils";
import { useSettingsStore } from "@/stores/settingsStore";
import PathAndIcon from "@/models/PathAndIcon";

export default defineComponent({
  props: { to: String },
  components: { BaseInput, BaseDialog, BaseButton, FolderItemsList, FavouritesPanel },
  emits: ["closeDialog", "saveItem"],
  setup(_, context) {
    const saveAs = ref("");
    const pathAndFilesList = ref<PathAndFiles[]>([]);
    const selectedFolder = ref(DESKTOP_PATH);
    const settingsStore = useSettingsStore();

    const selectedFolderNameToShow = computed(() => {
      return getFileNameFromPath(selectedFolder.value);
    });

    const favouritesPathList = computed(() => {
      return settingsStore.favouritesPathListAndIcon as PathAndIcon[];
    });

    const clickItemHandler = (filePath: string, index: number) => {
      getListBeforeIndex(pathAndFilesList.value, index);
      saveAs.value = getFileNameWithoutExtension(getFileNameFromPath(filePath));
    };

    const clickItemFolderHandler = async (filePath: string, index: number) => {
      setPathAndFileItem(filePath, index);
      if (await isDir(filePath)) {
        selectedFolder.value = filePath;
      } else {
        saveAs.value = getFileNameFromPath(filePath);
      }
    };

    const mapToPathsList = (items: PathAndIsFolder[]) => {
      return items.map((item) => item.path);
    };

    const getListBeforeIndex = (list: any[], index: number): PathAndFiles[] => {
      if (index === -1) {
        return [];
      }
      const tempList = [...list];
      if (list.length > index) {
        tempList.splice(index + 1);
      }

      return tempList;
    };

    const setPathAndFileItem = async (path: string, index: number) => {
      const pathAndFilesListToUpdate = getListBeforeIndex(pathAndFilesList.value, index);

      const filesPath = await getFiles(path, true);
      const pathsAndIsolder = [];

      for (const path of filesPath) {
        const getIsFolder = await isDir(path);
        pathsAndIsolder.push({ path, isFolder: getIsFolder } as PathAndIsFolder);
      }

      const pathAndFile = { path, files: pathsAndIsolder };
      pathAndFilesListToUpdate.push(pathAndFile);
      pathAndFilesList.value = pathAndFilesListToUpdate;
    };

    const closeDialog = () => {
      context.emit("closeDialog");
    };

    const saveItem = () => {
      if (saveAs.value && selectedFolder.value) {
        context.emit("saveItem", selectedFolder.value + "/" + saveAs.value);
      } else {
        console.log("SHOW ERRO");
      }
    };

    onMounted(async () => {
      setPathAndFileItem(DESKTOP_PATH, 0);
    });

    return {
      saveAs,
      pathAndFilesList,
      selectedFolder,
      selectedFolderNameToShow,
      favouritesPathList,
      mapToPathsList,
      clickItemHandler,
      clickItemFolderHandler,
      getFileNameFromPath,
      closeDialog,
      saveItem,
    };
  },
});

interface PathAndFiles {
  path: string;
  files: PathAndIsFolder[];
}

interface PathAndIsFolder {
  path: string;
  isFolder: boolean;
}
</script>
<style scoped>
.right-panel {
  text-align: left;
  width: 600px;
  height: 570px;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.path-and-files-container {
  display: flex;
  overflow-x: auto;

  margin-bottom: 1px;
  border-bottom: 1px solid rgb(67, 67, 67);
  border-top: 1px solid rgb(67, 67, 67);
  /* background-color: var(--background-color_light); */
}

.path-item {
  border-right: 2px solid rgb(67, 67, 67);
  height: 400px;
  font-size: var(--medium-font-size);
  width: 340px;
  text-align: left;
  padding-left: 10px;
  padding-top: 10px;
}

.medium-font {
  font-size: var(--medium-font-size);
  margin-left: var(--margin);
}

.flex {
  display: flex;
  align-items: center;
}

.file-name {
  margin-left: 5px;
}

.save-as-item {
  height: 24px;
  margin: 2px 10px;
  border-radius: 7px;
  color: var(--font-color);
  font-size: var(--medium-font-size);
  text-align: left;
  padding-left: 10px;
  padding-top: 5px;
}

.input {
  width: 300px;
}

.input-list {
  padding: var(--margin);
}

.label {
  font-size: var(--small-font-size);
  margin-top: var(--margin);
}

.selected-folder {
  width: 300px;
}

.selected-folder p {
  margin-left: var(--margin);
  font-weight: 600;
  border: 1px solid var(--font-color);
  border-radius: var(--border-radius);
  padding: 0px var(--margin);
  width: 300px;
  font-size: var(--medium-font-size);
}

.buttons-container {
  display: flex;
  justify-content: right;
  padding: calc(var(--margin) * 1);
}

.save-button {
  margin-left: calc(var(--margin) * 1);
}
</style>
