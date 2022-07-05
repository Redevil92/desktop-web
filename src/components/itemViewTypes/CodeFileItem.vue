<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <MonacoEditor
      class="monaco-editor"
      v-model="code"
      theme="vs-dark"
      automaticLayout
      :options="monacoEditorOptions"
      language="javascript"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import MonacoEditor from "monaco-editor-vue3";
import ItemDialog from "@/models/ItemDialog";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { MonacoEditor },
  emits: [],
  setup(props, _) {
    const code = () => {
      return "hello";
    };

    const monacoEditorOptions = {
      automaticLayout: true,
      lineNumbers: "on",
      language: "javascript",
      // try "same", "indent" or "none"
      wrappingIndent: "indent",
      // Set this to false to not auto word wrap minified files
      wordWrapMinified: true,
    };

    return { monacoEditorOptions };
  },
});
</script>

<style scoped>
.monaco-editor {
}
</style>
