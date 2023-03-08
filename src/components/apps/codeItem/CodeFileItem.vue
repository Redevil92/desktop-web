<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <div class="control-bar">
      <span class="mdi mdi-content-save save-icon" :class="{ 'disabled-icon': !canSave }" @click="saveFile"></span>
    </div>

    <MonacoEditor
      :style="`height: ${height - 14 - 20}px; width: calc(100% -4px); `"
      class="monaco-editor"
      theme="vs-dark"
      automaticLayout
      :value="code"
      :options="monacoEditorOptions"
      :language="fileLanguage"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, PropType, ref } from "vue";

import MonacoEditor from "monaco-editor-vue3";
import ItemDialog from "@/models/ItemDialog";

import { getFileExtensionFromName } from "@/context/fileSystemUtils";
import { readFile } from "@/context/fileSystemController";

import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import PathAndContent from "@/models/PathAndContent";

import extensionToFileType from "@/components/apps/codeItem/ExtensionToFileType";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

const fileSystemStore = useFileSystemStore();
const { b64ToText, utf8ToB64 } = useBase64Handler();

let code = ref("");
let savedCode = ref("");
let fileLanguage = ref("javascript");

const canSave = computed(function (): boolean {
  return savedCode.value !== code.value;
});

function getFileTypeFromExtension(): string {
  let fileType = "";
  if (props.itemDialog) {
    const currentFileExtension = getFileExtensionFromName(props.itemDialog.path);
    switch (currentFileExtension) {
      case "css":
        fileType = "css";
        break;
      case "js":
        fileType = "javascript";
        break;
      case "html":
        fileType = "html";
        break;
      case "ts":
        fileType = "typescript";
        break;
      default:
        break;
    }
  }
  return fileType;
}

const monacoEditorOptions = {
  automaticLayout: true,
  lineNumbers: "on",
  // try "same", "indent" or "none"
  wrappingIndent: "indent",
  // Set this to false to not auto word wrap minified files
  wordWrapMinified: true,
  value: "",
};

const saveFile = () => {
  if (props.itemDialog?.path && canSave.value) {
    console.log("saving", code.value);
    fileSystemStore.updateFile({
      path: props.itemDialog?.path,
      content: utf8ToB64(code.value),
    } as PathAndContent);
  }
};

const onChange = (newCode: string) => {
  code.value = newCode;
};

const fileType = getFileTypeFromExtension();

onBeforeMount(async () => {
  if (props.itemDialog?.path) {
    let codeBase64 = await readFile(props.itemDialog?.path);
    try {
      const codeToShow = b64ToText(codeBase64, true);
      fileLanguage.value = (extensionToFileType as any)[getFileExtensionFromName(props.itemDialog?.path)];
      code.value = codeToShow;
      savedCode.value = codeToShow;
    } catch (error) {
      code.value = codeBase64;
      savedCode.value = codeBase64;
    }
  }
});
</script>

<style scoped>
.control-bar {
  display: flex;
  align-items: center;
  height: 25px;
}

.save-icon {
  color: var(--font-color);
  text-align: left;
  text-align: initial;
  margin-left: var(--margin);
  cursor: pointer;
}

.disabled-icon {
  color: var(--neutral-color);
  cursor: default;
}
</style>
