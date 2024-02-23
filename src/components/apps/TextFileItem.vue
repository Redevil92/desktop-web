<template>
  <SelectedFolderDialog
    v-if="showSaveAsDialog"
    @onFolderSelected="saveTextFileHandler"
    @closeDialog="showSaveAsDialog = false"
    to="textFileItem"
    :showSaveAsInput="true"
  ></SelectedFolderDialog>

  <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 5" />
  <div>
    <div id="textFileItem" :style="`height: ${height}px;  width: calc(100% -4px); `">
      <QuillEditor
        v-if="isLoaded"
        :id="itemDialog.guid + '-quill-editor'"
        theme="snow"
        :toolbar="`#custom-toolbar-${itemDialog.guid}`"
        contentType="html"
        v-model:content="fileText"
        @input="onTextChange"
      >
        <template #toolbar>
          <div :id="`custom-toolbar-${itemDialog.guid}`" style="height: 41px; overflow-y: auto">
            <select class="ql-size">
              <option value="small"></option>
              <option selected></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
            <select class="ql-header">
              <option :value="1"></option>
              <option :value="2"></option>
              <option :value="3"></option>
              <option :value="4"></option>
              <option :value="5"></option>
              <option :value="6"></option>
              <option selected></option>
            </select>
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
            <select class="ql-align">
              <option selected></option>
              <option value="center"></option>
              <option value="right"></option>
              <option value="justify"></option>
            </select>
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
            <button class="ql-blockquote"></button>
            <button class="ql-code-block"></button>
            <button class="ql-link"></button>
            <button class="ql-image"></button>

            <button id="your-button" @click="saveFile" :class="!saveButtonEnabled ? 'save-button-disabled-quill' : ''">
              <img :src="require('/src/assets/icons/save.svg')" style="height: 17px" />
            </button>
          </div>
        </template>
      </QuillEditor>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import SelectedFolderDialog from "@/components/shared/SelectedFolderDialog.vue";
import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import fileSystem from "@/context/fileSystemController";
import PathAndContent from "@/models/PathAndContent";
import { getFileNameFromPath } from "@/context/utils/fileSystemUtils";
import { useLayoutStore } from "@/stores/layoutStore";
import { SEVERITY } from "@/constants";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import useBase64Handler from "@/hooks/useBase64Handler";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: {
    type: Number,
    required: true,
  },
});

const layoutStore = useLayoutStore();
const fileSystemStore = useFileSystemStore();
const { b64ToText, utf8ToB64, removeDataUri } = useBase64Handler();

const fileText = ref("");
const isLoaded = ref(false);
const showSaveAsDialog = ref(false);

const hasChanges = ref(false);

const saveButtonEnabled = computed(() => {
  return hasChanges.value || !props.itemDialog?.path;
});

const onTextChange = (content: any) => {
  hasChanges.value = true;
};

const saveFile = () => {
  if (props.itemDialog?.path) {
    fileSystemStore.updateFile({
      path: props.itemDialog?.path,
      content: utf8ToB64(fileText.value),
    } as PathAndContent);
  } else {
    showSaveAsDialog.value = true;
  }
  hasChanges.value = false;
};

const saveTextFileHandler = async (destinationPath: string) => {
  const destinationPathToSave = destinationPath + ".txt";

  await fileSystemStore.createFile({ path: destinationPathToSave, content: utf8ToB64(fileText.value) });
  showSaveAsDialog.value = false;

  const itemDialogToUpdate = { ...props.itemDialog };
  itemDialogToUpdate.name = getFileNameFromPath(destinationPathToSave);
  itemDialogToUpdate.path = destinationPathToSave;
  fileSystemStore.updateItemDialog(itemDialogToUpdate);

  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();

  layoutStore.setSnackBar({
    show: true,
    text: `"${getFileNameFromPath(destinationPathToSave)}" created.`,
    severity: SEVERITY.information,
  });
};

onMounted(async () => {
  if (props.itemDialog?.path) {
    let fileData = await fileSystem.readFile(props.itemDialog?.path);
    fileText.value = b64ToText(fileData, true);

    isLoaded.value = true;
  } else {
    fileText.value = "";
    isLoaded.value = true;
  }
});

// IMPLEMENT CTRL SAVE
</script>
<style>
.save-button-disabled-quill {
  pointer-events: none;
  opacity: 0.1;
}

.ql-container {
  height: calc(100% - 44px);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  background-color: white;
}

.ql-toolbar {
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  background-color: white;
}
</style>
