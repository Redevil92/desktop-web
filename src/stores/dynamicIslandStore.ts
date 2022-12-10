import DynamicIslandItem from "@/models/DynamicIslandItem";
import { defineStore } from "pinia";

export const useDynamicIslandStore = defineStore("dynamicIsland", {
  state: () => ({
    showDynamicIsland: true,
    items: [] as DynamicIslandItem[],
  }),
  getters: {},
  actions: {
    addDynamicIslandItem(item: DynamicIslandItem) {
      this.items.push(item);
      this.items = [...this.items];
    },
    setShowDynamicIsland(show: boolean) {
      this.showDynamicIsland = show;
    },
    removeDynamicIslandItem(itemGuid: string) {
      const index = this.items.findIndex((item) => item.itemDialogGuid === itemGuid);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
      this.items = [...this.items];
    },
  },
});
