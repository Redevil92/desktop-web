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
        <div v-if="!showSelectedSettingComponent">
          <div class="settings-button" @click="loadAndSetSettingComponent('ChangeDesktopImage.vue')">
            <img height="40" :src="require('/src/assets/icons/change-desktop.svg')" alt="" />
            <div class="settings-name">Desktop</div>
          </div>
        </div>
        <div v-else>
          <component :is="settingAsyncComponent"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import LoadingComponent from "@/components/shared/LoadingComponent.vue";
import ErrorComponent from "@/components/shared/ErrorComponent.vue";
import testComponent from "@/components/apps/systemSettings/ChangeDesktopImage.vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  components: { testComponent },
  emits: [],
  setup(props, _) {
    const showSelectedSettingComponent = ref(false);

    const settingAsyncComponent = ref({} as any);

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

    return { showSelectedSettingComponent, settingAsyncComponent, loadAndSetSettingComponent };
  },
});
</script>

<style scoped>
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
</style>
