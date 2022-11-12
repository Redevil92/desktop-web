<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <canvas id="canvas-audio" ref="canvasRef" class="audio-canvas"></canvas>
    <audio id="audio" controls ref="audioRef" :src="audioSource"></audio>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";

import { readFile } from "@/context/fileSystemController";

import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const canvasRef = ref<HTMLCanvasElement>();
    const audioRef = ref<HTMLAudioElement>();

    const audioSource = ref();

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        const audioData = await readFile(props.itemDialog?.path);
        console.log(audioData);

        //audioSource.value = b64ToText(audioData, true);
        audioSource.value = audioData;
      }
    });

    onMounted(() => {
      if (audioRef.value) {
        console.log(audioRef.value);
        audioRef.value.play();
      }
    });

    return { audioSource, canvasRef, audioRef };
  },
});
</script>

<style scoped>
.audio-canvas {
  height: 300px;
  width: 600px;
  border: 2px solid black;
}
</style>
