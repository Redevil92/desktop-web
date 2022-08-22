import { copyFile, deleteFile } from "@/context/fileSystemController";
import { getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import store from "@/store";
import { computed } from "vue";

export default function useMoveFiles() {
  const filePathsToMove = computed((): string[] => {
    return store.getters["fileSystem/GET_FILE_PATHS_TO_MOVE"];
  });

  const setFilesToMove = (filesToMove: string[]) => {
    console.log("HELLO MAN");
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", filesToMove);
  };

  const resetFilesToMove = () => {
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", []);
  };

  const moveFilesInFolder = async (event: Event, destinationPath: string) => {
    event.stopPropagation();
    event.preventDefault();

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
    await store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
    await store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
  };

  return { setFilesToMove, moveFilesInFolder, resetFilesToMove };
}
