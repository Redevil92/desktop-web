<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <div class="system-container">
      <div class="system-header-container">
        <TheAvatar :avatar="settingsStore.avatar" :height="70" />

        <div class="text-container">
          <div class="settings-page-title">Your avatar</div>
          <div class="sub-title">Click on your avatar to modify it (work in progress).</div>
        </div>
      </div>
      <hr />
      <div class="settings-section">
        <div v-if="!openedSettingComponentPath" class="settings-buttons-list">
          <div class="settings-button" @click="setSettingComponent('ChangeDesktopImage')">
            <img height="40" :src="changeDesktopImage" alt="" />
            <div class="settings-name">Desktop image</div>
          </div>
          <div class="settings-button" @click="setSettingComponent('EditUserAvatar')">
            <img height="40" :src="editUserAvatar" alt="" />
            <div class="settings-name">Avatar</div>
          </div>
          <div
            class="settings-button margin-left"
            @click="setSettingComponent('TaskBarCustomization')"
          >
            <img height="40" :src="taskBarCustomization" alt="" />
            <div class="settings-name">Task bar</div>
          </div>
        </div>
        <div v-else>
          <div class="back-button" @click="openedSettingComponentPath = ''">
            <span class="mdi mdi-chevron-left"></span> Back
          </div>
          <component :is="settingAsyncComponent" :height="settingsComponentHeight"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, PropType, ref } from 'vue';

import TheAvatar from '@/components/system/avatarEditor/TheAvatar.vue';

import ItemDialog from '@/models/ItemDialog';
import LoadingComponent from '@/components/shared/LoadingComponent.vue';
import ErrorComponent from '@/components/shared/ErrorComponent.vue';
import { useSettingsStore } from '@/stores/settingsStore';

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true }
});

const settingsStore = useSettingsStore();

const openedSettingComponentPath = ref();
const changeDesktopImage = new URL('/src/assets/icons/change-desktop.svg', import.meta.url).href;
const editUserAvatar = new URL('/src/assets/icons/avatar.png', import.meta.url).href;
const taskBarCustomization = new URL('/src/assets/icons/task-bar.svg', import.meta.url).href;

const settingsComponentHeight = computed(() => {
  return (props.itemDialog?.dimension.height || 200) - 180;
});

const setSettingComponent = (componentName: string) => {
  openedSettingComponentPath.value = './' + componentName;
};

const settingAsyncComponent = computed(() => {
  if (!openedSettingComponentPath.value) return;

  console.log('openedSettingComponentPath.value', openedSettingComponentPath.value);
  return defineAsyncComponent({
    loader: () => import(`${openedSettingComponentPath.value}.vue`),
    loadingComponent: LoadingComponent,
    delay: 200,
    errorComponent: ErrorComponent,
    timeout: 3000
  });
});
</script>

<style scoped>
.settings-buttons-list {
  display: flex;
}

.settings-section {
  margin-top: calc(var(--margin) * 1);
}

.system-container {
  padding: calc(var(--margin) * 2);
}

.system-header-container {
  margin-bottom: calc(var(--margin) * 2);
  display: flex;
}

.settings-page-title {
  font-size: var(--large-font-size);
  font-weight: 600;
  color: white;
}

.text-container {
  margin-top: var(--margin);
  margin-left: calc(var(--margin) * 2);
  text-align: left;
}

.sub-title {
  color: white;
  font-size: var(--small-font-size);
}

.settings-name {
  font-size: var(--small-font-size);
  color: white;
}

.settings-button {
  padding: 10px;
  width: fit-content;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.settings-button:hover {
  background-color: var(--background-color_light);
}

.back-button {
  color: var(--font-color);
  border-radius: var(--border-radius);
  background-color: var(--neutral-color);
  font-size: var(--small-font-size);
  width: 60px;
  cursor: pointer;
}

.back-button:hover {
  background-color: var(--neutral-color_dark);
}

.margin-left {
  margin-left: var(--margin);
}
</style>
