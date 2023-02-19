import {
  copyAction,
  cutAction,
  deleteAction,
  pasteAction,
  compressToZipFileAction,
  downloadFileAction,
} from "./ActionsList";

export const getFileActions = async (paths: string[]) => {
  const fileActions = await [
    copyAction(paths),
    cutAction(paths),
    deleteAction(paths),
    await pasteAction(paths[0]),
    await compressToZipFileAction(paths),
    downloadFileAction(paths),
  ];
  return fileActions;
};
