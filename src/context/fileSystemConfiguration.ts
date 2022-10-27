import { FileSystemConfiguration } from "browserfs/dist/node/core/browserfs";

const fileSystemConfig: FileSystemConfiguration = {
  fs: "MountableFileSystem",
  options: {
    fs: "IndexedDB",
    // options: {
    //   "/": { fs: "IndexedDB" },
    //   "/tmp": { fs: "InMemory" },
    //   storeName: "mydata",
    // },
    options: { storeName: "storeName" },
  },
};

export default fileSystemConfig;
