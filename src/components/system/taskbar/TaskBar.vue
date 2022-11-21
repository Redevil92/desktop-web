<template>
  <div class="task-bar" ref="itemsContainerRef">
    <div class="flex-center">
      <span @click="setStartMenuOpened" class="mdi mdi-microsoft-windows window-icon" ref="windowIconRef"></span>
      <StartMenu v-if="isStartMenuOpened" :openStartMenuButtonRef="windowIconRef" />
      <div class="flex">
        <div
          v-for="(taskBarItem, index) in taskBarItems"
          :key="`task-bar-item-${index}`"
          :style="`margin-left: ${itemMargin}px`"
        >
          <TaskBarItem :item="taskBarItem"></TaskBarItem>
        </div>
      </div>
    </div>

    <div class="task-bar-date" ref="currentDateRef">
      <div class="current-date">{{ currentTime }}</div>
      <div class="current-date">{{ currentDate }}</div>
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

    const itemMargin = 4;

    const currentDate = ref("");
    const currentTime = ref("");

    const taskBarItems = computed(function () {
      return fileSystemStore.itemsDialog as ItemDialog[];
    });

    // const itemWidth = computed(function () {
    //   const itemContainerWidth =
    //     (itemsContainerRef.value as unknown as HTMLElement).clientWidth -
    //     (windowIconRef.value as unknown as HTMLElement).clientWidth -
    //     (currentDateRef.value as unknown as HTMLElement).clientWidth;

    //   const calculatedItemWidth =
    //     (itemContainerWidth - (taskBarItems.value.length + 1) * itemMargin) / taskBarItems.value.length;

    //   return calculatedItemWidth > maxItemWidth ? maxItemWidth : calculatedItemWidth;
    // });

    const setStartMenuOpened = () => {
      layoutStore.setStartMenuOpened(!isStartMenuOpened.value);
    };

    const updateDate = () => {
      const newDate = new Date();
      currentDate.value = `${newDate.getDay()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
      currentTime.value = `${newDate.getHours()}:${
        (newDate.getMinutes() < 10 ? "0" : "") + newDate.getMinutes()
      }:${newDate.getSeconds()}`;
    };

    onMounted(function () {
      updateDate();
      setInterval(updateDate, 1000);
    });

    return {
      taskBarItems,
      itemsContainerRef,
      currentDateRef,
      windowIconRef,
      itemMargin,
      currentDate,
      currentTime,
      isStartMenuOpened,
      setStartMenuOpened,
    };
  },
});
</script>

<style scoped>
.window-icon {
  font-size: 32px;
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
.flex-center {
  display: flex;
  justify-content: center;
}

.flex-grow {
  display: flex;
  flex-grow: 1;
}

.position-relative {
  position: relative;
}

.task-bar-date {
  position: absolute;
  top: 4px;
  right: 0px;
}
</style>
