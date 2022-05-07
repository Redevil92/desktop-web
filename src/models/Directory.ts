import Item from "./Item";

export default interface Directory extends Item {
  type: string;
  children: Item[];
}

export const DIRECTORY_TYPE = {
  DEFAULT: "DEFAULT",
};
