import {
  copyFile,
  createDirectory,
  createFile,
  deleteFile,
  getDesktopFiles,
  getFiles,
  isDir,
} from "@/context/fileSystemController";
import { getFileExtensionFromName, getFileNameFromPath } from "@/context/fileSystemUtils";
import { getDesktopFilesPositionFromLocalStorage } from "@/hooks/useLocalStorage";
import ActionMenu from "@/models/ActionMenu";
import Coordinates from "@/models/Coordinates";
import DesktopItem from "@/models/DesktopItem";
import fileTypesConfiguration from "@/models/FilesType";
import ItemDialog from "@/models/ItemDialog";
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

      isSelectionBoxEnabled: true,
      dragginPath: "",
    };
  },
  mutations: {
    CREATE_ITEM_DIALOG: (state: FileSystemState, itemDialog: ItemDialog) => {
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
    SET_DESKTOP_ITEMS: (state: FileSystemState, desktopItems: DesktopItem[]) => {
      state.desktopItems = desktopItems;
    },
    CHANGE_DESKTOP_ITEM_POSITION: (state: FileSystemState, desktopItem: DesktopItem) => {
      const index = state.desktopItems.findIndex((item) => item.path === desktopItem.path);

      if (index !== -1) {
        state.desktopItems[index] = desktopItem;
      }
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
    SET_DRAGGIN_PATH: (state: FileSystemState, dragginPath: string) => {
      state.dragginPath = dragginPath;
    },
    SET_IS_SELECTION_BOX_ENABLED: (state: FileSystemState, isSelectionBoxEnabled: boolean) => {
      state.isSelectionBoxEnabled = isSelectionBoxEnabled;
    },
  },
  actions: {
    CREATE_ITEM_DIALOG: async ({ commit, dispatch, getters }: any, itemDialog: DesktopItem) => {
      //******** REVISIT THIS METHOD TO TAKE EVRYTHINF FROM FilesType.ts !!!

      let dimension = { height: 300, width: 500 };
      let minDimension = { height: 100, width: 220 };
      let icon = "";
      let applicationToOpen = "";
      let filesPath = [] as string[];
      let name = "";
      let itemExtension = "";
      let isFolder = false;

      // if itemDialog has applicationExtension this means is not a file
      if (itemDialog.applicationExtension) {
        itemExtension = itemDialog.applicationExtension;
      } else {
        itemExtension = getFileExtensionFromName(itemDialog.path);
        isFolder = await isDir(itemDialog.path);
        if (isFolder) {
          filesPath = await getFiles(itemDialog.path, true);
          itemExtension = "dir";
        }
      }

      const fileTypeConfiguration = fileTypesConfiguration[itemExtension];
      console.log(fileTypeConfiguration);

      if (fileTypeConfiguration) {
        dimension = fileTypeConfiguration.defaultSize;
        minDimension = fileTypeConfiguration.minSize;
        icon = fileTypeConfiguration.icon;
        applicationToOpen = fileTypeConfiguration.application;
        name = fileTypeConfiguration.title;
      }

      if (itemDialog.path) {
        name = getFileNameFromPath(itemDialog.path);
      }

      const newItemDialog = {
        path: itemDialog.path,
        guid: uuidv4(),
        isCollapsed: false,
        isFolder,
        zIndex: 1,
        icon,
        position: getNewItemDialogPosition(getters.GET_ITEMS_DIALOG.length),
        dimension,
        minDimension,
        applicationToOpen,
        filesPath,
        name,
      } as ItemDialog;

      commit("CREATE_ITEM_DIALOG", newItemDialog);
      dispatch("SET_FOCUSED_ITEM_DIALOG", newItemDialog);
    },
    UPDATE_ITEM_DIALOG_NAME: async (
      { commit, dispatch }: any,
      pathAndItemToUpdate: { newPath: string; itemDialog: ItemDialog }
    ) => {
      const itemToUpdate = Object.assign({}, pathAndItemToUpdate.itemDialog);
      itemToUpdate.path = pathAndItemToUpdate.newPath;

      const filesPath = await getFiles(itemToUpdate.path, true);
      itemToUpdate.filesPath = filesPath;

      commit("UPDATE_ITEM_DIALOG", itemToUpdate);
    },
    REFRESH_ALL_ITEM_DIALOG_FILES: ({ commit, getters }: any) => {
      const itemsDialog = Object.assign([], getters["GET_ITEMS_DIALOG"]) as ItemDialog[];
      itemsDialog.forEach(async (itemDialog) => {
        const isFolder = await isDir(itemDialog.path);
        if (isFolder) {
          const newFilespath = await getFiles(itemDialog.path, true);
          (itemDialog as ItemDialog).filesPath = newFilespath;
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
    FETCH_DESKTOP_ITEMS: async ({ commit }: any) => {
      const desktopFiles = await getDesktopFiles(true);
      const localStoragePathAndCoordinates = getDesktopFilesPositionFromLocalStorage();
      // get coordinates
      const desktopItem = [] as DesktopItem[];
      desktopFiles.forEach((desktopPath: string) => {
        const coordinates = localStoragePathAndCoordinates[desktopPath] || { x: 0, y: 0 };
        desktopItem.push({ path: desktopPath, coordinates, isSelected: false });
      });

      commit("SET_DESKTOP_ITEMS", desktopItem);
    },

    CHANGE_DESKTOP_ITEM_POSITION: async ({ commit }: any, desktopItem: DesktopItem) => {
      commit("CHANGE_DESKTOP_ITEM_POSITION", desktopItem);
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
      dispatch("FETCH_DESKTOP_ITEMS");
    },
    SET_SELECTED_DESKTOP_FILES: ({ commit, getters }: any, desktopElement: DesktopItem[]) => {
      const desktopItems = [...(getters.GET_DESKTOP_FILES as DesktopItem[])];
      const selectedPath = desktopElement.map((element) => element.path);
      desktopItems.forEach((item) => (item.isSelected = selectedPath.includes(item.path)));

      commit("SET_DESKTOP_ITEMS", desktopItems);
    },

    SET_DRAGGIN_PATH: ({ commit }: any, dragginPath: string) => {
      commit("SET_DRAGGIN_PATH", dragginPath);
    },
    SET_IS_SELECTION_BOX_ENABLED: ({ commit }: any, isSelectionBoxEnabled: boolean) => {
      commit("SET_IS_SELECTION_BOX_ENABLED", isSelectionBoxEnabled);
    },
  },
  getters: {
    GET_ITEMS_DIALOG: (state: FileSystemState) => state.itemsDialog,
    GET_FOCUSED_ITEM_DIALOG: (state: FileSystemState) => state.itemsDialog.find((item: ItemDialog) => item.isFocused),
    GET_DESKTOP_FILES: (state: FileSystemState) => state.desktopItems,
    GET_DESKTOP_FILES_PATH: (state: FileSystemState) => state.desktopItems.map((item) => item.path),
    GET_ACTION_MENU: (state: FileSystemState) => state.actionMenu,
    GET_FILE_PATHS_TO_COPY: (state: FileSystemState) => state.filePathsToCopy,
    GET_FILE_PATHS_TO_CUT: (state: FileSystemState) => state.filePathsToCut,
    GET_FILE_PATHS_TO_MOVE: (state: FileSystemState) => state.filePathsToMove,
    GET_SELECTED_DESKTOP_FILES: (state: FileSystemState) => state.desktopItems.filter((item) => item.isSelected),
    GET_BIGGER_Z_INDEX: (state: FileSystemState) => {
      let max_z_index = 0;
      state.itemsDialog.forEach((item) => {
        if (item.zIndex > max_z_index) {
          max_z_index = item.zIndex;
        }
      });

      return max_z_index;
    },
    GET_IS_SELECTION_BOX_ENABLED: (state: FileSystemState) => state.isSelectionBoxEnabled,
    GET_DRAGGIN_PATH: (state: FileSystemState) => state.dragginPath,
  },
};

interface FileSystemState {
  desktopItems: DesktopItem[];
  itemsDialog: ItemDialog[];
  actionMenu: ActionMenu;
  filePathsToCopy: string[];
  filePathsToCut: string[];
  filePathsToMove: string[];
  isSelectionBoxEnabled: boolean;
  dragginPath: string;
}

interface Action {
  text: string;
  icon?: string;
}

const getNewItemDialogPosition = (itemDialogCount: number) => {
  const padding = 40;
  const startingPoint = 50;
  const x = (itemDialogCount % 10) * padding + startingPoint;
  const y = Math.floor(itemDialogCount / 10) * padding + startingPoint + ((itemDialogCount % 10) * padding) / 4;
  const position = { x, y } as Coordinates;
  return position;
};
