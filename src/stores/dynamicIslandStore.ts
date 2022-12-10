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
      console.log("ADDING DYNMM", item);
      this.items.push(item);
      this.items = [...this.items];
      console.log(this.items);
    },
    removeDynamicIslandItem(itemGuid: string) {
      console.log(this.items);
      const index = this.items.findIndex((item) => item.itemDialogGuid === itemGuid);
      console.log("try REMOVE items", itemGuid, this.items, index);
      if (index !== -1) {
        console.log("REMOVing items");
        this.items.splice(index, 1);
      }
      this.items = [...this.items];
    },
  },
});
