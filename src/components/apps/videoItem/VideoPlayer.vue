<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `" style="position: relative">
    <video v-if="videoSource" :src="videoSource" :height="height" width="100%" controls>
      <!-- <source :src="videoSource" type="video/mp4" /> -->
      <!-- <source src="movie.ogg" type="video/ogg" /> -->
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref } from "vue";
import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";
import useBase64Handler from "@/hooks/useBase64Handler";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

const videoSource = ref();

const { removeDataUri } = useBase64Handler();

onMounted(async () => {
  if (props.itemDialog?.path) {
    const videoData = await readFile(props.itemDialog?.path);
    console.log(videoData);
    videoSource.value = removeDataUri(videoData);
  }
});
</script>

<style scoped></style>
