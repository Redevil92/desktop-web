// // eslint-disable-next-line
// const BrowserFS = require("browserfs");

import store from "@/store";
import { testCreateFiles } from "./fileSystemController";

// export function initializeFileSystem() {
//   window.localStorage.clear();
//   BrowserFS.install(window);

//   BrowserFS.configure(
//     {
//       fs: "LocalStorage",
//     },
//     function (e: any) {
//       if (e) {
//         // An error happened!
//         throw e;
//       }
//       // Otherwise, BrowserFS is ready-to-use!
//       (window as any).fs = window.require("fs");
//     }
//   );
// }

// ******TEST******

// eslint-disable-next-line
const BrowserFS = require("browserfs");

export function initializeFileSystem() {
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
        throw e;
      }

      (window as any).fs = window.require("fs");
      testCreateFiles();
      // Otherwise, BrowserFS is ready to use!
    }
  );
}
