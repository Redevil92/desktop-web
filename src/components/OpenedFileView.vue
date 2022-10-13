<template>
  <MoveAndResizeArea :itemDialog="itemDialog">
    <template #header>
      <div :class="{ 'not-focused-dialog': !itemDialog.isFocused }" class="flex folder-header" ref="dialogHeader">
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
import { computed, defineAsyncComponent, defineComponent, PropType, ref, shallowRef } from "vue";

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
    const comp = shallowRef();

    const applicationComponent = defineAsyncComponent({
      // the loader function
      loader: () => import(`@/components/apps/${props.itemDialog.applicationToOpen}.vue`),

      // A component to use while the async component is loading
      loadingComponent: LoadingComponent,
      // Delay before showing the loading component. Default: 200ms.
      delay: 200,

      // A component to use if the load fails
      errorComponent: ErrorComponent,
      timeout: 3000,
    });

    const dialogHeader = ref({} as HTMLElement);
    const draggableElement = ref({} as HTMLElement);

    const contentHeight = computed(function () {
      return props.itemDialog.dimension.height - dialogHeader.value.clientHeight;
    });

    return {
      draggableElement,
      dialogHeader,
      contentHeight,
      applicationComponent,
    };
  },
});
</script>

<style scoped>
.folder-dialog {
  position: absolute;
  top: 50px;
  left: 200px;
  border: 2px solid var(--dialog-border-color_dark);
  border-radius: 10px;
  background-color: var(--dialog-background-color_dark);
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
  -webkit-box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
}

.flex {
  display: flex;
  align-items: center;
}

.folder-icon {
  color: #f6d573;
  font-size: 18px;
  margin-left: 5px;
}

.folder-header {
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
