<template>
  <BaseDialog v-if="show">
    <div class="">
      <div>
        <BaseInput v-model="name"></BaseInput>
      </div>
      <div>
        <BaseInput v-model="resolution"></BaseInput>
      </div>

      <BaseButton @click="showDialog = false" class="print-button">Print</BaseButton>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, PropType, ref } from "vue";

import BaseButton from "@/components/shared/BaseButton.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDialog from "@/components/shared/BaseDialog.vue";

export default defineComponent({
  props: {
    show: Boolean,
  },
  components: { BaseButton, BaseInput, BaseDialog },
  emits: [],
  setup(props, _) {
    const name = ref("testname");
    const resolution = ref(900);

    return { name, resolution };
  },
});
</script>

<style scoped>
.print-button {
  margin-top: 20px;
  width: 100%;
}
</style>
