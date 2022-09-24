import {
  copyFile,
  createDirectory,
  createFile,
  deleteFile,
  getDesktopFiles,
  getFiles,
  isDir,
} from "@/context/fileSystemController";
import { getFileExtensionFromName } from "@/context/fileSystemUtils";
import ActionMenu from "@/models/ActionMenu";
import Coordinates from "@/models/Coordinates";
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
      filePathsToMove: [],
      selectedDesktopFilePaths: [],
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
    SET_ITEM_DIALOG_FULL_SCREEN: (state: FileSystemState, itemData: { itemGuid: string; isFullscreen: boolean }) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemData.itemGuid);

      if (index !== -1) {
        state.itemsDialog[index].isFullscreen = itemData.isFullscreen || undefined;
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
    SET_FILE_PATHS_TO_MOVE: (state: FileSystemState, paths: string[]) => {
      state.filePathsToMove = paths;
    },
    SET_SELECTED_DESKTOP_FILE_PATHS: (state: FileSystemState, paths: string[]) => {
      state.selectedDesktopFilePaths = paths;
    },
  },
  actions: {
    ADD_ITEM_DIALOG: async ({ commit, dispatch, getters }: any, itemDialog: DesktopItem) => {
      const itemExtension = getFileExtensionFromName(itemDialog.name);

      const fileTypeConfiguration = fileTypesConfiguration[itemExtension];
      let dimension = { height: 300, width: 500 };
      let minDimension = { height: 100, width: 220 };
      let icon = "";
      if (fileTypeConfiguration) {
        dimension = fileTypeConfiguration.defaultSize;
        minDimension = fileTypeConfiguration.minSize;
        icon = fileTypeConfiguration.icon;
      }

      const padding = 40;
      const startingPoint = 50;
      const itemDialogCount = getters.GET_ITEMS_DIALOG.length;
      const x = (itemDialogCount % 10) * padding + startingPoint;
      const y = Math.floor(itemDialogCount / 10) * padding + startingPoint + ((itemDialogCount % 10) * padding) / 4;
      const position = { x, y } as Coordinates;

      const newItemDialog = {
        name: itemDialog.name,
        guid: uuidv4(),
        isCollapsed: false,
        isFolder: false,
        zIndex: 1,
        icon,
        position,
        dimension,
        minDimension,
      } as ItemDialog;

      const isFolder = await isDir(newItemDialog.name);

      if (isFolder) {
        const filesPath = await getFiles(newItemDialog.name, true);
        newItemDialog.isFolder = true;
        (newItemDialog as FolderDialog).filesPath = filesPath;
      }

      commit("ADD_ITEM_DIALOG", newItemDialog);
      dispatch("SET_FOCUSED_ITEM_DIALOG", newItemDialog);
    },
    UPDATE_ITEM_DIALOG_NAME: async (
      { commit, dispatch }: any,
      pathAndItemToUpdate: { newPath: string; itemDialog: FolderDialog }
    ) => {
      const itemToUpdate = Object.assign({}, pathAndItemToUpdate.itemDialog);
      itemToUpdate.name = pathAndItemToUpdate.newPath;

      const filesPath = await getFiles(itemToUpdate.name, true);
      itemToUpdate.filesPath = filesPath;

      commit("UPDATE_ITEM_DIALOG", itemToUpdate);
    },
    REFRESH_ALL_ITEM_DIALOG_FILES: ({ commit, getters }: any) => {
      const itemsDialog = Object.assign([], getters["GET_ITEMS_DIALOG"]) as ItemDialog[];
      itemsDialog.forEach(async (itemDialog) => {
        const isFolder = await isDir(itemDialog.name);
        if (isFolder) {
          const newFilespath = await getFiles(itemDialog.name, true);
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
    FIND_AND_SET_NEW_FOCUSED_ITEM_DIALOG: ({ commit, getters }: any) => {
      const itemDialogs: ItemDialog[] = getters.GET_ITEMS_DIALOG;
      const max_z_index = Math.max(...itemDialogs.map((item) => item.zIndex));
      const itemDialogToFocus = itemDialogs.find((item) => item.zIndex === max_z_index);

      commit("SET_FOCUSED_ITEM_DIALOG", itemDialogToFocus);
    },
    SET_FOCUSED_ITEM_DIALOG: ({ commit }: any, itemDialog: ItemDialog) => {
      commit("SET_FOCUSED_ITEM_DIALOG", itemDialog);
    },
    SET_ITEM_DIALOG_FULL_SCREEN: ({ commit }: any, itemData: { itemGuid: string; isFullscreen: boolean }) => {
      commit("SET_ITEM_DIALOG_FULL_SCREEN", itemData);
    },
    FETCH_DESKTOP_FILES: async ({ commit }: any) => {
      const desktopFiles = await getDesktopFiles(true);
      commit("SET_DESKTOP_ITEMS", desktopFiles);
    },
    UPDATE_FILE: async ({ commit }: any, pathAndContent: PathAndContent) => {
      await createFile(pathAndContent.path, pathAndContent.content);
    },
    CREATE_FILE: async ({ commit }: any, pathAndContent: PathAndContent) => {
      await createFile(pathAndContent.path, pathAndContent.content);
    },
    DELETE_FILE: async ({ commit }: any, path: string) => {
      await deleteFile(path);
    },
    CREATE_FOLDER: async ({ commit }: any, path: string) => {
      await createDirectory(path);
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
    SET_FILE_PATHS_TO_MOVE: ({ commit }: any, paths: string[]) => {
      commit("SET_FILE_PATHS_TO_MOVE", paths);
    },
    PASTE_FILES: async ({ commit, getters, dispatch }: any, destinationPath: string) => {
      const filesToCopy: string[] = getters.GET_FILE_PATHS_TO_COPY;
      const filesToCut: string[] = getters.GET_FILE_PATHS_TO_CUT;

      if (filesToCopy.length > 0) {
        for (const file of filesToCopy) {
          await copyFile(file, destinationPath);
        }
      } else if (filesToCut.length > 0) {
        for (const file of filesToCut) {
          await copyFile(file, destinationPath);
        }

        for (const file of filesToCut) {
          await deleteFile(file);
        }
        dispatch("SET_FILE_PATHS_TO_CUT", []);
      }
      dispatch("REFRESH_ALL_ITEM_DIALOG_FILES");
      dispatch("FETCH_DESKTOP_FILES");
    },
    SET_SELECTED_DESKTOP_FILE_PATHS: ({ commit }: any, paths: string[]) => {
      commit("SET_SELECTED_DESKTOP_FILE_PATHS", paths);
    },
  },
  getters: {
    GET_ITEMS_DIALOG: (state: FileSystemState) => state.itemsDialog,
    GET_FOCUSED_ITEM_DIALOG: (state: FileSystemState) => state.itemsDialog.find((item: ItemDialog) => item.isFocused),
    GET_DESKTOP_FILES: (state: FileSystemState) => state.desktopItems,
    GET_ACTION_MENU: (state: FileSystemState) => state.actionMenu,
    GET_FILE_PATHS_TO_COPY: (state: FileSystemState) => state.filePathsToCopy,
    GET_FILE_PATHS_TO_CUT: (state: FileSystemState) => state.filePathsToCut,
    GET_FILE_PATHS_TO_MOVE: (state: FileSystemState) => state.filePathsToMove,
    GET_SELECTED_DESKTOP_FILE_PATHS: (state: FileSystemState) => state.selectedDesktopFilePaths,
    GET_BIGGER_Z_INDEX: (state: FileSystemState) => {
      let max_z_index = 0;
      state.itemsDialog.forEach((item) => {
        if (item.zIndex > max_z_index) {
          max_z_index = item.zIndex;
        }
      });

      return max_z_index;
    },
  },
};

interface FileSystemState {
  desktopItems: string[]; // done
  itemsDialog: ItemDialog[];
  actionMenu: ActionMenu;
  selectedDesktopFilePaths: string[];
  filePathsToCopy: string[];
  filePathsToCut: string[]; // in progress
  filePathsToMove: string[];
}

interface Action {
  text: string;
  icon?: string;
}
