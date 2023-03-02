<template>
  <div v-if="isLinkFile && filePath && linkIcon" style="position: relative">
    <img :class="fileIconClasses" :height="height" :src="linkIcon" alt="" />
    <div class="link-icon-container" v-if="height > 50">
      <span class="mdi mdi-arrow-top-right-thin"></span>
    </div>
  </div>

  <img
    v-else-if="icon"
    :class="fileIconClasses"
    :height="height"
    :src="require(`/src/assets/fileIcons/${icon}`)"
    alt=""
  />

  <img
    v-else
    :class="fileIconClasses"
    :height="height"
    :src="require(`/src/assets/fileIcons/${fileExtensionIcon}`)"
    alt=""
  />
</template>

<script lang="ts" setup>
import { isDir, readFile } from "@/context/fileSystemController";
import { getFileExtensionFromName } from "@/context/fileSystemUtils";
import fileTypesConfiguration from "@/models/FilesType";
import LinkData from "@/models/LinkData";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";

const props = defineProps({
  height: {
    type: Number,
    required: true,
  },
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
});

const isFolder = ref(false);
const linkIcon = ref<string | null>(null);

watch(
  () => props.filePath,
  async function () {
    if (props.filePath) {
      isFolder.value = await isDir(props.filePath);
    }
  }
);

const getLinkFileIcon = async () => {
  if (props.filePath) {
    const linkData: LinkData = JSON.parse(await readFile(props.filePath));

    if (linkData.filePath) {
      console.log(linkData.filePath);

      const iconFromPath = await getFileIconFromPath(linkData.filePath);
      return require(`/src/assets/fileIcons/${iconFromPath}`);
    } else if (linkData.applicationToOpen) {
      const fileTypeConfig = fileTypesConfiguration[linkData.applicationToOpen];

      return require(`/src/assets/fileIcons/${fileTypeConfig.icon}`);
    }
  }
  return "file.svg";
};

const isLinkFile = computed(function () {
  return getFileExtensionFromName(props.filePath || "") === "lnk";
});

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

const getFileIconFromPath = async (path: string) => {
  if (path) {
    const isPathDir = await isDir(path);
    if (isPathDir) {
      return "folder.svg";
    }

    const fileTypeConfiguration = fileTypesConfiguration[getFileExtensionFromName(path)];
    if (fileTypeConfiguration && fileTypeConfiguration.icon) {
      return fileTypeConfiguration.icon;
    }
  }
  return "file.svg";
};

onBeforeMount(async () => {
  if (isLinkFile.value) {
    linkIcon.value = await getLinkFileIcon();
  }
});
onMounted(async () => {
  if (props.filePath) {
    isFolder.value = await isDir(props.filePath);
  }
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

.link-icon-container {
  position: absolute;
  border: 1px solid var(--primary-color_darker);
  background-color: white;
  bottom: 0px;
  left: 20px;
  height: 15px;
  width: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
