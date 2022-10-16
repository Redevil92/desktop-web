<template>
  <div style="color: white">
    <BaseDialog :to="to">
      <!-- <div class="label">Save as:</div> -->
      <BaseInput label="Save as:" placeholder="Destination folder" v-model="saveAs"> </BaseInput>
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
<style scoped>
.label {
  width: 110px;
  text-align: right;
  margin-right: 10px;
}
</style>
