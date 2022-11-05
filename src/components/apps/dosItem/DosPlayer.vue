<template>
  <div :style="`height: ${height}px; width: calc(100% -4px); `">
    <iframe :style="`height: 100%; width: 100%; `" frameborder="0" :src="gameLink" allowfullscreen> </iframe>
  </div>
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { defineComponent, PropType } from "vue";
import { dosGames } from "@/components/apps/dosItem/DosGamesLink";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    let gameLink = "";
    if (props.itemDialog?.name) {
      gameLink = dosGames[props.itemDialog.name];
    }

    return { gameLink };
  },
});
</script>

<style scoped></style>
