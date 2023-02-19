import { createApp } from "vue";
import App from "./App.vue";
import { createFilesStructure } from "./context/createInitialFilesStructure";
import router from "./router";
import { createPinia } from "pinia";
import fileSystemConfig from "./context/fileSystemConfiguration";
import { clearIndexedDB } from "./hooks/indexedDB";
import { INDEXED_DB_NAME } from "./constants";
import { clearLocalStorage } from "./hooks/useLocalStorage";

// eslint-disable-next-line
const BrowserFS = require("browserfs");
const pinia = createPinia();

export async function initializeAppAndFileSystem() {
  // Debug mode, TODO: remove it
  clearIndexedDB(INDEXED_DB_NAME);
  clearLocalStorage();

  BrowserFS.install(window);

  BrowserFS.configure(fileSystemConfig, async function (e: any) {
    if (e) {
      // An error occurred.
      console.error("Error in initialization BrowserFS (main.ts):", e);
      throw e;
    }

    (window as any).fs = window.require("fs");
    await createFilesStructure();
    createApp(App).use(pinia).use(router).mount("#app");
  });
}

initializeAppAndFileSystem();
