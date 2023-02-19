<template>
  <div class="home" ref="desktopRef">
    <ActionMenu />

    <div @click.right="rightClickHandler">
      <DesktopWorkSpace />
    </div>
    <DynamicIsland />
    <div v-for="item in itemsDialog" :key="`folder-opened-${item.guid}`">
      <OpenedFileView v-show="!item.isCollapsed" :itemDialog="item" />
    </div>
    <SnackBar></SnackBar>
    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import DesktopWorkSpace from "@/components/system/desktop/DesktopWorkSpace.vue";
import OpenedFileView from "@/components/system/openedItemDialog/OpenedFileView.vue";
import TaskBar from "@/components/system/taskbar/TaskBar.vue";
import ActionMenu from "@/components/system/actionMenu/ActionMenu.vue";
import SnackBar from "@/components/shared/SnackBar.vue";
import DynamicIsland from "@/components/system/dynamicIsland/DynamicIsland.vue";

import ActionMenuModel from "@/models/ActionMenu";
import ItemDialog from "@/models/ItemDialog";
import { DESKTOP_PATH } from "@/constants";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import {
  createNewFile,
  createNewFolder,
  openDesktopSettingPage,
  pasteAction,
} from "@/components/system/actionMenu/ActionsList";

export default defineComponent({
  props: {},
  components: { DesktopWorkSpace, TaskBar, OpenedFileView, ActionMenu, SnackBar, DynamicIsland },
  setup() {
    const fileSystemStore = useFileSystemStore();

    const rightClickHandler = async (event: Event) => {
      event.preventDefault();

      const pointerEvent = event as PointerEvent;

      fileSystemStore.setActionMenu({
        show: true,
        paths: [DESKTOP_PATH],
        position: { x: pointerEvent.clientX, y: pointerEvent.clientY },
        customLayout: [
          await pasteAction(DESKTOP_PATH, true, false),
          createNewFile(pointerEvent, DESKTOP_PATH, false, false),
          createNewFolder(pointerEvent, DESKTOP_PATH, false, false),
          openDesktopSettingPage(false, false),
        ],
      } as ActionMenuModel);
    };

    const itemsDialog = computed(function () {
      console.log(fileSystemStore.itemsDialog);
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
