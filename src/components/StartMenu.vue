<template>
  <div class="start-menu-container">
    <BaseSearchBar v-model="search" class="search-bar" />

    <div class="start-menu-content">
      <!-- PINNED APPLICATION -->
      <div class="pinned-application">
        <div class="flex">
          <div class="pinned-text">Pinned</div>
          <div class="all-apps-button">All apps</div>
        </div>
      </div>
      <!-- RECCOMANDED APPLICATION -->
      <!-- YOUR CUSTOMIZATION / POWER OFF -->
    </div>
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

.pinned-text {
  color: var(--font-color);
  font-size: var(--medium-font-size);
  font-weight: 600;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.start-menu-content {
  padding: 10px 30px;
}

.all-apps-button {
  color: var(--font-color);
  font-size: var(--small-font-size);
  background-color: var(--background-color_light);
  padding: 5px;
}
</style>
