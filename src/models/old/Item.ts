import Directory from "./Directory";

import _ from "lodash";
import Coordinates from "../Coordinates";

export default class Item {
  #name = "";
  #parent: Directory = {} as Directory;
  #coordinates: Coordinates = { x: 0, y: 0 } as Coordinates;

  constructor(name: string, coordinates: Coordinates) {
    if (this.constructor.name === "Item") {
      throw new Error("Item class is Abstract. It can only be extended");
    }

    this.name = name;
    this.coordinates = coordinates;
  }

  get path(): string {
    if (!_.isEmpty(this.parent)) {
      return `${this.parent.path}/${this.name}`;
    }

    return this.name;
  }

  get name(): string {
    return this.#name;
  }

  set name(newName: string) {
    const nameToUpdate = newName.replace("/", "");

    if (!nameToUpdate || !nameToUpdate.trim().length) {
      throw new Error("Item name must be a non empty string");
    }

    if (!_.isEmpty(this.parent) && this.parent.hasItem(newName)) {
      throw new Error(`Item with name of "${newName}" already exists in this directory`);
    }

    this.#name = nameToUpdate.trim();
  }

  get coordinates(): Coordinates {
    return this.#coordinates;
  }

  set coordinates(coordinates: Coordinates) {
    this.#coordinates = coordinates as Coordinates;
  }

  get parent(): Directory {
    return this.#parent;
  }

  set parent(newParent: Directory) {
    if (newParent !== this.#parent) {
      const prevParent = this.#parent;
      this.#parent = newParent;

      if (!_.isEmpty(prevParent)) {
        prevParent.removeItem(this.name);
      }

      if (!_.isEmpty(newParent)) {
        newParent.insertItem(this);
      }
    }
  }
}
