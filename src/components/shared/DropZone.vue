<template>
  <div
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <!-- share state with the scoped slot -->
    <slot :dropZoneActive="active"></slot>
  </div>
</template>

<script lang="ts">
import { getFiles } from "@/context/fileSystemController";
import { generateUniqueName, getFileExtensionFromName, getFileNameWithoutExtension } from "@/context/fileSystemUtils";
import store from "@/store";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    dropPath: String,
  },
  components: {},

  setup(props, context) {
    let active = ref(false);

    function setActive() {
      active.value = true;
    }
    function setInactive() {
      active.value = false;
    }

    function onDrop(event: any) {
      setInactive();
      filesDroppedHandler([...event.dataTransfer.files]);
      //context.emit("onFilesDropped", [...event.dataTransfer.files]);
    }

    const filesDroppedHandler = (files: any) => {
      console.log(props.dropPath);
      if (props.dropPath) {
        files.forEach((file: any) => {
          const reader = new FileReader();
          reader.onload = async function (e) {
            const dropPathFiles = await getFiles(props.dropPath || "", true);
            console.log(2, dropPathFiles);
            const uniquePath =
              generateUniqueName(getFileNameWithoutExtension(props.dropPath + "/" + file.name), dropPathFiles) +
              "." +
              getFileExtensionFromName(file.name);

            console.log("3", uniquePath);

            await store.dispatch("fileSystem/CREATE_FILE", { path: uniquePath, content: reader.result?.toString() });
            //await createFile("my PC/Desktop/new.png", reader.result?.toString());

            refreshFiles();
          };
          reader.readAsDataURL(file);
        });
      }
    };

    const refreshFiles = () => {
      store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
    };

    return { onDrop, active };
  },
});
</script>

<style scoped></style>
