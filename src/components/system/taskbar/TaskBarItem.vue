<template>
  <div @mouseenter="showItemsContainerHandler(true)" @mouseleave="showItemsContainerHandler(false)" ref="testRef">
    <div v-if="showItemsContainer" ref="itemsContainerRef" class="items-container">
      <div
        v-for="(item, index) in items"
        :key="index"
        @mouseenter="setItemToPreview(item)"
        @mouseleave="removeItemToPreview"
        @click="taskBarItemClickHandler(item)"
        class="preview-item"
      >
        <div class="flex-space-between preview-header">
          <div class="flex">
            <FileIcon class="item-icon" :icon="item.icon" :height="15" :noStyle="true" />
            <div>
              {{ getFileNameFromPath(item.path) }}
            </div>
          </div>
          <div class="close-button" @click="closeItem(item)">
            <span class="mdi mdi-close"></span>
          </div>
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
          <div class="bottom-bar" :class="isItemFocused ? 'bottom-bar-selected' : 'bottom-bar-not-selected'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

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
    const itemToPreview = ref<ItemDialog | undefined>();

    const isItemFocused = computed(() => {
      const index = props.items.findIndex((item) => item.isFocused === true && !item.isCollapsed);
      return index !== -1;
    });

    const showItemsContainerHandler = (show: boolean) => {
      showItemsContainer.value = show;
    };

    const closeItem = (item: ItemDialog) => {
      fileSystemStore.closeItemDialog(item.guid);
    };

    const setItemToPreview = (item: ItemDialog) => {
      // if item is hidden set item as focused
      if (item.isCollapsed) {
        itemToPreview.value = item;
        fileSystemStore.openMinimizedItemDialog(item.guid);
      }

      fileSystemStore.setFocusedItemDialog(item);
      // [[ if click while mouse hover remove itemToPreview without collapse item ]]
    };

    const removeItemToPreview = () => {
      if (itemToPreview.value) {
        fileSystemStore.minimizeItemDialog(itemToPreview.value.guid);
        itemToPreview.value = undefined;
      }
    };

    const taskBarItemClickHandler = (item: ItemDialog) => {
      if (item.isCollapsed || itemToPreview.value) {
        itemToPreview.value = undefined;
        fileSystemStore.openMinimizedItemDialog(item.guid);
        fileSystemStore.setFocusedItemDialog(item);
        showItemsContainer.value = false;
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
      getPreviewImageFromSessionStorage,
      setItemToPreview,
      removeItemToPreview,
      closeItem,
      isItemFocused,
      showItemsContainer,
      testRef,
      itemToPreview,
    };
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.flex-space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.task-bar-item {
  overflow-x: hidden;
  display: flex;

  height: var(--task-bar-height);
}

.task-bar-item:hover,
.task-bar-item-focused {
  background-color: rgba(128, 128, 128, 0.393);
}

.task-bar-item:hover .bottom-bar-selected {
  background-color: var(--selected-color_light);
}

.preview-header {
  margin-bottom: 5px;
  align-items: center;
}

.task-bar-icon {
  margin: 0px 5px;
}

.items-container {
  position: absolute;
  display: flex;
  top: 0px;
  height: 160px;
  top: -160px;
  background-color: var(--background-color_contrast);
  border-radius: calc(var(--border-radius) / 2);
}

.preview-item {
  padding: 5px;
  color: var(--font-color);
  font-size: var(--small-font-size);
}

.preview-item:hover {
  background-color: rgba(128, 128, 128, 0.393);
}

.item-icon {
  margin-right: 5px;
}

.preview-image {
  max-height: 125px;
}

.bottom-bar {
  height: 3px;
  width: 8px;
  border-radius: var(--border-radius);
}

.bottom-bar-not-selected {
  background-color: var(--font-color_dark);
}

.bottom-bar-selected {
  background-color: var(--selected-color_light);
}

.close-button span {
  color: var(--font-color);
}

.close-button:hover span {
  color: var(--background-color);
}

.close-button:hover {
  background-color: var(--font-color);
}

.close-button {
  border-radius: calc(var(--border-radius) / 2);
  padding: 2px;
}
</style>
