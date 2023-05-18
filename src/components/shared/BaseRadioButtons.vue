<template>
  <div v-for="selection in selectionList" :key="`radio-button-${selection}`" class="radio-button-container">
    <div @click="selectHandler(selection)">
      <div v-if="selection === selected" class="radio-button-selected">
        <div></div>
      </div>
      <div class="radio-button" v-else></div>
    </div>
    <div class="radio-button-label">{{ selection }}</div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

const props = defineProps({
  selectionList: { type: Array as PropType<string[]>, required: true },
  selected: { type: String, required: true },
});

const emit = defineEmits(["onSelect"]);

const selectHandler = (selection: string) => {
  emit("onSelect", selection);
};
</script>
<style scoped>
.radio-button {
  background-color: var(--neutral-color);
  height: 16px;
  width: 16px;
  border-radius: 20px;
}

.radio-button-selected {
  background-color: var(--selected-color);
  height: 16px;
  width: 16px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.radio-button-selected > div {
  background-color: white;
  height: 8px;
  width: 8px;
  border-radius: 20px;
  margin-left: 1px;
}

.radio-button-label {
  color: white;
  font-size: var(--medium-font-size);
  margin-left: 10px;
}

.radio-button-container {
  display: flex;
  margin-bottom: 10px;
}
</style>
