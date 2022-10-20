import { createApp } from "vue";
import App from "./App.vue";
import { createFilesStructure } from "./context/fileSystemUtils";
import router from "./router";
import { createPinia } from "pinia";

// eslint-disable-next-line
const BrowserFS = require("browserfs");
const pinia = createPinia();

export async function initializeAppAndFileSystem() {
  BrowserFS.install(window);

  BrowserFS.configure(
    {
      fs: "IndexedDB",
      // options: {
      //   "/": { fs: "IndexedDB" },
      //   "/tmp": { fs: "InMemory" },
      //   storeName: "mydata",
      // },
      options: { storeName: "storeName" },
    },
    async function (e: any) {
      if (e) {
        // An error occurred.
        // SHOW SOME ERRORS
        console.error("Error in initialization BrowserFS (main.ts):", e);
        throw e;
      }

      (window as any).fs = window.require("fs");
      createFilesStructure();
      createApp(App).use(pinia).use(router).mount("#app");
    }
  );
}

initializeAppAndFileSystem();
