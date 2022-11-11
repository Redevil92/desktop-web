<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    HELLO
    <audio controls ref="audioPlayer" :src="audioSource"></audio>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, PropType, ref } from "vue";

import ItemDialog from "@/models/ItemDialog";

import { readFile } from "@/context/fileSystemController";

import useBase64Handler from "@/hooks/useBase64Handler";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const fileSystemStore = useFileSystemStore();
    const { b64ToText, utf8ToB64 } = useBase64Handler();
    const audioSource = ref("");

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        const audioData = await readFile(props.itemDialog?.path);
        console.log(audioData);

        //audioSource.value = b64ToText(audioData, true);
        audioSource.value = audioData;
      }
    });

    return { audioSource };
  },
});
</script>

<style scoped></style>
