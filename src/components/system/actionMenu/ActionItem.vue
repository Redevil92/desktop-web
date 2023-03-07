<template>
  <div @click="actionItem.callback">
    <div class="action" :class="{ 'disabled-action': actionItem.disabled }">
      <div v-if="actionItem.icon">
        <img height="18" :src="require(`/src/assets/icons/${actionItem.icon}`)" alt="" />
      </div>
      <div v-else-if="actionItem.materialIcon">
        <span class="material-icon" :class="`mdi ${actionItem.materialIcon}`"></span>
      </div>
      <div v-if="!actionItem.iconOnly" class="action-name">
        {{ actionItem.actionName }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

import { useFileSystemStore } from "@/stores/fileSystemStore";
import { ActionItem } from "@/models/ActionMenu";

const emit = defineEmits(["onAddNewFile", "onAddNewFolder"]);

const props = defineProps({
  actionItem: {
    type: Object as PropType<ActionItem>,
    required: true,
  },
});

const fileSystemStore = useFileSystemStore();
</script>

<style scoped>
.material-icon {
  font-size: 18px;
}

.action {
  padding: 2px 5px;
  margin-right: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.action:hover {
  background-color: var(--selected-color_opacity);
  border-radius: var(--border-radius);
}

.disabled-action {
  cursor: default;
  opacity: 0.3;
}

.action-button {
  padding: 2px 5px;
  border-radius: 5px;
  width: 100% !important;
  cursor: pointer;
  width: max-content;
}

.action-name {
  margin-left: var(--margin);
}

.disabled-action-button {
  padding: 0px 7px;
  border-radius: 5px;
  width: 100% !important;
  cursor: pointer;
  width: max-content;
  opacity: 0.5;
}

.action-button:hover {
  background-color: var(--selected-color);
}

hr {
  margin: 5px 0px;
}

.separator-line {
  margin: 5px;
  border-bottom: 1px solid var(--font-color_light);
}
</style>
