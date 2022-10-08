<template>
  <div class="start-menu-container"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    msg: String,
  },
  components: {},
  setup() {
    return {};
  },
});
</script>

<style scoped>
.start-menu-container {
  height: 300px;
  width: 200px;
  background-color: red;
  position: absolute;
  bottom: var(--task-bar-height);
}
</style>
