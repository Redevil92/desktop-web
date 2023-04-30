<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">
    <div class="flex" style="position: relative">
      <input v-model="zoomLevel" class="image-zoom zoom-input" type="number" />
      <span class="mdi mdi-percent percent-icon" style="position: absolute"></span>
      <span @click="zoomImage(false)" class="mdi mdi-magnify-minus-outline zoom-icon"></span>
      <span @click="zoomImage(true)" class="mdi mdi-magnify-plus-outline zoom-icon"></span>
    </div>

    <div class="img-wrapper" :style="`height: ${height - 40}px; `">
      <img
        :src="`${imageFile}`"
        :style="`height: ${calculatedHeight !== 0 ? calculatedHeight + 'px' : ''}`"
        alt=""
        :id="`image-${itemDialog.guid}`"
        class="file-image"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeMount, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: {
    type: Number,
    required: true,
  },
});

const imageFile = ref("");
const zoomLevel = ref(100);
const originalHeight = ref(0);

const calculatedHeight = computed(() => {
  return Math.trunc(originalHeight.value * (zoomLevel.value / 100));
});

const zoomImage = (zoom: boolean) => {
  if (props.itemDialog?.guid) {
    const imageRef = document.getElementById("image-" + props.itemDialog.guid);
    if (originalHeight.value === 0 && imageRef?.getBoundingClientRect()) {
      originalHeight.value = (imageRef?.getBoundingClientRect().height * 100) / zoomLevel.value;
    }
  }

  if (zoom && zoomLevel.value < 900) {
    zoomLevel.value = Math.trunc(zoomLevel.value * 1.3);
  }
  if (!zoom && zoomLevel.value > 20) {
    zoomLevel.value = Math.trunc(zoomLevel.value * 0.75);
  }
};

onBeforeMount(async () => {
  if (props.itemDialog?.path) {
    const file = await readFile(props.itemDialog?.path);
    imageFile.value = file.toString();
  }
});

onMounted(async () => {
  await nextTick();
});
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-wrapper {
  overflow: auto;
  position: relative;
}

.img-wrapper > img {
  vertical-align: bottom;
}

.zoom-icon {
  font-size: 22px;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
}

.zoom-input {
  width: 70px;
  text-align: right;
  padding-right: 25px;
}

.zoom-icon:hover {
  background-color: rgba(163, 162, 162, 0.224);
  border-radius: 7px;
}

.image-zoom {
  color: white;
  margin-right: 10px;
}

.percent-icon {
  color: white;
  font-size: 20px;
}

input {
  border: none;
  -webkit-appearance: none;
  all: unset;
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
