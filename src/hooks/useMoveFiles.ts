import { copyFile, deleteFile, isDir } from "@/context/fileSystemController";
import { getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import store from "@/store";
import { onMounted, onUnmounted, watchEffect } from "vue";

export default function useMoveFiles(moveDestinationPath: string) {
  const setFilesToMove = (filesToMove: string[]) => {
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", filesToMove);
  };

  const moveFilesOrResetFilesToMove = async () => {
    const filesToMove: string[] = [...store.getters["fileSystem/GET_FILE_PATHS_TO_MOVE"]];
    console.log("*up*", filesToMove, "dest", moveDestinationPath);
    const isDestinationPathFolder = await isDir(moveDestinationPath);

    if (
      moveDestinationPath &&
      filesToMove.length > 0 &&
      getSourcePathFromFilePath(filesToMove[0]) !== moveDestinationPath &&
      isDestinationPathFolder
    ) {
      store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", []);
      for (const file of filesToMove) {
        await copyFile(file, moveDestinationPath);
        await deleteFile(file);
      }

      store.dispatch("fileSystem/REFRESH_ALL_ITEM_DIALOG_FILES");
      store.dispatch("fileSystem/FETCH_DESKTOP_FILES");
    } else {
      setTimeout(() => {
        store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", []);
      }, 0);
    }
  };

  const moveFilesOrResetFilesToMoveWithDelay = async () => {
    setTimeout(() => {
      moveFilesOrResetFilesToMove();
    }, 10);
  };

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  //onMounted(() => window.addEventListener("mouseup", moveFilesOrResetFilesToMove));
  onUnmounted(() => {
    window.removeEventListener("mouseup", moveFilesOrResetFilesToMoveWithDelay);
  });

  return { setFilesToMove, moveFilesOrResetFilesToMove };
}
