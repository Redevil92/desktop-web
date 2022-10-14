import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    desktopImage: "mountain.png",
  }),
  getters: {},
  actions: {
    setDesktopImage(imageName: string) {
      this.desktopImage = imageName;
    },
  },
});
