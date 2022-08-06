<template>
  <PrintPdfDialog
    v-if="showPrintPdfDialog"
    :show="showPrintPdfDialog"
    :pdfRef="pdfRef"
    @close="showPrintPdfDialog = false"
  />
  <div id="pdfItem" :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <div class="pdf-controls">
      <div class="view-option-button">
        <span class="mdi mdi-view-split-vertical control-icon" @click="showViewOption = !showViewOption"
          ><span style="margin-left: 5px; font-size: var(--large-font-size)">View</span>
          <span class="mdi mdi-chevron-down chevron-icon"></span
        ></span>
        <div class="view-option-container" v-if="showViewOption">
          <div class="view-item" :class="{ 'view-item-selected': page > 0 }" @click="page = 1">
            <div>Single page</div>
            <div v-if="page > 0"><span class="mdi mdi-check"></span></div>
          </div>
          <div class="view-item" :class="{ 'view-item-selected': page === null }" @click="page = null">
            <div>Scrolling</div>
            <div>
              <span v-if="page === 0" class="mdi mdi-check"></span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span
          class="mdi mdi-arrow-left control-icon"
          :class="{ 'control-icon-disabled': page === 1 }"
          @click="changePage(page - 1)"
        ></span>
        <input type="number" :value="page" @change="changePage(+$event.target.value)" /> /{{ pageCount
        }}<span
          class="mdi mdi-arrow-right control-icon"
          :class="{ 'control-icon-disabled': page === pageCount }"
          @click="changePage(page + 1)"
        ></span>
      </div>

      <div>
        <span
          class="mdi mdi-magnify-minus control-icon"
          @click="zoomOut"
          :class="{ 'control-icon-disabled': false }"
        ></span
        ><span
          class="mdi mdi-magnify-plus control-icon"
          @click="zoomIn"
          :class="{ 'control-icon-disabled': false }"
        ></span>
      </div>
      <div>
        <span class="mdi mdi-rotate-left control-icon" @click="rotateLeft"></span>
      </div>

      <div>
        <span
          class="mdi mdi-download control-icon"
          @click="downloadPdf"
          :class="{ 'control-icon-disabled': false }"
        ></span>
        <span
          class="mdi mdi-printer control-icon"
          @click="showPrintPdfDialog = true"
          :class="{ 'control-icon-disabled': false }"
        ></span>
      </div>
    </div>

    <div
      class="pdf-container vue-pdf-embed"
      :style="`height: ${height - 40}px; width: ${itemDialog.dimension.width - 6}px;`"
      ref="pdfContainerRef"
    >
      <vue-pdf-embed
        :style="`margin-top: ${pdfMargin}px; margin-bottom:20px `"
        ref="pdfRef"
        :source="pdfData"
        :page="page"
        :height="pdfHeight"
        :rotation="pdfRotation"
        @password-requested="handlePasswordRequest"
        @rendered="handleDocumentRender"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import VuePdfEmbed from "vue-pdf-embed";

import { dowloadWithProgress } from "@/utils/downloadUtils";
import { readFile } from "@/context/fileSystemController";
import { getFileNameFromPath } from "@/context/fileSystemUtils";

import PrintPdfDialog from "@/components/itemViewTypes/pdfItem/PrintPdfDialog.vue";
import store from "@/store";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { VuePdfEmbed, PrintPdfDialog },
  emits: [],
  setup(props, _) {
    const pdfData = ref(null as any);
    const pdfRef = ref(null);
    const page = ref(1);
    const pdfRotation = ref(0);
    const isLoading = ref(false);
    const pageCount = ref(1);
    const pdfHeight = ref(800);
    const pdfWidth = ref(0);
    const showViewOption = ref(false);
    const pdfContainerRef = ref(null);
    const showPrintPdfDialog = ref(false);

    const pdfMargin = computed(() => {
      const dialogHeight = props.height || 0;
      let calculatedMargin = 0;

      const pdfDimension =
        pdfRotation.value === 0 || Math.abs(pdfRotation.value) % 180 === 0 ? pdfHeight.value : pdfWidth.value;

      if (page.value !== null) {
        calculatedMargin = pdfDimension - dialogHeight + 100;
      } else {
        const marginBottom = 10;
        calculatedMargin = (pdfDimension + marginBottom) * pageCount.value - dialogHeight + 100;
      }

      calculatedMargin = calculatedMargin > 0 ? calculatedMargin : 0;

      return calculatedMargin;
    });

    const handlePasswordRequest = (callback: any, _: any) => {
      const password = prompt("Enter password in order to see the file");
      if (password) {
        callback(password);
      } else {
        store.dispatch("fileSystem/CLOSE_ITEM_DIALOG", props.itemDialog?.guid);
      }
    };

    const handleDocumentRender = async () => {
      isLoading.value = false;

      pageCount.value = (pdfRef.value as any).pageCount;

      if (
        pdfWidth.value === 0 &&
        pdfContainerRef.value &&
        (pdfContainerRef.value as unknown as HTMLElement).children[0]
      ) {
        pdfWidth.value = (pdfContainerRef.value as unknown as HTMLElement).children[0].getBoundingClientRect().width;
      }

      //console.log((pdfContainerRef.value as unknown as HTMLElement).children[0].getBoundingClientRect().width);
    };

    const changePage = (selectedPage: number) => {
      console.log(selectedPage);
      if (selectedPage > 0 && selectedPage <= pageCount.value) {
        page.value = selectedPage;
      }
    };

    const downloadPdf = () => {
      const pdfName = props.itemDialog ? getFileNameFromPath(props.itemDialog?.name) : "un-named";
      dowloadWithProgress(pdfData.value, pdfName);
    };

    const zoomIn = () => {
      pdfHeight.value *= 1.1;
      pdfWidth.value *= 1.1;
    };
    const zoomOut = () => {
      pdfHeight.value /= 1.1;
      pdfWidth.value /= 1.1;
    };

    const rotateLeft = () => {
      pdfRotation.value -= 90;
    };

    const loadPdf = async () => {
      if (props.itemDialog?.name) {
        const file = await readFile(props.itemDialog?.name);
        pdfData.value = file.toString();
      }
    };

    onBeforeMount(async () => {
      await loadPdf();
    });

    return {
      pdfRef,
      pdfHeight,
      page,
      pdfData,
      isLoading,
      pageCount,
      handleDocumentRender,
      handlePasswordRequest,
      changePage,
      zoomOut,
      zoomIn,
      downloadPdf,
      pdfMargin,
      showViewOption,
      rotateLeft,
      pdfRotation,
      pdfContainerRef,
      showPrintPdfDialog,
      loadPdf,
    };
  },
});
</script>

<style>
.vue-pdf-embed > div {
  margin-bottom: 10px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
.app-header {
  padding: 16px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}

.app-content {
  padding: 24px 16px;
  margin-top: 20px;
  position: absolute;
}

.right {
  float: right;
}

.pdf-container {
  overflow: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf-controls {
  height: 35px;
  background-color: rgb(62, 62, 62);
  color: white;
  font-size: var(--large-font-size);
  padding-top: 4px;
  display: flex;
  justify-content: space-evenly;
}

.control-icon {
  color: white;
  padding: 0px 5px;
  cursor: pointer;
  background-color: rgb(101, 101, 101);
  font-size: var(--x-large-font-size);
  border-radius: 5px;
  margin: 0px 8px;
}

.control-icon:hover {
  background-color: rgb(141, 141, 141);
}

.control-icon-disabled {
  opacity: 0.4;
}

.chevron-icon {
  color: white;
  font-size: var(--medium-font-size);
}

.view-option-button {
  position: relative;
}

.view-option-container {
  position: absolute;
  background-color: #3d3b3bf5;
  z-index: 3;
  font-size: var(--medium-font-size);
  left: 5px;
  padding: 5px;
  width: fit-content;
  text-align: initial;
  border-radius: 5px;
  border: 1px solid #5c5c5c;
}

.view-item {
  cursor: pointer;
  border-radius: 5px;
  padding: 2px;
  width: 110px;
  display: flex;
  justify-content: space-between;
}

.view-item:hover {
  background-color: #696464f5;
}

.view-item-selected {
  background-color: #837d7df5;
  border-radius: 5px;
  padding: 2px;
}

input {
  border-radius: 5px;
  -webkit-appearance: none;
  all: unset;
  width: 40px;
  text-align: center;
  border: 1px solid white;
  border-radius: 5px;
}

input:focus {
  outline: 2px solid white; /* Removes the border when the input is clicked */
  border-radius: 5px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
