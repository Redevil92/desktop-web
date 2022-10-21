import Coordinates from "./Coordinates";

export default interface ActionMenu {
  show: boolean;
  paths: string[];
  position: Coordinates;
  isOpenedFolder: boolean;
}
