<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `" style="position: relative">
    <div id="waveform"></div>
    <div :style="`height: ${height - 80}px; padding: calc(var(--margin)*2) `">
      <canvas id="canvas-audio" ref="canvasRef" class="audio-canvas"></canvas>
    </div>

    <audio class="audio-controls" id="audio" controls ref="audioRef" :src="audioSource"></audio>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, PropType, ref } from "vue";
import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

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
        console.log("DRAW", dataArray);
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
      const style = getComputedStyle(document.body);
      ctx.fillStyle = style.getPropertyValue("--font-color");

      let barHeight;
      const barWidth = canvas.width / 2 / bufferLength;
      let firstX = 0;
      let secondX = bufferLength * barWidth;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] - 70;
        // const red = (i * barHeight) / 10;
        // const green = i * 4;
        // const blue = barHeight / 4 - 12;

        ctx.fillStyle = `var(--font-color)`;
        ctx.fillRect(canvas.width / 2 - firstX, canvas.height - barHeight, barWidth - 1, barHeight);
        firstX += barWidth;
        ctx.fillRect(secondX, canvas.height - barHeight, barWidth - 1, barHeight);
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
        audioRef.value.play();
        audioSource.value = audioCtx.value.createMediaElementSource(audioRef.value);
        console.log(audioSource.value);
        analyzer.value = audioCtx.value.createAnalyser();

        audioSource.value.connect(analyzer.value);
        analyzer.value.connect(audioCtx.value.destination);

        analyzer.value.smoothingTimeConstant = 0.85;
        analyzer.value.fftSize = 32;

        animate();
      }
    });

    return { audioSource, canvasRef, audioRef };
  },
});
</script>

<style scoped>
.audio-canvas {
  height: 100%;
  width: 100%;
}

.audio-controls {
  position: absolute;
  bottom: calc(var(--margin) * 2);
  width: calc(100% - calc(var(--margin) * 4));
  left: 0px;
  margin: 0px calc(var(--margin) * 2);
}
</style>
