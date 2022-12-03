<template>
  <div :style="`height: ${height}px; width: 100%; `" class="detect-click-div"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    height: Number,
  },
});
</script>
<style scoped>
.detect-click-div {
  position: absolute;
  z-index: 1;
}
</style>
