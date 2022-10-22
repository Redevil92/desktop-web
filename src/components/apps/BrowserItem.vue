<template>
  <div :style="`height: ${navigationBarHeight}px`"></div>

  <iframe
    :src="'https://www.google.com/webhp?igu=1'"
    title="{ id }"
    :style="`height: ${itemDialog.dimension.height - 14 - navigationBarHeight - 20}px; width: ${
      itemDialog.dimension.width - 4
    }px; `"
  />
</template>

<script lang="ts">
import ItemDialog from "@/models/ItemDialog";
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    itemDialog: Object as PropType<ItemDialog>,
  },
  emits: [],
  setup(props, _) {
    const navigationBarHeight = ref(30);
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

    return { navigationBarHeight };
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
</style>
