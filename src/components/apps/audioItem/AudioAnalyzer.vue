<template>
  <canvas id="canvas-audio" ref="canvasRef" class="audio-canvas"></canvas>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref } from "vue";

const props = defineProps({ audioElement: Object as PropType<HTMLAudioElement> });

const canvasRef = ref<HTMLCanvasElement>();

const analyzer = ref<AnalyserNode | null>(null);
const audioCtx = ref(new window.AudioContext());

function animate() {
  if (canvasRef.value && analyzer.value) {
    const bufferLength = analyzer.value.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

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
  const style = getComputedStyle(document.body);
  ctx.fillStyle = style.getPropertyValue("--font-color");

  let barHeight;
  const barWidth = canvas.width / 2 / bufferLength;
  let firstX = 0;
  let secondX = bufferLength * barWidth;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fixDpi();

  const maxDataArrayValue = 255;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / maxDataArrayValue) * canvas.height;
    // const red = (i * barHeight) / 10;
    // const green = i * 4;
    // const blue = barHeight / 4 - 12;

    roundRect(ctx, canvas.width / 2 - firstX, (canvas.height - barHeight) / 2, barWidth / 1.7, barHeight, 30);
    roundRect(ctx, secondX, (canvas.height - barHeight) / 2, barWidth / 1.7, barHeight, 30);

    //ctx.fillRect(canvas.width / 2 - firstX, canvas.height - barHeight, barWidth - 1, barHeight);
    firstX += barWidth;
    //ctx.fillRect(secondX, canvas.height - barHeight, barWidth - 1, barHeight);
    secondX += barWidth;
  }
};

const fixDpi = () => {
  const dpi = window.devicePixelRatio;

  if (canvasRef.value) {
    const height = +getComputedStyle(canvasRef.value).getPropertyValue("height").slice(0, -2);
    //get CSS width
    const width = +getComputedStyle(canvasRef.value).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    canvasRef.value.setAttribute("height", (height * dpi).toString());
    canvasRef.value.setAttribute("width", (width * dpi).toString());
  }
};

const roundRect = function (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width < 2 * radius) {
    radius = width / 2;
  }
  if (height < 2 * radius) {
    radius = height / 2;
  }
  const color = getComputedStyle(document.body).getPropertyValue("--font-color");

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();

  ctx.fill();
};

const setAnalyzer = () => {
  if (props.audioElement && canvasRef.value) {
    const mediaElement = audioCtx.value.createMediaElementSource(props.audioElement);

    analyzer.value = audioCtx.value.createAnalyser();

    mediaElement.connect(analyzer.value);
    analyzer.value.connect(audioCtx.value.destination);

    analyzer.value.smoothingTimeConstant = 0.9;
    analyzer.value.fftSize = 32;

    animate();
  }
};

onMounted(async () => {
  setAnalyzer();
});
</script>

<style scoped>
.audio-canvas {
  height: 100%;
  width: 100%;
}
</style>
