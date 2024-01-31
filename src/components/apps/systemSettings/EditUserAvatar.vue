<template>
  <div :style="`height: ${height}px`">
    <ErrorComponent></ErrorComponent>
  </div>
</template>

<script lang="ts" setup>
import ErrorComponent from "@/components/shared/ErrorComponent.vue";

const props = defineProps({
  height: Number,
});
</script>

<style scoped></style>
