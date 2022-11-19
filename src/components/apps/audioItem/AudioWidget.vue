<template>
  <!-- <div id="waveform"></div>
    <div :style="`height: ${height - 80}px; padding: calc(var(--margin)*2) `">
      <AudioAnalyzer v-if="audioSource" :audioElement="audioRef" />
    </div> -->
  <div style="color: yellow; height: 20px; width: 300px">
    <span class="mdi mdi-pause" @click="stopAudio"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

// import AudioAnalyzer from "@/components/apps/audioItem/AudioAnalyzer.vue";

export default defineComponent({
  props: {
    audioElement: Object as PropType<HTMLAudioElement>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const canvasRef = ref<HTMLCanvasElement>();
    const audioRef = ref<HTMLAudioElement>();

    const audioSource = ref();

    const stopAudio = () => {
      props.audioElement?.pause();
    };

    return { audioSource, canvasRef, audioRef, stopAudio };
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
