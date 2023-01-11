<template>
  <div :class="{ 'search-bar-container': searchBar }">
    <label class="label" v-if="label">{{ label }}</label>
    <span v-if="searchBar" class="mdi mdi-magnify mdi-28 search-icon"></span>
    <input
      :readonly="disabled"
      :class="{ 'rounded-input': rounded, 'search-input': searchBar }"
      @change="change"
      @keydown="onKeyDown"
      :placeholder="placeholder"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :type="type"
      :value="modelValue"
      @blur="onBlur"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    rounded: Boolean,
    placeholder: String,
    modelValue: String, // previously was `value: String`
    type: { type: String, default: "text" }, // previously was `value: String`
    disabled: { type: Boolean, default: false }, // previously was `value: String`
    autocomplete: { type: Boolean, default: true },
    searchBar: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "onKeyDown", "onBlur"],
  methods: {
    change(event) {
      this.$emit("update:modelValue", event.target.value); // previously was `this.$emit('input', title)`
    },
    onKeyDown(event) {
      this.$emit("onKeyDown", event);
    },
    onBlur(event) {
      this.$emit("onBlur", event);
    },
  },
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
  padding-top: 12px;
  border: none;
  padding: 10px;
  padding-left: 35px;
  border-bottom: 2px solid rgba(255, 255, 255, 0);
  /* border-bottom: 1px solid white; */
  background-color: rgba(255, 255, 255, 0.21);
  color: white;
  width: 100%;
}

.search-input::placeholder {
  color: white;
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
  border-bottom: 2px solid var(--primary-color);
  outline: none;
  background-color: rgba(255, 255, 255, 0.21);
}

.search-icon {
  color: white;
  position: absolute;
  font-size: var(--small-icon-size);
  left: 7px;
  top: 4px;
}
</style>
