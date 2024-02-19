<template>
  <div v-if="snackbar && snackbar.show">
    <Teleport to="body">
      <div class="snack-bar-container flex">
        <div class="snack-bar flex" :style="`background-color: ${snackbar.severity.color}`">
          <div>{{ snackbar.text }}</div>
          <div class="close-button flex" @click="resetSnackbar">CLOSE</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import SnackBar from "@/models/SnackBar";
import { useLayoutStore } from "@/stores/layoutStore";
import { computed, defineComponent, watch } from "vue";

const layoutStore = useLayoutStore();

const snackbar = computed(function () {
  return layoutStore.snackbar as SnackBar;
});

const durationTime = computed(function () {
  return layoutStore.snackbarDurationTime;
});

const resetSnackbar = () => {
  layoutStore.resetSnackBar();
};

watch(
  () => snackbar.value,
  function () {
    if (snackbar.value.show) {
      setTimeout(() => {
        layoutStore.resetSnackBar();
      }, durationTime.value);
    }
  },
);
</script>
<style scoped>
.snack-bar {
  border-radius: var(--border-radius);
  padding: calc(var(--margin) / 2) var(--margin);
  font-size: var(--medium-font-size);
  color: white;
}

.success-snackbar {
  background-color: #4fa357;
  color: white;
}

.information-snackbar {
  background-color: #b7b7b75f;
  color: white;
}

.error-snackbar {
  background-color: var(--error-color);
  color: white;
}

.warning-snackbar {
  background-color: var(--warning-color);
  color: white;
}

.snack-bar-container {
  width: 100%;
  position: absolute;
  bottom: 50px;
  padding: 0px var;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-button {
  margin-left: 10px;
  padding: calc(var(--margin) / 3) calc(var(--margin));
  border-radius: var(--border-radius);
  background-color: rgba(224, 223, 223, 0.368);
  cursor: pointer;
}

.close-icon {
  margin-left: var(--unit-size);
  color: var(--font-color);
}
</style>
