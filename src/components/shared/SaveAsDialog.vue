<template>
  <div style="color: white">
    <BaseDialog :to="to" :noPadding="true">
      <div class="flex">
        <div class="left-panel">
          <div class="favourites-text">Favourites</div>
        </div>
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
                <div v-for="file in pathAndFiles.files" :key="pathAndFiles.path + '-' + file">
                  <div
                    v-if="file.isFolder"
                    class="flex save-as-item"
                    :class="selectedFolder === file.path ? 'selected-folder-item' : ''"
                    @click="clickItemFolderHandler(file.path, index)"
                  >
                    <img height="14" :src="require('/src/assets/fileIcons/folder.svg')" alt="" />
                    <p class="file-name ellipsis">{{ getFileNameFromPath(file.path) }}</p>
                  </div>
                  <div v-else class="flex save-as-item file-item" @click="clickItemHandler(file.path, index)">
                    <img height="14" :src="require('/src/assets/fileIcons/file.svg')" alt="" />
                    <p class="file-name ellipsis">{{ getFileNameFromPath(file.path) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="buttons-container">
            <BaseButton neutralColor>Cancel</BaseButton><BaseButton class="save-button">Save</BaseButton>
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

import { DESKTOP_PATH } from "@/constants";
import { getFiles, isDir } from "@/context/fileSystemController";
import PathAndContent from "@/models/PathAndContent";
import { getFileNameFromPath, getFileNameWithoutExtension } from "@/context/fileSystemUtils";

export default defineComponent({
  props: { to: String },
  components: { BaseInput, BaseDialog, BaseButton },
  emits: [],
  setup() {
    const saveAs = ref("");
    const pathAndFilesList = ref<PathAndFiles[]>([]);
    const selectedFolder = ref(DESKTOP_PATH);

    const selectedFolderNameToShow = computed(() => {
      return getFileNameFromPath(selectedFolder.value);
    });

    const clickItemHandler = (filePath: string, index: number) => {
      closePathFileItem(index);
      saveAs.value = getFileNameWithoutExtension(getFileNameFromPath(filePath));
    };

    const clickItemFolderHandler = (filePath: string, index: number) => {
      setPathAndFileItem(filePath, index);
      selectedFolder.value = filePath;
    };

    const closePathFileItem = (index: number): PathAndFiles[] => {
      const pathAndFilesListTemp = [...pathAndFilesList.value];
      if (pathAndFilesList.value.length > index) {
        pathAndFilesListTemp.splice(index + 1);
      }

      return pathAndFilesListTemp;
    };

    const setPathAndFileItem = async (path: string, index: number) => {
      const pathAndFilesListToUpdate = closePathFileItem(index);

      const filesPath = await getFiles(path, true);
      const pathsAndIsolder = [];

      for (const path of filesPath) {
        const getIsFolder = await isDir(path);
        pathsAndIsolder.push({ path, isFolder: getIsFolder } as PathAndIsFolder);
      }

      const pathAndFIle = { path: DESKTOP_PATH, files: pathsAndIsolder };
      pathAndFilesListToUpdate.push(pathAndFIle);

      pathAndFilesList.value = pathAndFilesListToUpdate;
    };

    onMounted(async () => {
      setPathAndFileItem(DESKTOP_PATH, 0);
    });

    return {
      saveAs,
      pathAndFilesList,
      selectedFolder,
      selectedFolderNameToShow,
      clickItemHandler,
      clickItemFolderHandler,
      getFileNameFromPath,
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
/* .label {
  width: 110px;
  text-align: right;
  margin-right: 10px;
  font-size: var(--small-font-size);
} */

.flex {
  display: flex;
}

.left-panel {
  width: 150px;
  border-right: 1px solid rgb(67, 67, 67);

  height: 600px;
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  background-color: var(--background-color_contrast);
}

.right-panel {
  text-align: left;
  width: 600px;
  height: 600px;
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.path-and-files-container {
  display: flex;
  overflow-x: auto;
  height: 400px;
  margin-bottom: 1px;
  border-bottom: 2px solid rgb(164, 164, 164);
  border-top: 2px solid rgb(164, 164, 164);
  /* background-color: var(--background-color_light); */
}

.path-item {
  border-right: 2px solid rgb(67, 67, 67);

  font-size: var(--medium-font-size);
  width: 340px;
  text-align: left;
  padding-left: 10px;
  padding-top: 10px;
}

.flex {
  display: flex;
  align-items: center;
}

.file-name {
  margin-left: 5px;
}

.save-as-item {
  cursor: pointer;
  padding-left: 5px;
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
  padding: calc(var(--margin) * 2);
}

.save-button {
  margin-left: calc(var(--margin) * 2);
}

.selected-folder-item {
  background-color: var(--selected-color);
  border-radius: calc(var(--border-radius) / 2);
}

.file-item {
  opacity: 0.6;
}

.favourites-text {
  font-size: var(--medium-font-size);
  font-weight: 600;
  margin-top: calc(var(--margin) * 2);
  margin-left: calc(var(--margin) * 2);
  opacity: 0.6;
  text-align: left;
}
</style>
