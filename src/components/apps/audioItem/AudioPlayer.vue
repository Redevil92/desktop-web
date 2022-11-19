<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `" style="position: relative">
    <div id="waveform"></div>
    <div :style="`height: ${height - 80}px; padding: calc(var(--margin)*2) `">
      <AudioAnalyzer v-if="audioSource" :audioElement="audioRef" />
    </div>

    <audio autoplay class="audio-controls" id="audio" controls ref="audioRef" :src="audioSource"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

import AudioAnalyzer from "@/components/apps/audioItem/AudioAnalyzer.vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { AudioAnalyzer },
  emits: [],
  setup(props, _) {
    const canvasRef = ref<HTMLCanvasElement>();
    const audioRef = ref<HTMLAudioElement>();

    const audioSource = ref();

    onMounted(async () => {
      if (props.itemDialog?.path) {
        const audioData = await readFile(props.itemDialog?.path);
        audioSource.value = audioData;
      }

      //   console.log("DDD", audioSource.value);
      //   const file = await urltoFile(audioSource.value, "test");
      //   console.log("FILE", file);

      //   window.jsmediatags.read(file, {
      //     onSuccess: function (tag: any) {
      //       console.log("HEY", tag);
      //     },
      //     onError: function (error: any) {
      //       console.log("ERR", error);
      //     },
      //   });
    });

    return { audioSource, canvasRef, audioRef };
  },
});
</script>

<style scoped>
.audio-controls {
  position: absolute;
  bottom: calc(var(--margin) * 2);
  width: calc(100% - calc(var(--margin) * 4));
  left: 0px;
  margin: 0px calc(var(--margin) * 2);
}
</style>
