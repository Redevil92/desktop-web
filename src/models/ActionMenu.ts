import Coordinates from "./Coordinates";

export default interface ActionMenu {
  show: boolean;
  path: string;
  position: Coordinates;
  isOpenedFolder: boolean;
}
