<template>
  <div :style="`top: ${position.y}px; left: ${position.x}px;`" class="actions-dialog">
    <div v-for="(group, i) in actionsByGroup" :key="`group-${i}`">
      <div :class="{ 'horizontal-group': group[1][0].horizontalGroup }">
        <ActionItemVue v-for="(item, j) in group[1]" :actionItem="item" :key="`group-${j}-action-${i}`"></ActionItemVue>
      </div>
      <div v-if="actionsByGroup.size !== i + 1" class="separator-line"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType } from "vue";

import { useFileSystemStore } from "@/stores/fileSystemStore";
import ActionItem from "@/models/ActionMenu/ActionItem";
import ActionItemVue from "./ActionItem.vue";
import Coordinates from "@/models/Coordinates";

const fileSystemStore = useFileSystemStore();

const props = defineProps({
  actionList: { type: Array as PropType<ActionItem[]>, required: true },
  position: { type: Object as PropType<Coordinates>, required: true },
});

const actionsByGroup = computed(() => {
  const actions: Map<string, ActionItem[]> = new Map();

  props.actionList.forEach((action) => {
    if (action) {
      if (actions.has(action.groupName)) {
        actions.get(action.groupName)?.push(action);
      } else {
        actions.set(action.groupName, [action]);
      }
    }
  });

  return actions;
});
</script>

<style scoped>
.horizontal-group {
  display: flex;
  padding: 4px 4px 0px 4px;
}

.actions-dialog {
  /* border: 1px solid #aaaaaab3;
    outline: 1px solid #575757; */
  color: white;
  border-radius: var(--border-radius);
  position: fixed;
  background-color: #616161ed;
  top: 160px;
  left: 600px;
  z-index: 999;
  text-align: left;
  box-shadow: 2px 3px 20px 0px rgba(122, 122, 122, 0.8);
  -webkit-box-shadow: 2px 3px 20px 0px rgba(107, 107, 107, 0.8);
}

.padding {
  padding: 5px 10px;
}

hr {
  margin: 5px 0px;
}

.separator-line {
  margin: 5px;
  border-bottom: 1px solid var(--font-color_light);
}
</style>
