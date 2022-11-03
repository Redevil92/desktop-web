<template>
  <img v-if="icon" :class="fileIconClasses" :height="height" :src="require(`/src/assets/fileIcons/${icon}`)" alt="" />
  <img
    v-else
    :class="fileIconClasses"
    :height="height"
    :src="require(`/src/assets/fileIcons/${fileExtensionIcon}`)"
    alt=""
  />
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
    noStyle: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  emits: [],
  setup(props, context) {
    const isFolder = ref(false);

    const fileIconClasses = computed(function () {
      if (props.noStyle) {
        return "";
      }
      if (props.selected) {
        return "file-item-selected";
      } else {
        return "invisible-border";
      }
    });

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
      return "file.svg";
    });

    onMounted(async () => {
      if (props.filePath) {
        isFolder.value = await isDir(props.filePath);
      }
    });

    return {
      fileExtensionIcon,
      fileIconClasses,
    };
  },
});
</script>
<style scoped>
.invisible-border {
  border: 3px solid rgba(195, 195, 195, 0);
  padding: 3px;
}

.file-item-selected {
  border: 3px solid rgb(195, 195, 195);
  border-radius: 3px;
  padding: 3px;
  background-color: rgba(214, 214, 214, 0.553);
}
</style>
