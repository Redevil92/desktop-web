import * as editActions from "@/components/system/actionMenu/editActions";
import { compressToZipFileAction } from "./compressedFileActions";

export const getFileActions = async (paths: string[]) => {
  const fileActions = await [
    editActions.copyAction(paths),
    editActions.cutAction(paths),
    editActions.deleteAction(paths),
    await editActions.pasteAction(paths[0]),
    await compressToZipFileAction(paths),
  ];
  return fileActions;
};
