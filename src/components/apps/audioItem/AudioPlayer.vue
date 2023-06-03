<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `" style="position: relative">
    <div id="waveform"></div>
    <div :style="`height: ${height - 80}px; padding: calc(var(--margin)*2) `">
      <AudioAnalyzer v-if="audioSource" :audioElement="audioRef" />
    </div>
    <audio autoplay class="audio-controls" id="audio" controls ref="audioRef" :src="audioSource"></audio>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from "vue";
import ItemDialog from "@/models/ItemDialog";
import fileSystem from "@/context/fileSystemController";

import AudioAnalyzer from "@/components/apps/audioItem/AudioAnalyzer.vue";
import { useDynamicIslandStore } from "@/stores/dynamicIslandStore";
import { DynamicIslandAudioItem } from "@/models/DynamicIslandItem";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

const dynamicIslandStore = useDynamicIslandStore();

const audioRef = ref<HTMLAudioElement>();

const audioSource = ref();

watch(
  () => props.itemDialog?.isCollapsed,
  async function (newValue: boolean | undefined, oldValue: boolean | undefined) {
    if (newValue) {
      //SET DYNAMIC ISLAND
      const dynamicIslandItem: DynamicIslandAudioItem = {
        componentPath: "audioItem/AudioWidget.vue",
        itemDialogGuid: props.itemDialog?.guid || "",
        audioElement: audioRef.value as HTMLAudioElement,
      };
      dynamicIslandStore.addDynamicIslandItem(dynamicIslandItem);
    } else {
      //CLOSE DYNAMIC ISLAND if any
      dynamicIslandStore.removeDynamicIslandItem(props.itemDialog?.guid || "");
    }
  }
);

onMounted(async () => {
  if (props.itemDialog?.path) {
    const audioData = await fileSystem.readFile(props.itemDialog?.path);
    audioSource.value = audioData;
  }
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
