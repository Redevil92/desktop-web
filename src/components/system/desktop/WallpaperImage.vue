<template>
  <div class="desktop-container">
    <img
      style="height: inherit; object-fit: cover; width: inherit"
      :src="`${desktopImage}`"
      alt=""
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import fileSystem from "@/context/fileSystemController";
import { useSettingsStore } from "@/stores/settingsStore";

const settingsStore = useSettingsStore();

const desktopImage = ref("");

watch(
  () => settingsStore.wallpaperPath,
  () => {
    setDesktopImage();
  }
);

const setDesktopImage = async () => {
  const file = await fileSystem.readFile(settingsStore.wallpaperPath);
  desktopImage.value = file.toString();
};

onMounted(async () => {
  setDesktopImage();
});
</script>

<style scoped>
.desktop-container {
  height: 100vh;
  width: 100vw;
  z-index: -1;
  pointer-events: none;
  user-select: none;
}
</style>
