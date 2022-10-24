<template>
  <label class="label" v-if="label">{{ label }}</label>
  <input
    :readonly="disabled"
    :class="{ 'rounded-input': rounded }"
    @change="change"
    @keydown="onKeyDown"
    :placeholder="placeholder"
    :type="type"
    :value="modelValue"
    @blur="onBlur"
  />
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
</style>
