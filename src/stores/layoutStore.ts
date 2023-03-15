import { defineStore } from "pinia";
import { SEVERITY } from "@/constants";
import SnackBar from "@/models/SnackBar";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    startMenuOpened: false,
    loadingSpinner: { show: false, text: "" },
    snackbar: { show: false, text: "", severity: SEVERITY.information } as SnackBar,
    snackbarDurationTime: 3000 as number,
  }),
  getters: {
    showSnackBar(): boolean {
      return this.snackbar.show;
    },
  },
  actions: {
    setStartMenuOpened(isOpen: boolean) {
      this.startMenuOpened = isOpen;
    },
    setSnackBar(snackbar: SnackBar) {
      this.snackbar = snackbar;
    },
    resetSnackBar() {
      this.snackbar = { show: false, text: "", severity: SEVERITY.information };
    },
  },
});
