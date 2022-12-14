<template>
  <div :style="`height: ${height - 14}px; width: calc(100% -4px); `">HI MSN</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, PropType } from "vue";

import ItemDialog from "@/models/ItemDialog";
import * as fflate from "fflate";
import { readFile } from "@/context/fileSystemController";
import useBase64Handler from "@/hooks/useBase64Handler";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    const { removeDataUri, b64ToText, isBase64, utf8ToB64 } = useBase64Handler();

    onBeforeMount(async () => {
      if (props.itemDialog?.path) {
        let compressed = await readFile(props.itemDialog?.path);
        console.log("IS BASE64", isBase64(removeDataUri(compressed)));
        //let buf = fflate.strToU8(compressed);
        // const buf = Buffer.from(removeDataUri(compressed));

        let buf = Buffer.from(removeDataUri(compressed), "base64");
        console.log("BUF", buf);

        const decompressed = fflate.unzip(buf, (error, data) => (error ? console.error(error) : console.log(data)));

        console.log("dec", decompressed);
      }
    });

    return {};
  },
});
</script>

<style scoped></style>
