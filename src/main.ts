import { createApp } from "vue";
import App from "./App.vue";
import { createFilesStructure } from "./context/seeding/createInitialFilesStructure";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import browserFSConfiguration from "./browserFSConfiguration";
import { clearIndexedDB } from "./hooks/indexedDB";
import { DEBUG_MODE, INDEXED_DB_NAME } from "./constants";
import { clearLocalStorage } from "./hooks/useLocalStorage";

// eslint-disable-next-line
const BrowserFS = require("browserfs");
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export async function initializeAppAndFileSystem() {
  if (DEBUG_MODE) {
    clearIndexedDB(INDEXED_DB_NAME);
    clearLocalStorage();
  }

  BrowserFS.install(window);

  BrowserFS.configure(browserFSConfiguration, async function (e: any) {
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
