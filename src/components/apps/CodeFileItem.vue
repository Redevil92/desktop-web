<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <div style="height: 20px; color: white" @click="saveFile">SAVE</div>
    <MonacoEditor
      :style="`height: ${height - 14 - 20}px; width: calc(100% -4px); `"
      class="monaco-editor"
      theme="vs-dark"
      automaticLayout
      :value="code"
      :options="monacoEditorOptions"
      language="html"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, PropType, ref } from "vue";

import MonacoEditor from "monaco-editor-vue3";
import ItemDialog from "@/models/ItemDialog";
import { getFileExtensionFromName } from "@/context/fileSystemUtils";
import { readFile } from "@/context/fileSystemController";

import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import PathAndContent from "@/models/PathAndContent";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { MonacoEditor },
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();
    const { b64ToText } = useBase64Handler();

    let code = ref("const noop = () => {}");

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
      if (props.itemDialog?.path) {
        console.log("saving", code.value);
        fileSystemStore.updateFile({
          path: props.itemDialog?.path,
          content: code.value,
        } as PathAndContent);
      }
    };

    const fileType = getFileTypeFromExtension();

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        let codeBase64 = await readFile(props.itemDialog?.path);

        code.value = b64ToText(codeBase64, true);
      }
    });

    return { monacoEditorOptions, fileType, code, saveFile };
  },
});
</script>

<style scoped></style>
