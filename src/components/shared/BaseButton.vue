<template>
  <button
    class="base-button"
    :class="{ 'normal-button': !small, 'small-button': small, 'neutral-color': neutralColor }"
    @click="clickHandler"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({ small: Boolean, neutralColor: Boolean });
const emit = defineEmits(["click"]);

const clickHandler = (event: MouseEvent) => {
  emit("click", event);
};
</script>
<style scoped>
.base-button {
  background-color: var(--primary-color);
  font-size: var(--medium-font-size);
  color: white;
  outline: none;
  border: none;
}

.normal-button {
  padding: 7px 12px;
  border-radius: 10px;
}

.small-button {
  padding: 2px 6px;
  border-radius: 5px;
}

.base-button:hover {
  background-color: var(--primary-color_darker);
}

.neutral-color {
  background-color: var(--neutral-color) !important;
}

.neutral-color:hover {
  background-color: var(--neutral-color) !important;
}
</style>
