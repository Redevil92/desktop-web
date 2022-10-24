<template>
  <div class="browser-controls" :style="`height: ${navigationBarHeight}px`">
    <div class="browser-input">
      <BaseInput v-model="inputUrl" @onKeyDown="keyDownHandler" @onBlur="blurHandler" rounded></BaseInput>
    </div>
  </div>
  <div style="color: white">{{ browserUrl }}</div>
  <iframe
    :src="browserUrl"
    ref="iframeRef"
    title="{ id }"
    :style="`height: ${height - navigationBarHeight - 20}px; width: ${itemDialog.dimension.width - 4}px; `"
  />
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { defineComponent, PropType, ref } from "vue";

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

    const favicon = ref<HTMLImageElement>();

    const { canGoBack, canGoForward, history, moveHistory, position } = useHistory(browserUrl.value, "");

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        browserUrl.value = (event.target as any).value;
        //findAndLoadFavicon();
      }
    };

    // const findAndLoadFavicon = (url: string) => {
    //   const faviconUrl = `${new URL(url).origin}/favicon.ico`;
    // };

    const blurHandler = () => {
      inputUrl.value = browserUrl.value;
    };

    // const setUrl = useCallback(
    //   async (addressInput: string): Promise<void> => {
    //     const { contentWindow } = iframeRef.current || {};

    //     if (contentWindow?.location) {
    //       const isHtml = extname(addressInput).toLowerCase() === ".html" && (await exists(addressInput));

    //       setLoading(true);
    //       setSrcDoc("");
    //       if (isHtml) setSrcDoc((await readFile(addressInput)).toString());
    //       setIcon(id, processDirectory["Browser"].icon);

    //       if (!isHtml) {
    //         const addressUrl = getUrlOrSearch(addressInput);

    //         contentWindow.location.replace(addressUrl);

    //         if (addressUrl.startsWith(GOOGLE_SEARCH_QUERY)) {
    //           prependFileToTitle(`${addressInput} - Google Search`);
    //         } else {
    //           const { name = "" } = bookmarks?.find(({ url: bookmarkUrl }) => bookmarkUrl === addressInput) || {};

    //           prependFileToTitle(name);
    //         }

    //         const favicon = new Image();
    //         const faviconUrl = `${new URL(addressUrl).origin}/favicon.ico`;

    //         favicon.addEventListener(
    //           "error",
    //           () => {
    //             const { icon } = bookmarks?.find(({ url: bookmarkUrl }) => bookmarkUrl === addressUrl) || {};

    //             if (icon) setIcon(id, icon);
    //           },
    //           ONE_TIME_PASSIVE_EVENT
    //         );
    //         favicon.addEventListener("load", () => setIcon(id, faviconUrl), ONE_TIME_PASSIVE_EVENT);
    //         favicon.src = faviconUrl;
    //       }
    //     }
    //   },
    //   [exists, id, prependFileToTitle, readFile, setIcon]
    // );

    return { navigationBarHeight, iFrameRef, browserUrl, inputUrl, keyDownHandler, blurHandler };
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
  margin-left: var(--margin);
}
</style>
