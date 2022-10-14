import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    startMenuOpened: false,
  }),
  getters: {},
  actions: {
    setStartMenuOpened(isOpen: boolean) {
      this.startMenuOpened = isOpen;
    },
  },
});
