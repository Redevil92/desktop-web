<template>
  <div class="task-bar">
    <span class="mdi mdi-microsoft-windows window-icon"></span>
  </div>
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
.window-icon {
  font-size: 22px;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
}

.window-icon:hover {
  color: #23a8f2;
  background-color: rgba(134, 134, 134, 0.7);
}

.task-bar {
  backdrop-filter: blur(5px);
  background-color: rgba(26, 26, 26, 0.7);
  bottom: 0px;
  contain: size layout;
  height: 30px;
  left: 0px;
  position: absolute;
  right: 0px;
  width: 100vw;
  display: flex;
  z-index: 1000;
  align-items: center;
}
</style>
