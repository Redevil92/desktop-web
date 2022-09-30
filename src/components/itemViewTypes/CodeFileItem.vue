<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <MonacoEditor
      class="monaco-editor"
      theme="vs-dark"
      automaticLayout
      :value="code"
      :options="monacoEditorOptions"
      language="javascript"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import MonacoEditor from "monaco-editor-vue3";
import ItemDialog from "@/models/ItemDialog";
import { getFileExtensionFromName } from "@/context/fileSystemUtils";

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
      //value: "dddd",
    };

    const fileType = getFileTypeFromExtension();

    return { monacoEditorOptions, fileType, code };
  },
});
</script>

<style scoped></style>
