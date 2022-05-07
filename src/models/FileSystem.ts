import Directory from "./Directory";

export default interface fileSystem {
  currentDirectory: Directory;
  currentDirectoryPath: Directory[];
}
