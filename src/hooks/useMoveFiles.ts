import { copyFile } from "@/context/fileSystemController";
import { getSourcePathFromFilePath } from "@/context/fileSystemUtils";
import store from "@/store";

export default function useMoveFiles() {
  const setFilesToMove = (filesToMove: string[]) => {
    console.log("down", filesToMove);
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", filesToMove);
  };

  const moveFilesOrResetFilesToMove = (moveDestination: string) => {
    console.log("up", moveDestination);
    const filesToMove: string[] = store.getters["fileSystem/GET_FILE_PATHS_TO_MOVE"];

    let sourceFilesToMovePath = "";
    if (moveDestination && filesToMove.length > 0 && getSourcePathFromFilePath(filesToMove[0]) !== moveDestination) {
      filesToMove.forEach((filePath) => {
        //await copyFile;
        // delete file ect
      });
    }
    store.dispatch("fileSystem/SET_FILE_PATHS_TO_MOVE", []);
  };

  return { setFilesToMove, moveFilesOrResetFilesToMove };
}
