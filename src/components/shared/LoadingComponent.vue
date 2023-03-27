<template>
  <div :style="`height: ${height}px`" class="loading-spinner-container">
    <BaseLoadingSpinner></BaseLoadingSpinner>
  </div>
</template>

<script lang="ts" setup>
import BaseLoadingSpinner from "@/components/shared/BaseLoadingSpinner.vue";

const props = defineProps({ height: Number, text: String });
</script>
<style scoped>
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
