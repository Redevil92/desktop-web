<template>
  <PrintPdfDialog
    v-if="showPrintPdfDialog"
    :show="showPrintPdfDialog"
    :pdfRef="pdfRef"
    @close="showPrintPdfDialog = false"
  />

  <div id="pdfItem" :style="`height: ${height - 14}px; width: calc(100% -4px);`">
    <PdfControls
      :page="page"
      :pageCount="pageCount"
      @onChangePage="changePage"
      @onDownload="downloadPdf"
      @onRotateLeft="rotateLeft"
      @onZoomIn="zoomIn"
      @onZoomOut="zoomOut"
      @onPrint="showPrintPdfDialog = true"
    ></PdfControls>

    <div
      class="pdf-container vue-pdf-embed"
      :style="`height: ${height - 40}px; width: calc(100% -6px);`"
      ref="pdfContainerRef"
    >
      <vue-pdf-embed
        :style="`margin-top: ${pdfMargin}px; margin-bottom:20px `"
        ref="pdfRef"
        :source="pdfData"
        :page="(page as any)"
        :height="pdfHeight"
        :rotation="pdfRotation"
        @password-requested="handlePasswordRequest"
        @rendered="handleDocumentRender"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import VuePdfEmbed from "vue-pdf-embed";

import { dowloadWithProgress } from "@/utils/downloadUtils";
import { readFile } from "@/context/fileSystemController";
import { getFileNameFromPath } from "@/context/fileSystemUtils";

import PrintPdfDialog from "@/components/apps/pdfItem/PrintPdfDialog.vue";
import PdfControls from "@/components/apps/pdfItem/PdfControls.vue";
import { useFileSystemStore } from "@/stores/fileSystemStore";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true },
});

const fileSystemStore = useFileSystemStore();

const pdfData = ref(null as any);
const pdfRef = ref<HTMLElement | null>(null);
const page = ref<number | undefined>(1);
const pdfRotation = ref(0);
const isLoading = ref(false);
const pageCount = ref(1);
const pdfHeight = ref(800);
const pdfWidth = ref(0);
const pdfContainerRef = ref(null);
const showPrintPdfDialog = ref(false);

const pdfMargin = computed(() => {
  const dialogHeight = props.height || 0;
  let calculatedMargin = 0;

  const pdfDimension =
    pdfRotation.value === 0 || Math.abs(pdfRotation.value) % 180 === 0 ? pdfHeight.value : pdfWidth.value;

  if (page.value !== undefined) {
    calculatedMargin = pdfDimension - dialogHeight + 100;
  } else {
    const marginBottom = 10;
    calculatedMargin = (pdfDimension + marginBottom) * pageCount.value - dialogHeight + 100;
  }

  calculatedMargin = calculatedMargin > 0 ? calculatedMargin : 0;

  return calculatedMargin;
});

const changePage = (currentPage: number) => {
  console.log("chang page", currentPage);
  page.value = currentPage;
};

const handlePasswordRequest = (callback: any, _: any) => {
  const password = prompt("Enter password in order to see the file");
  if (password) {
    callback(password);
  } else {
    fileSystemStore.closeItemDialog(props.itemDialog?.guid || "");
  }
};

const handleDocumentRender = async () => {
  isLoading.value = false;

  pageCount.value = (pdfRef.value as any).pageCount;

  if (pdfWidth.value === 0 && pdfContainerRef.value && (pdfContainerRef.value as unknown as HTMLElement).children[0]) {
    pdfWidth.value = (pdfContainerRef.value as unknown as HTMLElement).children[0].getBoundingClientRect().width;
  }
};

const downloadPdf = () => {
  const pdfName = props.itemDialog ? getFileNameFromPath(props.itemDialog?.path) : "un-named";
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
  if (props.itemDialog?.path) {
    const file = await readFile(props.itemDialog?.path);
    pdfData.value = file.toString();
  }
};

onBeforeMount(async () => {
  await loadPdf();
});
</script>

<style>
.vue-pdf-embed > div {
  margin-bottom: 10px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
.pdf-container {
  overflow: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
