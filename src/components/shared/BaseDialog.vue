<template>
  <Teleport :to="to ? `#${to}` : '#app'">
    <div class="dialog-container">
      <div class="dialog" :class="{ 'darker-dialog': darker, padding: !noPadding }">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps({ darker: Boolean, to: String, noPadding: Boolean });
</script>
<style scoped>
.dialog-container {
  color: var(--font-color);
  width: 100%;
  height: 100%;
  z-index: 5;
  /* background-color: rgba(0, 0, 0, 0.04); */
  position: absolute;
  display: flex;
  top: 0;
}

.padding {
  padding: 20px;
}

.dialog {
  background-color: var(--background-color_light);
  margin: auto;
  margin-top: 130px;
  box-shadow: 2px 3px 20px 0px rgb(0 0 0 /20%);
  -webkit-box-shadow: 2px 3px 10px 0px rgb(0 0 0 / 20%);
  border-radius: var(--border-radius);
}

.darker-dialog {
  background-color: var(--background-color_dark);
}
</style>
