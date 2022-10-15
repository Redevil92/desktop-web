<template>
  <div>
    <BaseDialog>
      <BaseInput v-model="saveAs"> </BaseInput>
    </BaseDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {},
  components: {},
  emits: [],
  setup() {
    const saveAs = ref("");

    return {
      saveAs,
    };
  },
});
</script>
<style scoped></style>
