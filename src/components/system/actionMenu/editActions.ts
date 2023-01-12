import { getFiles, isDir } from "@/context/fileSystemController";
import { generateUniqueName } from "@/context/fileSystemUtils";
import { ActionItem } from "@/models/ActionMenu";
import DesktopItem from "@/models/DesktopItem";
import { useFileSystemStore } from "@/stores/fileSystemStore";

const refreshFiles = () => {
  const fileSystemStore = useFileSystemStore();
  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();
};

export const getEditActions = async (paths: string[]) => {
  const editActions = await [copyAction(paths), cutAction(paths), deleteAction(paths), await pasteAction(paths[0])];
  return editActions;
};

export const copyAction = (pathsToCopy: string[], disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "copy.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Copy",
    callback: () => {
      fileSystemStore.setFilePathsToCopy(pathsToCopy);
    },
    disabled: false,
  };
};

export const cutAction = (pathsToCut: string[], disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "cut.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Cut",
    callback: () => {
      fileSystemStore.setFilePathsToCut(pathsToCut);
    },
    disabled: false,
  };
};

export const pasteAction = async (
  destinationPath: string,
  disabled = false,
  iconOnly = true,
  horizontalGroup = true
): Promise<ActionItem> => {
  const fileSystemStore = useFileSystemStore();
  const canPaste =
    (fileSystemStore.filePathsToCopy.length > 0 || fileSystemStore.filePathsToCut.length > 0) &&
    (await isDir(destinationPath));

  return {
    icon: "paste.svg",
    iconOnly,
    groupName: "edit",
    horizontalGroup,
    actionName: "Paste",
    callback: async () => {
      await fileSystemStore.pasteFiles(destinationPath);
      refreshFiles();
    },
    disabled: disabled || !canPaste,
  };
};

export const deleteAction = (pathsToDelete: string[], disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "trash.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Delete",
    callback: async () => {
      for (const path of pathsToDelete) {
        await fileSystemStore.deleteFileSystemItem(path);
      }
      refreshFiles();
    },
    disabled: false,
  };
};

export const createNewFile = (destinationPath: string, disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-file-plus",
    iconOnly,
    groupName: "createNew",
    horizontalGroup: false,
    actionName: "New file",
    callback: async () => {
      const currentFolderFiles: string[] = await getFiles(destinationPath, true);

      const newUniquePath = generateUniqueName(destinationPath + "/" + "new file", currentFolderFiles);
      await fileSystemStore.createFile({
        path: newUniquePath + ".txt",
        content: "",
      });
      refreshFiles();
    },
    disabled,
  };
};

export const createNewFolder = (destinationPath: string, disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-folder-plus",
    iconOnly,
    groupName: "createNew",
    horizontalGroup: false,
    actionName: "New folder",
    callback: async () => {
      const currentFolderFiles: string[] = await getFiles(destinationPath, true);

      const newUniquePath = generateUniqueName(destinationPath + "/" + "new folder", currentFolderFiles);
      await fileSystemStore.createFolder(newUniquePath);
      refreshFiles();
    },
    disabled,
  };
};

export const openDesktopSettingPage = (disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-monitor",
    iconOnly,
    groupName: "settings",
    horizontalGroup: false,
    actionName: "Change desktop image",
    callback: () => {
      const settingsApp: DesktopItem = {
        path: "",
        coordinates: { x: 0, y: 0 },
        applicationExtension: "settings",
        isSelected: true,
      };
      fileSystemStore.createItemDialog(settingsApp);
    },
    disabled,
  };
};
