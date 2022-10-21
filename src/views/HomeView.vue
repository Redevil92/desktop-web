<template>
  <div class="home" ref="desktopRef">
    <ActionMenu />

    <div @click.right="rightClickHandler">
      <DesktopWorkSpace />
    </div>

    <div v-for="(item, index) in itemsDialog" :key="`folder-opened-${index}`">
      <OpenedFileView v-if="!item.isCollapsed" :itemDialog="item" />
    </div>
    <SnackBar></SnackBar>
    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import DesktopWorkSpace from "@/components/desktop/DesktopWorkSpace.vue";
import OpenedFileView from "@/components/OpenedFileView.vue";
import TaskBar from "@/components/TaskBar.vue";
import ActionMenu from "@/components/ActionMenu.vue";
import SnackBar from "@/components/shared/SnackBar.vue";

import ActionMenuModel from "@/models/ActionMenu";
import ItemDialog from "@/models/ItemDialog";
import { DESKTOP_PATH } from "@/constants";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {},
  components: { DesktopWorkSpace, TaskBar, OpenedFileView, ActionMenu, SnackBar },
  setup() {
    const fileSystemStore = useFileSystemStore();

    const rightClickHandler = (event: Event) => {
      event.preventDefault();

      const pointerEvent = event as PointerEvent;

      fileSystemStore.setActionMenu({
        show: true,
        paths: [DESKTOP_PATH],
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        isOpenedFolder: false,
      } as ActionMenuModel);
    };

    const itemsDialog = computed(function () {
      return fileSystemStore.itemsDialog as ItemDialog[];
    });

    return {
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
