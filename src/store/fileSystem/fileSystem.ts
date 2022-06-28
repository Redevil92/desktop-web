import { getDesktopFiles } from "@/context/fileSystemController";
import DesktopItem from "@/models/DesktopItem";
import ItemDialog from "@/models/ItemDialog";
import { v4 as uuidv4 } from "uuid";

export default {
  namespaced: true,
  state(): FileSystemState {
    return {
      desktopItems: [],
      itemsDialog: [],
      fileCopied: undefined,
      fileCut: undefined,
      actionsBox: undefined,
    };
  },
  mutations: {
    ADD_ITEM_DIALOG: (state: FileSystemState, itemDialog: ItemDialog) => {
      state.itemsDialog.push(itemDialog);
      state.itemsDialog = [...state.itemsDialog];
    },
    CLOSE_ITEM_DIALOG: (state: FileSystemState, itemDialogGuid: string) => {
      const index = state.itemsDialog.findIndex((dir) => dir.guid === itemDialogGuid);
      state.itemsDialog.splice(index, 1);
      state.itemsDialog = [...state.itemsDialog];
    },
    UPDATE_ITEM_DIALOG_POSITION: (state: FileSystemState, itemToUpdate: ItemDialog) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        state.itemsDialog[index].position = itemToUpdate.position;
      }

      state.itemsDialog = [...state.itemsDialog];
    },
    UPDATE_ITEM_DIALOG_DIMENSION: (state: FileSystemState, itemToUpdate: ItemDialog) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemToUpdate.guid);
      if (index !== -1) {
        state.itemsDialog[index].dimension = itemToUpdate.dimension;
      }

      state.itemsDialog = [...state.itemsDialog];
    },
    MINIMIZE_ITEM_DIALOG: (state: FileSystemState, itemGuid: string) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemGuid);
      if (index !== -1) {
        state.itemsDialog[index].isCollapsed = true;
      }
      state.itemsDialog = [...state.itemsDialog];
    },
    OPEN_MINIMIZED_ITEM_DIALOG: (state: FileSystemState, itemGuid: string) => {
      const index = state.itemsDialog.findIndex((item) => item.guid === itemGuid);
      if (index !== -1) {
        state.itemsDialog[index].isCollapsed = false;
      }
      state.itemsDialog = [...state.itemsDialog];
    },
    SET_FOCUSED_ITEM_DIALOG: (state: FileSystemState, itemDialog: ItemDialog) => {
      const itemsToUpdate = [...state.itemsDialog];
      itemsToUpdate.forEach((item) => (item.isFocused = false));
      const index = itemsToUpdate.findIndex((item) => item.guid === itemDialog.guid);
      if (index !== -1) {
        itemsToUpdate[index].isFocused = true;
      }
      state.itemsDialog = itemsToUpdate;
    },
    SET_DESKTOP_ITEMS: (state: FileSystemState, desktopItems: File[]) => {
      state.desktopItems = desktopItems;
    },
  },
  actions: {
    ADD_ITEM_DIALOG: ({ commit, dispatch }: any, itemDialogName: DesktopItem) => {
      const newItemDialog = {
        name: itemDialogName.name,
        mimeType: itemDialogName.mimeType,
        guid: uuidv4(),
        isCollapsed: false,
        zIndex: 1,
        dimension: { height: 300, width: 500 },
      } as ItemDialog;
      commit("ADD_ITEM_DIALOG", newItemDialog);
      dispatch("SET_FOCUSED_ITEM_DIALOG", newItemDialog);
    },
    CLOSE_ITEM_DIALOG: ({ commit }: any, itemDialogGuid: string) => {
      commit("CLOSE_ITEM_DIALOG", itemDialogGuid);
    },
    MINIMIZE_ITEM_DIALOG: ({ commit }: any, itemDialogGuid: string) => {
      commit("MINIMIZE_ITEM_DIALOG", itemDialogGuid);
    },
    UPDATE_ITEM_DIALOG_POSITION: ({ commit }: any, itemDialogToUpdate: ItemDialog) => {
      commit("UPDATE_ITEM_DIALOG_POSITION", itemDialogToUpdate);
    },
    UPDATE_ITEM_DIALOG_DIMENSION: ({ commit }: any, itemDialogToUpdate: ItemDialog) => {
      commit("UPDATE_ITEM_DIALOG_DIMENSION", itemDialogToUpdate);
    },
    OPEN_MINIMIZED_ITEM_DIALOG: ({ commit }: any, itemDialogGuid: string) => {
      commit("OPEN_MINIMIZED_ITEM_DIALOG", itemDialogGuid);
    },
    SET_FOCUSED_ITEM_DIALOG: ({ commit }: any, itemDialog: ItemDialog) => {
      commit("SET_FOCUSED_ITEM_DIALOG", itemDialog);
    },
    FETCH_DESKTOP_FILES: ({ commit }: any) => {
      const desktopFiles = getDesktopFiles(true);
      console.log(desktopFiles);
      commit("SET_DESKTOP_ITEMS", desktopFiles);
    },
  },
  getters: {
    GET_ITEMS_DIALOG: (state: FileSystemState) => state.itemsDialog,
    GET_FOCUSED_ITEM_DIALOG: (state: FileSystemState) => state.itemsDialog.find((item: ItemDialog) => item.isFocused),
    GET_DESKTOP_FILES: (state: FileSystemState) => state.desktopItems,
  },
};

interface FileSystemState {
  desktopItems: File[]; // done
  itemsDialog: ItemDialog[]; // in progress
  fileCopied?: File; // todo
  fileCut?: File; // todo
  actionsBox?: ActionsBox; // todo
}

interface ActionsBox {
  isVisible: boolean;
  activeFile: File;
  availableActions: Action[];
}

interface Action {
  text: string;
  icon?: string;
}
