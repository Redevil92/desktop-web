<template>
  <div class="task-bar-item" :class="isFocused ? 'task-bar-item-focused' : ''" @click="taskBarItemClickHandler">
    <div v-if="getFileExtensionFromName(item.name)">
      <img
        style="margin-top: 3px"
        class="task-bar-icon"
        height="16"
        :src="require('/src/assets/fileIcons/' + getFileExtensionFromName(item.name) + '.svg')"
        alt=""
      />
    </div>
    <div v-else-if="isDir(item.name)">
      <!-- <span class="mdi mdi-folder-open task-bar-icon" style="color: #f6d573"></span> -->
      <img height="16" style="margin-top: 3px" :src="require('/src/assets/fileIcons/folder.svg')" alt="" />
    </div>
    <div v-else>
      <img class="task-bar-icon" height="16" :src="require('/src/assets/fileIcons/unknow.svg')" alt="" />
    </div>

    <p class="text">
      {{ getFileNameFromPath(item.name) }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";
import store from "@/store";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import { isDir } from "@/context/fileSystemController";

export default defineComponent({
  props: {
    msg: String,
    item: { type: Object as PropType<ItemDialog>, required: true },
  },
  components: {},
  setup(props) {
    const isFocused = computed(function () {
      const focusedItemDialog = store.getters["fileSystem/GET_FOCUSED_ITEM_DIALOG"] as ItemDialog;
      if (focusedItemDialog && focusedItemDialog.guid === props.item.guid) {
        return true;
      }
      return false;
    });

    const taskBarItemClickHandler = () => {
      if (props.item.isCollapsed) {
        store.dispatch("fileSystem/OPEN_MINIMIZED_ITEM_DIALOG", props.item.guid);
        store.dispatch("fileSystem/SET_FOCUSED_ITEM_DIALOG", props.item);
      } else {
        store.dispatch("fileSystem/MINIMIZE_ITEM_DIALOG", props.item.guid);
        store.dispatch("fileSystem/SET_FOCUSED_ITEM_DIALOG", {});
      }
    };

    return { taskBarItemClickHandler, isFocused, getFileNameFromPath, getFileExtensionFromName, isDir };
  },
});
</script>

<style scoped>
.task-bar-item {
  letter-spacing: -0.1px;

  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 2px solid #69b0e9;
  height: 30px;
  display: flex;
  align-items: baseline;
  padding: 0px 10px;
}

.task-bar-item:hover,
.task-bar-item-focused {
  background-color: rgba(128, 128, 128, 0.393);
}

.text {
  margin-top: 7px;
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--small-font-size);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.task-bar-icon {
  font-size: 16px;
  margin-right: 5px;
}
</style>
