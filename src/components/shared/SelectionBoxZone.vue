<template>
  <div>
    <!-- share state with the scoped slot -->
    <slot :dropZoneActive="active"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    dropPath: String,
  },
  components: {},

  setup(props, context) {
    return {};
  },
});
</script>

<style scoped></style>
