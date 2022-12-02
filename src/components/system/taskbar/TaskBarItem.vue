<template>
  <div
    @mouseenter="
      {
        isMouseHoveringItem = true;
        showItemsPreviewHandler(true);
      }
    "
    @mouseleave="
      {
        isMouseHoveringItem = false;
        showItemsPreviewHandler(false);
      }
    "
  >
    <div
      v-if="showItemsPreview"
      :style="isOutOfScreen ? `right: 10px; max-width:90%; overflow-y:auto; height: auto; ` : ''"
      ref="itemsContainerRef"
      class="items-container"
    >
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
    </div>
    <div class="task-bar-item-container">
      <div class="task-bar-item" :class="showItemsPreview || isItemFocused ? 'task-bar-item-focused' : ''">
        <div>
          <img
            class="task-bar-icon"
            height="20"
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

      <div
        v-if="items.length > 1"
        class="multiple-items"
        :class="isItemFocused || isMouseHoveringItem ? 'multiple-items-selected' : ''"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, PropType, ref, watch } from "vue";

import FileIcon from "@/components/shared/FileIcon.vue";

import ItemDialog from "@/models/ItemDialog";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { getPreviewImageFromSessionStorage } from "@/hooks/useSessionStorage";

export default defineComponent({
  props: {
    items: { type: Array as PropType<ItemDialog[]>, required: true },
    previewOpened: { type: String },
  },
  components: { FileIcon },
  emits: ["onPreviewOpenedChanged"],
  setup(props, ctx) {
    const fileSystemStore = useFileSystemStore();
    const showItemsPreview = ref(false);
    const isMouseHoveringItem = ref(false);
    const itemToPreview = ref<ItemDialog | undefined>();
    const itemsContainerRef = ref<HTMLElement | undefined>();
    const isOutOfScreen = ref(false);

    watch(
      () => props.previewOpened,
      async function (newValue: any, oldValue: any) {
        if (newValue !== props.items[0].applicationToOpen) {
          showItemsPreview.value = false;
        }
      }
    );

    const isItemFocused = computed(() => {
      const index = props.items.findIndex((item) => item.isFocused === true && !item.isCollapsed);
      return index !== -1;
    });

    const showItemsPreviewHandler = async (show: boolean) => {
      if (!show) {
        setTimeout(() => {
          if (isMouseHoveringItem.value === false) {
            showItemsPreview.value = false;
            isOutOfScreen.value = false;
          }
        }, 300);
      } else {
        showItemsPreview.value = true;
        await nextTick();

        setIsPreviwOverflow();
        ctx.emit("onPreviewOpenedChanged", props.items[0].applicationToOpen);
      }
    };

    const setIsPreviwOverflow = () => {
      console.log("Hrööp", itemsContainerRef.value);
      if (itemsContainerRef.value && !isOutOfScreen.value) {
        const rect = itemsContainerRef.value.getBoundingClientRect();
        console.log(rect.x, rect.width, window.innerWidth);
        isOutOfScreen.value = rect.x + rect.width < 0 || rect.x + rect.width > window.innerWidth;
      }
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
        showItemsPreview.value = false;
      } else {
        fileSystemStore.minimizeItemDialog(item.guid);
        fileSystemStore.setFocusedItemDialog({} as ItemDialog);
      }
    };

    return {
      getFileNameFromPath,
      getFileExtensionFromName,
      showItemsPreviewHandler,
      taskBarItemClickHandler,
      getPreviewImageFromSessionStorage,
      setItemToPreview,
      removeItemToPreview,
      closeItem,
      isOutOfScreen,
      isMouseHoveringItem,
      isItemFocused,
      showItemsPreview,
      itemToPreview,
      itemsContainerRef,
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
  padding: 2px;
  border-radius: calc(var(--border-radius) / 2);
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
  top: -165px;
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
  border-radius: calc(var(--border-radius) / 2);
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
  width: 16px;
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

.multiple-items:hover,
.multiple-items-selected {
  position: absolute;
  right: -4px;
  height: 20px;
  margin-top: 5px;
  width: 4px;
  border-right: 3px solid rgba(128, 128, 128, 0.393);
  border-radius: 20px;
  margin-left: 1px;
}

.task-bar-item-container {
  margin: 3px;
  display: flex;
  position: relative;
}
</style>
