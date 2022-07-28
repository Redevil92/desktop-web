import {
  createDirectory,
  createFile,
  deleteFile,
  getDesktopFiles,
  getFileExtensionFromName,
  getFiles,
  isDir,
} from "@/context/fileSystemController";
import ActionMenu from "@/models/ActionMenu";
import DesktopItem from "@/models/DesktopItem";
import fileTypesConfiguration from "@/models/FilesType";
import ItemDialog, { FolderDialog } from "@/models/ItemDialog";
import PathAndContent from "@/models/PathAndContent";
import { v4 as uuidv4 } from "uuid";

export default {
  namespaced: true,
  state(): FileSystemState {
    return {
      desktopItems: [],
      itemsDialog: [],
      filePathsToCopy: [],
      filePathsToCut: [],
      actionMenu: {
        show: false,
        path: "",
        position: { x: 0, y: 0 },
        isOpenedFolder: false,
      },
    };
  },
  mutations: {
    ADD_ITEM_DIALOG: (state: FileSystemState, itemDialog: ItemDialog) => {
      state.itemsDialog.push(itemDialog);
      state.itemsDialog = [...state.itemsDialog];
    },
    CLOSE_ITEM_DIALOG: (state: FileSystemState, itemDialogGuid: string) => {
      const index = state.itemsDialog.findIndex((dir) => dir.guid === itemDialogGuid);
      state.itemsDialog.splice(index, 1);
      state.itemsDialog = [...state.itemsDialog];
    },
    UPDATE_ITEM_DIALOG_POSITION: (state: FileSystemState, itemToUpdate: ItemDialog) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        state.itemsDialog[index].position = itemToUpdate.position;
      }

      state.itemsDialog = [...state.itemsDialog];
    },
    UPDATE_ITEM_DIALOG: (state: FileSystemState, itemToUpdate: ItemDialog) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        state.itemsDialog[index] = itemToUpdate;
      }
      state.itemsDialog = [...state.itemsDialog];
    },
    UPDATE_ITEM_DIALOG_DIMENSION: (state: FileSystemState, itemToUpdate: ItemDialog) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        state.itemsDialog[index].dimension = itemToUpdate.dimension;
      }

      state.itemsDialog = [...state.itemsDialog];
    },
    MINIMIZE_ITEM_DIALOG: (state: FileSystemState, itemGuid: string) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemGuid);
      if (index !== -1) {
        state.itemsDialog[index].isCollapsed = true;
      }
      state.itemsDialog = [...state.itemsDialog];
    },
    OPEN_MINIMIZED_ITEM_DIALOG: (state: FileSystemState, itemGuid: string) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemGuid);
      if (index !== -1) {
        state.itemsDialog[index].isCollapsed = false;
      }
      state.itemsDialog = [...state.itemsDialog];
    },
    SET_FOCUSED_ITEM_DIALOG: (state: FileSystemState, itemDialog: ItemDialog) => {
      const itemsToUpdate = [...state.itemsDialog];
      itemsToUpdate.forEach((item) => {
        item.isFocused = false;
        item.zIndex = Math.max(item.zIndex - 1, 1);
      });
      const index = itemsToUpdate.findIndex((item) => item.guid === itemDialog.guid);
      if (index !== -1) {
        itemsToUpdate[index].isFocused = true;
        itemsToUpdate[index].zIndex = itemsToUpdate.length;
      }
      state.itemsDialog = itemsToUpdate;
    },
    SET_DESKTOP_ITEMS: (state: FileSystemState, desktopItems: string[]) => {
      state.desktopItems = desktopItems;
    },
    SET_ITEMS_DIALOG: (state: FileSystemState, itemsDialog: ItemDialog[]) => {
      state.itemsDialog = itemsDialog;
    },
    SET_ACTION_MENU: (state: FileSystemState, actionMenu: ActionMenu) => {
      state.actionMenu = actionMenu;
    },
    SET_FILE_PATHS_TO_COPY: (state: FileSystemState, paths: string[]) => {
      state.filePathsToCopy = paths;
    },
    SET_FILE_PATHS_TO_CUT: (state: FileSystemState, paths: string[]) => {
      state.filePathsToCut = paths;
    },
  },
  actions: {
    ADD_ITEM_DIALOG: ({ commit, dispatch }: any, itemDialog: DesktopItem) => {
      const itemExtension = getFileExtensionFromName(itemDialog.name);

      const fileTypeConfiguration = fileTypesConfiguration[itemExtension];
      let dimension = { height: 300, width: 500 };
      let icon = "";
      if (fileTypeConfiguration) {
        dimension = fileTypeConfiguration.defaultSize;
        icon = fileTypeConfiguration.icon;
      }

      const newItemDialog = {
        name: itemDialog.name,
        mimeType: itemDialog.mimeType,
        guid: uuidv4(),
        isCollapsed: false,
        isFolder: false,
        zIndex: 1,
        icon,
        dimension,
      } as ItemDialog;

      if (isDir(newItemDialog.name)) {
        const filesPath = getFiles(newItemDialog.name, true);
        newItemDialog.isFolder = true;
        (newItemDialog as FolderDialog).filesPath = filesPath;
      }

      commit("ADD_ITEM_DIALOG", newItemDialog);
      dispatch("SET_FOCUSED_ITEM_DIALOG", newItemDialog);
    },
    UPDATE_ITEM_DIALOG_NAME: (
      { commit, dispatch }: any,
      pathAndItemToUpdate: { newPath: string; itemDialog: FolderDialog }
    ) => {
      const itemToUpdate = Object.assign({}, pathAndItemToUpdate.itemDialog);
      itemToUpdate.name = pathAndItemToUpdate.newPath;

      const filesPath = getFiles(itemToUpdate.name, true);
      itemToUpdate.filesPath = filesPath;

      commit("UPDATE_ITEM_DIALOG", itemToUpdate);
    },
    REFRESH_ALL_ITEM_DIALOG_FILES: ({ commit, getters }: any) => {
      const itemsDialog = Object.assign([], getters["GET_ITEMS_DIALOG"]) as ItemDialog[];
      itemsDialog.forEach((itemDialog) => {
        if (isDir(itemDialog.name)) {
          const newFilespath = getFiles(itemDialog.name, true);
          (itemDialog as FolderDialog).filesPath = newFilespath;
        }
      });

      commit("SET_ITEMS_DIALOG", itemsDialog);
    },
    CLOSE_ITEM_DIALOG: ({ commit }: any, itemDialogGuid: string) => {
      commit("CLOSE_ITEM_DIALOG", itemDialogGuid);
    },
    MINIMIZE_ITEM_DIALOG: ({ commit }: any, itemDialogGuid: string) => {
      commit("MINIMIZE_ITEM_DIALOG", itemDialogGuid);
    },
    UPDATE_ITEM_DIALOG_POSITION: ({ commit }: any, itemDialogToUpdate: ItemDialog) => {
      commit("UPDATE_ITEM_DIALOG_POSITION", itemDialogToUpdate);
    },
    UPDATE_ITEM_DIALOG_DIMENSION: ({ commit }: any, itemDialogToUpdate: ItemDialog) => {
      commit("UPDATE_ITEM_DIALOG_DIMENSION", itemDialogToUpdate);
    },
    OPEN_MINIMIZED_ITEM_DIALOG: ({ commit }: any, itemDialogGuid: string) => {
      commit("OPEN_MINIMIZED_ITEM_DIALOG", itemDialogGuid);
    },
    SET_FOCUSED_ITEM_DIALOG: ({ commit }: any, itemDialog: ItemDialog) => {
      commit("SET_FOCUSED_ITEM_DIALOG", itemDialog);
    },
    FETCH_DESKTOP_FILES: ({ commit }: any) => {
      const desktopFiles = getDesktopFiles(true);
      commit("SET_DESKTOP_ITEMS", desktopFiles);
    },
    UPDATE_FILE: ({ commit }: any, pathAndContent: PathAndContent) => {
      createFile(pathAndContent.path, pathAndContent.content);
    },
    CREATE_FILE: ({ commit }: any, pathAndContent: PathAndContent) => {
      createFile(pathAndContent.path, pathAndContent.content);
    },
    DELETE_FILE: ({ commit }: any, path: string) => {
      deleteFile(path);
    },
    CREATE_FOLDER: ({ commit }: any, path: string) => {
      createDirectory(path);
    },
    SET_ACTION_MENU: ({ commit }: any, actionMenu: ActionMenu) => {
      commit("SET_ACTION_MENU", actionMenu);
    },
    CLOSE_ACTION_MENU: ({ commit }: any) => {
      const emptyActionMenu: ActionMenu = {
        show: false,
        path: "",
        position: { x: 0, y: 0 },
        isOpenedFolder: false,
      };
      commit("SET_ACTION_MENU", emptyActionMenu);
    },
    SET_FILE_PATHS_TO_CUT: ({ commit }: any, paths: string[]) => {
      commit("SET_FILE_PATHS_TO_CUT", paths);
      commit("SET_FILE_PATHS_TO_COPY", []);
    },
    SET_FILE_PATHS_TO_COPY: ({ commit }: any, paths: string[]) => {
      commit("SET_FILE_PATHS_TO_COPY", paths);
      commit("SET_FILE_PATHS_TO_CUT", []);
    },
  },
  getters: {
    GET_ITEMS_DIALOG: (state: FileSystemState) => state.itemsDialog,
    GET_FOCUSED_ITEM_DIALOG: (state: FileSystemState) => state.itemsDialog.find((item: ItemDialog) => item.isFocused),
    GET_DESKTOP_FILES: (state: FileSystemState) => state.desktopItems,
    GET_ACTION_MENU: (state: FileSystemState) => state.actionMenu,
    GET_FILE_PATHS_TO_COPY: (state: FileSystemState) => state.filePathsToCopy,
    GET_FILE_PATHS_TO_CUT: (state: FileSystemState) => state.filePathsToCut,
  },
};

interface FileSystemState {
  desktopItems: string[]; // done
  itemsDialog: ItemDialog[]; // in progress
  actionMenu: ActionMenu;
  filePathsToCopy: string[]; // in progress
  filePathsToCut: string[]; // in progress
}

interface Action {
  text: string;
  icon?: string;
}
