<template>
  <div style="color: white">
    <BaseDialog :to="to" :noPadding="true">
      <div class="flex">
        <div class="left-panel"></div>
        <div class="right-panel">
          <div>
            <BaseInput label="Save as:" placeholder="Destination folder" v-model="saveAs"> </BaseInput>
            <div>Last folder</div>
            <div class="path-and-files-container">
              <div v-for="pathAndFiles in pathAndFilesList" :key="'path-files-' + pathAndFiles.path" class="path-item">
                <div v-for="file in pathAndFiles.files" :key="pathAndFiles.path + '-' + file">
                  <div class="flex" v-if="isFolder(file.path)">
                    <img height="14" :src="require('/src/assets/fileIcons/folder.svg')" alt="" />
                    <p class="file-name">{{ file }}</p>
                  </div>
                  <div v-else class="flex">
                    <img height="14" :src="require('/src/assets/fileIcons/folder.svg')" alt="" />
                    <p class="file-name">{{ file }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDialog from "@/components/shared/BaseDialog.vue";

import { DESKTOP_PATH } from "@/constants";
import { getFiles } from "@/context/fileSystemController";

export default defineComponent({
  props: { to: String },
  components: { BaseInput, BaseDialog },
  emits: [],
  setup() {
    const saveAs = ref("");
    const pathAndFilesList = ref<PathAndFiles[]>([]);
    const startFolder = ref(DESKTOP_PATH);

    const isFolder = (path: string) => {
      return true;
    };

    onMounted(async () => {
      const filesPath = await getFiles(DESKTOP_PATH);
      const pathAndFIle = { path: DESKTOP_PATH, files: filesPath };
      pathAndFilesList.value.push(pathAndFIle);
    });

    // RIGHT PANEL "favourites"
    // current files navigator

    return {
      saveAs,
      pathAndFilesList,
      isFolder,
    };
  },
});

interface PathAndFiles {
  path: string;
  files: string[];
}
</script>
<style scoped>
.label {
  width: 110px;
  text-align: right;
  margin-right: 10px;
}

.flex {
  display: flex;
}

.left-panel {
  width: 120px;
  border: 2px solid red;
  height: 200px;
}

.right-panel {
  width: 600px;
}

.path-and-files-container {
  display: flex;
}

.path-item {
  border: 2px solid green;
  font-size: var(--medium-font-size);
  width: 200px;
  text-align: left;
  padding-left: 10px;
  padding-top: 5px;
}

.flex {
  display: flex;
  align-items: center;
}

.file-name {
  margin-left: 5px;
}
</style>
