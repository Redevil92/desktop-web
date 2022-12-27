<template>
  <div class="left-panel" v-if="favouritesPathList">
    <div class="title-text">Favourites</div>

    <div
      v-for="favourite in favouritesPathList"
      class="favourite-item"
      :class="pathSelected === favourite.path ? 'favourite-item-selected' : ''"
      :key="'favourite-' + favourite"
      @click="clickFavouriteHandler(favourite.path)"
    >
      <span :class="`mdi ${favourite.mdiIcon}  favourite-icon`"></span>
      <span class="medium-font"> {{ getFileNameFromPath(favourite.path) }}</span>
    </div>
    <div class="title-text">Cloud</div>
    <div class="favourite-item">
      <span :class="`mdi mdi-cloud mdi-18 favourite-icon`"></span>
      <span class="medium-font">Share folder </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import { getFileNameFromPath } from "@/context/fileSystemUtils";
import { useSettingsStore } from "@/stores/settingsStore";
import PathAndIcon from "@/models/PathAndIcon";

export default defineComponent({
  props: { pathSelected: { type: String, default: "" } },
  components: {},
  emits: ["closeDialog", "saveItem", "onFavouriteSelect"],
  setup(_, ctx) {
    const settingsStore = useSettingsStore();

    const favouritesPathList = computed(() => {
      return settingsStore.favouritesPathListAndIcon as PathAndIcon[];
    });

    const clickFavouriteHandler = (path: string) => {
      ctx.emit("onFavouriteSelect", path);
    };

    return {
      favouritesPathList,
      getFileNameFromPath,
      clickFavouriteHandler,
    };
  },
});
</script>
<style scoped>
.left-panel {
  width: 150px;
  border-right: 1px solid rgb(67, 67, 67);
  text-align: left;
  height: 570px;
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  background-color: var(--background-color_contrast);
}

.medium-font {
  font-size: var(--medium-font-size);
  margin-left: var(--margin);
}

.flex {
  display: flex;
  align-items: center;
}

.title-text {
  font-size: var(--medium-font-size);
  font-weight: 600;
  margin-top: calc(var(--margin) * 2);
  margin-left: calc(var(--margin) * 2);
  opacity: 0.6;
  text-align: left;
}

.favourite-item {
  font-size: var(--large-font-size);
  margin: 5px var(--margin);
  padding: 3px var(--margin);
}

.favourite-item:hover,
.favourite-item-selected {
  background-color: var(--neutral-color_background);
  border-radius: calc(var(--border-radius) / 2);
}

.favourite-icon {
  color: var(--selected-color_light);
}
</style>
