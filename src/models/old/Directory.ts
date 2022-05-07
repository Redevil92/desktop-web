import Item from "./Item";
import _ from "lodash";
import Coordinates from "../Coordinates";

export const DIRECTORY_TYPE = {
  DEFAULT: "DEFAULT",
};

export const getDirectoryTypeFromType = (type: string) => {
  if (type.toLowerCase() === "default") {
    return DIRECTORY_TYPE.DEFAULT;
  }
};

export default class Directory extends Item {
  #type: string = DIRECTORY_TYPE.DEFAULT;
  #children = new Map();

  constructor(name = "", coordinates: Coordinates, type = DIRECTORY_TYPE.DEFAULT) {
    super(name || "un-named directory", coordinates);
    this.#type = (getDirectoryTypeFromType(type) as string) ? type : DIRECTORY_TYPE.DEFAULT;
  }

  get content(): any[] {
    return Array.from(this.#children.values());
  }

  get type(): string {
    return this.#type;
  }

  get copy(): Directory {
    const dirCopy = new Directory(`${this.name} copy`, this.coordinates, this.type);

    this.content.forEach((item) => {
      const itemCopy = item.copy;
      itemCopy.name = item.name;
      itemCopy.coordinates = item.coordinates;
      dirCopy.insertItem(itemCopy);
    });

    return dirCopy;
  }

  hasItem(itemName: string) {
    return this.#children.has(itemName);
  }

  insertItem(item: Item) {
    if (this.hasItem(item.name)) return true;

    if (item === this) throw new Error("Directory cannot contain itself");

    let parent = this.parent;

    while (!_.isEmpty(this.parent)) {
      if (parent === item) {
        throw new Error("Directory cannot contain one of its ancestors");
      }
      parent = parent.parent;
    }

    this.#children.set(item.name, item);
    item.parent = this;

    return this.hasItem(item.name);
  }

  getItem(itemName: string) {
    return this.#children.get(itemName) || null;
  }

  removeItem(itemName: string) {
    const item = this.getItem(itemName);

    if (item) {
      this.#children.delete(itemName);
      item.parent = null;
    }

    return !this.hasItem(itemName);
  }
}
