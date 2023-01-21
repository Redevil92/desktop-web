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

<script lang="ts" setup>
import PathAndContent from "@/models/PathAndContent";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { ref } from "vue";

const props = defineProps({
  dropPath: String,
});

const fileSystemStore = useFileSystemStore();

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
}

const filesDroppedHandler = (files: any) => {
  if (props.dropPath) {
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = async function (e) {
        // Problem in dropping JPEG files, this is a momentanery fix
        // TODO: figure it out why it complains with jpeg (hint, the problem could be related to the icon used in the desktop and in the folder header)

        await fileSystemStore.createFile(
          {
            path: props.dropPath + "/" + file.name,
            content: reader.result?.toString(),
          } as PathAndContent,
          false
        );

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
</script>

<style scoped></style>
