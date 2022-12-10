<template>
  <div :style="`height: ${30}px`">
    <AudioAnalyzer v-if="audioElement" :audioElement="audioElement" />
  </div>
  <div style="color: yellow; height: 20px; width: 300px">
    <span class="mdi mdi-pause" @click="stopAudio"></span>
    <span class="mdi mdi-play" @click="playAudio"></span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

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

    const playAudio = () => {
      props.audioElement?.play();
    };

    return { audioSource, canvasRef, audioRef, stopAudio, playAudio };
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
