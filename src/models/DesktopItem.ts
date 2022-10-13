import Coordinates from "./Coordinates";

export default interface DesktopItem {
  path: string;
  coordinates: Coordinates;
  isSelected: boolean;
  icon?: string;
  applicationExtension?: string;
}
