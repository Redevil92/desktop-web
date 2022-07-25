<template>
  <Teleport to="body">
    <div class="snack-bar-container">
      <div class="snack-bar">This is a test</div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  components: {},
  setup() {
    return {};
  },
});
</script>
<style scoped>
.snack-bar {
  border-radius: 8px;
  background-color: green;
  color: white;
}

.snack-bar-container {
  width: 100%;
  position: absolute;
  bottom: 50px;
  display: flex;
  justify-content: center;
}
</style>
