<template>
  <div class="home" ref="desktopRef">
    <SnackBar></SnackBar>
    <actions-dialog-box :path="DESKTOP_PATH" :position="actionDialogPos" :show="showActionsDialog"></actions-dialog-box>

    <DesktopWorkSpace @onFileItemPositionChange="changeItemPositionHandler" />

    <div v-for="(item, index) in itemsDialog" :key="`folder-opened-${index}`">
      <OpenedItemView v-if="!item.isCollapsed" :itemDialog="item" />
    </div>

    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";

import DesktopWorkSpace from "@/components/DesktopWorkSpace.vue";
import OpenedItemView from "@/components/OpenedItemView.vue";
import TaskBar from "@/components/TaskBar.vue";
import ActionsDialogBox from "@/components/ActionsDialogBox.vue";
import SnackBar from "@/components/shared/SnackBar.vue";

import Coordinates from "@/models/Coordinates";
import ItemDialog from "@/models/ItemDialog";
import { DESKTOP_PATH } from "@/context/fileSystemController";

export default defineComponent({
  props: {},
  components: { DesktopWorkSpace, TaskBar, OpenedItemView, ActionsDialogBox, SnackBar },
  setup() {
    const store = useStore();

    const desktopRef = ref(null);
    const actionDialogPos = ref({ x: 0, y: 0 } as Coordinates);
    const showActionsDialog = ref(false);

    //openedFolders.push(desktopFs);

    const createNewDirectory = () => {
      console.log("should create a new directory");
    };

    const itemsDialog = computed(function () {
      return store.getters["fileSystem/GET_ITEMS_DIALOG"] as ItemDialog[];
    });

    const changeItemPositionHandler = (fileItemToUpdate: any, newCoordinates: Coordinates) => {
      // TODO change item position in the store
    };

    const openActionsDialog = (event: Event) => {
      const pointerEvent = event as PointerEvent;

      event.preventDefault();

      actionDialogPos.value = { x: pointerEvent.clientX, y: pointerEvent.clientY };
      showActionsDialog.value = true;
    };

    const closeActionDialog = () => {
      showActionsDialog.value = false;
    };

    onMounted(() => {
      window.addEventListener("contextmenu", openActionsDialog);
      window.addEventListener("click", closeActionDialog);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", openActionsDialog);
      window.removeEventListener("click", closeActionDialog);
    });

    return {
      changeItemPositionHandler,
      itemsDialog,
      desktopRef,
      createNewDirectory,
      showActionsDialog,
      actionDialogPos,
      DESKTOP_PATH,
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
  position: relative;
}
</style>
