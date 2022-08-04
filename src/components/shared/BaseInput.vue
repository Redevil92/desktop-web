<template>
  <input @change="change" :type="type" :value="modelValue" />
</template>

<script>
export default {
  props: {
    modelValue: String, // previously was `value: String`
    type: { type: String, default: "text" }, // previously was `value: String`
  },
  emits: ["update:modelValue"],
  methods: {
    change(event) {
      console.log(event.target.value);
      this.$emit("update:modelValue", event.target.value); // previously was `this.$emit('input', title)`
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
  border-radius: 9px;
  color: white;
}

input:focus {
  outline: 4px solid var(--primary-color);
  border: 1px solid var(--primary-color);
}
</style>
