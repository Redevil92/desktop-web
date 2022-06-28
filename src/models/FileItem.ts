import Item from "./Item";

import _ from "lodash";
import Coordinates from "./Coordinates";

export default class FileItem extends Item {
  #type = "text";
  #mimeType = "txt";
  #textContent = "";
  #source: any = {} as any; // containing the browser file object

  constructor(name = "", coordinates: Coordinates, mimeType: string, textContent = "", source = {} as any) {
    super(name || "un-named file", coordinates);
    this.textContent = textContent;
    this.source = source;
    this.mimeType = mimeType;
  }

  get textContent(): string {
    return this.#textContent;
  }

  set textContent(content: string) {
    this.#textContent = `${content || ""}`;
  }

  get source(): any {
    return this.#source;
  }

  set source(newSource: FileItem) {
    this.#source = newSource;

    if (!_.isEmpty(newSource) && newSource.type) {
      const [type, mime] = newSource.type.split("/");
      const myMime = mime.match(/[\w-]+/g)?.toString() || "";

      this.#type = type || "text";
      //this.#mimeType = !myMime || myMime[0] === "plain" ? "txt" : myMime[0];
    }
  }

  get type(): string {
    return this.#type;
  }

  get mimeType(): string {
    return this.#mimeType;
  }

  set mimeType(myMimeType: string) {
    this.#mimeType = myMimeType;
  }

  get copy(): FileItem {
    return new FileItem(`${this.name} copy`, this.coordinates, this.mimeType, this.mimeType, this.source);
  }
}
