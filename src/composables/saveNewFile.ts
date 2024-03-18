import { SEVERITY } from '@/constants';
import { getFileNameFromPath } from '@/context/utils/fileSystemUtils';
import useBase64Handler from '@/hooks/useBase64Handler';
import ItemDialog from '@/models/ItemDialog';
import { useFileSystemStore } from '@/stores/fileSystemStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { onMounted, onUnmounted, toValue, watchEffect } from 'vue';

export function useSaveNewFile(isKeydownEnabled: boolean, callback: Function) {
  const fileSystemStore = useFileSystemStore();
  const layoutStore = useLayoutStore();

  const { utf8ToB64 } = useBase64Handler();

  const saveTextFileHandler = async (
    itemDialog: ItemDialog,
    destinationPath: string,
    fileValue: string
  ) => {
    const destinationPathToSave = destinationPath;

    await fileSystemStore.createFile({
      path: destinationPathToSave,
      content: utf8ToB64(fileValue)
    });
    //showSaveAsDialog.value = false;

    const itemDialogToUpdate = { ...itemDialog };
    itemDialogToUpdate.name = getFileNameFromPath(destinationPathToSave);
    itemDialogToUpdate.path = destinationPathToSave;
    fileSystemStore.updateItemDialog(itemDialogToUpdate);

    fileSystemStore.refreshAllItemDialogFiles();
    fileSystemStore.fetchDesktopItems();

    layoutStore.setSnackBar({
      show: true,
      text: `"${getFileNameFromPath(destinationPathToSave)}" created.`,
      severity: SEVERITY.information
    });
  };

  const keyDownHandler = async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 's' && toValue(isKeydownEnabled)) {
      event.preventDefault();
      onCtrlSPressed();
    }
  };

  const onCtrlSPressed = () => {
    if (toValue(isKeydownEnabled)) {
      toValue(callback());
    }
  };

  watchEffect(() => {
    onCtrlSPressed();
  });

  onMounted(() => {
    window.addEventListener('keydown', keyDownHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', keyDownHandler);
  });

  return { saveTextFileHandler };
}
