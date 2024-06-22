import { defineStore } from 'pinia';
import fileSystem from '@/context/fileSystemController';

import {
  getFileExtensionFromName,
  getFileNameFromPath,
  getNewItemDialogPosition
} from '@/context/utils/fileSystemUtils';
import { getDesktopFilesPositionFromLocalStorage } from '@/hooks/useLocalStorage';
import ActionMenu from '@/models/ActionMenu/ActionMenu';
import DesktopItem from '@/models/DesktopItem';
import fileTypesConfiguration from '@/models/FilesType';
import ItemDialog from '@/models/ItemDialog';
import PathAndContent from '@/models/PathAndContent';
import { v4 as uuidv4 } from 'uuid';
import { takeAndSaveItemPreviewScreenshotByItemGuid } from '@/hooks/useScreenshot';
import { removeItemPreviewInSessionStorage } from '@/hooks/useSessionStorage';
import { useDynamicIslandStore } from '@/stores/dynamicIslandStore';

export const useFileSystemStore = defineStore('fileSystem', {
  state: () => ({
    desktopItems: [] as DesktopItem[],
    itemsDialog: [] as ItemDialog[],
    filePathsToCopy: [] as string[],
    filePathsToCut: [] as string[],
    actionMenu: {
      show: false,
      paths: [],
      position: { x: 0, y: 0 },
      isOpenedFolder: false
    } as ActionMenu,
    filePathsToMove: [] as string[],
    isSelectionBoxEnabled: true,
    dragginPath: ''
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
    }
  },
  actions: {
    async createItemDialogByPath(filePath: string,additionalOptions?: any, applicationToOpen?: string) {
      let dimension = { height: 300, width: 500 };
      let minDimension = { height: 100, width: 220 };
      let icon = '';
      let currentApplicationToOpen = applicationToOpen;
      let filesPath = [] as string[];
      let name = '';
      let itemExtension = '';
      let isFolder = false;


        itemExtension = getFileExtensionFromName(filePath);
        isFolder = await fileSystem.isDir(filePath);
        if (isFolder) {
          filesPath = await fileSystem.getFiles(filePath, true);
          itemExtension = 'dir';
        }
      

      const fileTypeConfiguration = fileTypesConfiguration[itemExtension];

      if (fileTypeConfiguration) {
        dimension = fileTypeConfiguration.defaultSize;
        minDimension = fileTypeConfiguration.minSize;
        icon = fileTypeConfiguration.icon;
        currentApplicationToOpen = applicationToOpen || fileTypeConfiguration.application;
        name = fileTypeConfiguration.title;
      }

      if (filePath) {
        name = getFileNameFromPath(filePath);
      }

      const newItemDialog = {
        path: filePath,
        guid: uuidv4(),
        isCollapsed: false,
        isFolder,
        zIndex: 1,
        icon,
        position: getNewItemDialogPosition(this.itemsDialog.length),
        dimension,
        minDimension,
        applicationToOpen: currentApplicationToOpen,
        filesPath,
        name,
        additionalOptions
      } as ItemDialog;

      this.itemsDialog.push(newItemDialog);

      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed

      this.setFocusedItemDialog(newItemDialog);
      setTimeout(() => {
        takeAndSaveItemPreviewScreenshotByItemGuid(newItemDialog.guid, newItemDialog.path);
      }, 500);
    },
    async createItemDialog(
      itemDialog: DesktopItem,
      additionalOptions?: any,
      applicationToOpen?: string
    ) {
      // if path already opened dont create a new one but
      const index = this.itemsDialog.findIndex((item) => item.path === itemDialog.path);
      if (index !== -1) {
        this.setFocusedItemDialog(this.itemsDialog[index]);
        this.openMinimizedItemDialog(this.itemsDialog[index].guid);
        return;
      }

      this.createItemDialogByPath(itemDialog.path, additionalOptions, applicationToOpen);

      // let dimension = { height: 300, width: 500 };
      // let minDimension = { height: 100, width: 220 };
      // let icon = '';
      // let currentApplicationToOpen = applicationToOpen;
      // let filesPath = [] as string[];
      // let name = '';
      // let itemExtension = '';
      // let isFolder = false;

      // // if itemDialog has applicationExtension this means is not a file
      // if (itemDialog.applicationExtension) {
      //   itemExtension = itemDialog.applicationExtension;
      // } else {
      //   itemExtension = getFileExtensionFromName(itemDialog.path);
      //   isFolder = await fileSystem.isDir(itemDialog.path);
      //   if (isFolder) {
      //     filesPath = await fileSystem.getFiles(itemDialog.path, true);
      //     itemExtension = 'dir';
      //   }
      // }

      // const fileTypeConfiguration = fileTypesConfiguration[itemExtension];

      // if (fileTypeConfiguration) {
      //   dimension = fileTypeConfiguration.defaultSize;
      //   minDimension = fileTypeConfiguration.minSize;
      //   icon = fileTypeConfiguration.icon;
      //   currentApplicationToOpen = applicationToOpen || fileTypeConfiguration.application;
      //   name = fileTypeConfiguration.title;
      // }

      // if (itemDialog.path) {
      //   name = getFileNameFromPath(itemDialog.path);
      // }

      // const newItemDialog = {
      //   path: itemDialog.path,
      //   guid: uuidv4(),
      //   isCollapsed: false,
      //   isFolder,
      //   zIndex: 1,
      //   icon,
      //   position: getNewItemDialogPosition(this.itemsDialog.length),
      //   dimension,
      //   minDimension,
      //   applicationToOpen: currentApplicationToOpen,
      //   filesPath,
      //   name,
      //   additionalOptions
      // } as ItemDialog;

      // this.itemsDialog.push(newItemDialog);

      // this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed

      // this.setFocusedItemDialog(newItemDialog);
      // setTimeout(() => {
      //   takeAndSaveItemPreviewScreenshotByItemGuid(newItemDialog.guid, newItemDialog.path);
      // }, 500);
    },
    async updateItemDialogPath(pathAndItemToUpdate: { newPath: string; itemDialog: ItemDialog }) {
      const itemToUpdate = Object.assign({}, pathAndItemToUpdate.itemDialog);
      itemToUpdate.path = pathAndItemToUpdate.newPath;
      itemToUpdate.name = getFileNameFromPath(pathAndItemToUpdate.newPath);

      const filesPath = await fileSystem.getFiles(itemToUpdate.path, true);
      itemToUpdate.filesPath = filesPath;

      const index = this.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        this.itemsDialog[index] = itemToUpdate;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
    },
    refreshAllItemDialogFiles() {
      const itemsDialog = Object.assign([], this.itemsDialog) as ItemDialog[];
      itemsDialog.forEach(async (itemDialog) => {
        const isFolder = await fileSystem.isDir(itemDialog.path);

        if (isFolder) {
          const newFilespath = await fileSystem.getFiles(itemDialog.path, true);
          itemDialog.filesPath = newFilespath;
        }
      });
      this.itemsDialog = itemsDialog;
    },
    closeItemDialog(itemDialogGuid: string) {
      const dynamicIslandStore = useDynamicIslandStore();
      const index = this.itemsDialog.findIndex((dir) => dir.guid === itemDialogGuid);
      if (index !== -1) {
        if (this.itemsDialog.filter((item) => item.guid === itemDialogGuid).length === 1) {
          removeItemPreviewInSessionStorage(this.itemsDialog[index].path);
        }

        dynamicIslandStore.removeDynamicIslandItem(itemDialogGuid);
        this.itemsDialog.splice(index, 1);
        this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
      }
    },
    minimizeItemDialog(itemDialogGuid: string) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogGuid);
      if (index !== -1) {
        this.itemsDialog[index].isCollapsed = true;
        takeAndSaveItemPreviewScreenshotByItemGuid(itemDialogGuid, this.itemsDialog[index].path);
      }

      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
    },
    updateItemDialog(itemDialogToUpdate: ItemDialog) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogToUpdate.guid);
      if (index !== -1) {
        this.itemsDialog[index] = itemDialogToUpdate;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
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

      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
    },
    openMinimizedItemDialog(itemDialogGuid: string) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemDialogGuid);
      if (index !== -1) {
        this.itemsDialog[index].isCollapsed = false;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
    },
    findAndSetNewFocusedItemDialog() {
      const itemDialogs: ItemDialog[] = this.itemsDialog;
      const max_z_index = Math.max(...itemDialogs.map((item) => item.zIndex));
      const itemDialogToFocus = itemDialogs.find((item) => item.zIndex === max_z_index);
      if (itemDialogToFocus) {
        this.setFocusedItemDialog(itemDialogToFocus);
      }
    },
    setFocusedItemDialog(itemDialog: ItemDialog | null) {
      const itemsToUpdate = [...this.itemsDialog];
      itemsToUpdate.forEach((item) => {
        item.isFocused = false;
        item.zIndex = Math.max(item.zIndex - 1, 1);
      });
      const index = itemsToUpdate.findIndex((item) => item.guid === itemDialog?.guid);

      if (index !== -1) {
        itemsToUpdate[index].isFocused = true;
        itemsToUpdate[index].zIndex = itemsToUpdate.length;
      }

      this.itemsDialog = itemsToUpdate;
    },
    setItemDialogFullScreen(itemData: { itemGuid: string; isFullscreen: boolean }) {
      const index = this.itemsDialog.findIndex((item) => item.guid === itemData.itemGuid);
      if (index !== -1) {
        this.itemsDialog[index].isFullscreen = itemData.isFullscreen;
      }
      this.itemsDialog = [...this.itemsDialog]; // TODO: check if needed
    },
    async fetchDesktopItems() {
      const desktopFiles = await fileSystem.getDesktopFiles(true);
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
      await fileSystem.createFile(pathAndContent.path, pathAndContent.content);
    },
    async createFile(pathAndContent: PathAndContent, overwriteIfSameName = true): Promise<string> {
      return await fileSystem.createFile(
        pathAndContent.path,
        pathAndContent.content,
        undefined,
        overwriteIfSameName
      );
    },
    async deleteFileSystemItem(path: string) {
      await fileSystem.deleteFileSystemItem(path);
    },
    async createFolder(path: string): Promise<string> {
      return await fileSystem.createDirectory(path, false, false);
    },

    async renameFile(newFilePath: string, oldFilePath: string) {
      if (newFilePath !== oldFilePath) {
        fileSystem.renameFile(newFilePath, oldFilePath);
      }
    },
    setActionMenu(actionMenu: ActionMenu) {
      this.actionMenu = actionMenu;
    },
    closeActionMenu() {
      const emptyActionMenu: ActionMenu = {
        show: false,
        paths: [],
        position: { x: 0, y: 0 }
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
        await this.moveFiles(filesToCopy, destinationPath, true);
      } else if (filesToCut.length > 0) {
        await this.moveFiles(filesToCut, destinationPath, false);
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
    async moveFiles(filesToMove: string[], destinationPath: string, keepOriginal = false) {
      await fileSystem.moveFiles(filesToMove, destinationPath, keepOriginal);
    }
  }
});
