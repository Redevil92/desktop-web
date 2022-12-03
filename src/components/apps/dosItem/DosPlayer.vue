<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 4" />
    <iframe
      class="frame"
      :height="height - 4"
      :width="itemDialog.dimension.width - 4"
      title="dos-player"
      :src="gameLink"
    />
  </div>
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";

import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";

import { defineComponent, PropType } from "vue";
import { dosGameLinks } from "@/components/apps/dosItem/DosGames";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  components: { IFrameFocuser },
  emits: [],
  setup(props, _) {
    let gameLink = "";
    if (props.itemDialog?.name) {
      props.itemDialog.isFocused;
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
