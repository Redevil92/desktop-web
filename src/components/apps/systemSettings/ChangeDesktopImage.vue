<template>
  <div class="flex container" :style="`height: ${height}px`">
    <div class="file-list-container">
      <div class="grid">
        <!-- <div class="desktop-image-item add-new-image">
          <div>
            <span class="mdi mdi-plus add-icon"></span>
          </div>
        </div> -->
        <div
          v-for="wallpaperPath in wallpaperList"
          :key="'desktop-image-' + wallpaperPath"
          @click="settingsStore.setWallpaperPath(wallpaperPath)"
        >
          <WallpaperPreview :path="wallpaperPath" />
        </div>
      </div>
    </div>
    <div style="overflow-y: auto; padding-right: 10px">
      <div
        style="
          color: var(--font-color);
          text-align: left;
          margin-left: 10px;
          margin-bottom: 10px;
          font-weight: 600;
        "
      >
        Wallpaper
      </div>

      <WallpaperPreview
        :path="settingsStore.wallpaperPath"
        big
        :showSelected="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsStore } from "@/stores/settingsStore";
import { computed, onMounted } from "vue";

import WallpaperPreview from "@/components/apps/systemSettings/WallpaperPreview.vue";

defineProps({
  height: {
    type: Number,
    required: true,
  },
});

const settingsStore = useSettingsStore();

const wallpaperList = computed(() => {
  return settingsStore.wallpaperList;
});

onMounted(async () => {
  await settingsStore.loadWallpapers();
});
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

.add-new-image {
  background-color: white;
}

.add-icon {
  font-size: 40px;
}
</style>
