import { onMounted, onUnmounted } from "vue";
import { useFileSystemStore } from "@/stores/fileSystemStore";
import fileSystem from "@/context/fileSystemController";
import { DESKTOP_PATH } from "@/constants";

export default function useKeyboardShortcut() {
  const fileSystemStore = useFileSystemStore();

  const keyDownHandler = async (event: KeyboardEvent) => {
    const itemDialogFocused = fileSystemStore.itemsDialog.find((item) => item.isFocused);

    let isFolder = false;
    if (itemDialogFocused && itemDialogFocused.path) {
      isFolder = await fileSystem.isDir(itemDialogFocused.path);
    }

    let elementsSelected: string[] = [];
    if (!itemDialogFocused) {
      elementsSelected = fileSystemStore.getSelectedDesktopItems.map((item) => item.path);
    } else if (itemDialogFocused.selectedFilesPath) {
      elementsSelected = itemDialogFocused.selectedFilesPath;
    }

    if (event.ctrlKey && event.key === "c") {
      fileSystemStore.setFilePathsToCopy(elementsSelected);
    } else if (event.ctrlKey && event.key === "v") {
      if (itemDialogFocused) {
        if (isFolder) {
          fileSystemStore.pasteFiles(itemDialogFocused.path);
        }
      } else {
        fileSystemStore.pasteFiles(DESKTOP_PATH);
      }
    } else if (event.ctrlKey && event.key === "x") {
      fileSystemStore.setFilePathsToCut(elementsSelected);
    } else if (event.key === "Delete") {
      for (const path of elementsSelected) {
        await fileSystemStore.deleteFileSystemItem(path);
      }
      fileSystemStore.refreshAllItemDialogFiles();
      fileSystemStore.fetchDesktopItems();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", keyDownHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", keyDownHandler);
  });

  return {};
}
