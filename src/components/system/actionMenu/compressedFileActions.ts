import { readFile } from "@/context/fileSystemController";
import { getFileNameFromPath, getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import useCompression from "@/hooks/useCompression";
import { ActionItem } from "@/models/ActionMenu";
import DesktopItem from "@/models/DesktopItem";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export const compressedFileActions = async (filePath: string) => await [extractFilesInFolder(filePath)];

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

// TODO:
// create the other compression actions
// add this actions to filesType in the field additionalActions (compression item)
// add the additional actions to FolderItem.vue in openActionMenu function
export const compressToZipFileAction = (filePaths: string[], disabled = false, iconOnly = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  const { compressToZipFile } = useCompression();

  return {
    materialIcon: "mdi-folder-zip",
    iconOnly,
    groupName: "compression",
    horizontalGroup: false,
    actionName: "Comptess to ZIP file",
    callback: async () => {
      const filesToZip: { fileName: string; contentBase64: string }[] = [];
      for (const path of filePaths) {
        const fileContent = await readFile(path);
        filesToZip.push({ fileName: path, contentBase64: fileContent });
      }
      const zippedFile = await compressToZipFile(filesToZip);
      console.log("NEW ZIPPED FILE", zippedFile);
    },
    disabled,
  };
};
