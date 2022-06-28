import Directory, { DIRECTORY_TYPE } from "./Directory";
import FileItem from "./FileItem";
import Item from "./Item";

import _ from "lodash";
import Coordinates from "./Coordinates";

export default class FilingSystem {
  #self = new Directory("root", { x: 0, y: 0 });
  #currentDirectory = this.#self;
  #currentDirectoryPath = [this.#currentDirectory]; // as stack
  // #currentUser = 'root';

  get currentDirectory() {
    return this.#currentDirectory;
  }

  get currentDirectoryPath() {
    return this.#currentDirectoryPath
      .map((dir) => {
        if (dir.name) {
          return `${dir.name}`;
        }
      })
      .filter((dir) => {
        if (dir) {
          return dir;
        }
      });
  }

  get root() {
    return this.#self;
  }

  get parent() {
    return null;
  }

  get name() {
    return this.root.name;
  }

  get copy() {
    const fsCopy = new FilingSystem();

    this.root.content.forEach((item) => {
      const itemCopy = item.copy;
      itemCopy.name = item.name;
      fsCopy.insertItem(itemCopy);
    });

    return fsCopy;
  }

  get content() {
    return this.currentDirectory.content;
  }

  createFile(fileName: string, coordinates = { x: 0, y: 0 }, mimeType = "text/plain", ...options: any[]) {
    const newFile = new FileItem(fileName, coordinates, mimeType, ...options);

    const inserted = this.insertItem(newFile);

    return inserted ? newFile : null;
  }

  createDirectory(dirName: string, coordinates = { x: 0, y: 0 }, type = DIRECTORY_TYPE.DEFAULT) {
    const newDir = new Directory(dirName, coordinates, type);

    const inserted = this.currentDirectory.insertItem(newDir);

    return inserted ? newDir : null;
  }

  insertItem(item: Item) {
    return this.currentDirectory.insertItem(item);
  }

  getItem(itemName: string) {
    return this.currentDirectory.getItem(itemName);
  }

  hasItem(itemName: string) {
    return this.currentDirectory.hasItem(itemName);
  }

  removeItem(itemName: string) {
    return this.currentDirectory.removeItem(itemName);
  }

  updateItemCoordonates(name: string, newCoordinates: Coordinates) {
    const item = this.getItem(name);

    if (item) {
      item.coordinates = newCoordinates;
      console.log("new item----", item);
      this.removeItem(name);
      this.insertItem(item);
      return item;
    }
    console.log("is null :(", item);
    return null;
  }

  renameItem(currentName: string, newName: string) {
    const item = this.getItem(currentName);

    if (!_.isEmpty(item)) {
      item.name = newName;
      this.removeItem(currentName);
      this.insertItem(item);
      return item;
    }

    return null;
  }

  copyItem(itemName: string) {
    const item = this.getItem(itemName);

    if (!_.isEmpty(item)) {
      const itemCopy = item.copy;
      this.insertItem(itemCopy);
      return itemCopy;
    }

    return null;
  }

  printCurrentDirectory() {
    console.log(
      `\n[${this.currentDirectoryPath.join("/")}]:` +
        (this.currentDirectory.content
          .map((item) => `\n[${item.constructor.name.substring(0, 1)}]-> ${item.name}`)
          .join("") || "\n(empty)")
    );
  }

  openDirectory(path: string): Directory | null {
    if (!path) return null;

    const dir = this.getDirectoryFromPath(path);

    if (!(dir && dir instanceof Directory)) {
      console.log(":(");
      return null;
    }

    const dirPath = [dir];
    let parent = dir.parent;

    while (parent) {
      dirPath.unshift(parent);
      parent = parent.parent;
    }

    console.log("THI IS WHAT WE FOUND", dir);

    this.#currentDirectory = dir;
    this.#currentDirectoryPath = dirPath;

    return dir;
  }

  findDirectoryByName(dirName: string) {
    const dirIndex = this.currentDirectoryPath.lastIndexOf(dirName, this.currentDirectoryPath.length) + 1;

    if (dirIndex < 0) return null;

    const dir = dirIndex === 0 ? this.root : this.#currentDirectoryPath[dirIndex];

    return dir;
  }

  goBack(steps = 1) {
    if (isNaN(steps) || steps <= 0 || steps >= this.currentDirectoryPath.length) return null;

    let dir = this.currentDirectory;
    let stepsMoved = steps;

    while (dir && stepsMoved > 0) {
      dir = dir.parent;
      stepsMoved -= 1;
    }

    if (dir && dir !== this.currentDirectory) {
      this.#currentDirectory = dir;
      this.#currentDirectoryPath = this.#currentDirectoryPath.slice(
        0,
        this.#currentDirectoryPath.length - (steps - stepsMoved)
      );
    }

    return dir;
  }

  goBackToDirectory(dirName: string) {
    const dirIndex = this.currentDirectoryPath.lastIndexOf(dirName, this.currentDirectoryPath.length) + 1;
    console.log("1", this.currentDirectoryPath, dirName, dirIndex);
    if (dirIndex < 0) return null;

    const dir = dirIndex === 0 ? this.root : this.#currentDirectoryPath[dirIndex];

    this.#currentDirectory = dir;
    this.#currentDirectoryPath = this.#currentDirectoryPath.slice(0, dirIndex + 1);

    return dir;
  }

  findItem(itemNameOrValidatorFunc: any, fromDirectory = this.root) {
    return this.#setupAndFind(itemNameOrValidatorFunc, fromDirectory);
  }

  findAllItems(itemNameOrValidatorFunc: any, fromDirectory = this.root) {
    return this.#setupAndFind(itemNameOrValidatorFunc, fromDirectory, true);
  }

  moveItemTo(itemName: string, dirPath: string) {
    const item = this.getItem(itemName);

    if (item) {
      const dir = this.getDirectoryFromPath(dirPath);

      if (dir && dir instanceof Directory) {
        dir.insertItem(item);
        return dir;
      }
    }

    return null;
  }

  #setupAndFind = (itemNameOrValidatorFunc: any, fromDirectory: Directory, multiple = false): Item | Item[] => {
    if (typeof itemNameOrValidatorFunc === "function") {
      return this.#findItem(itemNameOrValidatorFunc, fromDirectory, multiple);
    }

    const func = (item: Item) => item.name === itemNameOrValidatorFunc;
    return this.#findItem(func, fromDirectory, multiple);
  };

  #findItem = (isItem: any, dir: Directory, multiple = false): any => {
    let match: Item = {} as Item;
    const multipleMatch: Item[] = [];
    const directories = [];

    let item: any = dir.content;

    for (item of dir.content) {
      if (isItem(item)) {
        if (multiple) {
          multipleMatch.push(item);
        } else {
          match = item;
          break;
        }
      }

      if (item instanceof Directory) {
        directories.push(item);
      }
    }

    if ((match === ({} as Item) || multiple) && directories.length) {
      for (const subDir of directories) {
        const found = this.#findItem(isItem, subDir, multiple);
        if (multiple) {
          multipleMatch.push(...found);
        } else if (found) {
          match = found;
          break;
        }
      }
    }

    return multiple ? multipleMatch : match;
  };

  getDirectoryFromPath = (dirPath: string) => {
    if (dirPath.match(/^(root\/?|\/)$/g)) {
      return this.root;
    }

    if (dirPath.match(/^\.\/?$/g)) {
      return this.currentDirectory;
    }

    let dir = dirPath.match(/^(root\/?|\/)/g) ? this.root : this.currentDirectory;
    const paths = dirPath.replace(/^(root\/|\.\/|\/)/g, "").split("/");

    if (paths && paths !== undefined) {
      while (paths.length) {
        dir = dir.getItem(paths.shift() || "");

        if (!dir || !(dir instanceof Directory)) {
          return null;
        }
      }
    }

    if (paths.length === 0) {
      return dir;
    }

    return null;
  };
}
