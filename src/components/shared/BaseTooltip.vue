<template>
  <div v-if="show" class="tooltip" :style="left ? `left: ${left}px` : 'left:0px'">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({ show: Boolean, left: Number, width: Number });
</script>
<style scoped>
.tooltip {
  position: absolute;
  top: 20;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 5px;
  z-index: 1;
  padding: 10px;
  box-shadow: 0px 2px 4px 5px rgba(0, 0, 0, 0.1);
  width: 220px;
  background-color: rgb(255, 255, 255);
}
</style>
