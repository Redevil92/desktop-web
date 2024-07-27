<template>
  <div :class="{ 'search-bar-container': searchBar }">
    <label class="label" v-if="label">{{ label }}</label>
    <span v-if="searchBar" class="mdi mdi-magnify mdi-28 search-icon"></span>
    <input
      :readonly="disabled"
      :class="{ 'rounded-input': rounded, 'search-input': searchBar }"
      @input="change"
      @keydown="onKeyDown"
      :placeholder="placeholder"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :type="type"
      :value="modelValue"
      @blur="onBlur"

    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: String,
  rounded: Boolean,
  placeholder: String,
  modelValue: {type: String || Number}, // previously was `value: String`
  type: { type: String, default: 'text' }, // previously was `value: String`
  disabled: { type: Boolean, default: false }, // previously was `value: String`
  autocomplete: { type: Boolean, default: true },
  searchBar: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'onKeyDown', 'onBlur']);

const change = (event: any) => {
  console.log('changing')
  emit('update:modelValue', event.target.value); // previously was `this.$emit('input', title)`
};

const onKeyDown = (event: any) => {
  emit('onKeyDown', event);
};

const onBlur = (event: any) => {
  emit('onBlur', event);
};
</script>

<style lang="css" scoped>
input {
  border: 1px solid white;
  background-color: var(--dialog-background-color_dark);
  padding: 3px 8px;
  font-size: var(--medium-font-size);
  border-radius: var(--border-radius);
  width: 100%;
  color: white;
}

input:focus {
  outline: 3px solid var(--primary-color);
  border: 1px solid var(--primary-color);
}

.rounded-input {
  border-radius: calc(var(--border-radius) * 2);
}

.label {
  text-align: left;
  font-size: var(--medium-font-size);
  margin-right: 10px;
}

/* SEARCH BAR STYLE */
.search-bar-container {
  position: relative;
}

.search-input {
  font-size: var(--medium-font-size);
  border: none;
  padding-left: 30px;

  background-color: rgba(255, 255, 255, 0.21);
  color: white;
  width: 100%;
  border-radius: calc(var(--border-radius) * 2);
  padding-top: 6px;
  padding-bottom: 6px;
}

.search-input::placeholder {
  color: white;
  font-weight: 500;
}

/* input:focus {
  border-bottom: 2px solid var(--primary-color);
  outline: none;
} */

.search-input:focus,
.search-input:-webkit-autofill,
.search-input:-webkit-autofill:hover,
.search-input:-webkit-autofill:focus {
  border: none;
  /* border-bottom: 2px solid var(--primary-color); */
  outline: 2px solid var(--selected-color);
  background-color: rgba(255, 255, 255, 0.21);
}

.search-icon {
  color: white;
  position: absolute;
  font-size: var(--x-small-icon-size);
  left: 7px;
  top: 3px;
}
</style>
