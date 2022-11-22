<template>
  <div
    @mouseenter="showItemsContainerHandler(true)"
    @mouseleave="showItemsContainerHandler(false)"
    @click="taskBarItemClickHandler"
  >
    <div v-if="showItemsContainer" ref="itemsContainerRef" class="items-container">
      <div v-for="(item, index) in items" :key="index" @click="taskBarItemClickHandler(item)" class="item-content">
        <FileIcon class="item-icon" :icon="item.icon" :height="17" :noStyle="true" />
        {{ getFileNameFromPath(item.path) }}
      </div>
    </div>
    <div class="task-bar-item" :class="showItemsContainer ? 'task-bar-item-focused' : ''">
      <div v-if="items[0].icon">
        <img class="task-bar-icon" height="28" :src="require('/src/assets/fileIcons/' + items[0].icon)" alt="" />
      </div>

      <div v-else>
        <img class="task-bar-icon" height="28" :src="require('/src/assets/fileIcons/unknow.svg')" alt="" />
      </div>
    </div>

    <!-- <p class="text">
      {{ item.name }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

import FileIcon from "@/components/shared/FileIcon.vue";

import ItemDialog from "@/models/ItemDialog";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    items: { type: Array as PropType<ItemDialog[]>, required: true },
  },
  components: { FileIcon },
  setup(props) {
    const fileSystemStore = useFileSystemStore();
    const showItemsContainer = ref(false);

    const showItemsContainerHandler = (show: boolean) => {
      showItemsContainer.value = show;
    };

    const taskBarItemClickHandler = (item: ItemDialog) => {
      if (item.isCollapsed) {
        fileSystemStore.openMinimizedItemDialog(item.guid);
        fileSystemStore.setFocusedItemDialog(item);
      } else {
        fileSystemStore.minimizeItemDialog(item.guid);
        fileSystemStore.setFocusedItemDialog({} as ItemDialog);
      }
    };

    return {
      getFileNameFromPath,
      getFileExtensionFromName,
      showItemsContainerHandler,
      taskBarItemClickHandler,
      showItemsContainer,
    };
  },
});
</script>

<style scoped>
.task-bar-item {
  overflow-x: hidden;
  display: flex;
  align-items: center;
  height: var(--task-bar-height);
  border-bottom: 3px solid var(--selected-color_light);
}

.task-bar-item:hover,
.task-bar-item-focused {
  background-color: rgba(128, 128, 128, 0.393);
}

/* .text {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--small-font-size);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 2px;
} */

.task-bar-icon {
  margin: 0px 5px;
}

.items-container {
  position: absolute;
  display: flex;
  top: 0px;
  height: 200px;
  top: -200px;
  background-color: var(--background-color_contrast);
}

.item-content {
  display: flex;
  padding: 5px;
  color: var(--font-color);
  font-size: var(--medium-font-size);
}

.item-content:hover {
  background-color: rgba(128, 128, 128, 0.393);
}

.item-icon {
  margin-right: 5px;
}
</style>
