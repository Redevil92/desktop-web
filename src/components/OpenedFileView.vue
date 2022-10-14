<template>
  <MoveAndResizeArea :itemDialog="itemDialog">
    <template #header>
      <div :class="{ 'not-focused-dialog': !itemDialog.isFocused }" class="flex header" ref="headerRef">
        <div v-if="itemDialog.icon">
          <img height="17" class="file-icon" :src="require('/src/assets/fileIcons/' + itemDialog.icon)" alt="" />
        </div>

        <div v-else class="mdi mdi-folder-open folder-icon"></div>

        <div class="directory-name">{{ itemDialog.name }}</div>
        <DialogControls :itemDialog="itemDialog" />
      </div>
    </template>
    <template #default>
      <div :class="{ 'not-focused-dialog': !itemDialog.isFocused }">
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

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { computed, defineAsyncComponent, defineComponent, PropType, ref } from "vue";

import LoadingComponent from "@/components/shared/LoadingComponent.vue";
import ErrorComponent from "@/components/shared/ErrorComponent.vue";
import MoveAndResizeArea from "@/components/openedItemDialog/MoveAndResizeArea.vue";

import DialogControls from "@/components/openedItemDialog/DialogControls.vue";

export default defineComponent({
  props: {
    itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  },

  components: {
    DialogControls,
    MoveAndResizeArea,
  },
  emits: [],
  setup(props, _) {
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
      return props.itemDialog.dimension.height - headerRef.value.clientHeight;
    });

    return {
      draggableElement,
      headerRef,
      contentHeight,
      applicationComponent,
    };
  },
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

.footer {
  position: absolute;
  height: 20px;
  width: 20px;
  background-color: rgb(25, 25, 25);
  bottom: 0px;
  width: inherit;
  text-align: start;
}

.footer-text {
  color: white;
  font-size: var(--small-font-size);
  text-align: start;
  margin-left: 5px;
}

.file-icon {
  margin-left: 10px;
  margin-top: 3px;
}

.not-focused-dialog {
  opacity: 0.4;
}
</style>
