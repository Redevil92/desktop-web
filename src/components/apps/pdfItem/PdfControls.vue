<template>
  <div class="pdf-controls">
    <div class="view-option-button">
      <span class="mdi mdi-view-split-vertical control-icon" @click="showViewOption = !showViewOption"
        ><span style="margin-left: 5px; font-size: var(--large-font-size)">View</span>
        <span class="mdi mdi-chevron-down chevron-icon"></span
      ></span>
      <div class="view-option-container" v-if="showViewOption">
        <div class="view-item" :class="{ 'view-item-selected': page && page > 0 }" @click="changePage(1)">
          <div>Single page</div>
          <div v-if="page && page > 0"><span class="mdi mdi-check"></span></div>
        </div>
        <div class="view-item" :class="{ 'view-item-selected': page === undefined }" @click="changePage(undefined)">
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
        @click="changePage(page ? page - 1 : 0)"
      ></span>
      <input type="number" :value="page" @change="changePageFromInput($event)" /> /{{ pageCount
      }}<span
        class="mdi mdi-arrow-right control-icon"
        :class="{ 'control-icon-disabled': page === pageCount }"
        @click="changePage(page ? page + 1 : 0)"
      ></span>
    </div>

    <div>
      <span
        class="mdi mdi-magnify-minus control-icon"
        @click="emit('onZoomOut')"
        :class="{ 'control-icon-disabled': false }"
      ></span
      ><span
        class="mdi mdi-magnify-plus control-icon"
        @click="emit('onZoomIn')"
        :class="{ 'control-icon-disabled': false }"
      ></span>
    </div>
    <div>
      <span class="mdi mdi-rotate-left control-icon" @click="emit('onRotateLeft')"></span>
    </div>

    <div>
      <span
        class="mdi mdi-download control-icon"
        @click="emit('onDownload')"
        :class="{ 'control-icon-disabled': false }"
      ></span>
      <span
        class="mdi mdi-printer control-icon"
        @click="emit('onPrint')"
        :class="{ 'control-icon-disabled': false }"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from "vue";

const props = defineProps({
  page: { type: Object as PropType<number | undefined>, required: true },
  pageCount: { type: Number, required: true },
});

const emit = defineEmits(["onChangePage", "onDownload", "onRotateLeft", "onZoomIn", "onZoomOut", "onPrint"]);

const showViewOption = ref(false);

const changePage = (selectedPage: number | undefined) => {
  if (selectedPage === undefined || (selectedPage > 0 && selectedPage <= props.pageCount)) {
    emit("onChangePage", selectedPage);
  }
};

const changePageFromInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value as unknown as number;
  changePage(+value);
};
</script>

<style>
.vue-pdf-embed > div {
  margin-bottom: 10px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
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
