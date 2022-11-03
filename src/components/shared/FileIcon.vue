<template>
  <img v-if="icon" :height="height" :src="require(`/src/assets/fileIcons/${icon}`)" alt="" />
  <img
    v-else-if="isKnownFileExtension"
    :height="height"
    :src="require(`/src/assets/fileIcons/${fileExtension}.svg`)"
    alt=""
  />
  <img v-else :height="height" :src="require('/src/assets/fileIcons/unknow.svg')" alt="" />
</template>

<script lang="ts">
import fileTypesConfiguration from "@/models/FilesType";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    height: Number,
    icon: {
      type: String,
      required: false,
    },
    fileExtension: {
      type: String,
      required: false,
    },
  },
  components: {},
  emits: [],
  setup(props, context) {
    const isKnownFileExtension = computed(function () {
      if (props.fileExtension) {
        const fileTypeConfiguration = fileTypesConfiguration[props.fileExtension];
        if (fileTypeConfiguration.icon) {
          return true;
        }
      }
      return false;
    });

    return {
      isKnownFileExtension,
    };
  },
});
</script>
<style scoped></style>
