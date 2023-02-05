import { getFiles, isDir, readFile } from "@/context/fileSystemController";
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
      const filesToZip2: { fileName: string; contentBase64: string }[] = await addFilesFromPathRecursivelyToList(
        filePaths
      );
      const zippedFile = await compressToZipFile(filesToZip2);
      const zipFilePath = getSourcePathFromFilePath(filePaths[0]) + "/" + "zipFile.zip";
      await fileSystemStore.createFile({ path: zipFilePath, content: zippedFile }, false);
      await fileSystemStore.fetchDesktopItems();
      fileSystemStore.refreshAllItemDialogFiles();
    },
    disabled,
  };
};

const addFilesFromPathRecursivelyToList = async (filePaths: string[]) => {
  const filesList: { fileName: string; contentBase64: string }[] = [];
  for (const path of filePaths) {
    const isFolder = await isDir(path);
    if (isFolder) {
      const filesPathFromFolder = await getFiles(path, true);
      console.log("IS FOLDER AHHHHH", filesPathFromFolder);
      const folderFiles = await addFilesFromPathRecursivelyToList(filesPathFromFolder);
      filesList.concat(folderFiles);
    } else {
      const fileContent = await readFile(path);
      filesList.push({ fileName: path, contentBase64: fileContent });
    }
  }
  return filesList;
};
