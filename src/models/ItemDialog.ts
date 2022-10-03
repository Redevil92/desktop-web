import Coordinates from "./Coordinates";
import Dimension from "./Dimension";

export default interface ItemDialog {
  path: string;
  isFocused: boolean;
  zIndex: number;
  guid: string;
  isCollapsed: boolean;
  isFullscreen?: boolean;
  position: Coordinates;
  dimension: Dimension;
  minDimension?: Dimension;
  icon?: string;
  isFolder: boolean;
}

export interface FolderDialog extends ItemDialog {
  filesPath: string[];
}
