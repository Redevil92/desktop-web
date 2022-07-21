<template>
  <!-- THIS COMPONENT SHOULD BE A SINGLETON, WE SHOULD IMPLEMENT A STORE FOR DISPLAYING IT AND 
TO DECIDE WHAT ACTIONS TO DISPLAY -->

  <div v-show="showActionsDialog" ref="actionsDialogRef" class="actions-dialog padding">
    <div v-if="path === 'desktop'">
      <div class="action-button" @click="addNewFile">New file</div>
      <div class="action-button" @click="addNewFolder">New folder</div>
      <hr class="" />
      <div class="action-button" @click="addNewFolder">Change desktop image</div>
    </div>
    <div>
      <div class="action-button" @click="addNewFolder">Open</div>
      <div class="action-button" @click="addNewFolder">Open with</div>
      <hr class="" />
      <div class="action-button" @click="addNewFolder">Cut</div>
      <div class="action-button" @click="addNewFolder">Copy</div>
      <div class="action-button" @click="addNewFolder">Delete</div>
      <div class="action-button" @click="addNewFolder">Rename</div>
      <div class="action-button" @click="addNewFolder">Create shortcut</div>
    </div>
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
    const createFile = () => {};

    const createDirectory = () => {};

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
      console.log("Opened action dialo", event);
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
  border: 1px solid #aaaaaab3;
  outline: 1px solid #575757;
  color: white;
  border-radius: 7px;
  position: absolute;
  background-color: #616161d6;
  top: 160px;
  left: 600px;
  z-index: 1;
  text-align: left;
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
  -webkit-box-shadow: 2px 3px 20px 0px rgb(0 0 0 / 80%);
}

.padding {
  padding: 3px 10px;
}

.action-button {
  padding: 0px 7px;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:hover {
  background-color: var(--selected-color);
}

hr {
  margin: 5px 0px;
}
</style>
