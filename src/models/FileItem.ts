import Item from "./Item";

export default interface FileItem extends Item {
  type: string;
  mimeType: string;
  source: any; // the browser file object
}
