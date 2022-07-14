import { createApp } from "vue";
import App from "./App.vue";
import { initializeFileSystem } from "./context/fileSystem";
import { createDirectory, createFile, initializeFiles } from "./context/fileSystemController";
import router from "./router";
import store from "./store";

// eslint-disable-next-line
initializeFileSystem();

setTimeout(() => {
  initializeFiles();
}, 600);

createApp(App).use(store).use(router).mount("#app");
