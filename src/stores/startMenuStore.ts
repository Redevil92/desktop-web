import TaskBarItem from '@/models/TaskBarItem';
import { defineStore } from 'pinia';

export const useStartMenuStore = defineStore('startMenu', {
  state: () => ({
    pinnedApps: [
      { app: 'settings', name: 'Settings', icon: 'settings.svg' },
      { app: 'text', name: 'Text File', icon: 'txt.svg' },
      { app: 'browser', name: 'Browser', icon: 'browser.svg' },
      { app: 'Doom', name: 'Doom', icon: 'Doom.png' },
      { app: 'Duke Nukem 2', name: 'Duke Nukem 2', icon: 'Duke Nukem 2.png' },
      { app: 'Duke Nukem 3D', name: 'Duke Nukem 3D', icon: 'Duke Nukem 3D.png' },
      { app: 'Wolfenstein 3D', name: 'Wolfenstein 3D', icon: 'Wolfenstein 3D.png' },
      { app: 'Commander Keen 4', name: 'Commander Keen 4', icon: 'Commander Keen 4.png' },
      { app: 'Digger', name: 'Digger', icon: 'Digger.png' },
      { app: 'Blake Stone', name: 'Blake Stone', icon: 'Blake Stone.png' }
    ] as TaskBarItem[],
    suggestionFiles: [ 'my PC/Desktop/resume_stefano_badalucco.pdf']
  }),
  getters: {},
  actions: {
    setPinnedApps(pinnedApps: TaskBarItem[]) {
      this.pinnedApps = pinnedApps;
    }
  }
});
