import { onMounted, onUnmounted, ref } from "vue";
import { useFileSystemStore } from "@/stores/fileSystemStore";

export default function useKeyboardShortcut() {
  const keydown = ref("");
  const fileSystemStore = useFileSystemStore();

  const keyDownHandler = (event: KeyboardEvent) => {
    const itemDialogFocused = fileSystemStore.itemsDialog.find((item) => item.isFocused);
    console.log(itemDialogFocused);
    if (event.ctrlKey && event.key === "c") {
      // if(itemDialogFocused && itemDialogFocused.)
      fileSystemStore.setFilePathsToCopy([]);
    } else if (event.ctrlKey && event.key === "v") {
      fileSystemStore.pasteFiles("");
    } else if (event.ctrlKey && event.key === "x") {
      fileSystemStore.setFilePathsToCut([]);
    } else if (event.key === "Delete") {
      console.log("HEI UOMO, delete");
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", keyDownHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", keyDownHandler);
  });

  return { keydown };
}
