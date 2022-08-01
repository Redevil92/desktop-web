<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <div class="pdf-controls">
      <span
        class="mdi mdi-arrow-left control-icon"
        :class="{ 'control-icon-disabled': page === 1 }"
        @click="changePage(page - 1)"
      ></span
      >{{ page }} - {{ pageCount
      }}<span
        class="mdi mdi-arrow-right control-icon"
        :class="{ 'control-icon-disabled': page === pageCount }"
        @click="changePage(page + 1)"
      ></span>
    </div>
    <div></div>
    <div class="pdf-container" :style="`height: ${height - 35}px; width: ${itemDialog.dimension.width - 4}px; `">
      <vue-pdf-embed
        ref="pdfRef"
        :source="pdfData"
        :page="page"
        @password-requested="handlePasswordRequest"
        @rendered="handleDocumentRender"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import VuePdfEmbed from "vue-pdf-embed";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { VuePdfEmbed },
  emits: [],
  setup(props, _) {
    const pdfData = ref(
      "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
    );
    const pdfRef = ref(null);
    const page = ref(1);
    const isLoading = ref(false);
    const pageCount = ref(0);

    const handlePasswordRequest = (callback: any, retry: any) => {
      callback(prompt(retry ? "Enter password again" : "Enter password"));
    };

    const handleDocumentRender = () => {
      isLoading.value = false;
      pageCount.value = (pdfRef.value as any).pageCount;
    };

    const changePage = (selectedPage: number) => {
      console.log("CHANGINF PAGE", selectedPage);
      if (selectedPage > 0 && selectedPage <= pageCount.value) {
        page.value = selectedPage;
      }
    };

    return { pdfRef, page, pdfData, isLoading, pageCount, handleDocumentRender, handlePasswordRequest, changePage };
  },
});
</script>

<style scoped>
.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

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
  height: 28px;
  background-color: rgb(62, 62, 62);
  color: white;
  font-size: var(--large-font-size);
  padding-top: 3px;
}

.control-icon {
  color: white;
  padding: 1px 2px;
  background-color: rgb(101, 101, 101);
  font-size: var(--medium-font-size);
  border-radius: 5px;
  margin: 0px 8px;
}

.control-icon:hover {
  background-color: rgb(141, 141, 141);
}

.control-icon-disabled {
  opacity: 0.4;
}
</style>
