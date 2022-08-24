<template>
  <base-dialog v-if="showDialog">
    <div class="error-message">
      <img height="85" :src="require('/src/assets/icons/error-robot.svg')" alt="" />
      <div>{{ errorMessage }}</div>
      <BaseButton @click="showDialog = false" class="ok-button">OK</BaseButton>
    </div>
  </base-dialog>
  <div
    class="file-item"
    :class="{ 'cut-file-item': isCutFile }"
    @dblclick="doubleClickHandler"
    @click.stop="clickHandler"
  >
    <div @click="isEditingText = false">
      <img
        :class="isSelected ? 'file-item-selected' : 'invisible-border'"
        v-if="isFolder"
        height="60"
        :src="require('/src/assets/fileIcons/folder.svg')"
        alt=""
      />
      <div v-else>
        <div v-if="fileExtension">
          <img
            :class="isSelected ? 'file-item-selected' : 'invisible-border'"
            height="60"
            :src="require('/src/assets/fileIcons/' + fileExtension + '.svg')"
            alt=""
          />
        </div>
        <div v-else>
          <img
            :class="isSelected ? 'file-item-selected' : 'invisible-border'"
            height="60"
            :src="require('/src/assets/fileIcons/unknow.svg')"
            alt=""
          />
        </div>
      </div>
    </div>

    <div :class="isSelected ? 'file-text-selected' : ''" class="file-text">
      <!-- @click.stop=""
        @keyup.enter="changeFileName"
        @blur="changeFileName"
        @keyup.esc="isEditingSelectedValue = false" -->

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

      <!-- {{ getFileNameFromPath(fileItem.name) }} -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, PropType, ref, watch } from "vue";

import BaseDialog from "@/components/shared/BaseDialog.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import DesktopItem from "@/models/DesktopItem";

import store from "@/store";
import { DESKTOP_PATH } from "@/constants";
import { existsFile, isDir, renameFile } from "@/context/fileSystemController";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";

export default defineComponent({
  props: {
    fileItem: { type: Object as PropType<DesktopItem>, required: true },
    isSelected: { type: Boolean, default: false },
  },
  components: { BaseDialog, BaseButton },
  emits: ["onClick", "onRightClick"],
  setup(props, context) {
    const fileName = ref(getFileNameFromPath(props.fileItem.name));
    const isEditingText = ref(false);
    const fileNameInputRef = ref(null);
    const showDialog = ref(false);
    const errorMessage = ref("");
    const isFolder = ref(false);

    watch(
      () => props.isSelected,
      (currentIsSelected, _old) => {
        if (!currentIsSelected) {
          isEditingText.value = false;
        }
      }
    );

    const fileExtension = computed(function () {
      return getFileExtensionFromName(props.fileItem.name);
    });

    const isCutFile = computed(function () {
      const filesToCut = store.getters["fileSystem/GET_FILE_PATHS_TO_CUT"] as string[];
      if (filesToCut.includes(props.fileItem.name)) {
        return true;
      }
      return false;
    });

    const setIsEditingText = async () => {
      if (props.isSelected) {
        isEditingText.value = true;
        await nextTick();
        (fileNameInputRef.value as unknown as HTMLElement).focus();
      }
    };

    const clickHandler = () => {
      context.emit("onClick", props.fileItem);
    };

    const doubleClickHandler = () => {
      store.dispatch("fileSystem/ADD_ITEM_DIALOG", props.fileItem);
    };

    const refreshFileSystemFiles = () => {
      store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES", {});
      store.dispatch("fileSystem/FETCH_DESKTOP_FILES", {});
    };

    const changeFileName = async () => {
      fileName.value = fileName.value.replace(/[\n\r]/g, "");
      const newName = DESKTOP_PATH + "/" + fileName.value;

      if (isEditingText.value && newName !== props.fileItem.name) {
        if (await existsFile(newName)) {
          showDialog.value = true;
          errorMessage.value = `The name "${fileName.value}" is already taken. Please find a new one.`;
          isEditingText.value = false;
          fileName.value = getFileNameFromPath(props.fileItem.name);
          return;
        }

        if (newName !== props.fileItem.name && isEditingText.value) {
          renameFile(newName, props.fileItem.name);
          refreshFileSystemFiles();
        }
        isEditingText.value = false;
      }
    };

    onMounted(async () => {
      isFolder.value = await isDir(props.fileItem.name);
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
