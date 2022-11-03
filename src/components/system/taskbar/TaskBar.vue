<template>
  <div class="task-bar" ref="itemsContainerRef">
    <div class="flex position-relative">
      <span @click="setStartMenuOpened" class="mdi mdi-microsoft-windows window-icon" ref="windowIconRef"></span>
      <StartMenu v-if="isStartMenuOpened" :openStartMenuButtonRef="windowIconRef" />
      <div class="flex">
        <div
          v-for="(taskBarItem, index) in taskBarItems"
          :key="`task-bar-item-${index}`"
          class="task-bar-item"
          :style="`margin-left: ${itemMargin}px`"
        >
          <TaskBarItem :style="`width: ${itemWidth}px`" :item="taskBarItem"></TaskBarItem>
        </div>
      </div>
    </div>

    <div ref="currentDateRef">
      <span class="current-date">{{ currentDate }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import ItemDialog from "@/models/ItemDialog";
import TaskBarItem from "@/components/system/taskbar/TaskBarItem.vue";
import StartMenu from "@/components/system/startMenu/StartMenu.vue";

import { useLayoutStore } from "@/stores/layoutStore";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {},
  components: { TaskBarItem, StartMenu },
  setup() {
    const layoutStore = useLayoutStore();
    const fileSystemStore = useFileSystemStore();

    const isStartMenuOpened = computed(() => {
      return layoutStore.startMenuOpened;
    });

    const itemsContainerRef = ref(null);
    const currentDateRef = ref(null);
    const windowIconRef = ref(null);

    const maxItemWidth = 160;
    const itemMargin = 4;

    const currentDate = ref(new Date().toLocaleString().replace(",", " "));

    const taskBarItems = computed(function () {
      return fileSystemStore.itemsDialog as ItemDialog[];
    });

    const itemWidth = computed(function () {
      const itemContainerWidth =
        (itemsContainerRef.value as unknown as HTMLElement).clientWidth -
        (windowIconRef.value as unknown as HTMLElement).clientWidth -
        (currentDateRef.value as unknown as HTMLElement).clientWidth;

      const calculatedItemWidth =
        (itemContainerWidth - (taskBarItems.value.length + 1) * itemMargin) / taskBarItems.value.length;

      return calculatedItemWidth > maxItemWidth ? maxItemWidth : calculatedItemWidth;
    });

    const setStartMenuOpened = () => {
      console.log("OH BOY", layoutStore);
      layoutStore.setStartMenuOpened(!isStartMenuOpened.value);
    };

    const updateDate = () => {
      currentDate.value = new Date().toLocaleString().replace(",", " ");
    };

    onMounted(function () {
      setInterval(updateDate, 1000);
    });

    return {
      taskBarItems,
      itemsContainerRef,
      itemWidth,
      currentDateRef,
      windowIconRef,
      itemMargin,
      currentDate,
      isStartMenuOpened,
      setStartMenuOpened,
    };
  },
});
</script>

<style scoped>
.window-icon {
  font-size: 22px;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
}

.window-icon:hover {
  color: #23a8f2;
  background-color: rgba(134, 134, 134, 0.7);
}

.task-bar {
  backdrop-filter: blur(5px);
  background-color: var(--background-color);
  bottom: 0px;
  contain: size layout;
  height: var(--task-bar-height);
  left: 0px;
  position: absolute;
  right: 0px;
  width: 100vw;
  display: flex;
  z-index: 1000;
  align-items: center;
  justify-content: space-between;
}

.current-date {
  font-size: var(--small-font-size);
  color: white;
  padding: 0px 10px;
}

.flex {
  display: flex;
}

.flex-grow {
  display: flex;
  flex-grow: 1;
}

.position-relative {
  position: relative;
}
</style>