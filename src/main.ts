import { createApp } from 'vue';
import App from './App.vue';
import { createFilesStructure } from './context/seeding/createInitialFilesStructure';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import browserFSConfiguration from './browserFSConfiguration';
import { clearIndexedDB } from './hooks/indexedDB';
import { INDEXED_DB_NAME } from './constants';
import { clearLocalStorage } from './hooks/useLocalStorage';
import { configure, BFSRequire } from 'browserfs';

// eslint-disable-next-line
//const BrowserFS = require('browserfs')

const fs = BFSRequire('fs');

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export async function initializeAppAndFileSystem() {
  if (import.meta.env.VITE_DEBUG_MODE === `true`) {
    clearIndexedDB(INDEXED_DB_NAME);
    clearLocalStorage();
  }

  //BrowserFS.install(window)

  await configure(browserFSConfiguration, async function (e: any) {
    if (e) {
      // An error occurred.
      console.error('Error in initialization BrowserFS (main.ts):', e);
      throw e;
    }

    //window.fs = window.require('fs')
    await createFilesStructure();
    createApp(App).use(pinia).use(router).mount('#app');
  });
}

initializeAppAndFileSystem();
