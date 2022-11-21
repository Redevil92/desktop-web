<template>
  <div class="task-bar-item" :class="isFocused ? 'task-bar-item-focused' : ''" @click="taskBarItemClickHandler">
    <div v-if="item.icon">
      <img class="task-bar-icon" height="30" :src="require('/src/assets/fileIcons/' + item.icon)" alt="" />
    </div>

    <div v-else>
      <img class="task-bar-icon" height="30" :src="require('/src/assets/fileIcons/unknow.svg')" alt="" />
    </div>

    <!-- <p class="text">
      {{ item.name }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import { isDir } from "@/context/fileSystemController";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    msg: String,
    item: { type: Object as PropType<ItemDialog>, required: true },
  },
  components: {},
  setup(props) {
    const fileSystemStore = useFileSystemStore();

    const isFocused = computed(function () {
      const focusedItemDialog = fileSystemStore.getFocusedItemDialog as ItemDialog;
      if (focusedItemDialog && focusedItemDialog.guid === props.item.guid) {
        return true;
      }
      return false;
    });

    const taskBarItemClickHandler = () => {
      if (props.item.isCollapsed) {
        fileSystemStore.openMinimizedItemDialog(props.item.guid);
        fileSystemStore.setFocusedItemDialog(props.item);
      } else {
        fileSystemStore.minimizeItemDialog(props.item.guid);
        fileSystemStore.setFocusedItemDialog({} as ItemDialog);
      }
    };

    return { taskBarItemClickHandler, isFocused, getFileNameFromPath, getFileExtensionFromName, isDir };
  },
});
</script>

<style scoped>
.task-bar-item {
  overflow-x: hidden;

  display: flex;
  align-items: center;
}

.task-bar-item:hover,
.task-bar-item-focused {
  background-color: rgba(128, 128, 128, 0.393);
}

.text {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--small-font-size);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 2px;
}

.task-bar-icon {
  font-size: 16px;
  margin: 5px;
}
</style>
