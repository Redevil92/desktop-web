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
      console.log("HIIIIIIIIIII man how are you");
      setInactive();
      filesDroppedHandler([...event.dataTransfer.files]);
    }

    const filesDroppedHandler = (files: any) => {
      if (props.dropPath) {
        files.forEach((file: any) => {
          const reader = new FileReader();
          reader.onload = async function (e) {
            const dropPathFiles = await getFiles(props.dropPath || "", true);

            // Problem in dropping JPEG files, this is a momentanery fix
            // TODO: figure it out why it complains with jpeg (hint, the problem could be related to the icon used in the desktop and in the folder header)
            const uniquePath =
              generateUniqueName(getFileNameWithoutExtension(props.dropPath + "/" + file.name), dropPathFiles) +
              "." +
              getFileExtensionFromName(file.name).replace("jpeg", "jpg");

            await store.dispatch("fileSystem/CREATE_FILE", { path: uniquePath, content: reader.result?.toString() });

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

    return { onDrop, active, setActive, setInactive };
  },
});
</script>

<style scoped></style>
