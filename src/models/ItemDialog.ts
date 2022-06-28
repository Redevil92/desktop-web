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
  icon?: string;
  mimeType: string;
}

export interface FolderDialog extends ItemDialog {
  files: File[];
}
