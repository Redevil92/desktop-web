import {
  DESKTOP_PATH,
  DOCUMENT_PATH,
  MUSIC_PATH,
  MY_PC_PATH,
  VIDEOS_PATH,
  PICTURES_PATH,
  START_MENU_PATH,
} from "@/constants";
import PathAndIcon from "@/models/PathAndIcon";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    desktopImage: "mountain.png",
    desktopImagesList: ["mountain.png", "mountain2.jpg", "mountain3.png"],
    favouritesPathListAndIcon: [
      { path: DESKTOP_PATH, mdiIcon: "mdi-monitor" },
      { path: MY_PC_PATH, mdiIcon: "mdi-folder-home" },
      { path: DOCUMENT_PATH, mdiIcon: "mdi-file-document-multiple-outline" },
      { path: MUSIC_PATH, mdiIcon: "mdi-folder-music-outline" },
      { path: VIDEOS_PATH, mdiIcon: "mdi-folder-play-outline" },
      { path: PICTURES_PATH, mdiIcon: "mdi-folder-image" },
      { path: START_MENU_PATH, mdiIcon: "mdi-apps-box" },
    ] as PathAndIcon[],
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
