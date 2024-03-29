<template>
  <div class="flex container" :style="`height: ${height}px`">
    <div class="file-list-container">
      <div class="grid">
        <div
          v-for="image in desktopImagesList"
          :key="'desktop-image-' + image"
          class="desktop-image-item"
          :class="image === selectedDesktopImage ? 'selected-desktop-image-item' : ''"
          @click="setDesktopImage(image)"
          :style="{ 'background-image': 'url(' + getDesktopImageUrl(image) + ')' }"
        ></div>
      </div>
    </div>
    <div
      class="desktop-image-preview"
      :style="{
        'background-image': 'url(' + getDesktopImageUrl(selectedDesktopImage) + ')'
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settingsStore';
import { computed } from 'vue';

const props = defineProps({
  height: {
    type: Number,
    required: true
  }
});

const settingsStore = useSettingsStore();

const desktopImagesList = computed(() => {
  return settingsStore.desktopImagesList;
});

const selectedDesktopImage = computed(() => {
  return settingsStore.desktopImage;
});

const setDesktopImage = (desktopImageSelected: string) => {
  settingsStore.setDesktopImage(desktopImageSelected);
};

const getDesktopImageUrl = (desktopImage: string) => {
  return new URL(`/src/assets/desktopImages/${desktopImage}`, import.meta.url).href;
};
</script>

<style scoped>
.flex {
  display: flex;
}

.grid {
  display: grid;
  grid-template-columns: 120px 120px;
  grid-gap: 10px;
}

.container {
  padding: var(--margin) 0px;
}

.file-list-container {
  background-color: var(--background-color_light);
  border: 1px solid var(--neutral-color);
  border-radius: var(--border-radius);
  width: 270px;
  overflow-y: auto;
  flex: none;
  padding-top: var(--margin);
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
  border: 3px solid grey;
  cursor: pointer;
}

.selected-desktop-image-item {
  border: 3px solid var(--selected-color);
}

.desktop-image-preview {
  height: 100%;
  width: 600px;

  margin-left: calc(var(--margin));
  margin-bottom: calc(var(--margin) * 2);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  border-radius: var(--border-radius);
}
</style>
