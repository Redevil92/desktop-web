import DynamicIslandItem from "@/models/DynamicIslandItem";
import { defineStore } from "pinia";

export const useDynamicIslandStore = defineStore("dynamicIsland", {
  state: () => ({
    showDynamicIsland: false,
    items: [] as DynamicIslandItem[],
  }),
  getters: {},
  actions: {},
});
