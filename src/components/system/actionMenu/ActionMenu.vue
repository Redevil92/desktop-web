<template>
  <div
    v-if="actionMenuParams && actionMenuParams.show && actionMenuParams.position"
    :style="`top: ${actionMenuParams.position.y}px; left: ${actionMenuParams.position.x}px;`"
    class="actions-dialog padding"
  >
    <div v-if="actionMenuParams.customLayout">
      <div v-for="(group, i) in actionsByGroup" :key="`group-${i}`">
        <div :class="{ 'horizontal-group': group[1][0].horizontalGroup }">
          <div v-for="(item, j) in group[1]" @click="item.callback" :key="`group-${j}-action-${i}`">
            <div class="action" :class="{ 'disabled-action': item.disabled }">
              <div v-if="item.icon">
                <img height="18" :src="require(`/src/assets/icons/${item.icon}`)" alt="" />
              </div>
              <div v-else-if="item.materialIcon">
                <span class="material-icon" :class="`mdi ${item.materialIcon}`"></span>
              </div>
              <div v-if="!item.iconOnly" class="action-name">
                {{ item.actionName }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="actionsByGroup.size !== i + 1" class="separator-line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onDeactivated } from "vue";

import { useFileSystemStore } from "@/stores/fileSystemStore";
import { ActionItem } from "@/models/ActionMenu";

const emit = defineEmits(["onAddNewFile", "onAddNewFolder"]);

const fileSystemStore = useFileSystemStore();

// props -> path
const actionMenuParams = computed(function () {
  return fileSystemStore.actionMenu;
});

const actionsByGroup = computed(() => {
  const actions: Map<string, ActionItem[]> = new Map();
  if (actionMenuParams.value.customLayout) {
    actionMenuParams.value.customLayout.forEach((action) => {
      if (actions.has(action.groupName)) {
        actions.get(action.groupName)?.push(action);
      } else actions.set(action.groupName, [action]);
    });
  }
  console.log(actions);
  return actions;
});

const closeActionDialog = () => {
  fileSystemStore.closeActionMenu();
};

onMounted(() => {
  window.addEventListener("click", closeActionDialog);
});

onDeactivated(() => {
  window.removeEventListener("click", closeActionDialog);
});
</script>

<style scoped>
.horizontal-group {
  display: flex;
}

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

.actions-dialog {
  /* border: 1px solid #aaaaaab3;
  outline: 1px solid #575757; */
  color: white;
  border-radius: var(--border-radius);
  position: absolute;
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
