<template>
  <div>
    <div class="flex folder-actions"></div>

    FOLDER VIEW
    {{ items }}

    <!-- GET ALL ELEMENTS -->
    <div class="footer"></div>
  </div>
</template>

<script lang="ts">
import Item from "@/models/Item";

import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    items: Array as PropType<Item[]>,
  },
  components: {},
  emits: [],
  setup(props, _) {
    return {};
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}

.folder-actions {
  background-color: rgb(25, 25, 25);
  height: 43px;
}

.action-icon:hover {
  background-color: rgb(33, 33, 33);
  color: white;
}

.footer {
  position: absolute;
  height: 20px;

  background-color: rgb(25, 25, 25);
  bottom: 0px;
  width: inherit;
  text-align: start;
  width: -webkit-fill-available;
}

.footer-text {
  color: white;
  font-size: var(--small-font-size);
  text-align: start;
  margin-left: 5px;
}
</style>
