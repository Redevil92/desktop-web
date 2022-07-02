<template>
  <div class="home" ref="desktopRef">
    <actions-dialog-box
      v-if="desktopRef"
      @onAddNewFolder="createNewDirectory"
      path="desktop"
      :contextRef="desktopRef"
    ></actions-dialog-box>

    <DesktopWorkSpace @onFileItemPositionChange="changeItemPositionHandler" />

    <div v-for="(item, index) in itemsDialog" :key="`folder-opened-${index}`">
      <OpenedItemView v-if="!item.isCollapsed" :itemDialog="item" />
    </div>

    <TaskBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
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

    return {
      changeItemPositionHandler,
      itemsDialog,
      desktopRef,
      createNewDirectory,
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
