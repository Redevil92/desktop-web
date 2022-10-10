<template>
  <div class="start-menu-container">
    <BaseSearchBar v-model="search" class="search-bar" />

    <!-- SEARCH BAR -->
    <!-- PINNED APPLICATION -->
    <!-- RECCOMANDED APPLICATION -->
    <!-- YOUR CUSTOMIZATION / POWER OFF -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BaseSearchBar from "@/components/shared/BaseSearchBar.vue";

export default defineComponent({
  props: {
    msg: String,
  },
  components: { BaseSearchBar },
  setup() {
    const search = ref("Type here to search");

    return { search };
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

.search-bar {
  margin: var(--margin);
  width: calc(500px - var(--margin) * 2);
}
</style>
