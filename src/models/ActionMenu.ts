import Coordinates from "./Coordinates";

export default interface ActionMenu {
  show: boolean;
  paths: string[]; // TODO, SWITCH TO PATHS
  position: Coordinates;
  isOpenedFolder: boolean;
}
