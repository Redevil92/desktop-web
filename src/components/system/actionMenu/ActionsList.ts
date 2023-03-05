import { downloadFiles, getFiles, isDir, readFile } from "@/context/fileSystemController";
import { getFileExtensionFromName, getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import useCompression from "@/hooks/useCompression";
import {
  getDesktopFilePositionFromLocalStorage,
  getDesktopFilesPositionFromLocalStorage,
  saveDesktopFilePosition,
} from "@/hooks/useLocalStorage";
import { ActionItem } from "@/models/ActionMenu";
import DesktopItem from "@/models/DesktopItem";
import fileTypesConfiguration from "@/models/FilesType";
import LinkData from "@/models/LinkData";
import { useFileSystemStore } from "@/stores/fileSystemStore";

const refreshFiles = () => {
  const fileSystemStore = useFileSystemStore();
  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();
};

export const copyAction = (pathsToCopy: string[], disabled = false, iconOnly = true): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "copy.svg",
    iconOnly,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Copy",
    callback: () => {
      fileSystemStore.setFilePathsToCopy(pathsToCopy);
    },
    disabled: false,
  };
};

export const cutAction = (pathsToCut: string[], disabled = false, iconOnly = true): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "cut.svg",
    iconOnly,
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
      if (!canPaste || disabled) {
        return;
      }
      await fileSystemStore.pasteFiles(destinationPath);
      refreshFiles();
    },
    disabled: !canPaste || disabled,
  };
};

export const deleteAction = (pathsToDelete: string[], disabled = false, iconOnly = true): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "trash.svg",
    iconOnly,
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

export const createNewFile = (
  event: PointerEvent,
  destinationPath: string,
  disabled = false,
  iconOnly = false
): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-file-plus",
    iconOnly,
    groupName: "createNew",
    horizontalGroup: false,
    actionName: "New file",
    callback: async () => {
      const createdFileName = await fileSystemStore.createFile(
        {
          path: destinationPath + "/" + "new file.txt",
          content: "",
        },
        false
      );
      saveDesktopFilePosition(createdFileName, { x: event.x, y: event.y });
      refreshFiles();
    },
    disabled,
  };
};

export const createNewFolder = (
  event: PointerEvent,
  destinationPath: string,
  disabled = false,
  iconOnly = false
): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-folder-plus",
    iconOnly,
    groupName: "createNew",
    horizontalGroup: false,
    actionName: "New folder",
    callback: async () => {
      const createdFolderName = await fileSystemStore.createFolder(destinationPath + "/" + "new folder");
      saveDesktopFilePosition(createdFolderName, { x: event.x, y: event.y });
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

export const createShortcut = (paths: string[], disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-link-plus",
    iconOnly,
    groupName: "settings",
    horizontalGroup: false,
    actionName: "Create shortcut",
    callback: async () => {
      const settingsApp: DesktopItem = {
        path: "",
        coordinates: { x: 0, y: 0 },
        applicationExtension: "settings",
        isSelected: true,
      };
      const linkData: LinkData = { filePath: paths[0] };
      const createdFileName = await fileSystemStore.createFile({
        path: `${paths[0]}.lnk`,
        content: JSON.stringify(linkData),
      });
      const positons = getDesktopFilePositionFromLocalStorage(paths[0]);
      saveDesktopFilePosition(createdFileName, positons);
      refreshFiles();
    },
    disabled: disabled || paths.length > 1,
  };
};

// compression actions
export const extractFilesInFolder = (filePath: string, disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-folder-arrow-right-outline",
    iconOnly,
    groupName: "compression",
    horizontalGroup: false,
    actionName: "Extract files in folder...",
    callback: () => {
      const settingsApp: DesktopItem = {
        path: filePath,
        coordinates: { x: 0, y: 0 },
        isSelected: true,
      };
      const additionalOptions = {
        showExtractHereDialog: true,
      };
      fileSystemStore.createItemDialog(settingsApp, additionalOptions);
    },
    disabled,
  };
};

export const downloadFileAction = (pathsToCopy: string[]): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    materialIcon: "mdi-download",
    iconOnly: false,
    groupName: "other",
    horizontalGroup: false,
    actionName: "Download",
    callback: () => {
      downloadFiles(pathsToCopy);
    },
    disabled: false,
  };
};

export const extractHere = (filePath: string, disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  const { decompressFile, saveDecompressedFilesToDestination } = useCompression();
  return {
    materialIcon: "mdi-folder-download-outline",
    iconOnly,
    groupName: "compression",
    horizontalGroup: false,
    actionName: "Extract here",
    callback: async () => {
      const compressed = await readFile(filePath);
      const decompressedFiles = decompressFile(compressed);
      await saveDecompressedFilesToDestination(decompressedFiles, getSourcePathFromFilePath(filePath));
      const fileSystemStore = useFileSystemStore();
      await fileSystemStore.fetchDesktopItems();
      fileSystemStore.refreshAllItemDialogFiles();
    },
    disabled,
  };
};

export const compressToZipFileAction = (filePaths: string[], disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  const { compressToZipFile } = useCompression();

  return {
    materialIcon: "mdi-folder-zip",
    iconOnly,
    groupName: "compression",
    horizontalGroup: false,
    actionName: "Compress to ZIP file",
    callback: async () => {
      const filesToZip: { fileName: string; contentBase64: string }[] = await addFilesFromPathRecursivelyToList(
        filePaths,
        []
      );
      const zippedFile = await compressToZipFile(filesToZip);
      const zipFilePath = getSourcePathFromFilePath(filePaths[0]) + "/" + "zipFile.zip";
      await fileSystemStore.createFile({ path: zipFilePath, content: zippedFile }, false);
      await fileSystemStore.fetchDesktopItems();
      fileSystemStore.refreshAllItemDialogFiles();
    },
    disabled,
  };
};

export const openFileAction = (filePaths: string[]) => {
  return {
    materialIcon: "mdi-open-in-new",
    iconOnly: false,
    horizontalGroup: false,
    groupName: "other",
    actionName: "Open",
    callback: async () => {
      const fileSystemStore = useFileSystemStore();

      for (const path of filePaths) {
        const desktopItem = {
          path,
          coordinates: { x: 0, y: 0 },
          isSelected: true,
        };
        fileSystemStore.createItemDialog(desktopItem);
      }
    },
    disabled: false,
  };
};

export const openFileWith = (filePaths: string[]) => {
  if (filePaths.length === 1) {
    const itemExtension = getFileExtensionFromName(filePaths[0]);
    const fileTypeConfiguration = fileTypesConfiguration[itemExtension];
    if (fileTypeConfiguration && fileTypeConfiguration.openWith) {
      return {
        materialIcon: "mdi-open-in-new",
        iconOnly: false,
        horizontalGroup: false,
        groupName: "other",
        actionName: "Open with",
        callback: () => {
          console.log("HEY");
        },
        disabled: false,
      };
    }
  }
};

const addFilesFromPathRecursivelyToList = async (
  filePaths: string[],
  existingList: { fileName: string; contentBase64: string }[]
) => {
  for (const path of filePaths) {
    const isFolder = await isDir(path);
    if (isFolder) {
      const filesPathFromFolder = await getFiles(path, true);
      await addFilesFromPathRecursivelyToList(filesPathFromFolder, existingList);
    } else {
      const fileContent = await readFile(path);
      existingList.push({ fileName: path, contentBase64: fileContent });
    }
  }
  return existingList;
};
