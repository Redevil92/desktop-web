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
  </div>

  <iframe
    :src="browserUrl"
    ref="iframeRef"
    title="{ id }"
    :style="`height: ${height - navigationBarHeight}px; width: ${itemDialog.dimension.width - 4}px; `"
  />
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { computed, defineComponent, PropType, ref } from "vue";

import BaseInput from "@/components/shared/BaseInput.vue";

import useHistory from "@/hooks/useHistory";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
    height: Number,
  },
  emits: [],
  components: { BaseInput },
  setup(props, _) {
    const navigationBarHeight = ref(35);
    const browserUrl = ref("https://www.google.com/webhp?igu=1");
    const inputUrl = ref(browserUrl.value);
    const iFrameRef = ref<HTMLElement>();
    const position = ref(0);
    const history = ref([browserUrl.value]);

    const canGoBack = computed(() => {
      return position.value > 0;
    });

    const canGoForward = computed(() => {
      return position.value < history.value.length - 1;
    });

    // const favicon = ref<HTMLImageElement>(); // TODO, for the future

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setNewUrl((event.target as any).value);
      }
    };

    const blurHandler = () => {
      inputUrl.value = browserUrl.value;
    };

    const refreshPage = () => {
      inputUrl.value = "";
      inputUrl.value = browserUrl.value;
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

    return {
      navigationBarHeight,
      iFrameRef,
      browserUrl,
      inputUrl,
      keyDownHandler,
      blurHandler,
      canGoBack,
      canGoForward,
      position,
      refreshPage,
      changeHistory,
    };
  },
});
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
}

.icons-list {
  display: flex;
  align-content: center;
  justify-content: center;
  margin: 0px var(--margin);
}

.control-icon,
.control-icon-disabled {
  /* margin: 0px calc(var(--margin) / 2);
  padding: 0px calc(var(--margin) / 2); */
  font-size: 20px;

  height: 26px;
  width: 26px;
  display: flex;
  justify-content: center;
  margin-right: var(--margin);
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
</style>
