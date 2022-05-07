import Directory from "./Directory";

export default interface Item {
  name: string;
  parent: Directory | null;
}
