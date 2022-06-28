// eslint-disable-next-line
const BrowserFS = require("browserfs");

export function initializeFileSystem() {
  BrowserFS.install(window);

  BrowserFS.configure(
    {
      fs: "LocalStorage",
    },
    function (e: any) {
      if (e) {
        // An error happened!
        throw e;
      }
      // Otherwise, BrowserFS is ready-to-use!
      (window as any).fs = window.require("fs");
    }
  );
}
