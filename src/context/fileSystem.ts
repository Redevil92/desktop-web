// eslint-disable-next-line
const BrowserFS = require("browserfs");

export function initializeFileSystem() {
  BrowserFS.install(window);
  // BrowserFS.configure(
  //   {
  //     fs: "MountableFileSystem",
  //   },
  //   function (e: any) {
  //     if (e) {
  //       // An error happened!
  //       throw e;
  //     }
  //     // Otherwise, BrowserFS is ready-to-use!
  //     (window as any).fs = window.require("fs");
  //   }
  // );

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
    function (e: any) {
      if (e) {
        // An error occurred.
        throw e;
      }
      (window as any).fs = window.require("fs");
      // Otherwise, BrowserFS is ready to use!
    }
  );
}
