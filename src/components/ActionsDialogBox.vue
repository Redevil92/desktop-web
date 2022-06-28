<template>
  <!-- THIS COMPONENT SHOULD BE A SINGLETON, WE SHOULD IMPLEMENT A STORE FOR DISPLAYING IT AND 
TO DECIDE WHAT ACTIONS TO DISPLAY -->

  <div v-show="showActionsDialog" ref="actionsDialogRef" class="actions-dialog">
    <div class="action-button" @click="addNewFile">New file</div>
    <hr />
    <div class="action-button" @click="addNewFolder">New folder</div>
  </div>
</template>

<script lang="ts">
import Coordinates from "@/models/Coordinates";
import { defineComponent, ref, reactive, computed, watch, PropType, onMounted, onUnmounted } from "vue";

export default defineComponent({
  props: {
    path: String,
    contextName: String,
    actions: Array as PropType<string[]>,
  },
  components: {},
  emits: ["onAddNewFile", "onAddNewFolder"],
  setup(props, context) {
    // props -> path

    // new -> folder/ file
    // change desktop
    // add files

    // **** FILE ONLY
    // Open (detect file type to open the item with the right ...)
    // Open with
    // Cut
    // Copy
    // Create shortcut
    // Delete
    // Rename

    const showActionsDialog = ref(false);
    const actionsDialogRef = ref(null);

    const addNewFile = (event: PointerEvent) => {
      const coordinates = { x: event.x, y: event.y } as Coordinates;
      context.emit("onAddNewFile", coordinates);
    };

    const addNewFolder = (event: PointerEvent) => {
      const coordinates = { x: event.x, y: event.y } as Coordinates;
      context.emit("onAddNewFolder", coordinates);
    };

    const closeActionDialog = () => {
      showActionsDialog.value = false;
    };

    const openActionsDialog = (event: Event) => {
      console.log("Opened action dialo", props.path);
      const pointerEvent = event as PointerEvent;

      event.preventDefault();
      showActionsDialog.value = true;
      (actionsDialogRef.value as unknown as HTMLElement).style.top = pointerEvent.clientY + "px";
      (actionsDialogRef.value as unknown as HTMLElement).style.left = pointerEvent.clientX + "px";
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
      addNewFile,
      addNewFolder,
      showActionsDialog,
      actionsDialogRef,
    };
  },
});
</script>

<style scoped>
.actions-dialog {
  border: 1px solid red;
  position: absolute;
  top: 160px;
  left: 600px;
  z-index: 1;
}

.action-button {
  cursor: pointer;
}

.action-button:hover {
  background-color: rgba(128, 128, 128, 0.19);
}
</style>
