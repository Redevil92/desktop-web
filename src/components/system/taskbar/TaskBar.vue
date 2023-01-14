<template>
  <div class="task-bar" ref="itemsContainerRef">
    <div class="flex-center">
      <img
        @click="setStartMenuOpened"
        height="37"
        :src="require('/src/assets/icons/start-menu.svg')"
        ref="windowIconRef"
        alt="Start menu icon, open menu panel"
        class="window-icon"
      />
      <!-- <span @click="setStartMenuOpened" class="mdi mdi-microsoft-windows window-icon" ref="windowIconRef"></span> -->
      <StartMenu v-if="isStartMenuOpened" :openStartMenuButtonRef="windowIconRef || undefined" />
      <div class="flex">
        <div
          v-for="(taskBarItem, index) in taskBarItemByApplication"
          :key="`task-bar-item-${index}`"
          :style="`margin-left: ${itemMargin}px`"
        >
          <TaskBarItem
            :items="taskBarItem"
            @onPreviewOpenedChanged="previewOpened = $event"
            :previewOpened="previewOpened"
          ></TaskBarItem>
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

import { useSettingsStore } from "@/stores/settingsStore";
import { useLayoutStore } from "@/stores/layoutStore";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { formatDate, formatTimeFromDate } from "@/utils/dateAndTimeConversionUtils";

export default defineComponent({
  props: {},
  components: { TaskBarItem, StartMenu },
  setup() {
    const layoutStore = useLayoutStore();
    const fileSystemStore = useFileSystemStore();
    const settingsStore = useSettingsStore();

    const previewOpened = ref("");

    const isStartMenuOpened = computed(() => {
      return layoutStore.startMenuOpened;
    });

    const itemsContainerRef = ref(null);
    const currentDateRef = ref(null);
    const windowIconRef = ref(null);

    const itemMargin = 4;

    const currentDate = ref("");
    const currentTime = ref("");

    const dateFormat = computed(() => {
      return settingsStore.dateFormat;
    });

    const timeFormat = computed(() => {
      return settingsStore.timeFormat;
    });

    const taskBarItems = computed(function () {
      return fileSystemStore.itemsDialog as ItemDialog[];
    });

    const taskBarItemByApplication = computed(function () {
      const itemByApp: { [key: string]: ItemDialog[] } = {};

      taskBarItems.value.forEach((itemDialog) => {
        if (itemByApp[itemDialog.applicationToOpen || ""]) {
          itemByApp[itemDialog.applicationToOpen || ""].push(itemDialog);
        } else {
          itemByApp[itemDialog.applicationToOpen || ""] = [itemDialog];
        }
      });
      return itemByApp;
    });

    const setStartMenuOpened = () => {
      console.log(!isStartMenuOpened.value);
      layoutStore.setStartMenuOpened(!isStartMenuOpened.value);
    };

    const updateDate = () => {
      const newDate = new Date(Date.now());
      currentDate.value = formatDate(newDate, dateFormat.value);
      currentTime.value = formatTimeFromDate(newDate, timeFormat.value);
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
      taskBarItemByApplication,
      previewOpened,
      setStartMenuOpened,
    };
  },
});
</script>

<style scoped>
.window-icon {
  color: white;
  padding: 5px;
  margin: 2px;
  margin-top: 1px;
  border-radius: var(--border-radius);
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
