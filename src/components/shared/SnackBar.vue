<template>
  <div v-if="snackBar.show">
    <Teleport to="body">
      <div class="snack-bar-container">
        <div class="snack-bar">This is a test</div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import SnackBar from "@/models/SnackBar";
import { useLayoutStore } from "@/stores/layoutStore";
import { computed, defineComponent, watch } from "vue";

export default defineComponent({
  props: {},
  components: {},
  setup() {
    const layoutStore = useLayoutStore();

    const snackBar = computed(function () {
      return layoutStore.snackBar as SnackBar;
    });

    const durationTime = computed(function () {
      return layoutStore.snackBarDurationTime;
    });

    watch(
      () => snackBar,
      function () {
        if (snackBar.value.show) {
          setTimeout(() => {
            layoutStore.resetSnackBar();
          }, durationTime.value);
        }
      }
    );

    return { snackBar };
  },
});
</script>
<style scoped>
.snack-bar {
  border-radius: 8px;
  background-color: green;
  color: white;
}

.snack-bar-container {
  width: 100%;
  position: absolute;
  bottom: 50px;
  display: flex;
  justify-content: center;
}
</style>
