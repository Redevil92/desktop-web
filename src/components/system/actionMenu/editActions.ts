import { isDir } from "@/context/fileSystemController";
import { ActionItem } from "@/models/ActionMenu";
import { useFileSystemStore } from "@/stores/fileSystemStore";

const refreshFiles = () => {
  const fileSystemStore = useFileSystemStore();
  fileSystemStore.refreshAllItemDialogFiles();
  fileSystemStore.fetchDesktopItems();
};

export const getEditActions = async (paths: string[]) => {
  const canPaste = paths.length === 1 && (await isDir(paths[0]));
  const editActions = [copyAction(paths), cutAction(paths), deleteAction(paths)];
  if (canPaste) {
    editActions.push(pasteAction(paths[0]));
  }
  return editActions;
};

export const copyAction = (pathsToCopy: string[], disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "copy.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Copy",
    callback: () => {
      fileSystemStore.setFilePathsToCopy(pathsToCopy);
    },
    disabled: false,
  };
};

export const cutAction = (pathsToCut: string[], disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "cut.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Cut",
    callback: () => {
      fileSystemStore.setFilePathsToCut(pathsToCut);
    },
    disabled: false,
  };
};

export const pasteAction = (destinationPath: string, disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "paste.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Cut",
    callback: async () => {
      await fileSystemStore.pasteFiles(destinationPath);
      refreshFiles();
    },
    disabled: false,
  };
};

export const deleteAction = (pathsToDelete: string[], disabled = false): ActionItem => {
  const fileSystemStore = useFileSystemStore();
  return {
    icon: "trash.svg",
    iconOnly: true,
    groupName: "edit",
    horizontalGroup: true,
    actionName: "Delete",
    callback: async () => {
      for (const path of pathsToDelete) {
        await fileSystemStore.deleteFileSystemItem(path);
      }
      refreshFiles();
    },
    disabled: false,
  };
};
