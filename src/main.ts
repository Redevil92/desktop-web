import { createApp } from "vue";
import App from "./App.vue";
import { testCreateFiles } from "./context/fileSystemUtils";
import router from "./router";
import store from "./store";

// eslint-disable-next-line
const BrowserFS = require("browserfs");

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
      testCreateFiles();
      createApp(App).use(store).use(router).mount("#app");
    }
  );
}

initializeAppAndFileSystem();
