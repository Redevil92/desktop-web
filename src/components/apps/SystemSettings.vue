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
        <div class="settings-button">
          <img height="40" :src="require('/src/assets/icons/change-desktop.svg')" alt="" />
          <div class="settings-name">Desktop</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    return {};
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
