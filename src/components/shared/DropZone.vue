<template>
  <div
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <!-- share state with the scoped slot -->
    <slot :dropZoneActive="active"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {},
  components: {},
  emits: ["onFilesDropped"],
  setup(props, context) {
    let active = ref(false);

    function setActive() {
      active.value = true;
    }
    function setInactive() {
      active.value = false;
    }

    function onDrop(event: any) {
      setInactive();
      context.emit("onFilesDropped", [...event.dataTransfer.files]);
    }

    return { onDrop, active };
  },
});
</script>

<style scoped></style>
