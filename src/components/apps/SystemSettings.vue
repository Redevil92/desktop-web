<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <div class="system-container">
      <div class="system-header-container">
        <img height="70" :src="require('/src/assets/avatar/male.png')" alt="" />
        <div class="text-container">
          <div class="settings-page-title">Your avatar</div>
          <div class="sub-title">Click on your avatar to modify it (work in progress).</div>
        </div>
      </div>
      <hr />
      <div class="settings-section">
        <div v-if="!showSelectedSettingComponent" class="settings-buttons-list">
          <div class="settings-button" @click="loadAndSetSettingComponent('ChangeDesktopImage.vue')">
            <img height="40" :src="require('/src/assets/icons/change-desktop.svg')" alt="" />
            <div class="settings-name">Desktop image</div>
          </div>
          <div class="settings-button margin-left" @click="loadAndSetSettingComponent('TaskBarCustomization.vue')">
            <img height="40" :src="require('/src/assets/icons/task-bar.svg')" alt="" />
            <div class="settings-name">Task bar</div>
          </div>
        </div>
        <div v-else>
          <div class="back-button" @click="showSelectedSettingComponent = false">
            <span class="mdi mdi-chevron-left"></span> Back
          </div>
          <component :is="settingAsyncComponent" :height="settingsComponentHeight"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import LoadingComponent from "@/components/shared/LoadingComponent.vue";
import ErrorComponent from "@/components/shared/ErrorComponent.vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const showSelectedSettingComponent = ref(false);

    const settingAsyncComponent = ref({} as any);

    const settingsComponentHeight = computed(() => {
      return (props.itemDialog?.dimension.height || 200) - 180;
    });

    const loadAndSetSettingComponent = (componentName: string) => {
      showSelectedSettingComponent.value = true;

      settingAsyncComponent.value = defineAsyncComponent({
        loader: () => import("@/components/apps/systemSettings/" + componentName),
        loadingComponent: LoadingComponent,
        delay: 200,
        errorComponent: ErrorComponent,
        timeout: 3000,
      });
    };

    return { showSelectedSettingComponent, settingAsyncComponent, loadAndSetSettingComponent, settingsComponentHeight };
  },
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
