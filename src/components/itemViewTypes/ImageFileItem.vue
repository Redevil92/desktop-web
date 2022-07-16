<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <!-- <panZoom selector=".zoomable" :options="{ minZoom: 0.5, maxZoom: 5 }">
      <img class="zoomable" src="https://picsum.photos/300" />
    </panZoom> -->
    <div>
      {{ calculatedHeight }}
      <span @click="zoomImage(true)" class="mdi mdi-magnify-plus zoom-icon"></span>
      <span @click="zoomImage(false)" class="mdi mdi-magnify-minus zoom-icon"></span>
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
    <!-- <panZoom>
      <img
        :src="`${imageFile}`"
        :height="height - 15"
        :width="itemDialog.dimension.width - 6"
        alt=""
        class="file-image"
      />
    </panZoom> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

// import panZoom from "vue-panzoom";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const imageFile = ref("");
    const zoomLevel = ref(100);
    const originalHeight = ref(0);
    const calculatedHeight = computed(() => {
      return originalHeight.value * (zoomLevel.value / 100);
    });

    if (props.itemDialog?.name) {
      imageFile.value = readFile(props.itemDialog?.name).toString();
    }

    const zoomImage = (zoom: boolean) => {
      if (zoom && zoomLevel.value < 600) {
        zoomLevel.value = zoomLevel.value * 1.1;
      }
      if (!zoom && zoomLevel.value > 40) {
        zoomLevel.value = zoomLevel.value * 0.9;
      }
    };

    onMounted(() => {
      if (props.itemDialog?.name) {
        const imageRef = document.getElementById("image-" + props.itemDialog.guid);
        originalHeight.value = imageRef?.clientHeight || 0;
        console.log(imageRef?.clientHeight, imageRef?.getBoundingClientRect());
      }
    });

    return { imageFile, calculatedHeight, zoomImage };
  },
});
</script>

<style scoped>
/* .file-image {
  object-fit: cover;
} */

.img-wrapper {
  overflow: auto;

  position: relative;
}

.img-wrapper > img {
  /* height: 100%;
  width: 100%; */
  vertical-align: bottom;
}

.zoom-icon {
  font-size: 22px;
  color: white;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
