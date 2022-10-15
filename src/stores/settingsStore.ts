import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    desktopImage: "mountain.png",
    desktopImagesList: ["mountain.png", "mountain2.jpg", "mountain3.png"],
  }),
  getters: {},
  actions: {
    setDesktopImage(imageName: string) {
      this.desktopImage = imageName;
    },
    setDesktopImagesList(images: string[]) {
      this.desktopImagesList = images;
    },
    addDesktopImageToList(image: string) {
      this.desktopImagesList.push(image);
    },
    removeDesktopImageToList(imageToRemove: string) {
      const index = this.desktopImagesList.findIndex((image) => image === imageToRemove);
      if (index !== -1) {
        this.desktopImagesList.splice(index, 1);
      }
    },
  },
});
