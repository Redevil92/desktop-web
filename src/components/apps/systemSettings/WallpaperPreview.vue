<template>
  <div class="desktop-container">
    <div v-if="showSelected">
      <span
        v-if="path === settingsStore.wallpaperPath"
        class="mdi mdi-check-circle"
        style="
          font-size: 20px;
          color: var(--selected-color_light);
          position: absolute;
          right: 2px;
          bottom: 2px;
        "
      ></span>
      <span
        v-if="path === settingsStore.wallpaperPath"
        class="mdi mdi-check"
        style="
          font-size: 20px;
          color: white;
          position: absolute;
          right: 2px;
          bottom: 2px;
        "
      ></span>
    </div>

    <img
      class="desktop-image-item"
      :class="{ 'desktop-container-image-large': big }"
      :src="`${image}`"
      alt=""
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import fileSystem from "@/context/fileSystemController";
import { useSettingsStore } from "@/stores/settingsStore";

const settingsStore = useSettingsStore();

const image = ref("");

const props = defineProps({
  path: { type: String, required: true },
  big: { type: Boolean, default: false },
  showSelected: { type: Boolean, default: true },
});

watch(
  () => props.path,
  () => {
    setImage();
  }
);

const setImage = async () => {
  const file = await fileSystem.readFile(props.path);
  image.value = file.toString();
};

onMounted(async () => {
  await setImage();
});
</script>

<style scoped>
.desktop-container {
  pointer-events: none;
  user-select: none;
  position: relative;
}

.desktop-image-item {
  height: 70px;
  width: 110px;
  margin-left: var(--margin);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.desktop-container-image-large {
  height: 100%;
  width: 100%;
}
</style>
