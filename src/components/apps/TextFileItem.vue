<template>
  <SelectedFolderDialog
    v-if="showSaveAsDialog"
    @onFolderSelected="saveTextFileHandler"
    @closeDialog="showSaveAsDialog = false"
    to="textFileItem"
    :showSaveAsInput="true"
  ></SelectedFolderDialog>
  <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 5" />
  <div style="background-color: white">
    <div id="textFileItem" :style="`height: ${height}px;  width: calc(100% -4px); `">
      <div id="editor" style="background-color: white; border-radius: 10px; height: 100%"></div>
      <!-- <Editor
      v-if="isLoaded"
      class="mce-editor"
      api-key="yxb2ealwgpgr85gcgcl311khnyuz4abs13akcuyqscr4y6fr"
      :init="{
        height: '100%',
        resize: false,
        selector: 'textarea', // change this value according to your HTML
        plugins: 'save',
        menubar: false,
        toolbar:
          'save | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | \
           bullist numlist outdent indent | removeformat |',
      }"
      :initial-value="fileText"
      @saveContent="saveFile"
    /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import SelectedFolderDialog from "@/components/shared/SelectedFolderDialog.vue";
import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import Quill from "quill";
import "quill/dist/quill.snow.css";

import Editor from "@tinymce/tinymce-vue";
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
const { isBase64, b64ToText, utf8ToB64, removeDataUri } = useBase64Handler();

const quill = ref<Quill>();
const fileText = ref("");
const isLoaded = ref(false);
const showSaveAsDialog = ref(false);
const fileContent = ref("");

const saveFile = (_html: any, _body: any) => {
  if (props.itemDialog?.path) {
    const content = quill.value?.getText();
    fileSystemStore.updateFile({
      path: props.itemDialog?.path,
      content: utf8ToB64(content ?? ""),
    } as PathAndContent);
  } else {
    showSaveAsDialog.value = true;
  }
};

const saveTextFileHandler = async (destinationPath: string) => {
  const destinationPathToSave = destinationPath + ".txt";
  const content = quill.value?.getText();

  await fileSystemStore.createFile({ path: destinationPathToSave, content: utf8ToB64(content ?? "") });
  showSaveAsDialog.value = false;

  const itemDialogToUpdate = { ...props.itemDialog };
  itemDialogToUpdate.name = getFileNameFromPath(destinationPathToSave);
  fileSystemStore.updateItemDialog(itemDialogToUpdate);

  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();

  layoutStore.setSnackBar({
    show: true,
    text: `"${getFileNameFromPath(destinationPathToSave)}" created.`,
    severity: SEVERITY.information,
  });
};

onMounted(() => {
  const container = document.getElementById("editor");
  console.log(container);

  if (!container) return;
  const toolbarOptions = [
    [{ font: [] }, "bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme

    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  quill.value = new Quill(container, {
    theme: "snow",
    modules: {
      toolbar: toolbarOptions,
    },
  });

  // quill.value.on("text-change", (delta, oldDelta, source) => {
  //   console.log("change!", delta, oldDelta, source);
  //   if (source == "api") {
  //     console.log("An API call triggered this change.");
  //   } else if (source == "user") {
  //     console.log("A user action triggered this change.");
  //   }
  // });
});

onBeforeMount(async () => {
  if (props.itemDialog?.path) {
    let fileData = await fileSystem.readFile(props.itemDialog?.path);
    fileText.value = b64ToText(fileData, true);
    if (quill.value) {
      quill.value.setText(fileText.value);
    }

    isLoaded.value = true;
  } else {
    fileText.value = "";
    isLoaded.value = true;
  }
});
</script>
<style></style>
