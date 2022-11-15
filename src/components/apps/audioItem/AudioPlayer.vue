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
import { buffer } from "stream/consumers";

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

    const analyzer = ref<AnalyserNode | null>(null);
    const audioCtx = ref(new window.AudioContext());
    const audioSource = ref();
    const x = ref(0);

    function animate() {
      x.value = 0;
      if (canvasRef.value && analyzer.value) {
        const bufferLength = analyzer.value.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = canvasRef.value.width / bufferLength;

        const ctx = canvasRef.value.getContext("2d") as CanvasRenderingContext2D;
        ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

        analyzer.value?.getByteFrequencyData(dataArray);

        drawVisualizer(bufferLength, dataArray, ctx, canvasRef.value);
      }

      requestAnimationFrame(animate);
    }

    const drawVisualizer = (
      bufferLength: number,
      dataArray: Uint8Array,

      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement
    ) => {
      //   const style = getComputedStyle(document.body);
      //   ctx.fillStyle = style.getPropertyValue("--font-color");

      //   let barHeight;
      //   for (let i = 0; i < bufferLength; i++) {
      //     barHeight = dataArray[i];
      //     ctx.fillRect(
      //       canvas.width / 2 - x.value, // this will start the bars at the center of the canvas and move from right to left
      //       canvas.height - barHeight,
      //       barWidth,
      //       barHeight
      //     );
      //     x.value += barWidth; // increases the x value by the width of the bar
      //   }
      //   ctx.fillStyle = style.getPropertyValue("--font-color");

      //   for (let i = 0; i < bufferLength; i++) {
      //     barHeight = dataArray[i];
      //     ctx.fillRect(x.value, canvas.height - barHeight, barWidth, barHeight); // this will continue moving from left to right
      //     x.value += barWidth; // increases the x value by the width of the bar
      //   }

      const style = getComputedStyle(document.body);
      ctx.fillStyle = style.getPropertyValue("--font-color");

      let barHeight;
      const barWidth = canvas.width / 2 / bufferLength;
      let firstX = 0;
      let secondX = bufferLength * barWidth;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] - 100;
        const red = (i * barHeight) / 10;
        const green = i * 4;
        const blue = barHeight / 4 - 12;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(canvas.width / 2 - firstX, canvas.height - barHeight, barWidth, barHeight);
        firstX += barWidth;
        ctx.fillRect(secondX, canvas.height - barHeight, barWidth, barHeight);
        secondX += barWidth;
      }
    };

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        const audioData = await readFile(props.itemDialog?.path);
        console.log(audioData);

        //audioSource.value = b64ToText(audioData, true);
        audioSource.value = audioData;
      }
    });

    onMounted(() => {
      if (audioRef.value && canvasRef.value) {
        console.log(audioRef.value);
        audioRef.value.play();
        audioSource.value = audioCtx.value.createMediaElementSource(audioRef.value);
        analyzer.value = audioCtx.value.createAnalyser();

        audioSource.value.connect(analyzer.value);
        analyzer.value.connect(audioCtx.value.destination);

        analyzer.value.fftSize = 128;

        animate();
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
