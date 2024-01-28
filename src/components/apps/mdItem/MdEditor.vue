<template>
  <div @click.stop :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <MdEditor
      @onSave="saveFile"
      @onUploadImg="uploadImageHandler"
      codeTheme="github"
      language="en-US"
      style="height: 100%"
      v-model="mdText"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, PropType } from "vue";
import ItemDialog from "@/models/ItemDialog";

import fileSystem from "@/context/fileSystemController";

import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import PathAndContent from "@/models/PathAndContent";

import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

const fileSystemStore = useFileSystemStore();
const { b64ToText, utf8ToB64, fileToBase64 } = useBase64Handler();

const mdText = ref("");

const saveFile = () => {
  if (props.itemDialog?.path) {
    fileSystemStore.updateFile({
      path: props.itemDialog?.path,
      content: utf8ToB64(mdText.value),
    } as PathAndContent);
  }
};

const uploadImageHandler = async (files: File[], callback: any) => {
  // save file in base 64 inside the md file itself
  const file = files[0];

  const base64String = await fileToBase64(file);
  mdText.value += `\n![${file.name}](${base64String})\n`;
  console.log(base64String);
};

onBeforeMount(async () => {
  if (props.itemDialog?.path) {
    let codeBase64 = await fileSystem.readFile(props.itemDialog?.path);

    mdText.value = b64ToText(codeBase64, true);
  }
});
</script>
