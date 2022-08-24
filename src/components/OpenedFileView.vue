<template>
  <MoveAndResizeArea :itemDialog="itemDialog">
    <template #header>
      <div :class="{ 'not-focused-dialog': !itemDialog.isFocused }" class="flex folder-header" ref="dialogHeader">
        <div v-if="fileExtension">
          <img height="17" class="file-icon" :src="require('/src/assets/fileIcons/' + fileExtension + '.svg')" alt="" />
        </div>
        <div v-else class="mdi mdi-folder-open folder-icon"></div>

        <div class="directory-name">{{ getFileNameFromPath(itemDialog.name) }}</div>
        <DialogControls :itemDialog="itemDialog" />
      </div>
    </template>
    <template #default>
      <!-- DIALOG CASE: our prop itemDialog is a FolderDIalog and fetch the items -->
      <div :class="{ 'not-focused-dialog': !itemDialog.isFocused }">
        <folder-item v-if="itemDialog.isFolder" :height="contentHeight" :folderDialog="itemDialog"> </folder-item>

        <div v-else-if="isTextFile()">
          <text-file-item :height="contentHeight" :itemDialog="itemDialog"></text-file-item>
        </div>
        <div v-else-if="fileExtension === 'pdf'">
          <pdf-item :height="contentHeight" :itemDialog="itemDialog"></pdf-item>
        </div>
        <div v-else-if="isCodeFile()">
          <code-file-item :height="contentHeight" :itemDialog="itemDialog"></code-file-item>
        </div>
        <div v-else-if="isImageFile()">
          <image-file-item :height="contentHeight" :itemDialog="itemDialog"></image-file-item>
        </div>
      </div>
    </template>
  </MoveAndResizeArea>
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { computed, defineComponent, PropType, ref } from "vue";

import { MIME_TYPE } from "@/constants";

import MoveAndResizeArea from "@/components/openedItemDialog/MoveAndResizeArea.vue";
import FolderItem from "@/components/itemViewTypes/FolderItem.vue";
import PdfItem from "@/components/itemViewTypes/pdfItem/PdfItem.vue";
import CodeFileItem from "@/components/itemViewTypes/CodeFileItem.vue";
import TextFileItem from "@/components/itemViewTypes/TextFileItem.vue";
import ImageFileItem from "@/components/itemViewTypes/ImageFileItem.vue";

import DialogControls from "@/components/openedItemDialog/DialogControls.vue";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";

export default defineComponent({
  props: {
    itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  },
  components: { FolderItem, CodeFileItem, TextFileItem, ImageFileItem, PdfItem, DialogControls, MoveAndResizeArea },
  emits: [],
  setup(props, _) {
    const dialogHeader = ref({} as HTMLElement);
    const draggableElement = ref({} as HTMLElement);

    const contentHeight = computed(function () {
      return props.itemDialog.dimension.height - dialogHeader.value.clientHeight;
    });

    const fileExtension = computed(function () {
      return getFileExtensionFromName(props.itemDialog.name);
    });

    function isCodeFile(): boolean {
      const codeExtensions = ["css", "html", "ts", "js"];

      return codeExtensions.includes(fileExtension.value);
    }

    function isImageFile(): boolean {
      const codeExtensions = ["png", "jpg", "jpeg"];

      return codeExtensions.includes(fileExtension.value);
    }

    function isTextFile(): boolean {
      const codeExtensions = ["txt", "text"];
      return codeExtensions.includes(fileExtension.value);
    }

    return {
      draggableElement,
      getFileNameFromPath,
      fileExtension,
      MIME_TYPE,
      dialogHeader,
      contentHeight,
      isCodeFile,
      isTextFile,
      isImageFile,
    };
  },
});
</script>

<style scoped>
.folder-dialog {
  position: absolute;
  top: 50px;
  left: 200px;
  border: 2px solid var(--dialog-border-color_dark);
  border-radius: 10px;
  background-color: var(--dialog-background-color_dark);
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
  -webkit-box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
}

.flex {
  display: flex;
  align-items: center;
}

.folder-icon {
  color: #f6d573;
  font-size: 18px;
  margin-left: 5px;
}

.folder-header {
  background-color: var(--dialog-header-color_dark);
  height: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.directory-name {
  margin-left: 5px;
  color: white;
  font-size: var(--medium-font-size);
  flex-grow: 1;
  text-align: start;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.footer {
  position: absolute;
  height: 20px;
  width: 20px;
  background-color: rgb(25, 25, 25);
  bottom: 0px;
  width: inherit;
  text-align: start;
}

.footer-text {
  color: white;
  font-size: var(--small-font-size);
  text-align: start;
  margin-left: 5px;
}

.file-icon {
  margin-left: 10px;
  margin-top: 3px;
}

.not-focused-dialog {
  opacity: 0.4;
}
</style>
