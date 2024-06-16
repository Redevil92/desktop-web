<template>
  <div class="start-menu-container" ref="startMenuRef">
    <BaseInput
      :autocomplete="false"
      :searchBar="true"
      placeholder="Type here to search"
      v-model="search"
      class="search-bar"
    />
    <div class="start-menu-content">
      
      <div class="pinned-application">
        <div class="flex">
          <div class="all-apps-button" :class="{'all-apps-selected': tabSelected === 'pinned'}" @click="tabSelected = 'pinned'">
           Pinned
          </div>
          <div class="all-apps-button" :class="{'all-apps-selected': tabSelected === 'all'}" @click="tabSelected = 'all'" style="margin-left: 5px;">
              All apps
          </div>
        </div>
      </div>

      <div v-if="tabSelected === 'pinned'">
        <div class="pinned-text">Pinned</div>
        <div class="pinned-application-container">
          <div v-for="app in pinnedApps" :key="'pinned-' + app.app">
            <AppItem
              @closeStartMenu="setStartMenuOpened(false)"
              :app="app.app"
              :name="app.name"
              :icon="app.icon"
            ></AppItem>
          </div>
        </div>
        <div class="reccomanded-container">
          <div class="pinned-text">Suggested files</div>
          <div v-for="suggestion in suggestions">

          </div>
        </div>
      </div>

      <div v-if="tabSelected === 'all'" >
        <div class="pinned-text">All apps</div>
        <div class="pinned-application-container">
          <div v-for="app in allFilteredAppsToShow" :key="'all-app-' + app.title">
          <AppItem
            @closeStartMenu="setStartMenuOpened(false)"
            :app="app.key"
            :name="app.title"
            :icon="app.icon"
          ></AppItem>
        </div>
        </div>
   
      </div>

      <!-- RECCOMANDED APPLICATION -->
      <!-- YOUR CUSTOMIZATION / POWER OFF -->
      <div class="user-profile-container">
        <div class="flex-center">
          <div class="avatar-container">
            <TheAvatar :avatar="settingsStore.avatar" />
          </div>
          <!-- <img height="40" :src="require('/src/assets/avatar/male.png')" alt="" /> -->
          <!-- <div class="user-name">Your username</div> -->
        </div>

        <span @click="refreshPage" class="mdi mdi-power power-icon"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import AppItem from '@/components/system/startMenu/AppItem.vue';
import TheAvatar from '@/components/system/avatarEditor/TheAvatar.vue';

import { useLayoutStore } from '@/stores/layoutStore';
import { useStartMenuStore } from '@/stores/startMenuStore';

import fileTypesConfiguration from '@/models/FilesType';
import { useSettingsStore } from '@/stores/settingsStore';

const props = defineProps({
  openStartMenuButtonRef: HTMLElement
});

const layoutStore = useLayoutStore();
const startMenuStore = useStartMenuStore();
const settingsStore = useSettingsStore();

const search = ref('');
const tabSelected = ref('pinned');

const suggestions = computed<string[]>(() => {
  return startMenuStore.suggestionFiles;
});

const pinnedApps = computed(() => {
  return startMenuStore.pinnedApps;
});

const allFilteredAppsToShow = computed(() => {
  const checkDuplicateApps: any = {};
  return Object.keys(fileTypesConfiguration)
    .map((key) => {
      return { ...fileTypesConfiguration[key], key };
    })
    .filter((app) => {
      if (checkDuplicateApps[app.application]) {
        return;
      }
      if (app.canOpenWithoutFile) {
        if (!app.canRepeatInAppList) {
          checkDuplicateApps[app.application] = true;
        }

        return app;
      }
    })
    .filter(
      (app) =>
        app.application.toLowerCase().includes(search.value.toLowerCase()) ||
        app.title.toLowerCase().includes(search.value.toLowerCase()) ||
        app.key.toLowerCase().includes(search.value.toLowerCase())
    );
});

const startMenuRef = ref<HTMLElement | undefined>();

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
  window.addEventListener('click', closeStartMenu);
});

onUnmounted(() => {
  window.removeEventListener('click', closeStartMenu);
});
</script>

<style scoped>
.start-menu-container {
  height: 600px;
  width: 500px;
  position: absolute;
  bottom: calc(var(--task-bar-height) + var(--margin));
  border-radius: var(--border-radius);
  background-color: var(--background-color);
}

.search-bar {
  margin: calc(var(--margin) * 2);
  width: calc(500px - var(--margin) * 4);
}

.pinned-text {
  text-align: left;
  color: var(--font-color);
  font-size: var(--small-font-size);
  font-weight: 600;
  margin-top: 10px;
}

.flex{
  display: flex;

}

.flex-center {
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
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  padding: 5px;
  cursor: pointer;
}

.all-apps-selected {
  background-color: var(--selected-color) !important;
  font-weight: 600;
}

.all-apps-button:hover {
  background-color: var(--neutral-color_light);
}

.pinned-application {
  margin-bottom: calc(var(--margin)*2);
}

.pinned-application-container {
  display: grid;
  grid-template-columns: 85px 85px 85px 85px 85px;
  grid-template-rows: 80px auto;
  column-gap: 2px;
  margin-top: var(--margin);
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

.avatar-container:hover {
  cursor: pointer;
  padding: 5px;
  border-radius: var(--border-radius);
  background-color: var(--background-color_light);
}

.avatar-container {
  padding: 5px;
}

.power-icon {
  color: white;
  font-size: 22px;
  cursor: pointer;
  padding: 0px 3px;
  border-radius: var(--border-radius);
}

.power-icon:hover {
  background-color: var(--background-color_contrast);
}

.all-apps-container {
  height: 405px;
  overflow: auto;
  margin-top: var(--margin);
}
</style>
