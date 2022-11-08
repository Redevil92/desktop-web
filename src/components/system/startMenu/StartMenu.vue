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
      <div class="pinned-application-container">
        <!-- these application should come from the store/local storage -->

        <div
          v-for="app in pinnedApps"
          :key="'pinned-' + app.app"
          class="application-button"
          @click="createItemDialog(app.app)"
        >
          <div class="icon-image">
            <img width="40" :src="require(`/src/assets/fileIcons/${app.icon}`)" alt="" />
          </div>
          <div class="application-name one-line-ellipsis">{{app.name}}</div>
        </div>
      </div>

      <div class="reccomanded-container">
        <div class="pinned-text">Reccomanded</div>
        <div style="margin-top: var(--margin)">No reccomandation for now</div>
      </div>

      <!-- RECCOMANDED APPLICATION -->
      <!-- YOUR CUSTOMIZATION / POWER OFF -->
      <div class="user-profile-container">
        <div class="flex">
          <img height="40" :src="require('/src/assets/avatar/male.png')" alt="" />
          <div class="user-name">Your username</div>
        </div>

        <span @click="refreshPage" class="mdi mdi-power power-icon"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onDeactivated, onMounted, ref } from "vue";
import BaseSearchBar from "@/components/shared/BaseSearchBar.vue";
import DesktopItem from "@/models/DesktopItem";

import { useLayoutStore } from "@/stores/layoutStore";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { useStartMenuStore } from "@/stores/startMenuStore";

export default defineComponent({
  props: {
    openStartMenuButtonRef: HTMLElement,
  },
  components: { BaseSearchBar },
  setup(props) {
    const layoutStore = useLayoutStore();
    const startMenuStore = useStartMenuStore();
    const fileSystemStore = useFileSystemStore();

    const search = ref("Type here to search");

    const pinnedApps = computed(() => {
      console.log("HELP", startMenuStore.pinnedApps);
      return startMenuStore.pinnedApps;
    });

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

    const refreshPage = () => {
      location.reload();
    };

    onMounted(() => {
      window.addEventListener("click", closeStartMenu);
    });

    onDeactivated(() => {
      window.removeEventListener("click", closeStartMenu);
    });

    return { search, pinnedApps, createItemDialog, setStartMenuOpened, refreshPage, startMenuRef };
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
  align-items: center;
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

.pinned-application-container {
  display: grid;
  grid-template-columns: 85px 85px 85px 85px 85px;
  grid-template-rows: 80px auto;
  column-gap: 2px;
}

.application-name {
  font-size: var(--small-font-size);
  color: white;
  width: 70px;
  margin-top: 5px;
}

.application-button {
  padding: 10px 5px;
  width: fit-content;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.icon-image {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.application-button:hover {
  background-color: var(--background-color_contrast);
}

.one-line-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reccomanded-container {
  margin-top: calc(var(--margin) * 3);
  text-align: initial;
  color: var(--font-color);
  font-size: var(--small-font-size);
}

.user-profile-container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0px;
  left: 0px;
  background-color: var(--background-color_contrast);
  width: 100%;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  padding: 10px 30px;
  color: white;
}

.user-name {
  font-size: var(--medium-font-size);
  font-weight: 600;
  margin-left: var(--margin);
}

.power-icon {
  color: white;
  font-size: 22px;
  cursor: pointer;
  padding: 0px 3px;
  border-radius: var(--border-radius);
}

.power-icon:hover {
  background-color: var(--background-color_light);
}
</style>
