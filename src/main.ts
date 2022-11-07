import { createApp } from "vue";
import App from "./App.vue";
import { createFilesStructure } from "./context/fileSystemUtils";
import router from "./router";
import { createPinia } from "pinia";
import fileSystemConfig from "./context/fileSystemConfiguration";

// eslint-disable-next-line
const BrowserFS = require("browserfs");
const pinia = createPinia();

export async function initializeAppAndFileSystem() {
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
