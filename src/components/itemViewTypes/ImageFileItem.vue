<template>
  <div :style="`height: ${height - 14}px; width: ${itemDialog.dimension.width - 4}px; `">
    <!-- <panZoom selector=".zoomable" :options="{ minZoom: 0.5, maxZoom: 5 }">
      <img class="zoomable" src="https://picsum.photos/300" />
    </panZoom> -->
    <div class="flex">
      <div class="image-zoom">{{ truncatedZoomLevel }}%</div>
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
import { computed, defineComponent, nextTick, onMounted, PropType, ref } from "vue";

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
    const originalHeight = ref();
    const calculatedHeight = computed(() => {
      return Math.trunc(originalHeight.value * (zoomLevel.value / 100));
    });

    const truncatedZoomLevel = computed(() => {
      return Math.trunc(zoomLevel.value);
    });

    if (props.itemDialog?.name) {
      imageFile.value = readFile(props.itemDialog?.name).toString();
    }

    const zoomImage = (zoom: boolean) => {
      if (zoom && zoomLevel.value < 900) {
        zoomLevel.value = zoomLevel.value * 1.3;
      }
      if (!zoom && zoomLevel.value > 20) {
        zoomLevel.value = zoomLevel.value * 0.75;
      }
    };

    onMounted(async () => {
      await nextTick();
      if (props.itemDialog?.name) {
        const imageRef = document.getElementById("image-" + props.itemDialog.guid);
        originalHeight.value = imageRef?.getBoundingClientRect().height;
      }
    });

    return { imageFile, zoomImage, calculatedHeight, truncatedZoomLevel };
  },
});
</script>

<style scoped>
/* .file-image {
  object-fit: cover;
} */
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-wrapper {
  overflow: auto;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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
  padding-top: 2px;
}

.zoom-icon:hover {
  background-color: rgba(163, 162, 162, 0.224);
  border-radius: 7px;
}

.image-zoom {
  color: white;
  margin-right: 10px;
  width: 70px;
}
</style>
