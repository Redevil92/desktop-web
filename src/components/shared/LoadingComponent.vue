<template>
  <div :style="`height: ${height}px`" class="loading-spinner-container">
    <!-- ADD TEXT PROPERTY -->
    LOADINGNIN
    <BaseLoadingSpinner></BaseLoadingSpinner>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseLoadingSpinner from "@/components/shared/BaseLoadingSpinner.vue";

export default defineComponent({
  props: {
    height: Number,
  },
  components: { BaseLoadingSpinner },
  emits: [],
});
</script>
<style scoped>
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
