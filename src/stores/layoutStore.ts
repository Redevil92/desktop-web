import { defineStore } from "pinia";

import { SEVERITY } from "@/constants";
import SnackBar from "@/models/SnackBar";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    startMenuOpened: false,
    snackBar: { show: false, text: "", severity: SEVERITY.information } as SnackBar,
    snackBarDurationTime: 3000 as number,
  }),
  getters: {
    showSnackBar(): boolean {
      return this.snackBar.show;
    },
  },
  actions: {
    setStartMenuOpened(isOpen: boolean) {
      this.startMenuOpened = isOpen;
    },
    setSnackBar(snackBar: SnackBar) {
      this.snackBar = snackBar;
    },
    resetSnackBar() {
      this.snackBar = { show: false, text: "", severity: SEVERITY.information };
    },
  },
});
