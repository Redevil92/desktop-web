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
import PathAndContent from "@/models/PathAndContent";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    dropPath: String,
  },
  components: {},

  setup(props, context) {
    const fileSystemStore = useFileSystemStore();

    let active = ref(false);

    function setActive() {
      console.log("HELLO mNA");
      active.value = true;
    }
    function setInactive() {
      console.log("HELLO mNA");
      active.value = false;
    }

    function onDrop(event: any) {
      console.log("HELLO");
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

            await fileSystemStore.createFile({
              path: uniquePath,
              content: reader.result?.toString(),
            } as PathAndContent);

            refreshFiles();
          };
          reader.readAsDataURL(file);
        });
      }
    };

    const refreshFiles = () => {
      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();
    };

    return { onDrop, active, setActive, setInactive };
  },
});
</script>

<style scoped></style>
