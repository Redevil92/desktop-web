<template>
  <Teleport to="body">
    <div class="dialog-container">
      <div class="dialog">
        <slot></slot>
      </div>
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
.dialog-container {
  width: 100%;
  height: 100%;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.04);
  position: fixed;
  display: flex;
  top: 0;
}

.dialog {
  background-color: var(--dialog-background-color_with_opacity);
  margin: auto;
  margin-top: 130px;
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 /20%);
  -webkit-box-shadow: 2px 3px 10px 0px rgb(0 0 0 / 20%);
  border-radius: 10px;
  border: 1px solid #9f9f9f;
  padding: 20px;
}
</style>
