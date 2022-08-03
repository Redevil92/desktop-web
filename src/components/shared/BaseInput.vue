<template>
  <input @input="changePageTitle" :value="modelValue" />
</template>

<script>
export default {
  props: {
    modelValue: String, // previously was `value: String`
  },
  emits: ["update:modelValue"],
  methods: {
    changePageTitle(title) {
      this.$emit("update:modelValue", title); // previously was `this.$emit('input', title)`
    },
  },
};
</script>

<style lang="css" scoped>
input {
}
</style>
