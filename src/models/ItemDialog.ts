import Coordinates from "./Coordinates";
import Dimension from "./Dimension";

export default interface ItemDialog {
  path: string;
  name: string;
  isFocused: boolean;
  zIndex: number;
  guid: string;
  isCollapsed: boolean;
  position: Coordinates;
  dimension: Dimension;
  isFolder: boolean;
  applicationToOpen?: string;
  icon?: string;
  isFullscreen?: boolean;
  minDimension?: Dimension;
  filesPath: string[];
  selectedFilesPath?: string[];
  additionalOptions?: any;
}
