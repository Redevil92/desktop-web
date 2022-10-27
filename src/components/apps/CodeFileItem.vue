<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <MonacoEditor
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

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { MonacoEditor },
  emits: [],
  setup(props, _) {
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
      value: "dddd",
    };

    const fileType = getFileTypeFromExtension();

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        let codeBase64 = await readFile(props.itemDialog?.path);
        console.log(codeBase64);
        codeBase64 = codeBase64.substr(codeBase64.indexOf(",") + 1); // removed data uri
        code.value = decodeURIComponent(escape(window.atob(codeBase64)));
      }
    });

    return { monacoEditorOptions, fileType, code };
  },
});
</script>

<style scoped></style>
