<template>
  <div class="start-menu-container">
    <BaseSearchBar />

    <!-- SEARCH BAR -->
    <!-- PINNED APPLICATION -->
    <!-- RECCOMANDED APPLICATION -->
    <!-- YOUR CUSTOMIZATION / POWER OFF -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseInput from "@/components/shared/BaseSearchBar.vue";

export default defineComponent({
  props: {
    msg: String,
  },
  components: { BaseInput },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.start-menu-container {
  height: 600px;
  width: 500px;
  background-color: red;
  position: absolute;
  left: var(--margin);
  bottom: calc(var(--task-bar-height) + var(--margin));
  border-radius: var(--border-radius);
  background-color: var(--background-color);
}
</style>
