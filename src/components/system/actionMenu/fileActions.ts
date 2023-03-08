import ActionItem from "@/models/ActionMenu/ActionItem";
import {
  copyAction,
  cutAction,
  deleteAction,
  pasteAction,
  compressToZipFileAction,
  downloadFileAction,
  createShortcut,
  openFileAction,
  openFileWith,
} from "./actionsList";

export const getFileActions = async (paths: string[], event: PointerEvent): Promise<(ActionItem | undefined)[]> => {
  const fileActions = await [
    copyAction(paths),
    cutAction(paths),
    deleteAction(paths),
    await pasteAction(paths[0]),
    await compressToZipFileAction(paths),
    createShortcut(paths),
    downloadFileAction(paths),
    await openFileAction(paths),
    openFileWith(paths),
  ];
  return fileActions;
};
