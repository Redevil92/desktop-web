<template>
  <div :style="`height: ${height}px; width: 100%; `" class="detect-click-div"></div>
</template>

<script lang="ts" setup>
const props = defineProps({
  height: { type: Number },
});
</script>
<style scoped>
.detect-click-div {
  position: absolute;
  z-index: 1;
}
</style>
