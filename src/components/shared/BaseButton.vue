<template>
  <button
    class="base-button"
    :class="{ 'normal-button': !small, 'small-button': small, 'neutral-color': neutralColor }"
    @click="clickHandler"
  >
    <div class="flex-center">
      <span v-if="mdiIcon" :class="`mdi ${mdiIcon}`" style="font-size: 14px; margin-right: 5px"></span>
      <slot></slot>
    </div>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  small: Boolean,
  neutralColor: Boolean,
  mdiIcon: {
    type: String,
    required: false,
  },
});
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
  cursor: pointer;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
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
