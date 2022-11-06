<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <iframe class="frame" :height="height - 4" :width="itemDialog.dimension.width - 4" frameborder="0" :src="gameLink">
    </iframe>
  </div>
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { defineComponent, PropType } from "vue";
import { dosGameLinks } from "@/components/apps/dosItem/DosGames";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: {},
  emits: [],
  setup(props, _) {
    let gameLink = "";
    if (props.itemDialog?.name) {
      gameLink = dosGameLinks[props.itemDialog.name];
    }

    return { gameLink };
  },
});
</script>

<style scoped>
.frame {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style>
