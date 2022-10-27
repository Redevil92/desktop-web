<template>
  <div class="start-menu-container" ref="startMenuRef">
    <BaseSearchBar v-model="search" class="search-bar" />

    <div class="start-menu-content">
      <!-- PINNED APPLICATION -->
      <div class="pinned-application">
        <div class="flex">
          <div class="pinned-text">Pinned</div>
          <div class="all-apps-button">All apps</div>
        </div>
      </div>
      <div>
        <!-- these application should come from the store/local storage -->
        <div class="application-button" @click="createItemDialog('settings')">
          <img height="40" :src="require('/src/assets/fileIcons/settings.svg')" alt="" />
          <div class="application-name">Settings</div>
        </div>
        <div class="application-button" @click="createItemDialog('text')">
          <img height="40" :src="require('/src/assets/fileIcons/txt.svg')" alt="" />
          <div class="application-name">Rich text</div>
        </div>
        <div class="application-button" @click="createItemDialog('browser')">
          <img height="40" :src="require('/src/assets/fileIcons/browser.svg')" alt="" />
          <div class="application-name">Browser</div>
        </div>
      </div>
      <!-- RECCOMANDED APPLICATION -->
      <!-- YOUR CUSTOMIZATION / POWER OFF -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onDeactivated, onMounted, ref } from "vue";
import BaseSearchBar from "@/components/shared/BaseSearchBar.vue";
import DesktopItem from "@/models/DesktopItem";

import { useLayoutStore } from "@/stores/layoutStore";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    openStartMenuButtonRef: HTMLElement,
  },
  components: { BaseSearchBar },
  setup(props) {
    const layoutStore = useLayoutStore();
    const fileSystemStore = useFileSystemStore();

    const search = ref("Type here to search");
    const startMenuRef = ref<HTMLElement | undefined>();

    const createItemDialog = (applicationToOpen: string) => {
      setStartMenuOpened(false);

      const settingsApp: DesktopItem = {
        path: "",
        coordinates: { x: 0, y: 0 },
        applicationExtension: applicationToOpen,
        isSelected: true,
      };
      fileSystemStore.createItemDialog(settingsApp);
    };

    const setStartMenuOpened = (isOpened: boolean) => {
      layoutStore.setStartMenuOpened(isOpened);
    };

    const closeStartMenu = (event: any) => {
      if (
        startMenuRef.value &&
        !startMenuRef.value.contains(event.target) &&
        props.openStartMenuButtonRef &&
        !props.openStartMenuButtonRef.contains(event.target)
      ) {
        setStartMenuOpened(false);
      }
    };

    onMounted(() => {
      window.addEventListener("click", closeStartMenu);
    });

    onDeactivated(() => {
      window.removeEventListener("click", closeStartMenu);
    });

    return { search, createItemDialog, setStartMenuOpened, startMenuRef };
  },
});
</script>

<style scoped>
.start-menu-container {
  height: 600px;
  width: 500px;
  position: absolute;
  left: var(--margin);
  bottom: calc(var(--task-bar-height) + var(--margin));
  border-radius: var(--border-radius);
  background-color: var(--background-color);
}

.search-bar {
  margin: var(--margin);
  width: calc(500px - var(--margin) * 2);
}

.pinned-text {
  color: var(--font-color);
  font-size: var(--small-font-size);
  font-weight: 600;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.start-menu-content {
  padding: 10px 30px;
}

.all-apps-button {
  color: var(--font-color);
  font-size: var(--small-font-size);
  background-color: var(--background-color_light);
  padding: 5px;
}

.application-name {
  font-size: var(--small-font-size);
  color: white;
}

.application-button {
  padding: 10px;
  width: fit-content;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.application-button:hover {
  background-color: var(--background-color_light);
}
</style>
