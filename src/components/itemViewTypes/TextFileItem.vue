<template>
  <div :style="`height: ${height - 5}px; width: ${itemDialog.dimension.width - 4}px; `">
    <editor
      class="mce-editor"
      v-if="height"
      api-key="yxb2ealwgpgr85gcgcl311khnyuz4abs13akcuyqscr4y6fr"
      :init="{
        plugins: 'lists link image table code help wordcount',
        height: '100%',
        resize: false,
      }"
    />
  </div>
</template>

<script lang="ts">
//   :init="{
//     max_height: height - 14,
//     min_height: height - 14,

//     menubar: false,
//     plugins: ['autoresize', 'lists link image table code help wordcount'],
//     toolbar:
//       'undo redo | formatselect | bold italic backcolor | \
//        alignleft aligncenter alignright alignjustify | \
//        bullist numlist outdent indent | removeformat | help',
//   }"

import { defineComponent, PropType, ref, watch } from "vue";

import ItemDialog from "@/models/ItemDialog";

import Editor from "@tinymce/tinymce-vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: {
      type: Number,
      default: 100,
    },
  },
  components: { Editor },
  emits: [],
  setup(props, _) {
    const index = ref(0);
    watch(
      () => props.height,
      function (val, oldValue) {
        index.value += index.value + 1;
        console.log(`NEW VALUE: ${val} ///// OLD COUNT: ${oldValue}`);
      }
    );
    return { index };
  },
});
</script>

<style scoped>
.mce-editor + div {
  border: 5px solid red;
}

.mce-editor div div {
  border: 5px solid red;
}
</style>
