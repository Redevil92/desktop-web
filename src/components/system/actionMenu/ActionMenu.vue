<template>
  <div v-if="actionMenuParams.show">
    <ActionsContainer
      :position="actionMenuParams.position"
      :actionList="actionMenuParams.customLayout || []"
    ></ActionsContainer>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from "vue";

import { useFileSystemStore } from "@/stores/fileSystemStore";
import ActionsContainer from "./ActionsContainer.vue";

const fileSystemStore = useFileSystemStore();

// props -> path
const actionMenuParams = computed(function () {
  return fileSystemStore.actionMenu;
});

const closeActionDialog = () => {
  fileSystemStore.closeActionMenu();
};

onMounted(() => {
  window.addEventListener("click", closeActionDialog);
});

onUnmounted(() => {
  window.removeEventListener("click", closeActionDialog);
});
</script>

<style scoped></style>
