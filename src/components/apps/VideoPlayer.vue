<template>
  <div
    ref="player"
    :style="` height: ${height - 4}px; background-color:black; border-radius:var(--border-radius)`"
  ></div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref, reactive, nextTick } from "vue";
import Artplayer from "artplayer";
import ItemDialog from "@/models/ItemDialog";
import fileSystem from "@/context/fileSystemController";

const props = defineProps({
  itemDialog: Object as PropType<ItemDialog>,
  height: { type: Number, required: true },
});

const player = ref<any>(null);
const options = reactive({
  url: "https://artplayer.org/assets/sample/video.mp4",
  title: "Your Name",
  poster: "/assets/sample/poster.jpg",
  volume: 0.5,
  isLive: false,
  muted: false,
  autoplay: false,
  pip: true,
  autoSize: true,
  autoMini: true,
  screenshot: true,
  setting: true,
  loop: true,
  flip: true,
  playbackRate: true,
  aspectRatio: true,
  fullscreen: true,
  fullscreenWeb: true,
  subtitleOffset: true,
  miniProgressBar: true,
  mutex: true,
  backdrop: true,
  playsInline: true,
  autoPlayback: true,
  airplay: true,
  theme: "#23ade5",
  lang: navigator.language.toLowerCase(),
  whitelist: ["*"],
  moreVideoAttr: {
    crossOrigin: "anonymous",
  },
});

onMounted(async () => {
  nextTick(async () => {
    if (player.value && props.itemDialog) {
      const videoData = await fileSystem.readFile(props.itemDialog?.path);
      options.url = videoData;

      new Artplayer({
        ...options,
        container: player.value,
      } as any);
    }
  });
});
</script>
