<template>
  <MoveAndResizeArea :itemDialog="itemDialog">
    <template #header>
      <div :class="{ 'not-focused-dialog': !itemDialog.isFocused }" class="flex header" ref="headerRef">
        <div v-if="itemDialog.icon">
          <img height="17" class="file-icon" :src="require('/src/assets/fileIcons/' + itemDialog.icon)" alt="" />
        </div>

        <div v-else class="mdi mdi-folder-open folder-icon"></div>

        <div class="directory-name">{{ itemDialog.name }}</div>
        <DialogControls
          :itemDialog="itemDialog"
          @close="closeDialog"
          @minimize="minimizeDialog"
          @expand="setFullScreen"
        />
      </div>
    </template>
    <template #default>
      <div
        :class="{ 'not-focused-dialog': !itemDialog.isFocused }"
        class="dialog-content"
        :id="itemDialog.guid"
        ref="itemContentRef"
      >
        <!-- TODO: we should not pass height to the component , we should set the height direclty to the component
            maybe we should just pass the file in the correct format to the content and have apps components that
            just display the content -->
        <component
          v-if="applicationComponent"
          :is="applicationComponent"
          :height="contentHeight"
          :itemDialog="itemDialog"
        ></component>
      </div>
    </template>
  </MoveAndResizeArea>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";

import LoadingComponent from "@/components/shared/LoadingComponent.vue";
import ErrorComponent from "@/components/shared/ErrorComponent.vue";
import MoveAndResizeArea from "@/components/system/openedItemDialog/MoveAndResizeArea.vue";
import DialogControls from "@/components/system/openedItemDialog/DialogControls.vue";

import { useFileSystemStore } from "@/stores/fileSystemStore";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
});

const fileSystemStore = useFileSystemStore();

const itemContentRef = ref<HTMLElement | undefined>();

const closeDialog = () => {
  fileSystemStore.closeItemDialog(props.itemDialog.guid);
  fileSystemStore.findAndSetNewFocusedItemDialog();
};

const minimizeDialog = () => {
  fileSystemStore.minimizeItemDialog(props.itemDialog.guid);
  fileSystemStore.findAndSetNewFocusedItemDialog();
};

const setFullScreen = (isFullscreen: boolean) => {
  fileSystemStore.setItemDialogFullScreen({ itemGuid: props.itemDialog.guid, isFullscreen });
};

const applicationComponent = defineAsyncComponent({
  loader: () => import(`@/components/apps/${props.itemDialog.applicationToOpen}.vue`),
  loadingComponent: LoadingComponent,
  delay: 200,
  errorComponent: ErrorComponent,
  timeout: 3000,
});

const headerRef = ref({} as HTMLElement);
const draggableElement = ref({} as HTMLElement);

const contentHeight = computed(function () {
  if (props.itemDialog.isFullscreen) {
    const style = getComputedStyle(document.body);
    const taskBarHeight = Number(style.getPropertyValue("--task-bar-height").trim().replace("px", ""));
    return window.innerHeight - taskBarHeight - headerRef.value.clientHeight - 4;
  }
  return props.itemDialog.dimension.height - headerRef.value.clientHeight;
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.folder-icon {
  color: #f6d573;
  font-size: 18px;
  margin-left: 5px;
}

.header {
  background-color: var(--dialog-header-color_dark);
  height: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.directory-name {
  margin-left: 5px;
  color: white;
  font-size: var(--medium-font-size);
  flex-grow: 1;
  text-align: start;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.file-icon {
  margin-left: 10px;
  margin-top: 3px;
}

.dialog-content {
  background-color: var(--background-color);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.not-focused-dialog {
  opacity: 0.4;
}
</style>
