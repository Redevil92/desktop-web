import { DESKTOP_PATH } from "@/constants";
import { copyFile, deleteFile } from "@/context/fileSystemController";
import { getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import DesktopItem from "@/models/DesktopItem";
import store from "@/store";
import { computed } from "vue";

export default function useMoveFiles() {
  const filePathsToMove = computed((): string[] => {
    return store.getters["fileSystem/GET_FILE_PATHS_TO_MOVE"];
  });

  const setFilesToMove = (filesToMove: string[]) => {
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", filesToMove);
  };

  const resetFilesToMove = () => {
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", []);
  };

  const isChangingFilePosition = (destinationPath: string) => {
    console.log(getSourcePathFromFilePath(filePathsToMove.value[0]), destinationPath);
    if (
      filePathsToMove.value.length > 0 &&
      getSourcePathFromFilePath(filePathsToMove.value[0]) === destinationPath &&
      destinationPath === DESKTOP_PATH
    ) {
      return true;
    }
    return false;
  };

  const moveFilesInFolderFromDesktop = async (event: Event, destinationPath: string) => {
    const filesToMove = store.getters["fileSystem/GET_SELECTED_DESKTOP_FILES"].map(
      (desktopItem: DesktopItem) => desktopItem.path
    ) as string[];
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

  // const saveDesktopFilePosition = () => {};

  const refreshFiles = async () => {
    await store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
    await store.dispatch("fileSystem/FETCH_DESKTOP_ITEMS");
  };

  return {
    setFilesToMove,
    moveFilesInFolderFromDesktop,
    moveFilesInFolder,
    resetFilesToMove,
    isChangingFilePosition,
  };
}
