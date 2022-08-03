import Coordinates from "./Coordinates";
import Dimension from "./Dimension";

export default interface ItemDialog {
  name: string;
  isFocused: boolean;
  zIndex: number;
  guid: string;
  isCollapsed: boolean;
  position: Coordinates;
  dimension: Dimension;
  minDimension?: Dimension;
  icon?: string;
  mimeType: string;
  isFolder: boolean;
}

export interface FolderDialog extends ItemDialog {
  filesPath: string[];
}
