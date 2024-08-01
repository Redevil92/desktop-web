import Avatar, { defaultAvatar } from "@/components/system/avatarEditor/Avatar";
import {
  DESKTOP_PATH,
  DOCUMENT_PATH,
  MUSIC_PATH,
  MY_PC_PATH,
  VIDEOS_PATH,
  PICTURES_PATH,
  START_MENU_PATH,
} from "@/constants";
import fileSystem from "@/context/fileSystemController";
import PathAndIcon from "@/models/PathAndIcon";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    wallpaperPath: `my PC/Pictures/Wallpapers/mountain.png`,
    wallpaperList: [] as string[],
    favouritesPathListAndIcon: [
      { path: DESKTOP_PATH, mdiIcon: "mdi-monitor" },
      { path: MY_PC_PATH, mdiIcon: "mdi-folder-home" },
      { path: DOCUMENT_PATH, mdiIcon: "mdi-file-document-multiple-outline" },
      { path: MUSIC_PATH, mdiIcon: "mdi-folder-music-outline" },
      { path: VIDEOS_PATH, mdiIcon: "mdi-folder-play-outline" },
      { path: PICTURES_PATH, mdiIcon: "mdi-folder-image" },
      { path: START_MENU_PATH, mdiIcon: "mdi-apps-box" },
    ] as PathAndIcon[],
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:MM XM",
    darkMode: true,
    avatar: defaultAvatar as Avatar | undefined,
  }),
  getters: {},
  actions: {
    setAvatar(avatar: Avatar) {
      this.avatar = avatar;
    },
    setWallpaperPath(path: string) {
      this.wallpaperPath = path;
    },
    async loadWallpapers() {
      // Load wallpapers
      const wallpapers = await fileSystem.getFiles(
        "my PC/Pictures/Wallpapers",
        true
      );
      this.wallpaperList = wallpapers;
    },
  },
  persist: true,
});
