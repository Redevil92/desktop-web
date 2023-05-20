<template>
  <div class="browser-controls" :style="`height: ${navigationBarHeight}px`">
    <div class="icons-list" style="color: white">
      <div
        :class="{ 'control-icon-disabled': !canGoBack, 'control-icon': canGoBack }"
        @click="canGoBack ? changeHistory(-1) : ''"
      >
        <span class="mdi mdi-arrow-left"></span>
      </div>
      <div
        :class="{ 'control-icon-disabled': !canGoForward, 'control-icon': canGoForward }"
        @click="canGoForward ? changeHistory(+1) : ''"
      >
        <span class="mdi mdi-arrow-right"></span>
      </div>
      <div class="control-icon" @click="refreshPage">
        <span class="mdi mdi-refresh"></span>
      </div>
    </div>
    <div class="browser-input">
      <BaseInput v-model="inputUrl" @onKeyDown="keyDownHandler" @onBlur="blurHandler" rounded></BaseInput>
    </div>
    <div v-for="shortcut in shortCuts" :key="shortcut.url + '-icon'">
      <div class="control-icon shortcut-icon" @click="setNewUrl(shortcut.url)">
        <span :class="`mdi ${shortcut.icon}`"></span>
      </div>
    </div>
  </div>
  <IFrameFocuser v-if="!itemDialog.isFocused" :height="height - 4" />
  <iframe
    :src="browserUrl"
    ref="iFrameRef"
    title="{ id }"
    :style="`height: ${height - navigationBarHeight - 8}px; width: calc(100% - 4px); `"
  />
</template>

<script lang="ts" setup>
import ItemDialog from "@/models/ItemDialog";
import { computed, IframeHTMLAttributes, PropType, ref } from "vue";

import BaseInput from "@/components/shared/BaseInput.vue";
import IFrameFocuser from "@/components/shared/IFrameFocuser.vue";
import { useFileSystemStore } from "@/stores/fileSystemStore";

const props = defineProps({
  itemDialog: { type: Object as PropType<ItemDialog>, required: true },
  height: { type: Number, required: true },
});

const navigationBarHeight = ref(40);
const browserUrl = ref("https://www.google.com/webhp?igu=1");
const inputUrl = ref(browserUrl.value);
const iFrameRef = ref<IframeHTMLAttributes>();
const position = ref(0);
const history = ref([browserUrl.value]);
const shortCuts = [
  { url: "https://www.google.com/webhp?igu=1", icon: "mdi-google" },
  { url: "https://en.wikipedia.org/wiki/Main_Page", icon: "mdi-wikipedia" },
  { url: "https://www.google.com/intl/it/gmail/about/", icon: "mdi-gmail" },
];

const fileSystemStore = useFileSystemStore();

const canGoBack = computed(() => {
  return position.value > 0;
});

const canGoForward = computed(() => {
  return position.value < history.value.length - 1;
});

// const favicon = ref<HTMLImageElement>(); // TODO, for the future

const keyDownHandler = (event: KeyboardEvent) => {
  if (event.key === "Enter" && event.target) {
    setNewUrl((event.target as HTMLInputElement).value);
  }
};

const blurHandler = () => {
  inputUrl.value = browserUrl.value;
};

const refreshPage = () => {
  if (iFrameRef.value) {
    iFrameRef.value.src = browserUrl.value;
  }
};

const changeHistory = (step: number) => {
  position.value += step;
  browserUrl.value = history.value[position.value];
  inputUrl.value = history.value[position.value];
};

const setNewUrl = (newUrl: string) => {
  browserUrl.value = newUrl;
  inputUrl.value = newUrl;

  if (newUrl !== history.value[history.value.length]) {
    history.value = [...history.value.slice(0, position.value + 1), newUrl];
    position.value += 1;
  }
};
</script>

<style scoped>
iframe {
  overflow: scroll;
  border: 0px;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.browser-controls {
  display: flex;
  align-items: center;
}

.browser-input {
  width: 300px;
  margin-right: 15px;
}

.icons-list {
  display: flex;
  align-content: center;
  justify-content: center;
  margin: 0px var(--margin);
}

.control-icon,
.control-icon-disabled {
  font-size: 20px;
  height: 26px;
  width: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: var(--margin);
}

.shortcut-icon {
  margin-left: 5px;
  margin-right: 0px;
}

.control-icon {
  cursor: pointer;
}

.control-icon > span {
  color: var(--font-color);
}

.control-icon-disabled > span {
  color: var(--neutral-color);
}

.control-icon:hover {
  background-color: var(--neutral-color_background);
  border-radius: calc(var(--border-radius) * 3);
}

.shortcut-icon {
  font-size: 17px;
}
</style>
