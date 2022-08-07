<template>
  <div class="home" ref="desktopRef">
    <ActionMenu />

    <div @click.right="rightClickHandler">
      <DesktopWorkSpace @onFileItemPositionChange="changeItemPositionHandler" />
    </div>

    <div v-for="(item, index) in itemsDialog" :key="`folder-opened-${index}`">
      <OpenedFileView v-if="!item.isCollapsed" :itemDialog="item" />
    </div>

    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";

import DesktopWorkSpace from "@/components/DesktopWorkSpace.vue";
import OpenedFileView from "@/components/OpenedFileView.vue";
import TaskBar from "@/components/TaskBar.vue";
import ActionMenu from "@/components/ActionMenu.vue";

import Coordinates from "@/models/Coordinates";
import ActionMenuModel from "@/models/ActionMenu";
import ItemDialog from "@/models/ItemDialog";
import { DESKTOP_PATH } from "@/context/fileSystemController";

export default defineComponent({
  props: {},
  components: { DesktopWorkSpace, TaskBar, OpenedFileView, ActionMenu },
  setup() {
    const store = useStore();

    const rightClickHandler = (event: any) => {
      event.preventDefault();

      const pointerEvent = event as PointerEvent;

      store.dispatch("fileSystem/SET_ACTION_MENU", {
        show: true,
        path: DESKTOP_PATH,
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        isOpenedFolder: false,
      } as ActionMenuModel);
    };

    const itemsDialog = computed(function () {
      return store.getters["fileSystem/GET_ITEMS_DIALOG"] as ItemDialog[];
    });

    const changeItemPositionHandler = (fileItemToUpdate: any, newCoordinates: Coordinates) => {
      // TODO change item position in the store
    };

    return {
      changeItemPositionHandler,
      itemsDialog,

      rightClickHandler,
    };
  },
});
</script>
<style scoped>
.folder-object {
  cursor: pointer;
}

.directory-object {
  cursor: pointer;
}

.home {
  overflow: hidden;
}
</style>
