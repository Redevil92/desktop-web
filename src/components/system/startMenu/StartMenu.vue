<template>
  <div class="start-menu-container" ref="startMenuRef">
    <BaseSearchBar :autocomplete="false" v-model="search" class="search-bar" />
    <div class="start-menu-content">
      <!-- PINNED APPLICATION -->
      <div class="pinned-application">
        <div class="flex">
          <div class="pinned-text">{{ showAllApps ? "All apps" : "Pinned" }}</div>
          <div class="all-apps-button" @click="showAllApps = !showAllApps">
            {{ showAllApps ? "Pinned" : "All apps" }}
          </div>
        </div>
      </div>
      <div v-if="!showAllApps">
        <div class="pinned-application-container">
          <!-- these application should come from the store/local storage -->

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
          <div class="pinned-text">Reccomanded</div>
          <div style="margin-top: var(--margin)">No reccomandation for now</div>
        </div>
      </div>
      <div v-else class="all-apps-container">
        <div v-for="app in allAppsToShow" :key="'all-app-' + app.title">
          <AppItem
            @closeStartMenu="setStartMenuOpened(false)"
            :lineLayout="true"
            :app="app.key"
            :name="app.title"
            :icon="app.icon"
          ></AppItem>
        </div>
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
import AppItem from "@/components/system/startMenu/AppItem.vue";

import { useLayoutStore } from "@/stores/layoutStore";
import { useStartMenuStore } from "@/stores/startMenuStore";

import fileTypesConfiguration from "@/models/FilesType";

export default defineComponent({
  props: {
    openStartMenuButtonRef: HTMLElement,
  },
  components: { BaseSearchBar, AppItem },
  setup(props) {
    const layoutStore = useLayoutStore();
    const startMenuStore = useStartMenuStore();

    const search = ref("Type here to search");
    const showAllApps = ref(false);

    const pinnedApps = computed(() => {
      return startMenuStore.pinnedApps;
    });

    const allAppsToShow = computed(() => {
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
        });
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
      window.addEventListener("click", closeStartMenu);
    });

    onDeactivated(() => {
      window.removeEventListener("click", closeStartMenu);
    });

    return {
      search,
      pinnedApps,
      setStartMenuOpened,
      refreshPage,
      startMenuRef,
      showAllApps,
      allAppsToShow,
    };
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
  cursor: pointer;
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
  height: 430px;
  overflow: auto;
  margin-top: var(--margin);
}
</style>
