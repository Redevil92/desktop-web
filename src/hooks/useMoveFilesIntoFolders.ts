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
    console.log("SET FILES TO MOVE", filesToMove);
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
    const filesToMove = fileSystemStore.getSelectedDesktopFiles.map((desktopItem) => desktopItem.path);
    if (filesToMove.length > 0 && getSourcePathFromFilePath(filesToMove[0]) === destinationPath) {
      return;
    }

    for (const filePath of filesToMove) {
      await copyFile(filePath, destinationPath);
    }
    for (const file of filesToMove) {
      await deleteFile(file);
    }

    refreshFiles();
  };

  const moveFilesInFolder = async (event: Event, destinationPath: string) => {
    // no drag and drop in the same folder
    if (filePathsToMove.value.length > 0 && getSourcePathFromFilePath(filePathsToMove.value[0]) === destinationPath) {
      return;
    }

    for (const filePath of filePathsToMove.value) {
      await copyFile(filePath, destinationPath);
    }
    for (const file of filePathsToMove.value) {
      await deleteFile(file);
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
