import Coordinates from "../Coordinates";
import ActionItem from "./ActionItem";

export default interface ActionMenu {
  show: boolean;
  paths: string[];
  position: Coordinates;
  customLayout?: ActionItem[];
}
