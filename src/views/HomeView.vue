<template>
  <div class="home" ref="desktopRef">
    <actions-dialog-box path="desktop" :position="actionDialogPos" :show="showActionsDialog"></actions-dialog-box>

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

import Coordinates from "@/models/Coordinates";
import ItemDialog from "@/models/ItemDialog";

export default defineComponent({
  props: {
    msg: String,
  },
  components: { DesktopWorkSpace, TaskBar, OpenedItemView, ActionsDialogBox },
  setup() {
    const store = useStore();

    const desktopRef = ref(null);
    const actionDialogPos = ref({ x: 0, y: 0 } as Coordinates);
    const showActionsDialog = ref(false);

    //openedFolders.push(desktopFs);

    const generateUniqueName = (name: string, existingNameMap: Map<string, any>) => {
      let myName = name;
      let currentIndex = 0;
      let isUnique = false;
      while (!isUnique && currentIndex < 100) {
        isUnique = !existingNameMap.get(myName);
        console.log(currentIndex, isUnique);
        if (!isUnique) {
          currentIndex++;
          myName = `${name} (${currentIndex})`;
        }
      }
      return myName;
    };

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
      console.log("Showing");

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
