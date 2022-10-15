<template>
  <div :style="`height: ${height}px`">COMPONENT TO IMPLEMENT</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    height: Number,
  },
  components: {},
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
