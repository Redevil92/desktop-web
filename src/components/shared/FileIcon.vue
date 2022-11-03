<template>
  <img v-if="icon" :height="height" :src="require(`/src/assets/fileIcons/${icon}`)" alt="" />
  <img v-else :height="height" :src="require(`/src/assets/fileIcons/${fileExtensionIcon}`)" alt="" />
</template>

<script lang="ts">
import { isDir } from "@/context/fileSystemController";
import { getFileExtensionFromName } from "@/context/fileSystemUtils";
import fileTypesConfiguration from "@/models/FilesType";
import { computed, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    height: Number,
    // if icon use it, otherwise find the icon with filePath
    icon: {
      type: String,
      required: false,
    },
    filePath: {
      type: String,
      required: false,
    },
  },
  components: {},
  emits: [],
  setup(props, context) {
    const isFolder = ref(false);

    const fileExtensionIcon = computed(function () {
      if (props.filePath) {
        if (isFolder.value) {
          return "folder.svg";
        }

        const fileTypeConfiguration = fileTypesConfiguration[getFileExtensionFromName(props.filePath)];
        if (fileTypeConfiguration && fileTypeConfiguration.icon) {
          return fileTypeConfiguration.icon;
        }
      }
      return "unknow.svg";
    });

    onMounted(async () => {
      if (props.filePath) {
        isFolder.value = await isDir(props.filePath);
      }
    });

    return {
      fileExtensionIcon,
    };
  },
});
</script>
<style scoped></style>
