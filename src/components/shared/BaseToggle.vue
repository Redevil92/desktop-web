<template>
  <div v-if="label" class="label">{{ label }}</div>
  <div class="toggle-container" @click="toggle" :style="`background-color: ${backgroundColor};`">
    <div class="circle" v-if="selected === firstOption"></div>
    <div class="toggle-text">
      {{ selected }}
    </div>
    <div class="circle" v-if="selected === secondOption"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  firstOption: { type: String, default: "ON" },
  secondOption: { type: String, default: "OFF" },
  selected: { type: String, default: "ON" },
  label: { type: String, default: "" },
});

const emit = defineEmits(["onToggle"]);

const backgroundColor = computed(() => {
  return props.selected === props.firstOption ? "var(--selected-color_light)" : "var(--neutral-color_light)";
});

const toggle = () => {
  emit("onToggle");
};
</script>
<style scoped>
.label {
  text-align: left;
  font-size: var(--small-font-size);
  letter-spacing: 1px;
  font-weight: 600;
  color: var(--font-color);
  margin-bottom: 5px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  margin: 0 2px;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 2px;
  border-radius: 30px;
  color: var(--font-color);
  font-size: var(--medium-font-size);
  user-select: none;
  width: 100%;
}

.toggle-text {
  padding: 0 5px;
}
</style>
