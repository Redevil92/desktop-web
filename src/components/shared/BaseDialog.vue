<template>
  <Teleport :to="to ? `#${to}` : 'body'">
    <div class="dialog-container">
      {{ to }}
      <div class="dialog" :class="{ 'darker-dialog': darker, padding: !noPadding }">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: { darker: Boolean, to: String, noPadding: Boolean },
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
  position: absolute;
  display: flex;
  top: 0;
}

.padding {
  padding: 20px;
}

.dialog {
  background-color: var(--dialog-background-color_with_opacity);
  margin: auto;
  margin-top: 130px;
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 /20%);
  -webkit-box-shadow: 2px 3px 10px 0px rgb(0 0 0 / 20%);
  border-radius: 10px;
  border: 1px solid #9f9f9f;
}

.darker-dialog {
  background-color: var(--dialog-background-color_darker);
}
</style>
