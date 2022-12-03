import { DESKTOP_PATH } from "@/constants";
import { copyFile, deleteFile } from "@/context/fileSystemController";
import { getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import DesktopItem from "@/models/DesktopItem";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import { computed } from "vue";

export default function useMoveFiles() {
  const fileSystemStore = useFileSystemStore();

  const filePathsToMove = computed((): string[] => {
    return fileSystemStore.filePathsToMove;
  });

  const setFilesToMove = (filesToMove: string[]) => {
    fileSystemStore.setFilePathsToMove(filesToMove);
  };

  const resetFilesToMove = () => {
    fileSystemStore.setFilePathsToMove([]);
  };

  const isChangingFilePosition = (destinationPath: string) => {
    if (
      filePathsToMove.value.length > 0 &&
      getSourcePathFromFilePath(filePathsToMove.value[0]) === destinationPath &&
      destinationPath === DESKTOP_PATH
    ) {
      return true;
    }
    return false;
  };

  const moveFilesInFolderFromDesktop = async (_: Event, destinationPath: string) => {
    const filesToMove = fileSystemStore.getSelectedDesktopItemsPath;
    moveFiles(filesToMove, destinationPath);
  };

  const moveFilesInFolder = async (_: Event, destinationPath: string) => {
    moveFiles(filePathsToMove.value, destinationPath);
  };

  const moveFiles = async (filesToMove: string[], destinationPath: string) => {
    console.log("MOVING FOLDERS OR FILE", filesToMove, destinationPath);
    if (filesToMove.length > 0 && getSourcePathFromFilePath(filesToMove[0]) === destinationPath) {
      console.log("HELLO");
      return;
    }

    for (const filePath of filesToMove) {
      await copyFile(filePath, destinationPath);
    }
    for (const filePath of filesToMove) {
      await deleteFile(filePath);
    }

    resetFilesToMove();
    refreshFiles();
  };

  const refreshFiles = async () => {
    await fileSystemStore.refreshAllItemDialogFiles();
    await fileSystemStore.fetchDesktopItems();
  };

  return {
    setFilesToMove,
    moveFilesInFolderFromDesktop,
    moveFilesInFolder,
    resetFilesToMove,
    isChangingFilePosition,
  };
}
