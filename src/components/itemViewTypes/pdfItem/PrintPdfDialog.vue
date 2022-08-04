<template>
  <BaseDialog v-if="show" to="pdfItem" darker noPadding>
    <div class="dialog">
      <div class="input-container">
        <div class="label">Print as:</div>
        <div>
          <BaseInput v-model="name"></BaseInput>
          <div class="message">
            Leave it empty if you don't want to see <br />
            any name on the PDF.
          </div>
        </div>
      </div>
      <div class="input-container">
        <div class="label">Resolution:</div>
        <div>
          <BaseInput type="number" v-model="resolution"></BaseInput>
          <div class="message">Suggested 900.</div>
        </div>
      </div>
      <div class="input-container">
        <div class="label">Pages:</div>
        <div>
          <BaseInput type="number" v-model="resolution"></BaseInput>
        </div>
      </div>
      <div class="flex-end">
        <BaseButton small neutralColor @click="closeDialog" class="print-button">Close</BaseButton>
        <BaseButton small @click="printPdf" class="print-button" style="margin-left: 10px">Print</BaseButton>
      </div>
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
    pdfRef: Object,
  },
  components: { BaseButton, BaseInput, BaseDialog },
  emits: ["close"],
  setup(props, context) {
    const name = ref("");
    const resolution = ref(900);

    const printPdf = () => {
      (props.pdfRef as any).print(resolution.value, name.value);
      (props.pdfRef as any).pageNums;
    };

    const closeDialog = () => {
      context.emit("close");
    };

    onMounted(() => {
      console.log("PDF 2", props.pdfRef);
    });

    return { name, resolution, closeDialog, printPdf };
  },
});
</script>

<style scoped>
.print-button {
  margin-top: 20px;
  width: 100px;
}

.input-container {
  display: flex;
  margin-top: 10px;
}

input {
  width: 230px;
}

.label {
  width: 110px;
  text-align: right;
  margin-right: 10px;
  color: white;
}

.dialog {
  padding: 10px;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
}

.message {
  color: white;
  font-size: var(--small-font-size);
  text-align: left;
}
</style>
