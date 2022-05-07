import FS from "@/models/FileSystem";
import Directory, { DIRECTORY_TYPE } from "@/models/Directory";
import _ from "lodash";
import FileItem from "@/models/FileItem";
import Item from "@/models/Item";

export default {
  namespaced: true,
  state(): FileSystemState {
    return {
      fileSystem: {} as FS,
    };
  },
  mutations: {
    INITIALIZE_FILE_SYSTEM: (state: FileSystemState, fileSystem: FS) => {
      state.fileSystem = fileSystem;
    },
    // CREATE_DIRECTORY: (state: FileSystemState, directory: Directory) => {
    //   state.fileSystem.currentDirectory.children.push(directory);
    //   state.fileSystem = Object.assign({}, state.fileSystem);
    // },
    CREATE_FILE: (state: FileSystemState, fileItem: Item) => {
      state.fileSystem.currentDirectory.children.push(fileItem);
      state.fileSystem = Object.assign({}, state.fileSystem);
    },
    OPEN_DIRECTORY: (state: FileSystemState, fileSystem: FS) => {
      state.fileSystem = fileSystem;
    },
  },
  actions: {
    INITIALIZE_FILE_SYSTEM: ({ commit }: any) => {
      const rootDirectory: Directory = {
        name: "root",
        parent: null,
        type: DIRECTORY_TYPE.DEFAULT,
        children: [],
      };

      const fileSystem: FS = { currentDirectory: rootDirectory, currentDirectoryPath: [rootDirectory] };

      commit("INITIALIZE_FILE_SYSTEM", fileSystem);
    },
    CREATE_DIRECTORY: ({ commit, getters }: any, name: string) => {
      const currentDirectory: Directory = getters["GET_CURRENT_DIRECTORY"];

      const newDirectory: Directory = {
        name,
        parent: currentDirectory,
        type: DIRECTORY_TYPE.DEFAULT,
        children: [],
      };

      commit("CREATE_FILE", newDirectory);
    },
    CREATE_FILE: ({ commit, getters }: any, name: string) => {
      const currentDirectory: Directory = getters["GET_CURRENT_DIRECTORY"];

      const fileItem: FileItem = {
        name: name,
        parent: currentDirectory,
        type: "text",
        mimeType: "txt",
        source: {},
      };

      commit("CREATE_FILE", fileItem);
    },
    OPEN_DIRECTORY_BY_NAME: ({ dispatch, getters }: any, directoryName: string) => {
      const currentDirectory: Directory = getters["GET_CURRENT_DIRECTORY"];
      const directoryFound = currentDirectory.children.find((item: Item) => {
        /* eslint-disable */
        if (item.name === directoryName && item.hasOwnProperty("children")) {
          return item;
        }
        /* eslint-enable */
      });
      console.log("DIR FOUND", directoryFound);
      if (directoryFound) {
        dispatch("OPEN_DIRECTORY", directoryFound);
      }
    },
    OPEN_DIRECTORY: ({ commit, getters }: any, directory: Directory) => {
      const newDirectoryPath = [];
      // console.log("DIR TO OPEN", directory.parent);

      let currentDirectory: Directory | null = directory;
      while (currentDirectory) {
        newDirectoryPath.unshift(currentDirectory);
        currentDirectory = currentDirectory.parent;
      }
      console.log("NED DIR", newDirectoryPath);

      const newFileSystem: FS = { currentDirectory: directory, currentDirectoryPath: newDirectoryPath };
      commit("OPEN_DIRECTORY", newFileSystem);
    },
  },
  getters: {
    GET_FILE_SYSTEM: (state: FileSystemState) => state.fileSystem,
    GET_CURRENT_DIRECTORY: (state: FileSystemState) => state.fileSystem.currentDirectory,
    GET_CURRENT_DIRECTORY_FILE: (state: FileSystemState) => state.fileSystem.currentDirectory.children,
    GET_CURRENT_DIRECTORY_PATH: (state: FileSystemState): Directory[] => state.fileSystem.currentDirectoryPath,
    GET_CURRENT_DIRECTORY_PATH_NAMES: (state: FileSystemState) =>
      state.fileSystem.currentDirectoryPath.map((dir: Directory) => {
        return dir.name;
      }),
  },
};

interface FileSystemState {
  fileSystem: FS;
}
