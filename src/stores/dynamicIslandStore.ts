import DynamicIslandItem from "@/models/DynamicIslandItem";
import { defineStore } from "pinia";

export const useDynamicIslandStore = defineStore("dynamicIsland", {
  state: () => ({
    showDynamicIsland: false,
    items: [] as DynamicIslandItem[],
  }),
  getters: {},
  actions: {
    addDynamicIslandItem(item: DynamicIslandItem) {
      this.items.push(item);
    },
    removeDynamicIslandItem(itemGuid: string) {
      const index = this.items.findIndex((item) => item.itemDialogGuid === itemGuid);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
  },
});
