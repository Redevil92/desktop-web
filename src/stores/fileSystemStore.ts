import { defineStore } from "pinia";
import {
  copyFile,
  createDirectory,
  createFile,
  deleteFile,
  getDesktopFiles,
  getFiles,
  isDir,
} from "@/context/fileSystemController";
import { getFileExtensionFromName, getFileNameFromPath, getNewItemDialogPosition } from "@/context/fileSystemUtils";
import { getDesktopFilesPositionFromLocalStorage } from "@/hooks/useLocalStorage";
import ActionMenu from "@/models/ActionMenu";
import DesktopItem from "@/models/DesktopItem";
import fileTypesConfiguration from "@/models/FilesType";
import ItemDialog from "@/models/ItemDialog";
import PathAndContent from "@/models/PathAndContent";
import { v4 as uuidv4 } from "uuid";
import { takeAndSaveItemPreviewScreenshot } from "@/hooks/useScreenshot";
import { removeItemPreviewInSessionStorage } from "@/hooks/useSessionStorage";

export const useFileSystemStore = defineStore("fileSystem", {
  state: () => ({
    desktopItems: [] as DesktopItem[],
    itemsDialog: [] as ItemDialog[],
    filePathsToCopy: [] as string[],
    filePathsToCut: [] as string[],
    actionMenu: {
      show: false,
      paths: [],
      position: { x: 0, y: 0 },
      isOpenedFolder: false,
    } as ActionMenu,
    filePathsToMove: [] as string[],
    isSelectionBoxEnabled: true,
    dragginPath: "",
  }),
  getters: {
    getBigger_z_index() {
      let max_z_index = 0;
      this.itemsDialog.forEach((item) => {
        if (item.zIndex > max_z_index) {
          max_z_index = item.zIndex;
        }
      });

      return max_z_index;
    },
    getFocusedItemDialog(): ItemDialog | undefined {
      return this.itemsDialog.find((item: ItemDialog) => item.isFocused);
    },
    getDesktopFilesPath(): string[] {
      return this.desktopItems.map((item) => item.path);
    },
    getSelectedDesktopItems(): DesktopItem[] {
      return this.desktopItems.filter((item) => item.isSelected);
    },
    getSelectedDesktopItemsPath(): string[] {
      return this.desktopItems.filter((item) => item.isSelected).map((item) => item.path);
    },
  },
  actions: {
    async createItemDialog(itemDialog: DesktopItem) {
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
        position: getNewItemDialogPosition(this.itemsDialog.length),
        dimension,
        minDimension,
        applicationToOpen,
        filesPath,
        name,
      } as ItemDialog;

      this.itemsDialog.push(newItemDialog);

      this.itemsDialog = [...this.itemsDialog]; // TODO, check if neeeded

      this.setFocusedItemDialog(newItemDialog);
    },
    async updateItemDialogName(pathAndItemToUpdate: { newPath: string; itemDialog: ItemDialog }) {
      const itemToUpdate = Object.assign({}, pathAndItemToUpdate.itemDialog);
      itemToUpdate.path = pathAndItemToUpdate.newPath;

      const filesPath = await getFiles(itemToUpdate.path, true);
      itemToUpdate.filesPath = filesPath;

      const index = this.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        this.itemsDialog[index] = itemToUpdate;
      }
      this.itemsDialog = [...this.itemsDialog];
    },
    refreshAllItemDialogFiles() {
      const itemsDialog = Object.assign([], this.itemsDialog) as ItemDialog[];
      itemsDialog.forEach(async (itemDialog) => {
        const isFolder = await isDir(itemDialog.path);
        if (isFolder) {
          const newFilespath = await getFiles(itemDialog.path, true);
          itemDialog.filesPath = newFilespath;
        }
      });
      this.itemsDialog = itemsDialog;
    },
    closeItemDialog(itemDialogGuid: string) {
      const index = this.itemsDialog.findIndex((dir) => dir.guid === itemDialogGuid);
      if (index !== -1) {
        removeItemPreviewInSessionStorage(this.itemsDialog[index].path);
        this.itemsDialog.splice(index, 1);
        this.itemsDialog = [...this.itemsDialog]; // TODO, check if needed
      }
    },
    minimizeItemDialog(itemDialogGuid: string, itemRef: HTMLElement | undefined = undefined) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogGuid);
      if (index !== -1) {
        this.itemsDialog[index].isCollapsed = true;
        if (itemRef) {
          takeAndSaveItemPreviewScreenshot(itemRef, this.itemsDialog[index].path);
        }
      }

      this.itemsDialog = [...this.itemsDialog]; // TODO, check if needed
    },
    updateItemDialog(itemDialogToUpdate: ItemDialog) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogToUpdate.guid);
      if (index !== -1) {
        this.itemsDialog[index] = itemDialogToUpdate;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO, check if needed
    },
    updateItemDialogPosition(itemDialogToUpdate: ItemDialog) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogToUpdate.guid);
      if (index !== -1) {
        this.itemsDialog[index].position = itemDialogToUpdate.position;
      }

      this.itemsDialog = [...this.itemsDialog];
    },
    updateItemDialogDimension(itemDialogToUpdate: ItemDialog) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogToUpdate.guid);
      if (index !== -1) {
        this.itemsDialog[index].dimension = itemDialogToUpdate.dimension;
      }

      this.itemsDialog = [...this.itemsDialog]; // TODO, check if needed
    },
    openMinimizedItemDialog(itemDialogGuid: string) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogGuid);
      if (index !== -1) {
        this.itemsDialog[index].isCollapsed = false;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO, check if needed
    },
    findAndSetNewFocusedItemDialog() {
      const itemDialogs: ItemDialog[] = this.itemsDialog;
      const max_z_index = Math.max(...itemDialogs.map((item) => item.zIndex));
      const itemDialogToFocus = itemDialogs.find((item) => item.zIndex === max_z_index);
      if (itemDialogToFocus) {
        this.setFocusedItemDialog(itemDialogToFocus);
      }
    },
    setFocusedItemDialog(itemDialog: ItemDialog) {
      const itemsToUpdate = [...this.itemsDialog];
      itemsToUpdate.forEach((item) => {
        item.isFocused = false;
        item.zIndex = Math.max(item.zIndex - 1, 1);
      });
      const index = itemsToUpdate.findIndex((item) => item.guid === itemDialog.guid);

      if (index !== -1) {
        itemsToUpdate[index].isFocused = true;
        itemsToUpdate[index].zIndex = itemsToUpdate.length;
      }

      this.itemsDialog = itemsToUpdate;
    },
    setItemDialogFullScreen(itemData: { itemGuid: string; isFullscreen: boolean }) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemData.itemGuid);

      if (index !== -1) {
        this.itemsDialog[index].isFullscreen = itemData.isFullscreen || undefined;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO, check if needed
    },
    async fetchDesktopItems() {
      const desktopFiles = await getDesktopFiles(true);
      const localStoragePathAndCoordinates = getDesktopFilesPositionFromLocalStorage();
      // get coordinates
      const desktopItems = [] as DesktopItem[];
      desktopFiles.forEach((desktopPath: string) => {
        const coordinates = localStoragePathAndCoordinates[desktopPath] || { x: 0, y: 0 };
        desktopItems.push({ path: desktopPath, coordinates, isSelected: false });
      });

      this.desktopItems = desktopItems;
    },

    changeDesktopItemPosition(desktopItem: DesktopItem) {
      const index = this.desktopItems.findIndex((item) => item.path === desktopItem.path);

      if (index !== -1) {
        this.desktopItems[index] = desktopItem;
      }
    },
    async updateFile(pathAndContent: PathAndContent) {
      await createFile(pathAndContent.path, pathAndContent.content);
    },
    async createFile(pathAndContent: PathAndContent) {
      await createFile(pathAndContent.path, pathAndContent.content);
    },
    async deleteFile(path: string) {
      await deleteFile(path);
    },
    async createFolder(path: string) {
      await createDirectory(path);
    },
    setActionMenu(actionMenu: ActionMenu) {
      this.actionMenu = actionMenu;
    },
    closeActionMenu() {
      const emptyActionMenu: ActionMenu = {
        show: false,
        paths: [],
        position: { x: 0, y: 0 },
        isOpenedFolder: false,
      };

      this.setActionMenu(emptyActionMenu);
    },
    setFilePathsToCut(paths: string[]) {
      this.filePathsToCut = paths;
      this.filePathsToCopy = [];
    },
    setFilePathsToCopy(paths: string[]) {
      this.filePathsToCut = [];
      this.filePathsToCopy = paths;
    },
    setFilePathsToMove(paths: string[]) {
      this.filePathsToMove = paths;
    },
    async pasteFiles(destinationPath: string) {
      const filesToCopy: string[] = this.filePathsToCopy;
      const filesToCut: string[] = this.filePathsToCut;

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
        this.setFilePathsToCut([]);
      }

      this.refreshAllItemDialogFiles();
      this.fetchDesktopItems();
    },
    setSelectedDesktopFiles(desktopElement: DesktopItem[]) {
      const desktopItems = [...this.desktopItems];

      const selectedPath = desktopElement.map((element) => element.path);
      desktopItems.forEach((item) => (item.isSelected = selectedPath.includes(item.path)));

      this.desktopItems = desktopItems;
    },
    setDragginPath(dragginPath: string) {
      this.dragginPath = dragginPath;
    },
    setIsSelectionBoxEnabled(isSelectionBoxEnabled: boolean) {
      this.isSelectionBoxEnabled = isSelectionBoxEnabled;
    },
  },
});
