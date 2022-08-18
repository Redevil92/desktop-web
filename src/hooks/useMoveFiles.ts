import { copyFile, deleteFile, isDir } from "@/context/fileSystemController";
import { getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import store from "@/store";
import { onMounted, onUnmounted, watchEffect } from "vue";

export default function useMoveFiles(moveDestinationPath: string) {
  const setFilesToMove = (filesToMove: string[]) => {
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", filesToMove);
  };

  const moveFilesOrResetFilesToMove = async (filePathsToMove: string, destinationPath: string) => {
    const filesToMove: string[] = [...store.getters["fileSystem/GET_FILE_PATHS_TO_MOVE"]];

    const isDestinationPathFolder = await isDir(moveDestinationPath);
  };

  const refreshFiles = async () => {
    await store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
    await store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
  };

  return { setFilesToMove, moveFilesOrResetFilesToMove };
}
