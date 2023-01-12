import Coordinates from "./Coordinates";

export default interface ActionMenu {
  show: boolean;
  paths: string[];
  position: Coordinates;
  customLayout?: ActionItem[];
}

export interface ActionItem {
  icon?: string;
  materialIcon?: string;
  iconOnly?: boolean;
  groupName: string;
  horizontalGroup?: boolean;
  actionName: string;
  callback: Function;
  disabled: boolean;
  subActions?: ActionItem[];
}
