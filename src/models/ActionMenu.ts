import Coordinates from "./Coordinates";

export default interface ActionMenu {
  show: boolean;
  paths: string[];
  position: Coordinates;
  isOpenedFolder: boolean;
  customLayout?: ActionItem[];
}

export interface ActionItem {
  icon: string;
  iconOnly: boolean;
  groupName: string;
  actionType: string;
  callback: Function;
  disabled: boolean;
}
