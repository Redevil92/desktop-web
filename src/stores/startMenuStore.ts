import TaskBarItem from "@/models/TaskBarItem";
import { defineStore } from "pinia";

export const useStartMenuStore = defineStore("startMenu", {
  state: () => ({
    pinnedApps: [
      { app: "settings", name: "Settings", icon: "settings.svg" },
      { app: "text", name: "Text File", icon: "txt.svg" },
      { app: "browser", name: "Browser", icon: "browser.svg" },
      { app: "Doom", name: "Doom", icon: "Doom.png" },
      { app: "WarCraft- Orcs & Humans", name: "WarCraft", icon: "WarCraft- Orcs & Humans.png" },
      { app: "Duke Nukem 3D", name: "Duke Nukem 3D", icon: "Duke Nukem 3D.png" },
      { app: "Sim City", name: "Sim City", icon: "Sim City.png" },
      { app: "Prince of Persia", name: "Prince of Persia", icon: "Prince of Persia.png" },
      { app: "Grand Theft Auto", name: "GTA", icon: "Grand Theft Auto.png" },
      { app: "Mortal Kombat", name: "Mortal Kombat", icon: "Mortal Kombat.png" },
    ] as TaskBarItem[],
  }),
  getters: {},
  actions: {
    setPinnedApps(pinnedApps: TaskBarItem[]) {
      this.pinnedApps = pinnedApps;
    },
  },
});
