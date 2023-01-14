<template>
  <div :style="`height: ${30}px`">
    <AudioAnalyzer v-if="audioElement" :audioElement="audioElement" />
  </div>
  <div style="color: yellow; height: 20px; width: 300px">
    <span class="mdi mdi-pause" @click="stopAudio"></span>
    <span class="mdi mdi-play" @click="playAudio"></span>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

const props = defineProps({ audioElement: Object as PropType<HTMLAudioElement> });

const stopAudio = () => {
  props.audioElement?.pause();
};

const playAudio = () => {
  props.audioElement?.play();
};
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
