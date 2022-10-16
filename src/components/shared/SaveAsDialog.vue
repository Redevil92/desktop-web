<template>
  <div style="color: white">
    <BaseDialog :to="to">
      {{ to }}
      HELLO
      <BaseInput v-model="saveAs"> </BaseInput>
    </BaseDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDialog from "@/components/shared/BaseDialog.vue";

export default defineComponent({
  props: { to: String },
  components: { BaseInput, BaseDialog },
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
