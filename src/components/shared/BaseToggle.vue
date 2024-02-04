<template>
  <div class="toggle-container" @click="toggle">
    <div class="circle" v-if="selected === firstOption"></div>
    <div class="toggle-text">
      {{ selected }}
    </div>
    <div class="circle" v-if="selected === secondOption"></div>
  </div>
</template>

<script lang="ts" setup>
import { first } from "lodash";

const props = defineProps({
  firstOption: { type: String, default: "ON" },
  secondOption: { type: String, default: "OFF" },
  selected: { type: String, default: "ON" },
});

const emit = defineEmits(["onToggle"]);

const toggle = () => {
  emit("onToggle");
};
</script>
<style scoped>
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
  cursor: pointer;
  padding: 2px;
  border-radius: 30px;
  background-color: var(--primary-color);
  color: var(--font-color);
  font-size: var(--medium-font-size);
  user-select: none;
}

.toggle-text {
  padding: 0 5px;
}
</style>
