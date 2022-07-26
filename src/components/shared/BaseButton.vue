<template>
  <button class="base-button" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  components: {},
  emits: ["click"],
  setup(_, context) {
    const clickHandler = (event: any) => {
      context.emit("click", event);
    };
    return { clickHandler };
  },
});
</script>
<style scoped>
.base-button {
  background-color: var(--primary-color);
  font-size: var(--medium-font-size);
  color: white;
  padding: 7px 12px;
  outline: none;
  border: none;
  border-radius: 10px;
}

.base-button:hover {
  background-color: var(--primary-color_darker);
}
</style>
