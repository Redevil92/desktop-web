<template>
  <div @mouseenter="showItemsContainerHandler(true)" @mouseleave="showItemsContainerHandler(false)" ref="testRef">
    <div v-if="showItemsContainer" ref="itemsContainerRef" class="items-container">
      <div v-for="(item, index) in items" :key="index" @click="taskBarItemClickHandler(item)" class="item-content">
        <div class="flex">
          <FileIcon class="item-icon" :icon="item.icon" :height="17" :noStyle="true" />
          {{ getFileNameFromPath(item.path) }}
        </div>
        <img
          :src="`${getPreviewImageFromSessionStorage(item.path)}`"
          alt=""
          :id="`image-${item.path}`"
          class="preview-image"
        />
      </div>
      <div></div>
    </div>
    <div class="task-bar-item" :class="showItemsContainer ? 'task-bar-item-focused' : ''">
      <div>
        <img
          class="task-bar-icon"
          height="25"
          :src="
            items[0].icon
              ? require('/src/assets/fileIcons/' + items[0].icon)
              : require('/src/assets/fileIcons/unknow.svg')
          "
          alt=""
        />
        <div class="flex-center">
          <div class="bottom-bar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import FileIcon from "@/components/shared/FileIcon.vue";

import ItemDialog from "@/models/ItemDialog";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { getPreviewImageFromSessionStorage } from "@/hooks/useSessionStorage";

export default defineComponent({
  props: {
    items: { type: Array as PropType<ItemDialog[]>, required: true },
  },
  components: { FileIcon },
  setup(props) {
    const fileSystemStore = useFileSystemStore();
    const showItemsContainer = ref(false);
    const testRef = ref<HTMLElement>();

    const showItemsContainerHandler = (show: boolean) => {
      showItemsContainer.value = show;
    };

    const taskBarItemClickHandler = (item: ItemDialog) => {
      if (item.isCollapsed) {
        fileSystemStore.openMinimizedItemDialog(item.guid);
        fileSystemStore.setFocusedItemDialog(item);
        showItemsContainer.value = false;
      } else {
        const itemRef = document.getElementById(item.guid) || undefined;
        fileSystemStore.minimizeItemDialog(item.guid, itemRef);
        fileSystemStore.setFocusedItemDialog({} as ItemDialog);
      }
    };

    return {
      getFileNameFromPath,
      getFileExtensionFromName,
      showItemsContainerHandler,
      taskBarItemClickHandler,
      showItemsContainer,
      testRef,
      getPreviewImageFromSessionStorage,
    };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.task-bar-item {
  overflow-x: hidden;
  display: flex;
  align-items: center;
  height: var(--task-bar-height);
}

.task-bar-item:hover,
.task-bar-item-focused {
  background-color: rgba(128, 128, 128, 0.393);
}

.task-bar-item:hover .bottom-bar {
  background-color: var(--selected-color_light);
}

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

.preview-image {
  max-height: 170px;
}

.bottom-bar {
  height: 3px;
  width: 8px;
  background-color: var(--font-color_dark);
  border-radius: var(--border-radius);
}
</style>
