<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `" style="position: relative">
    <div id="waveform"></div>
    <div :style="`height: ${height - 80}px; padding: calc(var(--margin)*2) `">
      <AudioAnalyzer v-if="audioSource" :audioElement="audioRef" />
    </div>
    <AudioWidget :audioElement="audioRef" />
    <audio autoplay class="audio-controls" id="audio" controls ref="audioRef" :src="audioSource"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import ItemDialog from "@/models/ItemDialog";
import { readFile } from "@/context/fileSystemController";

import AudioAnalyzer from "@/components/apps/audioItem/AudioAnalyzer.vue";
import AudioWidget from "@/components/apps/audioItem/AudioWidget.vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { AudioAnalyzer, AudioWidget },
  emits: [],
  setup(props, _) {
    const audioRef = ref<HTMLAudioElement>();

    const audioSource = ref();

    watch(
      () => props.itemDialog?.isCollapsed,
      async function (newValue: any, oldValue: any) {
        if (newValue) {
          //SET DYNAMIC ISLAND
        } else {
          //CLOSE DYNAMIC ISLAND
        }
      }
    );

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

    return { audioSource, audioRef };
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
